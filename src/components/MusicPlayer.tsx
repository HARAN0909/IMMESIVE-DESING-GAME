import { motion } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import React, { useState } from 'react';
import { Track } from '../types';

const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'ELECTRO_TIDE_88.WAV',
    author: 'AI_GEN / SYNTHWAVE / 128 BPM',
    duration: '04:12',
    color: 'var(--color-cyan-glow)',
  },
  {
    id: '2',
    title: 'NEON_MIDNIGHT.MP3',
    author: 'AI_GEN / RETRO / 95 BPM',
    duration: '03:15',
    color: 'var(--color-cyan-glow)',
  },
  {
    id: '3',
    title: 'GLITCH_HORIZON.EXE',
    author: 'AI_GEN / AMBIENT / 142 BPM',
    duration: '05:01',
    color: 'var(--color-cyan-glow)',
  },
];

interface MusicPlayerProps {
  layout?: 'list' | 'controls';
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ layout = 'list' }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const track = MOCK_TRACKS[currentTrackIndex];

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => setCurrentTrackIndex((prev) => (prev + 1) % MOCK_TRACKS.length);
  const prevTrack = () => setCurrentTrackIndex((prev) => (prev - 1 + MOCK_TRACKS.length) % MOCK_TRACKS.length);

  if (layout === 'controls') {
    return (
      <div className="flex items-center px-10 h-full w-full">
        {/* Left: Track Info */}
        <div className="flex items-center w-1/4 space-x-4">
          <div className="w-12 h-12 bg-gray-900 border border-white/10 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-glow to-blue-600"></div>
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{track.title}</p>
            <p className="text-[10px] text-cyan-glow uppercase tracking-tighter">NEURAL ARCHIVE 0{currentTrackIndex + 1}</p>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center space-x-12 mb-2">
            <button onClick={prevTrack} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
              <SkipBack size={20} fill="currentColor" />
            </button>
            <button 
              onClick={togglePlay} 
              className="w-10 h-10 rounded-full border border-cyan-glow flex items-center justify-center text-cyan-glow hover:bg-cyan-glow hover:text-black transition-all active:scale-90 cursor-pointer"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
            </button>
            <button onClick={nextTrack} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
              <SkipForward size={20} fill="currentColor" />
            </button>
          </div>
          
          <div className="w-full max-w-md flex items-center space-x-3">
            <span className="text-[9px] font-mono opacity-50">01:42</span>
            <div className="flex-1 h-1 bg-gray-800 relative">
              <motion.div 
                className="absolute left-0 top-0 h-full bg-cyan-glow cyan-neon-glow"
                animate={{ width: isPlaying ? '100%' : '40%' }}
                transition={{ duration: isPlaying ? 252 : 0.5, ease: 'linear' }}
              />
            </div>
            <span className="text-[9px] font-mono opacity-50">{track.duration}</span>
          </div>
        </div>

        {/* Right: Vol Meta */}
        <div className="w-1/4 flex justify-end items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase opacity-40">Vol</span>
            <div className="w-24 h-1 bg-gray-800 flex">
              <div className="w-2/3 bg-white/40 h-full"></div>
            </div>
          </div>
          <div className="w-10 h-10 border border-white/5 flex items-center justify-center text-gray-500 hover:text-white cursor-pointer transition-colors">
             <div className="space-y-1">
                <div className="w-4 h-[1px] bg-white/40" />
                <div className="w-4 h-[1px] bg-white/40" />
                <div className="w-4 h-[1px] bg-white/40" />
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {MOCK_TRACKS.map((t, idx) => {
        const isActive = idx === currentTrackIndex;
        return (
          <div 
            key={t.id}
            onClick={() => setCurrentTrackIndex(idx)}
            className={`transition-all duration-300 border p-4 flex flex-col cursor-pointer ${
              isActive 
                ? 'bg-cyan-glow/10 border-cyan-glow/50' 
                : 'hover:bg-white/5 border-transparent'
            }`}
          >
            <span className={`text-[10px] mb-1 ${isActive ? 'text-cyan-glow' : 'text-gray-600'}`}>
              0{idx + 1} // {isActive ? 'CURRENTLY SYNCED' : 'STANDBY'}
            </span>
            <span className={`font-bold text-sm tracking-tight ${isActive ? 'text-white' : 'text-gray-400'}`}>
              {t.title}
            </span>
            <span className="text-xs text-gray-500 italic mt-0.5">{t.author}</span>
          </div>
        );
      })}
    </div>
  );
};

