import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const AdminDashboard = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    loadUserData();
    loadDashboardStats();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadDashboardStats = async () => {
    // This will be implemented with actual API call later
    // For now, using placeholder data
    setDashboardStats({
      totalComplaints: 0,
      pendingComplaints: 0,
      resolvedComplaints: 0,
      totalUsers: 0,
    });
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['authToken', 'userData']);
            navigation.replace('Welcome');
          },
        },
      ]
    );
  };

  const stats = [
    { label: 'Total Reports', value: dashboardStats.totalComplaints, icon: 'document-text-outline', color: '#0F766E', bg: '#F0FDFA' },
    { label: 'Pending', value: dashboardStats.pendingComplaints, icon: 'time-outline', color: '#D97706', bg: '#FFFBEB' },
    { label: 'Resolved', value: dashboardStats.resolvedComplaints, icon: 'checkmark-circle-outline', color: '#059669', bg: '#F0FDF4' },
    { label: 'Citizens', value: dashboardStats.totalUsers, icon: 'people-outline', color: '#7C3AED', bg: '#F5F3FF' },
  ];

  const adminActions = [
    {
      icon: 'document-text-outline',
      label: 'Report Management',
      desc: 'Review and manage all reports',
      onPress: () => Alert.alert('Reports', 'Manage all environmental reports'),
    },
    {
      icon: 'flash-outline',
      label: 'Priority Queue',
      desc: 'Handle urgent issues',
      onPress: () => Alert.alert('Priority Queue', 'Handle urgent issues'),
    },
    {
      icon: 'map-outline',
      label: 'Analytics',
      desc: 'City-wide insights & data',
      onPress: () => Alert.alert('Analytics', 'Environmental data and insights'),
    },
    {
      icon: 'people-outline',
      label: 'Citizen Management',
      desc: 'Manage user accounts',
      onPress: () => Alert.alert('Citizen Management', 'Manage citizen accounts'),
    },
    {
      icon: 'stats-chart-outline',
      label: 'Reports & Exports',
      desc: 'Generate data reports',
      onPress: () => Alert.alert('Reports', 'Generate sustainability reports'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>Dashboard</Text>
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
            </View>
            <Text style={styles.headerSubtext}>
              Welcome, {userData?.fullName || 'Administrator'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => Alert.alert('Admin Profile', 'Admin profile settings')}
          >
            <Ionicons name="settings-outline" size={20} color="#404040" />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, i) => (
              <View key={i} style={styles.statCard}>
                <View style={[styles.statIconWrap, { backgroundColor: stat.bg }]}>
                  <Ionicons name={stat.icon} size={20} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Admin Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management</Text>
          <View style={styles.actionsContainer}>
            {adminActions.map((action, i) => (
              <TouchableOpacity
                key={i}
                style={styles.actionRow}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.actionIconWrap}>
                  <Ionicons name={action.icon} size={20} color="#334155" />
                </View>
                <View style={styles.actionTextWrap}>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                  <Text style={styles.actionDesc}>{action.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#D4D4D4" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="time-outline" size={28} color="#D4D4D4" />
            </View>
            <Text style={styles.emptyTitle}>No recent activity</Text>
            <Text style={styles.emptyText}>
              Activity will appear here as reports are processed
            </Text>
          </View>
        </View>

        {/* Admin Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <Ionicons name="mail-outline" size={18} color="#737373" />
              <Text style={styles.profileLabel}>Email</Text>
              <Text style={styles.profileValue} numberOfLines={1}>{userData?.email || '—'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.profileRow}>
              <Ionicons name="call-outline" size={18} color="#737373" />
              <Text style={styles.profileLabel}>Phone</Text>
              <Text style={styles.profileValue}>{userData?.phoneNumber || '—'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.profileRow}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#334155" />
              <Text style={styles.profileLabel}>Role</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Administrator</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#DC2626" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const cardWidth = (width - 64 - 10) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0A0A0A',
    letterSpacing: -0.3,
    marginRight: 10,
  },
  adminBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  headerSubtext: {
    fontSize: 14,
    color: '#737373',
  },
  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0F766E',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#737373',
    fontWeight: '500',
  },
  actionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionTextWrap: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 13,
    color: '#A3A3A3',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#404040',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: '#A3A3A3',
    textAlign: 'center',
    lineHeight: 18,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  profileLabel: {
    fontSize: 14,
    color: '#737373',
    fontWeight: '500',
    marginLeft: 10,
    width: 60,
  },
  profileValue: {
    fontSize: 14,
    color: '#171717',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
  },
  statusBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginBottom: 8,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#DC2626',
    marginLeft: 8,
  },
});

export default AdminDashboard;
