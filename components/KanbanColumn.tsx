'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';
import { Task } from '@/store/kanbanStore';

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

export default function KanbanColumn({ id, title, color, tasks }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="flex-shrink-0 w-80 flex flex-col bg-suki-card/50 border border-suki-border rounded-xl overflow-hidden h-full max-h-full"
    >
      <div className={`p-4 border-b-2 ${color} bg-suki-card`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">{title}</h3>
          <span className="text-xs text-zinc-500 bg-suki-dark px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="p-3 space-y-2 flex-1 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {tasks.map(task => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}