import { create } from 'zustand';
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
  inputTokens?: number;
  outputTokens?: number;
  modelUsed?: string;
  costUsd?: number;
}

// API functions for Neon DB
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

async function fetchTasks(): Promise<Task[]> {
  try {
    const res = await fetch(`${API_URL}/tasks`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    // Transform DB format to frontend format
    return data.map((t: any) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      column: t.column_name as Column,
      priority: t.priority as Priority,
      tags: t.tags || [],
      dueDate: t.due_date,
      createdAt: t.created_at,
      inputTokens: t.input_tokens,
      outputTokens: t.output_tokens,
      modelUsed: t.model_used,
      costUsd: parseFloat(t.cost_usd)
    }));
  } catch (error) {
    console.warn('Neon DB unavailable:', error);
    return [];
  }
}

async function createTaskAPI(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: task.title,
      description: task.description,
      column: task.column,
      priority: task.priority,
      tags: task.tags,
      dueDate: task.dueDate,
      inputTokens: task.inputTokens || 0,
      outputTokens: task.outputTokens || 0,
      modelUsed: task.modelUsed || '',
      costUsd: task.costUsd || 0
    }),
  });
  const data = await res.json();
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    column: data.column_name,
    priority: data.priority,
    tags: data.tags || [],
    dueDate: data.due_date,
    createdAt: data.created_at,
    inputTokens: data.input_tokens,
    outputTokens: data.output_tokens,
    modelUsed: data.model_used,
    costUsd: parseFloat(data.cost_usd)
  };
}

async function updateTaskAPI(id: string, updates: Partial<Task>): Promise<void> {
  await fetch(`${API_URL}/tasks`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      id, 
      ...updates,
      column: updates.column,
      priority: updates.priority,
      tags: updates.tags,
      dueDate: updates.dueDate,
      inputTokens: updates.inputTokens,
      outputTokens: updates.outputTokens,
      modelUsed: updates.modelUsed,
      costUsd: updates.costUsd
    }),
  });
}

async function deleteTaskAPI(id: string): Promise<void> {
  await fetch(`${API_URL}/tasks`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
}

interface KanbanState {
  tasks: Task[];
  tokenHistory: TokenRecord[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  moveTask: (taskId: string, newColumn: Column) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  loadTasks: () => Promise<void>;
  recordTaskTokens: (taskId: string, model: string, inputTokens: number, outputTokens: number) => void;
  getTodayStats: () => DailyStats;
  getCostSummary: () => string;
}

// Fallback initial tasks if DB is empty
const fallbackTasks: Task[] = [
  {
    id: '1',
    title: 'Welcome to SUKI Kanban',
    column: 'backlog',
    priority: 'medium',
    tags: ['welcome'],
    description: 'This kanban board syncs with Neon PostgreSQL database. Add tasks and they persist!',
    createdAt: new Date().toISOString(),
  }
];

export const useKanbanStore = create<KanbanState>()((set, get) => ({
  tasks: [],
  tokenHistory: [],
  isLoading: false,
  error: null,

  loadTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await fetchTasks();
      if (tasks.length === 0) {
        // Use fallback if DB is empty
        set({ tasks: fallbackTasks, isLoading: false });
      } else {
        set({ tasks, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
      set({ tasks: fallbackTasks, isLoading: false, error: 'Using local data' });
    }
  },

  addTask: async (task) => {
    try {
      const newTask = await createTaskAPI(task);
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    } catch (error) {
      console.error('Failed to create task:', error);
      // Fallback: add locally
      const fallbackTask = {
        ...task,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      set((state) => ({ tasks: [...state.tasks, fallbackTask] }));
    }
  },

  moveTask: async (taskId, newColumn) => {
    try {
      await updateTaskAPI(taskId, { column: newColumn });
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, column: newColumn } : t
        ),
      }));
    } catch (error) {
      console.error('Failed to move task:', error);
      // Update locally anyway
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, column: newColumn } : t
        ),
      }));
    }
  },

  updateTask: async (taskId, updates) => {
    try {
      await updateTaskAPI(taskId, updates);
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, ...updates } : t
        ),
      }));
    } catch (error) {
      console.error('Failed to update task:', error);
      // Update locally anyway
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, ...updates } : t
        ),
      }));
    }
  },

  deleteTask: async (taskId) => {
    try {
      await deleteTaskAPI(taskId);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
      }));
    } catch (error) {
      console.error('Failed to delete task:', error);
      // Delete locally anyway
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
      }));
    }
  },

  recordTaskTokens: (taskId, model, inputTokens, outputTokens) => {
    const record = recordTokens('Task: ' + taskId, model, inputTokens, outputTokens, 'main');
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, modelUsed: model, inputTokens, outputTokens, costUsd: record.costUsd }
          : t
      ),
      tokenHistory: [...state.tokenHistory, record],
    }));
  },

  getTodayStats: () => getTodayStats(),
  getCostSummary: () => getCostSummary(),
}));

// Auto-load tasks on client side
if (typeof window !== 'undefined') {
  useKanbanStore.getState().loadTasks();
}