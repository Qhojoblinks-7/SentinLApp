import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, SafeAreaView, TouchableOpacity } from 'react-native';
import { Card } from '../components/ui/Card';
import { theme } from '../lib/theme';
import { useGetHistoryQuery } from '../services/tasksApi';
import { History as HistoryIcon, CheckCircle2, Zap, Database, Clock, ArrowUpRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const History = ({ navigation }) => {
  const { data: tasks = [], isLoading } = useGetHistoryQuery();

  if (isLoading) return (
    <View style={styles.centerContainer}>
      <Text style={styles.scanText}>ACCESSING ARCHIVAL DATA...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* 1. ARCHIVE HEADER */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.systemCode}>LOGS_SECURE_V1.0</Text>
          <Text style={styles.mainTitle}>Mission Archives</Text>
        </View>
        <View style={styles.statsBadge}>
          <HistoryIcon size={16} color={theme.colors.primary} />
          <Text style={styles.statsText}>{tasks.length} LOGS</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollPadding} 
        showsVerticalScrollIndicator={false}
      >
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyHexagon}>
              <Database size={32} color="#334155" />
            </View>
            <Text style={styles.emptyTitle}>NO DATA LOGGED</Text>
            <Text style={styles.emptySubtext}>System waiting for completed objective parameters.</Text>
          </View>
        ) : (
          tasks.map((task, index) => {
            const isFull = task.is_completed;
            const date = new Date(task.created_at);
            const day = date.getDate();
            const month = date.toLocaleDateString(undefined, { month: 'short' }).toUpperCase();

            return (
              <View key={task.id} style={styles.logEntry}>
                {/* 2. ADVANCED TIMELINE */}
                <View style={styles.timelineSidebar}>
                  <Text style={styles.monthLabel}>{month}</Text>
                  <Text style={styles.dayLabel}>{day}</Text>
                  <View style={styles.connectorContainer}>
                    <View style={[styles.dot, isFull ? styles.dotActive : styles.dotDim]} />
                    {index !== tasks.length - 1 && <View style={styles.verticalLine} />}
                  </View>
                </View>

                {/* 3. LOG CONTENT CARD */}
                <TouchableOpacity 
                  activeOpacity={0.8} 
                  style={styles.cardContainer}
                  onPress={() => {}}
                >
                  <Card style={[styles.logCard, !isFull && styles.logCardMicro]}>
                    <View style={styles.cardTop}>
                      <View style={styles.typeBadge}>
                        <Clock size={10} color="#64748b" />
                        <Text style={styles.typeText}>{task.micro_version}</Text>
                      </View>
                      <View style={styles.xpBadge}>
                        <ArrowUpRight size={12} color={theme.colors.primary} />
                        <Text style={styles.xpText}>{isFull ? '10 XP' : '2 XP'}</Text>
                      </View>
                    </View>

                    <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>

                    <View style={styles.cardBottom}>
                      <View style={styles.statusRow}>
                        {isFull ? (
                          <CheckCircle2 size={14} color={theme.colors.primary} />
                        ) : (
                          <Zap size={14} color="#eab308" />
                        )}
                        <Text style={[styles.statusLabel, { color: isFull ? theme.colors.primary : '#eab308' }]}>
                          {isFull ? 'OBJECTIVE SECURED' : 'MICRO-TASK SYNC'}
                        </Text>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#020617' },
  centerContainer: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' },
  scanText: { color: '#3b82f6', letterSpacing: 4, fontSize: 10, fontWeight: '900' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#0f172a',
  },
  systemCode: { color: '#3b82f6', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  mainTitle: { color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 4 },
  statsBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#0f172a', 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  statsText: { color: '#94a3b8', fontSize: 10, fontWeight: '800', marginLeft: 6 },

  container: { flex: 1 },
  scrollPadding: { padding: 24 },

  logEntry: { flexDirection: 'row', marginBottom: 0 },
  
  /* Timeline Styling */
  timelineSidebar: { width: 45, alignItems: 'center', marginRight: 15 },
  monthLabel: { color: '#475569', fontSize: 9, fontWeight: '900' },
  dayLabel: { color: '#f8fafc', fontSize: 16, fontWeight: '900', marginBottom: 8 },
  connectorContainer: { flex: 1, alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 3, borderColor: '#020617', zIndex: 2 },
  dotActive: { backgroundColor: '#3b82f6' },
  dotDim: { backgroundColor: '#eab308' },
  verticalLine: { width: 1.5, flex: 1, backgroundColor: '#0f172a', marginVertical: -2 },

  /* Card Styling */
  cardContainer: { flex: 1, marginBottom: 24 },
  logCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  logCardMicro: {
    backgroundColor: '#020617',
    borderStyle: 'dashed',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#020617', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  typeText: { color: '#64748b', fontSize: 9, fontWeight: '800', marginLeft: 4 },
  xpBadge: { flexDirection: 'row', alignItems: 'center' },
  xpText: { color: '#fff', fontSize: 11, fontWeight: '900', marginLeft: 2 },

  taskTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 16 },
  
  cardBottom: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b'
  },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusLabel: { fontSize: 9, fontWeight: '900', marginLeft: 6, letterSpacing: 1 },

  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyHexagon: { width: 70, height: 70, backgroundColor: '#0f172a', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20, transform: [{ rotate: '45deg' }] },
  emptyTitle: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  emptySubtext: { color: '#475569', fontSize: 12, textAlign: 'center', marginTop: 10, lineHeight: 18 }
});

export default History;