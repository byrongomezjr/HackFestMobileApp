import { Student, Wallet, Transaction, FraudAlert, SpendingInsight } from '../types';

export const mockStudent: Student = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@university.edu',
  studentId: 'STU-2024-1234',
  major: 'Computer Science',
  year: 'Junior',
  photoUrl: 'https://i.pravatar.cc/150?img=12',
};

export const mockWallets: Wallet[] = [
  {
    id: '1',
    type: 'dining',
    name: 'Dining Dollars',
    balance: 247.50,
    currency: '$',
    icon: 'restaurant',
    color: '#DC2626',  // Red
  },
  {
    id: '2',
    type: 'tickets',
    name: 'Event Tickets',
    balance: 3,
    currency: '',
    icon: 'ticket',
    color: '#F59E0B',  // Amber
  },
  {
    id: '3',
    type: 'laundry',
    name: 'Laundry Credits',
    balance: 8.00,
    currency: '$',
    icon: 'local-laundry-service',
    color: '#3B82F6',  // Blue
  },
  {
    id: '4',
    type: 'printing',
    name: 'Print Balance',
    balance: 15.25,
    currency: '$',
    icon: 'print',
    color: '#8B5CF6',  // Purple
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    walletType: 'Dining Dollars',
    merchant: 'Campus Café',
    amount: -12.50,
    date: '2024-11-15T10:30:00Z',
    status: 'completed',
    fraudScore: 0.05,
    category: 'Food & Dining',
    location: 'Student Union Building',
  },
  {
    id: '2',
    walletType: 'Dining Dollars',
    merchant: 'Library Starbucks',
    amount: -5.75,
    date: '2024-11-15T08:15:00Z',
    status: 'completed',
    fraudScore: 0.03,
    category: 'Food & Dining',
    location: 'Main Library',
  },
  {
    id: '3',
    walletType: 'Event Tickets',
    merchant: 'Basketball Game',
    amount: -1,
    date: '2024-11-14T18:00:00Z',
    status: 'completed',
    fraudScore: 0.01,
    category: 'Entertainment',
    location: 'Sports Arena',
  },
  {
    id: '4',
    walletType: 'Dining Dollars',
    merchant: 'Suspicious Vendor',
    amount: -150.00,
    date: '2024-11-14T23:45:00Z',
    status: 'blocked',
    fraudScore: 0.92,
    fraudReason: 'Unusual transaction amount and time. Transaction occurred outside normal hours.',
    category: 'Food & Dining',
    location: 'Off-Campus',
  },
  {
    id: '5',
    walletType: 'Laundry Credits',
    merchant: 'Dorm Laundry - Floor 3',
    amount: -2.00,
    date: '2024-11-13T14:20:00Z',
    status: 'completed',
    fraudScore: 0.02,
    category: 'Utilities',
    location: 'Residence Hall A',
  },
  {
    id: '6',
    walletType: 'Printing',
    merchant: 'Library Print Station',
    amount: -3.50,
    date: '2024-11-13T11:00:00Z',
    status: 'completed',
    fraudScore: 0.01,
    category: 'Academic',
    location: 'Main Library',
  },
  {
    id: '7',
    walletType: 'Dining Dollars',
    merchant: 'Pizza Place',
    amount: -18.99,
    date: '2024-11-12T19:30:00Z',
    status: 'completed',
    fraudScore: 0.08,
    category: 'Food & Dining',
    location: 'Food Court',
  },
  {
    id: '8',
    walletType: 'Dining Dollars',
    merchant: 'Account Reload',
    amount: 100.00,
    date: '2024-11-10T09:00:00Z',
    status: 'completed',
    fraudScore: 0.00,
    category: 'Deposit',
    location: 'Online',
  },
];

export const mockFraudAlerts: FraudAlert[] = [
  {
    id: '1',
    transactionId: '4',
    severity: 'high',
    reason: 'Unusual transaction amount ($150.00) at suspicious time (11:45 PM)',
    timestamp: new Date('2024-11-14T23:45:00Z'),
    resolved: false,
  },
];

export const mockSpendingInsights: SpendingInsight[] = [
  {
    category: 'Food & Dining',
    amount: 187.24,
    percentage: 68,
    trend: 'up',
  },
  {
    category: 'Entertainment',
    amount: 45.00,
    percentage: 16,
    trend: 'stable',
  },
  {
    category: 'Utilities',
    amount: 24.00,
    percentage: 9,
    trend: 'down',
  },
  {
    category: 'Academic',
    amount: 18.75,
    percentage: 7,
    trend: 'stable',
  },
];

