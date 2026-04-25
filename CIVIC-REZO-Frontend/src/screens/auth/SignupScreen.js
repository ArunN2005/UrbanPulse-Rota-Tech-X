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
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, makeApiCall } from '../../../config/supabase';

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    userType: 'citizen',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSignup = async () => {
    // Validation
    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const signupData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        userType: formData.userType,
        address: formData.address,
      };

      const response = await makeApiCall(apiClient.auth.signup, {
        method: 'POST',
        body: JSON.stringify(signupData),
      });

      if (response.success) {
        // Store auth token and user data
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));

        Alert.alert('Success', 'Account created successfully!');

        // Navigate based on user type
        if (response.data.user.userType === 'admin') {
          navigation.replace('EnhancedAdminDashboard');
        } else {
          navigation.replace('InstagramFeed');
        }
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field, placeholder, icon, options = {}) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{options.label || placeholder}</Text>
      <View style={[styles.inputWrap, focused === field && styles.inputFocused]}>
        <Ionicons name={icon} size={18} color={focused === field ? '#0F766E' : '#A3A3A3'} />
        <TextInput
          style={[styles.input, options.multiline && { textAlignVertical: 'top' }]}
          placeholder={placeholder}
          value={formData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          placeholderTextColor="#A3A3A3"
          onFocus={() => setFocused(field)}
          onBlur={() => setFocused(null)}
          keyboardType={options.keyboardType || 'default'}
          autoCapitalize={options.autoCapitalize || 'sentences'}
          secureTextEntry={options.secure}
          multiline={options.multiline}
          numberOfLines={options.numberOfLines}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the CivicStack community</Text>
          </View>

          <View style={styles.form}>
            {renderField('fullName', 'Full name', 'person-outline', { label: 'Full Name *' })}
            {renderField('email', 'you@example.com', 'mail-outline', { label: 'Email *', keyboardType: 'email-address', autoCapitalize: 'none' })}
            {renderField('phoneNumber', '+91 XXXXX XXXXX', 'call-outline', { label: 'Phone *', keyboardType: 'phone-pad' })}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>User Type *</Text>
              <View style={styles.pickerWrap}>
                <Ionicons name="people-outline" size={18} color="#A3A3A3" style={{ marginLeft: 14 }} />
                <Picker
                  selectedValue={formData.userType}
                  style={styles.picker}
                  onValueChange={(value) => handleInputChange('userType', value)}
                >
                  <Picker.Item label="Citizen" value="citizen" />
                  <Picker.Item label="Admin" value="admin" />
                </Picker>
              </View>
            </View>

            {renderField('address', 'Your address', 'location-outline', { label: 'Address (Optional)', multiline: true, numberOfLines: 2 })}
            {renderField('password', 'Min. 6 characters', 'lock-closed-outline', { label: 'Password *', secure: true })}
            {renderField('confirmPassword', 'Re-enter password', 'lock-closed-outline', { label: 'Confirm Password *', secure: true })}

            <TouchableOpacity
              style={[styles.signupButton, loading && styles.signupDisabled]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signupText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0A0A0A',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#737373',
  },
  form: {
    width: '100%',
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
  pickerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#171717',
  },
  signupButton: {
    backgroundColor: '#0F766E',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  signupDisabled: {
    backgroundColor: '#A3A3A3',
  },
  signupText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
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

export default SignupScreen;
