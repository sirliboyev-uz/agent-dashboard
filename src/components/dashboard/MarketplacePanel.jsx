import React, { useState } from 'react';
import { Store, Download, Star, Search, Code, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import { marketplaceAgents, getMarketplaceCategories, filterByCategory, searchMarketplace } from '../../utils/marketplaceAgents';
import shareService from '../../services/shareService';

export default function MarketplacePanel({ onImportAgent }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [importCode, setImportCode] = useState('');
  const [importError, setImportError] = useState('');

  const categories = getMarketplaceCategories();

  const getFilteredAgents = () => {
    if (searchQuery) {
      return searchMarketplace(searchQuery);
    }
    return filterByCategory(selectedCategory);
  };

  const filteredAgents = getFilteredAgents();

  const handleImportFromMarketplace = (agent) => {
    onImportAgent({
      name: agent.name,
      description: agent.description,
      model: agent.model,
      promptTemplate: agent.promptTemplate,
      temperature: agent.temperature,
    });
  };

  const handleImportFromCode = () => {
    try {
      setImportError('');
      const agentData = shareService.decodeAgent(importCode);
      onImportAgent(agentData);
      setImportCode('');
      alert(`Successfully imported "${agentData.name}"!`);
    } catch (error) {
      setImportError(error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Store className="text-purple-500" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Agent Marketplace</h2>
            <p className="text-slate-400 text-sm">
              Discover and import community-created agents
            </p>
          </div>
        </div>

        {/* Import from Code */}
        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center space-x-2 mb-3">
            <Code size={18} className="text-blue-400" />
            <h3 className="text-white font-medium">Import from Code</h3>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={importCode}
              onChange={(e) => {
                setImportCode(e.target.value);
                setImportError('');
              }}
              placeholder="Paste import code here..."
              className="input flex-1"
            />
            <Button
              variant="primary"
              onClick={handleImportFromCode}
              disabled={!importCode.trim()}
            >
              Import
            </Button>
          </div>
          {importError && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {importError}
            </p>
          )}
          <p className="text-slate-500 text-xs mt-2">
            Paste a share code to import an agent configuration
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents..."
              className="input w-full pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSearchQuery('');
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <p className="text-slate-400 text-sm mt-4">
          Showing {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="card hover:shadow-xl transition-all duration-200 group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {agent.name}
                </h3>
                <span className="text-xs px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full">
                  {agent.category}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-400 text-sm mb-4 line-clamp-2">
              {agent.description}
            </p>

            {/* Model */}
            <div className="mb-4">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium">
                {agent.model}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-4 border-b border-slate-700">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Download size={12} className="mr-1" />
                  {agent.downloads.toLocaleString()}
                </div>
                <div className="flex items-center">
                  <Star size={12} className="mr-1 text-yellow-500" />
                  {agent.rating}
                </div>
              </div>
              <div className="text-slate-600">by {agent.author}</div>
            </div>

            {/* Action */}
            <Button
              variant="primary"
              size="sm"
              icon={<Download size={14} />}
              onClick={() => handleImportFromMarketplace(agent)}
              className="w-full"
            >
              Import Agent
            </Button>
          </div>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="card text-center py-12">
          <Store size={64} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No agents found</h3>
          <p className="text-slate-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
