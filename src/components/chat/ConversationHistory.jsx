import React, { useState } from 'react';
import { MessageSquare, Plus, Search, Trash2, Clock } from 'lucide-react';
import Button from '../common/Button';

export default function ConversationHistory({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  agents,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      conv.title.toLowerCase().includes(query) ||
      conv.agentName.toLowerCase().includes(query)
    );
  });

  const groupConversationsByDate = (conversations) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups = {
      today: [],
      yesterday: [],
      lastWeek: [],
      older: [],
    };

    conversations.forEach(conv => {
      const convDate = new Date(conv.updatedAt);
      convDate.setHours(0, 0, 0, 0);

      if (convDate.getTime() === today.getTime()) {
        groups.today.push(conv);
      } else if (convDate.getTime() === yesterday.getTime()) {
        groups.yesterday.push(conv);
      } else if (convDate >= lastWeek) {
        groups.lastWeek.push(conv);
      } else {
        groups.older.push(conv);
      }
    });

    return groups;
  };

  const groups = groupConversationsByDate(filteredConversations);

  const formatRelativeTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const renderConversationGroup = (title, conversations) => {
    if (conversations.length === 0) return null;

    return (
      <div key={title} className="mb-6">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
          {title}
        </h3>
        <div className="space-y-1">
          {conversations.map(conv => {
            const isActive = conv.id === activeConversationId;

            return (
              <div
                key={conv.id}
                className={`group relative rounded-lg cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-700 text-slate-300'
                }`}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div className="p-3">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-medium line-clamp-1 flex-1 pr-2">
                      {conv.title}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this conversation?')) {
                          onDeleteConversation(conv.id);
                        }
                      }}
                      className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity ${
                        isActive
                          ? 'hover:bg-blue-700'
                          : 'hover:bg-slate-600'
                      }`}
                      title="Delete conversation"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className={isActive ? 'text-blue-200' : 'text-slate-500'}>
                      {conv.agentName}
                    </span>
                    <span className={isActive ? 'text-blue-200' : 'text-slate-500'}>
                      {formatRelativeTime(conv.updatedAt)}
                    </span>
                  </div>

                  <div className={`text-xs mt-1 ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>
                    {conv.messages.length} message{conv.messages.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 border-r border-slate-700">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MessageSquare size={20} className="text-blue-500" />
            <h2 className="text-lg font-semibold text-white">Conversations</h2>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={16} />}
          onClick={onNewConversation}
          className="w-full"
        >
          New Conversation
        </Button>

        {/* Search */}
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="input w-full pl-9 py-2 text-sm"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-4">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <MessageSquare size={48} className="text-slate-600 mb-3" />
            <h3 className="text-sm font-medium text-white mb-2">
              No conversations yet
            </h3>
            <p className="text-xs text-slate-400">
              Start a new conversation with an agent
            </p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Search size={48} className="text-slate-600 mb-3" />
            <h3 className="text-sm font-medium text-white mb-2">
              No results found
            </h3>
            <p className="text-xs text-slate-400">
              Try a different search term
            </p>
          </div>
        ) : (
          <>
            {renderConversationGroup('Today', groups.today)}
            {renderConversationGroup('Yesterday', groups.yesterday)}
            {renderConversationGroup('Last 7 Days', groups.lastWeek)}
            {renderConversationGroup('Older', groups.older)}
          </>
        )}
      </div>

      {/* Stats Footer */}
      {conversations.length > 0 && (
        <div className="flex-shrink-0 p-4 border-t border-slate-700 bg-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-1">
              <Clock size={12} />
              <span>{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</span>
            </div>
            <div>
              {conversations.reduce((sum, c) => sum + c.messages.length, 0)} messages
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
