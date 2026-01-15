import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../lib/theme';

export const ProgressBar = ({ progress, height = 8, color = theme.colors.primary }) => {
  return (
    <View style={[styles.container, { height }]}>
      <View style={[styles.bar, { width: `${progress}%`, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.progressBg,
    borderRadius: theme.borderRadius.progress,
  },
  bar: {
    height: '100%',
    borderRadius: theme.borderRadius.progress,
  },
});