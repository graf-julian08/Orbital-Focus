'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useStore, Task } from '@/store/useStore';
import { Sun } from './Sun';
import { Planet } from './Planet';
import { Orbit } from './Orbit';

export function Scene() {
    const tasks = useStore((state) => state.tasks);

    return (
        <div className="w-full h-full absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 15, 25], fov: 45 }}>
                {/* Environment setup */}
                <color attach="background" args={['#020205']} />
                <ambientLight intensity={0.1} />
                <Stars radius={100} depth={50} count={8000} factor={4} saturation={1} fade speed={0.5} />
                <OrbitControls
                    enablePan={false}
                    maxDistance={60}
                    minDistance={5}
                    maxPolarAngle={Math.PI / 2 + 0.1}
                />

                {/* The Solar System center */}
                <Sun />

                {/* Render Orbits and Planets for each Task */}
                {tasks.map((task: Task) => (
                    <group key={task.id}>
                        <Orbit radius={task.distance} />
                        <Planet task={task} />
                    </group>
                ))}

                {/* To make it look good empty, let's render some dummy orbits/planets if no tasks exist */}
                {tasks.length === 0 && (
                    <>
                        <Orbit radius={5} />
                        <Orbit radius={8} />
                        <Orbit radius={12} />
                    </>
                )}

                {/* Post-Processing for Realistic Glows */}
                <EffectComposer>
                    <Bloom
                        luminanceThreshold={1.0}
                        mipmapBlur
                        intensity={1.5}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
