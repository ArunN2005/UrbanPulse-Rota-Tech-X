import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiClient, makeApiCall } from '../../../config/supabase';

const AdminSignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    department: '',
    employeeId: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.fullName ||
        !formData.phoneNumber || !formData.department || !formData.employeeId) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      Alert.alert('Error', 'Admin password must be at least 8 characters long');
      return false;
    }

    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    // Admin email validation (should end with gov domain or organization domain)
    if (!formData.email.includes('gov') && !formData.email.includes('civic')) {
      Alert.alert(
        'Warning',
        'Admin accounts typically use government or organizational email addresses. Continue anyway?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => null }
        ]
      );
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    Alert.alert(
      'Admin Registration',
      'Admin accounts require approval. Your registration will be reviewed by system administrators.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed',
          onPress: async () => {
            setLoading(true);
            try {
              const signupData = {
                ...formData,
                userType: 'admin',
                address: `Department: ${formData.department}, Employee ID: ${formData.employeeId}`,
              };
              delete signupData.confirmPassword;
              delete signupData.department;
              delete signupData.employeeId;

              const response = await makeApiCall(apiClient.auth.signup, {
                method: 'POST',
                body: JSON.stringify(signupData),
              });

              if (response.success) {
                Alert.alert(
                  'Registration Submitted',
                  'Your admin registration has been submitted for approval. You will be notified once your account is activated.',
                  [
                    {
                      text: 'OK',
                      onPress: () => navigation.navigate('AdminLogin'),
                    },
                  ]
                );
              }
            } catch (error) {
              Alert.alert('Error', error.message || 'Registration failed');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderInput = (field, placeholder, icon, options = {}) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{options.label || placeholder}</Text>
      <View style={[styles.inputWrap, focused === field && styles.inputFocused]}>
        <Ionicons name={icon} size={18} color={focused === field ? '#334155' : '#A3A3A3'} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={formData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          placeholderTextColor="#A3A3A3"
          onFocus={() => setFocused(field)}
          onBlur={() => setFocused(null)}
          keyboardType={options.keyboardType || 'default'}
          autoCapitalize={options.autoCapitalize || 'sentences'}
        />
      </View>
    </View>
  );

  const renderPasswordInput = (field, placeholder, label, showState, toggleState) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, focused === field && styles.inputFocused]}>
        <Ionicons name="lock-closed-outline" size={18} color={focused === field ? '#334155' : '#A3A3A3'} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={formData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          secureTextEntry={!showState}
          placeholderTextColor="#A3A3A3"
          onFocus={() => setFocused(field)}
          onBlur={() => setFocused(null)}
        />
        <TouchableOpacity
          onPress={toggleState}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={showState ? 'eye-outline' : 'eye-off-outline'}
            size={18}
            color="#A3A3A3"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Nav */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={22} color="#171717" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Admin Registration</Text>
            <Text style={styles.subtitle}>Request administrator access</Text>
          </View>

          {/* Warning */}
          <View style={styles.notice}>
            <Ionicons name="information-circle-outline" size={18} color="#D97706" />
            <Text style={styles.noticeText}>
              Admin registrations require approval. Please provide accurate information for verification.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {renderInput('fullName', 'Full name', 'person-outline', { label: 'Full Name *' })}
            {renderInput('email', 'admin@example.gov', 'mail-outline', { label: 'Official Email *', keyboardType: 'email-address', autoCapitalize: 'none' })}
            {renderInput('department', 'e.g. Public Works', 'business-outline', { label: 'Department *' })}
            {renderInput('employeeId', 'e.g. EMP-12345', 'card-outline', { label: 'Employee ID *' })}
            {renderInput('phoneNumber', '+91 XXXXX XXXXX', 'call-outline', { label: 'Phone Number *', keyboardType: 'phone-pad' })}
            {renderPasswordInput('password', 'Min. 8 characters', 'Password *', showPassword, () => setShowPassword(!showPassword))}
            {renderPasswordInput('confirmPassword', 'Re-enter password', 'Confirm Password *', showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword))}

            {/* Requirements */}
            <View style={styles.requirements}>
              <Text style={styles.reqTitle}>Required for admin access</Text>
              {[
                'Valid government/organizational email',
                'Official department information',
                'Employee identification',
                'Verification by system admin',
              ].map((item, i) => (
                <View key={i} style={styles.reqRow}>
                  <View style={styles.reqDot} />
                  <Text style={styles.reqText}>{item}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.signupButton, loading && styles.signupButtonDisabled]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.signupButtonText}>Submit Registration</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have admin access? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('AdminLogin')}>
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
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
    marginBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0A0A0A',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#737373',
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 14,
    borderRadius: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  noticeText: {
    fontSize: 13,
    color: '#92400E',
    flex: 1,
    marginLeft: 10,
    lineHeight: 18,
  },
  form: {
    marginBottom: 28,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#404040',
    marginBottom: 6,
    marginLeft: 2,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 14,
    minHeight: 50,
  },
  inputFocused: {
    borderColor: '#334155',
    backgroundColor: '#F8FAFC',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#171717',
    marginLeft: 10,
    paddingVertical: 12,
  },
  requirements: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reqTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
  },
  reqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  reqDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#334155',
    marginRight: 10,
  },
  reqText: {
    fontSize: 13,
    color: '#64748B',
  },
  signupButton: {
    backgroundColor: '#334155',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButtonDisabled: {
    backgroundColor: '#A3A3A3',
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#737373',
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
});

export default AdminSignupScreen;
