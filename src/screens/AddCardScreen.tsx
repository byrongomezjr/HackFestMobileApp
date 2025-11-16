import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { FiservCard } from '../types/fiservCard';

const AddCardScreen = () => {
  const navigation = useNavigation();
  const { addCard } = useData();
  const { theme } = useTheme();

  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [nickname, setNickname] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [address1, setAddress1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleAddCard = () => {
    // Validate inputs
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      Alert.alert('Invalid Card', 'Please enter a valid card number');
      return;
    }

    if (!expiryDate || expiryDate.length < 5) {
      Alert.alert('Invalid Expiry', 'Please enter expiry date (MM/YY)');
      return;
    }

    if (!cardholderName || cardholderName.trim().length < 3) {
      Alert.alert('Invalid Name', 'Please enter cardholder name');
      return;
    }

    // Create Fiserv card object
    const fiservCard: FiservCard = {
      PartyCardRelInfo: [
        {
          PartyRef: {
            PartyKeys: {
              PartyIdentType: 'StudentID',
              PartyIdent: 'STU-2027-001', // From current user
            },
          },
          PartyCardRelType: 'Primary',
        },
      ],
      CardInfo: {
        CardNum: cardNumber.replace(/\s/g, ''),
        CardType: 'Debit',
        ProductIdent: 'CAMPUS_CARD',
        InstantIssuedInd: true,
        ExpDt: expiryDate,
        CardCategory: 'Student',
        EmbossingName: cardholderName.toUpperCase(),
        Nickname: nickname || undefined,
        PostAddr: address1 ? [
          {
            Addr1: address1,
            City: city,
            StateProv: state,
            PostalCode: zipCode,
            Country: 'USA',
            AddrType: 'Home',
          },
        ] : undefined,
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

    try {
      const balance = parseFloat(initialBalance) || 0;
      const newCard = addCard(fiservCard, balance);

      Alert.alert(
        'Card Added!',
        `${newCard.cardBrand} ${newCard.last4} has been added to your wallet.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add card. Please try again.');
    }
  };

  // Format card number with spaces
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    setCardNumber(chunks.join(' ').substring(0, 19));
  };

  // Format expiry date (MM/YY)
  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      setExpiryDate(cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4));
    } else {
      setExpiryDate(cleaned);
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
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.surface,
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
    scrollContent: {
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 12,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.textSecondary,
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: theme.textPrimary,
    },
    inputFocused: {
      borderColor: theme.primary,
      borderWidth: 2,
    },
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    flex1: {
      flex: 1,
    },
    infoBox: {
      backgroundColor: theme.primaryLight,
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
      flexDirection: 'row',
    },
    infoIcon: {
      marginRight: 12,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    addButton: {
      backgroundColor: theme.primary,
      padding: 18,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Fiserv Card</Text>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Info Box */}
          <View style={styles.infoBox}>
            <Icon name="info-outline" size={24} color={theme.primary} style={styles.infoIcon} />
            <Text style={styles.infoText}>
              Add your Fiserv card to use for campus payments. Your card will be securely stored in your wallet.
            </Text>
          </View>

          {/* Card Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Card Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={theme.textLight}
                value={cardNumber}
                onChangeText={formatCardNumber}
                keyboardType="number-pad"
                maxLength={19}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expiry Date (MM/YY) *</Text>
              <TextInput
                style={styles.input}
                placeholder="12/25"
                placeholderTextColor={theme.textLight}
                value={expiryDate}
                onChangeText={formatExpiryDate}
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cardholder Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="JOHN DOE"
                placeholderTextColor={theme.textLight}
                value={cardholderName}
                onChangeText={setCardholderName}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Card Nickname (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., My Visa Card"
                placeholderTextColor={theme.textLight}
                value={nickname}
                onChangeText={setNickname}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Initial Balance (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="$0.00"
                placeholderTextColor={theme.textLight}
                value={initialBalance}
                onChangeText={setInitialBalance}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* Billing Address Section (Optional) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Billing Address (Optional)</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Street Address</Text>
              <TextInput
                style={styles.input}
                placeholder="123 Main St"
                placeholderTextColor={theme.textLight}
                value={address1}
                onChangeText={setAddress1}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  placeholder="New Brunswick"
                  placeholderTextColor={theme.textLight}
                  value={city}
                  onChangeText={setCity}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={[styles.input, { width: 80 }]}
                  placeholder="NJ"
                  placeholderTextColor={theme.textLight}
                  value={state}
                  onChangeText={setState}
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>ZIP Code</Text>
              <TextInput
                style={styles.input}
                placeholder="08901"
                placeholderTextColor={theme.textLight}
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>
          </View>

          {/* Add Card Button */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
            <Text style={styles.addButtonText}>Add Card to Wallet</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddCardScreen;

