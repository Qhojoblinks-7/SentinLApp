import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Switch, Modal, 
  TouchableOpacity, Platform, SafeAreaView 
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from '../components/ui/Card';
import { theme } from '../lib/theme';
import { setNotifications, setVoiceCommands, setNfcEnabled, setDarkMode } from '../store/settingsSlice';
import { logout } from '../store/authSlice';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import { 
  Bell, Mic, Cpu, Moon, Lock, Database, 
  Trash2, Info, ChevronRight, LogOut, AlertCircle, ShieldAlert 
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Settings = ({ navigation }) => {
  const dispatch = useDispatch();
  const { notifications, voiceCommands, nfcEnabled, darkMode } = useSelector(state => state.settings);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const SettingItem = ({ icon: Icon, label, subLabel, value, onToggle, type = 'toggle', color = theme.colors.primary }) => (
    <TouchableOpacity 
      activeOpacity={type === 'toggle' ? 1 : 0.7} 
      style={styles.settingRow}
      onPress={type === 'link' ? onToggle : null}
    >
      <View style={styles.settingLabelGroup}>
        <View style={[styles.iconBg, { backgroundColor: `${color}15` }]}>
          <Icon size={18} color={color} />
        </View>
        <View>
          <Text style={styles.settingLabel}>{label.toUpperCase()}</Text>
          {subLabel && <Text style={styles.settingSubLabel}>{subLabel}</Text>}
        </View>
      </View>
      {type === 'toggle' ? (
        <Switch 
          value={value} 
          onValueChange={onToggle}
          trackColor={{ false: '#1e293b', true: theme.colors.primary }}
          thumbColor={Platform.OS === 'ios' ? '#fff' : value ? '#fff' : '#475569'}
        />
      ) : (
        <ChevronRight size={18} color="#334155" />
      )}
    </TouchableOpacity>
  );

  const confirmLogout = () => {
    dispatch(logout());
    navigation.replace('Login');
    setLogoutModalVisible(false);
  };

  const handleNotificationsToggle = async (value) => {
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'ACCESS DENIED', text2: 'Push permissions required.' });
        return;
      }
    }
    dispatch(setNotifications(value));
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.flex}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerSubtitle}>SYSTEM_PREFERENCES_V2</Text>
            <Text style={styles.title}>Configuration</Text>
          </View>

          {/* 1. COMMUNICATIONS */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>NETWORK & COMMS</Text>
            <View style={styles.headerLine} />
          </View>
          <Card style={styles.sectionCard}>
            <SettingItem 
              icon={Bell} 
              label="Neural Alerts" 
              subLabel="Push notification protocol"
              value={notifications} 
              onToggle={handleNotificationsToggle} 
            />
            <View style={styles.divider} />
            <SettingItem 
              icon={Mic} 
              label="Vocal Interface" 
              subLabel="AI voice feedback"
              value={voiceCommands} 
              onToggle={(v) => dispatch(setVoiceCommands(v))} 
            />
          </Card>

          {/* 2. HARDWARE */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>HARDWARE MODULES</Text>
            <View style={styles.headerLine} />
          </View>
          <Card style={styles.sectionCard}>
            <SettingItem 
              icon={Cpu} 
              label="NFC Module" 
              subLabel="External tag synchronization"
              value={nfcEnabled} 
              onToggle={(v) => dispatch(setNfcEnabled(v))} 
            />
            <View style={styles.divider} />
            <SettingItem 
              icon={Moon} 
              label="Stealth Mode" 
              subLabel="High-contrast OLED interface"
              value={darkMode} 
              onToggle={(v) => dispatch(setDarkMode(v))} 
            />
          </Card>

          {/* 3. SECURITY */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>ENCRYPTION & DATA</Text>
            <View style={styles.headerLine} />
          </View>
          <Card style={styles.sectionCard}>
            <SettingItem icon={Lock} label="Access Key" subLabel="Modify encryption string" type="link" />
            <View style={styles.divider} />
            <SettingItem icon={Database} label="Cloud Sync" subLabel="Archive mission progress" type="link" />
            <View style={styles.divider} />
            <SettingItem 
              icon={Trash2} 
              label="Purge Archives" 
              subLabel="Irreversible data wipe"
              color="#ef4444"
              type="link" 
              onToggle={() => Toast.show({type: 'info', text1: 'Confirming Wipe...'})}
            />
          </Card>

          {/* FOOTER INFO */}
          <View style={styles.footerInfo}>
             <Info size={14} color="#334155" />
             <Text style={styles.aboutText}>SENTINL OS // BUILD_2026.01.18</Text>
          </View>

          <TouchableOpacity 
            style={styles.logoutBtn} 
            activeOpacity={0.8}
            onPress={() => setLogoutModalVisible(true)}
          >
            <LinearGradient
              colors={['#ef4444', '#991b1b']}
              style={styles.logoutGradient}
            >
              <LogOut size={18} color="#fff" />
              <Text style={styles.logoutBtnText}>TERMINATE SESSION</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      {/* TACTICAL MODAL */}
      <Modal visible={logoutModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ShieldAlert size={32} color="#ef4444" />
              <Text style={styles.modalTitle}>SECURITY ALERT</Text>
            </View>
            <Text style={styles.modalMessage}>You are about to terminate the active link. All unsynced mission data will be cached locally.</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setLogoutModalVisible(false)}>
                <Text style={styles.cancelBtnText}>STAY ACTIVE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmLogout}>
                <Text style={styles.confirmBtnText}>CONFIRM LOGOUT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#020617' },
  flex: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24 },
  header: { marginTop: 40, marginBottom: 40 },
  headerSubtitle: { color: theme.colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 3 },
  title: { fontSize: 36, fontWeight: '900', color: '#fff', marginTop: 4 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 10 },
  sectionLabel: { color: '#475569', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginRight: 12 },
  headerLine: { flex: 1, height: 1, backgroundColor: '#1e293b' },

  sectionCard: { backgroundColor: '#0f172a', borderRadius: 28, padding: 8, marginBottom: 32, borderWidth: 1, borderColor: '#1e293b' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  settingLabelGroup: { flexDirection: 'row', alignItems: 'center' },
  iconBg: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  settingLabel: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
  settingSubLabel: { color: '#475569', fontSize: 11, marginTop: 2, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#1e293b', marginHorizontal: 16 },
  
  footerInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  aboutText: { color: '#334155', fontSize: 10, marginLeft: 8, fontWeight: '900', letterSpacing: 1 },
  
  logoutBtn: { marginBottom: 60, borderRadius: 20, overflow: 'hidden' },
  logoutGradient: { flexDirection: 'row', padding: 20, alignItems: 'center', justifyContent: 'center' },
  logoutBtnText: { color: '#fff', fontWeight: '900', fontSize: 12, letterSpacing: 2, marginLeft: 12 },

  /* Tactical Modal */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.95)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: '#0f172a', borderRadius: 32, padding: 32, borderWidth: 1, borderColor: '#ef4444' },
  modalHeader: { alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#ef4444', fontSize: 18, fontWeight: '900', marginTop: 12, letterSpacing: 2 },
  modalMessage: { color: '#94a3b8', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cancelBtn: { flex: 1, alignItems: 'center' },
  cancelBtnText: { color: '#64748b', fontWeight: '900', fontSize: 12 },
  confirmBtn: { flex: 1.5, backgroundColor: '#ef4444', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontWeight: '900', fontSize: 12 },
});

export default Settings;