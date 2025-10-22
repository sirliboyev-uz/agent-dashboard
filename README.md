# AI Agent Dashboard

A modern web application for AI agent management, configuration, and execution. Built with React, Vite, and TailwindCSS.

![AI Agent Dashboard](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan)

## Features

### Core Functionality
- **Agent Management**: Create, edit, and delete AI agents with custom configurations
- **Model Selection**: Support for GPT-4, GPT-3.5 Turbo, Claude 3 Opus, and Claude 3 Sonnet
- **Agent Execution**: Run individual agents or execute all agents sequentially
- **Simulated AI Responses**: Realistic mock responses with random delays (1-3s)
- **Optional Real API Integration**: Connect to OpenAI or Anthropic APIs via environment variables

### Dashboard & Analytics
- **Metrics Cards**: Real-time stats for total runs, success rate, cost, and performance
- **Interactive Charts**: Visualize agent runs over time with Recharts
- **Logs System**: Detailed execution logs with request/response inspection
- **Filtering & Search**: Filter logs by status and search by agent/model

### User Experience
- **Dark Theme**: Professional slate-based dark mode design
- **Responsive Layout**: Mobile-friendly with collapsible sidebar
- **Loading Animations**: Smooth loading states during agent execution
- **Form Validation**: Real-time validation for agent creation/editing
- **Export/Import**: JSON-based data backup and migration

### Sample Agents Included
1. **Email Summarizer** - Analyzes emails and extracts key points
2. **Social Caption Generator** - Creates engaging social media content
3. **Research Assistant** - Conducts thorough topic research

## Tech Stack

- **Frontend**: React 18 with hooks
- **Build Tool**: Vite 5
- **Styling**: TailwindCSS 3 with custom components
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Storage**: localStorage for persistence
- **UUID**: UUID generation for unique IDs

## Installation

### Prerequisites
- Node.js 16+ and npm/yarn

### Setup Steps

1. **Clone and navigate to the project**
   ```bash
   cd agent-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Optional: Configure real AI APIs**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API keys:
   ```env
   VITE_OPENAI_API_KEY=your_openai_key
   VITE_ANTHROPIC_API_KEY=your_anthropic_key
   VITE_USE_REAL_API=true  # Set to false for simulation mode
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## Usage

### Creating an Agent

1. Click **"Create Agent"** in the top bar
2. Fill in the form:
   - **Name**: Descriptive agent name
   - **Description**: What the agent does
   - **Model**: Choose AI model (affects cost simulation)
   - **Temperature**: Adjust creativity (0 = focused, 1 = creative)
   - **Prompt Template**: Define agent behavior and role
3. Click **"Create Agent"**

### Running Agents

- **Single Agent**: Click "Run Agent" button on any agent card
- **All Agents**: Click "Run All Agents" in the top bar
- **View Results**: Check the Logs tab for detailed execution data

### Managing Data

- **Export**: Click "Export Data" in sidebar to download JSON backup
- **Import**: Click "Import Data" to restore from JSON file
- **Clear**: All data is stored in localStorage (clear browser data to reset)

## Project Structure

```
agent-dashboard/
├── src/
│   ├── components/
│   │   ├── dashboard/        # Layout and dashboard components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   ├── MetricsCards.jsx
│   │   │   └── RunChart.jsx
│   │   ├── agents/           # Agent management components
│   │   │   ├── AgentCard.jsx
│   │   │   ├── AgentList.jsx
│   │   │   └── AgentModal.jsx
│   │   ├── logs/             # Logging components
│   │   │   ├── LogEntry.jsx
│   │   │   └── LogsPanel.jsx
│   │   └── common/           # Reusable components
│   │       ├── Button.jsx
│   │       └── LoadingAnimation.jsx
│   ├── services/             # Business logic
│   │   ├── aiService.js      # AI execution (mock + real API)
│   │   ├── storageService.js # localStorage wrapper
│   │   └── metricsService.js # Analytics calculations
│   ├── utils/                # Constants and helpers
│   │   ├── constants.js
│   │   └── sampleAgents.js
│   ├── App.jsx               # Main application component
│   ├── main.jsx              # React entry point
│   └── index.css             # TailwindCSS + custom styles
├── public/                   # Static assets
├── .env.example              # Environment variables template
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Configuration

### AI Models
Models are configured in `src/utils/constants.js`:
- GPT-4: $0.03/1k tokens
- GPT-3.5 Turbo: $0.002/1k tokens
- Claude 3 Opus: $0.015/1k tokens
- Claude 3 Sonnet: $0.003/1k tokens

### Temperature Range
- Min: 0 (focused, deterministic)
- Max: 1 (creative, random)
- Default: 0.7 (balanced)

### Storage Keys
Data is persisted in localStorage:
- `ai_dashboard_agents`: Agent configurations
- `ai_dashboard_logs`: Execution logs (max 100 entries)

## Simulated AI Behavior

In simulation mode (default), the dashboard:
- Generates realistic delays (1-3 seconds)
- Returns contextual responses based on agent name
- Calculates token usage based on response length
- Simulates costs using model pricing

## Real API Integration

To use real OpenAI or Anthropic APIs:

1. Set environment variables in `.env`
2. Set `VITE_USE_REAL_API=true`
3. Restart the dev server
4. Agent runs will call actual APIs

**Note**: Real API calls will incur actual costs.

## Deployment

### Build for Production
```bash
npm run build
```

The `dist/` folder contains production-ready files.

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

Or use the web UI to deploy the `dist/` folder.

## Performance

- **Lazy Loading**: Components load on demand
- **Optimized Rendering**: React memoization for expensive operations
- **Efficient Charts**: Recharts with responsive containers
- **LocalStorage**: Fast client-side persistence

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

### Adding New Models

Edit `src/utils/constants.js`:
```javascript
{
  id: 'new-model-id',
  name: 'Display Name',
  provider: 'Provider Name',
  costPer1kTokens: 0.01,
  maxTokens: 4096,
}
```

### Customizing Theme

Edit `tailwind.config.js` to modify colors, spacing, or animations.

## Roadmap

Potential enhancements for future versions:
- [ ] Agent scheduling and automation
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] API webhook integrations
- [ ] Custom model support
- [ ] Conversation history
- [ ] Agent templates library

## License

MIT License - Free to use for personal and commercial projects.

## Credits

Built with:
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)
