import { create } from 'zustand';

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: string; // "todo", "in_progress", "done"
    distance: number;
    speed: number;
    color: string;
    userId: string;
}

interface PomodoroState {
    isActive: boolean;
    mode: 'focus' | 'break';
    timeLeft: number; // in seconds
    duration: number; // initial duration in seconds
}

interface StoreState {
    // Task State
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    updateTask: (id: string, data: Partial<Task>) => void;
    removeTask: (id: string) => void;

    // Pomodoro State
    pomodoro: PomodoroState;
    startPomodoro: () => void;
    pausePomodoro: () => void;
    resetPomodoro: (duration?: number) => void;
    tickPomodoro: () => void;
    setPomodoroMode: (mode: 'focus' | 'break') => void;
}

const DEFAULT_FOCUS_TIME = 25 * 60; // 25 minutes

export const useStore = create<StoreState>((set) => ({
    // --- Tasks ---
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
    updateTask: (id, data) =>
        set((state) => ({
            tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),
    removeTask: (id) =>
        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
        })),

    // --- Pomodoro ---
    pomodoro: {
        isActive: false,
        mode: 'focus',
        timeLeft: DEFAULT_FOCUS_TIME,
        duration: DEFAULT_FOCUS_TIME,
    },
    startPomodoro: () => set((state) => ({
        pomodoro: { ...state.pomodoro, isActive: true },
    })),
    pausePomodoro: () => set((state) => ({
        pomodoro: { ...state.pomodoro, isActive: false },
    })),
    resetPomodoro: (newDuration) => set((state) => {
        const duration = newDuration ?? state.pomodoro.duration;
        return {
            pomodoro: {
                ...state.pomodoro,
                isActive: false,
                timeLeft: duration,
                duration,
            },
        };
    }),
    tickPomodoro: () => set((state) => {
        if (!state.pomodoro.isActive || state.pomodoro.timeLeft <= 0) return state;
        return {
            pomodoro: {
                ...state.pomodoro,
                timeLeft: state.pomodoro.timeLeft - 1,
            },
        };
    }),
    setPomodoroMode: (mode) => set((state) => {
        const duration = mode === 'focus' ? DEFAULT_FOCUS_TIME : 5 * 60; // 5 min break
        return {
            pomodoro: {
                ...state.pomodoro,
                mode,
                duration,
                timeLeft: duration,
                isActive: false,
            },
        };
    }),
}));
