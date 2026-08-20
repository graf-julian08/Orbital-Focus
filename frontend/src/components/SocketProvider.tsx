'use client';

import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { useStore, Task } from '@/store/useStore';

export default function SocketProvider({ children }: { children: React.ReactNode }) {
    const addTask = useStore((state) => state.addTask);
    const updateTask = useStore((state) => state.updateTask);
    const removeTask = useStore((state) => state.removeTask);
    const setTasks = useStore((state) => state.setTasks);

    useEffect(() => {
        // Initial fetch from REST API
        const fetchTasks = async () => {
            try {
                // Backend runs on port 3001
                const res = await fetch('http://localhost:3001/api/tasks');
                if (res.ok) {
                    const data: Task[] = await res.json();
                    setTasks(data);
                }
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            }
        };
        fetchTasks();

        // Socket Event Listeners
        socket.on('connect', () => {
            console.log('🔗 Connected to Master Control Program (WebSocket)');
        });

        socket.on('disconnect', () => {
            console.log('🔌 Disconnected from Master Control Program');
        });

        socket.on('task-created', (task: Task) => {
            addTask(task);
        });

        socket.on('task-updated', (task: Task) => {
            updateTask(task.id, task);
        });

        socket.on('sync-task', (task: Task) => {
            updateTask(task.id, task);
        });

        socket.on('task-deleted', (taskId: string) => {
            removeTask(taskId);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('task-created');
            socket.off('task-updated');
            socket.off('sync-task');
            socket.off('task-deleted');
        };
    }, [addTask, updateTask, removeTask, setTasks]);

    return <>{children}</>;
}
