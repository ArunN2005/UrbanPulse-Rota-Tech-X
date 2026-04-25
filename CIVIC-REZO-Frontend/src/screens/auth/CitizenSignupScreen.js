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

const CitizenSignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    address: '',
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
    if (!formData.email || !formData.password || !formData.fullName || !formData.phoneNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const signupData = {
        ...formData,
        userType: 'citizen',
      };
      delete signupData.confirmPassword;

      const response = await makeApiCall(apiClient.auth.signup, {
        method: 'POST',
        body: JSON.stringify(signupData),
      });

      if (response.success) {
        Alert.alert(
          'Account Created',
          'Your citizen account has been created successfully. You can now sign in.',
          [
            {
              text: 'Sign In',
              onPress: () => navigation.navigate('CitizenLogin'),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (field, placeholder, icon, options = {}) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{options.label || placeholder}</Text>
      <View style={[styles.inputWrap, focused === field && styles.inputFocused]}>
        <Ionicons name={icon} size={18} color={focused === field ? '#0F766E' : '#A3A3A3'} />
        <TextInput
          style={[styles.input, options.multiline && styles.multilineInput]}
          placeholder={placeholder}
          value={formData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          placeholderTextColor="#A3A3A3"
          onFocus={() => setFocused(field)}
          onBlur={() => setFocused(null)}
          keyboardType={options.keyboardType || 'default'}
          autoCapitalize={options.autoCapitalize || 'sentences'}
          multiline={options.multiline}
          numberOfLines={options.numberOfLines}
        />
      </View>
    </View>
  );

  const renderPasswordInput = (field, placeholder, label, showState, toggleState) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, focused === field && styles.inputFocused]}>
        <Ionicons name="lock-closed-outline" size={18} color={focused === field ? '#0F766E' : '#A3A3A3'} />
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join as a citizen to start reporting civic issues</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {renderInput('fullName', 'Full name', 'person-outline', { label: 'Full Name *' })}
            {renderInput('email', 'you@example.com', 'mail-outline', { label: 'Email *', keyboardType: 'email-address', autoCapitalize: 'none' })}
            {renderInput('phoneNumber', '+91 XXXXX XXXXX', 'call-outline', { label: 'Phone Number *', keyboardType: 'phone-pad' })}
            {renderInput('address', 'Your address', 'location-outline', { label: 'Address (Optional)', multiline: true, numberOfLines: 2 })}
            {renderPasswordInput('password', 'Min. 6 characters', 'Password *', showPassword, () => setShowPassword(!showPassword))}
            {renderPasswordInput('confirmPassword', 'Re-enter password', 'Confirm Password *', showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword))}

            <TouchableOpacity
              style={[styles.signupButton, loading && styles.signupButtonDisabled]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.signupButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('CitizenLogin')}>
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
    marginBottom: 28,
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
    lineHeight: 22,
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
    borderColor: '#0F766E',
    backgroundColor: '#FAFFFE',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#171717',
    marginLeft: 10,
    paddingVertical: 12,
  },
  multilineInput: {
    textAlignVertical: 'top',
  },
  signupButton: {
    backgroundColor: '#0F766E',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
    color: '#0F766E',
  },
});

export default CitizenSignupScreen;
