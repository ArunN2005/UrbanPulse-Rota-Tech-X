import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CivicNoirTheme } from '../constants/theme';

const { width } = Dimensions.get('window');
const isDesktop = width >= 1024;

export default function CitizenAuthScreen() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        
        {/* Architectural Branding Panel (Left on Desktop) */}
        {isDesktop && (
          <View style={styles.leftPanel}>
            <ImageBackground 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6jEyFaXECpYywiqQ9saq-3YjQVlw9K_apSRhD6B83HcKW0sE3TfV72-l3tKMCs91XcQ_3YSC70-ON1jbHbC1whcXI5ewjuKRaJnBzSe0Xx5mlHwHRfymyoL5_HdB5BdHCo33RpL9N1NZzLUIaVbUTPE-GwEoTzwBOL7KoqOlCClHUJWMXdPL__8s3lGj2hO_saWMhDjYDfLvDfvQijgqmjwbOvJ5-Qwa6me0aAnpqDS_1YAzIuLnZVn7aodOxqLsyx_AeRASm3NfR' }}
              style={styles.backgroundImage}
              imageStyle={{ opacity: 0.4, tintColor: 'gray' }}
            >
              <View style={styles.leftContent}>
                <Text style={styles.brandTitle}>CIVIC{'\n'}REZO</Text>
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>Secure Citizen Access</Text>
                </View>
                <View style={styles.descContainer}>
                  <Text style={styles.descText}>
                    Institutional portal for secure identity verification and civic engagement. Restricted access.
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </View>
        )}

        {/* Auth Functional Canvas (Right) */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.rightPanel}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={[styles.authCard, isDesktop && styles.authCardDesktop]}>
              
              {!isDesktop && (
                <View style={styles.mobileHeader}>
                  <Text style={styles.mobileTitle}>CIVIC-REZO</Text>
                  <Text style={styles.mobileSubtitle}>Secure Citizen Access</Text>
                </View>
              )}

              {/* Unified Tab Switcher */}
              <View style={styles.tabContainer}>
                <TouchableOpacity 
                  style={[styles.tabButton, activeTab === 'login' && styles.tabActive]}
                  onPress={() => setActiveTab('login')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, activeTab === 'login' && styles.tabTextActive]}>LOGIN</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tabButton, activeTab === 'register' && styles.tabActive]}
                  onPress={() => setActiveTab('register')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, activeTab === 'register' && styles.tabTextActive]}>REGISTER</Text>
                </TouchableOpacity>
              </View>

              {/* Auth Form */}
              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>CITIZEN ID / EMAIL</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput 
                      style={styles.input}
                      placeholder="Enter your credentials"
                      placeholderTextColor={CivicNoirTheme.colors.outline}
                    />
                    <MaterialIcons name="badge" size={24} color={CivicNoirTheme.colors.outline} style={styles.inputIcon} />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>ACCESS KEY</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput 
                      style={styles.input}
                      placeholder="••••••••••••"
                      placeholderTextColor={CivicNoirTheme.colors.outline}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.inputIcon}>
                      <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color={CivicNoirTheme.colors.outline} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.optionsRow}>
                  <TouchableOpacity style={styles.checkboxGroup} activeOpacity={0.8}>
                    <View style={styles.checkbox}></View>
                    <Text style={styles.checkboxLabel}>Maintain Session</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={styles.recoverLink}>RECOVER KEY</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={styles.submitButton} 
                  activeOpacity={0.9}
                  onPress={() => router.replace('/citizen-dashboard')}
                >
                  <Text style={styles.submitText}>AUTHENTICATE SESSION</Text>
                  <MaterialIcons name="arrow-forward" size={24} color={CivicNoirTheme.colors.onPrimary} />
                </TouchableOpacity>
              </View>

              <View style={styles.securityFooter}>
                <MaterialIcons name="lock" size={16} color={CivicNoirTheme.colors.outline} />
                <Text style={styles.securityText}>Protected by Civic Protocol 256-bit encryption</Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CivicNoirTheme.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    padding: isDesktop ? 64 : 16,
  },
  wrapper: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 1440,
    height: isDesktop ? '100%' : 'auto',
    minHeight: isDesktop ? 700 : 0,
  },
  leftPanel: {
    flex: 7,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.primary,
    backgroundColor: CivicNoirTheme.colors.surfaceBright,
    overflow: 'hidden',
  },
  backgroundImage: {
    flex: 1,
    padding: 64,
    backgroundColor: CivicNoirTheme.colors.surfaceContainerHigh,
  },
  leftContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  brandTitle: {
    fontFamily: CivicNoirTheme.typography.displayXl.fontFamily,
    fontSize: 72,
    fontWeight: '700',
    color: CivicNoirTheme.colors.primary,
    letterSpacing: -2.88,
  },
  badgeContainer: {
    backgroundColor: CivicNoirTheme.colors.surfaceBright,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.primary,
    padding: 16,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    marginBottom: 8,
  },
  badgeText: {
    fontFamily: CivicNoirTheme.typography.headlineMd.fontFamily,
    fontSize: 24,
    color: CivicNoirTheme.colors.primary,
    fontWeight: '500',
  },
  descContainer: {
    backgroundColor: CivicNoirTheme.colors.surfaceBright,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.primary,
    padding: 16,
    alignSelf: 'flex-start',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  descText: {
    fontFamily: CivicNoirTheme.typography.bodyMd.fontFamily,
    fontSize: 16,
    color: CivicNoirTheme.colors.primary,
    lineHeight: 24,
  },
  rightPanel: {
    flex: isDesktop ? 5 : 1,
    justifyContent: 'center',
    zIndex: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  authCard: {
    backgroundColor: CivicNoirTheme.colors.surfaceBright,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.primary,
    padding: isDesktop ? 48 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  authCardDesktop: {
    marginLeft: -32,
    marginTop: 64,
    shadowOpacity: 0,
    elevation: 0,
  },
  mobileHeader: {
    marginBottom: 24,
  },
  mobileTitle: {
    fontFamily: CivicNoirTheme.typography.headlineLg.fontFamily,
    fontSize: 32,
    fontWeight: '600',
    color: CivicNoirTheme.colors.primary,
  },
  mobileSubtitle: {
    fontFamily: CivicNoirTheme.typography.bodyMd.fontFamily,
    fontSize: 16,
    color: CivicNoirTheme.colors.secondary,
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: CivicNoirTheme.colors.outline,
    marginBottom: 32,
  },
  tabButton: {
    flex: 1,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: CivicNoirTheme.colors.primary,
  },
  tabText: {
    fontFamily: CivicNoirTheme.typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    color: CivicNoirTheme.colors.outline,
  },
  tabTextActive: {
    color: CivicNoirTheme.colors.primary,
  },
  formContainer: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontFamily: CivicNoirTheme.typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    color: CivicNoirTheme.colors.primary,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outline,
    padding: 16,
    fontFamily: CivicNoirTheme.typography.bodyMd.fontFamily,
    fontSize: 16,
    color: CivicNoirTheme.colors.primary,
    backgroundColor: 'transparent',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  checkboxGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outline,
  },
  checkboxLabel: {
    fontFamily: CivicNoirTheme.typography.bodyMd.fontFamily,
    fontSize: 16,
    color: CivicNoirTheme.colors.secondary,
  },
  recoverLink: {
    fontFamily: CivicNoirTheme.typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    color: CivicNoirTheme.colors.primary,
    textDecorationLine: 'underline',
  },
  submitButton: {
    backgroundColor: CivicNoirTheme.colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  submitText: {
    fontFamily: CivicNoirTheme.typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    color: CivicNoirTheme.colors.onPrimary,
  },
  securityFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: CivicNoirTheme.colors.outline + '40',
  },
  securityText: {
    fontFamily: CivicNoirTheme.typography.bodyMd.fontFamily,
    fontSize: 14,
    color: CivicNoirTheme.colors.outline,
  }
});
