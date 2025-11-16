import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../context/DataContext';

interface TransactionDisplay {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'blocked';
  walletType: string;
  location?: string;
  fraudScore?: number;
  isRecurring?: boolean;
}

interface FraudAlert {
  id: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  transactionId: string;
}

const TransactionsScreen = () => {
  const navigation = useNavigation();
  const { userTransactions, currentUser, totalSpent } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'blocked'>('all');
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Convert real transactions to display format
  const transactions = useMemo<TransactionDisplay[]>(() => {
    return userTransactions.map((t, index) => ({
      id: `${t.transaction_id}-${index}-${t.date}`,
      merchant: t.merchant,
      category: t.category,
      amount: Math.abs(t.amount), // Display as positive
      currency: '$',
      date: t.date,
      status: t.status === 'blocked' ? 'blocked' : 
              t.status === 'completed' ? 'completed' : 'pending',
      walletType: t.payment_method,
      location: t.location,
      fraudScore: t.fraud_score,
      isRecurring: false, // Can be enhanced later
    }));
  }, [userTransactions]);

  // Generate fraud alerts from flagged transactions (excluding dismissed ones)
  const fraudAlerts = useMemo<FraudAlert[]>(() => {
    return userTransactions
      .filter(t => t.status === 'blocked' || (t.fraud_score && t.fraud_score > 0.7))
      .map((t, index): FraudAlert => ({
        id: `alert-${t.transaction_id}-${index}-${t.date}`,
        message: `Suspicious transaction at ${t.merchant} for $${Math.abs(t.amount).toFixed(2)}`,
        severity: (t.fraud_score && t.fraud_score > 0.7) ? 'high' : 'medium' as 'high' | 'medium',
        transactionId: t.transaction_id,
      }))
      .filter(alert => !dismissedAlerts.has(alert.id));
  }, [userTransactions, dismissedAlerts]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      (transaction.merchant?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (transaction.category?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || transaction.status === filter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getFraudScoreColor = (score?: number) => {
    if (!score) return '#10B981';
    if (score < 0.3) return '#10B981';
    if (score < 0.7) return '#F59E0B';
    return '#EF4444';
  };

  const getFraudScoreLabel = (score?: number) => {
    if (!score) return 'Safe';
    if (score < 0.3) return 'Low Risk';
    if (score < 0.7) return 'Medium Risk';
    return 'High Risk';
  };

  const handleReviewTransaction = (alertId: string, _transactionId: string) => {
    // Dismiss the alert
    setDismissedAlerts(prev => new Set(prev).add(alertId));
    
    // Switch to Blocked filter to show the transaction details
    setFilter('blocked');
    
    Alert.alert(
      'Transaction Review',
      'This transaction has been flagged as suspicious. Review the details in the Blocked tab.',
      [{ text: 'OK' }]
    );
  };

  const handleApproveTransaction = (alertId: string, _transactionId: string) => {
    Alert.alert(
      'Approve Transaction',
      'Are you sure you want to approve this transaction? It will be marked as safe.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            // Dismiss the alert
            setDismissedAlerts(prev => new Set(prev).add(alertId));
            
            Alert.alert('Approved', 'Transaction has been approved and moved to completed.');
            // In a real app, you would update the transaction status here
          },
        },
      ]
    );
  };

  const renderFraudAlert = (alert: FraudAlert) => (
    <View style={styles.fraudAlert}>
      <View style={styles.fraudAlertHeader}>
        <Icon name="warning" size={24} color="#EF4444" />
        <View style={styles.fraudAlertText}>
          <Text style={styles.fraudAlertTitle}>Suspicious Activity Blocked</Text>
          <Text style={styles.fraudAlertReason}>{alert.message}</Text>
        </View>
      </View>
      <View style={styles.fraudAlertActions}>
        <TouchableOpacity 
          style={styles.fraudAlertButton}
          onPress={() => handleReviewTransaction(alert.id, alert.transactionId)}
        >
          <Text style={styles.fraudAlertButtonText}>Review</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.fraudAlertButton, styles.fraudAlertButtonApprove]}
          onPress={() => handleApproveTransaction(alert.id, alert.transactionId)}
        >
          <Text style={[styles.fraudAlertButtonText, styles.fraudAlertButtonTextApprove]}>
            Approve
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTransaction = (transaction: TransactionDisplay) => {
    const isPositive = transaction.amount > 0;
    const fraudColor = getFraudScoreColor(transaction.fraudScore);

    return (
      <TouchableOpacity key={transaction.id} style={styles.transactionCard}>
        <View style={styles.transactionMain}>
          <View style={[styles.merchantIcon, { backgroundColor: fraudColor + '20' }]}>
            <Icon 
              name={transaction.category === 'Deposit' ? 'add-circle' : 'store'} 
              size={24} 
              color={fraudColor} 
            />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.merchantName}>{transaction.merchant}</Text>
            <View style={styles.transactionMeta}>
              <Text style={styles.metaText}>{transaction.walletType}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>{formatDate(transaction.date)}</Text>
              {transaction.location && (
                <>
                  <Text style={styles.metaDot}>•</Text>
                  <Icon name="location-on" size={12} color="#9CA3AF" />
                  <Text style={styles.metaText}>{transaction.location}</Text>
                </>
              )}
            </View>
          </View>
          <View style={styles.transactionAmount}>
            <Text style={[styles.amount, { color: isPositive ? '#10B981' : '#111827' }]}>
              {`${isPositive ? '+' : ''}${transaction.currency}${transaction.amount.toFixed(2)}`}
            </Text>
            {transaction.fraudScore !== undefined && transaction.fraudScore > 0 && (
              <View style={[styles.fraudBadge, { backgroundColor: fraudColor }]}>
                <Text style={styles.fraudBadgeText}>
                  {getFraudScoreLabel(transaction.fraudScore)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {transaction.status === 'blocked' && (
          <View style={styles.blockedBanner}>
            <Icon name="block" size={16} color="#EF4444" />
            <Text style={styles.blockedText}>Transaction blocked by fraud detection</Text>
          </View>
        )}

        {transaction.fraudScore && transaction.fraudScore > 0.5 && transaction.status !== 'blocked' && (
          <View style={styles.warningBanner}>
            <Icon name="info" size={16} color="#F59E0B" />
            <Text style={styles.warningText}>
              AI detected unusual pattern. Score: {(transaction.fraudScore * 100).toFixed(0)}%
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Activity</Text>
          <Text style={styles.headerSubtitle}>{filteredTransactions.length} transactions</Text>
        </View>
        <TouchableOpacity style={styles.exportButton}>
          <Icon name="file-download" size={24} color="#DC2626" />
        </TouchableOpacity>
      </View>

      {/* Fraud Alerts */}
      {fraudAlerts.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.alertsContainer}
        >
          {fraudAlerts.map((alert) => (
            <React.Fragment key={alert.id}>
              {renderFraudAlert(alert)}
            </React.Fragment>
          ))}
        </ScrollView>
      )}

      {/* Quick Stats Bar */}
      <View style={styles.quickStatsBar}>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatValue}>${totalSpent.toFixed(0)}</Text>
          <Text style={styles.quickStatLabel}>Spent</Text>
        </View>
        <View style={styles.quickStatDivider} />
        <View style={styles.quickStat}>
          <Text style={styles.quickStatValue}>{transactions.filter(t => t.status === 'completed').length}</Text>
          <Text style={styles.quickStatLabel}>Completed</Text>
        </View>
        <View style={styles.quickStatDivider} />
        <View style={styles.quickStat}>
          <Text style={[styles.quickStatValue, { color: '#EF4444' }]}>
            {transactions.filter(t => t.status === 'blocked' || (t.fraudScore && t.fraudScore > 0.7)).length}
          </Text>
          <Text style={styles.quickStatLabel}>Blocked</Text>
        </View>
        <View style={styles.quickStatDivider} />
        <TouchableOpacity 
          style={styles.quickStat}
          onPress={() => navigation.navigate('Wallet' as never)}
        >
          <Text style={[styles.quickStatValue, { color: '#DC2626' }]}>
            ${(currentUser.dining_dollars + currentUser.meal_plan + currentUser.campus_card).toFixed(0)}
          </Text>
          <Text style={styles.quickStatLabel}>Balance</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Compact Filter Chips */}
      <View style={styles.filtersRow}>
        {(['all', 'completed', 'pending', 'blocked'] as const).map((filterOption) => (
          <TouchableOpacity
            key={filterOption}
            style={[
              styles.filterChipCompact,
              filter === filterOption && styles.filterChipCompactActive,
            ]}
            onPress={() => setFilter(filterOption)}
          >
            <Text
              style={[
                styles.filterChipCompactText,
                filter === filterOption && styles.filterChipCompactTextActive,
              ]}
            >
              {filterOption === 'all' ? 'All' : filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Activity Section */}
      <View style={styles.recentActivityHeader}>
        <View>
          <Text style={styles.recentActivityTitle}>Recent Activity</Text>
          <Text style={styles.recentActivitySubtitle}>
            {filter !== 'all' ? `Showing ${filter} transactions` : 'All your transactions'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Chat' as never)}>
          <Icon name="chat-bubble-outline" size={24} color="#DC2626" />
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <ScrollView style={styles.transactionsList} showsVerticalScrollIndicator={false}>
        {filteredTransactions.length > 0 ? (
          <>
            {filteredTransactions.map(renderTransaction)}
            <View style={styles.bottomPadding} />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Icon name="receipt-long" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No transactions found</Text>
            <Text style={styles.emptyStateText}>
              {filter !== 'all' 
                ? `You don't have any ${filter} transactions yet.`
                : 'Start making purchases to see your activity here.'
              }
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => navigation.navigate('Wallet' as never)}
            >
              <Text style={styles.emptyStateButtonText}>Go to Wallet</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  exportButton: {
    padding: 8,
  },
  quickStatsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 11,
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  alertsContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  fraudAlert: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 300,
  },
  fraudAlertHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  fraudAlertText: {
    flex: 1,
    marginLeft: 12,
  },
  fraudAlertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 4,
  },
  fraudAlertReason: {
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 16,
  },
  fraudAlertActions: {
    flexDirection: 'row',
    gap: 8,
  },
  fraudAlertButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  fraudAlertButtonApprove: {
    backgroundColor: '#EF4444',
  },
  fraudAlertButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  fraudAlertButtonTextApprove: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterChipCompact: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipCompactActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  filterChipCompactText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterChipCompactTextActive: {
    color: '#FFFFFF',
  },
  recentActivityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  recentActivityTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  recentActivitySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  transactionsList: {
    flex: 1,
    marginTop: 16,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  transactionsCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  merchantIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  metaDot: {
    fontSize: 12,
    color: '#9CA3AF',
    marginHorizontal: 4,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  fraudBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  fraudBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  blockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
  },
  blockedText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: '#991B1B',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
  },
  warningText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: '#92400E',
  },
  bottomPadding: {
    height: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default TransactionsScreen;

