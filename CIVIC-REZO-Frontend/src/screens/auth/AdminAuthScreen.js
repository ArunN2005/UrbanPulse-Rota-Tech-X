import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdminAuthScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      <View style={styles.content}>
        {/* Nav */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={22} color="#171717" />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Ionicons name="briefcase-outline" size={28} color="#334155" />
          </View>
          <Text style={styles.title}>Admin Portal</Text>
          <Text style={styles.subtitle}>
            Manage and oversee civic operations
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('AdminLogin')}
            activeOpacity={0.8}
          >
            <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Admin Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('AdminSignup')}
            activeOpacity={0.8}
          >
            <Ionicons name="person-add-outline" size={20} color="#334155" />
            <Text style={styles.secondaryButtonText}>Register as Admin</Text>
          </TouchableOpacity>
        </View>

        {/* Notice */}
        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={18} color="#D97706" />
          <Text style={styles.noticeText}>
            Admin accounts require approval from system administrators
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <Text style={styles.featuresLabel}>Admin capabilities</Text>

          {[
            { icon: 'list-outline', text: 'Manage all citizen complaints' },
            { icon: 'flash-outline', text: 'Priority queue management' },
            { icon: 'people-outline', text: 'User management system' },
            { icon: 'stats-chart-outline', text: 'Analytics and reporting' },
            { icon: 'map-outline', text: 'City-wide complaint heatmaps' },
          ].map((item, i) => (
            <View key={i} style={styles.featureRow}>
              <Ionicons name={item.icon} size={18} color="#334155" />
              <Text style={styles.featureText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0A0A0A',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#737373',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  actions: {
    marginBottom: 16,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#334155',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 8,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 14,
    borderRadius: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  noticeText: {
    fontSize: 13,
    color: '#92400E',
    flex: 1,
    marginLeft: 10,
    lineHeight: 18,
  },
  features: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  featuresLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#737373',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
  },
  featureText: {
    fontSize: 15,
    color: '#404040',
    marginLeft: 12,
  },
});

export default AdminAuthScreen;
