import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, makeApiCall } from '../../../config/supabase';

const { width } = Dimensions.get('window');

// Clean Civic Complaint Dashboard
const ModernAdminDashboard = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolutionRate: 0,
    totalCitizens: 0
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
    loadDashboardData();
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

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await makeApiCall(`${apiClient.baseUrl}/api/admin/dashboard`);

      if (response.success && response.data) {
        const apiData = response.data;
        const complaints = apiData.complaints;
        const users = apiData.users;

        const mappedData = {
          totalComplaints: complaints.total || 0,
          resolvedComplaints: complaints.resolved || 0,
          pendingComplaints: complaints.pending || 0,
          inProgressComplaints: complaints.inProgress || 0,
          resolutionRate: complaints.resolutionRate || 0,
          totalCitizens: users.citizens || 0,
          avgResolutionDays: complaints.avgResolutionDays || 0
        };

        setDashboardData(mappedData);
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
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
    { label: 'Total', value: dashboardData.totalComplaints, icon: 'document-text-outline', color: '#0284C7', bg: '#F0F9FF' },
    { label: 'Resolved', value: dashboardData.resolvedComplaints, icon: 'checkmark-circle-outline', color: '#059669', bg: '#F0FDF4' },
    { label: 'Pending', value: dashboardData.pendingComplaints, icon: 'time-outline', color: '#D97706', bg: '#FFFBEB' },
    { label: 'In Progress', value: dashboardData.inProgressComplaints, icon: 'sync-outline', color: '#0284C7', bg: '#F0F9FF' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Hey, {userData?.fullName || 'Admin'}!</Text>
          <Text style={styles.headerSubtext}>Civic Complaint Management</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#334155']} />
        }
      >
        {/* Stats Grid */}
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

        {/* Resolution & Citizens Row */}
        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, styles.metricCardAccent]}>
            <View style={styles.metricContent}>
              <Ionicons name="bar-chart-outline" size={22} color="#334155" />
              <View style={styles.metricInfo}>
                <Text style={styles.metricValue}>{dashboardData.resolutionRate}%</Text>
                <Text style={styles.metricLabel}>Resolution Rate</Text>
              </View>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricContent}>
              <Ionicons name="people-outline" size={22} color="#7C3AED" />
              <View style={styles.metricInfo}>
                <Text style={styles.metricValue}>{dashboardData.totalCitizens}</Text>
                <Text style={styles.metricLabel}>Citizens</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Nav */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management</Text>
          <View style={styles.navList}>
            {[
              { label: 'Priority Queue', icon: 'list-outline', desc: 'Manage by priority', screen: 'PriorityQueue' },
              { label: 'Citizens', icon: 'people-outline', desc: 'User management', screen: 'CitizenManagement' },
              { label: 'Complaint Map', icon: 'map-outline', desc: 'Geographic view', screen: 'AdminComplaintMap' },
            ].map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.navRow}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.7}
              >
                <View style={styles.navIconWrap}>
                  <Ionicons name={item.icon} size={20} color="#334155" />
                </View>
                <View style={styles.navTextWrap}>
                  <Text style={styles.navLabel}>{item.label}</Text>
                  <Text style={styles.navDesc}>{item.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#D4D4D4" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 80 }} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0A0A0A',
    letterSpacing: -0.3,
  },
  headerSubtext: {
    fontSize: 14,
    color: '#737373',
    marginTop: 2,
  },
  profileBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
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
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  metricCardAccent: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  metricContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricInfo: {
    marginLeft: 12,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#171717',
  },
  metricLabel: {
    fontSize: 12,
    color: '#737373',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 12,
  },
  navList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    overflow: 'hidden',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  navIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  navTextWrap: {
    flex: 1,
  },
  navLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 2,
  },
  navDesc: {
    fontSize: 13,
    color: '#A3A3A3',
  },
});

export default ModernAdminDashboard;