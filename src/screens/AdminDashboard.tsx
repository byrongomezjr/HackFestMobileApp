import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { allUsers } from '../data/sampleData';
import { useTheme } from '../context/ThemeContext';

const AdminDashboard = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.student_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTotalBalance = (user: typeof allUsers[0]) => {
    return user.dining_dollars + user.meal_plan + user.campus_card;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Admin Dashboard</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {allUsers.length} Total Users
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Icon name="admin-panel-settings" size={24} color="#DC2626" />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Icon name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search by name, email, or ID..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Stats Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#FEE2E2' }]}>
          <Icon name="people" size={24} color="#DC2626" />
          <Text style={styles.statValue}>{allUsers.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
          <Icon name="account-balance-wallet" size={24} color="#2563EB" />
          <Text style={styles.statValue}>
            ${allUsers.reduce((sum, u) => sum + getTotalBalance(u), 0).toFixed(0)}
          </Text>
          <Text style={styles.statLabel}>Total Balance</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
          <Icon name="restaurant" size={24} color="#059669" />
          <Text style={styles.statValue}>
            ${allUsers.reduce((sum, u) => sum + u.dining_dollars, 0).toFixed(0)}
          </Text>
          <Text style={styles.statLabel}>Dining Dollars</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
          <Icon name="credit-card" size={24} color="#D97706" />
          <Text style={styles.statValue}>
            ${allUsers.reduce((sum, u) => sum + u.campus_card, 0).toFixed(0)}
          </Text>
          <Text style={styles.statLabel}>Campus Cards</Text>
        </View>
      </ScrollView>

      {/* Users Table */}
      <ScrollView style={styles.tableContainer} showsVerticalScrollIndicator={false}>
        <Text style={[styles.tableTitle, { color: theme.text }]}>All Students</Text>
        
        {filteredUsers.map((user, index) => (
          <View
            key={user.user_id}
            style={[
              styles.userCard,
              { backgroundColor: theme.card, borderColor: theme.border }
            ]}
          >
            {/* User Header */}
            <View style={styles.userHeader}>
              <Image
                source={{ uri: user.photo_url }}
                style={styles.userPhoto}
              />
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: theme.text }]}>{user.name}</Text>
                <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
                  {user.email}
                </Text>
              </View>
              <View style={styles.userBadge}>
                <Icon name="verified-user" size={16} color="#10B981" />
              </View>
            </View>

            {/* User Details Grid */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Student ID</Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>{user.student_id}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Major</Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>{user.major}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Class</Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>{user.class_year}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Residence</Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>{user.residence_type}</Text>
              </View>
            </View>

            {/* Wallet Balances */}
            <View style={styles.balancesContainer}>
              <View style={[styles.balanceItem, { backgroundColor: '#FEE2E2' }]}>
                <Icon name="restaurant" size={16} color="#DC2626" />
                <View style={styles.balanceText}>
                  <Text style={styles.balanceLabel}>Dining</Text>
                  <Text style={styles.balanceValue}>${user.dining_dollars.toFixed(2)}</Text>
                </View>
              </View>
              <View style={[styles.balanceItem, { backgroundColor: '#DBEAFE' }]}>
                <Icon name="fastfood" size={16} color="#2563EB" />
                <View style={styles.balanceText}>
                  <Text style={styles.balanceLabel}>Meal Plan</Text>
                  <Text style={styles.balanceValue}>${user.meal_plan.toFixed(2)}</Text>
                </View>
              </View>
              <View style={[styles.balanceItem, { backgroundColor: '#D1FAE5' }]}>
                <Icon name="credit-card" size={16} color="#059669" />
                <View style={styles.balanceText}>
                  <Text style={styles.balanceLabel}>Campus</Text>
                  <Text style={styles.balanceValue}>${user.campus_card.toFixed(2)}</Text>
                </View>
              </View>
            </View>

            {/* Total Balance */}
            <View style={styles.totalBalance}>
              <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Total Balance</Text>
              <Text style={styles.totalValue}>${getTotalBalance(user).toFixed(2)}</Text>
            </View>
          </View>
        ))}

        {filteredUsers.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="search-off" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No users found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search</Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  headerRight: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statCard: {
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    minWidth: 140,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    color: '#6B7280',
  },
  tableContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  userCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  userBadge: {
    padding: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 12,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  balancesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  balanceItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
    gap: 6,
  },
  balanceText: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  balanceValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
  },
  totalBalance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#DC2626',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  bottomPadding: {
    height: 40,
  },
});

export default AdminDashboard;

