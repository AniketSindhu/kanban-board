'use client';

import KanbanBoard from '@/components/KanbanBoard';

export default function Home() {
  return (
    <main className="min-h-screen h-screen flex flex-col p-4">
      <header className="mb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-indigo-500">⚡</span>
              SUKI Command Center
            </h1>
            <p className="text-zinc-400 mt-1 text-sm">Build. Ship. Dominate.</p>
          </div>
          <div className="flex gap-3 text-sm">
            <div className="bg-suki-card border border-suki-border rounded-lg px-3 py-1.5">
              <span className="text-zinc-400">Shipped Today:</span>
              <span className="text-green-400 font-bold ml-2">0</span>
            </div>
            <div className="bg-suki-card border border-suki-border rounded-lg px-3 py-1.5">
              <span className="text-zinc-400">Crypto P&L:</span>
              <span className="text-zinc-300 font-bold ml-2">--</span>
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1 min-h-0 overflow-hidden">
        <KanbanBoard />
      </div>
    </main>
  );
}