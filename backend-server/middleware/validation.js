// Request Validation Middleware

/**
 * Validates payment request body
 */
function validatePaymentRequest(req, res, next) {
    const { amount, currency, userId, merchantName } = req.body;

    const errors = [];

    if (!amount || typeof amount !== 'number' || amount <= 0) {
        errors.push('Amount must be a positive number');
    }

    if (!currency || typeof currency !== 'string') {
        errors.push('Currency is required');
    }

    if (!userId || typeof userId !== 'string') {
        errors.push('User ID is required');
    }

    if (!merchantName || typeof merchantName !== 'string') {
        errors.push('Merchant name is required');
    }

    // Must have either cardToken or cardDetails
    if (!req.body.cardToken && !req.body.cardDetails) {
        errors.push('Either cardToken or cardDetails must be provided');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors,
            errorCode: 'VALIDATION_ERROR',
        });
    }

    next();
}

/**
 * Validates card details
 */
function validateCardDetails(req, res, next) {
    const { cardDetails } = req.body;

    if (!cardDetails) {
        return res.status(400).json({
            success: false,
            message: 'Card details are required',
            errorCode: 'MISSING_CARD_DETAILS',
        });
    }

    const { cardNumber, expiryMonth, expiryYear, cvv, cardholderName } = cardDetails;
    const errors = [];

    if (!cardNumber || typeof cardNumber !== 'string') {
        errors.push('Card number is required');
    }

    if (!expiryMonth || typeof expiryMonth !== 'string') {
        errors.push('Expiry month is required');
    }

    if (!expiryYear || typeof expiryYear !== 'string') {
        errors.push('Expiry year is required');
    }

    if (!cvv || typeof cvv !== 'string') {
        errors.push('CVV is required');
    }

    if (!cardholderName || typeof cardholderName !== 'string') {
        errors.push('Cardholder name is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Card validation failed',
            errors,
            errorCode: 'INVALID_CARD_DETAILS',
        });
    }

    next();
}

/**
 * Validates refund request
 */
function validateRefundRequest(req, res, next) {
    const { transactionId, reason } = req.body;

    const errors = [];

    if (!transactionId || typeof transactionId !== 'string') {
        errors.push('Transaction ID is required');
    }

    if (!reason || typeof reason !== 'string') {
        errors.push('Refund reason is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Refund validation failed',
            errors,
            errorCode: 'VALIDATION_ERROR',
        });
    }

    next();
}

module.exports = {
    validatePaymentRequest,
    validateCardDetails,
    validateRefundRequest,
};

