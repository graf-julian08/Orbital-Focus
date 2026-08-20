'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

interface OrbitProps {
    radius: number;
}

export function Orbit({ radius }: OrbitProps) {
    // Generate points for the circular orbit path
    const points = useMemo(() => {
        const pts: [number, number, number][] = [];
        const segments = 64;
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            pts.push([Math.cos(theta) * radius, 0, Math.sin(theta) * radius]);
        }
        return pts;
    }, [radius]);

    return (
        <Line
            points={points}
            color="#ffffff"
            lineWidth={1}
            transparent
            opacity={0.15}
        />
    );
}
