import React, { useState } from 'react';
import {
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
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { CivicNoirTheme } from '../constants/theme';
import { BackHeader } from '../components/civic/BackHeader';
import { NoirButton } from '../components/civic/NoirButton';
import { NoirInput } from '../components/civic/NoirInput';
import { pressFeedback, successFeedback } from '../components/civic/haptics';

type Category = {
  id: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
};

const CATEGORIES: Category[] = [
  { id: 'infrastructure', icon: 'construction', title: 'INFRASTRUCTURE', description: 'Potholes, broken sidewalks, streetlights.' },
  { id: 'sanitation', icon: 'delete', title: 'SANITATION', description: 'Missed collection, illegal dumping, graffiti.' },
  { id: 'parks', icon: 'park', title: 'PARKS & REC', description: 'Fallen trees, broken playground equipment.' },
  { id: 'traffic', icon: 'traffic', title: 'TRAFFIC & SAFETY', description: 'Signal failure, blocked lanes, hazards.' },
  { id: 'water', icon: 'water-drop', title: 'WATER SERVICES', description: 'Leaks, drainage issues, flooding.' },
  { id: 'other', icon: 'more-horiz', title: 'OTHER', description: 'General inquiries or undefined issues.' },
];

const STEPS = ['LOCATION & CATEGORY', 'DETAILS', 'REVIEW'] as const;

function StepIndicator({ current }: { current: number }) {
  return (
    <View style={styles.steps}>
      {STEPS.map((label, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <View key={label} style={styles.stepItem}>
            <View style={[styles.stepDot, (active || done) && styles.stepDotActive]}>
              {done ? (
                <MaterialIcons name="check" size={12} color={CivicNoirTheme.colors.onPrimary} />
              ) : (
                <Text style={[styles.stepNum, active && styles.stepNumActive]}>{i + 1}</Text>
              )}
            </View>
            <Text style={[styles.stepLabel, active && styles.stepLabelActive]} numberOfLines={1}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default function NewReportScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isWide = width >= 700;

  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState<{ location?: string; title?: string; details?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedCategory = CATEGORIES.find((c) => c.id === category);

  const nextFromStep1 = () => {
    if (!location.trim()) {
      setErrors({ location: 'Enter an address or landmark for the report.' });
      return;
    }
    setErrors({});
    setStep(1);
  };

  const nextFromStep2 = () => {
    const next: typeof errors = {};
    if (title.trim().length < 4) next.title = 'Give the report a short title.';
    if (details.trim().length < 12) next.details = 'Describe the issue in a bit more detail.';
    setErrors(next);
    if (Object.keys(next).length === 0) setStep(2);
  };

  const submit = () => {
    setSubmitting(true);
    // Simulated submission until the backend is wired up.
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      successFeedback();
    }, 1000);
  };

  if (submitted) {
    return (
      <View style={[styles.container, styles.successContainer, { paddingTop: insets.top }]}>
        <Animated.View entering={FadeIn.duration(CivicNoirTheme.motion.slow)} style={styles.successCard}>
          <View style={styles.successIcon}>
            <MaterialIcons name="check" size={48} color={CivicNoirTheme.colors.onPrimary} />
          </View>
          <Text style={styles.successTitle}>REPORT FILED</Text>
          <Text style={styles.successRef}>REF: CR-{Date.now().toString().slice(-6)}</Text>
          <Text style={styles.successDesc}>
            Your report has been routed to the {selectedCategory?.title ?? 'appropriate'} department. You can
            track its status from your Civic Feed.
          </Text>
          <NoirButton
            label="RETURN TO DASHBOARD"
            icon="arrow-forward"
            onPress={() => router.back()}
            style={styles.successBtn}
          />
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackHeader
        title="New Report"
        right={<Text style={styles.stepCounter}>{step + 1} / {STEPS.length}</Text>}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
          keyboardShouldPersistTaps="handled"
        >
          <StepIndicator current={step} />

          {step === 0 && (
            <Animated.View entering={FadeInDown.duration(CivicNoirTheme.motion.base)} style={styles.stepBody}>
              <Text style={styles.stepTitle}>Classify your report</Text>
              <Text style={styles.stepDesc}>
                Select the primary category that best describes the issue at the selected location to route it
                to the appropriate department.
              </Text>

              <NoirInput
                label="STEP 1: SELECT LOCATION"
                value={location}
                onChangeText={(t) => {
                  setLocation(t);
                  if (errors.location) setErrors({});
                }}
                placeholder="Enter an address or drop a pin..."
                icon="location-pin"
                autoCapitalize="words"
                error={errors.location}
              />

              <View style={[styles.categoryGrid, { flexDirection: isWide ? 'row' : 'column' }]}>
                {CATEGORIES.map((cat) => {
                  const selected = category === cat.id;
                  return (
                    <Pressable
                      key={cat.id}
                      onPress={() => {
                        pressFeedback();
                        setCategory(cat.id);
                      }}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      accessibilityLabel={`${cat.title}: ${cat.description}`}
                      style={({ pressed }) => [
                        styles.categoryCard,
                        isWide && styles.categoryCardWide,
                        selected && styles.categoryCardSelected,
                        pressed && styles.categoryCardPressed,
                      ]}
                    >
                      <View style={styles.categoryTop}>
                        <MaterialIcons name={cat.icon} size={24} color={CivicNoirTheme.colors.primary} />
                        <MaterialIcons
                          name={selected ? 'radio-button-checked' : 'radio-button-unchecked'}
                          size={20}
                          color={selected ? CivicNoirTheme.colors.primary : CivicNoirTheme.colors.outline}
                        />
                      </View>
                      <Text style={styles.categoryTitle}>{cat.title}</Text>
                      <Text style={styles.categoryDesc}>{cat.description}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <NoirButton
                label="CONTINUE TO DETAILS"
                icon="arrow-forward"
                onPress={nextFromStep1}
                disabled={!category}
              />
              {!category && <Text style={styles.hint}>Select a category to continue.</Text>}
            </Animated.View>
          )}

          {step === 1 && (
            <Animated.View entering={FadeInDown.duration(CivicNoirTheme.motion.base)} style={styles.stepBody}>
              <Text style={styles.stepTitle}>Describe the issue</Text>
              <Text style={styles.stepDesc}>
                Precise details help the {selectedCategory?.title ?? ''} department triage and dispatch faster.
              </Text>

              <NoirInput
                label="REPORT TITLE"
                value={title}
                onChangeText={(t) => {
                  setTitle(t);
                  if (errors.title) setErrors((e) => ({ ...e, title: undefined }));
                }}
                placeholder="e.g. Collapsed drain cover on 5th Ave"
                autoCapitalize="sentences"
                error={errors.title}
              />

              <NoirInput
                label="DETAILS"
                value={details}
                onChangeText={(t) => {
                  setDetails(t);
                  if (errors.details) setErrors((e) => ({ ...e, details: undefined }));
                }}
                placeholder="What did you observe? Since when? Any immediate risk?"
                autoCapitalize="sentences"
                multiline
                error={errors.details}
              />

              <Pressable
                onPress={pressFeedback}
                accessibilityRole="button"
                accessibilityLabel="Attach evidence (coming soon)"
                style={({ pressed }) => [styles.evidenceBox, pressed && styles.categoryCardPressed]}
              >
                <MaterialIcons name="add-a-photo" size={28} color={CivicNoirTheme.colors.outline} />
                <Text style={styles.evidenceText}>ATTACH EVIDENCE</Text>
                <Text style={styles.evidenceHint}>Photos strengthen your report (optional)</Text>
              </Pressable>

              <View style={styles.navRow}>
                <NoirButton label="BACK" variant="ghost" onPress={() => setStep(0)} style={styles.navBtn} />
                <NoirButton label="REVIEW" icon="arrow-forward" onPress={nextFromStep2} style={styles.navBtnWide} />
              </View>
            </Animated.View>
          )}

          {step === 2 && (
            <Animated.View entering={FadeInDown.duration(CivicNoirTheme.motion.base)} style={styles.stepBody}>
              <Text style={styles.stepTitle}>Review & submit</Text>
              <Text style={styles.stepDesc}>Confirm the report details before filing.</Text>

              <View style={styles.reviewCard}>
                {[
                  { label: 'CATEGORY', value: selectedCategory?.title ?? '—' },
                  { label: 'LOCATION', value: location },
                  { label: 'TITLE', value: title },
                  { label: 'DETAILS', value: details },
                ].map((row) => (
                  <View key={row.label} style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>{row.label}</Text>
                    <Text style={styles.reviewValue}>{row.value}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.navRow}>
                <NoirButton label="BACK" variant="ghost" onPress={() => setStep(1)} style={styles.navBtn} />
                <NoirButton
                  label="SUBMIT REPORT"
                  icon="send"
                  onPress={submit}
                  loading={submitting}
                  style={styles.navBtnWide}
                />
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CivicNoirTheme.colors.surfaceBright,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    maxWidth: 760,
    width: '100%',
    alignSelf: 'center',
  },
  stepCounter: {
    ...CivicNoirTheme.typography.labelSm,
    color: CivicNoirTheme.colors.secondary,
  },
  steps: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: CivicNoirTheme.colors.primary,
    borderColor: CivicNoirTheme.colors.primary,
  },
  stepNum: {
    ...CivicNoirTheme.typography.labelSm,
    fontSize: 11,
    color: CivicNoirTheme.colors.outline,
  },
  stepNumActive: {
    color: CivicNoirTheme.colors.onPrimary,
  },
  stepLabel: {
    ...CivicNoirTheme.typography.labelSm,
    fontSize: 10,
    color: CivicNoirTheme.colors.outline,
    flexShrink: 1,
  },
  stepLabelActive: {
    color: CivicNoirTheme.colors.primary,
  },
  stepBody: {
    gap: 24,
  },
  stepTitle: {
    ...CivicNoirTheme.typography.headlineLg,
    fontSize: 32,
    color: CivicNoirTheme.colors.primary,
  },
  stepDesc: {
    ...CivicNoirTheme.typography.bodyMd,
    color: CivicNoirTheme.colors.secondary,
    lineHeight: 24,
    marginTop: -8,
  },
  categoryGrid: {
    flexWrap: 'wrap',
    gap: 16,
  },
  categoryCard: {
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outlineMedium,
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
    padding: 20,
    gap: 8,
  },
  categoryCardWide: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  categoryCardSelected: {
    borderColor: CivicNoirTheme.colors.primary,
    borderWidth: 2,
    margin: -1,
  },
  categoryCardPressed: {
    backgroundColor: CivicNoirTheme.colors.pressedWash,
  },
  categoryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryTitle: {
    ...CivicNoirTheme.typography.labelMd,
    color: CivicNoirTheme.colors.primary,
    letterSpacing: 1,
  },
  categoryDesc: {
    fontFamily: CivicNoirTheme.typography.bodyMd.fontFamily,
    fontSize: 13,
    lineHeight: 19,
    color: CivicNoirTheme.colors.secondary,
  },
  hint: {
    ...CivicNoirTheme.typography.labelSm,
    color: CivicNoirTheme.colors.outline,
    textAlign: 'center',
    marginTop: -12,
    textTransform: 'none',
  },
  evidenceBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: CivicNoirTheme.colors.outline,
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
    alignItems: 'center',
    padding: 28,
    gap: 8,
  },
  evidenceText: {
    ...CivicNoirTheme.typography.labelSm,
    color: CivicNoirTheme.colors.primary,
  },
  evidenceHint: {
    fontFamily: CivicNoirTheme.typography.bodyMd.fontFamily,
    fontSize: 13,
    color: CivicNoirTheme.colors.outline,
  },
  navRow: {
    flexDirection: 'row',
    gap: 16,
  },
  navBtn: {
    flex: 1,
  },
  navBtnWide: {
    flex: 2,
  },
  reviewCard: {
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outlineMedium,
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
  },
  reviewRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: CivicNoirTheme.colors.outlineSoft,
    gap: 6,
  },
  reviewLabel: {
    ...CivicNoirTheme.typography.labelSm,
    color: CivicNoirTheme.colors.outline,
  },
  reviewValue: {
    ...CivicNoirTheme.typography.bodyMd,
    color: CivicNoirTheme.colors.primary,
    lineHeight: 24,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successCard: {
    alignItems: 'center',
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.primary,
    padding: 40,
    maxWidth: 480,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  successIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: CivicNoirTheme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    ...CivicNoirTheme.typography.headlineLg,
    fontSize: 28,
    color: CivicNoirTheme.colors.primary,
  },
  successRef: {
    ...CivicNoirTheme.typography.labelSm,
    color: CivicNoirTheme.colors.secondary,
    marginTop: 8,
  },
  successDesc: {
    ...CivicNoirTheme.typography.bodyMd,
    color: CivicNoirTheme.colors.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 16,
    marginBottom: 32,
  },
  successBtn: {
    alignSelf: 'stretch',
  },
});
