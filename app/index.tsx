import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CivicNoirTheme } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Branding Identity Anchor */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBox}>
            <MaterialIcons name="architecture" size={64} color={CivicNoirTheme.colors.primary} />
          </View>
          <Text style={styles.title}>CIVIC-REZO</Text>
          <View style={styles.separator} />
          <Text style={styles.subtitle}>Institutional Portal</Text>
        </View>

        {/* Entry Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionCard} 
            activeOpacity={0.8}
            onPress={() => router.push('/citizen-auth')}
          >
            <MaterialIcons name="vpn-key" size={40} color={CivicNoirTheme.colors.primary} style={styles.actionIcon} />
            <Text style={styles.actionText}>CITIZEN PORTAL</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard} 
            activeOpacity={0.8}
            onPress={() => router.push('/admin-auth')}
          >
            <MaterialIcons name="admin-panel-settings" size={40} color={CivicNoirTheme.colors.primary} style={styles.actionIcon} />
            <Text style={styles.actionText}>ADMIN ACCESS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
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
    zIndex: 10,
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
    fontFamily: CivicNoirTheme.typography.displayXl.fontFamily,
    fontSize: CivicNoirTheme.typography.displayXl.fontSize >= 40 ? 40 : CivicNoirTheme.typography.displayXl.fontSize,
    fontWeight: '700',
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
    fontFamily: CivicNoirTheme.typography.headlineMd.fontFamily,
    fontSize: CivicNoirTheme.typography.headlineMd.fontSize,
    fontWeight: '500',
    color: CivicNoirTheme.colors.secondary,
  },
  actionsContainer: {
    flexDirection: width > 600 ? 'row' : 'column',
    width: '100%',
    maxWidth: 800,
    gap: CivicNoirTheme.spacing.gutter,
  },
  actionCard: {
    flex: 1,
    padding: 48,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.primary,
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    marginBottom: 24,
  },
  actionText: {
    fontFamily: CivicNoirTheme.typography.labelSm.fontFamily,
    fontSize: CivicNoirTheme.typography.labelSm.fontSize,
    fontWeight: '600',
    letterSpacing: CivicNoirTheme.typography.labelSm.letterSpacing,
    color: CivicNoirTheme.colors.primary,
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: CivicNoirTheme.typography.labelSm.fontFamily,
    fontSize: CivicNoirTheme.typography.labelSm.fontSize,
    color: CivicNoirTheme.colors.outline,
    letterSpacing: CivicNoirTheme.typography.labelSm.letterSpacing,
  }
});
