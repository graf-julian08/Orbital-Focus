'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SupernovaProps {
    position: THREE.Vector3;
    color: string;
}

export function Supernova({ position, color }: SupernovaProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.PointsMaterial>(null);

    const particleCount = 200;

    // Generate random velocities (directions) for each particle starting from center
    const { positions, velocities } = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const vel = [];

        for (let i = 0; i < particleCount; i++) {
            // Start all particles at the explosion center
            pos[i * 3] = position.x;
            pos[i * 3 + 1] = position.y;
            pos[i * 3 + 2] = position.z;

            // Random spherical direction
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const speed = Math.random() * 0.1 + 0.05;

            vel.push(new THREE.Vector3(
                Math.sin(phi) * Math.cos(theta) * speed,
                Math.sin(phi) * Math.sin(theta) * speed,
                Math.cos(phi) * speed
            ));
        }

        return { positions: pos, velocities: vel };
    }, [position, particleCount]);

    useFrame(() => {
        if (!pointsRef.current || !materialRef.current) return;

        const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

        // Move particles outward radially
        for (let i = 0; i < particleCount; i++) {
            positionsArray[i * 3] += velocities[i].x;
            positionsArray[i * 3 + 1] += velocities[i].y;
            positionsArray[i * 3 + 2] += velocities[i].z;

            // Add simple drag/slowdown
            velocities[i].multiplyScalar(0.95);
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        // Fade out over time
        if (materialRef.current.opacity > 0) {
            materialRef.current.opacity -= 0.015;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                    count={particleCount}
                />
            </bufferGeometry>
            <pointsMaterial
                ref={materialRef}
                size={0.15}
                color={color}
                transparent
                opacity={1}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
