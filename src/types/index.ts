export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  major: string;
  year: string;
  photoUrl: string;
}

export interface Wallet {
  id: string;
  type: 'dining' | 'tickets' | 'laundry' | 'printing';
  name: string;
  balance: number;
  currency: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  walletType: string;
  merchant: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'blocked';
  fraudScore?: number;
  fraudReason?: string;
  category: string;
  location?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
}

export interface FraudAlert {
  id: string;
  transactionId: string;
  severity: 'low' | 'medium' | 'high';
  reason: string;
  timestamp: Date;
  resolved: boolean;
}

export interface SpendingInsight {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

