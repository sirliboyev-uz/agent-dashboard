/**
 * Service for calculating metrics and statistics
 */
class MetricsService {
  /**
   * Calculate overall metrics from agents and logs
   * @param {Array} agents - Array of agents
   * @param {Array} logs - Array of log entries
   * @returns {Object} Metrics object
   */
  calculateMetrics(agents, logs) {
    const totalRuns = logs.length;
    const successfulRuns = logs.filter(log => log.status === 'success').length;
    const successRate = totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0;

    const totalCost = logs.reduce((sum, log) => {
      return sum + (log.response?.cost || 0);
    }, 0);

    const avgCost = totalRuns > 0 ? totalCost / totalRuns : 0;

    const avgDuration = totalRuns > 0
      ? logs.reduce((sum, log) => sum + (log.duration || 0), 0) / totalRuns
      : 0;

    const totalTokens = logs.reduce((sum, log) => {
      return sum + (log.response?.tokensUsed || 0);
    }, 0);

    return {
      totalRuns,
      successfulRuns,
      failedRuns: totalRuns - successfulRuns,
      successRate: Math.round(successRate * 10) / 10,
      totalCost: Math.round(totalCost * 1000) / 1000,
      avgCost: Math.round(avgCost * 1000) / 1000,
      avgDuration: Math.round(avgDuration),
      totalTokens,
    };
  }

  /**
   * Calculate stats for a specific agent
   * @param {string} agentId - Agent ID
   * @param {Array} logs - Array of log entries
   * @returns {Object} Agent-specific stats
   */
  calculateAgentStats(agentId, logs) {
    const agentLogs = logs.filter(log => log.agentId === agentId);
    const totalRuns = agentLogs.length;
    const successfulRuns = agentLogs.filter(log => log.status === 'success').length;

    const successRate = totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0;

    const totalCost = agentLogs.reduce((sum, log) => {
      return sum + (log.response?.cost || 0);
    }, 0);

    const avgCost = totalRuns > 0 ? totalCost / totalRuns : 0;

    const lastRun = agentLogs.length > 0
      ? Math.max(...agentLogs.map(log => log.timestamp))
      : null;

    return {
      totalRuns,
      successRate: Math.round(successRate * 10) / 10,
      avgCost: Math.round(avgCost * 1000) / 1000,
      lastRun,
    };
  }

  /**
   * Get runs over time data for charts
   * @param {Array} logs - Array of log entries
   * @param {number} days - Number of days to include
   * @returns {Array} Array of data points for charts
   */
  getRunsOverTime(logs, days = 7) {
    const now = Date.now();
    const msPerDay = 24 * 60 * 60 * 1000;
    const dataPoints = [];

    for (let i = days - 1; i >= 0; i--) {
      const dayStart = now - (i * msPerDay);
      const dayEnd = dayStart + msPerDay;

      const dayLogs = logs.filter(log => {
        return log.timestamp >= dayStart && log.timestamp < dayEnd;
      });

      const date = new Date(dayStart);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

      dataPoints.push({
        date: dateStr,
        runs: dayLogs.length,
        successful: dayLogs.filter(log => log.status === 'success').length,
        failed: dayLogs.filter(log => log.status === 'error').length,
      });
    }

    return dataPoints;
  }

  /**
   * Get top performing agents
   * @param {Array} agents - Array of agents
   * @param {Array} logs - Array of log entries
   * @param {number} limit - Number of top agents to return
   * @returns {Array} Array of top agents with stats
   */
  getTopAgents(agents, logs, limit = 5) {
    const agentsWithStats = agents.map(agent => {
      const stats = this.calculateAgentStats(agent.id, logs);
      return {
        ...agent,
        ...stats,
      };
    });

    // Sort by total runs descending
    return agentsWithStats
      .sort((a, b) => b.totalRuns - a.totalRuns)
      .slice(0, limit);
  }

  /**
   * Get cost breakdown by model
   * @param {Array} logs - Array of log entries
   * @returns {Object} Cost breakdown by model
   */
  getCostByModel(logs) {
    const costByModel = {};

    logs.forEach(log => {
      const model = log.request?.model || 'unknown';
      const cost = log.response?.cost || 0;

      if (!costByModel[model]) {
        costByModel[model] = {
          totalCost: 0,
          runs: 0,
        };
      }

      costByModel[model].totalCost += cost;
      costByModel[model].runs += 1;
    });

    return Object.entries(costByModel).map(([model, data]) => ({
      model,
      totalCost: Math.round(data.totalCost * 1000) / 1000,
      runs: data.runs,
      avgCost: Math.round((data.totalCost / data.runs) * 1000) / 1000,
    }));
  }
}

export default new MetricsService();
