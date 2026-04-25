import { motion, AnimatePresence } from 'motion/react';
import { Skull, Play, RotateCcw } from 'lucide-react';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Point, GameState } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(150);
  
  const lastMoveRef = useRef<number>(0);
  const requestRef = useRef<number>(0);

  const spawnFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      const hit = currentSnake.some(p => p.x === newFood.x && p.y === newFood.y);
      if (!hit) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE
      };

      if (prevSnake.some((segment, index) => index !== 0 && segment.x === newHead.x && segment.y === newHead.y)) {
        setGameState(GameState.GAMEOVER);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(spawnFood(newSnake));
        setSpeed(prev => Math.max(70, prev - 2));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, spawnFood, highScore]);

  const gameLoop = useCallback((time: number) => {
    if (gameState === GameState.PLAYING) {
      if (time - lastMoveRef.current > speed) {
        moveSnake();
        lastMoveRef.current = time;
      }
    }
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, moveSnake, speed]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellSize = canvas.width / GRID_SIZE;

    // Draw Background Grid (Dots)
    ctx.fillStyle = '#111';
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        ctx.beginPath();
        ctx.arc(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw Food
    ctx.fillStyle = '#ec4899';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ec4899';
    ctx.fillRect(food.x * cellSize + 2, food.y * cellSize + 2, cellSize - 4, cellSize - 4);
    ctx.shadowBlur = 0;

    // Draw Snake
    snake.forEach((segment, index) => {
      const opacity = 1 - (index / snake.length) * 0.6;
      ctx.fillStyle = `rgba(6, 182, 212, ${opacity})`;
      if (index === 0) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#06b6d4';
      }
      ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
      ctx.shadowBlur = 0;
    });

  }, [snake, food]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setSpeed(150);
    setGameState(GameState.PLAYING);
    setFood(spawnFood(INITIAL_SNAKE));
  };

  return (
    <div className="w-full max-w-[600px] aspect-square relative flex items-center justify-center">
      
      {/* UI Overlay in Game */}
      <div className="absolute top-4 left-4 text-[10px] uppercase font-mono text-cyan-glow/60 z-10 pointer-events-none">
        SYS_GRID: ENABLED<br/>
        NODE_COUNT: {snake.length}
      </div>
      <div className="absolute bottom-4 right-4 text-[10px] uppercase font-mono text-pink-glow/60 text-right z-10 pointer-events-none">
        SCORE: {score}<br/>
        HIGH: {highScore}
      </div>

      <div className="relative w-full h-full border-2 border-cyan-glow/30 bg-black overflow-hidden group">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={600} 
          className="w-full h-full bg-black block transition-opacity duration-500"
        />
        
        <AnimatePresence>
          {gameState !== GameState.PLAYING && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505]/95 z-20 p-12 text-center"
            >
              {gameState === GameState.IDLE && (
                <>
                  <div className="w-16 h-16 border-2 border-cyan-glow rotate-45 flex items-center justify-center mb-10">
                    <div className="w-8 h-8 bg-cyan-glow cyan-neon-glow" />
                  </div>
                  <h2 className="text-3xl font-black tracking-widest text-white uppercase mb-4">Initialize Routine</h2>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed mb-10">
                    Neural Calibration required.<br/>Consume Pink Nodes to stabilize connection.
                  </p>
                  <button 
                    onClick={startGame}
                    className="px-12 py-4 border-2 border-cyan-glow text-cyan-glow font-bold uppercase tracking-wider hover:bg-cyan-glow hover:text-black transition-all active:scale-95 flex items-center gap-3 cursor-pointer"
                  >
                    <Play size={18} fill="currentColor" />
                    Load System
                  </button>
                </>
              )}
              {gameState === GameState.GAMEOVER && (
                <>
                  <Skull size={64} className="text-pink-glow mb-6 animate-pulse" />
                  <h2 className="text-3xl font-black tracking-widest text-pink-glow uppercase mb-2">Neural Fracture</h2>
                  <div className="space-y-1 mb-10">
                    <p className="text-xs font-mono text-gray-500">FINAL_SCORE: {score}</p>
                    <p className="text-xs font-mono text-gray-500">LINK_DEGRADED: 100%</p>
                  </div>
                  <button 
                    onClick={startGame}
                    className="px-12 py-4 bg-pink-glow text-white font-bold uppercase tracking-wider hover:brightness-125 transition-all active:scale-95 flex items-center gap-3 cursor-pointer shadow-lg shadow-pink-glow/20"
                  >
                    <RotateCcw size={18} />
                    Reconnect
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

