# Neon DB Migration Script for Kanban
# Run this to migrate existing localStorage data to Neon PostgreSQL

import { Pool } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_FlWOq9ipbc6A@ep-ancient-truth-aijpfn2l-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({ connectionString: DATABASE_URL });

// Sample initial data (replace with your actual localStorage export)
const initialTasks = [
  {
    title: 'Initialize SUKI workspace',
    description: 'SOUL.md, USER.md, IDENTITY.md created',
    column_name: 'shipped',
    priority: 'high',
    tags: ['setup', 'suki-brand'],
    input_tokens: 1500,
    output_tokens: 800,
    model_used: 'openrouter/moonshotai/kimi-k2.5',
    cost_usd: 0.00184
  },
  {
    title: 'Setup token tracking',
    description: 'Tracks tokens per task, calculates cost',
    column_name: 'shipped', 
    priority: 'high',
    tags: ['infra', 'cost-tracking'],
    input_tokens: 1200,
    output_tokens: 600,
    model_used: 'openrouter/deepseek/deepseek-coder',
    cost_usd: 0.00054
  },
  {
    title: 'Deploy kanban dashboard',
    description: 'Public URL for tracking progress',
    column_name: 'shipped',
    priority: 'high',
    tags: ['dev', 'deploy', 'suki-product'],
    input_tokens: 800,
    output_tokens: 400,
    model_used: 'openrouter/moonshotai/kimi-k2.5',
    cost_usd: 0.00096
  }
];

async function migrate() {
  console.log('Migrating tasks to Neon DB...');
  
  for (const task of initialTasks) {
    try {
      await pool.query(
        `INSERT INTO tasks (title, description, column_name, priority, tags, input_tokens, output_tokens, model_used, cost_usd, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
        [task.title, task.description, task.column_name, task.priority, task.tags, 
         task.input_tokens, task.output_tokens, task.model_used, task.cost_usd]
      );
      console.log(`✓ Migrated: ${task.title}`);
    } catch (error) {
      console.error(`✗ Failed: ${task.title}`, error);
    }
  }
  
  console.log('Migration complete!');
  process.exit(0);
}

migrate();