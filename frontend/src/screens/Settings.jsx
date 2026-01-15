import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { theme } from '../lib/theme';
import { setNotifications, setVoiceCommands, setNfcEnabled, setDarkMode } from '../store/settingsSlice';
import { logout } from '../store/authSlice';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';

const Settings = ({ navigation }) => {
  const dispatch = useDispatch();
  const { notifications, voiceCommands, nfcEnabled, darkMode } = useSelector(state => state.settings);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleResetProgress = () => {
    Toast.show({
      type: 'error',
      text1: 'Progress Reset',
      text2: 'All progress has been reset.',
    });
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    navigation.replace('Login');
    setLogoutModalVisible(false);
  };

  const cancelLogout = () => {
    setLogoutModalVisible(false);
  };

  const handleNotificationsToggle = async (value) => {
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: 'Push notifications permission is required to enable notifications.',
        });
        return;
      }
    }
    dispatch(setNotifications(value));
  };

  const handleVoiceCommandsToggle = (value) => {
    dispatch(setVoiceCommands(value));
  };

  const handleNfcToggle = (value) => {
    dispatch(setNfcEnabled(value));
  };

  const handleDarkModeToggle = (value) => {
    dispatch(setDarkMode(value));
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Push Notifications</Text>
          <Switch value={notifications} onValueChange={handleNotificationsToggle} />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Voice Command Alerts</Text>
          <Switch value={voiceCommands} onValueChange={handleVoiceCommandsToggle} />
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>NFC Tag Support</Text>
          <Switch value={nfcEnabled} onValueChange={handleNfcToggle} />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={handleDarkModeToggle} />
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Button title="Change Password" onPress={() => {}} variant="outline" />
        <View style={styles.buttonSpacing} />
        <Button title="Backup Data" onPress={() => {}} variant="outline" />
        <View style={styles.buttonSpacing} />
        <Button title="Reset Progress" onPress={handleResetProgress} variant="outline" />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>SentinL v1.0.0</Text>
        <Text style={styles.aboutText}>Build discipline through consistent action.</Text>
        <View style={styles.buttonSpacing} />
        <Button title="Privacy Policy" onPress={() => {}} variant="outline" />
        <View style={styles.buttonSpacing} />
        <Button title="Terms of Service" onPress={() => {}} variant="outline" />
      </Card>

      <View style={styles.logoutSection}>
        <Button title="Logout" onPress={handleLogout} variant="secondary" />
      </View>
      </ScrollView>

      <Modal
        visible={logoutModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <View style={styles.modalButton}>
                <Button title="Cancel" onPress={cancelLogout} variant="outline" />
              </View>
              <View style={styles.modalButton}>
                <Button title="Logout" onPress={confirmLogout} variant="secondary" />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    margin: theme.spacing.large,
  },
  section: {
    margin: theme.spacing.large,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  settingLabel: {
    fontSize: theme.fontSize.title,
    color: theme.colors.text,
  },
  buttonSpacing: {
    height: theme.spacing.medium,
  },
  aboutText: {
    fontSize: theme.fontSize.title,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.small,
  },
  logoutSection: {
    margin: theme.spacing.large,
  },
  mainContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.large,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.medium,
  },
  modalMessage: {
    fontSize: theme.fontSize.title,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.large,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: theme.spacing.small,
  },
});

export default Settings;