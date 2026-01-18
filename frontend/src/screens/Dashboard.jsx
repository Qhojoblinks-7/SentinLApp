import React, { useState } from 'react';
import { 
  View, Text, ScrollView, StyleSheet, TouchableOpacity, 
  Platform, SafeAreaView, Dimensions 
} from 'react-native';
import { TaskCard } from '../components/ui';
import { theme } from '../lib/theme';
import { useGetTasksQuery } from '../services/tasksApi';
import { 
  Shield, Zap, AlertTriangle, LayoutDashboard, 
  Settings, Plus, Activity, ChevronRight 
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const Dashboard = ({ navigation }) => {
  const [lazyMode, setLazyMode] = useState(false);
  const { data: tasks = [], isLoading } = useGetTasksQuery();

  if (isLoading) return (
    <View style={styles.centerContainer}>
      <Activity color="#3b82f6" size={32} />
      <Text style={styles.loadingText}>SYNCING NEURAL LINK...</Text>
    </View>
  );

  const completedCount = tasks.filter(t => t.is_completed).length;

  return (
    <View style={styles.wrapper}>
      {/* 1. High-Fidelity Tactical Header */}
      <LinearGradient
        colors={lazyMode ? ['#1e1b4b', '#020617'] : ['#0f172a', '#020617']}
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>OPERATOR STATUS: ACTIVE</Text>
              <Text style={styles.mainTitle}>Command Center</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileCircle} 
              onPress={() => navigation.navigate('Settings')}
            >
              <Settings size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* 2. Key Metrics Row */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <View style={styles.metricIconCircle}>
                <Shield size={16} color="#3b82f6" />
              </View>
              <View>
                <Text style={styles.metricValue}>88%</Text>
                <Text style={styles.metricLabel}>INTEGRITY</Text>
              </View>
            </View>

            <View style={[styles.metricCard, { backgroundColor: 'rgba(234, 179, 8, 0.05)' }]}>
              <View style={[styles.metricIconCircle, { backgroundColor: 'rgba(234, 179, 8, 0.1)' }]}>
                <Zap size={16} color="#eab308" />
              </View>
              <View>
                <Text style={styles.metricValue}>{completedCount}/{tasks.length}</Text>
                <Text style={styles.metricLabel}>OBJECTIVES</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 3. Modern Override Toggle */}
        <TouchableOpacity 
          style={[styles.overridePill, lazyMode ? styles.pillActive : styles.pillInactive]}
          onPress={() => setLazyMode(!lazyMode)}
          activeOpacity={0.9}
        >
          <View style={styles.pillContent}>
            <View style={[styles.statusIndicator, { backgroundColor: lazyMode ? '#000' : '#ef4444' }]} />
            <Text style={[styles.pillText, lazyMode && { color: '#000' }]}>
              {lazyMode ? "LAZY MODE OVERRIDE ENABLED" : "STANDARD OPERATING MODE"}
            </Text>
          </View>
          <AlertTriangle size={16} color={lazyMode ? "#000" : "#ef4444"} />
        </TouchableOpacity>

        {/* 4. Task Section with Visual Hierarchy */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <LayoutDashboard size={14} color="#3b82f6" />
            <Text style={styles.sectionTitle}>PRIORITY OBJECTIVES</Text>
          </View>
          <Text style={styles.taskCount}>{tasks.length} total</Text>
        </View>

        <View style={styles.taskList}>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <View key={task.id} style={styles.taskWrapper}>
                <TaskCard
                  title={task.title}
                  micro={task.micro_version}
                  isCompleted={task.is_completed}
                  onToggle={() => navigation.navigate('TaskDetail', { task })}
                  lazyMode={lazyMode}
                />
                {/* Visual Step Indicator for Professional Look */}
                {index !== tasks.length - 1 && <View style={styles.taskConnector} />}
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Shield size={40} color="#1e293b" />
              <Text style={styles.emptyText}>ALL SYSTEMS NOMINAL</Text>
              <Text style={styles.emptySub}>No pending mission parameters.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modern High-End FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('CreateTask')}
      >
        <LinearGradient
          colors={['#3b82f6', '#2563eb']}
          style={styles.fabGradient}
        >
          <Plus size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#020617' },
  container: { flex: 1 },
  centerContainer: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#3b82f6', letterSpacing: 4, fontWeight: '900', fontSize: 10, marginTop: 16 },
  
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: Platform.OS === 'android' ? 20 : 0,
    marginBottom: 28 
  },
  greeting: { color: '#3b82f6', fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  mainTitle: { color: '#fff', fontSize: 32, fontWeight: '900', marginTop: 4 },
  profileCircle: { 
    width: 44, 
    height: 44, 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 22, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },

  metricsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metricCard: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)'
  },
  metricIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  metricValue: { color: '#fff', fontSize: 18, fontWeight: '900' },
  metricLabel: { color: '#64748b', fontSize: 9, fontWeight: '800', letterSpacing: 1 },

  scrollContent: { padding: 24 },
  
  overridePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 100,
    marginBottom: 32,
    borderWidth: 1,
  },
  pillInactive: { backgroundColor: '#0f172a', borderColor: '#1e293b' },
  pillActive: { backgroundColor: '#f59e0b', borderColor: '#f59e0b' },
  pillContent: { flexDirection: 'row', alignItems: 'center' },
  statusIndicator: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  pillText: { color: '#ef4444', fontSize: 10, fontWeight: '900', letterSpacing: 1 },

  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20,
    paddingHorizontal: 4
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { color: '#fff', fontSize: 12, fontWeight: '900', marginLeft: 8, letterSpacing: 1.5 },
  taskCount: { color: '#475569', fontSize: 12, fontWeight: '700' },

  taskList: { marginBottom: 100 },
  taskWrapper: { alignItems: 'center' },
  taskConnector: { width: 2, height: 12, backgroundColor: '#1e293b', marginVertical: -4 },

  emptyCard: { 
    padding: 60, 
    alignItems: 'center', 
    backgroundColor: '#0f172a', 
    borderRadius: 32, 
    borderStyle: 'dashed', 
    borderWidth: 2, 
    borderColor: '#1e293b' 
  },
  emptyText: { color: '#fff', fontSize: 14, fontWeight: '900', marginTop: 16, letterSpacing: 1 },
  emptySub: { color: '#475569', fontSize: 12, marginTop: 4 },

  fab: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    borderRadius: 30,
    elevation: 10,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default Dashboard;