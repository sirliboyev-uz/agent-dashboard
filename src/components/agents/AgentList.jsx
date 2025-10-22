import React from 'react';
import AgentCard from './AgentCard';
import { Bot } from 'lucide-react';

export default function AgentList({ agents, onRun, onEdit, onDelete, onShare }) {
  if (agents.length === 0) {
    return (
      <div className="card">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Bot size={64} className="text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Agents Yet</h3>
          <p className="text-slate-400 mb-6 max-w-md">
            Get started by creating your first AI agent. Configure its model, prompt, and
            settings to automate tasks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          onRun={onRun}
          onEdit={onEdit}
          onDelete={onDelete}
          onShare={onShare}
        />
      ))}
    </div>
  );
}
