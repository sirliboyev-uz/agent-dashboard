import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Download, Trash2, Edit2, Check, X } from 'lucide-react';
import Button from '../common/Button';

export default function ChatInterface({
  conversation,
  agent,
  onSendMessage,
  onDeleteConversation,
  onUpdateTitle,
  onExport,
  isLoading = false,
}) {
  const [input, setInput] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(conversation?.title || '');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      onUpdateTitle(editedTitle.trim());
      setIsEditingTitle(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(conversation?.title || '');
    setIsEditingTitle(false);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!conversation || !agent) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <p>Select or create a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-slate-700 bg-slate-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {isEditingTitle ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveTitle()}
                  className="input flex-1 py-1 text-sm"
                  autoFocus
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-1 text-green-400 hover:text-green-300"
                  title="Save"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 text-red-400 hover:text-red-300"
                  title="Cancel"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-white">{conversation.title}</h2>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="p-1 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Edit title"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            )}
            <p className="text-sm text-slate-400 mt-1">
              with {agent.name} • {conversation.messages.length} messages
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onExport('markdown')}
              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
              title="Export as Markdown"
            >
              <Download size={18} />
            </button>
            <button
              onClick={onDeleteConversation}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
              title="Delete conversation"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 mt-3 text-xs text-slate-500">
          <span>{conversation.tokenUsage.toLocaleString()} tokens</span>
          <span>•</span>
          <span>${conversation.totalCost.toFixed(4)} total cost</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-slate-800 rounded-lg p-8 max-w-md">
              <h3 className="text-lg font-semibold text-white mb-2">
                Start a conversation
              </h3>
              <p className="text-slate-400 text-sm">
                Ask {agent.name} anything. Your conversation will be saved automatically.
              </p>
            </div>
          </div>
        ) : (
          <>
            {conversation.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium opacity-75">
                      {message.role === 'user' ? 'You' : agent.name}
                    </span>
                    <span className="text-xs opacity-50 ml-3">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  {message.tokens > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/10 text-xs opacity-50">
                      {message.tokens} tokens • ${message.cost.toFixed(4)}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm">{agent.name} is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-slate-700 bg-slate-800 p-4">
        <div className="flex space-x-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${agent.name}...`}
            className="input flex-1 resize-none"
            rows={1}
            style={{
              minHeight: '42px',
              maxHeight: '150px',
              height: 'auto',
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            disabled={isLoading}
          />
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            icon={isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            className="self-end"
          >
            Send
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
