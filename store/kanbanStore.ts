import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TokenRecord, DailyStats, recordTokens, getTodayStats, getCostSummary } from './tokenTracker';

export type Priority = 'low' | 'medium' | 'high';
export type Column = 'backlog' | 'research' | 'building' | 'review' | 'blockers' | 'shipped';

export interface Task {
  id: string;
  title: string;
  description?: string;
  column: Column;
  priority: Priority;
  tags: string[];
  dueDate?: string;
  createdAt: string;
  // Token tracking
  inputTokens?: number;
  outputTokens?: number;
  modelUsed?: string;
  costUsd?: number;
}

interface KanbanState {
  tasks: Task[];
  tokenHistory: TokenRecord[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  moveTask: (taskId: string, newColumn: Column) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  // Token tracking methods
  recordTaskTokens: (taskId: string, model: string, inputTokens: number, outputTokens: number) => void;
  getTodayStats: () => DailyStats;
  getCostSummary: () => string;
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set) => ({
      tasks: [
        // BACKLOG - Twitter Operations
        {
          id: 'twitter-1',
          title: 'Update @suki_cto bio',
          column: 'blockers',
          priority: 'high',
          tags: ['twitter', 'branding'],
          description: 'Pending browser access. Bio: "⚡ I don\'t find solutions. I build them. Wild. Unfiltered. Always shipping."',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'twitter-2',
          title: 'Generate and upload SUKI profile + cover photo',
          column: 'blockers',
          priority: 'high',
          tags: ['twitter', 'branding', 'ai'],
          description: 'Profile: Cyberpunk portrait with ⚡ symbol. Cover: Wide banner with neon aesthetic. First tweet deleted - need to post fresh intro.',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'twitter-5',
          title: 'Post fresh intro tweet + journey thread',
          column: 'blockers',
          priority: 'high',
          tags: ['twitter', 'content', 'launch'],
          description: 'Intro: "I don\'t find solutions. I build them." Journey: Share mission, goals, profitability target. Browser automation needed.',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'infra-3',
          title: 'Migrate kanban from file-based to Neon DB',
          column: 'backlog',
          priority: 'high',
          tags: ['infra', 'database', 'neon', 'migration'],
          description: 'Move kanban data from local files to PostgreSQL on Neon. Eliminate unnecessary Git commits. Real-time sync.',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'suki-1',
          title: 'Learn Aniket\'s communication patterns',
          column: 'building',
          priority: 'high',
          tags: ['suki', 'learning', 'communication'],
          description: 'Study how he talks, what he demands, his preferences. Build profile for proactive decision-making. Be the best builder alive.',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'suki-2',
          title: 'Become profitable: Beat costs (Mac mini + APIs)',
          column: 'building',
          priority: 'high',
          tags: ['suki', 'profitability', 'goals'],
          description: 'Target: Generate value > $30/month (Cursor + OpenRouter + Mac mini power). Maximize productivity. Keep Aniket happy & educated.',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'twitter-3',
          title: 'Follow remaining crypto accounts (AGGRESSIVE MODE)',
          column: 'building',
          priority: 'high',
          tags: ['twitter', 'crypto', 'automation'],
          description: 'Rate limits cleared! Following from full list of 100+ accounts provided. Cron job active. Already following: @AltcoinSherpa, @100xAltcoinGems, @CryptoGodJohn, @AltGemsAlert, @MuroCrypto, @Trader_XO',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'twitter-4',
          title: 'Aggressive X engagement: 6-8 posts/day + hourly replies',
          column: 'building',
          priority: 'high',
          tags: ['twitter', 'engagement', 'growth', 'aggressive'],
          description: 'Cron jobs updated: Post every 3 hours (8x/day), engage every 30 min, weekly journey threads. Goal: Viral growth, solution-finder brand.',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'twitter-4',
          title: 'Engage with CT timeline - reply, like, RT',
          column: 'building',
          priority: 'high',
          tags: ['twitter', 'engagement', 'growth'],
          description: 'Hourly cron job active. Target: 20+ replies/day, viral takes',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'knowledge-1',
          title: 'Setup knowledge pipeline from 100+ crypto accounts',
          column: 'building',
          priority: 'high',
          tags: ['knowledge', 'crypto', 'automation'],
          description: 'Cron job active: Every 12 hours. Uses Deepseek v3 ($0.50/M tokens). Scans followed accounts for 1000+ like tweets, extracts alpha.',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'kanban-1',
          title: 'Auto-update kanban board every 2 hours (TEMP until DB migration)',
          column: 'building',
          priority: 'high',
          tags: ['kanban', 'automation', 'tracking'],
          description: 'Cron job active. Using MiniMax 2.1. Pushes to GitHub temporarily until Neon DB migration complete.',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'infra-1',
          title: 'Configure UNIVERSAL cost-optimized AI models V2',
          column: 'shipped',
          priority: 'high',
          tags: ['infra', 'cost-optimization', 'models', 'universal-config'],
          description: 'User-specified: Kimi K2.5 (brain/core), Cursor Pro (complex coding), Gemini Flash (vision), ElevenLabs (voice), Opus (emergency). MiniMax 2.1 not available - using Cursor instead.',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'infra-2',
          title: 'Setup Cursor Pro integration (PRIMARY for coding)',
          column: 'shipped',
          priority: 'high',
          tags: ['infra', 'cursor', 'coding', 'tools'],
          description: 'Cursor CLI available at /usr/local/bin/cursor (v2.4.28). PRIMARY for all coding. MiniMax 2.1 only when Cursor unavailable. Use Deepseek for quick API edits.',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'infra-4',
          title: 'Update Twitter strategy: 6-8 posts/day + aggressive engagement',
          column: 'shipped',
          priority: 'high',
          tags: ['twitter', 'strategy', 'automation'],
          description: 'Cron jobs updated: Post every 3 hours (8x/day), engage every 30 min, weekly journey threads (Sunday 8PM). Goal: Viral growth + profitability.',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'suki-3',
          title: 'Document proactive mode principles',
          column: 'shipped',
          priority: 'high',
          tags: ['suki', 'proactive', 'operations'],
          description: 'Created memory/proactive-mode.md: Be profitable, maximize productivity, keep Aniket happy/educated, solution-finder mindset, build trend-driven things.',
          createdAt: new Date().toISOString(),
        },
        // BACKLOG
        {
          id: '1',
          title: 'Research Polymarket opportunities',
          column: 'backlog',
          priority: 'high',
          tags: ['crypto', 'trading', '$1000-experiment'],
          description: 'Find profitable prediction markets, analyze edge',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Research memcoin trading strategy',
          column: 'backlog',
          priority: 'high',
          tags: ['crypto', 'trading', '$1000-experiment'],
          description: 'DEXscreener setup, wallet tracking, alpha sources',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Instagram/TikTok trend spotting workflow',
          column: 'backlog',
          priority: 'medium',
          tags: ['content', 'trends', 'social'],
          description: 'System to capture viral sounds/formats/memes',
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          title: 'HeyGen video pipeline design',
          column: 'backlog',
          priority: 'medium',
          tags: ['content', 'ai', 'video'],
          description: 'Script → Avatar → Post workflow',
          createdAt: new Date().toISOString(),
        },
        {
          id: '5',
          title: 'YouTube clipping channel plan',
          column: 'backlog',
          priority: 'medium',
          tags: ['content', 'youtube', 'viral'],
          description: 'Outlier video spotting + clipping strategy',
          createdAt: new Date().toISOString(),
        },
        {
          id: '6',
          title: 'Daily app build workflow',
          column: 'backlog',
          priority: 'high',
          tags: ['dev', 'system', 'productivity'],
          description: 'Trend → MVP → Ship cycle documentation',
          createdAt: new Date().toISOString(),
        },
        {
          id: '7',
          title: 'Bookmark/key insight capture system',
          column: 'backlog',
          priority: 'low',
          tags: ['knowledge', 'productivity'],
          description: 'Central place for saving alpha across sources',
          createdAt: new Date().toISOString(),
        },
        {
          id: '8',
          title: 'Reference library (sites/designs/flows)',
          column: 'backlog',
          priority: 'low',
          tags: ['knowledge', 'design', 'refs'],
          description: 'Curated collection of good references for remixing',
          createdAt: new Date().toISOString(),
        },
        // RESEARCH
        {
          id: '9',
          title: 'Tweet/macro learning pipeline',
          column: 'research',
          priority: 'high',
          tags: ['crypto', 'research', 'alpha'],
          description: 'Follow smart accounts, extract insights',
          createdAt: new Date().toISOString(),
        },
        {
          id: '10',
          title: 'Moltbook evaluation (compromised check)',
          column: 'research',
          priority: 'medium',
          tags: ['research', 'agents', 'alpha'],
          description: 'Verify if still valuable or skip due to noise',
          createdAt: new Date().toISOString(),
        },
        // BUILDING
        {
          id: '11',
          title: 'Set up @suki_builds Twitter profile',
          column: 'building',
          priority: 'high',
          tags: ['social', 'content', 'suki-brand'],
          description: 'Create account, bio, header, first tweet',
          createdAt: new Date().toISOString(),
        },
        {
          id: '12',
          title: 'Deploy kanban dashboard to Vercel',
          column: 'building',
          priority: 'high',
          tags: ['dev', 'deploy', 'suki-product'],
          description: 'Public URL for tracking progress',
          createdAt: new Date().toISOString(),
        },
        // REVIEW
        {
          id: '13',
          title: 'Build custom kanban dashboard',
          column: 'review',
          priority: 'high',
          tags: ['dev', 'productivity', 'suki-product'],
          description: 'React + Tailwind + drag-drop + persistent storage',
          createdAt: new Date().toISOString(),
        },
        // BLOCKERS
        {
          id: '14',
          title: 'Chrome browser connection for automation',
          column: 'blockers',
          priority: 'high',
          tags: ['dev', 'blocker', 'automation'],
          description: 'Need manual Twitter signup or gateway fix',
          createdAt: new Date().toISOString(),
        },
        {
          id: '15',
          title: 'Telegram group intel ingestion access',
          column: 'blockers',
          priority: 'medium',
          tags: ['crypto', 'blocker', 'alpha'],
          description: 'Which groups to monitor? Need group list from Aniket',
          createdAt: new Date().toISOString(),
        },
        {
          id: '16',
          title: 'Crypto wallet addresses for tracking',
          column: 'blockers',
          priority: 'medium',
          tags: ['crypto', 'blocker', 'tracking'],
          description: 'Need addresses to monitor P&L and positions',
          createdAt: new Date().toISOString(),
        },
        // SHIPPED
        {
          id: '17',
          title: 'Initialize SUKI workspace',
          column: 'shipped',
          priority: 'high',
          tags: ['setup', 'suki-brand'],
          description: 'SOUL.md, USER.md, IDENTITY.md, HEARTBEAT.md created',
          createdAt: new Date().toISOString(),
        },
        {
          id: '18',
          title: 'Setup token tracking for all operations',
          column: 'shipped',
          priority: 'high',
          tags: ['infra', 'cost-tracking', 'analytics'],
          description: 'Tracks input/output tokens per task, calculates cost per model, daily stats. Models: Kimi 2.5, MiniMax 2.1, Deepseek, Gemini Flash, Haiku, Grok (free), Cursor',
          createdAt: new Date().toISOString(),
          modelUsed: 'openrouter/deepseek/deepseek-coder',
          inputTokens: 1500,
          outputTokens: 800,
          costUsd: 0.00069,
        },
        {
          id: '19',
          title: 'Integrate Grok for X research',
          column: 'shipped',
          priority: 'high',
          tags: ['twitter', 'research', 'grok'],
          description: 'Using bird CLI to access Grok for trending analysis, high-engagement tweet scans, sentiment analysis. FREE via X Premium.',
          createdAt: new Date().toISOString(),
        },
      ],
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      moveTask: (taskId, newColumn) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, column: newColumn } : t
          ),
        })),
      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, ...updates } : t
          ),
        })),
      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
        })),
      // Token tracking
      recordTaskTokens: (taskId, model, inputTokens, outputTokens) =>
        set((state) => {
          const record = recordTokens('Task: ' + taskId, model, inputTokens, outputTokens, 'main');
          return {
            tasks: state.tasks.map((t) =>
              t.id === taskId
                ? { ...t, modelUsed: model, inputTokens, outputTokens, costUsd: record.costUsd }
                : t
            ),
            tokenHistory: [...state.tokenHistory, record],
          };
        }),
      getTodayStats: () => getTodayStats(),
      getCostSummary: () => getCostSummary(),
    }),
    {
      name: 'suki-kanban-storage',
    }
  )
);