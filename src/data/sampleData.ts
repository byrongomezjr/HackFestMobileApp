// Sample data from CSV files - Integrated for HackFest 2025

export interface User {
    user_id: string;
    name: string;
    major: string;
    class_year: string;
    residence_type: string;
    interests: string[];
    email: string;
    student_id: string;
    photo_url: string;
    // Wallet balances
    dining_dollars: number;
    meal_plan: number;
    campus_card: number;
    // Admin flag
    isAdmin?: boolean;
}

export interface CampusEvent {
    event_id: string;
    name: string;
    category: string;
    location: string;
    start_time: string;
    tags: string[];
    cost: number;
}

export interface WalletTransaction {
    transaction_id: string;
    user_id: string;
    merchant: string;
    category: string;
    amount: number;
    payment_method: string;
    location: string;
    date: string;
    status: 'completed' | 'pending' | 'blocked';
    fraud_score?: number;
}

// Current logged-in user (U001 - Alex Rivera)
export const currentUser: User = {
    user_id: 'U001',
    name: 'Alex Rivera',
    major: 'Computer Science',
    class_year: '2027',
    residence_type: 'Dorm',
    interests: ['tech', 'gaming', 'clubs'],
    email: 'alex.rivera@rutgers.edu',
    student_id: 'STU-2027-001',
    photo_url: 'https://i.pravatar.cc/150?img=12',
    dining_dollars: 247.50,
    meal_plan: 450.00,
    campus_card: 125.75,
};

// All users from CSV
export const allUsers: User[] = [
    currentUser,
    {
        user_id: 'U002',
        name: 'Maya Patel',
        major: 'Finance',
        class_year: '2026',
        residence_type: 'Commuter',
        interests: ['finance', 'career', 'networking'],
        email: 'maya.patel@rutgers.edu',
        student_id: 'STU-2026-002',
        photo_url: 'https://i.pravatar.cc/150?img=45',
        dining_dollars: 180.00,
        meal_plan: 0,
        campus_card: 95.50,
    },
    {
        user_id: 'ADMIN001',
        name: 'Admin User',
        major: 'Administration',
        class_year: 'Staff',
        residence_type: 'Staff',
        interests: ['admin', 'management'],
        email: 'admin@rutgers.edu',
        student_id: 'ADMIN-001',
        photo_url: 'https://i.pravatar.cc/150?img=68',
        dining_dollars: 0,
        meal_plan: 0,
        campus_card: 0,
        isAdmin: true,
    },
];

// Campus events from CSV
export const campusEvents: CampusEvent[] = [
    {
        event_id: 'E001',
        name: 'Tech and Innovation Mixer',
        category: 'Tech',
        location: 'Business School Atrium',
        start_time: '2025-11-05 17:00',
        tags: ['tech', 'networking'],
        cost: 0,
    },
    {
        event_id: 'E002',
        name: 'Career Networking Night',
        category: 'Career',
        location: 'Campus Center',
        start_time: '2025-11-06 18:00',
        tags: ['career', 'networking'],
        cost: 0,
    },
    {
        event_id: 'E003',
        name: 'Financial Wellness Workshop',
        category: 'Finance',
        location: 'Innovation Hub',
        start_time: '2025-11-07 16:00',
        tags: ['finance', 'wellness'],
        cost: 0,
    },
    {
        event_id: 'E004',
        name: 'HackFest Info Session',
        category: 'Tech',
        location: 'Innovation Hub',
        start_time: '2025-11-01 15:00',
        tags: ['hackathon', 'ai'],
        cost: 0,
    },
    {
        event_id: 'E006',
        name: 'Esports Tournament',
        category: 'Sports',
        location: 'Rec Center',
        start_time: '2025-11-09 19:00',
        tags: ['gaming', 'competition'],
        cost: 5,
    },
    {
        event_id: 'E007',
        name: 'Yoga and Mindfulness',
        category: 'Wellness',
        location: 'Rec Center',
        start_time: '2025-11-03 08:00',
        tags: ['wellness', 'health'],
        cost: 0,
    },
    {
        event_id: 'E009',
        name: 'Women in Tech Panel',
        category: 'Tech',
        location: 'Business School Atrium',
        start_time: '2025-11-04 17:30',
        tags: ['tech', 'diversity'],
        cost: 0,
    },
    {
        event_id: 'E015',
        name: 'Data Science Club Meetup',
        category: 'Tech',
        location: 'Innovation Hub',
        start_time: '2025-11-07 18:00',
        tags: ['data', 'ai'],
        cost: 0,
    },
];

// Wallet transactions from CSV (filtered for current user)
export const walletTransactions: WalletTransaction[] = [
    {
        transaction_id: 'T0001',
        user_id: 'U001',
        merchant: 'Starbucks',
        category: 'Dining',
        amount: -5.75,
        payment_method: 'Dining Dollars',
        location: 'Campus Center',
        date: '2025-10-01',
        status: 'completed',
        fraud_score: 0.02,
    },
    {
        transaction_id: 'T0002',
        user_id: 'U001',
        merchant: 'Campus Dining Hall',
        category: 'Dining',
        amount: -9.25,
        payment_method: 'Meal Plan',
        location: 'Dining Hall',
        date: '2025-10-02',
        status: 'completed',
        fraud_score: 0.01,
    },
    {
        transaction_id: 'T0003',
        user_id: 'U001',
        merchant: 'Bookstore',
        category: 'Books',
        amount: -42.50,
        payment_method: 'Campus Card',
        location: 'Bookstore',
        date: '2025-10-03',
        status: 'completed',
        fraud_score: 0.05,
    },
    {
        transaction_id: 'T0031',
        user_id: 'U001',
        merchant: 'Uber / Transit',
        category: 'Transport',
        amount: -17.30,
        payment_method: 'Credit Card',
        location: 'Off-Campus',
        date: '2025-10-09',
        status: 'completed',
        fraud_score: 0.08,
    },
    {
        transaction_id: 'T0100',
        user_id: 'U001',
        merchant: 'Unknown Vendor',
        category: 'Dining',
        amount: -150.00,
        payment_method: 'Dining Dollars',
        location: 'Off-Campus (Suspicious)',
        date: '2025-10-15',
        status: 'blocked',
        fraud_score: 0.95,
    },
    {
        transaction_id: 'T0101',
        user_id: 'U001',
        merchant: 'Campus Café',
        category: 'Dining',
        amount: -12.50,
        payment_method: 'Dining Dollars',
        location: 'Student Union Building',
        date: '2025-11-15',
        status: 'completed',
        fraud_score: 0.03,
    },
    {
        transaction_id: 'T0102',
        user_id: 'U001',
        merchant: 'Library Starbucks',
        category: 'Dining',
        amount: -5.75,
        payment_method: 'Dining Dollars',
        location: 'Main Library',
        date: '2025-11-15',
        status: 'completed',
        fraud_score: 0.02,
    },
    {
        transaction_id: 'T0103',
        user_id: 'U001',
        merchant: 'Account Reload',
        category: 'Deposit',
        amount: 100.00,
        payment_method: 'Online Transfer',
        location: 'Online',
        date: '2025-11-10',
        status: 'completed',
        fraud_score: 0.00,
    },
    {
        transaction_id: 'T0104',
        user_id: 'U001',
        merchant: 'Suspicious Store XYZ',
        category: 'Shopping',
        amount: -85.50,
        payment_method: 'Campus Card',
        location: 'Unknown Location',
        date: '2025-11-14',
        status: 'blocked',
        fraud_score: 0.89,
    },
    {
        transaction_id: 'T0105',
        user_id: 'U001',
        merchant: 'Offshore Payment',
        category: 'Other',
        amount: -200.00,
        payment_method: 'Dining Dollars',
        location: 'International',
        date: '2025-11-13',
        status: 'blocked',
        fraud_score: 0.98,
    },
];

// Get recommended events based on user interests
export const getRecommendedEvents = (user: User): CampusEvent[] => {
    return campusEvents.filter(event =>
        event.tags.some(tag => user.interests.includes(tag))
    );
};

// Get user transactions
export const getUserTransactions = (userId: string): WalletTransaction[] => {
    return walletTransactions.filter(t => t.user_id === userId);
};

// Calculate total spent
export const getTotalSpent = (userId: string): number => {
    return getUserTransactions(userId)
        .filter(t => t.amount < 0 && t.status === 'completed')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
};

// Get spending by category
export const getSpendingByCategory = (userId: string) => {
    const transactions = getUserTransactions(userId).filter(t => t.amount < 0 && t.status === 'completed');
    const categoryTotals: { [key: string]: number } = {};

    transactions.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        amount,
        percentage: Math.round((amount / getTotalSpent(userId)) * 100),
    }));
};

