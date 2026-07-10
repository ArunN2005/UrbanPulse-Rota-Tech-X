import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Dimensions, Platform, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { CivicNoirTheme } from '../constants/theme';

const { width } = Dimensions.get('window');
const isDesktop = width >= 1024;

export default function CitizenDashboardScreen() {
  const [likes, setLikes] = useState<{ [key: number]: boolean }>({});

  const toggleLike = (id: number) =>
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));

  const openDiscussion = (topic: string) =>
    Alert.alert('Discussion', `Threads for "${topic}" are not available in this preview build yet.`);

  const startReport = () =>
    Alert.alert('New Report', 'Report drafting will open here in an upcoming release.');

  const logout = () => router.replace('/');

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
            <TouchableOpacity style={styles.menuItem}>
              <MaterialIcons name="dashboard" size={24} color={CivicNoirTheme.colors.outline} />
              <Text style={styles.menuText}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <MaterialIcons name="group" size={24} color={CivicNoirTheme.colors.outline} />
              <Text style={styles.menuText}>Network</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItemActive}>
              <MaterialIcons name="forum" size={24} color={CivicNoirTheme.colors.primary} />
              <Text style={styles.menuTextActive}>Civic Feed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <MaterialIcons name="settings" size={24} color={CivicNoirTheme.colors.outline} />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Top Header - Glassmorphic */}
        <BlurView intensity={80} tint="light" style={styles.header}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color={CivicNoirTheme.colors.outline} />
            <TextInput
              style={[styles.searchInput, Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
              placeholder="Search..."
              placeholderTextColor={CivicNoirTheme.colors.outline}
            />
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => Alert.alert('Notifications', 'You have no new notifications.')}
            >
              <MaterialIcons name="notifications" size={24} color={CivicNoirTheme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={logout}
              accessibilityLabel="Sign out"
            >
              <MaterialIcons name="logout" size={24} color={CivicNoirTheme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-WEzTNHrdQYBfBsJVajiTUwKwJQ_tc5Pfr9hade76zigKpsGP4BHtyrisP_tCFQN5wxt_lbqqSc-m7qRktb7skLSBMiISoc-x3mdSclj986TpbKVceYSvTz6Xp4qCH08dEVpPCCyvX2LBytEKu2QD7Z1YpY2quj3h_CRN6mezd54MTi3nEfXoWYbZOOqrwEes3rqK3xYH5mAhtRvTD8JKno-LBdkcQfO3dZU7uusayYo2eonl7ljFtLm31DJBBd8prCHsLF5bfMJ7' }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </BlurView>

        {/* Scrollable Canvas */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Civic Feed</Text>
            <Text style={styles.pageDesc}>Real-time updates and reports from your local network. Engage with initiatives shaping your structural environment.</Text>
          </View>

          <View style={styles.grid}>
            {/* Feed Column */}
            <View style={styles.feedCol}>
              {/* Feed Item 1 */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardAuthor}>
                    <Image 
                      source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMlDd9WEIC2-g7pfl-IApjtk-P3Jx2H9EIAuds_zGLUdgx7MOfp6yQa7Nb253WdFw3AgKBKeMYH7jZcGysl7hZaauhGUJo7T7P6HnqzszOipgMaYCVWBZoFMtrozsQ3nK3tZGUbiUqD3AA3BqvKOWK5k01ZPDBnDnDAhyqrDzq--1UDc1wLIDV67tULAeCsfFh_eOC4g_wWfag5YevMpYUJKBfzdWHLWEq5wFV-9C9-P3vN0717SCKgARyKuKJMDgOSFv8_AodsrA7' }} 
                      style={styles.authorImg}
                    />
                    <View>
                      <Text style={styles.authorName}>Elena Rostova</Text>
                      <Text style={styles.authorMeta}>Infrastructure Dept • 2h ago</Text>
                    </View>
                  </View>
                  <MaterialIcons name="more-horiz" size={24} color={CivicNoirTheme.colors.outline} />
                </View>
                <View style={styles.cardImageContainer}>
                  <Image 
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtpQgjtluZuPA6JboJpDidvNgyHxmYTf0kWP73IG8p155YsVDOWEJS4w9BDTTBdCrVmejYoWKrYWf5AX8wzyaMh2q2VHA6z9-Hhh4s8a6OJ8Bwsy8OeB7rvYUx_KSz4dZ_8UjP1MujeXaZeGaUXbGxb7uNgpckLGxjCcR_8WJ7SL3p_o0jnsVrI4pTRX2TuuWBBTan4jLWNcFWX_3rEuR7xJvM6_rPUABMw2NknLAnqqTBQVjsZDLGsGswEVspS6IIzhuKAtRX3QV9' }} 
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.locationTag}>
                    <MaterialIcons name="location-pin" size={14} color={CivicNoirTheme.colors.primary} />
                    <Text style={styles.locationText}>Riverfront District</Text>
                  </View>
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => toggleLike(1)}>
                      <MaterialIcons name={likes[1] ? 'thumb-up' : 'thumb-up-off-alt'} size={16} color={CivicNoirTheme.colors.primary} />
                      <Text style={styles.actionBtnText}>{likes[1] ? 'Appreciated' : 'Appreciate'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => openDiscussion('Riverfront Revitalization')}>
                      <MaterialIcons name="chat-bubble-outline" size={16} color={CivicNoirTheme.colors.outline} />
                      <Text style={styles.actionBtnText}>Discuss (4)</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.cardText}>
                    Phase 2 of the Riverfront Revitalization project is officially underway. We've completed the foundational grading and are moving onto installing the new structural pathways.
                  </Text>
                </View>
              </View>

              {/* Feed Item 2 */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardAuthor}>
                    <View style={styles.authorBadge}>
                      <Text style={styles.authorBadgeText}>CW</Text>
                    </View>
                    <View>
                      <Text style={styles.authorName}>Citizens Watch</Text>
                      <Text style={styles.authorMeta}>Community Group • 5h ago</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.cardMapContainer}>
                  <Image 
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRUcjeEs3xTaxjZe2WJbckEPJUzzrszDmwcj6tvj5dMviiJw-ewtg4LRP-1B-JW9E406lDHxuKpHX1puypw4Vs6l1V--FIR2NEvFS5463x5qEox5wOscMl7eL7BWnvYSVw6_tzoB3O80GUi6IhR_Lssteue1H3xRQ1mw0OtAz5DwbbtFc5l7F8m_jf-lt47zv2pLUg_CVosFnJQTk0j4_aVz51zJE1LJTiCrYBlihtUD5R5RYKgqtXIRV9v-nyLotSH9e9ZY6yj3GV' }}
                    style={styles.cardMap}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardHeadline}>Proposed Zoning Adjustments: Sector 4</Text>
                  <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => toggleLike(2)}>
                      <MaterialIcons name={likes[2] ? 'thumb-up' : 'thumb-up-off-alt'} size={16} color={likes[2] ? CivicNoirTheme.colors.primary : CivicNoirTheme.colors.outline} />
                      <Text style={[styles.actionBtnText, { color: likes[2] ? CivicNoirTheme.colors.primary : CivicNoirTheme.colors.outline }]}>{likes[2] ? 'Appreciated' : 'Appreciate'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => openDiscussion('Sector 4 Zoning Adjustments')}>
                      <MaterialIcons name="chat-bubble-outline" size={16} color={CivicNoirTheme.colors.outline} />
                      <Text style={[styles.actionBtnText, { color: CivicNoirTheme.colors.outline }]}>Discuss (12)</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Sidebar Widgets */}
            <View style={styles.widgetCol}>
              <View style={styles.widgetCard}>
                <Text style={styles.widgetTitle}>NETWORK ACTIVITY</Text>
                <View style={styles.statContainer}>
                  <Text style={styles.statLarge}>142</Text>
                  <Text style={styles.statLabel}>REPORTS</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '65%' }]} />
                </View>
                <Text style={styles.statDelta}>+12% vs prior cycle</Text>
              </View>

              <View style={styles.widgetCTA}>
                <MaterialIcons name="add-box" size={32} color={CivicNoirTheme.colors.primary} />
                <Text style={styles.ctaTitle}>SUBMIT A NEW REPORT</Text>
                <TouchableOpacity style={styles.ctaBtn} onPress={startReport} activeOpacity={0.9}>
                  <Text style={styles.ctaBtnText}>INITIATE DRAFT</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    borderRightColor: CivicNoirTheme.colors.outline + '30',
    paddingTop: 48,
    zIndex: 50,
  },
  sidebarHeader: {
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  sidebarTitle: {
    fontFamily: CivicNoirTheme.typography.displayXl.fontFamily,
    fontSize: 20,
    fontWeight: '900',
    color: CivicNoirTheme.colors.primary,
  },
  sidebarSubtitle: {
    fontFamily: CivicNoirTheme.typography.labelSm.fontFamily,
    fontSize: 12,
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
    fontFamily: CivicNoirTheme.typography.labelSm.fontFamily,
    fontSize: 14,
    color: CivicNoirTheme.colors.outline,
    fontWeight: '600',
  },
  menuTextActive: {
    fontFamily: CivicNoirTheme.typography.labelSm.fontFamily,
    fontSize: 14,
    color: CivicNoirTheme.colors.primary,
    fontWeight: '700',
  },
  mainContent: {
    flex: 1,
    position: 'relative',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isDesktop ? 48 : 16,
    borderBottomWidth: 1,
    borderBottomColor: CivicNoirTheme.colors.outline + '20',
    zIndex: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outline + '40',
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: isDesktop ? 300 : 200,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: CivicNoirTheme.typography.labelSm.fontFamily,
    fontSize: 12,
    color: CivicNoirTheme.colors.primary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  iconButton: {
    padding: 8,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outline + '40',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 120, // To clear the header
    paddingHorizontal: isDesktop ? 48 : 16,
    paddingBottom: 120,
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
  },
  pageHeader: {
    marginBottom: 64,
  },
  pageTitle: {
    fontFamily: CivicNoirTheme.typography.headlineLg.fontFamily,
    fontSize: 40,
    fontWeight: '600',
    color: CivicNoirTheme.colors.primary,
    marginBottom: 16,
  },
  pageDesc: {
    fontFamily: CivicNoirTheme.typography.bodyLg.fontFamily,
    fontSize: 18,
    color: CivicNoirTheme.colors.secondary,
    maxWidth: 800,
    lineHeight: 28,
  },
  grid: {
    flexDirection: isDesktop ? 'row' : 'column',
    gap: 32,
    alignItems: 'flex-start',
  },
  feedCol: {
    flex: isDesktop ? 2 : 1,
    gap: 64,
    width: '100%',
  },
  widgetCol: {
    flex: 1,
    gap: 32,
    width: '100%',
    position: isDesktop ? 'sticky' as any : 'relative',
    top: 120,
  },
  card: {
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outline + '50',
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
    borderBottomColor: CivicNoirTheme.colors.outline + '30',
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
    borderColor: CivicNoirTheme.colors.outline + '50',
  },
  authorBadge: {
    width: 40,
    height: 40,
    backgroundColor: CivicNoirTheme.colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outline + '50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorBadgeText: {
    fontFamily: CivicNoirTheme.typography.headlineMd.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: CivicNoirTheme.colors.primary,
  },
  authorName: {
    fontFamily: CivicNoirTheme.typography.labelSm.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: CivicNoirTheme.colors.primary,
  },
  authorMeta: {
    fontFamily: CivicNoirTheme.typography.labelSm.fontFamily,
    fontSize: 12,
    color: CivicNoirTheme.colors.outline,
    marginTop: 4,
  },
  cardImageContainer: {
    width: '100%',
    aspectRatio: 4/3,
    borderBottomWidth: 1,
    borderBottomColor: CivicNoirTheme.colors.outline + '30',
    position: 'relative',
  },
  cardMapContainer: {
    width: '100%',
    height: 256,
    borderBottomWidth: 1,
    borderBottomColor: CivicNoirTheme.colors.outline + '30',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardMap: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  locationTag: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outline + '50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  locationText: {
    fontFamily: CivicNoirTheme.typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    color: CivicNoirTheme.colors.primary,
  },
  cardBody: {
    padding: 24,
    gap: 16,
  },
  cardHeadline: {
    fontFamily: CivicNoirTheme.typography.headlineMd.fontFamily,
    fontSize: 24,
    color: CivicNoirTheme.colors.primary,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 24,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnText: {
    fontFamily: CivicNoirTheme.typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    color: CivicNoirTheme.colors.primary,
    textTransform: 'uppercase',
  },
  cardText: {
    fontFamily: CivicNoirTheme.typography.bodyMd.fontFamily,
    fontSize: 16,
    color: CivicNoirTheme.colors.primary,
    lineHeight: 26,
    marginTop: 16,
  },
  widgetCard: {
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outline + '50',
    padding: 24,
    marginBottom: 24,
  },
  widgetTitle: {
    fontFamily: CivicNoirTheme.typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    color: CivicNoirTheme.colors.outline,
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: CivicNoirTheme.colors.outline + '30',
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
    fontWeight: '700',
    color: CivicNoirTheme.colors.primary,
    letterSpacing: -2,
    lineHeight: 48,
  },
  statLabel: {
    fontFamily: CivicNoirTheme.typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    color: CivicNoirTheme.colors.outline,
    letterSpacing: 1,
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
    fontFamily: CivicNoirTheme.typography.labelSm.fontFamily,
    fontSize: 12,
    color: CivicNoirTheme.colors.primary,
    textAlign: 'right',
  },
  widgetCTA: {
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outline + '50',
    padding: 32,
    alignItems: 'center',
  },
  ctaTitle: {
    fontFamily: CivicNoirTheme.typography.labelSm.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: CivicNoirTheme.colors.primary,
    letterSpacing: 1,
    marginVertical: 16,
  },
  ctaBtn: {
    width: '100%',
    backgroundColor: CivicNoirTheme.colors.primary,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  ctaBtnText: {
    fontFamily: CivicNoirTheme.typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    color: CivicNoirTheme.colors.onPrimary,
    letterSpacing: 1,
  }
});
