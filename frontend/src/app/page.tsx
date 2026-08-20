import { Scene } from "@/components/SolarSystem/Scene";
import { TaskSidebar } from "@/components/UI/TaskSidebar";
import { PomodoroTimer } from "@/components/UI/PomodoroTimer";

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 3D Canvas Background */}
      <Scene />

      {/* Layer for Glassmorphism UI */}
      <div className="absolute inset-0 z-10 pointer-events-none">

        {/* Top Centered Title */}
        <div className="hidden sm:block absolute top-4 left-1/2 -translate-x-1/2 text-center drop-shadow-lg">
          <h1 className="text-sm font-bold tracking-[0.2em] text-white/40 uppercase">
            Orbital Focus
          </h1>
        </div>

        {/* Timer UI Panel */}
        <PomodoroTimer />

        {/* Sidebar for Tasks */}
        <TaskSidebar />

        {/* Instructions overlay */}
        <div className="hidden sm:block absolute bottom-8 right-8 text-right">
          <p className="text-white/30 text-xs tracking-wider">Drag to pan • Scroll to zoom</p>
        </div>
      </div>
    </main>
  );
}
