import { STORAGE_KEYS } from '../utils/constants';

/**
 * localStorage wrapper service for managing agents and logs
 */
class StorageService {
  /**
   * Get all agents from localStorage
   * @returns {Array} Array of agent objects
   */
  getAgents() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AGENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading agents from storage:', error);
      return [];
    }
  }

  /**
   * Save agents to localStorage
   * @param {Array} agents - Array of agent objects
   */
  saveAgents(agents) {
    try {
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
    } catch (error) {
      console.error('Error saving agents to storage:', error);
    }
  }

  /**
   * Get all logs from localStorage
   * @returns {Array} Array of log objects
   */
  getLogs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading logs from storage:', error);
      return [];
    }
  }

  /**
   * Save logs to localStorage
   * @param {Array} logs - Array of log objects
   */
  saveLogs(logs) {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving logs to storage:', error);
    }
  }

  /**
   * Add a new log entry
   * @param {Object} log - Log object to add
   */
  addLog(log) {
    const logs = this.getLogs();
    logs.unshift(log); // Add to beginning for recent-first order

    // Keep only last 100 logs to prevent storage overflow
    if (logs.length > 100) {
      logs.splice(100);
    }

    this.saveLogs(logs);
  }

  /**
   * Clear all data from localStorage
   */
  clearAll() {
    localStorage.removeItem(STORAGE_KEYS.AGENTS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
  }

  /**
   * Export all data as JSON
   * @returns {Object} Object containing agents and logs
   */
  exportData() {
    return {
      agents: this.getAgents(),
      logs: this.getLogs(),
      exportedAt: new Date().toISOString(),
    };
  }

  /**
   * Import data from JSON
   * @param {Object} data - Object containing agents and logs
   */
  importData(data) {
    if (data.agents) {
      this.saveAgents(data.agents);
    }
    if (data.logs) {
      this.saveLogs(data.logs);
    }
  }
}

export default new StorageService();
