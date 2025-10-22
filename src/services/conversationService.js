import { v4 as uuidv4 } from 'uuid';
import storageService from './storageService';

const STORAGE_KEY = 'ai_dashboard_conversations';
const MAX_CONVERSATIONS = 50;
const MAX_CONTEXT_MESSAGES = 20; // Keep last 20 messages for context

class ConversationService {
  /**
   * Get all conversations, sorted by most recent
   */
  getConversations() {
    try {
      const conversations = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return conversations.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  }

  /**
   * Get a single conversation by ID
   */
  getConversation(conversationId) {
    const conversations = this.getConversations();
    return conversations.find(c => c.id === conversationId);
  }

  /**
   * Get all conversations for a specific agent
   */
  getAgentConversations(agentId) {
    const conversations = this.getConversations();
    return conversations.filter(c => c.agentId === agentId);
  }

  /**
   * Create a new conversation
   */
  createConversation(agentId, agentName) {
    const conversation = {
      id: uuidv4(),
      agentId,
      agentName,
      title: 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tokenUsage: 0,
      totalCost: 0,
    };

    const conversations = this.getConversations();
    conversations.unshift(conversation);

    // Keep only the most recent conversations
    const trimmed = conversations.slice(0, MAX_CONVERSATIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

    return conversation;
  }

  /**
   * Add a message to a conversation
   */
  addMessage(conversationId, role, content, tokens = 0, cost = 0) {
    const conversations = this.getConversations();
    const conversation = conversations.find(c => c.id === conversationId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const message = {
      id: uuidv4(),
      role,
      content,
      timestamp: Date.now(),
      tokens,
      cost,
    };

    conversation.messages.push(message);
    conversation.updatedAt = Date.now();
    conversation.tokenUsage += tokens;
    conversation.totalCost += cost;

    // Auto-generate title from first user message
    if (conversation.title === 'New Conversation' && role === 'user') {
      conversation.title = this._generateTitle(content);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));

    return message;
  }

  /**
   * Update conversation title
   */
  updateTitle(conversationId, newTitle) {
    const conversations = this.getConversations();
    const conversation = conversations.find(c => c.id === conversationId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    conversation.title = newTitle;
    conversation.updatedAt = Date.now();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));

    return conversation;
  }

  /**
   * Delete a conversation
   */
  deleteConversation(conversationId) {
    const conversations = this.getConversations();
    const filtered = conversations.filter(c => c.id !== conversationId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    return true;
  }

  /**
   * Get conversation context for API calls (last N messages)
   */
  getConversationContext(conversationId, maxMessages = MAX_CONTEXT_MESSAGES) {
    const conversation = this.getConversation(conversationId);

    if (!conversation) {
      return [];
    }

    // Return last N messages for context
    const messages = conversation.messages.slice(-maxMessages);

    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  /**
   * Export conversation as markdown
   */
  exportAsMarkdown(conversationId) {
    const conversation = this.getConversation(conversationId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    let markdown = `# ${conversation.title}\n\n`;
    markdown += `**Agent:** ${conversation.agentName}\n`;
    markdown += `**Created:** ${new Date(conversation.createdAt).toLocaleString()}\n`;
    markdown += `**Total Tokens:** ${conversation.tokenUsage}\n`;
    markdown += `**Total Cost:** $${conversation.totalCost.toFixed(4)}\n\n`;
    markdown += `---\n\n`;

    conversation.messages.forEach(msg => {
      const timestamp = new Date(msg.timestamp).toLocaleTimeString();
      markdown += `### ${msg.role === 'user' ? 'You' : conversation.agentName} - ${timestamp}\n\n`;
      markdown += `${msg.content}\n\n`;
    });

    return markdown;
  }

  /**
   * Export conversation as JSON
   */
  exportAsJSON(conversationId) {
    const conversation = this.getConversation(conversationId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return JSON.stringify(conversation, null, 2);
  }

  /**
   * Clear all conversations
   */
  clearAll() {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Generate a title from the first message (first 50 chars)
   */
  _generateTitle(content) {
    const cleaned = content.trim().replace(/\n+/g, ' ');
    if (cleaned.length <= 50) {
      return cleaned;
    }
    return cleaned.substring(0, 47) + '...';
  }

  /**
   * Get conversation stats
   */
  getStats() {
    const conversations = this.getConversations();

    return {
      total: conversations.length,
      totalMessages: conversations.reduce((sum, c) => sum + c.messages.length, 0),
      totalTokens: conversations.reduce((sum, c) => sum + c.tokenUsage, 0),
      totalCost: conversations.reduce((sum, c) => sum + c.totalCost, 0),
    };
  }
}

export default new ConversationService();
