import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import Button from '../common/Button';

const EXAMPLE_PROMPTS = {
  'email': [
    'Summarize this email about the Q4 budget meeting...',
    'Extract action items from this project update email...',
    'What are the key deadlines mentioned in this email?',
  ],
  'social': [
    'Create a caption for a photo of my new product launch',
    'Write an engaging post about achieving a milestone',
    'Generate a motivational Monday post for my followers',
  ],
  'research': [
    'What are the latest trends in AI development?',
    'Explain the benefits of remote work for companies',
    'Research the pros and cons of electric vehicles',
  ],
  'default': [
    'Help me write a professional email response',
    'Generate ideas for a blog post about productivity',
    'Summarize this article in simple terms',
  ],
};

export default function RunAgentModal({ isOpen, onClose, onRun, agent }) {
  const [userInput, setUserInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUserInput('');
      setIsRunning(false);
    }
  }, [isOpen]);

  if (!isOpen || !agent) return null;

  const getExamples = () => {
    const name = agent.name.toLowerCase();
    if (name.includes('email')) return EXAMPLE_PROMPTS.email;
    if (name.includes('social') || name.includes('caption')) return EXAMPLE_PROMPTS.social;
    if (name.includes('research')) return EXAMPLE_PROMPTS.research;
    return EXAMPLE_PROMPTS.default;
  };

  const examples = getExamples();

  const handleRun = async () => {
    if (!userInput.trim()) return;

    setIsRunning(true);
    await onRun(agent, userInput.trim());
    setIsRunning(false);
  };

  const handleExampleClick = (example) => {
    setUserInput(example);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Sparkles className="text-blue-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{agent.name}</h2>
              <p className="text-slate-400 text-sm">{agent.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Input Area */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              What would you like this agent to do? *
            </label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="textarea w-full"
              rows={6}
              placeholder={`e.g., ${examples[0]}`}
              disabled={isRunning}
            />
            <p className="text-slate-500 text-xs mt-2">
              Enter your task, question, or paste content for the agent to process.
            </p>
          </div>

          {/* Example Prompts */}
          <div>
            <p className="text-slate-400 text-sm font-medium mb-3">Quick Examples:</p>
            <div className="grid grid-cols-1 gap-2">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="text-left px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm border border-slate-600 hover:border-blue-500"
                  disabled={isRunning}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Model Info */}
          <div className="flex items-center justify-between text-sm bg-slate-700/30 rounded-lg p-3 border border-slate-700">
            <span className="text-slate-400">Model:</span>
            <span className="text-slate-200 font-medium">{agent.model}</span>
            <span className="text-slate-400">Temperature:</span>
            <span className="text-slate-200 font-medium">{agent.temperature}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700">
            <Button variant="secondary" onClick={onClose} disabled={isRunning}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleRun}
              disabled={!userInput.trim() || isRunning}
              icon={<Sparkles size={18} />}
            >
              {isRunning ? 'Running...' : 'Run Agent'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
