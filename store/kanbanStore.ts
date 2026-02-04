import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
}

interface KanbanState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  moveTask: (taskId: string, newColumn: Column) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set) => ({
      tasks: [
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
    }),
    {
      name: 'suki-kanban-storage',
    }
  )
);