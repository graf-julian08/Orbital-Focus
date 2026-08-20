'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { GlassPanel } from './GlassPanel';
import { Play, Pause, Square, Coffee, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export function PomodoroTimer() {
    const {
        pomodoro: { isActive, mode, timeLeft },
        startPomodoro,
        pausePomodoro,
        resetPomodoro,
        tickPomodoro,
        setPomodoroMode,
    } = useStore();

    // Handle the countdown interval
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                tickPomodoro();
            }, 1000);
        } else if (timeLeft === 0) {
            // Timer finished! You could trigger a sound here
            pausePomodoro();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, tickPomodoro, pausePomodoro]);

    // Format MM:SS
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <GlassPanel className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[320px] max-w-[320px] sm:top-8 p-3 sm:p-4 pointer-events-auto z-20">
            <div className="flex flex-col items-center gap-2 sm:gap-4">

                {/* Mode Switcher */}
                <div className="flex gap-1 sm:gap-2 bg-white/5 p-1 rounded-full border border-white/5 w-full">
                    <button
                        onClick={() => setPomodoroMode('focus')}
                        className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-1 sm:py-1.5 px-2 sm:px-3 rounded-full text-[10px] sm:text-xs font-medium transition-all ${mode === 'focus' ? 'bg-amber-500/20 text-amber-500' : 'text-white/50 hover:text-white/80'
                            }`}
                    >
                        <Target size={12} className="sm:w-[14px] sm:h-[14px]" /> Focus
                    </button>
                    <button
                        onClick={() => setPomodoroMode('break')}
                        className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-1 sm:py-1.5 px-2 sm:px-3 rounded-full text-[10px] sm:text-xs font-medium transition-all ${mode === 'break' ? 'bg-blue-500/20 text-blue-500' : 'text-white/50 hover:text-white/80'
                            }`}
                    >
                        <Coffee size={12} className="sm:w-[14px] sm:h-[14px]" /> Break
                    </button>
                </div>

                {/* Timer Display */}
                <motion.div
                    key={mode}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-4xl sm:text-6xl font-black tracking-tighter tabular-nums ${mode === 'focus' ? 'text-white' : 'text-blue-100'
                        }`}
                >
                    {formatTime(timeLeft)}
                </motion.div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    {isActive ? (
                        <button
                            onClick={pausePomodoro}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all hover:scale-105 active:scale-95"
                        >
                            <Pause size={20} className="fill-current" />
                        </button>
                    ) : (
                        <button
                            onClick={startPomodoro}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:bg-white/90 border border-transparent transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            <Play size={20} className="fill-current ml-1" />
                        </button>
                    )}

                    <button
                        onClick={() => resetPomodoro()}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all active:scale-95"
                    >
                        <Square size={14} className="fill-current" />
                    </button>
                </div>

            </div>
        </GlassPanel>
    );
}
