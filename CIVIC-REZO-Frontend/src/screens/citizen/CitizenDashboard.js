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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const CitizenDashboard = ({ navigation }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
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

  const quickActions = [
    {
      icon: 'add-circle-outline',
      label: 'New Report',
      desc: 'Submit a concern',
      color: '#0F766E',
      bg: '#F0FDFA',
      onPress: () => navigation.navigate('SubmitComplaint'),
    },
    {
      icon: 'documents-outline',
      label: 'My Reports',
      desc: 'Track progress',
      color: '#0284C7',
      bg: '#F0F9FF',
      onPress: () => navigation.reset({ index: 0, routes: [{ name: 'InstagramFeed' }] }),
    },
    {
      icon: 'map-outline',
      label: 'Map View',
      desc: 'Area overview',
      color: '#7C3AED',
      bg: '#F5F3FF',
      onPress: () => navigation.navigate('ComplaintMap'),
    },
    {
      icon: 'bar-chart-outline',
      label: 'Transparency',
      desc: 'Public data',
      color: '#D97706',
      bg: '#FFFBEB',
      onPress: () => navigation.navigate('CitizenTransparency'),
    },
    {
      icon: 'chatbubbles-outline',
      label: 'AI Assistant',
      desc: 'Get help',
      color: '#6366F1',
      bg: '#EEF2FF',
      onPress: () => navigation.navigate('CivicChatbot'),
    },
    {
      icon: 'mic-outline',
      label: 'Voice Report',
      desc: 'Speak to report',
      color: '#EA580C',
      bg: '#FFF7ED',
      onPress: () => navigation.navigate('SubmitComplaint', { useVoice: true }),
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
            <Text style={styles.greeting}>
              Hello, {userData?.fullName?.split(' ')[0] || 'Citizen'}
            </Text>
            <Text style={styles.headerSubtext}>What would you like to do today?</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => Alert.alert('Profile', 'Profile settings')}
          >
            <Ionicons name="person-outline" size={20} color="#404040" />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statDot, { backgroundColor: '#D97706' }]} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statDot, { backgroundColor: '#059669' }]} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statDot, { backgroundColor: '#0284C7' }]} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            {quickActions.map((action, i) => (
              <TouchableOpacity
                key={i}
                style={styles.actionCard}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIconWrap, { backgroundColor: action.bg }]}>
                  <Ionicons name={action.icon} size={22} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Text style={styles.actionDesc}>{action.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Impact Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Impact</Text>
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="trending-up-outline" size={28} color="#D4D4D4" />
            </View>
            <Text style={styles.emptyTitle}>Start making a difference</Text>
            <Text style={styles.emptyText}>
              Your impact data will appear here as you submit reports
            </Text>
          </View>
        </View>

        {/* Profile Card */}
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
              <Ionicons name="shield-checkmark-outline" size={18} color="#059669" />
              <Text style={styles.profileLabel}>Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Verified Citizen</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#DC2626" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating AI Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          console.log('AI chatbot button pressed from dashboard');
          navigation.navigate('CivicChatbot');
        }}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="robot-happy-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0A0A0A',
    letterSpacing: -0.3,
    marginBottom: 2,
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
  statsRow: {
    flexDirection: 'row',
    marginBottom: 28,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 2,
  },
  statLabel: {
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
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionCard: {
    width: cardWidth,
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
  actionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 12,
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
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
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
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    zIndex: 1000,
  },
});

export default CitizenDashboard;
