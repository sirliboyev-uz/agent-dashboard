import React from 'react';
import { Play, Edit, Trash2, Activity, DollarSign, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import { AI_MODELS } from '../../utils/constants';

export default function AgentCard({ agent, onRun, onEdit, onDelete }) {
  const modelInfo = AI_MODELS.find(m => m.id === agent.model);
  const modelName = modelInfo ? modelInfo.name : agent.model;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="card hover:shadow-xl transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{agent.name}</h3>
          <p className="text-slate-400 text-sm line-clamp-2">{agent.description}</p>
        </div>

        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(agent)}
            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-slate-700 rounded-lg transition-colors"
            title="Edit agent"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(agent.id)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-700 rounded-lg transition-colors"
            title="Delete agent"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Model Info */}
      <div className="mb-4 flex items-center space-x-2">
        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium">
          {modelName}
        </span>
        <span className="text-slate-500 text-xs">
          Temp: {agent.temperature}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-slate-700">
        <div>
          <div className="flex items-center text-slate-400 text-xs mb-1">
            <Activity size={12} className="mr-1" />
            Runs
          </div>
          <div className="text-white font-semibold">{agent.stats.totalRuns}</div>
        </div>

        <div>
          <div className="flex items-center text-slate-400 text-xs mb-1">
            <CheckCircle size={12} className="mr-1" />
            Success
          </div>
          <div className="text-white font-semibold">{agent.stats.successRate}%</div>
        </div>

        <div>
          <div className="flex items-center text-slate-400 text-xs mb-1">
            <DollarSign size={12} className="mr-1" />
            Avg Cost
          </div>
          <div className="text-white font-semibold">${agent.stats.avgCost.toFixed(3)}</div>
        </div>
      </div>

      {/* Last Run */}
      <div className="text-slate-500 text-xs mb-4">
        Last run: {formatDate(agent.stats.lastRun)}
      </div>

      {/* Action */}
      <Button
        variant="primary"
        size="sm"
        icon={<Play size={14} />}
        onClick={() => onRun(agent)}
        className="w-full"
      >
        Run Agent
      </Button>
    </div>
  );
}
