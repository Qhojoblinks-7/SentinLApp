import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { theme } from '../lib/theme';
import { useRegisterMutation } from '../services/authApi';
import { UserPlus, Mail, Lock, ShieldCheck, ArrowLeft } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

const CreateAccount = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [register, { isLoading }] = useRegisterMutation();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) newErrors.email = 'IDENTIFICATION REQUIRED';
    else if (!emailRegex.test(email)) newErrors.email = 'INVALID PROTOCOL: EMAIL';
    
    if (!password) newErrors.password = 'ENCRYPTION KEY REQUIRED';
    else if (password.length < 6) newErrors.password = 'KEY TOO WEAK (MIN 6 CHARS)';
    
    if (password !== confirmPassword) newErrors.confirmPassword = 'KEYS DO NOT MATCH';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAccount = async () => {
    if (validate()) {
      try {
        // Mapping email to username as per your API requirement
        await register({ username: email.split('@')[0], email, password }).unwrap();
        Toast.show({
          type: 'success',
          text1: 'REGISTRATION COMPLETE',
          text2: 'Operator profile created. Please log in.',
        });
        navigation.replace('Login');
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'ENLISTMENT FAILED',
          text2: error.data?.message || 'Email already exists in database',
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. TOP NAVIGATION */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <ArrowLeft size={20} color={theme.colors.textSecondary} />
        <Text style={styles.backText}>BACK TO LOGIN</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 2. HEADER */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <UserPlus size={32} color={theme.colors.primary} />
            </View>
            <Text style={styles.title}>Enlist Operator</Text>
            <Text style={styles.subtitle}>
              Begin your journey toward peak discipline. Initialize your neural-link.
            </Text>
          </View>

          {/* 3. FORM FIELDS */}
          <View style={styles.form}>
            <Input
              label="OPERATOR EMAIL"
              placeholder="operator@sentinl.io"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
              leftIcon={<Mail size={18} color="#475569" />}
            />

            <Input
              label="ACCESS KEY"
              placeholder="Create strong password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
              leftIcon={<Lock size={18} color="#475569" />}
            />

            <Input
              label="VERIFY ACCESS KEY"
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={errors.confirmPassword}
              leftIcon={<ShieldCheck size={18} color="#475569" />}
            />

            <View style={styles.requirementBox}>
              <Text style={styles.requirementText}>
                {password.length >= 6 ? '✅' : '○'} Minimum 6 characters
              </Text>
            </View>
          </View>

          {/* 4. ACTION */}
          <View style={styles.actionSection}>
            <Button 
              title={isLoading ? "INITIALIZING..." : "CREATE PROFILE"} 
              onPress={handleCreateAccount} 
              disabled={isLoading} 
              style={styles.mainBtn}
            />
            <Text style={styles.termsText}>
              By enlisting, you agree to the SentinL Protocol & Terms of Service.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    gap: 8,
  },
  backText: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  form: {
    gap: 12,
  },
  requirementBox: {
    marginTop: -4,
    paddingLeft: 4,
  },
  requirementText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  actionSection: {
    marginTop: 40,
    gap: 16,
  },
  mainBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
  },
  termsText: {
    fontSize: 11,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default CreateAccount;