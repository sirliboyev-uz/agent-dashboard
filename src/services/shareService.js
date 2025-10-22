/**
 * Service for sharing and importing agents
 * Handles encoding/decoding agents to shareable format
 */
class ShareService {
  /**
   * Encode agent to shareable string
   * @param {Object} agent - Agent object
   * @returns {string} Base64 encoded agent data
   */
  encodeAgent(agent) {
    const shareData = {
      name: agent.name,
      description: agent.description,
      model: agent.model,
      promptTemplate: agent.promptTemplate,
      temperature: agent.temperature,
      version: '1.0',
    };

    const json = JSON.stringify(shareData);
    return btoa(encodeURIComponent(json));
  }

  /**
   * Decode shareable string to agent
   * @param {string} code - Base64 encoded agent data
   * @returns {Object} Agent data
   */
  decodeAgent(code) {
    try {
      const json = decodeURIComponent(atob(code));
      const data = JSON.parse(json);

      // Validate required fields
      if (!data.name || !data.model || !data.promptTemplate) {
        throw new Error('Invalid agent data');
      }

      return data;
    } catch (error) {
      throw new Error('Invalid share code');
    }
  }

  /**
   * Generate shareable URL
   * @param {Object} agent - Agent object
   * @returns {string} Shareable URL
   */
  generateShareURL(agent) {
    const code = this.encodeAgent(agent);
    const baseURL = window.location.origin + window.location.pathname;
    return `${baseURL}?import=${code}`;
  }

  /**
   * Extract import code from URL
   * @returns {string|null} Import code if present
   */
  getImportCodeFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('import');
  }

  /**
   * Clear import code from URL
   */
  clearImportCodeFromURL() {
    const url = new URL(window.location.href);
    url.searchParams.delete('import');
    window.history.replaceState({}, '', url);
  }
}

export default new ShareService();
