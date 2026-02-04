// Token Tracker for SUKI Operations
// Tracks input/output tokens and costs across all operations

export interface TokenRecord {
  id: string;
  timestamp: string;
  task: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  session: 'main' | 'isolated';
}

export interface DailyStats {
  date: string;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCostUsd: number;
  taskCount: number;
}

// Model pricing (per 1M tokens)
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'openrouter/moonshotai/kimi-k2.5': { input: 0.80, output: 0.80 },
  'openrouter/minimax/minimax-01': { input: 0.90, output: 0.90 }, // MiniMax 2.1
  'openrouter/deepseek/deepseek-coder': { input: 0.30, output: 0.30 },
  'openrouter/deepseek/deepseek-chat': { input: 0.50, output: 0.50 },
  'openrouter/google/gemini-2.0-flash-exp': { input: 0.15, output: 0.60 },
  'openrouter/anthropic/claude-3-haiku': { input: 0.25, output: 1.25 },
  'openrouter/anthropic/claude-3-opus': { input: 15.00, output: 75.00 },
  'grok': { input: 0, output: 0 }, // Free via bird
  'cursor': { input: 0, output: 0 }, // Flat $20/mo
};

export function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = MODEL_PRICING[model];
  if (!pricing) return 0;
  
  const inputCost = (inputTokens / 1000000) * pricing.input;
  const outputCost = (outputTokens / 1000000) * pricing.output;
  return inputCost + outputCost;
}

export function formatCost(costUsd: number): string {
  if (costUsd < 0.01) return '<$0.01';
  return `$${costUsd.toFixed(3)}`;
}

// In-memory storage (will persist via localStorage in browser)
let tokenHistory: TokenRecord[] = [];

export function recordTokens(
  task: string,
  model: string,
  inputTokens: number,
  outputTokens: number,
  session: 'main' | 'isolated' = 'main'
): TokenRecord {
  const costUsd = calculateCost(model, inputTokens, outputTokens);
  
  const record: TokenRecord = {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    task,
    model,
    inputTokens,
    outputTokens,
    costUsd,
    session,
  };
  
  tokenHistory.push(record);
  
  // Keep only last 1000 records
  if (tokenHistory.length > 1000) {
    tokenHistory = tokenHistory.slice(-1000);
  }
  
  return record;
}

export function getTodayStats(): DailyStats {
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = tokenHistory.filter(r => r.timestamp.startsWith(today));
  
  return {
    date: today,
    totalInputTokens: todayRecords.reduce((sum, r) => sum + r.inputTokens, 0),
    totalOutputTokens: todayRecords.reduce((sum, r) => sum + r.outputTokens, 0),
    totalCostUsd: todayRecords.reduce((sum, r) => sum + r.costUsd, 0),
    taskCount: todayRecords.length,
  };
}

export function getTokenHistory(): TokenRecord[] {
  return [...tokenHistory];
}

// For display in kanban
export function getCostSummary(): string {
  const today = getTodayStats();
  return `Today: ${today.taskCount} tasks | ${today.totalInputTokens + today.totalOutputTokens} tokens | ${formatCost(today.totalCostUsd)}`;
}
