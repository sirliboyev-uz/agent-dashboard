import React, { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import ConversationHistory from './ConversationHistory';
import SelectAgentModal from './SelectAgentModal';
import conversationService from '../../services/conversationService';
import aiService from '../../services/aiService';

export default function ChatPage({ agents }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isSelectAgentModalOpen, setIsSelectAgentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = () => {
    const loaded = conversationService.getConversations();
    setConversations(loaded);

    // If no active conversation but conversations exist, select first one
    if (!activeConversationId && loaded.length > 0) {
      setActiveConversationId(loaded[0].id);
    }
  };

  const getActiveConversation = () => {
    return conversations.find(c => c.id === activeConversationId);
  };

  const getActiveAgent = () => {
    const conversation = getActiveConversation();
    if (!conversation) return null;

    return agents.find(a => a.id === conversation.agentId);
  };

  const handleNewConversation = () => {
    if (agents.length === 0) {
      alert('Please create an agent first');
      return;
    }

    setIsSelectAgentModalOpen(true);
  };

  const handleSelectAgent = (agent) => {
    const conversation = conversationService.createConversation(agent.id, agent.name);
    loadConversations();
    setActiveConversationId(conversation.id);
  };

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
  };

  const handleDeleteConversation = (conversationId) => {
    conversationService.deleteConversation(conversationId);

    if (activeConversationId === conversationId) {
      setActiveConversationId(null);
    }

    loadConversations();
  };

  const handleUpdateTitle = (newTitle) => {
    if (!activeConversationId) return;

    conversationService.updateTitle(activeConversationId, newTitle);
    loadConversations();
  };

  const handleSendMessage = async (userMessage) => {
    if (!activeConversationId || isLoading) return;

    const conversation = getActiveConversation();
    const agent = getActiveAgent();

    if (!conversation || !agent) return;

    setIsLoading(true);
    setStreamingContent('');

    try {
      // Add user message
      conversationService.addMessage(activeConversationId, 'user', userMessage);
      loadConversations();

      // Get conversation context
      const context = conversationService.getConversationContext(activeConversationId);

      // Execute agent with streaming
      const result = await aiService.executeAgentStreaming(
        agent,
        userMessage,
        context,
        (chunk) => {
          setStreamingContent(chunk);
        }
      );

      // Add assistant message
      conversationService.addMessage(
        activeConversationId,
        'assistant',
        result.content,
        result.tokensUsed,
        result.cost
      );

      setStreamingContent('');
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (format) => {
    if (!activeConversationId) return;

    try {
      let content;
      let filename;
      let mimeType;

      if (format === 'markdown') {
        content = conversationService.exportAsMarkdown(activeConversationId);
        filename = `conversation-${Date.now()}.md`;
        mimeType = 'text/markdown';
      } else {
        content = conversationService.exportAsJSON(activeConversationId);
        filename = `conversation-${Date.now()}.json`;
        mimeType = 'application/json';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting conversation:', error);
      alert('Failed to export conversation');
    }
  };

  // Create a modified conversation with streaming message for display
  const getDisplayConversation = () => {
    const conversation = getActiveConversation();
    if (!conversation) return null;

    if (!isLoading || !streamingContent) {
      return conversation;
    }

    // Add temporary streaming message
    return {
      ...conversation,
      messages: [
        ...conversation.messages,
        {
          id: 'streaming',
          role: 'assistant',
          content: streamingContent,
          timestamp: Date.now(),
          tokens: 0,
          cost: 0,
        },
      ],
    };
  };

  return (
    <div className="flex h-full">
      {/* Conversation History Sidebar */}
      <div className="w-80 flex-shrink-0">
        <ConversationHistory
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          agents={agents}
        />
      </div>

      {/* Chat Interface */}
      <div className="flex-1">
        <ChatInterface
          conversation={getDisplayConversation()}
          agent={getActiveAgent()}
          onSendMessage={handleSendMessage}
          onDeleteConversation={() => handleDeleteConversation(activeConversationId)}
          onUpdateTitle={handleUpdateTitle}
          onExport={handleExport}
          isLoading={isLoading}
        />
      </div>

      {/* Select Agent Modal */}
      <SelectAgentModal
        isOpen={isSelectAgentModalOpen}
        onClose={() => setIsSelectAgentModalOpen(false)}
        agents={agents}
        onSelectAgent={handleSelectAgent}
      />
    </div>
  );
}
