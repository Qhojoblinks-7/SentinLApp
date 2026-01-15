import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { theme } from '../../lib/theme';

export const Input = ({ label, placeholder, value, onChangeText, secureTextEntry = false, error }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.medium,
  },
  label: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.medium,
    fontSize: theme.fontSize.title,
    color: theme.colors.text,
    backgroundColor: theme.colors.cardBackground,
  },
  inputError: {
    borderColor: '#ef4444', // red-500
  },
  errorText: {
    fontSize: theme.fontSize.subtitle,
    color: '#ef4444',
    marginTop: theme.spacing.small,
  },
});