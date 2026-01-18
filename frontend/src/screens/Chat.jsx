import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Audio } from 'expo-av';
import { 
  ChevronLeft, 
  MoreVertical, 
  Plus, 
  Send, 
  Mic, 
  Trash2, 
  Square,
  CheckCheck,
  Copy,
  Reply,
  Flag
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useVoiceChatMutation, useTextChatMutation } from '../services/authApi';

const Chat = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'text',
      text: "Greetings, Operator. I am SentinL AI Coach. How can I assist you today?",
      sender: 'ai',
      timestamp: '09:41 AM',
      status: 'read'
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recording, setRecording] = useState(null);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  
  // Menu Positioning States
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, isUser: false });

  const [voiceChat] = useVoiceChatMutation();
  const [textChat] = useTextChatMutation();
  const scrollViewRef = useRef();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bubbleRefs = useRef({});

  // --- ACTIONS LOGIC ---
  const handleLongPress = (event, message) => {
    const { py, px, pWidth, pHeight } = event;
    
    const isUser = message.sender === 'user';
    
    // Position 3px away from bubble
    // If User:px (start of bubble) minus menu width (around 45px) minus 3px
    // If AI: px + bubble width + 3px
    const left = isUser ? px - 48 : px + pWidth + 3;
    const top = py; 

    setSelectedMessage(message);
    setMenuPos({ top, left, isUser });
    setMenuVisible(true);
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(selectedMessage.text);
    setMenuVisible(false);
    Toast.show({ type: 'success', text1: 'Copied' });
  };

  const deleteMessage = () => {
    setMessages(prev => prev.filter(m => m.id !== selectedMessage.id));
    setMenuVisible(false);
  };

  const replyMessage = () => {
    setInputText(`@reply: ${selectedMessage.text.substring(0, 20)}... `);
    setMenuVisible(false);
  };

  const reportMessage = () => {
    setMenuVisible(false);
    Toast.show({ type: 'info', text1: 'Reported' });
  };

  // --- RECORDING & CHAT LOGIC ---
  useEffect(() => {
    let interval;
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
      interval = setInterval(() => setRecordingDuration(prev => prev + 1), 1000);
    } else {
      pulseAnim.setValue(1);
      clearInterval(interval);
      setRecordingDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') return;
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
    } catch (err) { console.error(err); }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    try {
      setIsAIProcessing(true);
      const formData = new FormData();
      formData.append('audio', {
        uri: uri,
        type: 'audio/m4a',
        name: 'recording.m4a'
      });
      const response = await voiceChat(formData).unwrap();
      addAIMessage(response.response);
    } catch (error) { addAIMessage("Error processing voice."); }
    finally { setIsAIProcessing(false); }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText('');
    const userMsg = {
      id: Date.now(),
      type: 'text',
      text: text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    setMessages(prev => [...prev, userMsg]);
    setIsAIProcessing(true);
    try {
      const response = await textChat(text).unwrap();
      addAIMessage(response.response);
    } catch (error) { addAIMessage("Connection error."); }
    finally { 
      setIsAIProcessing(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const addAIMessage = (text) => {
    const aiMsg = {
      id: Date.now() + 1,
      type: 'text',
      text: text,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, aiMsg]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <ChevronLeft size={28} color="#3b82f6" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>SentinL Coach</Text>
            <Text style={styles.headerStatus}>{isAIProcessing ? 'typing...' : 'Online'}</Text>
          </View>
          <TouchableOpacity style={styles.headerButton}><MoreVertical size={20} color="#64748b" /></TouchableOpacity>
        </View>

        {/* CHAT AREA */}
        <ScrollView 
          ref={scrollViewRef} 
          style={styles.chatArea} 
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View key={message.id} style={[styles.messageContainer, message.sender === 'user' ? styles.userContainer : styles.aiContainer]}>
              <TouchableOpacity
                ref={(el) => { bubbleRefs.current[message.id] = el; }}
                activeOpacity={0.9}
                onLongPress={() => {
                  bubbleRefs.current[message.id].measure((x, y, width, height, px, py) => {
                    handleLongPress({ py, px, pWidth: width, pHeight: height }, message);
                  });
                }}
                style={[styles.bubble, message.sender === 'user' ? styles.userBubble : styles.aiBubble]}
              >
                <Text style={[styles.messageText, message.sender === 'user' ? styles.userText : styles.aiText]}>{message.text}</Text>
                <View style={styles.metaContainer}>
                  <Text style={[styles.timestamp, message.sender === 'user' ? styles.userMetaText : styles.aiMetaText]}>{message.timestamp}</Text>
                  {message.sender === 'user' && <View style={styles.checkIcon}><CheckCheck size={14} color="#fff" opacity={0.8} /></View>}
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* FLOATING STACKED CONTEXT MENU */}
        <Modal visible={menuVisible} transparent animationType="fade">
          <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={[styles.floatingMenuStacked, { top: menuPos.top, left: menuPos.left }]}>
                <TouchableOpacity style={[styles.menuIconBtn, styles.shadowSm, { backgroundColor: '#f8fafc' }]} onPress={replyMessage}>
                  <Reply size={18} color="#475569" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuIconBtn, styles.shadowSm, { backgroundColor: '#f8fafc' }]} onPress={copyToClipboard}>
                  <Copy size={18} color="#475569" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuIconBtn, styles.shadowSm, { backgroundColor: '#f8fafc' }]} onPress={reportMessage}>
                  <Flag size={18} color="#475569" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuIconBtn, styles.shadowSm, { backgroundColor: '#fee2e2' }]} onPress={deleteMessage}>
                  <Trash2 size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* INPUT BAR */}
        <View style={styles.inputBar}>
          {isRecording ? (
            <View style={styles.recordingRow}>
              <TouchableOpacity onPress={() => setIsRecording(false)}><Trash2 size={24} color="#ef4444" /></TouchableOpacity>
              <View style={styles.recordingTimer}>
                <Animated.View style={[styles.redDot, { transform: [{ scale: pulseAnim }] }]} />
                <Text style={styles.timerText}>0:{recordingDuration < 10 ? `0${recordingDuration}` : recordingDuration}</Text>
              </View>
              <TouchableOpacity style={styles.stopAction} onPress={stopRecording}><Square size={16} color="#fff" fill="#fff" /></TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inputRow}>
              <TouchableOpacity style={styles.plusButton}><Plus size={24} color="#3b82f6" /></TouchableOpacity>
              <View style={styles.textInputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Message"
                  placeholderTextColor="#94a3b8"
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                />
              </View>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: inputText.trim() ? '#3b82f6' : '#64748b' }]} 
                onPress={inputText.trim() ? sendMessage : startRecording}
              >
                {inputText.trim() ? <Send size={18} color="#fff" /> : <Mic size={18} color="#fff" />}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  headerInfo: { flex: 1, marginLeft: 8 },
  headerName: { fontSize: 17, fontWeight: '600', color: '#000' },
  headerStatus: { fontSize: 13, color: '#3b82f6' },
  headerButton: { padding: 8 },
  chatArea: { flex: 1 },
  chatContent: { padding: 12, paddingBottom: 20 },
  messageContainer: { marginBottom: 12, width: '100%' },
  userContainer: { alignItems: 'flex-end' },
  aiContainer: { alignItems: 'flex-start' },
  bubble: { maxWidth: '75%', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1 },
  userBubble: { backgroundColor: '#3b82f6', borderBottomRightRadius: 2 },
  aiBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 2 },
  messageText: { fontSize: 16, lineHeight: 20 },
  userText: { color: '#fff' },
  aiText: { color: '#000' },
  metaContainer: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginTop: 2 },
  timestamp: { fontSize: 11, marginLeft: 8 },
  userMetaText: { color: 'rgba(255,255,255,0.7)' },
  aiMetaText: { color: '#8E8E93' },
  checkIcon: { marginLeft: 4 },
  inputBar: { paddingHorizontal: 8, paddingVertical: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E5EA', paddingBottom: Platform.OS === 'ios' ? 20 : 10 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end' },
  plusButton: { padding: 8 },
  textInputWrapper: { flex: 1, backgroundColor: '#F2F2F7', borderRadius: 20, paddingHorizontal: 12, marginHorizontal: 8, minHeight: 36, maxHeight: 120, justifyContent: 'center', borderWidth: 1, borderColor: '#E5E5EA' },
  textInput: { fontSize: 16, paddingTop: 8, paddingBottom: 8, color: '#000' },
  actionButton: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  recordingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, height: 40 },
  recordingTimer: { flexDirection: 'row', alignItems: 'center' },
  redDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ef4444', marginRight: 10 },
  timerText: { fontSize: 18, color: '#000', fontWeight: '500' },
  stopAction: { backgroundColor: '#ef4444', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  
  // STACKED FLOATING MENU
  modalOverlay: { flex: 1, backgroundColor: 'transparent' },
  floatingMenuStacked: { 
    position: 'absolute', 
    flexDirection: 'column', // Stacks buttons vertically
    alignItems: 'center',
  },
  menuIconBtn: { 
    width: 42, 
    height: 42, 
    borderRadius: 21, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 6, // Vertical spacing between buttons
  },
  shadowSm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }
});

export default Chat;