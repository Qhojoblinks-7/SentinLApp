import React from 'react';
import { View, StyleSheet } from 'react-native';
import { User } from 'lucide-react-native';
import { theme } from '../../lib/theme';

export const Avatar = ({ score = 75, size = 100 }) => {
  // Determine color based on Redux state (discipline score)
  const getStatusColor = () => {
    if (score >= 85) return '#3b82f6'; // Blue (Integrity)
    if (score >= 50) return '#94a3b8'; // Slate (Neutral)
    return '#f59e0b'; // Amber (Lazy Mode)
  };

  const statusColor = getStatusColor();

  return (
    <View style={[styles.outerRing, { borderColor: statusColor, width: size, height: size }]}>
      <View style={styles.innerCircle}>
        <User size={size * 0.4} color={statusColor} strokeWidth={1.5} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerRing: {
    borderRadius: 50,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    // Glow effect (iOS)
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  innerCircle: {
    width: '85%',
    height: '85%',
    borderRadius: 42.5,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  }
});