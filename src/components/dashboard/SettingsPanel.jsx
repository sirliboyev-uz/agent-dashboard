import React, { useState, useEffect } from 'react';
import { Settings, Key, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../common/Button';

export default function SettingsPanel() {
  const [settings, setSettings] = useState({
    useRealAPI: false,
    openaiKey: '',
    anthropicKey: '',
  });

  const [showKeys, setShowKeys] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('ai_dashboard_settings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('ai_dashboard_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);

    // Inform user to reload
    if (settings.useRealAPI && (!settings.openaiKey && !settings.anthropicKey)) {
      alert('Please add at least one API key to use real AI APIs.');
    } else {
      alert('Settings saved! Please refresh the page for changes to take effect.');
    }
  };

  const handleToggleAPI = (value) => {
    setSettings(prev => ({ ...prev, useRealAPI: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Settings className="text-purple-500" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Settings</h2>
            <p className="text-slate-400 text-sm">Configure AI integrations and preferences</p>
          </div>
        </div>

        {/* API Mode Toggle */}
        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 font-medium mb-3">AI Mode</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleToggleAPI(false)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  !settings.useRealAPI
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <Sparkles className={settings.useRealAPI ? 'text-slate-400' : 'text-blue-500'} size={32} />
                </div>
                <h3 className={`font-semibold mb-1 ${settings.useRealAPI ? 'text-slate-300' : 'text-white'}`}>
                  Simulation Mode
                </h3>
                <p className="text-slate-400 text-xs">
                  Free, instant responses. No API keys needed.
                </p>
              </button>

              <button
                onClick={() => handleToggleAPI(true)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  settings.useRealAPI
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <Key className={!settings.useRealAPI ? 'text-slate-400' : 'text-green-500'} size={32} />
                </div>
                <h3 className={`font-semibold mb-1 ${!settings.useRealAPI ? 'text-slate-300' : 'text-white'}`}>
                  Real API Mode
                </h3>
                <p className="text-slate-400 text-xs">
                  Use actual OpenAI/Claude APIs. Requires keys.
                </p>
              </button>
            </div>
          </div>

          {/* API Keys Section */}
          {settings.useRealAPI && (
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-700 space-y-4">
              <div className="flex items-start space-x-2 text-yellow-500 mb-4">
                <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  API keys are stored in your browser's localStorage. Real API calls will incur costs.
                  Keep your keys secure!
                </p>
              </div>

              {/* OpenAI Key */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  OpenAI API Key
                </label>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={settings.openaiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, openaiKey: e.target.value }))}
                  className="input w-full"
                  placeholder="sk-..."
                />
                <p className="text-slate-500 text-xs mt-1">
                  For GPT-4 and GPT-3.5 Turbo models. Get from{' '}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    OpenAI Platform
                  </a>
                </p>
              </div>

              {/* Anthropic Key */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  Anthropic API Key
                </label>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={settings.anthropicKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, anthropicKey: e.target.value }))}
                  className="input w-full"
                  placeholder="sk-ant-..."
                />
                <p className="text-slate-500 text-xs mt-1">
                  For Claude 3 Opus and Sonnet models. Get from{' '}
                  <a
                    href="https://console.anthropic.com/settings/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Anthropic Console
                  </a>
                </p>
              </div>

              {/* Show/Hide Keys */}
              <button
                onClick={() => setShowKeys(!showKeys)}
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                {showKeys ? 'Hide' : 'Show'} API Keys
              </button>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2 flex items-center">
              <AlertCircle size={18} className="mr-2" />
              How It Works
            </h4>
            <ul className="text-slate-300 text-sm space-y-1 ml-6 list-disc">
              <li>
                <strong>Simulation Mode:</strong> Uses pre-defined response templates. Free and instant.
              </li>
              <li>
                <strong>Real API Mode:</strong> Calls actual AI APIs with your keys. Incurs usage costs.
              </li>
              <li>
                Keys are stored locally in your browser (not sent to any server except the AI providers).
              </li>
              <li>
                After saving, refresh the page to apply changes.
              </li>
            </ul>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end pt-4 border-t border-slate-700">
            {saved && (
              <div className="flex items-center text-green-500 mr-4">
                <CheckCircle size={18} className="mr-2" />
                <span className="text-sm">Saved!</span>
              </div>
            )}
            <Button variant="primary" onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Cost Calculator */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Estimated Costs</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">GPT-4</span>
            <span className="text-slate-200">$0.03 per 1K tokens</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">GPT-3.5 Turbo</span>
            <span className="text-slate-200">$0.002 per 1K tokens</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Claude 3 Opus</span>
            <span className="text-slate-200">$0.015 per 1K tokens</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Claude 3 Sonnet</span>
            <span className="text-slate-200">$0.003 per 1K tokens</span>
          </div>
        </div>
        <p className="text-slate-500 text-xs mt-4">
          Typical agent run uses 200-1000 tokens. Monitor your usage in the AI provider's dashboard.
        </p>
      </div>
    </div>
  );
}
