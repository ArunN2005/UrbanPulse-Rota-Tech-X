import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      <View style={styles.content}>
        {/* Brand Section */}
        <View style={styles.brandSection}>
          <View style={styles.logoMark}>
            <Ionicons name="shield-checkmark" size={32} color="#0F766E" />
          </View>
          <Text style={styles.brandName}>CivicStack</Text>
          <Text style={styles.tagline}>
            Your voice shapes your city.
          </Text>
        </View>

        {/* Role Selection */}
        <View style={styles.roleSection}>
          <Text style={styles.sectionLabel}>Continue as</Text>

          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => navigation.navigate('CitizenAuth')}
            activeOpacity={0.7}
          >
            <View style={styles.roleIconWrap}>
              <Ionicons name="person-outline" size={22} color="#0F766E" />
            </View>
            <View style={styles.roleTextWrap}>
              <Text style={styles.roleTitle}>Citizen</Text>
              <Text style={styles.roleDesc}>Report issues & track progress</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#D4D4D4" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => navigation.navigate('AdminAuth')}
            activeOpacity={0.7}
          >
            <View style={[styles.roleIconWrap, styles.adminIconWrap]}>
              <Ionicons name="briefcase-outline" size={22} color="#334155" />
            </View>
            <View style={styles.roleTextWrap}>
              <Text style={styles.roleTitle}>Administrator</Text>
              <Text style={styles.roleDesc}>Manage complaints & operations</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#D4D4D4" />
          </TouchableOpacity>
        </View>

        {/* Highlights */}
        <View style={styles.highlights}>
          <View style={styles.highlightRow}>
            <Ionicons name="sparkles-outline" size={16} color="#737373" />
            <Text style={styles.highlightText}>AI-powered complaint analysis</Text>
          </View>
          <View style={styles.highlightRow}>
            <Ionicons name="location-outline" size={16} color="#737373" />
            <Text style={styles.highlightText}>Location-aware reporting</Text>
          </View>
          <View style={styles.highlightRow}>
            <Ionicons name="language-outline" size={16} color="#737373" />
            <Text style={styles.highlightText}>Multilingual support</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Built for transparent governance</Text>
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
    justifyContent: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0A0A0A',
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    color: '#737373',
    textAlign: 'center',
  },
  roleSection: {
    marginBottom: 40,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#737373',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginLeft: 4,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  roleIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  adminIconWrap: {
    backgroundColor: '#F1F5F9',
  },
  roleTextWrap: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 2,
  },
  roleDesc: {
    fontSize: 13,
    color: '#737373',
  },
  highlights: {
    paddingHorizontal: 4,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  highlightText: {
    fontSize: 14,
    color: '#737373',
    marginLeft: 10,
  },
  footer: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#D4D4D4',
  },
});

export default WelcomeScreen;
