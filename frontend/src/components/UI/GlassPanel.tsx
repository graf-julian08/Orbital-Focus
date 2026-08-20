'use client';

import { HTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassPanelProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
    className?: string;
}

export function GlassPanel({ children, className = '', ...props }: GlassPanelProps) {
    return (
        <motion.div
            className={`bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
