'use client';

import { useState } from 'react';
import { useStore, Task } from '@/store/useStore';
import { GlassPanel } from './GlassPanel';
import { Plus, Check, Loader2, Sparkles } from 'lucide-react';

export function TaskSidebar() {
    const tasks = useStore((state) => state.tasks);
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        setIsAdding(true);

        // Assign random orbital parameters for visual variety
        const randomDistance = Math.floor(Math.random() * (20 - 5 + 1) + 5);
        const randomSpeed = (Math.random() * (1.5 - 0.5) + 0.5).toFixed(2);
        const colors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#f472b6'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        try {
            await fetch('http://localhost:3001/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newTaskTitle,
                    status: 'todo',
                    distance: randomDistance,
                    speed: parseFloat(randomSpeed),
                    color: randomColor,
                    // userId will be fallback to the test user in the backend
                }),
            });

            setNewTaskTitle('');
        } catch (error) {
            console.error('Failed to create task:', error);
        } finally {
            setIsAdding(false);
        }
    };

    const handleMarkDone = async (task: Task) => {
        // In Step 6, this will trigger the Supernova effect in 3D too.
        // For now it updates the backend and via Socket, the Zustand state.
        try {
            await fetch(`http://localhost:3001/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'done' }),
            });
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    // Only show active tasks in the list
    const activeTasks = tasks.filter((t: Task) => t.status !== 'done');

    return (
        <GlassPanel className="absolute bottom-4 left-4 right-4 sm:bottom-auto sm:top-8 sm:left-8 sm:right-auto sm:w-[340px] h-[40vh] sm:h-[calc(100vh-64px)] flex flex-col pointer-events-auto z-20">
            <div className="p-3 sm:p-6 border-b border-white/5 flex items-center gap-2 sm:gap-3">
                <Sparkles className="text-amber-400" size={20} />
                <h2 className="text-lg font-bold text-white tracking-wide">Missions</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {activeTasks.length === 0 ? (
                    <div className="text-center text-white/40 text-sm mt-10">
                        No active missions. Add a task to create a planet!
                    </div>
                ) : (
                    activeTasks.map((task: Task) => (
                        <div
                            key={task.id}
                            className="group flex flex-col gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0 shadow-[0_0_10px_currentColor]"
                                        style={{ color: task.color, backgroundColor: task.color }}
                                    />
                                    <span className="text-white/90 text-sm font-medium truncate">
                                        {task.title}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleMarkDone(task)}
                                    title="Mark as Done"
                                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-6 h-6 rounded-full bg-white/10 hover:bg-green-500/20 hover:text-green-400 flex items-center justify-center text-white/50 transition-all"
                                >
                                    <Check size={12} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleAddTask} className="p-4 border-t border-white/5 bg-black/20">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Launch new task..."
                        disabled={isAdding}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isAdding || !newTaskTitle.trim()}
                        className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    </button>
                </div>
            </form>
        </GlassPanel>
    );
}
