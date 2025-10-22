import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';
import { AI_MODELS, TEMPERATURE_RANGE } from '../../utils/constants';

export default function AgentModal({ isOpen, onClose, onSave, agent = null }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    model: 'gpt-3.5-turbo',
    promptTemplate: '',
    temperature: TEMPERATURE_RANGE.DEFAULT,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        description: agent.description,
        model: agent.model,
        promptTemplate: agent.promptTemplate,
        temperature: agent.temperature,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        model: 'gpt-3.5-turbo',
        promptTemplate: 'You are a helpful AI assistant. Please assist the user with their request.',
        temperature: TEMPERATURE_RANGE.DEFAULT,
      });
    }
    setErrors({});
  }, [agent, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Agent name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.promptTemplate.trim()) {
      newErrors.promptTemplate = 'Prompt template is required';
    }

    if (formData.temperature < TEMPERATURE_RANGE.MIN || formData.temperature > TEMPERATURE_RANGE.MAX) {
      newErrors.temperature = `Temperature must be between ${TEMPERATURE_RANGE.MIN} and ${TEMPERATURE_RANGE.MAX}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">
            {agent ? 'Edit Agent' : 'Create New Agent'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              Agent Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`input w-full ${errors.name ? 'border-red-500' : ''}`}
              placeholder="e.g., Email Summarizer"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`textarea w-full ${errors.description ? 'border-red-500' : ''}`}
              rows={3}
              placeholder="Describe what this agent does..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              AI Model *
            </label>
            <select
              value={formData.model}
              onChange={(e) => handleChange('model', e.target.value)}
              className="input w-full"
            >
              {AI_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.provider}) - ${model.costPer1kTokens}/1k tokens
                </option>
              ))}
            </select>
          </div>

          {/* Temperature */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              Temperature: {formData.temperature}
            </label>
            <input
              type="range"
              min={TEMPERATURE_RANGE.MIN}
              max={TEMPERATURE_RANGE.MAX}
              step={TEMPERATURE_RANGE.STEP}
              value={formData.temperature}
              onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Focused (0)</span>
              <span>Balanced (0.5)</span>
              <span>Creative (1)</span>
            </div>
            {errors.temperature && (
              <p className="text-red-500 text-sm mt-1">{errors.temperature}</p>
            )}
          </div>

          {/* Prompt Template */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              System Prompt Template *
            </label>
            <textarea
              value={formData.promptTemplate}
              onChange={(e) => handleChange('promptTemplate', e.target.value)}
              className={`textarea w-full ${errors.promptTemplate ? 'border-red-500' : ''}`}
              rows={6}
              placeholder="You are a helpful assistant that..."
            />
            {errors.promptTemplate && (
              <p className="text-red-500 text-sm mt-1">{errors.promptTemplate}</p>
            )}
            <p className="text-slate-500 text-xs mt-2">
              This is the system prompt that defines the agent's behavior and role.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {agent ? 'Save Changes' : 'Create Agent'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
