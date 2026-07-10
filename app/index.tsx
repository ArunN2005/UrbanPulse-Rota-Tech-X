import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { CivicNoirTheme } from '../constants/theme';
import { pressFeedback } from '../components/civic/haptics';

type PortalCardProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
  delay: number;
};

function PortalCard({ icon, title, description, onPress, delay }: PortalCardProps) {
  return (
    <Animated.View entering={FadeInDown.duration(CivicNoirTheme.motion.slow).delay(delay)} style={styles.cardWrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityHint={description}
        onPress={() => {
          pressFeedback();
          onPress();
        }}
        style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
      >
        <MaterialIcons name={icon} size={40} color={CivicNoirTheme.colors.primary} />
        <View style={styles.cardTextBlock}>
          <Text style={styles.actionText}>{title}</Text>
          <Text style={styles.actionDesc}>{description}</Text>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.cardFooterText}>ENTER</Text>
          <MaterialIcons name="arrow-forward" size={16} color={CivicNoirTheme.colors.primary} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isWide = width > 600;

  return (
    <View style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top }]}>
        {/* Branding Identity Anchor */}
        <Animated.View entering={FadeIn.duration(CivicNoirTheme.motion.slow)} style={styles.brandContainer}>
          <View style={styles.logoBox}>
            <MaterialIcons name="architecture" size={64} color={CivicNoirTheme.colors.primary} />
          </View>
          <Text style={styles.title}>CIVIC-REZO</Text>
          <View style={styles.separator} />
          <Text style={styles.subtitle}>Institutional Portal</Text>
        </Animated.View>

        {/* Entry Actions */}
        <View style={[styles.actionsContainer, { flexDirection: isWide ? 'row' : 'column' }]}>
          <PortalCard
            icon="vpn-key"
            title="CITIZEN PORTAL"
            description="Report issues, follow initiatives, and engage with your district."
            onPress={() => router.push('/citizen-auth')}
            delay={200}
          />
          <PortalCard
            icon="admin-panel-settings"
            title="ADMIN ACCESS"
            description="Operations, dispatch, and priority queue management."
            onPress={() => router.push('/admin-auth')}
            delay={320}
          />
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.footerText}>SYSTEM ARCHITECTURE VALIDATED</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CivicNoirTheme.colors.surfaceBright,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: CivicNoirTheme.spacing.stackLg,
  },
  logoBox: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.primary,
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  title: {
    ...CivicNoirTheme.typography.displayXl,
    fontSize: 40,
    color: CivicNoirTheme.colors.primary,
    textTransform: 'uppercase',
  },
  separator: {
    height: 1,
    width: 64,
    backgroundColor: CivicNoirTheme.colors.primary,
    marginVertical: 24,
  },
  subtitle: {
    ...CivicNoirTheme.typography.headlineMd,
    color: CivicNoirTheme.colors.secondary,
  },
  actionsContainer: {
    width: '100%',
    maxWidth: 800,
    gap: CivicNoirTheme.spacing.gutter,
  },
  cardWrap: {
    flex: 1,
  },
  actionCard: {
    padding: 32,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.primary,
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
    alignItems: 'center',
    gap: 20,
  },
  actionCardPressed: {
    backgroundColor: CivicNoirTheme.colors.pressedWash,
    transform: [{ scale: 0.99 }],
  },
  cardTextBlock: {
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    ...CivicNoirTheme.typography.labelSm,
    color: CivicNoirTheme.colors.primary,
    textTransform: 'uppercase',
  },
  actionDesc: {
    fontFamily: CivicNoirTheme.typography.bodyMd.fontFamily,
    fontSize: 14,
    lineHeight: 21,
    color: CivicNoirTheme.colors.secondary,
    textAlign: 'center',
    maxWidth: 260,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: CivicNoirTheme.colors.outlineSoft,
    paddingTop: 16,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  cardFooterText: {
    ...CivicNoirTheme.typography.labelSm,
    color: CivicNoirTheme.colors.primary,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    ...CivicNoirTheme.typography.labelSm,
    color: CivicNoirTheme.colors.outline,
  },
});
