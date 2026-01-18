import React, { useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Platform, SafeAreaView, Dimensions 
} from 'react-native';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { theme } from '../lib/theme';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useGetProfileQuery } from '../services/authApi';
import { 
  LogOut, Shield, Zap, Target, Award, 
  Mail, ChevronRight, Fingerprint, Activity 
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const Profile = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { data: profile, isLoading, error } = useGetProfileQuery();

  useEffect(() => {
    if (error && error.status === 403) handleLogout();
  }, [error]);

  const handleLogout = () => {
    dispatch(logout());
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  if (!user || isLoading) return (
    <View style={styles.centerContainer}>
      <Activity color={theme.colors.primary} size={32} />
      <Text style={styles.loadingText}>DECRYPTING DOSSIER...</Text>
    </View>
  );

  const userLevel = Math.floor(profile.discipline_score / 20) + 1;

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* 1. OPERATOR IDENTITY CARD */}
        <LinearGradient
          colors={['#1e293b', '#020617']}
          style={styles.headerGradient}
        >
          <SafeAreaView style={styles.headerContent}>
            <View style={styles.idBadge}>
              <Text style={styles.idText}>ID: {user.username.substring(0, 8).toUpperCase()}_00{user.id || 1}</Text>
              <Fingerprint size={14} color="rgba(255,255,255,0.3)" />
            </View>

            <View style={styles.avatarContainer}>
              <View style={styles.avatarRing}>
                <Avatar score={profile.discipline_score} size={100} />
              </View>
              <LinearGradient 
                colors={[theme.colors.primary, '#1d4ed8']} 
                style={styles.levelBubble}
              >
                <Text style={styles.levelLabel}>LVL</Text>
                <Text style={styles.levelValue}>{userLevel}</Text>
              </LinearGradient>
            </View>

            <Text style={styles.userName}>{user.username.toUpperCase()}</Text>
            <View style={styles.emailContainer}>
              <Mail size={12} color="#64748b" />
              <Text style={styles.userEmail}>{user.email.toLowerCase()}</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.body}>
          {/* 2. SYSTEM INTEGRITY GAUGE */}
          <Text style={styles.sectionTitle}>SYSTEM INTEGRITY</Text>
          <Card style={styles.vitalsCard}>
            <View style={styles.gaugeContainer}>
              <View style={styles.gaugeHeader}>
                <View style={styles.gaugeLabelRow}>
                  <Shield size={14} color="#ef4444" />
                  <Text style={styles.gaugeTitle}>AVATAR HEALTH</Text>
                </View>
                <Text style={styles.gaugePercent}>{profile.avatar_health}%</Text>
              </View>
              <ProgressBar progress={profile.avatar_health} color="#ef4444" height={6} />
            </View>

            <View style={[styles.gaugeContainer, { marginTop: 24 }]}>
              <View style={styles.gaugeHeader}>
                <View style={styles.gaugeLabelRow}>
                  <Zap size={14} color={theme.colors.primary} />
                  <Text style={styles.gaugeTitle}>DISCIPLINE RATING</Text>
                </View>
                <Text style={styles.gaugePercent}>{profile.discipline_score}%</Text>
              </View>
              <ProgressBar progress={profile.discipline_score} color={theme.colors.primary} height={6} />
            </View>
          </Card>

          {/* 3. TACTICAL PERFORMANCE GRID */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Target size={18} color="#94a3b8" />
              <Text style={styles.statVal}>{profile.current_streak}</Text>
              <Text style={styles.statSub}>ACTIVE STREAK</Text>
            </View>
            <View style={styles.statBox}>
              <Award size={18} color="#94a3b8" />
              <Text style={styles.statVal}>
                {profile.tasks?.filter(t => t.is_completed).length || 0}
              </Text>
              <Text style={styles.statSub}>OBJECTIVES SECURED</Text>
            </View>
          </View>

          {/* 4. RECENT DECORATIONS */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>EARNED DECORATIONS</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Achievements')}>
              <Text style={styles.linkText}>ARCHIVES</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeList}>
            {profile.achievements?.length > 0 ? (
              profile.achievements.map((ach) => (
                <View key={ach.id} style={styles.badgePill}>
                  <View style={styles.badgeIconBg}>
                    <Award size={12} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.badgeName}>{ach.name.toUpperCase()}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyNote}>NO RECOGNIZED DECORATIONS FOUND.</Text>
            )}
          </ScrollView>

          {/* 5. SESSION MANAGEMENT */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <View style={styles.logoutLeft}>
              <View style={styles.logoutIconCircle}>
                <LogOut size={16} color="#ef4444" />
              </View>
              <Text style={styles.logoutLabel}>TERMINATE SESSION</Text>
            </View>
            <ChevronRight size={16} color="#334155" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#020617' },
  container: { flex: 1 },
  centerContainer: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: theme.colors.primary, letterSpacing: 4, fontWeight: '900', fontSize: 10, marginTop: 12 },

  headerGradient: {
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  headerContent: { alignItems: 'center', paddingTop: Platform.OS === 'android' ? 40 : 20 },
  idBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    paddingVertical: 4, 
    paddingHorizontal: 12, 
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  idText: { color: '#64748b', fontSize: 9, fontWeight: '800', letterSpacing: 1, marginRight: 8 },

  avatarContainer: { position: 'relative', marginBottom: 20 },
  avatarRing: { 
    padding: 6, 
    borderRadius: 60, 
    borderWidth: 1, 
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderStyle: 'dashed' 
  },
  levelBubble: { 
    position: 'absolute', 
    bottom: -5, 
    right: -5, 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 3, 
    borderColor: '#020617' 
  },
  levelLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 7, fontWeight: '900' },
  levelValue: { color: '#fff', fontSize: 14, fontWeight: '900' },

  userName: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 2 },
  emailContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  userEmail: { color: '#475569', fontSize: 12, marginLeft: 6, fontWeight: '600' },

  body: { padding: 24 },
  sectionTitle: { color: '#3b82f6', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 16 },
  
  vitalsCard: { backgroundColor: '#0f172a', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#1e293b' },
  gaugeContainer: { width: '100%' },
  gaugeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 },
  gaugeLabelRow: { flexDirection: 'row', alignItems: 'center' },
  gaugeTitle: { color: '#94a3b8', fontSize: 10, fontWeight: '800', marginLeft: 8 },
  gaugePercent: { color: '#fff', fontSize: 14, fontWeight: '900' },

  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, marginBottom: 32 },
  statBox: { 
    width: (width - 64) / 2, 
    backgroundColor: '#0f172a', 
    padding: 20, 
    borderRadius: 24, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  statVal: { color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 10 },
  statSub: { color: '#475569', fontSize: 8, fontWeight: '800', marginTop: 4, letterSpacing: 0.5 },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  linkText: { color: '#3b82f6', fontSize: 10, fontWeight: '800' },

  badgeList: { flexDirection: 'row' },
  badgePill: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1e293b', 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 12, 
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#334155'
  },
  badgeIconBg: { width: 20, height: 20, borderRadius: 6, backgroundColor: 'rgba(59, 130, 246, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  badgeName: { color: '#cbd5e1', fontSize: 10, fontWeight: '800' },
  emptyNote: { color: '#334155', fontSize: 11, fontStyle: 'italic', fontWeight: '600' },

  logoutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginTop: 40, 
    backgroundColor: '#0f172a', 
    padding: 16, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  logoutLeft: { flexDirection: 'row', alignItems: 'center' },
  logoutIconCircle: { 
    width: 32, 
    height: 32, 
    borderRadius: 10, 
    backgroundColor: 'rgba(239, 68, 68, 0.1)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  logoutLabel: { color: '#ef4444', fontSize: 11, fontWeight: '900', marginLeft: 12, letterSpacing: 1 }
});

export default Profile;