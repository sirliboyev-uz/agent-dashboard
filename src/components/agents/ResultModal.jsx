import React from 'react';
import { X, CheckCircle, Copy, Download, ExternalLink } from 'lucide-react';
import Button from '../common/Button';

export default function ResultModal({ isOpen, onClose, result }) {
  if (!isOpen || !result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.response.content);
    alert('Response copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([result.response.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.agentName.replace(/\s+/g, '-')}-result-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDuration = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="text-green-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Agent Response</h2>
              <p className="text-slate-400 text-sm">{result.agentName}</p>
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
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-xs mb-1">Processing Time</p>
              <p className="text-white text-lg font-semibold">
                {formatDuration(result.duration)}
              </p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-xs mb-1">Tokens Used</p>
              <p className="text-white text-lg font-semibold">
                {result.response.tokensUsed.toLocaleString()}
              </p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-xs mb-1">Estimated Cost</p>
              <p className="text-white text-lg font-semibold">
                ${result.response.cost.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Response */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-300 font-medium">AI Response</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy size={18} />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                  title="Download as text file"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>

            <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
              <pre className="text-slate-100 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                {result.response.content}
              </pre>
            </div>
          </div>

          {/* Your Input */}
          <div>
            <h3 className="text-slate-300 font-medium mb-3">Your Input</h3>
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-700">
              <pre className="text-slate-300 text-sm whitespace-pre-wrap">
                {result.request.prompt.split('User Input: ')[1] || result.request.prompt}
              </pre>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <Button
              variant="ghost"
              onClick={() => window.location.hash = '#logs'}
              icon={<ExternalLink size={18} />}
            >
              View in Logs
            </Button>
            <Button variant="primary" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
