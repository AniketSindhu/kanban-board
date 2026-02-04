import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const task = await request.json();
    const result = await pool.query(
      `INSERT INTO tasks (title, description, column_name, priority, tags, due_date, input_tokens, output_tokens, model_used, cost_usd)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [task.title, task.description, task.column, task.priority, task.tags, task.dueDate, 
       task.inputTokens || 0, task.outputTokens || 0, task.modelUsed || '', task.costUsd || 0]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    const result = await pool.query(
      `UPDATE tasks 
       SET title = $1, description = $2, column_name = $3, priority = $4, tags = $5, 
           updated_at = NOW(), input_tokens = $6, output_tokens = $7, model_used = $8, cost_usd = $9
       WHERE id = $10
       RETURNING *`,
      [updates.title, updates.description, updates.column, updates.priority, updates.tags,
       updates.inputTokens || 0, updates.outputTokens || 0, updates.modelUsed || '', updates.costUsd || 0, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}