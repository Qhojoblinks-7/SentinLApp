import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../lib/theme';

export default function IdentityCard({ score }) {
  const getBorderColor = () => {
    if (score > 80) return theme.colors.primary;
    if (score < 30) return '#ef4444'; // red-500
    return theme.colors.border;
  };

  return (
    <View style={[styles.container, { borderColor: getBorderColor() }]}>
      <Text style={styles.title}>Current Integrity</Text>
      <View style={styles.progressContainer}>
        <View
          style={[styles.progressBar, { width: `${score}%` }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.large * 1.5, // p-6
    borderRadius: theme.borderRadius.card,
    borderWidth: 2,
    backgroundColor: theme.colors.cardBackground,
  },
  title: {
    color: theme.colors.text,
    fontSize: 20, // text-xl
    fontWeight: 'bold',
  },
  progressContainer: {
    height: 8, // h-2
    width: '100%',
    backgroundColor: theme.colors.progressBg,
    marginTop: theme.spacing.large,
    borderRadius: theme.borderRadius.progress,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.progressBar,
    borderRadius: theme.borderRadius.progress,
  },
});