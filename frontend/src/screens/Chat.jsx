import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { theme } from '../lib/theme';

const Chat = ({ navigation }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I\'m your AI Coach. How can I help you with your discipline today?', sender: 'ai', timestamp: '10:00 AM' },
    { id: 2, text: 'I\'m feeling tired and don\'t want to do my workout.', sender: 'user', timestamp: '10:05 AM' },
    { id: 3, text: 'I understand. Would you like to try the micro version instead? Just 10 minutes of stretching to keep your streak alive.', sender: 'ai', timestamp: '10:05 AM' },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setInputText('');

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          text: 'That\'s a great step! Remember, consistency beats perfection. You\'ve got this!',
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const quickActions = [
    'I\'m struggling with motivation',
    'Help me break down this task',
    'I need to adjust my schedule',
    'Celebrate my progress',
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
        {messages.map(message => (
          <View key={message.id} style={[
            styles.messageContainer,
            message.sender === 'user' ? styles.userMessage : styles.aiMessage
          ]}>
            {message.sender === 'ai' && (
              <Avatar name="AI" level={1} health={100} size={30} />
            )}
            <Card style={[
              styles.messageBubble,
              message.sender === 'user' ? styles.userBubble : styles.aiBubble
            ]}>
              <Text style={[
                styles.messageText,
                message.sender === 'user' ? styles.userText : styles.aiText
              ]}>
                {message.text}
              </Text>
              <Text style={styles.timestamp}>{message.timestamp}</Text>
            </Card>
          </View>
        ))}
      </ScrollView>

      <View style={styles.quickActions}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.quickActionButton} onPress={() => setInputText(action)}>
              <Text style={styles.quickActionText}>{action}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor={theme.colors.textSecondary}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: theme.spacing.medium,
  },
  messageContainer: {
    marginBottom: theme.spacing.medium,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    marginLeft: theme.spacing.small,
    marginRight: theme.spacing.small,
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
  },
  aiBubble: {
    backgroundColor: theme.colors.cardBackground,
  },
  messageText: {
    fontSize: theme.fontSize.title,
    lineHeight: 20,
  },
  userText: {
    color: theme.colors.text,
  },
  aiText: {
    color: theme.colors.text,
  },
  timestamp: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.small,
    textAlign: 'right',
  },
  quickActions: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  quickActionButton: {
    backgroundColor: theme.colors.border,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    borderRadius: theme.borderRadius.card,
    marginRight: theme.spacing.small,
  },
  quickActionText: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing.medium,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.cardBackground,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.medium,
    fontSize: theme.fontSize.title,
    color: theme.colors.text,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: theme.spacing.medium,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.medium,
    borderRadius: theme.borderRadius.card,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
});

export default Chat;