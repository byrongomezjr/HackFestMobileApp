import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { currentUser, userTransactions, totalSpent } = useData();
  const { theme, themeMode, setThemeMode } = useTheme();
  const { logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = React.useState(true);
  const [fraudAlertsEnabled, setFraudAlertsEnabled] = React.useState(true);
  const [themeModalVisible, setThemeModalVisible] = React.useState(false);

  const getThemeLabel = () => {
    if (themeMode === 'light') return 'Light Mode';
    if (themeMode === 'dark') return 'Dark Mode';
    return 'System Default';
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle: string,
    value?: boolean,
    onToggle?: (value: boolean) => void,
    onPress?: () => void
  ) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      disabled={value !== undefined}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Icon name={icon} size={24} color="#DC2626" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {value !== undefined && onToggle ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#E5E7EB', true: '#FCA5A5' }}
          thumbColor={value ? '#DC2626' : '#9CA3AF'}
        />
      ) : (
        <Icon name="chevron-right" size={24} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.editButton}>
            <Icon name="edit" size={20} color="#DC2626" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: currentUser.photo_url }}
            style={styles.profilePhoto}
          />
          <Text style={styles.profileName}>{currentUser.name}</Text>
          <Text style={styles.profileEmail}>{currentUser.email}</Text>
          <View style={styles.profileBadges}>
            <View style={styles.badge}>
              <Icon name="verified-user" size={16} color="#10B981" />
              <Text style={styles.badgeText}>Verified</Text>
            </View>
            <View style={styles.badge}>
              <Icon name="school" size={16} color="#DC2626" />
              <Text style={styles.badgeText}>{currentUser.class_year}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="account-balance-wallet" size={28} color="#DC2626" />
            <Text style={styles.statValue}>
              ${(currentUser.dining_dollars + currentUser.meal_plan + currentUser.campus_card).toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Total Balance</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="receipt-long" size={28} color="#10B981" />
            <Text style={styles.statValue}>{userTransactions.length}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="payments" size={28} color="#F59E0B" />
            <Text style={styles.statValue}>${totalSpent.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {renderSettingItem(
            'person',
            'Personal Information',
            'Update your profile details',
            undefined,
            undefined,
            () => {}
          )}
          {currentUser.isAdmin && renderSettingItem(
            'admin-panel-settings',
            'Admin Dashboard',
            'View all users and system stats',
            undefined,
            undefined,
            () => navigation.navigate('AdminDashboard' as never)
          )}
          {renderSettingItem(
            'badge',
            'Student ID',
            'View and manage your ID card',
            undefined,
            undefined,
            () => {}
          )}
          {renderSettingItem(
            'payment',
            'Payment Methods',
            'Manage cards and bank accounts',
            undefined,
            undefined,
            () => {}
          )}
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          {renderSettingItem(
            'fingerprint',
            'Biometric Authentication',
            'Use Face ID or Touch ID',
            biometricsEnabled,
            setBiometricsEnabled
          )}
          {renderSettingItem(
            'shield',
            'Fraud Alerts',
            'Get notified of suspicious activity',
            fraudAlertsEnabled,
            setFraudAlertsEnabled
          )}
          {renderSettingItem(
            'lock',
            'Change PIN',
            'Update your security PIN',
            undefined,
            undefined,
            () => {}
          )}
          {renderSettingItem(
            'history',
            'Login History',
            'View recent account activity',
            undefined,
            undefined,
            () => {}
          )}
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {renderSettingItem(
            'notifications',
            'Push Notifications',
            'Receive alerts and updates',
            notificationsEnabled,
            setNotificationsEnabled
          )}
          {renderSettingItem(
            'email',
            'Email Notifications',
            'Get updates via email',
            undefined,
            undefined,
            () => {}
          )}
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {renderSettingItem(
            'dark-mode',
            'Appearance',
            getThemeLabel(),
            undefined,
            undefined,
            () => setThemeModalVisible(true)
          )}
          {renderSettingItem(
            'language',
            'Language',
            'English (US)',
            undefined,
            undefined,
            () => {}
          )}
          {renderSettingItem(
            'attach-money',
            'Currency',
            'USD ($)',
            undefined,
            undefined,
            () => {}
          )}
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {renderSettingItem(
            'help',
            'Help Center',
            'Get help and support',
            undefined,
            undefined,
            () => {}
          )}
          {renderSettingItem(
            'feedback',
            'Send Feedback',
            'Share your thoughts',
            undefined,
            undefined,
            () => {}
          )}
          {renderSettingItem(
            'info',
            'About',
            'App version 1.0.0',
            undefined,
            undefined,
            () => {}
          )}
          {renderSettingItem(
            'policy',
            'Privacy Policy',
            'Read our privacy policy',
            undefined,
            undefined,
            () => {}
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            Alert.alert(
              'Log Out',
              'Are you sure you want to log out?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log Out', style: 'destructive', onPress: logout },
              ]
            );
          }}
        >
          <Icon name="logout" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Theme Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={themeModalVisible}
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.themeModalContent, { backgroundColor: theme.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Choose Theme</Text>
              <TouchableOpacity onPress={() => setThemeModalVisible(false)}>
                <Icon name="close" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.themeOption,
                { borderColor: theme.border },
                themeMode === 'light' && styles.themeOptionActive,
              ]}
              onPress={() => {
                setThemeMode('light');
                setThemeModalVisible(false);
              }}
            >
              <Icon name="light-mode" size={28} color={themeMode === 'light' ? theme.primary : theme.textSecondary} />
              <View style={styles.themeOptionText}>
                <Text style={[styles.themeOptionTitle, { color: theme.textPrimary }]}>Light Mode</Text>
                <Text style={[styles.themeOptionSubtitle, { color: theme.textSecondary }]}>
                  Bright and clear interface
                </Text>
              </View>
              {themeMode === 'light' && (
                <Icon name="check-circle" size={24} color={theme.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeOption,
                { borderColor: theme.border },
                themeMode === 'dark' && styles.themeOptionActive,
              ]}
              onPress={() => {
                setThemeMode('dark');
                setThemeModalVisible(false);
              }}
            >
              <Icon name="dark-mode" size={28} color={themeMode === 'dark' ? theme.primary : theme.textSecondary} />
              <View style={styles.themeOptionText}>
                <Text style={[styles.themeOptionTitle, { color: theme.textPrimary }]}>Dark Mode</Text>
                <Text style={[styles.themeOptionSubtitle, { color: theme.textSecondary }]}>
                  Easy on the eyes at night
                </Text>
              </View>
              {themeMode === 'dark' && (
                <Icon name="check-circle" size={24} color={theme.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeOption,
                { borderColor: theme.border },
                themeMode === 'system' && styles.themeOptionActive,
              ]}
              onPress={() => {
                setThemeMode('system');
                setThemeModalVisible(false);
              }}
            >
              <Icon name="brightness-auto" size={28} color={themeMode === 'system' ? theme.primary : theme.textSecondary} />
              <View style={styles.themeOptionText}>
                <Text style={[styles.themeOptionTitle, { color: theme.textPrimary }]}>System Default</Text>
                <Text style={[styles.themeOptionSubtitle, { color: theme.textSecondary }]}>
                  Matches your device settings
                </Text>
              </View>
              {themeMode === 'system' && (
                <Icon name="check-circle" size={24} color={theme.primary} />
              )}
            </TouchableOpacity>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#DC2626',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  profileBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    marginHorizontal: 20,
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },
  bottomPadding: {
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  themeModalContent: {
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
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  themeOptionActive: {
    borderColor: '#DC2626',
    backgroundColor: '#FEE2E2',
  },
  themeOptionText: {
    flex: 1,
    marginLeft: 16,
  },
  themeOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  themeOptionSubtitle: {
    fontSize: 13,
  },
});

export default ProfileScreen;

