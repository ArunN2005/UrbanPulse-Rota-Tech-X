import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { CivicNoirTheme } from '../constants/theme';
import { pressFeedback } from '../components/civic/haptics';

type QueueItem = {
  id: string;
  phase: string;
  critical?: boolean;
  quarter: string;
  title: string;
  agency: string;
  status: string;
  statusTone: 'active' | 'pending' | 'scheduled';
  completion: string;
};

const QUEUE: QueueItem[] = [
  {
    id: 'sector-4-overhaul',
    phase: 'PHASE 1: CRITICAL INTERVENTION',
    critical: true,
    quarter: 'Q3 2026',
    title: 'Infrastructure Overhaul Sector 4',
    agency: 'Dept. of Urban Works',
    status: 'In Progress',
    statusTone: 'active',
    completion: 'Nov 15, 2026',
  },
  {
    id: 'sensor-network',
    phase: 'PHASE 2: DEPLOYMENT',
    quarter: 'Q4 2026',
    title: 'Civic Sensor Network Expansion',
    agency: 'Tech Initiative Board',
    status: 'Pending Approval',
    statusTone: 'pending',
    completion: 'Jan 20, 2027',
  },
  {
    id: 'allocation-assessment',
    phase: 'PHASE 3: REVIEW',
    quarter: 'Q1 2027',
    title: 'Annual Allocation Assessment',
    agency: 'Finance Committee',
    status: 'Scheduled',
    statusTone: 'scheduled',
    completion: 'Mar 01, 2027',
  },
];

const TONE_COLORS = {
  active: CivicNoirTheme.colors.danger,
  pending: CivicNoirTheme.colors.primary,
  scheduled: CivicNoirTheme.colors.outline,
} as const;

function QueueCard({ item, index }: { item: QueueItem; index: number }) {
  const toneColor = TONE_COLORS[item.statusTone];
  return (
    <Animated.View
      entering={FadeInUp.duration(CivicNoirTheme.motion.slow).delay(120 * index)}
      style={styles.timelineRow}
    >
      <View style={styles.timelineRail}>
        <View style={[styles.timelineDot, { backgroundColor: toneColor }]} />
        <View style={styles.timelineLine} />
      </View>
      <Pressable
        onPress={pressFeedback}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, ${item.status}, completion estimated ${item.completion}`}
        style={({ pressed }) => [styles.queueCard, pressed && styles.queueCardPressed]}
      >
        <View style={styles.queueCardTop}>
          <View style={[styles.phaseTag, item.critical && styles.phaseTagCritical]}>
            <Text style={[styles.phaseTagText, item.critical && styles.phaseTagTextCritical]}>{item.phase}</Text>
          </View>
          <Text style={styles.quarter}>{item.quarter}</Text>
        </View>
        <Text style={styles.queueTitle}>{item.title}</Text>
        <View style={styles.queueMetaRow}>
          <View style={styles.queueMetaCol}>
            <Text style={styles.metaLabel}>LEAD AGENCY</Text>
            <Text style={styles.metaValue}>{item.agency}</Text>
          </View>
          <View style={styles.queueMetaCol}>
            <Text style={styles.metaLabel}>STATUS</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: toneColor }]} />
              <Text style={styles.metaValue}>{item.status}</Text>
            </View>
          </View>
          <View style={styles.queueMetaCol}>
            <Text style={styles.metaLabel}>COMPLETION EST.</Text>
            <Text style={styles.metaValue}>{item.completion}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function AdminDashboardScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isDesktop = width >= 1024;

  const logout = () => {
    pressFeedback();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      {/* SideNavBar (Desktop Only) */}
      {isDesktop && (
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>CIVIC-REZO</Text>
            <Text style={styles.sidebarSubtitle}>Institutional Portal</Text>
          </View>
          <View style={styles.sidebarMenu}>
            <View style={styles.menuItemActive}>
              <MaterialIcons name="dashboard" size={24} color={CivicNoirTheme.colors.primary} />
              <Text style={styles.menuTextActive}>Dashboard</Text>
            </View>
            <Pressable style={styles.menuItem} onPress={pressFeedback}>
              <MaterialIcons name="group" size={24} color={CivicNoirTheme.colors.outline} />
              <Text style={styles.menuText}>Network</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={pressFeedback}>
              <MaterialIcons name="flag" size={24} color={CivicNoirTheme.colors.outline} />
              <Text style={styles.menuText}>Initiatives</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={pressFeedback}>
              <MaterialIcons name="forum" size={24} color={CivicNoirTheme.colors.outline} />
              <Text style={styles.menuText}>Civic Feed</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={pressFeedback}>
              <MaterialIcons name="settings" size={24} color={CivicNoirTheme.colors.outline} />
              <Text style={styles.menuText}>Settings</Text>
            </Pressable>
          </View>
          <Pressable style={styles.menuItem} onPress={logout} accessibilityLabel="Sign out">
            <MaterialIcons name="logout" size={24} color={CivicNoirTheme.colors.outline} />
            <Text style={styles.menuText}>Sign Out</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.mainContent}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12, paddingHorizontal: isDesktop ? 48 : 16 }]}>
          {!isDesktop && (
            <View>
              <Text style={styles.headerBrand}>CIVIC-REZO</Text>
              <Text style={styles.headerBrandSub}>OPERATIONS</Text>
            </View>
          )}
          <View style={styles.headerActions}>
            <Pressable
              style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
              onPress={pressFeedback}
              accessibilityLabel="Notifications"
            >
              <MaterialIcons name="notifications-none" size={24} color={CivicNoirTheme.colors.primary} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
              onPress={logout}
              accessibilityLabel="Sign out"
            >
              <MaterialIcons name="logout" size={22} color={CivicNoirTheme.colors.primary} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: isDesktop ? 48 : 16, paddingBottom: insets.bottom + 64 },
          ]}
        >
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Priority Queue</Text>
            <Text style={styles.pageDesc}>Operational Timeline & Phase Sequencing</Text>
          </View>

          <View style={styles.filterRow}>
            <Pressable
              onPress={pressFeedback}
              style={({ pressed }) => [styles.filterChip, pressed && styles.iconButtonPressed]}
            >
              <MaterialIcons name="filter-list" size={16} color={CivicNoirTheme.colors.primary} />
              <Text style={styles.filterChipText}>FILTER</Text>
            </Pressable>
            <Pressable
              onPress={pressFeedback}
              style={({ pressed }) => [styles.filterChip, pressed && styles.iconButtonPressed]}
            >
              <MaterialIcons name="swap-vert" size={16} color={CivicNoirTheme.colors.primary} />
              <Text style={styles.filterChipText}>SORT BY: PRIORITY</Text>
            </Pressable>
          </View>

          <View style={styles.timeline}>
            {QUEUE.map((item, i) => (
              <QueueCard key={item.id} item={item} index={i} />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: CivicNoirTheme.colors.surfaceBright,
  },
  sidebar: {
    width: 256,
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
    borderRightWidth: 1,
    borderRightColor: CivicNoirTheme.colors.outlineSoft,
    paddingTop: 48,
    paddingBottom: 24,
  },
  sidebarHeader: {
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  sidebarTitle: {
    fontFamily: CivicNoirTheme.typography.displayXl.fontFamily,
    fontSize: 20,
    color: CivicNoirTheme.colors.primary,
  },
  sidebarSubtitle: {
    ...CivicNoirTheme.typography.labelSm,
    color: CivicNoirTheme.colors.secondary,
    marginTop: 8,
  },
  sidebarMenu: {
    flex: 1,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 16,
  },
  menuItemActive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 24,
    gap: 16,
    borderLeftWidth: 2,
    borderLeftColor: CivicNoirTheme.colors.primary,
    backgroundColor: CivicNoirTheme.colors.surfaceBright,
  },
  menuText: {
    ...CivicNoirTheme.typography.labelMd,
    color: CivicNoirTheme.colors.outline,
  },
  menuTextActive: {
    ...CivicNoirTheme.typography.labelMd,
    color: CivicNoirTheme.colors.primary,
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: CivicNoirTheme.colors.outlineFaint,
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
  },
  headerBrand: {
    fontFamily: CivicNoirTheme.typography.displayXl.fontFamily,
    fontSize: 18,
    color: CivicNoirTheme.colors.primary,
  },
  headerBrandSub: {
    ...CivicNoirTheme.typography.labelSm,
    fontSize: 10,
    color: CivicNoirTheme.colors.secondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
  },
  iconButton: {
    width: CivicNoirTheme.hitTarget,
    height: CivicNoirTheme.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonPressed: {
    backgroundColor: CivicNoirTheme.colors.pressedWash,
  },
  scrollContent: {
    paddingTop: 32,
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },
  pageHeader: {
    marginBottom: 24,
  },
  pageTitle: {
    ...CivicNoirTheme.typography.headlineLg,
    color: CivicNoirTheme.colors.primary,
    marginBottom: 8,
  },
  pageDesc: {
    ...CivicNoirTheme.typography.bodyMd,
    color: CivicNoirTheme.colors.secondary,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outlineMedium,
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
    paddingHorizontal: 14,
    minHeight: 36,
  },
  filterChipText: {
    ...CivicNoirTheme.typography.labelSm,
    fontSize: 11,
    color: CivicNoirTheme.colors.primary,
  },
  timeline: {
    gap: 24,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 16,
  },
  timelineRail: {
    alignItems: 'center',
    width: 16,
    paddingTop: 24,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLine: {
    flex: 1,
    width: 1,
    backgroundColor: CivicNoirTheme.colors.outlineSoft,
    marginTop: 8,
  },
  queueCard: {
    flex: 1,
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outlineMedium,
    padding: 20,
    gap: 12,
  },
  queueCardPressed: {
    backgroundColor: CivicNoirTheme.colors.pressedWash,
  },
  queueCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  phaseTag: {
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outlineMedium,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  phaseTagCritical: {
    borderColor: CivicNoirTheme.colors.danger,
  },
  phaseTagText: {
    ...CivicNoirTheme.typography.labelSm,
    fontSize: 10,
    color: CivicNoirTheme.colors.secondary,
  },
  phaseTagTextCritical: {
    color: CivicNoirTheme.colors.danger,
  },
  quarter: {
    ...CivicNoirTheme.typography.labelSm,
    fontSize: 11,
    color: CivicNoirTheme.colors.outline,
  },
  queueTitle: {
    ...CivicNoirTheme.typography.headlineMd,
    fontSize: 26,
    color: CivicNoirTheme.colors.primary,
  },
  queueMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: CivicNoirTheme.colors.outlineSoft,
    paddingTop: 12,
  },
  queueMetaCol: {
    gap: 4,
    minWidth: 120,
  },
  metaLabel: {
    ...CivicNoirTheme.typography.labelSm,
    fontSize: 10,
    color: CivicNoirTheme.colors.outline,
  },
  metaValue: {
    fontFamily: CivicNoirTheme.typography.bodyMd.fontFamily,
    fontSize: 14,
    color: CivicNoirTheme.colors.primary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
