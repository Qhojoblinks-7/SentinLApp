import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../components/ui/Card';
import { theme } from '../lib/theme';
import { useGetHistoryQuery } from '../services/tasksApi';

const History = ({ navigation }) => {
  const { data: tasks = [], isLoading, error } = useGetHistoryQuery();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading history...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error loading history</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Task History</Text>

      {tasks.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>No tasks completed yet.</Text>
          <Text style={styles.emptySubtext}>Complete some tasks to see your history here!</Text>
        </Card>
      ) : (
        tasks.map((task) => (
          <Card key={task.id} style={styles.taskCard}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskMicro}>Micro: {task.micro_version}</Text>
            <View style={styles.taskStatus}>
              <Text style={[styles.status, task.is_completed && styles.statusCompleted]}>
                {task.is_completed ? 'Completed' : 'Micro Completed'}
              </Text>
              <Text style={styles.date}>
                {new Date(task.created_at).toLocaleDateString()}
              </Text>
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.large * 1.5,
    paddingTop: theme.spacing.large * 4,
  },
  title: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: theme.spacing.large * 1.5,
  },
  emptyCard: {
    margin: theme.spacing.large,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fontSize.title,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.small,
  },
  emptySubtext: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  taskCard: {
    marginBottom: theme.spacing.medium,
  },
  taskTitle: {
    fontSize: theme.fontSize.title,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  taskMicro: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.primary,
    marginBottom: theme.spacing.medium,
  },
  taskStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.textSecondary,
  },
  statusCompleted: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  date: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.textSecondary,
  },
});

export default History;