import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform, SafeAreaView, TouchableOpacity } from 'react-native';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { theme } from '../lib/theme';
import { useGetProfileQuery } from '../services/authApi';
import { Trophy, Lock, Zap, ShieldCheck, Flame, Star, Award, Target } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Ensure expo-linear-gradient is installed

const { width } = Dimensions.get('window');

const Achievements = ({ navigation }) => {
  const { data: profile, isLoading } = useGetProfileQuery();

  if (isLoading) return (
    <View style={styles.loadingContainer}>
      <Text style={styles.scanText}>INITIALIZING BIO-METRICS...</Text>
    </View>
  );

  const unlockedAchievements = profile?.achievements || [];
  const unlockedNames = unlockedAchievements.map(a => a.name);

  const allAchievements = [
    { name: '7-Day Streak Master', description: 'Maintain operational consistency for 1 week.', icon: Flame, color: '#f59e0b' },
    { name: 'Task Completion Hero', description: 'Reach 80% system efficiency in objectives.', icon: Zap, color: '#3b82f6' },
    { name: 'Health Guardian', description: 'Keep avatar integrity at 100% for 3 days.', icon: ShieldCheck, color: '#10b981' },
    { name: 'Alpha SentinL', description: 'Rank in the top 1% of the global network.', icon: Star, color: '#a855f7' },
    { name: 'Objective Specialist', description: 'Complete 50 hard-level missions.', icon: Target, color: '#ef4444' },
    { name: 'System Veteran', description: 'Over 100 hours of active coaching.', icon: Award, color: '#64748b' },
  ];

  const unlockedCount = unlockedAchievements.length;
  const totalCount = allAchievements.length;
  const progressPercent = (unlockedCount / totalCount) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Header & Global Progress */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.systemStatus}>OPERATOR MILESTONES</Text>
              <Text style={styles.mainTitle}>Achievements</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>LVL {Math.floor(unlockedCount / 2) + 1}</Text>
            </View>
          </View>

          <Card style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Network Synchronization</Text>
              <Text style={styles.progressValue}>{unlockedCount} / {totalCount}</Text>
            </View>
            <ProgressBar progress={progressPercent} color="#3b82f6" height={8} />
            <Text style={styles.progressFooter}>
              {totalCount - unlockedCount} protocols remain offline
            </Text>
          </Card>
        </View>

        {/* 2. Featured / Last Unlocked */}
        <Text style={styles.sectionLabel}>LATEST CLEARANCE</Text>
        <LinearGradient
          colors={['#1e293b', '#0f172a']}
          style={styles.featuredCard}
        >
          <View style={styles.featuredIconContainer}>
             <Trophy size={32} color="#f59e0b" />
          </View>
          <View style={styles.featuredText}>
            <Text style={styles.featuredName}>MASTER OPERATOR</Text>
            <Text style={styles.featuredDesc}>You have successfully synchronized with the SentinL network.</Text>
          </View>
        </LinearGradient>

        {/* 3. The Achievement Grid */}
        <Text style={styles.sectionLabel}>ALL PROTOCOLS</Text>
        <View style={styles.grid}>
          {allAchievements.map((ach, index) => {
            const isUnlocked = unlockedNames.includes(ach.name);
            const Icon = ach.icon;
            
            return (
              <TouchableOpacity 
                key={index} 
                activeOpacity={0.8}
                style={[styles.cardWrapper, !isUnlocked && styles.lockedWrapper]}
              >
                <View style={[styles.achievementCard, isUnlocked ? styles.unlockedBorder : styles.lockedBorder]}>
                  
                  {/* Icon Hex-ish Container */}
                  <View style={[
                    styles.iconBox, 
                    isUnlocked ? { backgroundColor: `${ach.color}15`, borderColor: ach.color } : styles.lockedIconBox
                  ]}>
                    {isUnlocked ? (
                      <Icon size={24} color={ach.color} />
                    ) : (
                      <Lock size={18} color="#475569" />
                    )}
                  </View>

                  <Text style={[styles.achName, isUnlocked ? styles.whiteText : styles.mutedText]}>
                    {ach.name.toUpperCase()}
                  </Text>
                  
                  <Text style={styles.achDesc} numberOfLines={2}>
                    {isUnlocked ? ach.description : 'Decryption Required'}
                  </Text>

                  {isUnlocked && <View style={[styles.unlockedDot, { backgroundColor: ach.color }]} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { paddingBottom: 40 },
  loadingContainer: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' },
  scanText: { color: '#3b82f6', letterSpacing: 4, fontSize: 12, fontWeight: '900' },

  header: { padding: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  systemStatus: { color: '#3b82f6', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  mainTitle: { fontSize: 32, fontWeight: '900', color: '#fff' },
  levelBadge: { backgroundColor: '#3b82f6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4 },
  levelText: { color: '#fff', fontSize: 12, fontWeight: '900' },

  progressCard: { backgroundColor: '#0f172a', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#1e293b' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  progressTitle: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  progressValue: { color: '#fff', fontSize: 14, fontWeight: '900' },
  progressFooter: { color: '#475569', fontSize: 11, marginTop: 12, fontWeight: '600' },

  sectionLabel: { color: '#64748b', fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginHorizontal: 24, marginBottom: 16 },

  featuredCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  featuredIconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(245, 158, 11, 0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)' },
  featuredText: { flex: 1, marginLeft: 16 },
  featuredName: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  featuredDesc: { color: '#94a3b8', fontSize: 12, marginTop: 4, lineHeight: 18 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16 },
  cardWrapper: { width: '50%', padding: 8 },
  achievementCard: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 20,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  unlockedBorder: { borderColor: '#1e293b' },
  lockedBorder: { borderColor: '#0f172a' },
  lockedWrapper: { opacity: 0.7 },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
  },
  lockedIconBox: { backgroundColor: '#020617', borderColor: '#1e293b' },

  achName: { fontSize: 11, fontWeight: '900', textAlign: 'center', marginBottom: 8, letterSpacing: 0.5 },
  achDesc: { fontSize: 10, color: '#64748b', textAlign: 'center', lineHeight: 15, paddingHorizontal: 5 },
  whiteText: { color: '#fff' },
  mutedText: { color: '#475569' },

  unlockedDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
  }
});

export default Achievements;