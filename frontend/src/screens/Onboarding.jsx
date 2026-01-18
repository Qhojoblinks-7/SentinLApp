import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { theme } from '../lib/theme';
import { useCreateTaskMutation } from '../services/tasksApi';
import { CheckCircle2, Zap, ShieldAlert, Rocket, ChevronRight, Fingerprint } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const Onboarding = ({ navigation }) => {
  const [step, setStep] = useState(0);
  const [selectedTasks, setSelectedTasks] = useState([1, 2, 3, 4]);
  const [createTask] = useCreateTaskMutation();

  const tasks = [
    { id: 1, title: 'Morning Deep Work', micro: '15m Focus Session', icon: '🧠' },
    { id: 2, title: 'Exercise Routine', micro: '10 Pushups', icon: '⚡' },
    { id: 3, title: 'Healthy Meal Prep', micro: 'One Whole Food', icon: '🥗' },
    { id: 4, title: 'Evening Reflection', micro: '1 Sentence Entry', icon: '🌙' },
  ];

  const handleTaskToggle = (id) => {
    setSelectedTasks(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const nextStep = async () => {
    if (step < 2) setStep(step + 1);
    else {
      const tasksToCreate = selectedTasks.map(id => {
        const task = tasks.find(t => t.id === id);
        return { title: task.title, micro_version: task.micro, difficulty_weight: 1 };
      });
      try {
        await Promise.all(tasksToCreate.map(t => createTask(t).unwrap()));
        navigation.replace('Main');
      } catch (e) { console.error(e); }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>INITIALIZE PROTOCOLS</Text>
            <Text style={styles.stepDesc}>Select the baseline habits for your daily discipline cycle.</Text>
            {tasks.map(task => {
              const isSelected = selectedTasks.includes(task.id);
              return (
                <TouchableOpacity 
                  key={task.id} 
                  activeOpacity={0.8}
                  onPress={() => handleTaskToggle(task.id)}
                >
                  <Card style={[styles.taskCard, isSelected && styles.taskCardSelected]}>
                    <View style={styles.taskCardLeft}>
                      <Text style={styles.taskEmoji}>{task.icon}</Text>
                      <View>
                        <Text style={[styles.taskTitle, isSelected && styles.textPrimary]}>{task.title}</Text>
                        <Text style={styles.taskMicro}>MICRO: {task.micro}</Text>
                      </View>
                    </View>
                    <CheckCircle2 size={24} color={isSelected ? theme.colors.primary : '#1e293b'} />
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      case 1:
        return (
          <View style={[styles.stepContainer, { alignItems: 'center' }]}>
            <Text style={styles.stepTitle}>BIOMETRIC LINK</Text>
            <Text style={styles.stepDesc}>Your SentinL Avatar is now tethered to your discipline score.</Text>
            
            <View style={styles.avatarPillar}>
              <View style={styles.scanLine} />
              <Avatar name="SNTL-01" level={1} health={100} size={160} />
            </View>

            <View style={styles.warningBox}>
              <ShieldAlert size={20} color="#fbbf24" />
              <Text style={styles.warningText}>
                CRITICAL: Neglecting tasks results in Avatar health depletion and system degradation.
              </Text>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={[styles.stepContainer, { alignItems: 'center' }]}>
            <View style={styles.finalIconBg}>
              <Rocket size={40} color={theme.colors.primary} />
            </View>
            <Text style={styles.stepTitle}>SYSTEM READY</Text>
            <Text style={styles.stepDesc}>All protocols established. Your first objective is prepared.</Text>
            
            <Card style={styles.highlightCard}>
              <Text style={styles.highlightLabel}>FIRST OBJECTIVE</Text>
              <Text style={styles.highlightTitle}>
                {tasks.find(t => t.id === selectedTasks[0])?.title || 'Morning Deep Work'}
              </Text>
              <View style={styles.badge}>
                <Zap size={12} color="#fff" />
                <Text style={styles.badgeText}>READY FOR DEPLOYMENT</Text>
              </View>
            </Card>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* HUD Progress Header */}
      <View style={styles.hudHeader}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.hudBar, step >= i && styles.hudBarActive]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderStep()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.mainButton} onPress={nextStep}>
          <Text style={styles.mainButtonText}>
            {step === 2 ? 'COMMENCE JOURNEY' : 'CONTINUE'}
          </Text>
          <ChevronRight size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  hudHeader: { 
    flexDirection: 'row', gap: 8, paddingHorizontal: 24, 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, marginBottom: 20 
  },
  hudBar: { flex: 1, height: 4, backgroundColor: '#1e293b', borderRadius: 2 },
  hudBarActive: { backgroundColor: theme.colors.primary },
  
  scrollContent: { padding: 24, paddingBottom: 120 },
  stepContainer: { flex: 1 },
  stepTitle: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: 2, textAlign: 'center', marginBottom: 12 },
  stepDesc: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  
  taskCard: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, marginBottom: 12, backgroundColor: '#0f172a', 
    borderWidth: 1, borderColor: '#1e293b', borderRadius: 20 
  },
  taskCardSelected: { borderColor: theme.colors.primary, backgroundColor: '#1e293b' },
  taskCardLeft: { flexDirection: 'row', alignItems: 'center' },
  taskEmoji: { fontSize: 24, marginRight: 16 },
  taskTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '700' },
  textPrimary: { color: theme.colors.primary },
  taskMicro: { color: '#64748b', fontSize: 10, fontWeight: '800', marginTop: 4, letterSpacing: 1 },

  avatarPillar: { 
    padding: 30, borderRadius: 100, backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)', marginBottom: 40,
    position: 'relative', overflow: 'hidden'
  },
  scanLine: { 
    position: 'absolute', top: 0, width: '200%', height: 2, 
    backgroundColor: theme.colors.primary, opacity: 0.3, 
    // Animation would go here in a real app
  },
  warningBox: { 
    flexDirection: 'row', padding: 20, backgroundColor: 'rgba(251, 191, 36, 0.1)', 
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' 
  },
  warningText: { color: '#fbbf24', fontSize: 12, fontWeight: '600', flex: 1, marginLeft: 12, lineHeight: 18 },

  finalIconBg: { 
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#1e293b', 
    alignItems: 'center', justifyContent: 'center', marginBottom: 24 
  },
  highlightCard: { 
    width: '100%', alignItems: 'center', padding: 30, 
    backgroundColor: '#0f172a', borderRadius: 32, borderWidth: 1, borderColor: theme.colors.primary 
  },
  highlightLabel: { color: theme.colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 8 },
  highlightTitle: { color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 20 },
  badge: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#10b981', 
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '900', marginLeft: 6 },

  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: 'transparent'
  },
  mainButton: { 
    flexDirection: 'row', backgroundColor: theme.colors.primary, height: 64, 
    borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12
  },
  mainButtonText: { color: '#fff', fontWeight: '900', fontSize: 16, letterSpacing: 1.5, marginRight: 8 }
});

export default Onboarding;