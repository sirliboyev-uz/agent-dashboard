# Quick Start Guide

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

## First Steps

1. **Explore Sample Agents**: Three pre-configured agents are loaded automatically
2. **Run an Agent**: Click "Run Agent" on any agent card to see simulated AI execution
3. **View Logs**: Check the Logs tab to see detailed execution results
4. **Create Your Own**: Click "Create Agent" to build a custom AI agent

## Key Features to Try

### Agent Management
- ✅ Create new agents with custom prompts
- ✅ Edit existing agents (hover over cards for edit/delete buttons)
- ✅ Delete unwanted agents
- ✅ Configure model selection and temperature

### Execution
- ✅ Run individual agents
- ✅ Run all agents at once with "Run All Agents"
- ✅ Watch loading animations during execution
- ✅ View realistic simulated delays (1-3 seconds)

### Analytics
- ✅ See real-time metrics in the Dashboard tab
- ✅ View runs over time in the chart
- ✅ Track success rates and costs
- ✅ Monitor average performance

### Data Management
- ✅ Export all data as JSON (Sidebar → Export Data)
- ✅ Import data from JSON backup (Sidebar → Import Data)
- ✅ All data persists in browser localStorage

## Sample Agents Included

### 1. Email Summarizer
- **Model**: GPT-3.5 Turbo
- **Temperature**: 0.3 (focused)
- **Purpose**: Extracts key points and action items from emails

### 2. Social Caption Generator
- **Model**: GPT-4
- **Temperature**: 0.8 (creative)
- **Purpose**: Creates engaging social media content

### 3. Research Assistant
- **Model**: Claude 3 Opus
- **Temperature**: 0.5 (balanced)
- **Purpose**: Conducts thorough topic research

## Optional: Real API Integration

To use real AI APIs instead of simulation:

1. Create `.env` file from template:
   ```bash
   cp .env.example .env
   ```

2. Add your API keys:
   ```env
   VITE_OPENAI_API_KEY=sk-...
   VITE_ANTHROPIC_API_KEY=sk-ant-...
   VITE_USE_REAL_API=true
   ```

3. Restart dev server:
   ```bash
   npm run dev
   ```

**Warning**: Real API calls will incur actual costs!

## Tips for Best Experience

- **Dark Mode**: The app uses a professional dark theme by default
- **Responsive**: Works on desktop, tablet, and mobile
- **No Backend Required**: Everything runs in the browser
- **Persistent Storage**: Data survives page refreshes
- **Export Regularly**: Back up your agent configurations

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
npm run dev
```

### Clear All Data
```bash
# Open browser console and run:
localStorage.clear()
# Then refresh the page
```

### Dependencies Issues
```bash
# Remove and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- Customize agent prompts for your use cases
- Experiment with different temperatures and models
- Export your agent configurations
- Build new features on top of the codebase
- Deploy to Vercel or Netlify for public access

---

Enjoy building with the AI Agent Dashboard!
