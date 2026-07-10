import React, { useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CivicNoirTheme } from '../constants/theme';
import { NoirButton } from '../components/civic/NoirButton';
import { NoirInput } from '../components/civic/NoirInput';
import { pressFeedback, successFeedback } from '../components/civic/haptics';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function CitizenAuthScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isDesktop = width >= 1024;

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSession, setKeepSession] = useState(true);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const isRegister = activeTab === 'register';

  const switchTab = (tab: 'login' | 'register') => {
    pressFeedback();
    setActiveTab(tab);
    setErrors({});
  };

  const validate = () => {
    const next: typeof errors = {};
    if (isRegister && fullName.trim().length < 2) next.fullName = 'Enter your full name.';
    if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid citizen ID or email address.';
    if (password.length < 8) next.password = 'Access key must be at least 8 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setSubmitting(true);
    // Simulated auth handshake until the backend is wired up.
    setTimeout(() => {
      setSubmitting(false);
      successFeedback();
      router.replace('/citizen-dashboard');
    }, 900);
  };

  return (
    <View style={[styles.container, { padding: isDesktop ? 64 : 0 }]}>
      <View style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>
        {/* Architectural Branding Panel (Left on Desktop) */}
        {isDesktop && (
          <View style={styles.leftPanel}>
            <ImageBackground
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6jEyFaXECpYywiqQ9saq-3YjQVlw9K_apSRhD6B83HcKW0sE3TfV72-l3tKMCs91XcQ_3YSC70-ON1jbHbC1whcXI5ewjuKRaJnBzSe0Xx5mlHwHRfymyoL5_HdB5BdHCo33RpL9N1NZzLUIaVbUTPE-GwEoTzwBOL7KoqOlCClHUJWMXdPL__8s3lGj2hO_saWMhDjYDfLvDfvQijgqmjwbOvJ5-Qwa6me0aAnpqDS_1YAzIuLnZVn7aodOxqLsyx_AeRASm3NfR' }}
              style={styles.backgroundImage}
              imageStyle={styles.backgroundImageInner}
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
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.rightPanel}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            {/* Back to portal selection */}
            <Pressable
              onPress={() => {
                pressFeedback();
                if (router.canGoBack()) router.back();
                else router.replace('/');
              }}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Back to portal selection"
              style={({ pressed }) => [styles.backLink, pressed && styles.backLinkPressed]}
            >
              <MaterialIcons name="arrow-back" size={18} color={CivicNoirTheme.colors.secondary} />
              <Text style={styles.backLinkText}>PORTAL SELECTION</Text>
            </Pressable>

            <Animated.View
              entering={FadeInDown.duration(CivicNoirTheme.motion.base)}
              style={[styles.authCard, isDesktop && styles.authCardDesktop]}
            >
              {!isDesktop && (
                <View style={styles.mobileHeader}>
                  <Text style={styles.mobileTitle}>CIVIC-REZO</Text>
                  <Text style={styles.mobileSubtitle}>Secure Citizen Access</Text>
                </View>
              )}

              {/* Unified Tab Switcher */}
              <View style={styles.tabContainer}>
                <Pressable
                  style={[styles.tabButton, !isRegister && styles.tabActive]}
                  onPress={() => switchTab('login')}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: !isRegister }}
                >
                  <Text style={[styles.tabText, !isRegister && styles.tabTextActive]}>LOGIN</Text>
                </Pressable>
                <Pressable
                  style={[styles.tabButton, isRegister && styles.tabActive]}
                  onPress={() => switchTab('register')}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isRegister }}
                >
                  <Text style={[styles.tabText, isRegister && styles.tabTextActive]}>REGISTER</Text>
                </Pressable>
              </View>

              {/* Auth Form */}
              <View style={styles.formContainer}>
                {isRegister && (
                  <NoirInput
                    label="FULL NAME"
                    value={fullName}
                    onChangeText={(t) => {
                      setFullName(t);
                      if (errors.fullName) setErrors((e) => ({ ...e, fullName: undefined }));
                    }}
                    placeholder="As registered with the municipality"
                    icon="person"
                    autoCapitalize="words"
                    error={errors.fullName}
                  />
                )}

                <NoirInput
                  label="CITIZEN ID / EMAIL"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
                  }}
                  placeholder="Enter your credentials"
                  icon="badge"
                  keyboardType="email-address"
                  error={errors.email}
                />

                <NoirInput
                  label="ACCESS KEY"
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
                  }}
                  placeholder="Minimum 8 characters"
                  secure
                  error={errors.password}
                />

                <View style={styles.optionsRow}>
                  <Pressable
                    style={styles.checkboxGroup}
                    onPress={() => {
                      pressFeedback();
                      setKeepSession(!keepSession);
                    }}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: keepSession }}
                    hitSlop={8}
                  >
                    <View style={[styles.checkbox, keepSession && styles.checkboxChecked]}>
                      {keepSession && (
                        <MaterialIcons name="check" size={14} color={CivicNoirTheme.colors.onPrimary} />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>Maintain Session</Text>
                  </Pressable>
                  {!isRegister && (
                    <Pressable hitSlop={8} onPress={pressFeedback}>
                      <Text style={styles.recoverLink}>RECOVER KEY</Text>
                    </Pressable>
                  )}
                </View>

                <NoirButton
                  label={isRegister ? 'CREATE CITIZEN RECORD' : 'AUTHENTICATE SESSION'}
                  icon="arrow-forward"
                  onPress={submit}
                  loading={submitting}
                  style={styles.submitButton}
                />
              </View>

              <View style={styles.securityFooter}>
                <MaterialIcons name="lock" size={16} color={CivicNoirTheme.colors.outline} />
                <Text style={styles.securityText}>Protected by Civic Protocol 256-bit encryption</Text>
              </View>
            </Animated.View>
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
  },
  wrapper: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
    maxWidth: 1440,
  },
  wrapperDesktop: {
    minHeight: 700,
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
  backgroundImageInner: {
    opacity: 0.4,
  },
  leftContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  brandTitle: {
    ...CivicNoirTheme.typography.displayXl,
    color: CivicNoirTheme.colors.primary,
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
    ...CivicNoirTheme.typography.headlineMd,
    color: CivicNoirTheme.colors.primary,
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
    ...CivicNoirTheme.typography.bodyMd,
    color: CivicNoirTheme.colors.primary,
    lineHeight: 24,
  },
  rightPanel: {
    flex: 5,
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingVertical: 12,
    marginBottom: 8,
  },
  backLinkPressed: {
    opacity: 0.6,
  },
  backLinkText: {
    ...CivicNoirTheme.typography.labelSm,
    color: CivicNoirTheme.colors.secondary,
  },
  authCard: {
    backgroundColor: CivicNoirTheme.colors.surfaceBright,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.primary,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  authCardDesktop: {
    marginLeft: -32,
    marginTop: 64,
    padding: 48,
    shadowOpacity: 0,
    elevation: 0,
  },
  mobileHeader: {
    marginBottom: 24,
  },
  mobileTitle: {
    ...CivicNoirTheme.typography.headlineLg,
    fontSize: 32,
    color: CivicNoirTheme.colors.primary,
  },
  mobileSubtitle: {
    ...CivicNoirTheme.typography.bodyMd,
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
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  tabActive: {
    borderBottomColor: CivicNoirTheme.colors.primary,
  },
  tabText: {
    ...CivicNoirTheme.typography.labelSm,
    color: CivicNoirTheme.colors.outline,
  },
  tabTextActive: {
    color: CivicNoirTheme.colors.primary,
  },
  formContainer: {
    gap: 24,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 32,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: CivicNoirTheme.colors.primary,
    borderColor: CivicNoirTheme.colors.primary,
  },
  checkboxLabel: {
    ...CivicNoirTheme.typography.bodyMd,
    color: CivicNoirTheme.colors.secondary,
  },
  recoverLink: {
    ...CivicNoirTheme.typography.labelSm,
    color: CivicNoirTheme.colors.primary,
    textDecorationLine: 'underline',
  },
  submitButton: {
    marginTop: 8,
  },
  securityFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: CivicNoirTheme.colors.outlineFaint,
  },
  securityText: {
    fontFamily: CivicNoirTheme.typography.bodyMd.fontFamily,
    fontSize: 14,
    color: CivicNoirTheme.colors.outline,
  },
});
