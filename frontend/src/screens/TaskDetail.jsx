import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Avatar } from '../components/ui/Avatar';
import { theme } from '../lib/theme';
import { useUpdateTaskMutation } from '../services/tasksApi';
import Toast from 'react-native-toast-message';

const TaskDetail = ({ route, navigation }) => {
  const task = route.params?.task;
  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.taskTitle}>No task selected</Text>
      </View>
    );
  }
  const [isCompleted, setIsCompleted] = useState(task.is_completed);
  const [updateTask] = useUpdateTaskMutation();

  const handleComplete = async () => {
    try {
      await updateTask({ id: task.id, is_completed: true }).unwrap();
      setIsCompleted(true);
      Toast.show({
        type: 'success',
        text1: 'Task Completed!',
        text2: 'Great job! Your avatar gained XP.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update task',
      });
    }
  };

  const handleMicroVersion = async () => {
    try {
      await updateTask({ id: task.id, is_micro_completed: true }).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Micro Version Completed!',
        text2: 'Good effort! Your streak is saved.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update task',
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskMicro}>Micro Version: {task.micro_version}</Text>
        <View style={styles.statusContainer}>
          <Text style={[styles.status, isCompleted && styles.statusCompleted]}>
            {isCompleted ? 'Completed' : 'In Progress'}
          </Text>
          <ProgressBar progress={isCompleted ? 100 : 50} />
        </View>
      </Card>

      <Card style={styles.descriptionCard}>
        <Text style={styles.sectionTitle}>Task Description</Text>
        <Text style={styles.description}>
          This task is designed to build your discipline through consistent action.
          Complete it daily to maintain your streak and keep your avatar healthy.
        </Text>
      </Card>

      <Card style={styles.rewardsCard}>
        <Text style={styles.sectionTitle}>Rewards</Text>
        <View style={styles.rewardItem}>
          <Text style={styles.rewardText}>✅ Complete: +10 XP</Text>
        </View>
        <View style={styles.rewardItem}>
          <Text style={styles.rewardText}>🔥 Streak Bonus: +5 XP per day</Text>
        </View>
        <View style={styles.rewardItem}>
          <Text style={styles.rewardText}>🏆 Avatar Health: +5%</Text>
        </View>
      </Card>

      <Card style={styles.avatarCard}>
        <Text style={styles.sectionTitle}>Your Avatar</Text>
        <Avatar name="Hero" level={3} health={90} size={100} />
        <Text style={styles.avatarNote}>
          Complete this task to keep your avatar healthy and strong!
        </Text>
      </Card>

      <View style={styles.actions}>
        {!isCompleted && (
          <>
            <Button title="Mark as Complete" onPress={handleComplete} />
            <View style={styles.buttonSpacing} />
            <Button title="Use Micro Version" onPress={handleMicroVersion} variant="outline" />
          </>
        )}
        {isCompleted && (
          <Button title="Task Completed ✓" onPress={() => {}} disabled />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerCard: {
    margin: theme.spacing.large,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  taskMicro: {
    fontSize: theme.fontSize.title,
    color: theme.colors.primary,
    marginBottom: theme.spacing.medium,
  },
  statusContainer: {
    marginTop: theme.spacing.medium,
  },
  status: {
    fontSize: theme.fontSize.title,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.small,
  },
  statusCompleted: {
    color: theme.colors.primary,
  },
  descriptionCard: {
    margin: theme.spacing.large,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
  },
  description: {
    fontSize: theme.fontSize.title,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  rewardsCard: {
    margin: theme.spacing.large,
    marginTop: 0,
  },
  rewardItem: {
    marginBottom: theme.spacing.small,
  },
  rewardText: {
    fontSize: theme.fontSize.title,
    color: theme.colors.text,
  },
  avatarCard: {
    margin: theme.spacing.large,
    marginTop: 0,
    alignItems: 'center',
  },
  avatarNote: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.medium,
    fontStyle: 'italic',
  },
  actions: {
    padding: theme.spacing.large,
  },
  buttonSpacing: {
    height: theme.spacing.medium,
  },
});

export default TaskDetail;