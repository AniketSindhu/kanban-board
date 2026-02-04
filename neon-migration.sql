-- Neon DB Migration for SUKI Kanban
-- Run this in your Neon SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tasks table (migrates from kanban/store/kanbanStore.ts)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    column_name VARCHAR(50) NOT NULL CHECK (column_name IN ('backlog', 'research', 'building', 'review', 'blockers', 'shipped')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    tags TEXT[], -- Array of strings
    due_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    -- Token tracking fields
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    model_used VARCHAR(100),
    cost_usd DECIMAL(10, 6) DEFAULT 0
);

-- Token history table for analytics
CREATE TABLE IF NOT EXISTS token_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    model VARCHAR(100) NOT NULL,
    input_tokens INTEGER NOT NULL,
    output_tokens INTEGER NOT NULL,
    cost_usd DECIMAL(10, 6) NOT NULL,
    session_type VARCHAR(20) CHECK (session_type IN ('main', 'isolated'))
);

-- Daily stats view
CREATE OR REPLACE VIEW daily_stats AS
SELECT 
    DATE(timestamp) as date,
    COUNT(*) as task_count,
    SUM(input_tokens) as total_input_tokens,
    SUM(output_tokens) as total_output_tokens,
    SUM(cost_usd) as total_cost_usd
FROM token_history
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_column ON tasks(column_name);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_token_history_date ON token_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_token_history_task ON token_history(task_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Migrate existing data (optional - if you want to keep current tasks)
-- INSERT INTO tasks (title, description, column_name, priority, tags, created_at)
-- VALUES 
--   ('Initialize SUKI workspace', 'SOUL.md, USER.md created', 'shipped', 'high', ARRAY['setup'], NOW()),
--   ('Setup Twitter account', '@suki_cto created', 'shipped', 'high', ARRAY['twitter'], NOW());
