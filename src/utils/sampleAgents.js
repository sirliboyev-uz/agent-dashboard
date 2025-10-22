import { v4 as uuidv4 } from 'uuid';

/**
 * Sample agents to demonstrate the dashboard functionality
 */
export const sampleAgents = [
  {
    id: uuidv4(),
    name: 'Email Summarizer',
    description: 'Analyzes and summarizes emails, extracting key points and action items.',
    model: 'gpt-3.5-turbo',
    promptTemplate: 'You are an expert email analyst. Your task is to read emails and provide concise summaries highlighting key points, action items, and important deadlines. Keep summaries under 150 words.',
    temperature: 0.3,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    stats: {
      totalRuns: 0,
      successRate: 0,
      avgCost: 0,
      lastRun: null,
    },
  },
  {
    id: uuidv4(),
    name: 'Social Caption Generator',
    description: 'Creates engaging social media captions with relevant hashtags and emoji.',
    model: 'gpt-4',
    promptTemplate: 'You are a creative social media expert. Generate engaging, platform-appropriate captions with relevant hashtags and emoji. Keep captions conversational and authentic. Provide 1-2 caption options.',
    temperature: 0.8,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    stats: {
      totalRuns: 0,
      successRate: 0,
      avgCost: 0,
      lastRun: null,
    },
  },
  {
    id: uuidv4(),
    name: 'Research Assistant',
    description: 'Conducts thorough research on topics and provides comprehensive summaries.',
    model: 'claude-3-opus',
    promptTemplate: 'You are a meticulous research assistant. Analyze topics in depth, provide key findings, cite patterns, and offer well-reasoned conclusions. Structure your response with clear sections: Overview, Key Findings, and Recommendations.',
    temperature: 0.5,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    stats: {
      totalRuns: 0,
      successRate: 0,
      avgCost: 0,
      lastRun: null,
    },
  },
];

/**
 * Get default agent template for creating new agents
 */
export const getDefaultAgent = () => ({
  id: uuidv4(),
  name: '',
  description: '',
  model: 'gpt-3.5-turbo',
  promptTemplate: 'You are a helpful AI assistant. Please assist the user with their request.',
  temperature: 0.7,
  createdAt: Date.now(),
  stats: {
    totalRuns: 0,
    successRate: 0,
    avgCost: 0,
    lastRun: null,
  },
});
