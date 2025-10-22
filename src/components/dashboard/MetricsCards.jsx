import React from 'react';
import { Activity, DollarSign, CheckCircle, TrendingUp } from 'lucide-react';

export default function MetricsCards({ metrics }) {
  const cards = [
    {
      title: 'Total Runs',
      value: metrics.totalRuns.toLocaleString(),
      icon: Activity,
      color: 'blue',
      subtitle: `${metrics.successfulRuns} successful`,
    },
    {
      title: 'Success Rate',
      value: `${metrics.successRate}%`,
      icon: CheckCircle,
      color: 'green',
      subtitle: `${metrics.failedRuns} failed`,
    },
    {
      title: 'Total Cost',
      value: `$${metrics.totalCost.toFixed(3)}`,
      icon: DollarSign,
      color: 'purple',
      subtitle: `${metrics.totalTokens.toLocaleString()} tokens`,
    },
    {
      title: 'Avg. Cost/Run',
      value: `$${metrics.avgCost.toFixed(3)}`,
      icon: TrendingUp,
      color: 'yellow',
      subtitle: `${metrics.avgDuration}ms avg time`,
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-500',
    green: 'bg-green-500/10 text-green-500',
    purple: 'bg-purple-500/10 text-purple-500',
    yellow: 'bg-yellow-500/10 text-yellow-500',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="card hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-slate-400 text-sm font-medium mb-2">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-white mb-1">
                  {card.value}
                </p>
                <p className="text-slate-500 text-xs">{card.subtitle}</p>
              </div>

              <div className={`p-3 rounded-lg ${colorClasses[card.color]}`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
