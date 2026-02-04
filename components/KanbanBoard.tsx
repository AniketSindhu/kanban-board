'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { useKanbanStore, Column } from '@/store/kanbanStore';

const columns = [
  { id: 'backlog', title: '🔥 Backlog', color: 'border-zinc-500' },
  { id: 'research', title: '🔍 Research', color: 'border-blue-500' },
  { id: 'building', title: '⚡ Building', color: 'border-yellow-500' },
  { id: 'review', title: '👀 Review', color: 'border-purple-500' },
  { id: 'blockers', title: '🚨 Blockers', color: 'border-red-500' },
  { id: 'shipped', title: '🚀 Shipped', color: 'border-green-500' },
];

export default function KanbanBoard() {
  const { tasks, addTask, moveTask } = useKanbanStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const overColumn = columns.find(c => c.id === overId);
    if (overColumn) {
      moveTask(taskId, overColumn.id as Column);
    }

    setActiveId(null);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle,
      column: 'backlog',
      priority: 'medium',
      tags: [],
    });
    setNewTaskTitle('');
    setShowInput(false);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 h-full overflow-x-auto modern-scrollbar" style={{ paddingBottom: '12px' }}>
        {columns.map(column => (
          <SortableContext key={column.id} items={tasks.filter(t => t.column === column.id).map(t => t.id)}>
            <KanbanColumn
              id={column.id}
              title={column.title}
              color={column.color}
              tasks={tasks.filter(t => t.column === column.id)}
            />
          </SortableContext>
        ))}
        
        <div className="flex-shrink-0 w-80">
          {!showInput ? (
            <button
              onClick={() => setShowInput(true)}
              className="w-full p-3 border-2 border-dashed border-suki-border rounded-xl text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Task
            </button>
          ) : (
            <div className="bg-suki-card border border-suki-border rounded-xl p-3">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                placeholder="What are we building?"
                className="w-full bg-transparent text-white placeholder-zinc-500 outline-none"
                autoFocus
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleAddTask}
                  className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-500"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowInput(false)}
                  className="px-3 py-1 text-zinc-400 hover:text-zinc-200 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <KanbanCard task={tasks.find(t => t.id === activeId)!} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}