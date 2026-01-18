import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, Alert, KeyboardAvoidingView, Platform, SafeAreaView 
} from 'react-native';
import { Card, Button } from '../components/ui';
import { theme } from '../lib/theme';
import { useCreateTaskMutation } from '../services/tasksApi';
import { ChevronLeft, Plus, Trash2, Target, Zap, ShieldCheck } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

const CreateTask = ({ navigation }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    micro_version: 'v1.0',
    difficulty_weight: 3,
  });
  const [milestones, setMilestones] = useState([
    { title: '', completed: false },
  ]);

  const [createTask] = useCreateTaskMutation();

  const addMilestone = () => setMilestones([...milestones, { title: '', completed: false }]);
  
  const updateMilestone = (index, title) => {
    const updated = [...milestones];
    updated[index].title = title;
    setMilestones(updated);
  };

  const removeMilestone = (index) => {
    if (milestones.length > 1) setMilestones(milestones.filter((_, i) => i !== index));
  };

  const difficultyLevels = [
    { weight: 1, label: 'EASY', color: '#10b981' },
    { weight: 2, label: 'MEDIUM', color: '#3b82f6' },
    { weight: 3, label: 'HARD', color: '#f59e0b' },
    { weight: 4, label: 'ELITE', color: '#f97316' },
    { weight: 5, label: 'EXTREME', color: '#ef4444' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Dynamic Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#fff" size={22} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>NEW OBJECTIVE</Text>
          <Text style={styles.headerSubtitle}>Define mission parameters</Text>
        </View>
        <ShieldCheck color={theme.colors.primary} size={24} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Section: Core Mission */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CORE CONFIGURATION</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Objective Name</Text>
              <TextInput
                style={styles.mainInput}
                value={taskData.title}
                onChangeText={(title) => setTaskData({ ...taskData, title })}
                placeholder="e.g. Infiltration of Market Sector"
                placeholderTextColor="#475569"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.fieldLabel}>Version</Text>
                <TextInput
                  style={styles.smallInput}
                  value={taskData.micro_version}
                  onChangeText={(v) => setTaskData({ ...taskData, micro_version: v })}
                  placeholder="v1.0"
                  placeholderTextColor="#475569"
                />
              </View>
              <View style={{ flex: 2 }}>
                <Text style={styles.fieldLabel}>Priority Output</Text>
                <View style={styles.staticBadge}>
                  <Zap size={14} color="#eab308" />
                  <Text style={styles.badgeText}>HIGH PRIORITY</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Section: Difficulty Selector (Modern Segmented UI) */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CHALLENGE RATING</Text>
            <View style={styles.difficultyGrid}>
              {difficultyLevels.map((level) => (
                <TouchableOpacity
                  key={level.weight}
                  onPress={() => setTaskData({ ...taskData, difficulty_weight: level.weight })}
                  style={[
                    styles.diffCard,
                    taskData.difficulty_weight === level.weight && { 
                      borderColor: level.color, 
                      backgroundColor: `${level.color}15` 
                    }
                  ]}
                >
                  <Text style={[
                    styles.diffWeight, 
                    { color: taskData.difficulty_weight === level.weight ? level.color : '#475569' }
                  ]}>
                    {level.weight}
                  </Text>
                  <Text style={[
                    styles.diffLabel, 
                    { color: taskData.difficulty_weight === level.weight ? level.color : '#475569' }
                  ]}>
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Section: Milestones */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>TACTICAL STEPS</Text>
              <TouchableOpacity onPress={addMilestone} style={styles.inlineAddBtn}>
                <Plus size={14} color="#fff" />
                <Text style={styles.inlineAddText}>ADD STEP</Text>
              </TouchableOpacity>
            </View>

            {milestones.map((milestone, index) => (
              <View key={index} style={styles.milestoneRow}>
                <View style={styles.stepNumberContainer}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                  <View style={styles.stepLine} />
                </View>
                <View style={styles.milestoneInputWrapper}>
                  <TextInput
                    style={styles.milestoneInput}
                    value={milestone.title}
                    onChangeText={(title) => updateMilestone(index, title)}
                    placeholder="Describe tactical milestone..."
                    placeholderTextColor="#475569"
                  />
                  {milestones.length > 1 && (
                    <TouchableOpacity onPress={() => removeMilestone(index)}>
                      <Trash2 size={18} color="#ef4444" opacity={0.8} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>

          <Button
            title="INITIATE DEPLOYMENT"
            onPress={() => {}}
            style={styles.primaryButton}
            textStyle={styles.primaryButtonText}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  backBtn: { 
    width: 40, 
    height: 40, 
    backgroundColor: '#0f172a', 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  headerTextContainer: { flex: 1, marginLeft: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  headerSubtitle: { color: '#64748b', fontSize: 12, marginTop: 2 },

  scrollView: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 60 },

  section: { marginBottom: 32 },
  sectionLabel: { color: '#3b82f6', fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },

  inputGroup: { marginBottom: 20 },
  fieldLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '700', marginBottom: 8, marginLeft: 4 },
  mainInput: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 18,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: '#1e293b',
  },
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  smallInput: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 14,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1.5,
    borderColor: '#1e293b',
    textAlign: 'center'
  },
  staticBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155'
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '800', marginLeft: 8 },

  difficultyGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  diffCard: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    borderWidth: 2,
    borderColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diffWeight: { fontSize: 18, fontWeight: '900' },
  diffLabel: { fontSize: 8, fontWeight: '800', marginTop: 4 },

  inlineAddBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: theme.colors.primary, 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 8 
  },
  inlineAddText: { color: '#fff', fontSize: 10, fontWeight: '900', marginLeft: 4 },

  milestoneRow: { flexDirection: 'row', marginBottom: 0 },
  stepNumberContainer: { alignItems: 'center', marginRight: 16 },
  stepNumber: { 
    color: '#3b82f6', 
    fontSize: 12, 
    fontWeight: '900', 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#3b82f6', 
    textAlign: 'center', 
    lineHeight: 22 
  },
  stepLine: { width: 1, flex: 1, backgroundColor: '#1e293b', marginVertical: 4 },
  milestoneInputWrapper: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#0f172a', 
    paddingRight: 16, 
    borderRadius: 16, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  milestoneInput: { flex: 1, color: '#fff', padding: 16, fontSize: 14 },

  primaryButton: { 
    backgroundColor: theme.colors.primary, 
    borderRadius: 16, 
    height: 64, 
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8
  },
  primaryButtonText: { fontWeight: '900', letterSpacing: 2, fontSize: 16 }
});

export default CreateTask;