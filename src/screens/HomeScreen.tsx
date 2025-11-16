import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../context/DataContext';

interface WalletDisplay {
  id: string;
  type: string;
  name: string;
  balance: number;
  currency: string;
  icon: string;
  color: string;
}

const HomeScreen = () => {
  const navigation = useNavigation();
  const { currentUser, addFunds, deductFunds, spendingByCategory, totalSpent, cards } = useData();
  
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [addFundsModalVisible, setAddFundsModalVisible] = useState(false);
  const [insightsModalVisible, setInsightsModalVisible] = useState(false);
  const [qrScanModalVisible, setQrScanModalVisible] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletDisplay | null>(null);
  const [amount, setAmount] = useState('');
  const [merchantName, setMerchantName] = useState('');

  // Convert real user data to wallet display format
  const wallets: WalletDisplay[] = useMemo(() => [
    {
      id: '1',
      type: 'dining_dollars',
      name: 'Dining Dollars',
      balance: currentUser.dining_dollars,
      currency: '$',
      icon: 'restaurant',
      color: '#DC2626',
    },
    {
      id: '2',
      type: 'meal_plan',
      name: 'Meal Plan',
      balance: currentUser.meal_plan,
      currency: '$',
      icon: 'fastfood',
      color: '#F59E0B',
    },
    {
      id: '3',
      type: 'campus_card',
      name: 'Campus Card',
      balance: currentUser.campus_card,
      currency: '$',
      icon: 'credit-card',
      color: '#3B82F6',
    },
  ], [currentUser]);

  const handleQuickPay = (wallet: WalletDisplay) => {
    setSelectedWallet(wallet);
    setAmount('');
    setMerchantName('');
    setPaymentModalVisible(true);
  };

  const handleAddFunds = (wallet: WalletDisplay) => {
    setSelectedWallet(wallet);
    setAddFundsModalVisible(true);
  };

  const confirmPayment = () => {
    if (amount && selectedWallet) {
      const amountNum = parseFloat(amount);
      const walletType = selectedWallet.type as 'dining_dollars' | 'meal_plan' | 'campus_card';
      const merchant = merchantName.trim() || 'Quick Payment';
      
      const success = deductFunds(walletType, amountNum, merchant);
      
      if (success) {
        Alert.alert(
          'Payment Sent',
          `${selectedWallet.currency}${amount} sent to ${merchant}!`,
          [{ text: 'OK', onPress: () => {
            setPaymentModalVisible(false);
            setAmount('');
            setMerchantName('');
            // Navigate to Activity tab to show the new transaction
            setTimeout(() => {
              navigation.navigate('Transactions' as never);
            }, 500);
          }}]
        );
      } else {
        Alert.alert(
          'Insufficient Funds',
          `You don't have enough balance in your ${selectedWallet.name}.`,
          [{ text: 'OK' }]
        );
      }
    }
  };

  const confirmAddFunds = () => {
    if (amount && selectedWallet) {
      const amountNum = parseFloat(amount);
      const walletType = selectedWallet.type as 'dining_dollars' | 'meal_plan' | 'campus_card';
      
      addFunds(walletType, amountNum);
      
      Alert.alert(
        'Funds Added',
        `${selectedWallet.currency}${amount} added to your ${selectedWallet.name}!`,
        [{ text: 'OK', onPress: () => {
          setAddFundsModalVisible(false);
          setAmount('');
        }}]
      );
    }
  };

  // Quick Action Handlers
  const handleScanQR = () => {
    setQrScanModalVisible(true);
  };

  const handleViewHistory = () => {
    navigation.navigate('Transactions' as never);
  };

  const handleSettings = () => {
    navigation.navigate('Profile' as never);
  };

  const handleViewCards = () => {
    (navigation as any).navigate('Cards');
  };

  const handleSeeAllInsights = () => {
    setInsightsModalVisible(true);
  };

  const renderWalletCard = (wallet: WalletDisplay) => (
    <View key={wallet.id} style={[styles.walletCard, { borderLeftColor: wallet.color }]}>
      <View style={styles.walletHeader}>
        <View style={[styles.iconContainer, { backgroundColor: wallet.color + '20' }]}>
          <Icon name={wallet.icon} size={24} color={wallet.color} />
        </View>
        <View style={styles.walletInfo}>
          <Text style={styles.walletName}>{wallet.name}</Text>
          <Text style={styles.walletBalance}>
            {wallet.currency}{wallet.type === 'tickets' ? '' : wallet.balance.toFixed(2)}
            {wallet.type === 'tickets' && ` ${wallet.balance} tickets`}
          </Text>
        </View>
      </View>
      <View style={styles.walletActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleQuickPay(wallet)}
        >
          <Icon name="send" size={18} color="#DC2626" />
          <Text style={styles.actionButtonText}>Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleAddFunds(wallet)}
        >
          <Icon name="add-circle" size={18} color="#10B981" />
          <Text style={styles.actionButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderInsightCard = (insight: { category: string; amount: number; percentage: number }) => (
    <View key={insight.category} style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <Text style={styles.insightCategory}>{insight.category}</Text>
      </View>
      <Text style={styles.insightAmount}>${insight.amount.toFixed(2)}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${insight.percentage}%`, backgroundColor: '#DC2626' }]} />
      </View>
      <Text style={styles.insightPercentage}>{insight.percentage}% of spending</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{currentUser.name}</Text>
          </View>
        </View>

        {/* Total Balance Card */}
        <View style={styles.totalBalanceCard}>
          <Text style={styles.totalBalanceLabel}>Total Balance</Text>
          <Text style={styles.totalBalanceAmount}>
            ${wallets.filter(w => w.type !== 'tickets').reduce((sum, w) => sum + w.balance, 0).toFixed(2)}
          </Text>
          <Text style={styles.totalBalanceSubtext}>Across all wallets</Text>
        </View>

        {/* Fiserv Cards Section */}
        {cards.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Cards</Text>
              <TouchableOpacity onPress={handleViewCards}>
                <Text style={styles.seeAllText}>View All ({cards.length})</Text>
              </TouchableOpacity>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsScrollContainer}
            >
              {cards.slice(0, 3).map((card) => (
                <View key={card.id} style={styles.cardDisplay}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardBrandRow}>
                      <Icon name="credit-card" size={20} color="#FFFFFF" />
                      <Text style={styles.cardBrandText}>{card.cardBrand}</Text>
                    </View>
                    {card.isDefault && (
                      <View style={styles.defaultBadgeSmall}>
                        <Text style={styles.defaultBadgeTextSmall}>DEFAULT</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardNumber}>•••• {card.last4}</Text>
                  <View style={styles.cardFooter}>
                    <View>
                      <Text style={styles.cardLabel}>Balance</Text>
                      <Text style={styles.cardBalanceAmount}>${card.balance.toFixed(2)}</Text>
                    </View>
                    <View style={styles.cardExpiryContainer}>
                      <Text style={styles.cardLabel}>Expires</Text>
                      <Text style={styles.cardExpiry}>{card.expDt}</Text>
                    </View>
                  </View>
                </View>
              ))}
              {cards.length === 0 && (
                <TouchableOpacity 
                  style={styles.addCardPrompt}
                  onPress={handleViewCards}
                >
                  <Icon name="add-circle-outline" size={32} color="#DC2626" />
                  <Text style={styles.addCardText}>Add Your First Card</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}

        {/* Wallets Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Wallets</Text>
          {wallets.map(renderWalletCard)}
        </View>

        {/* Spending Insights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI Spending Insights</Text>
            <TouchableOpacity onPress={handleSeeAllInsights}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.insightsScroll}>
            {spendingByCategory.map(renderInsightCard)}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionCard} onPress={handleViewCards}>
              <Icon name="credit-card" size={32} color="#DC2626" />
              <Text style={styles.quickActionText}>View Cards</Text>
              {cards.length > 0 && (
                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>{cards.length}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard} onPress={handleScanQR}>
              <Icon name="qr-code-scanner" size={32} color="#10B981" />
              <Text style={styles.quickActionText}>Scan QR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard} onPress={handleViewHistory}>
              <Icon name="history" size={32} color="#F59E0B" />
              <Text style={styles.quickActionText}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard} onPress={handleSettings}>
              <Icon name="settings" size={32} color="#8B5CF6" />
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={paymentModalVisible}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Quick Pay</Text>
              <TouchableOpacity onPress={() => setPaymentModalVisible(false)}>
                <Icon name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            {selectedWallet && (
              <>
                <Text style={styles.modalSubtitle}>
                  From: {selectedWallet.name} ({selectedWallet.currency}{selectedWallet.balance.toFixed(2)})
                </Text>
                
                <Text style={styles.inputLabel}>Merchant</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter merchant name"
                  value={merchantName}
                  onChangeText={setMerchantName}
                />
                <View style={styles.presetAmounts}>
                  {['Campus Cafe', 'Starbucks', 'Subway', 'Library'].map((merchant) => (
                    <TouchableOpacity
                      key={merchant}
                      style={[styles.presetButton, styles.merchantButton]}
                      onPress={() => setMerchantName(merchant)}
                    >
                      <Text style={[styles.presetText, styles.merchantText]}>{merchant}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Amount</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
                <View style={styles.presetAmounts}>
                  {['5', '10', '20', '50'].map((preset) => (
                    <TouchableOpacity
                      key={preset}
                      style={styles.presetButton}
                      onPress={() => setAmount(preset)}
                    >
                      <Text style={styles.presetText}>${preset}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmPayment}>
                  <Text style={styles.confirmButtonText}>Send Payment</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Funds Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addFundsModalVisible}
        onRequestClose={() => setAddFundsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Funds</Text>
              <TouchableOpacity onPress={() => setAddFundsModalVisible(false)}>
                <Icon name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            {selectedWallet && (
              <>
                <Text style={styles.modalSubtitle}>
                  To: {selectedWallet.name}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
                <View style={styles.presetAmounts}>
                  {['25', '50', '100', '200'].map((preset) => (
                    <TouchableOpacity
                      key={preset}
                      style={styles.presetButton}
                      onPress={() => setAmount(preset)}
                    >
                      <Text style={styles.presetText}>${preset}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmAddFunds}>
                  <Text style={styles.confirmButtonText}>Add Funds</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* AI Insights Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={insightsModalVisible}
        onRequestClose={() => setInsightsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.insightsModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>AI Spending Insights</Text>
              <TouchableOpacity onPress={() => setInsightsModalVisible(false)}>
                <Icon name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.insightsModalScroll}>
              <View style={styles.totalSpentCard}>
                <Text style={styles.totalSpentLabel}>Total Spent This Month</Text>
                <Text style={styles.totalSpentAmount}>${totalSpent.toFixed(2)}</Text>
              </View>

              <Text style={styles.categoryBreakdownTitle}>Category Breakdown</Text>
              {spendingByCategory.map((insight) => (
                <View key={insight.category} style={styles.insightDetailCard}>
                  <View style={styles.insightDetailHeader}>
                    <Text style={styles.insightDetailCategory}>{insight.category}</Text>
                    <Text style={styles.insightDetailAmount}>${insight.amount.toFixed(2)}</Text>
                  </View>
                  <View style={styles.progressBarFull}>
                    <View 
                      style={[
                        styles.progressFillFull, 
                        { width: `${insight.percentage}%`, backgroundColor: '#DC2626' }
                      ]} 
                    />
                  </View>
                  <Text style={styles.insightDetailPercentage}>
                    {insight.percentage}% of total spending
                  </Text>
                </View>
              ))}

              <View style={styles.aiRecommendation}>
                <View style={styles.aiRecommendationHeader}>
                  <Icon name="lightbulb" size={24} color="#F59E0B" />
                  <Text style={styles.aiRecommendationTitle}>AI Recommendation</Text>
                </View>
                <Text style={styles.aiRecommendationText}>
                  {spendingByCategory.length > 0 && spendingByCategory[0].percentage > 50
                    ? `Your ${spendingByCategory[0].category} spending is quite high at ${spendingByCategory[0].percentage}%. Consider setting a budget to track your expenses better.`
                    : 'Great job! Your spending is well-balanced across categories. Keep up the good financial habits!'}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* QR Scanner Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={qrScanModalVisible}
        onRequestClose={() => setQrScanModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.qrModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Scan QR Code</Text>
              <TouchableOpacity onPress={() => setQrScanModalVisible(false)}>
                <Icon name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <View style={styles.qrScannerArea}>
              <Icon name="qr-code-scanner" size={150} color="#DC2626" />
              <Text style={styles.qrInstructions}>Position QR code within the frame</Text>
              <View style={styles.qrFrame} />
            </View>

            <View style={styles.qrActions}>
              <TouchableOpacity 
                style={styles.qrActionButton}
                onPress={() => {
                  setQrScanModalVisible(false);
                  navigation.navigate('StudentID' as never);
                }}
              >
                <Icon name="badge" size={24} color="#DC2626" />
                <Text style={styles.qrActionText}>Show My QR Code</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.qrHelpText}>
              Scan merchant QR codes to make quick payments
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  totalBalanceCard: {
    backgroundColor: '#DC2626',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  totalBalanceLabel: {
    fontSize: 14,
    color: '#E0E7FF',
    marginBottom: 8,
  },
  totalBalanceAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  totalBalanceSubtext: {
    fontSize: 12,
    color: '#C7D2FE',
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '600',
  },
  walletCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  walletBalance: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  walletActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  insightsScroll: {
    marginBottom: 16,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightCategory: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  trendContainer: {
    padding: 4,
  },
  insightAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  insightPercentage: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  cardBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    marginBottom: 16,
  },
  merchantButton: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  merchantText: {
    fontSize: 12,
    color: '#DC2626',
  },
  presetAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  presetButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  presetText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  confirmButton: {
    backgroundColor: '#DC2626',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // AI Insights Modal Styles
  insightsModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
    minHeight: '60%',
  },
  insightsModalScroll: {
    marginTop: 16,
  },
  totalSpentCard: {
    backgroundColor: '#FEE2E2',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  totalSpentLabel: {
    fontSize: 14,
    color: '#991B1B',
    marginBottom: 8,
  },
  totalSpentAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#DC2626',
  },
  categoryBreakdownTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  insightDetailCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  insightDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightDetailCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  insightDetailAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
  },
  progressBarFull: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFillFull: {
    height: '100%',
    borderRadius: 4,
  },
  insightDetailPercentage: {
    fontSize: 12,
    color: '#6B7280',
  },
  aiRecommendation: {
    backgroundColor: '#FFFBEB',
    padding: 20,
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  aiRecommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiRecommendationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    marginLeft: 8,
  },
  aiRecommendationText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
  },
  // QR Scanner Modal Styles
  qrModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: '70%',
  },
  qrScannerArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 40,
    position: 'relative',
  },
  qrInstructions: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 24,
    textAlign: 'center',
  },
  qrFrame: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#DC2626',
    borderRadius: 20,
    borderStyle: 'dashed',
  },
  qrActions: {
    marginTop: 24,
    marginBottom: 24,
  },
  qrActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  qrActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 12,
  },
  qrHelpText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
  },
  // Card Display Styles
  cardsScrollContainer: {
    paddingRight: 16,
  },
  cardDisplay: {
    width: 340,
    height: 180,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 24,
    marginRight: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardBrandText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  defaultBadgeSmall: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  defaultBadgeTextSmall: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  cardBalanceAmount: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  cardExpiryContainer: {
    alignItems: 'flex-end',
  },
  cardExpiry: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  addCardPrompt: {
    width: 340,
    height: 180,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#DC2626',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addCardText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
});

export default HomeScreen;

