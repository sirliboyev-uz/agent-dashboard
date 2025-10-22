import React from 'react';
import { Plus, PlayCircle } from 'lucide-react';
import Button from '../common/Button';

export default function TopBar({ onCreateAgent, onRunAll, hasAgents, isRunningAll }) {
  return (
    <div className="bg-slate-800 border-b border-slate-700 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Agent Management</h2>
          <p className="text-slate-400 text-sm mt-1">
            Create, configure, and execute AI agents
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {hasAgents && (
            <Button
              variant="success"
              icon={<PlayCircle size={18} />}
              onClick={onRunAll}
              disabled={isRunningAll}
            >
              {isRunningAll ? 'Running All...' : 'Run All Agents'}
            </Button>
          )}

          <Button
            variant="primary"
            icon={<Plus size={18} />}
            onClick={onCreateAgent}
          >
            Create Agent
          </Button>
        </div>
      </div>
    </div>
  );
}
