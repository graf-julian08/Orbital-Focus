'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { Task } from '@/store/useStore';
import { Supernova } from './Supernova';

interface PlanetProps {
    task: Task;
}

export function Planet({ task }: PlanetProps) {
    const groupRef = useRef<THREE.Group>(null);
    const planetRef = useRef<THREE.Mesh>(null);

    // States for handling the explosion effect
    const [isExploding, setIsExploding] = useState(false);
    const [explosionPos, setExplosionPos] = useState<THREE.Vector3 | null>(null);
    const [hasFinished, setHasFinished] = useState(false);

    // Random start offset so planets don't bunch up
    const randomOffset = useMemo(() => Math.random() * Math.PI * 2, []);

    // Base orbit radius and speed factor
    const radius = task.distance;
    const speed = task.speed * 0.2; // Slow it down for better visuals

    // Detect when task is marked as 'done'
    useEffect(() => {
        if (task.status === 'done' && !isExploding && !hasFinished) {
            // Capture the current world position to spawn the Supernova exactly there
            if (groupRef.current) {
                setExplosionPos(groupRef.current.position.clone());
                setIsExploding(true);

                // Let the explosion animate for 2.5 seconds before removing completely from React DOM
                setTimeout(() => {
                    setHasFinished(true);
                }, 2500);
            }
        }
    }, [task.status, isExploding, hasFinished]);

    useFrame((state) => {
        // Only move if we aren't exploding
        if (groupRef.current && !isExploding && !hasFinished) {
            const time = state.clock.getElapsedTime();
            const angle = (time * speed) + randomOffset;

            // X and Z coordinates for circular orbit
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            groupRef.current.position.set(x, 0, z);
        }

        if (planetRef.current && !isExploding) {
            // Rotate the planet on its own axis
            planetRef.current.rotation.y += 0.01;
        }
    });

    // Completely unmount after explosion finishes
    if (hasFinished) return null;

    // Once marked as done, switch from rendering the planet mesh to the particle system
    if (isExploding && explosionPos) {
        return <Supernova position={explosionPos} color={task.color} />;
    }

    return (
        <group ref={groupRef}>
            {/* The actual planet core */}
            <mesh ref={planetRef}>
                <sphereGeometry args={[0.4, 64, 64]} />
                <meshStandardMaterial
                    color={task.color}
                    emissive={task.color}
                    emissiveIntensity={0.15} // Slight glow to interact with Bloom
                    roughness={0.4}
                    metalness={0.7}
                />
            </mesh>

            {/* Planet Atmosphere Glow */}
            <mesh>
                <sphereGeometry args={[0.48, 64, 64]} />
                <meshBasicMaterial
                    color={task.color}
                    transparent
                    opacity={0.2}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            {/* Outer Faint Atmosphere */}
            <mesh>
                <sphereGeometry args={[0.55, 64, 64]} />
                <meshBasicMaterial
                    color={task.color}
                    transparent
                    opacity={0.08}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            {/* Task Label floating above the planet */}
            <Text
                position={[0, 0.9, 0]}
                fontSize={0.25}
                color="white"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
            >
                {task.title}
            </Text>
        </group>
    );
}
