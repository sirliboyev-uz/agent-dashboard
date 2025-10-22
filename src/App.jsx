import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Components
import Sidebar from './components/dashboard/Sidebar';
import TopBar from './components/dashboard/TopBar';
import MetricsCards from './components/dashboard/MetricsCards';
import RunChart from './components/dashboard/RunChart';
import AgentList from './components/agents/AgentList';
import AgentModal from './components/agents/AgentModal';
import RunAgentModal from './components/agents/RunAgentModal';
import ResultModal from './components/agents/ResultModal';
import LogsPanel from './components/logs/LogsPanel';
import SettingsPanel from './components/dashboard/SettingsPanel';
import MarketplacePanel from './components/dashboard/MarketplacePanel';
import ShareModal from './components/agents/ShareModal';
import ChatPage from './components/chat/ChatPage';

// Services
import storageService from './services/storageService';
import aiService from './services/aiService';
import metricsService from './services/metricsService';
import shareService from './services/shareService';

// Utils
import { sampleAgents, getDefaultAgent } from './utils/sampleAgents';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [agents, setAgents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [isRunningAll, setIsRunningAll] = useState(false);

  // New modals for run flow
  const [runAgentModal, setRunAgentModal] = useState({ isOpen: false, agent: null });
  const [resultModal, setResultModal] = useState({ isOpen: false, result: null });
  const [shareModal, setShareModal] = useState({ isOpen: false, agent: null });

  // Initialize data from localStorage or use sample data
  useEffect(() => {
    const storedAgents = storageService.getAgents();
    const storedLogs = storageService.getLogs();

    if (storedAgents.length === 0) {
      // First time user - load sample agents
      setAgents(sampleAgents);
      storageService.saveAgents(sampleAgents);
    } else {
      setAgents(storedAgents);
    }

    setLogs(storedLogs);
  }, []);

  // Calculate metrics
  const metrics = metricsService.calculateMetrics(agents, logs);
  const chartData = metricsService.getRunsOverTime(logs, 7);

  // Update agent stats when logs change
  useEffect(() => {
    if (logs.length === 0) return;

    const updatedAgents = agents.map(agent => ({
      ...agent,
      stats: metricsService.calculateAgentStats(agent.id, logs),
    }));

    setAgents(updatedAgents);
    storageService.saveAgents(updatedAgents);
  }, [logs.length]);

  // Handle Create/Edit Agent
  const handleSaveAgent = (formData) => {
    if (editingAgent) {
      // Update existing agent
      const updatedAgents = agents.map(agent =>
        agent.id === editingAgent.id
          ? { ...agent, ...formData }
          : agent
      );
      setAgents(updatedAgents);
      storageService.saveAgents(updatedAgents);
    } else {
      // Create new agent
      const newAgent = {
        ...getDefaultAgent(),
        ...formData,
        id: uuidv4(),
        createdAt: Date.now(),
      };
      const updatedAgents = [...agents, newAgent];
      setAgents(updatedAgents);
      storageService.saveAgents(updatedAgents);
    }

    setEditingAgent(null);
  };

  // Handle Delete Agent
  const handleDeleteAgent = (agentId) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      const updatedAgents = agents.filter(agent => agent.id !== agentId);
      setAgents(updatedAgents);
      storageService.saveAgents(updatedAgents);
    }
  };

  // Handle Share Agent
  const handleShareAgent = (agent) => {
    setShareModal({ isOpen: true, agent });
  };

  // Handle Import Agent from Marketplace
  const handleImportAgent = (agentData) => {
    const newAgent = {
      ...getDefaultAgent(),
      ...agentData,
      id: uuidv4(),
      createdAt: Date.now(),
    };
    const updatedAgents = [...agents, newAgent];
    setAgents(updatedAgents);
    storageService.saveAgents(updatedAgents);

    // Switch to agents tab to show imported agent
    setActiveTab('agents');
  };

  // Handle Open Run Modal
  const handleOpenRunModal = (agent) => {
    setRunAgentModal({ isOpen: true, agent });
  };

  // Handle Run Agent with user input
  const handleRunAgent = async (agent, userInput) => {
    try {
      const result = await aiService.executeAgent(agent, userInput);

      // Add log entry
      const updatedLogs = [result, ...logs];
      setLogs(updatedLogs);
      storageService.saveLogs(updatedLogs);

      // Close input modal and show result modal
      setRunAgentModal({ isOpen: false, agent: null });
      setResultModal({ isOpen: true, result });

      return result;
    } catch (error) {
      console.error('Error running agent:', error);
      setRunAgentModal({ isOpen: false, agent: null });
    }
  };

  // Handle Run All Agents
  const handleRunAll = async () => {
    if (agents.length === 0) return;

    setIsRunningAll(true);

    try {
      // Run all agents sequentially with simulated parallel execution feel
      const results = [];
      for (const agent of agents) {
        const result = await handleRunAgent(agent);
        results.push(result);
      }

      console.log(`Successfully ran ${results.length} agents`);
    } catch (error) {
      console.error('Error running all agents:', error);
    } finally {
      setIsRunningAll(false);
    }
  };

  // Handle Export Data
  const handleExport = () => {
    const data = storageService.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-dashboard-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle Import Data
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);

          if (window.confirm('This will replace all existing data. Continue?')) {
            storageService.importData(data);
            setAgents(data.agents || []);
            setLogs(data.logs || []);
          }
        } catch (error) {
          alert('Error importing data. Please check the file format.');
          console.error('Import error:', error);
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <MetricsCards metrics={metrics} />
            <RunChart data={chartData} />
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Recent Agents</h3>
              <AgentList
                agents={agents.slice(0, 6)}
                onRun={handleOpenRunModal}
                onEdit={(agent) => {
                  setEditingAgent(agent);
                  setIsModalOpen(true);
                }}
                onDelete={handleDeleteAgent}
                onShare={handleShareAgent}
              />
            </div>
          </div>
        );

      case 'chat':
        return <ChatPage agents={agents} />;

      case 'agents':
        return (
          <AgentList
            agents={agents}
            onRun={handleOpenRunModal}
            onEdit={(agent) => {
              setEditingAgent(agent);
              setIsModalOpen(true);
            }}
            onDelete={handleDeleteAgent}
            onShare={handleShareAgent}
          />
        );

      case 'marketplace':
        return <MarketplacePanel onImportAgent={handleImportAgent} />;

      case 'logs':
        return <LogsPanel logs={logs} />;

      case 'settings':
        return <SettingsPanel />;

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar
          onCreateAgent={() => {
            setEditingAgent(null);
            setIsModalOpen(true);
          }}
          onRunAll={handleRunAll}
          hasAgents={agents.length > 0}
          isRunningAll={isRunningAll}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-900 p-8">
          {renderContent()}
        </main>
      </div>

      {/* Agent Modal */}
      <AgentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAgent(null);
        }}
        onSave={handleSaveAgent}
        agent={editingAgent}
      />

      {/* Run Agent Modal */}
      <RunAgentModal
        isOpen={runAgentModal.isOpen}
        onClose={() => setRunAgentModal({ isOpen: false, agent: null })}
        onRun={handleRunAgent}
        agent={runAgentModal.agent}
      />

      {/* Result Modal */}
      <ResultModal
        isOpen={resultModal.isOpen}
        onClose={() => setResultModal({ isOpen: false, result: null })}
        result={resultModal.result}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal({ isOpen: false, agent: null })}
        agent={shareModal.agent}
      />
    </div>
  );
}
