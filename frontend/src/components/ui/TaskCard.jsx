import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle2, Circle } from 'lucide-react-native';
import { theme } from '../../lib/theme';

export const TaskCard = ({ title, micro, isCompleted, onToggle, lazyMode }) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[
        styles.container,
        { borderColor: isCompleted ? theme.colors.borderCompleted : theme.colors.border }
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, isCompleted && styles.titleCompleted]}>
          {lazyMode ? micro : title}
        </Text>
        {!lazyMode && (
          <Text style={styles.subtitle}>
            Micro: {micro}
          </Text>
        )}
      </View>

      {isCompleted ? (
        <CheckCircle2 color={theme.colors.primary} size={28} />
      ) : (
        <Circle color={theme.colors.border} size={28} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.cardPadding,
    borderRadius: theme.borderRadius.card,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.marginBottom,
    borderWidth: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.title,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  titleCompleted: {
    color: theme.colors.textCompleted,
    textDecorationLine: 'line-through',
  },
  subtitle: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
});