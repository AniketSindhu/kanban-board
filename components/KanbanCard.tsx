'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Tag } from 'lucide-react';
import { Task } from '@/store/kanbanStore';

interface KanbanCardProps {
  task: Task;
  isOverlay?: boolean;
}

const priorityColors = {
  low: 'bg-zinc-600',
  medium: 'bg-yellow-600',
  high: 'bg-red-600',
};

export default function KanbanCard({ task, isOverlay }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`bg-suki-card border border-suki-border rounded-lg p-3 hover:border-indigo-500/50 transition-all cursor-grab active:cursor-grabbing ${
        isOverlay ? 'shadow-2xl ring-2 ring-indigo-500 rotate-2' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm text-zinc-200 font-medium leading-tight">
            {task.title}
          </h4>
          
          {task.description && (
            <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-3 mt-3">
            <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
            
            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <Calendar size={12} />
                {task.dueDate}
              </div>
            )}
            
            {task.tags.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <Tag size={12} />
                {task.tags.length}
              </div>
            )}
          </div>
          
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}