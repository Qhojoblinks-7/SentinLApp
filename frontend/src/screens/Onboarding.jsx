import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { theme } from '../lib/theme';

const Onboarding = ({ navigation }) => {
  const [step, setStep] = useState(0);
  const [selectedTasks, setSelectedTasks] = useState([1, 2, 3, 4]);

  const tasks = [
    { id: 1, title: 'Morning Deep Work', micro: 'v1.2' },
    { id: 2, title: 'Exercise Routine', micro: 'v1.1' },
    { id: 3, title: 'Healthy Meal Prep', micro: 'v1.0' },
    { id: 4, title: 'Evening Reflection', micro: 'v1.3' },
  ];

  const handleTaskToggle = (id) => {
    setSelectedTasks(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
    else navigation.replace('Dashboard');
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View>
            <Text style={styles.stepTitle}>Choose Your Disciplined Day</Text>
            <Text style={styles.stepDesc}>Select the tasks that will build your daily routine.</Text>
            {tasks.map(task => (
              <Card key={task.id} style={styles.taskCard}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskMicro}>Micro: {task.micro}</Text>
                <Button
                  title={selectedTasks.includes(task.id) ? 'Selected' : 'Select'}
                  onPress={() => handleTaskToggle(task.id)}
                  variant={selectedTasks.includes(task.id) ? 'primary' : 'outline'}
                />
              </Card>
            ))}
          </View>
        );
      case 1:
        return (
          <View>
            <Text style={styles.stepTitle}>Stake Your Avatar</Text>
            <Text style={styles.stepDesc}>Your avatar's health depends on completing these tasks.</Text>
            <Avatar name="Hero" level={1} health={100} size={120} />
            <Text style={styles.warning}>Completing tasks keeps your avatar healthy. Missing them will hurt your progress!</Text>
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.stepTitle}>Ready to Begin</Text>
            <Text style={styles.stepDesc}>Your first task is unlocked. Complete it to unlock the next one.</Text>
            <Card style={styles.firstTask}>
              <Text style={styles.taskTitle}>{tasks.find(t => t.id === selectedTasks[0])?.title || 'Morning Deep Work'}</Text>
              <Text style={styles.taskMicro}>Start here!</Text>
            </Card>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderStep()}
      </ScrollView>
      <View style={styles.footer}>
        <Button title={step === 2 ? 'Start Journey' : 'Next'} onPress={nextStep} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.large,
    paddingBottom: 100,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
    textAlign: 'center',
  },
  stepDesc: {
    fontSize: theme.fontSize.title,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.large,
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
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.medium,
  },
  warning: {
    fontSize: theme.fontSize.subtitle,
    color: '#f59e0b',
    textAlign: 'center',
    marginTop: theme.spacing.large,
    fontStyle: 'italic',
  },
  firstTask: {
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.large,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});

export default Onboarding;