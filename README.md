# AI Agent Dashboard

A modern web application for AI agent management, configuration, and execution. Built with React, Vite, and TailwindCSS.

![AI Agent Dashboard](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan)

## Demo

Watch the full feature demonstration:

[📹 View Demo Video](./demo.mp4)

The demo showcases:
- Creating and managing AI agents
- Starting conversations with real-time streaming responses
- Multi-turn conversations with context awareness
- Agent marketplace and sharing features
- Dashboard analytics and metrics
- Export and data management

## Features

### Conversation & Chat
- **Multi-Turn Conversations**: Chat with agents using persistent conversation history
- **Real-Time Streaming**: Watch responses generate in real-time with streaming simulation
- **Conversation Management**: Create, search, rename, and delete conversations
- **Context Awareness**: Agents remember previous messages for coherent multi-turn discussions
- **Smart Organization**: Conversations grouped by date (Today, Yesterday, Last 7 Days, Older)
- **Export Conversations**: Download chat history as Markdown or JSON
- **Token & Cost Tracking**: Per-message and per-conversation usage statistics

### Agent Management
- **Create & Configure**: Build custom AI agents with specific roles and behaviors
- **Model Selection**: Support for GPT-4, GPT-3.5 Turbo, Claude 3 Opus, and Claude 3 Sonnet
- **Agent Execution**: Run individual agents or execute all agents sequentially
- **Agent Marketplace**: Browse and import 10 curated community agent templates
- **Agent Sharing**: Share agents via shareable codes or URLs
- **Simulated & Real APIs**: Toggle between simulation mode and real OpenAI/Anthropic APIs

### Dashboard & Analytics
- **Metrics Cards**: Real-time stats for total runs, success rate, cost, and performance
- **Interactive Charts**: Visualize agent runs over time with Recharts
- **Logs System**: Detailed execution logs with request/response inspection
- **Filtering & Search**: Filter logs by status and search by agent/model

### User Experience
- **Dark Theme**: Professional slate-based dark mode design
- **Responsive Layout**: Mobile-friendly interface with sidebar navigation
- **Real-Time Feedback**: Loading animations and streaming responses
- **Form Validation**: Real-time validation for agent creation/editing
- **Data Portability**: Export/import conversations, agents, and logs

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

### Starting a Conversation

1. Navigate to the **Chat** tab in the sidebar
2. Click **"New Conversation"** button
3. Select an agent from the modal
4. Type your message and press **Enter** (Shift+Enter for new line)
5. Watch the response stream in real-time
6. Continue the conversation - the agent remembers context

**Chat Features:**
- Edit conversation title by clicking the edit icon
- Export conversation as Markdown or JSON
- Search conversations in the sidebar
- Delete conversations with confirmation

### Creating an Agent

1. Click **"Create Agent"** in the top bar
2. Fill in the form:
   - **Name**: Descriptive agent name
   - **Description**: What the agent does
   - **Model**: Choose AI model (affects cost simulation)
   - **Temperature**: Adjust creativity (0 = focused, 1 = creative)
   - **Prompt Template**: Define agent behavior and role
3. Click **"Create Agent"**

### Using the Marketplace

1. Navigate to the **Marketplace** tab
2. Browse 10 curated community agent templates
3. Use search or category filters to find agents
4. Click **"Import Agent"** to add to your collection
5. Share your own agents using the Share button on agent cards

### Running Agents (One-Off)

- **Single Agent**: Click "Run Agent" button on any agent card
- **Provide Input**: Enter your prompt in the modal
- **View Results**: See the response in the result modal
- **Check Logs**: View detailed execution data in the Logs tab

### Managing Data

- **Export Conversations**: Click download icon in chat header
- **Export All Data**: Click "Export Data" in sidebar for full backup
- **Import Data**: Click "Import Data" to restore from JSON file
- **Share Agents**: Use share codes to exchange agent configurations

## Project Structure

```
agent-dashboard/
├── src/
│   ├── components/
│   │   ├── dashboard/           # Layout and dashboard components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   ├── MetricsCards.jsx
│   │   │   ├── RunChart.jsx
│   │   │   ├── SettingsPanel.jsx
│   │   │   └── MarketplacePanel.jsx
│   │   ├── agents/              # Agent management components
│   │   │   ├── AgentCard.jsx
│   │   │   ├── AgentList.jsx
│   │   │   ├── AgentModal.jsx
│   │   │   ├── RunAgentModal.jsx
│   │   │   ├── ResultModal.jsx
│   │   │   └── ShareModal.jsx
│   │   ├── chat/                # Conversation components
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── ConversationHistory.jsx
│   │   │   └── SelectAgentModal.jsx
│   │   ├── logs/                # Logging components
│   │   │   ├── LogEntry.jsx
│   │   │   └── LogsPanel.jsx
│   │   └── common/              # Reusable components
│   │       ├── Button.jsx
│   │       └── LoadingAnimation.jsx
│   ├── services/                # Business logic
│   │   ├── aiService.js         # AI execution with streaming
│   │   ├── storageService.js    # localStorage wrapper
│   │   ├── metricsService.js    # Analytics calculations
│   │   ├── conversationService.js # Conversation management
│   │   └── shareService.js      # Agent sharing/encoding
│   ├── utils/                   # Constants and helpers
│   │   ├── constants.js
│   │   ├── sampleAgents.js
│   │   └── marketplaceAgents.js
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # React entry point
│   └── index.css                # TailwindCSS + custom styles
├── public/                      # Static assets
├── .env.example                 # Environment variables template
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
- `ai_dashboard_conversations`: Chat conversations (max 50)
- `ai_dashboard_settings`: API keys and settings

### Conversation Limits
- **Max Conversations**: 50 (oldest auto-deleted)
- **Max Context Messages**: 20 (last messages sent to API)
- **Auto-Title**: Generated from first user message (50 chars max)

## Simulated AI Behavior

In simulation mode (default), the dashboard:
- Generates realistic delays (1-3 seconds)
- Simulates streaming responses with ~20 chunks
- Returns contextual responses based on agent name
- Calculates token usage based on response length
- Simulates costs using model pricing
- Maintains conversation context for multi-turn chats

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
