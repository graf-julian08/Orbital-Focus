'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/store/useStore';
import * as THREE from 'three';
import { MeshDistortMaterial } from '@react-three/drei';

export function Sun() {
    const groupRef = useRef<THREE.Group>(null);
    const materialRef = useRef<any>(null);

    const isActive = useStore((state) => state.pomodoro.isActive);
    const mode = useStore((state) => state.pomodoro.mode);

    useFrame((state) => {
        if (groupRef.current) {
            // Slow rotation for the entire star system core
            groupRef.current.rotation.y += 0.005;
            groupRef.current.rotation.x += 0.002;

            // Pulsating scale effect over the whole group
            const scaleBase = 1.0;
            const pulse = isActive ? Math.sin(state.clock.elapsedTime * 2) * 0.03 : 0;
            groupRef.current.scale.setScalar(scaleBase + pulse);
        }
    });

    // Color definitions
    const sunColor = mode === 'focus' ? '#f59e0b' : '#3b82f6';
    const coreColor = mode === 'focus' ? '#fef3c7' : '#dbeafe'; // Very bright inner core

    return (
        <group ref={groupRef}>
            {/* 1. Solid Bright Inner Core */}
            <mesh>
                <sphereGeometry args={[1.3, 64, 64]} />
                <meshBasicMaterial color={coreColor} toneMapped={false} />
            </mesh>

            {/* 2. Distorted Plasma Surface */}
            <mesh>
                <sphereGeometry args={[1.45, 64, 64]} />
                <MeshDistortMaterial
                    ref={materialRef}
                    color={sunColor}
                    emissive={sunColor}
                    emissiveIntensity={2.5}
                    distort={0.4}       // Creates turbulent surface
                    speed={isActive ? 3 : 1.5} // Faster turbulence if counting down
                    roughness={0.2}
                    transparent
                    opacity={0.9}
                    toneMapped={false}
                />
            </mesh>

            {/* 3. Inner Corona / Halo */}
            <mesh scale={1.2}>
                <sphereGeometry args={[1.45, 64, 64]} />
                <meshBasicMaterial
                    color={sunColor}
                    transparent
                    opacity={0.15}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            {/* 4. Outer Fading Atmosphere */}
            <mesh scale={1.5}>
                <sphereGeometry args={[1.45, 64, 64]} />
                <meshBasicMaterial
                    color={sunColor}
                    transparent
                    opacity={0.05}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            {/* Central Light Source illuminating everything */}
            <pointLight
                position={[0, 0, 0]}
                intensity={120}
                distance={200}
                color={sunColor}
                decay={1.2}
            />
        </group>
    );
}
