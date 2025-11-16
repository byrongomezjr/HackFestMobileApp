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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ChatMessage } from '../types';
import { useData } from '../context/DataContext';

const ChatScreen = () => {
  const { currentUser, userTransactions, spendingByCategory, totalSpent, upcomingEvents } = useData();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: `Hello ${currentUser.name}! I'm your AI Campus Assistant powered by GumLoop. I can help you with:\n\n• Balance inquiries\n• Transaction history\n• Campus event information\n• Fraud alerts\n• Spending insights\n• 💰 Smart discount suggestions\n\nHow can I assist you today?`,
      sender: 'ai',
      timestamp: new Date(),
      suggestions: ['Check balance', 'Find discounts', 'Recent transactions', 'Save money'],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Analyze repeated purchases for discount opportunities
  const analyzeRepeatedPurchases = () => {
    const merchantCounts: { [key: string]: { count: number; total: number } } = {};
    
    userTransactions.forEach(t => {
      if (t.transaction_status === 'completed') {
        if (!merchantCounts[t.merchant_name]) {
          merchantCounts[t.merchant_name] = { count: 0, total: 0 };
        }
        merchantCounts[t.merchant_name].count++;
        merchantCounts[t.merchant_name].total += t.amount;
      }
    });

    // Filter for merchants with 3+ purchases
    return Object.entries(merchantCounts)
      .filter(([_, data]) => data.count >= 3)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 5);
  };

  // Mock GumLoop discount data (simulating web scraping results)
  const getDiscountsForMerchant = (merchantName: string) => {
    const discountDatabase: { [key: string]: { discount: string; code?: string; description: string } } = {
      'Campus Cafe': { 
        discount: '15% off', 
        code: 'STUDENT15',
        description: 'Valid on orders over $10. Available Mon-Fri 2-4 PM.'
      },
      'Starbucks': { 
        discount: '10% off + free upgrade',
        code: 'STARS10',
        description: 'Free size upgrade + 10% off. Valid with student ID.'
      },
      'Subway': { 
        discount: '20% off combo meals',
        code: 'SUB20',
        description: 'Valid on any 6" or footlong combo meal.'
      },
      'Chipotle': { 
        discount: 'Buy 5 get 1 free',
        description: 'Join rewards program for free burrito after 5 purchases.'
      },
      'Pizza Hut': { 
        discount: '25% off online orders',
        code: 'CAMPUS25',
        description: 'Online orders only. Minimum $15 purchase.'
      },
      'Uber Eats': { 
        discount: '$5 off next 3 orders',
        code: 'EATS5',
        description: 'New customers get $5 off first 3 orders.'
      },
      'Library Print Shop': { 
        discount: '10 free pages weekly',
        description: 'Students get 10 free B&W pages every week.'
      },
      'Bookstore': { 
        discount: '20% off supplies',
        code: 'BOOKS20',
        description: 'Valid on all school supplies and stationery.'
      },
    };

    // Try exact match or partial match
    const exactMatch = discountDatabase[merchantName];
    if (exactMatch) return exactMatch;

    // Check for partial matches
    for (const [key, value] of Object.entries(discountDatabase)) {
      if (merchantName.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(merchantName.toLowerCase())) {
        return value;
      }
    }

    // Default discount for any merchant
    return {
      discount: '5-10% student discount',
      description: 'Many campus merchants offer student discounts. Ask at checkout!'
    };
  };

  const getAIResponse = (userMessage: string): { text: string; suggestions?: string[] } => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('balance') || lowerMessage.includes('how much')) {
      const total = currentUser.dining_dollars + currentUser.meal_plan + currentUser.campus_card;
      return {
        text: `Based on your wallet balances:\n\n💰 Dining Dollars: $${currentUser.dining_dollars.toFixed(2)}\n🍽️ Meal Plan: $${currentUser.meal_plan.toFixed(2)}\n💳 Campus Card: $${currentUser.campus_card.toFixed(2)}\n\nTotal: $${total.toFixed(2)}\n\nWould you like to add funds to any wallet?`,
        suggestions: ['Add funds', 'Transaction history', 'Spending trends'],
      };
    }

    if (lowerMessage.includes('transaction') || lowerMessage.includes('history') || lowerMessage.includes('recent')) {
      const recentTransactions = userTransactions.slice(0, 3);
      const fraudCount = userTransactions.filter(t => t.transaction_status === 'flagged').length;
      
      let transactionText = 'Your recent transactions:\n\n';
      recentTransactions.forEach((t, i) => {
        transactionText += `${i + 1}. ${t.merchant_name} - $${t.amount.toFixed(2)} (${t.date})\n`;
      });
      
      if (fraudCount > 0) {
        transactionText += `\n⚠️ Note: We've flagged ${fraudCount} suspicious transaction(s).\n`;
      }
      
      transactionText += '\nWould you like more details about any transaction?';
      
      return {
        text: transactionText,
        suggestions: ['Fraud alert details', 'Weekly summary', 'Export history'],
      };
    }

    if (lowerMessage.includes('fraud') || lowerMessage.includes('suspicious') || lowerMessage.includes('alert')) {
      const flaggedTransactions = userTransactions.filter(t => t.transaction_status === 'flagged');
      
      if (flaggedTransactions.length === 0) {
        return {
          text: '✅ Good news! No fraudulent transactions detected.\n\nYour account is secure and all transactions appear normal.',
          suggestions: ['Check balance', 'Recent transactions', 'Security settings'],
        };
      }
      
      const firstAlert = flaggedTransactions[0];
      return {
        text: `🔒 Fraud Alert Details:\n\nWe detected and blocked ${flaggedTransactions.length} suspicious transaction(s):\n\n• Merchant: ${firstAlert.merchant_name}\n• Amount: $${firstAlert.amount.toFixed(2)}\n• Date: ${firstAlert.date}\n• Risk Score: ${(parseFloat(firstAlert.fraud_score) * 100).toFixed(0)}%\n\nOur AI detected this as abnormal based on your spending patterns.\n\nWould you like to review or approve any transaction?`,
        suggestions: ['View all alerts', 'Security settings', 'Transaction history'],
      };
    }

    if (lowerMessage.includes('event') || lowerMessage.includes('campus') || lowerMessage.includes('happening')) {
      let eventText = '🎉 Upcoming Campus Events:\n\n';
      const events = upcomingEvents.slice(0, 3);
      
      events.forEach((event, i) => {
        eventText += `${i + 1}. ${event.event_name} - ${event.event_date}\n   Location: ${event.location}\n`;
      });
      
      eventText += '\nWant to see more events or get tickets?';
      
      return {
        text: eventText,
        suggestions: ['All events', 'Get tickets', 'Event calendar'],
      };
    }

    if (lowerMessage.includes('dining') || lowerMessage.includes('food') || lowerMessage.includes('eat')) {
      return {
        text: `🍽️ Campus Dining Information:\n\nYour dining dollars balance: $${currentUser.dining_dollars.toFixed(2)}\n\nPopular locations on campus:\n• Campus Café\n• Library Starbucks\n• Food Court\n• Student Union\n\nWant to see your dining spending insights?`,
        suggestions: ['Spending insights', 'Add funds', 'Transaction history'],
      };
    }

    if (lowerMessage.includes('spending') || lowerMessage.includes('insight') || lowerMessage.includes('trend')) {
      let insightText = `📊 AI Spending Insights:\n\nTotal Spent: $${totalSpent.toFixed(2)}\n\n`;
      
      spendingByCategory.forEach((cat) => {
        insightText += `• ${cat.category}: $${cat.amount.toFixed(2)} (${cat.percentage}%)\n`;
      });
      
      insightText += '\n💡 AI Recommendation:\nTrack your spending patterns to make smarter financial decisions.\n\nWould you like a detailed breakdown?';
      
      return {
        text: insightText,
        suggestions: ['Detailed report', 'Budget tips', 'Transaction history'],
      };
    }

    if (lowerMessage.includes('discount') || lowerMessage.includes('deal') || lowerMessage.includes('save money') || 
        lowerMessage.includes('coupon') || lowerMessage.includes('promo')) {
      const repeatedPurchases = analyzeRepeatedPurchases();
      
      if (repeatedPurchases.length === 0) {
        return {
          text: '💰 GumLoop Discount Finder\n\n🔍 I analyzed your transactions but haven\'t found repeated purchases yet.\n\nAs you make more purchases, I\'ll identify patterns and suggest discounts at your favorite places!\n\n💡 Tip: Build up your purchase history to unlock personalized discount suggestions.',
          suggestions: ['Transaction history', 'Spending insights', 'Check balance'],
        };
      }

      let discountText = '💰 GumLoop Smart Discounts Found!\n\n🤖 I analyzed your spending and found these opportunities:\n\n';
      let totalPotentialSavings = 0;

      repeatedPurchases.forEach(([merchant, data], index) => {
        const discount = getDiscountsForMerchant(merchant);
        const estimatedSavings = data.total * 0.15; // Estimate 15% average savings
        totalPotentialSavings += estimatedSavings;

        discountText += `${index + 1}. **${merchant}**\n`;
        discountText += `   🎫 ${discount.discount}\n`;
        if (discount.code) {
          discountText += `   📱 Code: ${discount.code}\n`;
        }
        discountText += `   💵 You spent: $${data.total.toFixed(2)} (${data.count}x)\n`;
        discountText += `   💡 ${discount.description}\n\n`;
      });

      discountText += `🎉 **Potential Savings: $${totalPotentialSavings.toFixed(2)}/month**\n\n`;
      discountText += '💡 Powered by GumLoop - I continuously scan the web for the best deals at places you frequent!';

      return {
        text: discountText,
        suggestions: ['Budget tips', 'Spending insights', 'Transaction history'],
      };
    }

    if (lowerMessage.includes('budget') || lowerMessage.includes('save') || lowerMessage.includes('tip')) {
      const repeatedPurchases = analyzeRepeatedPurchases();
      let budgetText = '💡 GumLoop AI Budget Tips:\n\n';

      if (repeatedPurchases.length > 0) {
        const topMerchant = repeatedPurchases[0];
        const discount = getDiscountsForMerchant(topMerchant[0]);
        
        budgetText += `🎯 #1 Savings Opportunity:\n`;
        budgetText += `You've spent $${topMerchant[1].total.toFixed(2)} at ${topMerchant[0]}.\n\n`;
        budgetText += `💰 Available: ${discount.discount}\n`;
        if (discount.code) {
          budgetText += `Use code: ${discount.code}\n`;
        }
        budgetText += `\n📊 Other Tips:\n`;
      } else {
        budgetText += '📊 Smart Money Tips:\n';
      }

      budgetText += `• Track your spending patterns weekly\n`;
      budgetText += `• Set alerts for unusual transactions\n`;
      budgetText += `• Use discounts at repeated purchase locations\n`;
      budgetText += `• Consider meal plan vs dining dollars ratio\n\n`;
      budgetText += `💰 Current spending: $${totalSpent.toFixed(2)}\n`;
      budgetText += `🎯 Recommended budget: $${(totalSpent * 0.85).toFixed(2)} (save 15%)`;

      return {
        text: budgetText,
        suggestions: ['Find discounts', 'Spending insights', 'Transaction history'],
      };
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
      return {
        text: 'I can help you with many things! 🤖\n\n✅ Check wallet balances\n✅ View transaction history\n✅ Analyze spending patterns\n✅ Alert you about fraud\n✅ 💰 Find personalized discounts\n✅ Provide budget insights\n✅ Answer campus policies\n✅ Track savings opportunities\n\nJust ask me anything!',
        suggestions: ['Check balance', 'Find discounts', 'Budget tips', 'Save money'],
      };
    }

    if (lowerMessage.includes('add fund') || lowerMessage.includes('reload') || lowerMessage.includes('deposit')) {
      return {
        text: `I can help you add funds! 💳\n\nCurrent balances:\n• Dining Dollars: $${currentUser.dining_dollars.toFixed(2)}\n• Meal Plan: $${currentUser.meal_plan.toFixed(2)}\n• Campus Card: $${currentUser.campus_card.toFixed(2)}\n\nQuick reload options:\n• $25 • $50 • $100 • $200\n\nWhich wallet would you like to add funds to?`,
        suggestions: ['Add $50 to Dining', 'Add $25 to Meal Plan', 'Custom amount'],
      };
    }

    // Default response
    return {
      text: 'I understand you\'re asking about: "' + userMessage + '"\n\nI\'m here to help! Could you please rephrase or choose one of these common topics?',
      suggestions: ['Check balance', 'Find discounts', 'Transaction history', 'Save money'],
    };
  };

  const sendMessage = () => {
    if (inputText.trim().length === 0) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = getAIResponse(inputText);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.sender === 'user';

    return (
      <View key={message.id} style={styles.messageContainer}>
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
          {!isUser && (
            <View style={styles.aiAvatar}>
              <Icon name="smart-toy" size={20} color="#FFFFFF" />
            </View>
          )}
          <View style={styles.messageContent}>
            <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
              {message.text}
            </Text>
            <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.aiTimestamp]}>
              {message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </Text>
          </View>
        </View>

        {!isUser && message.suggestions && (
          <View style={styles.suggestionsContainer}>
            {message.suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
                <Icon name="arrow-forward" size={14} color="#DC2626" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAvatar}>
            <Icon name="smart-toy" size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <View style={styles.statusContainer}>
              <View style={styles.onlineIndicator} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="more-vert" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(renderMessage)}

          {isTyping && (
            <View style={styles.typingContainer}>
              <View style={styles.aiAvatar}>
                <Icon name="smart-toy" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.typingBubble}>
                <View style={styles.typingDots}>
                  <View style={[styles.dot, styles.dot1]} />
                  <View style={[styles.dot, styles.dot2]} />
                  <View style={[styles.dot, styles.dot3]} />
                </View>
              </View>
            </View>
          )}

          <View style={styles.bottomPadding} />
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.attachButton}>
              <Icon name="add-circle" size={24} color="#DC2626" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything..."
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={sendMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, inputText.length > 0 && styles.sendButtonActive]}
              onPress={sendMessage}
              disabled={inputText.length === 0}
            >
              <Icon name="send" size={20} color={inputText.length > 0 ? '#FFFFFF' : '#9CA3AF'} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  headerButton: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  messageContainer: {
    marginBottom: 20,
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  aiBubble: {
    alignSelf: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    backgroundColor: '#DC2626',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 18,
    borderBottomRightRadius: 4,
  },
  aiText: {
    backgroundColor: '#FFFFFF',
    color: '#111827',
    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: '#9CA3AF',
    textAlign: 'right',
  },
  aiTimestamp: {
    color: '#9CA3AF',
    marginLeft: 8,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginLeft: 40,
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    gap: 4,
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  typingBubble: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    marginLeft: 8,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
  },
  dot1: {
    animationDelay: '0s',
  },
  dot2: {
    animationDelay: '0.2s',
  },
  dot3: {
    animationDelay: '0.4s',
  },
  bottomPadding: {
    height: 20,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 16,
    color: '#111827',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#DC2626',
  },
});

export default ChatScreen;

