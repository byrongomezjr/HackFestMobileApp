import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  User, 
  WalletTransaction, 
  CampusEvent,
  currentUser as initialUser,
  walletTransactions as initialTransactions,
  campusEvents,
  getRecommendedEvents,
  getUserTransactions,
} from '../data/sampleData';
import { WalletCard, FiservCard, fiservCardToWalletCard } from '../types/fiservCard';
import { useAuth } from './AuthContext';

interface DataContextType {
  // User data
  currentUser: User;
  updateUser: (updates: Partial<User>) => void;
  
  // Transactions
  transactions: WalletTransaction[];
  userTransactions: WalletTransaction[];  // User-specific transactions
  addTransaction: (transaction: Omit<WalletTransaction, 'transaction_id' | 'user_id' | 'date' | 'status'>) => void;
  
  // Events
  events: CampusEvent[];
  recommendedEvents: CampusEvent[];
  upcomingEvents: CampusEvent[];  // Upcoming events only
  
  // Wallet operations
  addFunds: (walletType: 'dining_dollars' | 'meal_plan' | 'campus_card', amount: number) => void;
  deductFunds: (walletType: 'dining_dollars' | 'meal_plan' | 'campus_card', amount: number, merchantName?: string) => boolean;
  
  // Card management (Fiserv)
  cards: WalletCard[];
  addCard: (fiservCard: FiservCard, initialBalance: number) => WalletCard;
  removeCard: (cardId: string) => void;
  setDefaultCard: (cardId: string) => void;
  loadCardBalance: (cardId: string, amount: number) => void;
  deductFromCard: (cardId: string, amount: number, merchantName: string) => boolean;
  
  // Analytics
  totalSpent: number;
  spendingByCategory: Array<{ category: string; amount: number; percentage: number }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Sample Fiserv card for testing
const sampleFiservCard: FiservCard = {
  PartyCardRelInfo: [
    {
      PartyRef: {
        PartyKeys: {
          PartyIdentType: 'StudentID',
          PartyIdent: 'STU-2027-001',
        },
      },
      PartyCardRelType: 'Primary',
    },
  ],
  CardInfo: {
    CardNum: '4111111111111111',
    CardType: 'Debit',
    ProductIdent: 'CAMPUS_CARD',
    InstantIssuedInd: true,
    ExpDt: '12/25',
    CardCategory: 'Student',
    EmbossingName: 'ALEX RIVERA',
    Nickname: 'Campus Visa Card',
    PostAddr: [
      {
        Addr1: '123 College Ave',
        City: 'New Brunswick',
        StateProv: 'NJ',
        PostalCode: '08901',
        Country: 'USA',
        AddrType: 'Home',
      },
    ],
    CardTrnLimit: [
      {
        TrnTypeValue: 'Purchase',
        TrnSrc: 'POS',
        CurAmt: {
          Amt: 1000,
          CurCode: {
            CurCodeType: 'ISO',
            CurCodeValue: 'USD',
          },
        },
      },
    ],
  },
};

// Convert sample card to WalletCard format
const initialCard = fiservCardToWalletCard(sampleFiservCard, 250.00);
initialCard.isDefault = true;

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  // Use authenticated user from AuthContext, fallback to initialUser if not authenticated
  const currentUser = auth.user || initialUser;
  
  const [transactions, setTransactions] = useState<WalletTransaction[]>(initialTransactions);
  const [events] = useState<CampusEvent[]>(campusEvents);
  const [cards, setCards] = useState<WalletCard[]>([initialCard]);

  // Update user data (note: in production, this would sync to backend)
  const updateUser = (updates: Partial<User>) => {
    // For now, we'll just log this. In production, you'd update the backend
    // and the AuthContext would handle refreshing the user data
    console.log('User update requested:', updates);
  };

  // Add new transaction
  const addTransaction = (transaction: Omit<WalletTransaction, 'transaction_id' | 'user_id' | 'date' | 'status'>) => {
    const newTransaction: WalletTransaction = {
      ...transaction,
      transaction_id: `T${Date.now()}`,
      user_id: currentUser.user_id,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  };

  // Add funds to wallet
  const addFunds = (walletType: 'dining_dollars' | 'meal_plan' | 'campus_card', amount: number) => {
    setCurrentUser(prev => ({
      ...prev,
      [walletType]: prev[walletType] + amount,
    }));

    // Add transaction record
    addTransaction({
      merchant: 'Account Reload',
      category: 'Deposit',
      amount: amount,
      payment_method: walletType === 'dining_dollars' ? 'Dining Dollars' : 
                      walletType === 'meal_plan' ? 'Meal Plan' : 'Campus Card',
      location: 'Online',
      fraud_score: 0,
    });
  };

  // Deduct funds from wallet
  const deductFunds = (walletType: 'dining_dollars' | 'meal_plan' | 'campus_card', amount: number, merchantName?: string): boolean => {
    if (currentUser[walletType] >= amount) {
      setCurrentUser(prev => ({
        ...prev,
        [walletType]: prev[walletType] - amount,
      }));

      // Add transaction record for the payment
      addTransaction({
        merchant: merchantName || 'Quick Payment',
        category: 'Food', // Default category
        amount: amount,
        payment_method: walletType === 'dining_dollars' ? 'Dining Dollars' : 
                        walletType === 'meal_plan' ? 'Meal Plan' : 'Campus Card',
        location: 'Campus',
        fraud_score: 0,
      });

      return true;
    }
    return false; // Insufficient funds
  };

  // Card Management Functions

  // Add a new card to wallet
  const addCard = (fiservCard: FiservCard, initialBalance: number = 0): WalletCard => {
    const newCard = fiservCardToWalletCard(fiservCard, initialBalance);
    
    // If this is the first card, make it default
    if (cards.length === 0) {
      newCard.isDefault = true;
    }
    
    setCards(prev => [...prev, newCard]);
    return newCard;
  };

  // Remove a card from wallet
  const removeCard = (cardId: string) => {
    setCards(prev => {
      const filtered = prev.filter(card => card.id !== cardId);
      
      // If we removed the default card and there are other cards, make the first one default
      const hadDefault = prev.find(c => c.id === cardId && c.isDefault);
      if (hadDefault && filtered.length > 0) {
        filtered[0].isDefault = true;
      }
      
      return filtered;
    });
  };

  // Set a card as default
  const setDefaultCard = (cardId: string) => {
    setCards(prev => prev.map(card => ({
      ...card,
      isDefault: card.id === cardId,
    })));
  };

  // Load/Add balance to a card
  const loadCardBalance = (cardId: string, amount: number) => {
    setCards(prev => prev.map(card => {
      if (card.id === cardId) {
        return { ...card, balance: card.balance + amount };
      }
      return card;
    }));

    // Record transaction
    const card = cards.find(c => c.id === cardId);
    if (card) {
      addTransaction({
        merchant: 'Card Balance Reload',
        category: 'Deposit',
        amount: amount,
        payment_method: `${card.cardBrand} ${card.last4}`,
        location: 'Online',
        fraud_score: 0,
      });
    }
  };

  // Deduct funds from a card
  const deductFromCard = (cardId: string, amount: number, merchantName: string): boolean => {
    const card = cards.find(c => c.id === cardId);
    
    if (!card) {
      return false; // Card not found
    }
    
    if (card.balance < amount) {
      return false; // Insufficient balance
    }

    // Deduct from card balance
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        return { ...c, balance: c.balance - amount };
      }
      return c;
    }));

    // Record transaction
    addTransaction({
      merchant: merchantName,
      category: 'Food', // Default category
      amount: amount,
      payment_method: `${card.cardBrand} ${card.last4}`,
      location: 'Campus',
      fraud_score: 0,
    });

    return true;
  };

  // Get user-specific transactions (combine static CSV data with dynamic new transactions)
  const staticTransactions = getUserTransactions(currentUser.user_id);
  const userTransactions = [...transactions, ...staticTransactions].filter(
    t => t.user_id === currentUser.user_id
  );
  
  // Get recommended events based on user interests
  const recommendedEvents = getRecommendedEvents(currentUser);

  // Get upcoming events (future events only)
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.start_time);
    const today = new Date();
    return eventDate >= today;
  });

  // Calculate analytics (include both static and dynamic transactions)
  const allUserTransactions = userTransactions;
  const totalSpent = allUserTransactions
    .filter(t => t.status === 'completed' && t.category !== 'Deposit')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const spendingByCategory = (() => {
    const categoryTotals: { [key: string]: number } = {};
    allUserTransactions
      .filter(t => t.status === 'completed' && t.category !== 'Deposit')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
      });
    
    const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
    
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  })();

  return (
    <DataContext.Provider
      value={{
        currentUser,
        updateUser,
        transactions,
        userTransactions,
        addTransaction,
        events,
        recommendedEvents,
        upcomingEvents,
        addFunds,
        deductFunds,
        cards,
        addCard,
        removeCard,
        setDefaultCard,
        loadCardBalance,
        deductFromCard,
        totalSpent,
        spendingByCategory,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

