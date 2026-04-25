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
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, makeApiCall } from '../../../config/supabase';

const { width } = Dimensions.get('window');

const EnhancedAdminDashboard = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    overview: {},
    topPriorityComplaints: [],
    locationHotspots: [],
    recentActivity: [],
    stageProgress: {},
    costAnalysis: {}
  });
  const [loading, setLoading] = useState(true);
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
      const response = await makeApiCall(`${apiClient.baseUrl}/api/admin-enhanced/dashboard/overview`);

      if (response.success) {
        setDashboardData({
          overview: response.data.overview || {},
          topPriorityComplaints: response.data.topPriorityComplaints || [],
          locationHotspots: response.data.locationHotspots || [],
          recentActivity: response.data.recentActivity || [],
          stageProgress: response.data.stageProgress || {},
          costAnalysis: response.data.costAnalysis || {}
        });
      } else {
        Alert.alert('Error', 'Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
      Alert.alert('Error', 'Failed to connect to server');
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
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('authToken');
      navigation.replace('Welcome');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigateToPriorityQueue = () => {
    navigation.navigate('PriorityQueue');
  };

  const navigateToCitizenManagement = () => {
    navigation.navigate('CitizenManagement');
  };

  const navigateToComplaintDetails = (complaintId) => {
    navigation.navigate('ComplaintDetails', { complaintId });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
        <View style={styles.loadingContent}>
          <Ionicons name="analytics-outline" size={40} color="#334155" />
          <Text style={styles.loadingText}>Loading Dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { overview } = dashboardData;

  const stats = [
    { label: 'Total', value: overview.totalComplaints || 0, icon: 'document-text-outline', color: '#DC2626', bg: '#FEF2F2' },
    { label: 'Pending', value: overview.pendingComplaints || 0, icon: 'time-outline', color: '#D97706', bg: '#FFFBEB' },
    { label: 'In Progress', value: overview.inProgressComplaints || 0, icon: 'construct-outline', color: '#0284C7', bg: '#F0F9FF' },
    { label: 'Resolved', value: overview.resolvedComplaints || 0, icon: 'checkmark-circle-outline', color: '#059669', bg: '#F0FDF4' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.adminName}>{userData?.full_name || userData?.fullName || 'Admin'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={22} color="#DC2626" />
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

          {/* Performance */}
          <View style={styles.perfRow}>
            {[
              { label: 'Resolution Rate', value: `${overview.resolutionRate || 0}%` },
              { label: 'Avg Time', value: `${overview.avgResolutionTime || 0}h` },
              { label: 'Active Users', value: `${overview.activeUsers || 0}` },
            ].map((perf, i) => (
              <View key={i} style={styles.perfItem}>
                <Text style={styles.perfValue}>{perf.value}</Text>
                <Text style={styles.perfLabel}>{perf.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionCard} onPress={navigateToPriorityQueue}>
              <View style={[styles.actionIconWrap, { backgroundColor: '#FEF2F2' }]}>
                <Ionicons name="list-outline" size={22} color="#DC2626" />
              </View>
              <Text style={styles.actionTitle}>Priority Queue</Text>
              <Text style={styles.actionSubtitle}>Manage by priority</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={navigateToCitizenManagement}>
              <View style={[styles.actionIconWrap, { backgroundColor: '#F5F3FF' }]}>
                <Ionicons name="people-outline" size={22} color="#7C3AED" />
              </View>
              <Text style={styles.actionTitle}>Citizens</Text>
              <Text style={styles.actionSubtitle}>Manage users</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* High Priority Complaints */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>High Priority</Text>
            <TouchableOpacity onPress={navigateToPriorityQueue}>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {(dashboardData.topPriorityComplaints || []).length > 0 ? (
            (dashboardData.topPriorityComplaints || []).slice(0, 3).map((complaint) => (
              <TouchableOpacity
                key={complaint.id}
                style={styles.priorityRow}
                onPress={() => navigateToComplaintDetails(complaint.id)}
                activeOpacity={0.7}
              >
                <View style={styles.priorityBadge}>
                  <Text style={styles.priorityScore}>
                    {(complaint.priority_score * 100).toFixed(0)}
                  </Text>
                </View>
                <View style={styles.priorityInfo}>
                  <Text style={styles.priorityTitle} numberOfLines={1}>
                    {complaint.category?.replace(/_/g, ' ') || 'Complaint'}
                  </Text>
                  <Text style={styles.priorityMeta}>
                    Score: {complaint.priority_score} · {new Date(complaint.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>{complaint.status}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="flame-outline" size={28} color="#D4D4D4" />
              <Text style={styles.emptyText}>No high priority complaints</Text>
            </View>
          )}
        </View>

        {/* Location Hotspots */}
        {(dashboardData.locationHotspots || []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Complaint Hotspots</Text>
            {(dashboardData.locationHotspots || []).slice(0, 3).map((hotspot, index) => (
              <View key={index} style={styles.hotspotRow}>
                <View style={styles.hotspotIconWrap}>
                  <Ionicons name="location-outline" size={16} color="#DC2626" />
                </View>
                <View style={styles.hotspotInfo}>
                  <Text style={styles.hotspotName}>{hotspot.area_name}</Text>
                  <Text style={styles.hotspotCount}>{hotspot.complaint_count} complaints</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {(dashboardData.recentActivity || []).length > 0 ? (
            (dashboardData.recentActivity || []).slice(0, 5).map((activity, index) => (
              <View key={activity.id || index} style={styles.activityRow}>
                <View style={styles.activityIconWrap}>
                  <Ionicons
                    name={getActivityIcon(activity.event_type)}
                    size={16}
                    color="#334155"
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.event_title}</Text>
                  <Text style={styles.activityTime}>
                    {formatActivityTime(activity.created_at)}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="time-outline" size={28} color="#D4D4D4" />
              <Text style={styles.emptyText}>No recent activity</Text>
            </View>
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper functions
const getActivityIcon = (eventType) => {
  const icons = {
    'created': 'add-circle-outline',
    'stage_update': 'construct-outline',
    'assigned': 'person-add-outline',
    'completed': 'checkmark-circle-outline',
    'note_added': 'document-text-outline'
  };
  return icons[eventType] || 'information-circle-outline';
};

const formatActivityTime = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMinutes = Math.floor((now - time) / (1000 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
  return `${Math.floor(diffMinutes / 1440)}d ago`;
};

const cardWidth = (width - 64 - 10) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#737373',
    fontSize: 15,
    marginTop: 12,
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
    fontSize: 14,
    color: '#737373',
  },
  adminName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0A0A0A',
    letterSpacing: -0.3,
  },
  logoutBtn: {
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
  viewAllLink: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0F766E',
    marginBottom: 12,
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
  perfRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    justifyContent: 'space-around',
  },
  perfItem: {
    alignItems: 'center',
  },
  perfValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 2,
  },
  perfLabel: {
    fontSize: 11,
    color: '#A3A3A3',
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  actionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  priorityBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  priorityScore: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
  priorityInfo: {
    flex: 1,
  },
  priorityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
    textTransform: 'capitalize',
  },
  priorityMeta: {
    fontSize: 12,
    color: '#A3A3A3',
    marginTop: 2,
  },
  statusPill: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    color: '#0284C7',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  hotspotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  hotspotIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  hotspotInfo: {
    flex: 1,
  },
  hotspotName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
  },
  hotspotCount: {
    fontSize: 12,
    color: '#A3A3A3',
    marginTop: 1,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  activityIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: '#171717',
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: '#A3A3A3',
    marginTop: 1,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  emptyText: {
    fontSize: 13,
    color: '#A3A3A3',
    marginTop: 8,
  },
});

export default EnhancedAdminDashboard;
