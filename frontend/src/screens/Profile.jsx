import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { theme } from '../lib/theme';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useGetProfileQuery } from '../services/authApi';
import Toast from 'react-native-toast-message';

const Profile = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { data: profile, isLoading, error } = useGetProfileQuery();

  useEffect(() => {
    if (error && error.status === 403) {
      dispatch(logout());
      navigation.replace('Login');
    }
  }, [error, dispatch, navigation]);


  if (!user || isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>Error loading profile</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar name={user.username} level={Math.floor(profile.discipline_score / 20) + 1} health={profile.avatar_health} size={120} />
        <Text style={styles.name}>{user.username}</Text>
        <Text style={styles.level}>{user.email}</Text>
      </View>

      <Card style={styles.statsCard}>
        <Text style={styles.cardTitle}>Stats</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Health</Text>
          <ProgressBar progress={profile.avatar_health} />
          <Text style={styles.statValue}>{profile.avatar_health}%</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Discipline Score</Text>
          <ProgressBar progress={profile.discipline_score} color="#8b5cf6" />
          <Text style={styles.statValue}>{profile.discipline_score}%</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Current Streak</Text>
          <Text style={styles.statValue}>{profile.current_streak} days</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Tasks Completed</Text>
          <Text style={styles.statValue}>{profile.tasks.filter(t => t.is_completed).length}</Text>
        </View>
      </Card>

      <Card style={styles.achievementsCard}>
        <Text style={styles.cardTitle}>Recent Achievements</Text>
        {profile.achievements && profile.achievements.length > 0 ? (
          profile.achievements.map((achievement) => (
            <Text key={achievement.id} style={styles.achievement}>
              {achievement.name === '7-Day Streak Master' && '🏆 '}
              {achievement.name === 'Task Completion Hero' && '💪 '}
              {achievement.name === 'Health Guardian' && '🔥 '}
              {achievement.name}
            </Text>
          ))
        ) : (
          <Text style={styles.achievement}>🌱 Just Getting Started</Text>
        )}
      </Card>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    padding: theme.spacing.large,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.medium,
  },
  level: {
    fontSize: theme.fontSize.title,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.small,
  },
  statsCard: {
    margin: theme.spacing.large,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
  },
  statRow: {
    marginBottom: theme.spacing.medium,
  },
  statLabel: {
    fontSize: theme.fontSize.title,
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  statValue: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.primary,
    textAlign: 'right',
    marginTop: theme.spacing.small,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  achievementsCard: {
    margin: theme.spacing.large,
    marginTop: 0,
  },
  achievement: {
    fontSize: theme.fontSize.title,
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
});

export default Profile;