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

export default function AdminAuthScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isDesktop = width >= 1024;

  const [operatorId, setOperatorId] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [errors, setErrors] = useState<{ operatorId?: string; securityKey?: string; mfaToken?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!operatorId.trim()) next.operatorId = 'Operator ID is required.';
    if (securityKey.length < 8) next.securityKey = 'Security key must be at least 8 characters.';
    if (mfaToken && !/^\d{6}$/.test(mfaToken.replace(/\s/g, ''))) {
      next.mfaToken = 'MFA token must be 6 digits.';
    }
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
      router.replace('/admin-dashboard');
    }, 900);
  };

  return (
    <View style={[styles.container, { padding: isDesktop ? 64 : 0 }]}>
      <View style={styles.wrapper}>
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
                  <Text style={styles.badgeText}>Privileged Access</Text>
                </View>
                <View style={styles.descContainer}>
                  <Text style={styles.descText}>
                    Authorized personnel only. Monitoring, dispatch, and system management protocols active.
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
                  <Text style={styles.mobileSubtitle}>Privileged Access</Text>
                </View>
              )}

              <View style={styles.headerBox}>
                <MaterialIcons name="shield" size={18} color={CivicNoirTheme.colors.primary} />
                <Text style={styles.headerBoxTitle}>ADMINISTRATOR AUTH</Text>
              </View>

              {/* Auth Form */}
              <View style={styles.formContainer}>
                <NoirInput
                  label="OPERATOR ID"
                  value={operatorId}
                  onChangeText={(t) => {
                    setOperatorId(t);
                    if (errors.operatorId) setErrors((e) => ({ ...e, operatorId: undefined }));
                  }}
                  placeholder="Enter operator credential"
                  icon="security"
                  error={errors.operatorId}
                />

                <NoirInput
                  label="SECURITY KEY"
                  value={securityKey}
                  onChangeText={(t) => {
                    setSecurityKey(t);
                    if (errors.securityKey) setErrors((e) => ({ ...e, securityKey: undefined }));
                  }}
                  placeholder="Minimum 8 characters"
                  secure
                  error={errors.securityKey}
                />

                <NoirInput
                  label="MFA TOKEN (OPTIONAL)"
                  value={mfaToken}
                  onChangeText={(t) => {
                    setMfaToken(t);
                    if (errors.mfaToken) setErrors((e) => ({ ...e, mfaToken: undefined }));
                  }}
                  placeholder="000 000"
                  icon="dialpad"
                  keyboardType="number-pad"
                  error={errors.mfaToken}
                />

                <NoirButton
                  label="INITIALIZE SESSION"
                  icon="arrow-forward"
                  onPress={submit}
                  loading={submitting}
                  style={styles.submitButton}
                />
              </View>

              <View style={styles.securityFooter}>
                <MaterialIcons name="lock" size={16} color={CivicNoirTheme.colors.outline} />
                <Text style={styles.securityText}>All access attempts are logged and audited</Text>
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
    backgroundColor: CivicNoirTheme.colors.primary,
    padding: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    ...CivicNoirTheme.typography.headlineMd,
    color: CivicNoirTheme.colors.onPrimary,
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
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: CivicNoirTheme.colors.outline,
    paddingBottom: 16,
    marginBottom: 32,
  },
  headerBoxTitle: {
    ...CivicNoirTheme.typography.labelSm,
    fontSize: 16,
    letterSpacing: 2,
    color: CivicNoirTheme.colors.primary,
  },
  formContainer: {
    gap: 24,
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
