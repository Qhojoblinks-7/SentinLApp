import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TaskCard, Button, Card } from '../components/ui';
import { theme } from '../lib/theme';
import { useGetTasksQuery } from '../services/tasksApi';

const Dashboard = ({ navigation }) => {
  const [lazyMode, setLazyMode] = useState(false);
  const { data: tasks = [], isLoading, error } = useGetTasksQuery();

  const handleToggle = (task) => {
    navigation.navigate('TaskDetail', { task });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading tasks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error loading tasks</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      <View style={styles.toggleContainer}>
        <Button
          title={lazyMode ? "Exit Lazy Mode" : "Enter Lazy Mode"}
          onPress={() => setLazyMode(!lazyMode)}
          variant="outline"
        />
      </View>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          title={task.title}
          micro={task.micro_version}
          isCompleted={task.is_completed}
          onToggle={() => handleToggle(task)}
          lazyMode={lazyMode}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.large * 1.5, // px-6
    paddingTop: theme.spacing.large * 4, // pt-16
  },
  title: {
    color: theme.colors.text,
    fontSize: 30, // text-3xl
    fontWeight: 'bold',
    marginBottom: theme.spacing.large * 1.5, // mb-6
  },
  toggleContainer: {
    marginBottom: theme.spacing.large,
  },
});

export default Dashboard;