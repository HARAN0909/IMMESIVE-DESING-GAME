/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="h-screen w-screen bg-brand-bg text-white flex flex-col font-sans overflow-hidden border-8 border-[#111]">
      
      {/* Header: Branding and Stats */}
      <header className="h-20 border-b border-cyan-glow/30 flex items-center justify-between px-10 bg-panel-bg">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 border-2 border-cyan-glow rotate-45 flex items-center justify-center">
            <div className="w-4 h-4 bg-pink-glow border border-white"></div>
          </div>
          <h1 className="text-2xl font-black tracking-widest text-cyan-glow uppercase">
            SynthSnake <span className="text-xs font-normal opacity-50">v2.0.4</span>
          </h1>
        </div>
        
        <div className="flex space-x-12">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-[#06b6d4] font-bold">Session ID</p>
            <p className="text-2xl font-mono text-cyan-200 leading-none">NX-9982</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-[#ec4899] font-bold">Neural Link</p>
            <p className="text-2xl font-mono text-pink-400 leading-none tracking-tighter uppercase italic">Active</p>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        
        {/* Sidebar: Music Library */}
        <aside className="col-span-3 border-r border-cyan-glow/20 bg-panel-bg p-6 flex flex-col overflow-hidden">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-cyan-glow">Neural Audio Feed</h2>
          <div className="flex-1 overflow-y-auto">
            <MusicPlayer layout="list" />
          </div>
          
          <div className="mt-auto pt-6 border-t border-cyan-glow/10">
            <div className="h-24 w-full border border-dashed border-cyan-glow/30 flex items-center justify-center p-4">
              <div className="flex space-x-1 items-end h-10">
                {[8, 4, 10, 6, 2, 8, 4, 6].map((h, i) => (
                  <motion.div 
                    key={i}
                    className="w-1 bg-cyan-glow"
                    animate={{ height: [`${h*4}px`, `${(h+2)*4}px`, `${(h-1)*4}px`] }}
                    transition={{ repeat: Infinity, duration: 0.5 + i * 0.1 }}
                  />
                ))}
              </div>
              <span className="ml-4 text-[10px] tracking-tighter opacity-40 uppercase">Live Spectrogram</span>
            </div>
          </div>
        </aside>

        {/* Center: Snake Game Window */}
        <section className="col-span-9 bg-black relative flex items-center justify-center p-8 overflow-hidden scanlines">
          <SnakeGame />
          
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-glow/5 blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-glow/5 blur-[120px] pointer-events-none"></div>
        </section>

      </main>

      {/* Footer: Player Controls */}
      <footer className="h-24 border-t border-cyan-glow/30 bg-control-bg">
        <MusicPlayer layout="controls" />
      </footer>

    </div>
  );
}


