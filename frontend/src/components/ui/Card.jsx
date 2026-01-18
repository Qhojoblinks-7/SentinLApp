import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { theme } from '../../lib/theme';

export const Card = ({ children, style, status = 'nominal' }) => {
  // Map status to glow colors
  const statusColors = {
    nominal: '#3b82f6',
    warning: '#f59e0b',
    critical: '#ef4444',
    god: '#60a5fa',
  };

  const activeColor = statusColors[status] || statusColors.nominal;

  return (
    <View style={[styles.outerContainer, { borderColor: activeColor }, style]}>
      {/* 1. SEMI-TRANSPARENT GLASS BASE */}
      <View style={styles.glassBackground}>
        
        {/* 2. TACTICAL CORNER BRACKETS */}
        <View style={[styles.bracket, styles.topL, { borderColor: activeColor }]} />
        <View style={[styles.bracket, styles.topR, { borderColor: activeColor }]} />
        <View style={[styles.bracket, styles.botL, { borderColor: activeColor }]} />
        <View style={[styles.bracket, styles.botR, { borderColor: activeColor }]} />

        {/* 3. CONTENT AREA */}
        <View style={styles.content}>
          {children}
        </View>

        {/* 4. DATA BAR (Subtle tech detail) */}
        <View style={[styles.dataBar, { backgroundColor: activeColor }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)', // Deep slate translucent
    borderRadius: 4,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    marginVertical: 10,
  },
  glassBackground: {
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    zIndex: 2,
  },
  // TACTICAL ACCENTS
  bracket: {
    position: 'absolute',
    width: 12,
    height: 12,
    opacity: 0.8,
  },
  topL: { top: 4, left: 4, borderTopWidth: 2, borderLeftWidth: 2 },
  topR: { top: 4, right: 4, borderTopWidth: 2, borderRightWidth: 2 },
  botL: { bottom: 4, left: 4, borderBottomWidth: 2, borderLeftWidth: 2 },
  botR: { bottom: 4, right: 4, borderBottomWidth: 2, borderRightWidth: 2 },
  
  dataBar: {
    position: 'absolute',
    bottom: 0,
    left: '10%',
    right: '10%',
    height: 1,
    opacity: 0.3,
  }
});