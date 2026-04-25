import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
  Modal,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { apiClient, makeApiCall } from '../../../config/supabase';

const { width } = Dimensions.get('window');

const PersonalReports = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  useEffect(() => {
    loadPersonalReports();
  }, []);

  const loadPersonalReports = async () => {
    try {
      setLoading(true);
      const response = await makeApiCall(apiClient.complaints.personalReports);

      if (response.success) {
        setReports(response.data.complaints);
        setStats(response.data.stats);
      } else {
        Alert.alert('Error', response.message || 'Failed to load your reports');
      }
    } catch (error) {
      console.error('Load personal reports error:', error);
      Alert.alert('Error', 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPersonalReports();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear stored auth data
              await AsyncStorage.multiRemove(['authToken', 'userData']);
              // Navigate to welcome screen
              navigation.replace('Welcome');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout properly');
            }
          }
        }
      ]
    );
  };

  const openTrackingDetails = (report) => {
    setSelectedReport(report);
    setShowTrackingModal(true);
  };

  const renderTrackingStage = (stage, isActive, isCompleted, isLast) => {
    const getStageColor = () => {
      if (isCompleted) return '#059669';
      if (isActive) return '#0284C7';
      return '#D4D4D4';
    };

    const getStageIcon = () => {
      if (isCompleted) return 'checkmark-circle';
      if (isActive) return 'radio-button-on';
      return 'radio-button-off';
    };

    return (
      <View key={stage.id} style={styles.trackingStage}>
        <View style={styles.stageIconContainer}>
          <Ionicons
            name={getStageIcon()}
            size={22}
            color={getStageColor()}
          />
          {!isLast && (
            <View style={[
              styles.stageLine,
              { backgroundColor: isCompleted ? '#059669' : '#E5E5E5' }
            ]} />
          )}
        </View>

        <View style={styles.stageContent}>
          <View style={styles.stageHeader}>
            <Text style={[styles.stageName, { color: getStageColor() }]}>
              {stage.icon} {stage.name}
            </Text>
            {stage.date && (
              <Text style={styles.stageDate}>
                {new Date(stage.date).toLocaleDateString()}
              </Text>
            )}
          </View>

          <Text style={styles.stageDescription}>
            {stage.description}
          </Text>

          {stage.officer && (
            <View style={styles.assignmentRow}>
              <Ionicons name="person-outline" size={12} color="#0284C7" />
              <Text style={styles.stageAssignment}>{stage.officer}</Text>
            </View>
          )}

          {stage.contractor && (
            <View style={styles.assignmentRow}>
              <Ionicons name="construct-outline" size={12} color="#0284C7" />
              <Text style={styles.stageAssignment}>{stage.contractor}</Text>
            </View>
          )}

          {stage.estimatedCost && (
            <View style={styles.assignmentRow}>
              <Ionicons name="cash-outline" size={12} color="#0284C7" />
              <Text style={styles.stageAssignment}>Estimated: ₹{stage.estimatedCost}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderReportCard = (report) => {
    const getStatusColor = (status) => {
      const colors = {
        'pending': '#D97706',
        'in_progress': '#0284C7',
        'resolved': '#059669',
        'cancelled': '#A3A3A3'
      };
      return colors[status] || '#A3A3A3';
    };

    const getStatusBg = (status) => {
      const colors = {
        'pending': '#FFFBEB',
        'in_progress': '#F0F9FF',
        'resolved': '#F0FDF4',
        'cancelled': '#F5F5F5'
      };
      return colors[status] || '#F5F5F5';
    };

    const getStatusText = (status) => {
      const statusMap = {
        'pending': 'Pending',
        'in_progress': 'In Progress',
        'resolved': 'Resolved',
        'cancelled': 'Cancelled'
      };
      return statusMap[status] || status;
    };

    return (
      <TouchableOpacity
        key={report.id}
        style={styles.reportCard}
        onPress={() => openTrackingDetails(report)}
        activeOpacity={0.7}
      >
        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle} numberOfLines={2}>
            {report.title}
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusBg(report.status) }
          ]}>
            <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
              {getStatusText(report.status)}
            </Text>
          </View>
        </View>

        <Text style={styles.reportDescription} numberOfLines={2}>
          {report.description}
        </Text>

        {report.image_url && (
          <Image
            source={{ uri: report.image_url }}
            style={styles.reportImage}
          />
        )}

        <View style={styles.reportMeta}>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={13} color="#A3A3A3" />
            <Text style={styles.metaText}>{new Date(report.created_at).toLocaleDateString()}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={13} color="#A3A3A3" />
            <Text style={styles.metaText}>{report.location_address || 'Not specified'}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="pricetag-outline" size={13} color="#A3A3A3" />
            <Text style={styles.metaText}>{report.category || 'General'}</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>Stage {report.currentStage}/5</Text>
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill,
              {
                width: `${(report.currentStage / 5) * 100}%`,
                backgroundColor: getStatusColor(report.status)
              }
            ]} />
          </View>
        </View>

        <View style={styles.trackingLink}>
          <Text style={styles.trackingLinkText}>View tracking details</Text>
          <Ionicons name="chevron-forward" size={14} color="#0F766E" />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
        <Text style={styles.loadingText}>Loading your reports...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#171717" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Reports</Text>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#DC2626" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0F766E']} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Total', value: stats.totalComplaints || 0, color: '#171717' },
            { label: 'Resolved', value: stats.resolved || 0, color: '#059669' },
            { label: 'In Progress', value: stats.inProgress || 0, color: '#0284C7' },
            { label: 'Pending', value: stats.pending || 0, color: '#D97706' },
          ].map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Reports List */}
        <View style={styles.reportsSection}>
          <Text style={styles.sectionTitle}>Your Reports</Text>
          {reports.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="document-outline" size={36} color="#D4D4D4" />
              </View>
              <Text style={styles.emptyTitle}>No reports found</Text>
              <Text style={styles.emptyText}>
                Submit your first complaint to see it here
              </Text>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => navigation.navigate('SubmitComplaint')}
                activeOpacity={0.8}
              >
                <Text style={styles.submitBtnText}>Submit Complaint</Text>
              </TouchableOpacity>
            </View>
          ) : (
            reports.map(report => renderReportCard(report))
          )}
        </View>
      </ScrollView>

      {/* Tracking Details Modal */}
      <Modal
        visible={showTrackingModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Complaint Tracking</Text>
            <TouchableOpacity
              onPress={() => setShowTrackingModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={22} color="#171717" />
            </TouchableOpacity>
          </View>

          {selectedReport && (
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Report Info */}
              <View style={styles.reportInfo}>
                <Text style={styles.reportModalTitle}>
                  {selectedReport.title}
                </Text>
                <Text style={styles.reportModalDescription}>
                  {selectedReport.description}
                </Text>

                {selectedReport.image_url && (
                  <Image
                    source={{ uri: selectedReport.image_url }}
                    style={styles.reportModalImage}
                  />
                )}

                <View style={styles.modalMetaCard}>
                  {[
                    { icon: 'calendar-outline', text: `Submitted: ${new Date(selectedReport.created_at).toLocaleDateString()} at ${new Date(selectedReport.created_at).toLocaleTimeString()}` },
                    { icon: 'location-outline', text: `Location: ${selectedReport.location_address || 'Not specified'}` },
                    { icon: 'pricetag-outline', text: `Category: ${selectedReport.category || 'General'}` },
                    { icon: 'flash-outline', text: `Priority: ${selectedReport.priority || 'Medium'}` },
                  ].map((item, i) => (
                    <View key={i} style={styles.modalMetaRow}>
                      <Ionicons name={item.icon} size={15} color="#737373" />
                      <Text style={styles.modalMetaText}>{item.text}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Tracking */}
              <View style={styles.trackingContainer}>
                <Text style={styles.trackingTitle}>Progress</Text>
                {selectedReport.trackingStages?.map((stage, index) =>
                  renderTrackingStage(
                    stage,
                    index + 1 === selectedReport.currentStage,
                    stage.status === 'completed',
                    index === selectedReport.trackingStages.length - 1
                  )
                )}
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  loadingText: {
    fontSize: 15,
    color: '#A3A3A3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#171717',
  },
  logoutBtn: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    color: '#A3A3A3',
    fontWeight: '500',
    marginTop: 2,
  },
  reportsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 12,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 36,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#404040',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#A3A3A3',
    textAlign: 'center',
    marginBottom: 20,
  },
  submitBtn: {
    backgroundColor: '#0F766E',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  reportDescription: {
    fontSize: 14,
    color: '#737373',
    marginBottom: 10,
    lineHeight: 20,
  },
  reportImage: {
    width: '100%',
    height: 140,
    borderRadius: 10,
    marginBottom: 10,
  },
  reportMeta: {
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#A3A3A3',
    marginLeft: 6,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 12,
    color: '#737373',
    fontWeight: '500',
    marginRight: 10,
    minWidth: 60,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#F5F5F5',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  trackingLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  trackingLinkText: {
    fontSize: 13,
    color: '#0F766E',
    fontWeight: '500',
    marginRight: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#171717',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  reportInfo: {
    marginBottom: 24,
  },
  reportModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  reportModalDescription: {
    fontSize: 15,
    color: '#737373',
    marginBottom: 16,
    lineHeight: 22,
  },
  reportModalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalMetaCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  modalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalMetaText: {
    fontSize: 14,
    color: '#404040',
    marginLeft: 8,
  },
  trackingContainer: {
    marginBottom: 32,
  },
  trackingTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 18,
  },
  trackingStage: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stageIconContainer: {
    alignItems: 'center',
    marginRight: 14,
  },
  stageLine: {
    width: 2,
    flex: 1,
    marginTop: 6,
  },
  stageContent: {
    flex: 1,
    paddingBottom: 4,
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stageName: {
    fontSize: 15,
    fontWeight: '600',
  },
  stageDate: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  stageDescription: {
    fontSize: 13,
    color: '#737373',
    marginBottom: 4,
    lineHeight: 18,
  },
  assignmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  stageAssignment: {
    fontSize: 12,
    color: '#0284C7',
    marginLeft: 6,
  },
});

export default PersonalReports;
