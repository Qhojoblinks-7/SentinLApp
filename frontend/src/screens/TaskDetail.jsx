import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Platform, Dimensions, SafeAreaView 
} from 'react-native';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Avatar } from '../components/ui/Avatar';
import { theme } from '../lib/theme';
import { useUpdateTaskMutation } from '../services/tasksApi';
import { 
  CheckCircle2, Zap, Shield, Flame, Info, 
  ChevronLeft, Target, AlertTriangle, Box
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const TaskDetail = ({ route, navigation }) => {
  const task = route.params?.task;
  if (!task) return (
    <View style={styles.center}>
      <Text style={styles.textWhite}>NO DATA DETECTED</Text>
    </View>
  );

  const [isCompleted, setIsCompleted] = useState(task.is_completed);
  const [updateTask, { isLoading }] = useUpdateTaskMutation();

  const handleUpdate = async (type) => {
    const isMicro = type === 'micro';
    try {
      await updateTask({ 
        id: task.id, 
        is_completed: !isMicro, 
        is_micro_completed: isMicro 
      }).unwrap();
      
      if (!isMicro) setIsCompleted(true);
      
      Toast.show({
        type: 'success',
        text1: isMicro ? 'MICRO VERSION LOGGED' : 'OBJECTIVE SECURED',
        text2: isMicro ? 'Streak protection active.' : 'Full XP/HP data synced.',
      });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'LINK_FAILURE', text2: 'Update sync failed.' });
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* 1. TACTICAL HEADER */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#fff" size={20} />
        </TouchableOpacity>
        <View style={styles.navHeaderInfo}>
          <Text style={styles.navTitle}>MISSION_BRIEFING</Text>
          <Text style={styles.navID}>OP_REF: {task.id?.toString().padStart(4, '0')}</Text>
        </View>
        <Box size={20} color="#334155" />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 2. OBJECTIVE CARD */}
        <Card style={styles.headerCard}>
          <View style={styles.priorityRow}>
            <View style={styles.priorityBadge}>
              <Target size={12} color={theme.colors.primary} />
              <Text style={styles.priorityText}>PRIORITY OBJECTIVE</Text>
            </View>
            <Text style={styles.statusTag}>{isCompleted ? 'SECURED' : 'ACTIVE'}</Text>
          </View>
          
          <Text style={styles.taskTitle}>{task.title}</Text>
          
          {/* TACTICAL MINIMUM SECTION */}
          <LinearGradient
            colors={['#1e1b4b', '#0f172a']}
            style={styles.microBox}
          >
            <View style={styles.microHeader}>
              <Zap size={14} color="#eab308" />
              <Text style={styles.microLabel}>MICRO_VERSION (MINIMUM VIABLE)</Text>
            </View>
            <Text style={styles.microValue}>{task.micro_version}</Text>
            <Text style={styles.microDesc}>Complete this to protect your streak if full mission is unavailable.</Text>
          </LinearGradient>

          <View style={styles.progressContainer}>
             <View style={styles.progressHeader}>
                <Text style={styles.progLabel}>COMPLETION_STATUS</Text>
                <Text style={styles.progVal}>{isCompleted ? '100%' : '0%'}</Text>
             </View>
             <ProgressBar 
                progress={isCompleted ? 100 : 8} 
                color={isCompleted ? '#10b981' : theme.colors.primary} 
                height={8}
             />
          </View>
        </Card>

        {/* 3. REWARD MATRIX */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YIELD_PROJECTION</Text>
          <View style={styles.rewardGrid}>
            <RewardItem icon={Zap} val="+10 XP" color={theme.colors.primary} />
            <RewardItem icon={Flame} val="STREAK+1" color="#f97316" />
            <RewardItem icon={Shield} val="+5% HP" color="#10b981" />
          </View>
        </View>

        {/* 4. ANALYSIS & CONSEQUENCES */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Info size={14} color="#3b82f6" />
            <Text style={styles.sectionTitle}>MISSION_ANALYSIS</Text>
          </View>
          <View style={styles.analysisBox}>
            <Text style={styles.descriptionText}>
              This objective optimizes neural pathways for consistency. 
              Successful execution triggers dopamine rewards and maintains avatar integrity.
            </Text>
            <View style={styles.warningBox}>
              <AlertTriangle size={14} color="#ef4444" />
              <Text style={styles.warningText}>FAILURE PENALTY: -10% INTEGRITY</Text>
            </View>
          </View>
        </View>

        {/* 5. SYNC STATUS */}
        <View style={styles.syncCard}>
          <Avatar score={85} size={60} />
          <View style={styles.syncInfo}>
            <Text style={styles.syncTitle}>OPERATOR_STATUS: READY</Text>
            <Text style={styles.syncSub}>Biometric sync stable. Awaiting action...</Text>
          </View>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* 6. FIXED COMMAND ACTIONS */}
      <View style={styles.footer}>
        {!isCompleted ? (
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.microBtn} 
              onPress={() => handleUpdate('micro')}
              disabled={isLoading}
            >
              <Text style={styles.microBtnText}>LOG MICRO</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.completeBtn} 
              onPress={() => handleUpdate('full')}
              disabled={isLoading}
            >
              <LinearGradient
                colors={[theme.colors.primary, '#1d4ed8']}
                style={styles.completeGradient}
              >
                <CheckCircle2 size={18} color="#fff" />
                <Text style={styles.completeBtnText}>COMPLETE MISSION</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.successBanner}>
            <CheckCircle2 size={20} color="#10b981" />
            <Text style={styles.successText}>MISSION_LOGGED_SUCCESSFULLY</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// Reusable Reward Chip
const RewardItem = ({ icon: Icon, val, color }) => (
  <View style={[styles.rewardChip, { borderColor: `${color}40` }]}>
    <Icon size={14} color={color} />
    <Text style={[styles.rewardText, { color }]}>{val}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#020617' },
  container: { flex: 1, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617' },
  textWhite: { color: '#64748b', fontWeight: '900', letterSpacing: 2 },

  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 20, paddingHorizontal: 20, paddingBottom: 20
  },
  navHeaderInfo: { alignItems: 'center' },
  navTitle: { color: '#475569', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  navID: { color: '#1e293b', fontSize: 9, fontWeight: '800', marginTop: 2 },
  backBtn: { width: 40, height: 40, backgroundColor: '#0f172a', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1e293b' },

  headerCard: { padding: 24, backgroundColor: '#0f172a', borderRadius: 32, borderWidth: 1, borderColor: '#1e293b' },
  priorityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  priorityBadge: { flexDirection: 'row', alignItems: 'center' },
  priorityText: { color: theme.colors.primary, fontSize: 9, fontWeight: '900', marginLeft: 6, letterSpacing: 1 },
  statusTag: { color: '#334155', fontSize: 9, fontWeight: '900' },
  taskTitle: { color: '#fff', fontSize: 28, fontWeight: '900', marginBottom: 24, letterSpacing: -0.5 },

  microBox: { padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#312e81', marginBottom: 24 },
  microHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  microLabel: { color: '#eab308', fontSize: 9, fontWeight: '900', marginLeft: 8, letterSpacing: 1 },
  microValue: { color: '#fff', fontSize: 18, fontWeight: '800' },
  microDesc: { color: '#475569', fontSize: 11, marginTop: 8, lineHeight: 16 },

  progressContainer: { marginTop: 10 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progLabel: { color: '#475569', fontSize: 9, fontWeight: '900' },
  progVal: { color: '#fff', fontSize: 10, fontWeight: '900' },

  section: { marginTop: 32 },
  sectionTitle: { color: '#475569', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 16 },
  rewardGrid: { flexDirection: 'row', gap: 10 },
  rewardChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1 },
  rewardText: { fontSize: 11, fontWeight: '900', marginLeft: 8 },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  analysisBox: { backgroundColor: '#0f172a', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#1e293b' },
  descriptionText: { color: '#94a3b8', fontSize: 14, lineHeight: 22, fontWeight: '500' },
  warningBox: { flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#1e293b', gap: 8 },
  warningText: { color: '#ef4444', fontSize: 10, fontWeight: '900', letterSpacing: 1 },

  syncCard: { flexDirection: 'row', alignItems: 'center', padding: 20, marginTop: 24, backgroundColor: '#0f172a', borderRadius: 24, borderStyle: 'dashed', borderWidth: 1, borderColor: '#334155' },
  syncInfo: { marginLeft: 16, flex: 1 },
  syncTitle: { color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  syncSub: { color: '#475569', fontSize: 11, marginTop: 4 },

  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, backgroundColor: '#020617' },
  actionRow: { flexDirection: 'row', gap: 12 },
  microBtn: { flex: 1, backgroundColor: '#0f172a', borderRadius: 20, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#312e81' },
  microBtnText: { color: '#eab308', fontWeight: '900', fontSize: 12, letterSpacing: 1 },
  completeBtn: { flex: 2.2, borderRadius: 20, overflow: 'hidden' },
  completeGradient: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20 },
  completeBtnText: { color: '#fff', fontWeight: '900', fontSize: 12, marginLeft: 10, letterSpacing: 1 },
  
  successBanner: { flexDirection: 'row', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 20, padding: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#10b981' },
  successText: { color: '#10b981', fontWeight: '900', fontSize: 12, marginLeft: 12, letterSpacing: 2 }
});

export default TaskDetail;