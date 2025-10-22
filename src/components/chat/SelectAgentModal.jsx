import React, { useState } from 'react';
import { X, Bot, Search } from 'lucide-react';
import Button from '../common/Button';

export default function SelectAgentModal({ isOpen, onClose, agents, onSelectAgent }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredAgents = agents.filter(agent => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      agent.name.toLowerCase().includes(query) ||
      agent.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Start a Conversation</h2>
            <p className="text-slate-400 text-sm mt-1">Select an agent to chat with</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents..."
              className="input w-full pl-10"
              autoFocus
            />
          </div>
        </div>

        {/* Agent List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredAgents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bot size={64} className="text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {agents.length === 0 ? 'No agents available' : 'No agents found'}
              </h3>
              <p className="text-slate-400">
                {agents.length === 0
                  ? 'Create an agent first to start a conversation'
                  : 'Try adjusting your search terms'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAgents.map(agent => (
                <div
                  key={agent.id}
                  onClick={() => {
                    onSelectAgent(agent);
                    onClose();
                  }}
                  className="card hover:shadow-xl hover:border-blue-500/50 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                      <Bot size={20} className="text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold mb-1 truncate">
                        {agent.name}
                      </h3>
                      <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                        {agent.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-medium">
                          {agent.model}
                        </span>
                        <span className="text-slate-500 text-xs">
                          Temp: {agent.temperature}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-800/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''} available
            </span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
