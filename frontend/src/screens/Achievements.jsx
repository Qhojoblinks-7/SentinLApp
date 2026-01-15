import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { theme } from '../lib/theme';
import { useGetProfileQuery } from '../services/authApi';

const Achievements = ({ navigation }) => {
  const { data: profile, isLoading, error } = useGetProfileQuery();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading achievements...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error loading achievements</Text>
      </View>
    );
  }

  const unlockedAchievements = profile?.achievements || [];
  const unlockedNames = unlockedAchievements.map(a => a.name);

  const allAchievements = [
    { name: '7-Day Streak Master', description: 'Maintained a 7-day streak', icon: '🏆' },
    { name: 'Task Completion Hero', description: 'Achieved 80% discipline score', icon: '💪' },
    { name: 'Health Guardian', description: 'Maintained 100% avatar health', icon: '🔥' },
  ];

  const achievements = allAchievements.map(ach => ({
    ...ach,
    unlocked: unlockedNames.includes(ach.name),
  }));

  const unlockedCount = unlockedAchievements.length;
  const totalCount = allAchievements.length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Achievements</Text>
        <Text style={styles.subtitle}>{unlockedCount} of {totalCount} unlocked</Text>
        <ProgressBar progress={(unlockedCount / totalCount) * 100} />
      </View>

      <View style={styles.achievementsGrid}>
        {achievements.map((achievement, index) => (
          <Card key={index} style={[
            styles.achievementCard,
            achievement.unlocked ? styles.unlockedCard : styles.lockedCard
          ]}>
            <Text style={styles.achievementIcon}>{achievement.icon}</Text>
            <Text style={[
              styles.achievementTitle,
              achievement.unlocked ? styles.unlockedText : styles.lockedText
            ]}>
              {achievement.name}
            </Text>
            <Text style={[
              styles.achievementDesc,
              achievement.unlocked ? styles.unlockedText : styles.lockedText
            ]}>
              {achievement.description}
            </Text>
            {achievement.unlocked && (
              <Text style={styles.unlockedBadge}>✓ Unlocked</Text>
            )}
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.large,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  subtitle: {
    fontSize: theme.fontSize.title,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.medium,
  },
  achievementsGrid: {
    padding: theme.spacing.medium,
  },
  achievementCard: {
    marginBottom: theme.spacing.medium,
    alignItems: 'center',
  },
  unlockedCard: {
    borderColor: theme.colors.primary,
  },
  lockedCard: {
    opacity: 0.7,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.small,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing.small,
  },
  achievementDesc: {
    fontSize: theme.fontSize.subtitle,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.medium,
  },
  unlockedText: {
    color: theme.colors.text,
  },
  lockedText: {
    color: theme.colors.textSecondary,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressText: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.primary,
    marginTop: theme.spacing.small,
  },
  unlockedBadge: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

export default Achievements;