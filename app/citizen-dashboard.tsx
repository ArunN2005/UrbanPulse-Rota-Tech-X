import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { CivicNoirTheme } from '../constants/theme';
import { NoirButton } from '../components/civic/NoirButton';
import { pressFeedback } from '../components/civic/haptics';

type FeedItem = {
  id: string;
  author: string;
  initials?: string;
  avatar?: string;
  meta: string;
  headline?: string;
  body?: string;
  image?: string;
  location?: string;
  appreciations: number;
  comments: number;
};

const FEED: FeedItem[] = [
  {
    id: 'riverfront-phase-2',
    author: 'Elena Rostova',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAMlDd9WEIC2-g7pfl-IApjtk-P3Jx2H9EIAuds_zGLUdgx7MOfp6yQa7Nb253WdFw3AgKBKeMYH7jZcGysl7hZaauhGUJo7T7P6HnqzszOipgMaYCVWBZoFMtrozsQ3nK3tZGUbiUqD3AA3BqvKOWK5k01ZPDBnDnDAhyqrDzq--1UDc1wLIDV67tULAeCsfFh_eOC4g_wWfag5YevMpYUJKBfzdWHLWEq5wFV-9C9-P3vN0717SCKgARyKuKJMDgOSFv8_AodsrA7',
    meta: 'Infrastructure Dept • 2h ago',
    body: "Phase 2 of the Riverfront Revitalization project is officially underway. We've completed the foundational grading and are moving onto installing the new structural pathways.",
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAtpQgjtluZuPA6JboJpDidvNgyHxmYTf0kWP73IG8p155YsVDOWEJS4w9BDTTBdCrVmejYoWKrYWf5AX8wzyaMh2q2VHA6z9-Hhh4s8a6OJ8Bwsy8OeB7rvYUx_KSz4dZ_8UjP1MujeXaZeGaUXbGxb7uNgpckLGxjCcR_8WJ7SL3p_o0jnsVrI4pTRX2TuuWBBTan4jLWNcFWX_3rEuR7xJvM6_rPUABMw2NknLAnqqTBQVjsZDLGsGswEVspS6IIzhuKAtRX3QV9',
    location: 'Riverfront District',
    appreciations: 27,
    comments: 4,
  },
  {
    id: 'zoning-sector-4',
    author: 'Citizens Watch',
    initials: 'CW',
    meta: 'Community Group • 5h ago',
    headline: 'Proposed Zoning Adjustments: Sector 4',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCRUcjeEs3xTaxjZe2WJbckEPJUzzrszDmwcj6tvj5dMviiJw-ewtg4LRP-1B-JW9E406lDHxuKpHX1puypw4Vs6l1V--FIR2NEvFS5463x5qEox5wOscMl7eL7BWnvYSVw6_tzoB3O80GUi6IhR_Lssteue1H3xRQ1mw0OtAz5DwbbtFc5l7F8m_jf-lt47zv2pLUg_CVosFnJQTk0j4_aVz51zJE1LJTiCrYBlihtUD5R5RYKgqtXIRV9v-nyLotSH9e9ZY6yj3GV',
    appreciations: 8,
    comments: 12,
  },
];

function FeedCard({ item, index }: { item: FeedItem; index: number }) {
  const [appreciated, setAppreciated] = useState(false);

  const toggleAppreciate = () => {
    pressFeedback();
    setAppreciated(!appreciated);
  };

  const count = item.appreciations + (appreciated ? 1 : 0);
  const activeColor = appreciated ? CivicNoirTheme.colors.primary : CivicNoirTheme.colors.outline;

  return (
    <Animated.View
      entering={FadeInUp.duration(CivicNoirTheme.motion.slow).delay(120 * index)}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardAuthor}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.authorImg} />
          ) : (
            <View style={styles.authorBadge}>
              <Text style={styles.authorBadgeText}>{item.initials}</Text>
            </View>
          )}
          <View>
            <Text style={styles.authorName}>{item.author}</Text>
            <Text style={styles.authorMeta}>{item.meta}</Text>
          </View>
        </View>
        <Pressable hitSlop={8} onPress={pressFeedback} accessibilityLabel="More options">
          <MaterialIcons name="more-horiz" size={24} color={CivicNoirTheme.colors.outline} />
        </Pressable>
      </View>

      {item.image && (
        <View style={styles.cardImageContainer}>
          <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
          {item.location && (
            <View style={styles.locationTag}>
              <MaterialIcons name="location-pin" size={14} color={CivicNoirTheme.colors.primary} />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.cardBody}>
        {item.headline && <Text style={styles.cardHeadline}>{item.headline}</Text>}
        <View style={styles.cardActions}>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            onPress={toggleAppreciate}
            accessibilityRole="button"
            accessibilityState={{ selected: appreciated }}
            accessibilityLabel={`Appreciate, ${count} appreciations`}
          >
            <MaterialIcons name={appreciated ? 'thumb-up' : 'thumb-up-off-alt'} size={18} color={activeColor} />
            <Text style={[styles.actionBtnText, { color: activeColor }]}>Appreciate ({count})</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            onPress={pressFeedback}
            accessibilityRole="button"
            accessibilityLabel={`Discuss, ${item.comments} comments`}
          >
            <MaterialIcons name="chat-bubble-outline" size={18} color={CivicNoirTheme.colors.outline} />
            <Text style={styles.actionBtnText}>Discuss ({item.comments})</Text>
          </Pressable>
        </View>
        {item.body && <Text style={styles.cardText}>{item.body}</Text>}
      </View>
    </Animated.View>
  );
}

export default function CitizenDashboardScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isDesktop = width >= 1024;

  const goToNewReport = () => router.push('/new-report');

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
            <Pressable style={styles.menuItem} onPress={pressFeedback}>
              <MaterialIcons name="dashboard" size={24} color={CivicNoirTheme.colors.outline} />
              <Text style={styles.menuText}>Dashboard</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={pressFeedback}>
              <MaterialIcons name="group" size={24} color={CivicNoirTheme.colors.outline} />
              <Text style={styles.menuText}>Network</Text>
            </Pressable>
            <View style={styles.menuItemActive}>
              <MaterialIcons name="forum" size={24} color={CivicNoirTheme.colors.primary} />
              <Text style={styles.menuTextActive}>Civic Feed</Text>
            </View>
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

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Top Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12, paddingHorizontal: isDesktop ? 48 : 16 }]}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color={CivicNoirTheme.colors.outline} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search reports, districts..."
              placeholderTextColor={CivicNoirTheme.colors.outline}
              accessibilityLabel="Search"
            />
          </View>
          <View style={styles.headerActions}>
            <Pressable
              style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
              onPress={pressFeedback}
              accessibilityLabel="Notifications"
            >
              <MaterialIcons name="notifications-none" size={24} color={CivicNoirTheme.colors.primary} />
            </Pressable>
            {!isDesktop && (
              <Pressable
                style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
                onPress={logout}
                accessibilityLabel="Sign out"
              >
                <MaterialIcons name="logout" size={22} color={CivicNoirTheme.colors.primary} />
              </Pressable>
            )}
            <View style={styles.profileButton}>
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-WEzTNHrdQYBfBsJVajiTUwKwJQ_tc5Pfr9hade76zigKpsGP4BHtyrisP_tCFQN5wxt_lbqqSc-m7qRktb7skLSBMiISoc-x3mdSclj986TpbKVceYSvTz6Xp4qCH08dEVpPCCyvX2LBytEKu2QD7Z1YpY2quj3h_CRN6mezd54MTi3nEfXoWYbZOOqrwEes3rqK3xYH5mAhtRvTD8JKno-LBdkcQfO3dZU7uusayYo2eonl7ljFtLm31DJBBd8prCHsLF5bfMJ7' }}
                style={styles.profileImage}
              />
            </View>
          </View>
        </View>

        {/* Scrollable Canvas */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: isDesktop ? 48 : 16, paddingBottom: insets.bottom + 120 },
          ]}
        >
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Civic Feed</Text>
            <Text style={styles.pageDesc}>
              Real-time updates and reports from your local network. Engage with initiatives shaping your
              structural environment.
            </Text>
          </View>

          <View style={[styles.grid, { flexDirection: isDesktop ? 'row' : 'column' }]}>
            {/* Feed Column */}
            <View style={[styles.feedCol, { flex: isDesktop ? 2 : 1 }]}>
              {FEED.map((item, i) => (
                <FeedCard key={item.id} item={item} index={i} />
              ))}
            </View>

            {/* Sidebar Widgets */}
            <View style={styles.widgetCol}>
              <Animated.View entering={FadeInUp.duration(CivicNoirTheme.motion.slow).delay(240)} style={styles.widgetCard}>
                <Text style={styles.widgetTitle}>NETWORK ACTIVITY</Text>
                <View style={styles.statContainer}>
                  <Text style={styles.statLarge}>142</Text>
                  <Text style={styles.statLabel}>REPORTS</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '65%' }]} />
                </View>
                <Text style={styles.statDelta}>+12% vs prior cycle</Text>
              </Animated.View>

              <Animated.View entering={FadeInUp.duration(CivicNoirTheme.motion.slow).delay(360)} style={styles.widgetCTA}>
                <MaterialIcons name="add-box" size={32} color={CivicNoirTheme.colors.primary} />
                <Text style={styles.ctaTitle}>SUBMIT A NEW REPORT</Text>
                <Text style={styles.ctaDesc}>
                  Flag infrastructure faults, sanitation issues, or safety hazards in your district.
                </Text>
                <NoirButton label="INITIATE DRAFT" icon="arrow-forward" onPress={goToNewReport} style={styles.ctaBtn} />
              </Animated.View>
            </View>
          </View>
        </ScrollView>

        {/* Floating New Report action (Mobile) */}
        {!isDesktop && (
          <Pressable
            onPress={() => {
              pressFeedback();
              goToNewReport();
            }}
            accessibilityRole="button"
            accessibilityLabel="Submit a new report"
            style={({ pressed }) => [
              styles.fab,
              { bottom: insets.bottom + 24 },
              pressed && styles.fabPressed,
            ]}
          >
            <MaterialIcons name="add" size={28} color={CivicNoirTheme.colors.onPrimary} />
          </Pressable>
        )}
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
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CivicNoirTheme.colors.surfaceBright,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outlineMedium,
    paddingHorizontal: 16,
    minHeight: 44,
    flex: 1,
    maxWidth: 340,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: CivicNoirTheme.typography.bodyMd.fontFamily,
    fontSize: 14,
    color: CivicNoirTheme.colors.primary,
    paddingVertical: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outlineMedium,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 32,
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
  },
  pageHeader: {
    marginBottom: 40,
  },
  pageTitle: {
    ...CivicNoirTheme.typography.headlineLg,
    color: CivicNoirTheme.colors.primary,
    marginBottom: 16,
  },
  pageDesc: {
    ...CivicNoirTheme.typography.bodyLg,
    color: CivicNoirTheme.colors.secondary,
    maxWidth: 800,
    lineHeight: 28,
  },
  grid: {
    gap: 32,
    alignItems: 'flex-start',
  },
  feedCol: {
    gap: 40,
    width: '100%',
  },
  widgetCol: {
    flex: 1,
    gap: 24,
    width: '100%',
  },
  card: {
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outlineMedium,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: CivicNoirTheme.colors.outlineSoft,
  },
  cardAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  authorImg: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outlineMedium,
  },
  authorBadge: {
    width: 40,
    height: 40,
    backgroundColor: CivicNoirTheme.colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outlineMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorBadgeText: {
    fontFamily: CivicNoirTheme.typography.headlineMd.fontFamily,
    fontSize: 16,
    color: CivicNoirTheme.colors.primary,
  },
  authorName: {
    ...CivicNoirTheme.typography.labelMd,
    color: CivicNoirTheme.colors.primary,
  },
  authorMeta: {
    fontFamily: CivicNoirTheme.typography.bodyMd.fontFamily,
    fontSize: 12,
    color: CivicNoirTheme.colors.outline,
    marginTop: 4,
  },
  cardImageContainer: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderBottomWidth: 1,
    borderBottomColor: CivicNoirTheme.colors.outlineSoft,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  locationTag: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outlineMedium,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  locationText: {
    ...CivicNoirTheme.typography.labelSm,
    color: CivicNoirTheme.colors.primary,
  },
  cardBody: {
    padding: 20,
    gap: 16,
  },
  cardHeadline: {
    ...CivicNoirTheme.typography.headlineMd,
    color: CivicNoirTheme.colors.primary,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 36,
    paddingHorizontal: 8,
    marginLeft: -8,
  },
  actionBtnPressed: {
    backgroundColor: CivicNoirTheme.colors.pressedWash,
  },
  actionBtnText: {
    ...CivicNoirTheme.typography.labelSm,
    color: CivicNoirTheme.colors.outline,
    textTransform: 'uppercase',
  },
  cardText: {
    ...CivicNoirTheme.typography.bodyMd,
    color: CivicNoirTheme.colors.primary,
    lineHeight: 26,
  },
  widgetCard: {
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outlineMedium,
    padding: 24,
  },
  widgetTitle: {
    ...CivicNoirTheme.typography.labelSm,
    color: CivicNoirTheme.colors.outline,
    borderBottomWidth: 1,
    borderBottomColor: CivicNoirTheme.colors.outlineSoft,
    paddingBottom: 16,
    marginBottom: 16,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  statLarge: {
    fontFamily: CivicNoirTheme.typography.displayXl.fontFamily,
    fontSize: 48,
    color: CivicNoirTheme.colors.primary,
    letterSpacing: -2,
    lineHeight: 48,
  },
  statLabel: {
    ...CivicNoirTheme.typography.labelSm,
    color: CivicNoirTheme.colors.outline,
    marginBottom: 8,
  },
  progressBar: {
    height: 2,
    backgroundColor: CivicNoirTheme.colors.surfaceContainerHigh,
    width: '100%',
    marginTop: 16,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: CivicNoirTheme.colors.primary,
  },
  statDelta: {
    ...CivicNoirTheme.typography.labelSm,
    color: CivicNoirTheme.colors.success,
    textAlign: 'right',
    textTransform: 'none',
  },
  widgetCTA: {
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outlineMedium,
    padding: 32,
    alignItems: 'center',
  },
  ctaTitle: {
    ...CivicNoirTheme.typography.labelMd,
    color: CivicNoirTheme.colors.primary,
    letterSpacing: 1,
    marginTop: 16,
  },
  ctaDesc: {
    fontFamily: CivicNoirTheme.typography.bodyMd.fontFamily,
    fontSize: 14,
    lineHeight: 21,
    color: CivicNoirTheme.colors.secondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  ctaBtn: {
    alignSelf: 'stretch',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: CivicNoirTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabPressed: {
    backgroundColor: CivicNoirTheme.colors.onSurface,
    transform: [{ scale: 0.96 }],
  },
});
