import React from 'react';
import { LayoutDashboard, Bot, FileText, Settings, Download, Upload, Store } from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange, onExport, onImport }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'marketplace', label: 'Marketplace', icon: Store },
    { id: 'logs', label: 'Logs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white flex items-center">
          <Bot className="mr-2 text-blue-500" size={28} />
          AI Dashboard
        </h1>
        <p className="text-slate-400 text-sm mt-1">Agent Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        <button
          onClick={onExport}
          className="w-full flex items-center px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors duration-200"
        >
          <Download size={18} className="mr-3" />
          <span className="text-sm">Export Data</span>
        </button>
        <button
          onClick={onImport}
          className="w-full flex items-center px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors duration-200"
        >
          <Upload size={18} className="mr-3" />
          <span className="text-sm">Import Data</span>
        </button>
      </div>
    </aside>
  );
}
