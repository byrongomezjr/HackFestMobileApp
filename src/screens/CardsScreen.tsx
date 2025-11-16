import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { WalletCard } from '../types/fiservCard';

const CardsScreen = () => {
  const navigation = useNavigation();
  const { cards, removeCard, setDefaultCard, loadCardBalance } = useData();
  const { theme } = useTheme();
  const [loadingCardId, setLoadingCardId] = useState<string | null>(null);

  const handleRemoveCard = (card: WalletCard) => {
    Alert.alert(
      'Remove Card',
      `Are you sure you want to remove ${card.nickname}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeCard(card.id),
        },
      ]
    );
  };

  const handleSetDefault = (cardId: string) => {
    setDefaultCard(cardId);
  };

  const handleLoadBalance = (card: WalletCard) => {
    Alert.prompt(
      'Load Balance',
      `How much would you like to add to ${card.nickname}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (amount) => {
            const amountNum = parseFloat(amount || '0');
            if (amountNum > 0) {
              loadCardBalance(card.id, amountNum);
              Alert.alert('Success', `$${amountNum.toFixed(2)} added to ${card.nickname}`);
            }
          },
        },
      ],
      'plain-text',
      '',
      'decimal-pad'
    );
  };

  const getCardIcon = (brand: string) => {
    switch (brand) {
      case 'Visa':
        return 'credit-card';
      case 'Mastercard':
        return 'credit-card';
      case 'Amex':
        return 'credit-card';
      case 'Discover':
        return 'credit-card';
      default:
        return 'payment';
    }
  };

  const getCardColor = (brand: string) => {
    switch (brand) {
      case 'Visa':
        return '#1A1F71';
      case 'Mastercard':
        return '#EB001B';
      case 'Amex':
        return '#006FCF';
      case 'Discover':
        return '#FF6000';
      default:
        return theme.primary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.surface,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      padding: 8,
      marginRight: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      backgroundColor: theme.primaryLight,
      borderRadius: 8,
    },
    addButtonText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 4,
    },
    scrollContent: {
      padding: 16,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    emptyAddButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    emptyAddButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    cardContainer: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    cardContainerDefault: {
      borderColor: theme.primary,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
    },
    cardBrandSection: {
      flex: 1,
    },
    cardBrandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    cardBrand: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
      marginLeft: 8,
    },
    cardNickname: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    defaultBadge: {
      backgroundColor: theme.primary,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    defaultBadgeText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    cardNumber: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.textPrimary,
      letterSpacing: 2,
      marginBottom: 12,
    },
    cardDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    cardDetailItem: {},
    cardDetailLabel: {
      fontSize: 11,
      color: theme.textLight,
      marginBottom: 4,
      textTransform: 'uppercase',
    },
    cardDetailValue: {
      fontSize: 14,
      color: theme.textPrimary,
      fontWeight: '600',
    },
    balanceSection: {
      backgroundColor: theme.primaryLight,
      padding: 12,
      borderRadius: 12,
      marginBottom: 16,
    },
    balanceLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    balanceAmount: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.primary,
    },
    cardActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderRadius: 12,
      backgroundColor: theme.primaryLight,
    },
    actionButtonDanger: {
      backgroundColor: '#FEE2E2',
    },
    actionButtonText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 4,
    },
    actionButtonTextDanger: {
      color: '#DC2626',
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cards</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => (navigation as any).navigate('AddCard')}
        >
          <Icon name="add" size={20} color={theme.primary} />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {cards.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyState}>
            <Icon
              name="credit-card-off"
              size={64}
              color={theme.textLight}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>No Cards Yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your Fiserv card to start making payments
            </Text>
            <TouchableOpacity
              style={styles.emptyAddButton}
              onPress={() => (navigation as any).navigate('AddCard')}
            >
              <Text style={styles.emptyAddButtonText}>Add Your First Card</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Cards List */
          cards.map((card) => (
            <View
              key={card.id}
              style={[
                styles.cardContainer,
                card.isDefault && styles.cardContainerDefault,
              ]}
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardBrandSection}>
                  <View style={styles.cardBrandRow}>
                    <Icon
                      name={getCardIcon(card.cardBrand)}
                      size={24}
                      color={getCardColor(card.cardBrand)}
                    />
                    <Text style={styles.cardBrand}>{card.cardBrand}</Text>
                  </View>
                  <Text style={styles.cardNickname}>{card.nickname}</Text>
                </View>
                {card.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                  </View>
                )}
              </View>

              {/* Card Number */}
              <Text style={styles.cardNumber}>•••• •••• •••• {card.last4}</Text>

              {/* Card Details */}
              <View style={styles.cardDetails}>
                <View style={styles.cardDetailItem}>
                  <Text style={styles.cardDetailLabel}>Cardholder</Text>
                  <Text style={styles.cardDetailValue}>{card.embossingName}</Text>
                </View>
                <View style={styles.cardDetailItem}>
                  <Text style={styles.cardDetailLabel}>Expires</Text>
                  <Text style={styles.cardDetailValue}>{card.expDt}</Text>
                </View>
                <View style={styles.cardDetailItem}>
                  <Text style={styles.cardDetailLabel}>Type</Text>
                  <Text style={styles.cardDetailValue}>{card.cardType}</Text>
                </View>
              </View>

              {/* Balance */}
              <View style={styles.balanceSection}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <Text style={styles.balanceAmount}>
                  ${card.balance.toFixed(2)}
                </Text>
              </View>

              {/* Actions */}
              <View style={styles.cardActions}>
                {!card.isDefault && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleSetDefault(card.id)}
                  >
                    <Icon name="check-circle" size={16} color={theme.primary} />
                    <Text style={styles.actionButtonText}>Set Default</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleLoadBalance(card)}
                >
                  <Icon name="add-circle" size={16} color={theme.primary} />
                  <Text style={styles.actionButtonText}>Load</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonDanger]}
                  onPress={() => handleRemoveCard(card)}
                >
                  <Icon name="delete" size={16} color="#DC2626" />
                  <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CardsScreen;

