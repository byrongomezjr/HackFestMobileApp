// Fiserv Payment Service - Client Side
// This Card Payment Service handles communication between the React Native app and our backend server


import { Alert } from 'react-native';

// Configuration
const API_BASE_URL = __DEV__
    ? 'http://localhost:3000/api'  // Development
    : 'https://your-production-backend.com/api';  // Production

const APP_API_KEY = 'your_app_api_key_here';  // Get from backend team

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface CardDetails {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardholderName: string;
    billingAddress?: BillingAddress;
}

export interface BillingAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface SavedCard {
    id: string;
    token: string;
    last4: string;
    brand: string;  // 'visa', 'mastercard', 'amex', 'discover'
    expiryMonth: string;
    expiryYear: string;
    cardholderName: string;
    isDefault: boolean;
    createdAt: string;
}

export interface PaymentRequest {
    amount: number;
    currency: string;
    description: string;
    cardToken?: string;  // Use saved card
    cardDetails?: CardDetails;  // Use new card
    saveCard?: boolean;
    userId: string;
    merchantName: string;
    category: string;
}

export interface PaymentResponse {
    success: boolean;
    transactionId: string;
    amount: number;
    currency: string;
    status: 'completed' | 'pending' | 'failed' | 'declined';
    message: string;
    timestamp: string;
    cardLast4?: string;
    cardBrand?: string;
    authorizationCode?: string;
    errorCode?: string;
}

export interface RefundRequest {
    transactionId: string;
    amount?: number;  // Partial refund if specified
    reason: string;
}

export interface RefundResponse {
    success: boolean;
    refundId: string;
    originalTransactionId: string;
    amount: number;
    status: string;
    message: string;
}

export interface TokenizeCardResponse {
    success: boolean;
    token: string;
    card: SavedCard;
    message: string;
}

// ============================================================================
// API Helper Functions
// ============================================================================

/**
 * Makes an authenticated API request to the backend
 */
async function apiRequest(
    endpoint: string,
    method: string = 'GET',
    body?: any
): Promise<any> {
    try {
        const url = `${API_BASE_URL}${endpoint}`;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'X-App-API-Key': APP_API_KEY,
        };

        const options: RequestInit = {
            method,
            headers,
        };

        if (body && method !== 'GET') {
            options.body = JSON.stringify(body);
        }

        console.log(`[Fiserv Service] ${method} ${url}`);

        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return data;
    } catch (error: any) {
        console.error('[Fiserv Service] API Error:', error);
        throw new Error(error.message || 'Network request failed');
    }
}

/**
 * Validates card number using Luhn algorithm
 */
function validateCardNumber(cardNumber: string): boolean {
    // Remove spaces and non-digits
    const cleaned = cardNumber.replace(/\D/g, '');

    if (cleaned.length < 13 || cleaned.length > 19) {
        return false;
    }

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
}

/**
 * Gets card brand from card number
 */
function getCardBrand(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\D/g, '');

    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'discover';

    return 'unknown';
}

/**
 * Validates card expiry date
 */
function validateExpiry(month: string, year: string): boolean {
    const now = new Date();
    const currentYear = now.getFullYear() % 100;  // Last 2 digits
    const currentMonth = now.getMonth() + 1;

    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10);

    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;

    return true;
}

// ============================================================================
// Public API - Payment Operations
// ============================================================================

/**
 * Process a payment using Fiserv API
 */
export async function processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
        // Validate request
        if (request.amount <= 0) {
            throw new Error('Amount must be greater than zero');
        }

        if (!request.cardToken && !request.cardDetails) {
            throw new Error('Either cardToken or cardDetails must be provided');
        }

        // If using new card, validate details
        if (request.cardDetails) {
            const { cardNumber, expiryMonth, expiryYear, cvv } = request.cardDetails;

            if (!validateCardNumber(cardNumber)) {
                throw new Error('Invalid card number');
            }

            if (!validateExpiry(expiryMonth, expiryYear)) {
                throw new Error('Card has expired or invalid expiry date');
            }

            if (cvv.length < 3 || cvv.length > 4) {
                throw new Error('Invalid CVV');
            }
        }

        console.log('[Fiserv Service] Processing payment:', {
            amount: request.amount,
            currency: request.currency,
            merchant: request.merchantName,
        });

        // Make API request to backend
        const response = await apiRequest('/payments/charge', 'POST', request);

        console.log('[Fiserv Service] Payment response:', response);

        return response;
    } catch (error: any) {
        console.error('[Fiserv Service] Payment error:', error);
        return {
            success: false,
            transactionId: '',
            amount: request.amount,
            currency: request.currency,
            status: 'failed',
            message: error.message || 'Payment processing failed',
            timestamp: new Date().toISOString(),
            errorCode: 'PAYMENT_ERROR',
        };
    }
}

/**
 * Refund a transaction
 */
export async function refundPayment(request: RefundRequest): Promise<RefundResponse> {
    try {
        console.log('[Fiserv Service] Processing refund:', request);

        const response = await apiRequest('/payments/refund', 'POST', request);

        console.log('[Fiserv Service] Refund response:', response);

        return response;
    } catch (error: any) {
        console.error('[Fiserv Service] Refund error:', error);
        throw new Error(error.message || 'Refund processing failed');
    }
}

/**
 * Get transaction details
 */
export async function getTransaction(transactionId: string): Promise<any> {
    try {
        console.log('[Fiserv Service] Fetching transaction:', transactionId);

        const response = await apiRequest(`/payments/transaction/${transactionId}`, 'GET');

        return response;
    } catch (error: any) {
        console.error('[Fiserv Service] Get transaction error:', error);
        throw new Error(error.message || 'Failed to fetch transaction');
    }
}

// ============================================================================
// Public API - Card Management
// ============================================================================

/**
 * Tokenize and save a card for future use
 */
export async function tokenizeCard(
    cardDetails: CardDetails,
    userId: string
): Promise<TokenizeCardResponse> {
    try {
        // Validate card details
        if (!validateCardNumber(cardDetails.cardNumber)) {
            throw new Error('Invalid card number');
        }

        if (!validateExpiry(cardDetails.expiryMonth, cardDetails.expiryYear)) {
            throw new Error('Card has expired or invalid expiry date');
        }

        console.log('[Fiserv Service] Tokenizing card');

        const response = await apiRequest('/cards/tokenize', 'POST', {
            cardDetails,
            userId,
        });

        console.log('[Fiserv Service] Card tokenized successfully');

        return response;
    } catch (error: any) {
        console.error('[Fiserv Service] Tokenize error:', error);
        throw new Error(error.message || 'Failed to save card');
    }
}

/**
 * Get all saved cards for a user
 */
export async function getSavedCards(userId: string): Promise<SavedCard[]> {
    try {
        console.log('[Fiserv Service] Fetching saved cards for user:', userId);

        const response = await apiRequest(`/cards/list?userId=${userId}`, 'GET');

        return response.cards || [];
    } catch (error: any) {
        console.error('[Fiserv Service] Get cards error:', error);
        return [];
    }
}

/**
 * Delete a saved card
 */
export async function deleteSavedCard(cardId: string, userId: string): Promise<boolean> {
    try {
        console.log('[Fiserv Service] Deleting card:', cardId);

        await apiRequest(`/cards/${cardId}?userId=${userId}`, 'DELETE');

        console.log('[Fiserv Service] Card deleted successfully');

        return true;
    } catch (error: any) {
        console.error('[Fiserv Service] Delete card error:', error);
        throw new Error(error.message || 'Failed to delete card');
    }
}

/**
 * Set default card
 */
export async function setDefaultCard(cardId: string, userId: string): Promise<boolean> {
    try {
        console.log('[Fiserv Service] Setting default card:', cardId);

        await apiRequest('/cards/set-default', 'POST', { cardId, userId });

        console.log('[Fiserv Service] Default card updated');

        return true;
    } catch (error: any) {
        console.error('[Fiserv Service] Set default card error:', error);
        throw new Error(error.message || 'Failed to set default card');
    }
}

// ============================================================================
// Public API - Validation Utilities
// ============================================================================

/**
 * Validate card details before submission
 */
export function validateCardDetails(cardDetails: CardDetails): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    // Validate card number
    if (!validateCardNumber(cardDetails.cardNumber)) {
        errors.push('Invalid card number');
    }

    // Validate expiry
    if (!validateExpiry(cardDetails.expiryMonth, cardDetails.expiryYear)) {
        errors.push('Card has expired or invalid expiry date');
    }

    // Validate CVV
    if (!cardDetails.cvv || cardDetails.cvv.length < 3 || cardDetails.cvv.length > 4) {
        errors.push('Invalid CVV');
    }

    // Validate cardholder name
    if (!cardDetails.cardholderName || cardDetails.cardholderName.trim().length < 3) {
        errors.push('Cardholder name is required');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Format card number with spaces (for display)
 */
export function formatCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(' ');
}

/**
 * Mask card number (show only last 4 digits)
 */
export function maskCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\D/g, '');
    const last4 = cleaned.slice(-4);
    return `•••• •••• •••• ${last4}`;
}

/**
 * Get card brand for display
 */
export { getCardBrand };

// ============================================================================
// Mock Mode (for development without backend)
// ============================================================================

const MOCK_MODE = false;  // Set to true to use mock responses

/**
 * Mock payment processing (for testing UI without backend)
 */
export async function mockProcessPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success/failure based on card number
    const cardNumber = request.cardDetails?.cardNumber || '4005550000000019';
    const shouldFail = cardNumber.includes('220');  // Test decline card

    if (shouldFail) {
        return {
            success: false,
            transactionId: '',
            amount: request.amount,
            currency: request.currency,
            status: 'declined',
            message: 'Card declined by issuer',
            timestamp: new Date().toISOString(),
            errorCode: 'CARD_DECLINED',
        };
    }

    return {
        success: true,
        transactionId: `MOCK_${Date.now()}`,
        amount: request.amount,
        currency: request.currency,
        status: 'completed',
        message: 'Payment successful',
        timestamp: new Date().toISOString(),
        cardLast4: cardNumber.slice(-4),
        cardBrand: getCardBrand(cardNumber),
        authorizationCode: 'AUTH123456',
    };
}

export default {
    processPayment: MOCK_MODE ? mockProcessPayment : processPayment,
    refundPayment,
    getTransaction,
    tokenizeCard,
    getSavedCards,
    deleteSavedCard,
    setDefaultCard,
    validateCardDetails,
    formatCardNumber,
    maskCardNumber,
    getCardBrand,
};

