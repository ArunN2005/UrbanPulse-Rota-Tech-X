import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FeedbackScreen = ({ route, navigation }) => {
  const { complaintId, complaintTitle } = route.params || {};

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [improvements, setImprovements] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please provide a rating before submitting.');
      return;
    }

    setSubmitting(true);

    // Simulate processing time
    setTimeout(() => {
      setSubmitting(false);

      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted successfully. It helps us improve our service.',
        [
          {
            text: 'Continue',
            onPress: () => {
              // Navigate to Instagram-style feed dashboard
              navigation.reset({
                index: 0,
                routes: [{ name: 'InstagramFeed' }],
              });
            }
          }
        ]
      );
    }, 1000);
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Feedback?',
      'Your feedback helps us improve our service. Are you sure you want to skip?',
      [
        { text: 'Provide Feedback', style: 'cancel' },
        {
          text: 'Skip',
          style: 'destructive',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'InstagramFeed' }],
            });
          }
        }
      ]
    );
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleStarPress(i)}
          style={styles.starButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={36}
            color={i <= rating ? '#D97706' : '#D4D4D4'}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const getRatingText = () => {
    switch (rating) {
      case 1: return 'Poor — Needs significant improvement';
      case 2: return 'Fair — Some improvements needed';
      case 3: return 'Good — Satisfactory experience';
      case 4: return 'Very Good — Minor improvements possible';
      case 5: return 'Excellent — Great experience!';
      default: return 'Tap a star to rate';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedback</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Success Card */}
        <View style={styles.successCard}>
          <View style={styles.successIconWrap}>
            <Ionicons name="checkmark-circle" size={40} color="#059669" />
          </View>
          <Text style={styles.successTitle}>Complaint Submitted</Text>
          <Text style={styles.successSubtitle}>
            Thank you for reporting: {complaintTitle || 'your concern'}
          </Text>
        </View>

        {/* Rating Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How was your experience?</Text>
          <Text style={styles.cardSubtitle}>
            Your feedback helps us improve the complaint process
          </Text>

          <View style={styles.ratingWrap}>
            <View style={styles.starsRow}>{renderStars()}</View>
            <Text style={styles.ratingText}>{getRatingText()}</Text>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>
              General Feedback <Text style={styles.optional}>(Optional)</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={3}
              placeholder="Share your overall experience..."
              value={feedback}
              onChangeText={setFeedback}
              maxLength={500}
              placeholderTextColor="#A3A3A3"
            />
            <Text style={styles.charCount}>{feedback.length}/500</Text>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>
              Suggestions <Text style={styles.optional}>(Optional)</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={3}
              placeholder="How can we improve?"
              value={improvements}
              onChangeText={setImprovements}
              maxLength={500}
              placeholderTextColor="#A3A3A3"
            />
            <Text style={styles.charCount}>{improvements.length}/500</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.submitButton, (rating === 0 || submitting) && styles.submitDisabled]}
          onPress={handleSubmitFeedback}
          disabled={rating === 0 || submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="send-outline" size={18} color="#fff" />
              <Text style={styles.submitText}>Submit Feedback</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
  skipText: {
    fontSize: 15,
    color: '#737373',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#171717',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  successCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 28,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  successIconWrap: {
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#737373',
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#A3A3A3',
    marginBottom: 24,
  },
  ratingWrap: {
    alignItems: 'center',
    marginBottom: 28,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  starButton: {
    marginHorizontal: 4,
    padding: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#404040',
    fontWeight: '500',
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#404040',
    marginBottom: 8,
  },
  optional: {
    fontSize: 13,
    fontWeight: '400',
    color: '#A3A3A3',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    textAlignVertical: 'top',
    backgroundColor: '#FAFAFA',
    minHeight: 80,
    color: '#171717',
  },
  charCount: {
    fontSize: 11,
    color: '#A3A3A3',
    textAlign: 'right',
    marginTop: 4,
  },
  bottomBar: {
    padding: 20,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    backgroundColor: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#0F766E',
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitDisabled: {
    backgroundColor: '#D4D4D4',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default FeedbackScreen;
