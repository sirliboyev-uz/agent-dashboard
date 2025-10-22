// AI Models available in the system
export const AI_MODELS = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    costPer1kTokens: 0.03,
    maxTokens: 8192,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    costPer1kTokens: 0.002,
    maxTokens: 4096,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    costPer1kTokens: 0.015,
    maxTokens: 4096,
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    costPer1kTokens: 0.003,
    maxTokens: 4096,
  },
];

// Storage keys for localStorage
export const STORAGE_KEYS = {
  AGENTS: 'ai_dashboard_agents',
  LOGS: 'ai_dashboard_logs',
};

// Agent status constants
export const AGENT_STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  SUCCESS: 'success',
  ERROR: 'error',
};

// Default temperature range
export const TEMPERATURE_RANGE = {
  MIN: 0,
  MAX: 1,
  DEFAULT: 0.7,
  STEP: 0.1,
};

// Simulated response templates
export const RESPONSE_TEMPLATES = {
  'email-summarizer': [
    'Here\'s a concise summary of the email:\n\nKey points:\n- Main topic discussed\n- Action items identified\n- Important deadlines mentioned\n\nRecommended next steps: Review and respond to priority items.',
    'Email Summary:\n\nSubject: Project Update\nPriority: Medium\n\nThe email discusses project milestones and upcoming deliverables. Three main action items require attention by next week.',
  ],
  'social-caption': [
    '✨ Perfect caption for your post:\n\n"Embracing new challenges and opportunities. Every step forward is a step toward growth. #Motivation #Growth #Success"\n\nAlternate option: "Making things happen, one day at a time. 🚀"',
    '📱 Social Media Caption:\n\n"Innovation meets execution. Here\'s what we\'re building next... Stay tuned! 💡 #TechLife #Innovation"\n\nBest posting time: 2-4 PM for maximum engagement.',
  ],
  'research-assistant': [
    'Research Findings:\n\n📊 Topic: [Analyzed Topic]\n\nKey Insights:\n1. Primary finding with supporting evidence\n2. Secondary observation with data points\n3. Emerging trends and patterns\n\nSources: Analyzed multiple credible sources\nConfidence: High',
    'Research Summary:\n\nMain Question: [User Query]\n\nFindings:\n- Statistical data shows significant correlation\n- Expert opinions align with hypothesis\n- Recent studies support conclusion\n\nRecommendation: Further investigation recommended in specific areas.',
  ],
  'default': [
    'Task completed successfully. Here are the results based on your request:\n\n✓ Analysis complete\n✓ Key points identified\n✓ Recommendations generated\n\nPlease review and let me know if you need any adjustments.',
    'Response generated successfully:\n\nI\'ve processed your request and here\'s what I found:\n\n- Primary insight from analysis\n- Supporting details and context\n- Actionable next steps\n\nFeel free to refine the prompt for more specific results.',
  ],
};
