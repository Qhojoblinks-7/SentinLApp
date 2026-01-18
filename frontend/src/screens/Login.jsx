import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, 
  Platform, TouchableWithoutFeedback, Keyboard, Dimensions, SafeAreaView 
} from 'react-native';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { theme } from '../lib/theme';
import { useLoginMutation } from '../services/authApi';
import { ShieldCheck, Lock, Mail, ChevronRight, Cpu, Globe } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [login, { isLoading }] = useLoginMutation();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'CREDENTIALS REQUIRED';
    if (!password) newErrors.password = 'AUTHENTICATION KEY REQUIRED';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validate()) {
      try {
        await login({ email, password }).unwrap();
        navigation.replace('Onboarding');
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'ACCESS DENIED',
          text2: error.data?.message || 'Invalid credentials',
        });
      }
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Background Decorative Elements */}
      <View style={styles.gridOverlay} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.inner}>
            
            {/* 1. TOP STATUS BAR */}
            <View style={styles.topBar}>
              <View style={styles.statusGroup}>
                <Globe size={12} color="#10b981" />
                <Text style={styles.statusText}>ENCRYPTED_LINK: ACTIVE</Text>
              </View>
              <Text style={styles.versionText}>v2.0.4</Text>
            </View>

            {/* 2. BRANDING SECTION */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={['rgba(59, 130, 246, 0.2)', 'rgba(2, 6, 23, 0)']}
                  style={styles.logoGlow}
                />
                <ShieldCheck size={48} color={theme.colors.primary} />
              </View>
              <Text style={styles.title}>SentinL<Text style={styles.accentText}>OS</Text></Text>
              <Text style={styles.subtitle}>Enter operator credentials to establish neural link.</Text>
            </View>

            {/* 3. FORM SECTION */}
            <View style={styles.formCard}>
              <Input
                label="OPERATOR IDENTIFIER"
                placeholder="EMAIL_ADDRESS"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                autoCapitalize="none"
                keyboardType="email-address"
                leftIcon={<Mail size={18} color="#475569" />}
                containerStyle={styles.inputSpacing}
              />
              
              <View style={styles.passwordContainer}>
                <Input
                  label="SECURITY KEY"
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  error={errors.password}
                  leftIcon={<Lock size={18} color="#475569" />}
                />
                <TouchableOpacity style={styles.forgotLink}>
                  <Text style={styles.forgotText}>KEY_RECOVERY</Text>
                </TouchableOpacity>
              </View>

              <Button 
                title={isLoading ? "AUTHENTICATING..." : "INITIALIZE SESSION"} 
                onPress={handleLogin} 
                disabled={isLoading} 
                style={styles.loginBtn}
                textStyle={styles.loginBtnText}
              />
            </View>

            {/* 4. FOOTER ACTIONS */}
            <View style={styles.footer}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('CreateAccount')}
                style={styles.createAccountBtn}
              >
                <Cpu size={14} color="#64748b" style={{ marginRight: 8 }} />
                <Text style={styles.footerText}>NEW OPERATOR? </Text>
                <Text style={styles.signUpText}>REGISTER_UNIT</Text>
                <ChevronRight size={14} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#020617' },
  flex: { flex: 1 },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3b82f6',
    // In a real app, you'd use a repeating grid pattern image here
  },
  inner: { flex: 1, paddingHorizontal: 30, justifyContent: 'space-between' },
  
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  statusGroup: { flexDirection: 'row', alignItems: 'center' },
  statusText: { color: '#10b981', fontSize: 8, fontWeight: '900', marginLeft: 6, letterSpacing: 1 },
  versionText: { color: '#334155', fontSize: 8, fontWeight: '900' },

  header: { alignItems: 'center', marginTop: height * 0.05 },
  logoContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 50,
  },
  title: { fontSize: 40, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  accentText: { color: theme.colors.primary },
  subtitle: { 
    fontSize: 13, 
    color: '#64748b', 
    textAlign: 'center', 
    marginTop: 12, 
    lineHeight: 20,
    paddingHorizontal: 20 
  },

  formCard: { marginTop: 40 },
  inputSpacing: { marginBottom: 20 },
  passwordContainer: { position: 'relative' },
  forgotLink: { position: 'absolute', right: 0, top: 0 },
  forgotText: { color: '#3b82f6', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },

  loginBtn: {
    height: 60,
    borderRadius: 12,
    marginTop: 30,
    backgroundColor: theme.colors.primary,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  loginBtnText: { letterSpacing: 2, fontWeight: '900' },

  footer: { marginBottom: 30, alignItems: 'center' },
  createAccountBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#0f172a', 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  footerText: { color: '#64748b', fontSize: 10, fontWeight: '700' },
  signUpText: { color: theme.colors.primary, fontSize: 10, fontWeight: '900', marginRight: 4 },
});

export default Login;