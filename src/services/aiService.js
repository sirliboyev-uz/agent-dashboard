import { v4 as uuidv4 } from 'uuid';
import { AI_MODELS, RESPONSE_TEMPLATES } from '../utils/constants';

/**
 * AI Service for handling agent execution
 * Supports both simulated and real API calls
 */
class AIService {
  constructor() {
    this.loadSettings();
  }

  /**
   * Load settings from localStorage or environment variables
   */
  loadSettings() {
    const stored = localStorage.getItem('ai_dashboard_settings');

    if (stored) {
      const settings = JSON.parse(stored);
      this.useRealAPI = settings.useRealAPI || false;
      this.openaiKey = settings.openaiKey || import.meta.env.VITE_OPENAI_API_KEY;
      this.anthropicKey = settings.anthropicKey || import.meta.env.VITE_ANTHROPIC_API_KEY;
    } else {
      this.useRealAPI = import.meta.env.VITE_USE_REAL_API === 'true';
      this.openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
      this.anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    }
  }

  /**
   * Execute an agent with given prompt
   * @param {Object} agent - Agent configuration
   * @param {string} userPrompt - User's input prompt
   * @returns {Promise<Object>} Execution result with response and metadata
   */
  async executeAgent(agent, userPrompt = 'Process this task') {
    // Reload settings before each execution
    this.loadSettings();

    const startTime = Date.now();

    try {
      let result;

      if (this.useRealAPI && this._hasValidAPIKey(agent.model)) {
        result = await this._executeRealAPI(agent, userPrompt);
      } else {
        result = await this._executeSimulated(agent, userPrompt);
      }

      const duration = Date.now() - startTime;

      return {
        id: uuidv4(),
        agentId: agent.id,
        agentName: agent.name,
        timestamp: Date.now(),
        status: 'success',
        request: {
          model: agent.model,
          temperature: agent.temperature,
          prompt: this._buildFullPrompt(agent.promptTemplate, userPrompt),
        },
        response: {
          content: result.content,
          tokensUsed: result.tokensUsed,
          cost: this._calculateCost(agent.model, result.tokensUsed),
        },
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      return {
        id: uuidv4(),
        agentId: agent.id,
        agentName: agent.name,
        timestamp: Date.now(),
        status: 'error',
        request: {
          model: agent.model,
          temperature: agent.temperature,
          prompt: this._buildFullPrompt(agent.promptTemplate, userPrompt),
        },
        response: {
          content: `Error: ${error.message}`,
          tokensUsed: 0,
          cost: 0,
        },
        duration,
      };
    }
  }

  /**
   * Simulate AI execution with realistic delay and response
   */
  async _executeSimulated(agent, userPrompt) {
    // Simulate API delay (1-3 seconds)
    const delay = Math.random() * 2000 + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Get appropriate response template
    const templates = this._getResponseTemplate(agent.name);
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    // Simulate token usage based on response length
    const tokensUsed = Math.floor(randomTemplate.length / 4) + Math.floor(Math.random() * 500 + 200);

    return {
      content: randomTemplate,
      tokensUsed,
    };
  }

  /**
   * Execute real API call (OpenAI or Anthropic)
   */
  async _executeRealAPI(agent, userPrompt) {
    const modelInfo = AI_MODELS.find(m => m.id === agent.model);

    if (!modelInfo) {
      throw new Error('Invalid model specified');
    }

    if (modelInfo.provider === 'OpenAI') {
      return await this._callOpenAI(agent, userPrompt);
    } else if (modelInfo.provider === 'Anthropic') {
      return await this._callAnthropic(agent, userPrompt);
    }

    throw new Error('Unsupported AI provider');
  }

  /**
   * Call OpenAI API
   */
  async _callOpenAI(agent, userPrompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiKey}`,
      },
      body: JSON.stringify({
        model: agent.model,
        messages: [
          {
            role: 'system',
            content: agent.promptTemplate,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: agent.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      content: data.choices[0].message.content,
      tokensUsed: data.usage.total_tokens,
    };
  }

  /**
   * Call Anthropic Claude API
   */
  async _callAnthropic(agent, userPrompt) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: agent.model,
        max_tokens: 1024,
        temperature: agent.temperature,
        system: agent.promptTemplate,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      content: data.content[0].text,
      tokensUsed: data.usage.input_tokens + data.usage.output_tokens,
    };
  }

  /**
   * Build full prompt from template and user input
   */
  _buildFullPrompt(template, userPrompt) {
    return `${template}\n\nUser Input: ${userPrompt}`;
  }

  /**
   * Get response template based on agent name
   */
  _getResponseTemplate(agentName) {
    const name = agentName.toLowerCase();

    if (name.includes('email')) {
      return RESPONSE_TEMPLATES['email-summarizer'];
    } else if (name.includes('social') || name.includes('caption')) {
      return RESPONSE_TEMPLATES['social-caption'];
    } else if (name.includes('research')) {
      return RESPONSE_TEMPLATES['research-assistant'];
    }

    return RESPONSE_TEMPLATES['default'];
  }

  /**
   * Calculate cost based on model and tokens used
   */
  _calculateCost(modelId, tokensUsed) {
    const model = AI_MODELS.find(m => m.id === modelId);
    if (!model) return 0;

    return (tokensUsed / 1000) * model.costPer1kTokens;
  }

  /**
   * Check if valid API key exists for the model
   */
  _hasValidAPIKey(modelId) {
    const model = AI_MODELS.find(m => m.id === modelId);
    if (!model) return false;

    if (model.provider === 'OpenAI') {
      return !!this.openaiKey;
    } else if (model.provider === 'Anthropic') {
      return !!this.anthropicKey;
    }

    return false;
  }
}

export default new AIService();
