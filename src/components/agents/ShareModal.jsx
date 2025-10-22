import React, { useState } from 'react';
import { X, Copy, Link, Check, Share2 } from 'lucide-react';
import Button from '../common/Button';
import shareService from '../../services/shareService';

export default function ShareModal({ isOpen, onClose, agent }) {
  const [copied, setCopied] = useState(false);
  const [copiedURL, setCopiedURL] = useState(false);

  if (!isOpen || !agent) return null;

  const shareCode = shareService.encodeAgent(agent);
  const shareURL = shareService.generateShareURL(agent);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(shareCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyURL = () => {
    navigator.clipboard.writeText(shareURL);
    setCopiedURL(true);
    setTimeout(() => setCopiedURL(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Share2 className="text-green-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Share Agent</h2>
              <p className="text-slate-400 text-sm">{agent.name}</p>
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
          {/* Share URL */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 font-medium flex items-center">
                <Link size={18} className="mr-2" />
                Share Link
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyURL}
                icon={copiedURL ? <Check size={16} /> : <Copy size={16} />}
              >
                {copiedURL ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <code className="text-blue-400 text-sm break-all">{shareURL}</code>
            </div>
            <p className="text-slate-500 text-xs mt-2">
              Anyone with this link can import this agent configuration
            </p>
          </div>

          {/* Share Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 font-medium">Import Code</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCode}
                icon={copied ? <Check size={16} /> : <Copy size={16} />}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <code className="text-green-400 text-sm break-all font-mono">{shareCode}</code>
            </div>
            <p className="text-slate-500 text-xs mt-2">
              Share this code for manual import via Marketplace → Import Code
            </p>
          </div>

          {/* Info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2">What gets shared?</h4>
            <ul className="text-slate-300 text-sm space-y-1 ml-4 list-disc">
              <li>Agent name and description</li>
              <li>AI model selection</li>
              <li>Prompt template</li>
              <li>Temperature setting</li>
            </ul>
            <p className="text-slate-400 text-xs mt-3">
              ✅ Safe to share - No API keys, logs, or personal data included
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end pt-4 border-t border-slate-700">
            <Button variant="primary" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
