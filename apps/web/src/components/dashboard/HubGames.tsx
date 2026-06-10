"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, Play, RotateCcw, Volume2, VolumeX, Terminal, 
  ShieldAlert, Trophy, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Cpu, Globe, Bot, Shield, Lock, Activity, Eye, RefreshCw, Star,
  HelpCircle, ChevronLeft, Award, Check, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Global Audio Config ---
const playBeep = (freq: number, type: OscillatorType, duration: number, isMuted: boolean) => {
  if (isMuted) return;
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Ignore AudioContext warnings
  }
};

export function HubGames() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const gameList = [
    { id: 'snake', name: 'Neural Snake 2D', desc: 'Steer the node vector, absorb packets.', icon: Bot, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { id: '2048', name: 'Matrix 2048', desc: 'Slide and merge data blocks to reach 2048.', icon: Cpu, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { id: 'mines', name: 'Threat Sweeper', desc: 'Flag infected nodes, sweep the sector.', icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { id: 'memory', name: 'Neural Link Match', desc: 'Match cognitive data-pair signatures.', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { id: 'scramble', name: 'Decrypt Scramble', desc: 'Decrypt scrambled mainframe security terms.', icon: Terminal, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { id: 'rps', name: 'Quantum RPS', desc: 'Rock Paper Scissors vs the Cyber Intelligence.', icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  ];

  return (
    <div className="h-full flex flex-col overflow-y-auto no-scrollbar pb-10 font-sans text-[var(--text)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Main Container */}
      {!activeGame ? (
        <div className="flex-1 space-y-6">
          {/* Main Hero Header */}
          <div className="relative overflow-hidden rounded-2xl border p-6 md:p-8 bg-gradient-to-br from-emerald-500/5 via-[var(--card-bg)] to-[var(--bg)] border-emerald-500/15">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Gamepad2 className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="font-royal text-2xl sm:text-3xl font-black text-[var(--text)] leading-none italic">
                    ManMadhan Games
                  </h1>
                  <p className="text-[10px] text-[var(--neon)] mt-1 uppercase tracking-widest font-black">
                    Fully Offline Subgrid Arcade Protocol
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2.5 rounded-xl border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] transition-all cursor-pointer bg-[var(--card-bg)]"
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
            </div>
          </div>

          {/* Arcade Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameList.map((game, idx) => {
              const Icon = game.icon;
              return (
                <motion.div
                  key={game.id}
                  whileHover={{ y: -4 }}
                  onClick={() => {
                    setActiveGame(game.id);
                    playBeep(440, 'sine', 0.1, isMuted);
                  }}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5 cursor-pointer hover:border-[var(--border2)] transition-all flex flex-col justify-between group h-44"
                >
                  <div>
                    <div className={`w-9 h-9 rounded-xl ${game.bg} flex items-center justify-center ${game.color} mb-3`}>
                      <Icon size={18} />
                    </div>
                    <h3 className="text-sm font-black text-[var(--text)] group-hover:text-[var(--neon)] transition-colors uppercase tracking-wider">{game.name}</h3>
                    <p className="text-[11px] text-[var(--muted)] mt-1.5 leading-relaxed">{game.desc}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 text-[9px] font-black uppercase tracking-widest text-[var(--muted)] group-hover:text-emerald-400 transition-colors">
                    <span>Initialize Game</span>
                    <Play size={10} className="fill-current" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 z-[99999] bg-[#030703] text-white flex flex-col game-fullscreen">
          <div className="flex-none px-4 pb-4 pt-[calc(16px+env(safe-area-inset-top))] md:p-4 md:px-8 flex items-center justify-between border-b border-[var(--border)] bg-black/80 backdrop-blur-md z-[100]">
            <button 
              onClick={() => setActiveGame(null)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest text-white hover:bg-white/20 hover:scale-105 transition-all cursor-pointer"
            >
              <ChevronLeft size={16} /> BACK
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all cursor-pointer bg-white/5"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
          <div className="flex-1 flex flex-col relative justify-center items-center bg-black overflow-hidden">
            {activeGame === 'snake' && <SnakeGame isMuted={isMuted} />}
            {activeGame === '2048' && <Matrix2048 isMuted={isMuted} />}
            {activeGame === 'mines' && <ThreatSweeper isMuted={isMuted} />}
            {activeGame === 'memory' && <NeuralLinkMatch isMuted={isMuted} />}
            {activeGame === 'scramble' && <DecryptScramble isMuted={isMuted} />}
            {activeGame === 'rps' && <QuantumRPS isMuted={isMuted} />}
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 1. NEURAL SNAKE 2D
// ────────────────────────────────────────────────────────
const GRID_SIZE = 20;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];

function SnakeGame({ isMuted }: { isMuted: boolean }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  const snakeRef = useRef<{ x: number; y: number }[]>([...INITIAL_SNAKE]);
  const dirRef = useRef({ x: 0, y: -1 });
  const nextDirRef = useRef({ x: 0, y: -1 });
  const foodRef = useRef({ x: 5, y: 5 });
  const lastTickTimeRef = useRef(0);
  const gameSpeedRef = useRef(160);

  useEffect(() => {
    setHighScore(Number(localStorage.getItem('high_score_snake') || '0'));
  }, []);

  const spawnFood = () => {
    let newFood: { x: number; y: number };
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE))
      };
      if (!snakeRef.current.some(s => s.x === newFood.x && s.y === newFood.y)) break;
    }
    foodRef.current = newFood;
  };

  const startGame = () => {
    snakeRef.current = [...INITIAL_SNAKE];
    dirRef.current = { x: 0, y: -1 };
    nextDirRef.current = { x: 0, y: -1 };
    setScore(0);
    gameSpeedRef.current = 160;
    setIsGameOver(false);
    setIsPlaying(true);
    setIsPaused(false);
    spawnFood();
    lastTickTimeRef.current = performance.now();
    playBeep(440, 'sine', 0.1, isMuted);
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    setIsPlaying(false);
    playBeep(150, 'sawtooth', 0.4, isMuted);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('high_score_snake', String(score));
    }
  };

  const changeDirection = (x: number, y: number) => {
    if (dirRef.current.x === 0 && x !== 0) nextDirRef.current = { x, y: 0 };
    if (dirRef.current.y === 0 && y !== 0) nextDirRef.current = { x: 0, y };
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isPaused || isGameOver) return;
      if (['ArrowUp', 'w'].includes(e.key)) { e.preventDefault(); changeDirection(0, -1); }
      if (['ArrowDown', 's'].includes(e.key)) { e.preventDefault(); changeDirection(0, 1); }
      if (['ArrowLeft', 'a'].includes(e.key)) { e.preventDefault(); changeDirection(-1, 0); }
      if (['ArrowRight', 'd'].includes(e.key)) { e.preventDefault(); changeDirection(1, 0); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused, isGameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (time: number) => {
      requestRef.current = requestAnimationFrame(render);
      if (!isPlaying || isPaused || isGameOver) return;

      if (time - lastTickTimeRef.current > gameSpeedRef.current) {
        lastTickTimeRef.current = time;
        dirRef.current = { ...nextDirRef.current };
        const head = snakeRef.current[0];
        const newHead = { x: head.x + dirRef.current.x, y: head.y + dirRef.current.y };

        const gridW = CANVAS_WIDTH / GRID_SIZE;
        const gridH = CANVAS_HEIGHT / GRID_SIZE;

        if (newHead.x < 0 || newHead.x >= gridW || newHead.y < 0 || newHead.y >= gridH ||
            snakeRef.current.some(s => s.x === newHead.x && s.y === newHead.y)) {
          handleGameOver();
          return;
        }

        snakeRef.current.unshift(newHead);

        if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
          playBeep(880, 'sine', 0.08, isMuted);
          setScore(s => s + 10);
          gameSpeedRef.current = Math.max(50, gameSpeedRef.current - 4);
          spawnFood();
        } else {
          snakeRef.current.pop();
        }
      }

      // Draw Grid
      ctx.fillStyle = '#030703';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)';
      for (let i = 0; i < CANVAS_WIDTH; i += GRID_SIZE) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_HEIGHT); ctx.stroke();
      }
      for (let j = 0; j < CANVAS_HEIGHT; j += GRID_SIZE) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(CANVAS_WIDTH, j); ctx.stroke();
      }

      // Draw Food
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(foodRef.current.x * GRID_SIZE + GRID_SIZE/2, foodRef.current.y * GRID_SIZE + GRID_SIZE/2, GRID_SIZE/2 - 2, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Snake
      snakeRef.current.forEach((s, idx) => {
        ctx.fillStyle = idx === 0 ? '#34d399' : '#047857';
        ctx.fillRect(s.x * GRID_SIZE + 1, s.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);
      });
    };

    requestRef.current = requestAnimationFrame(render);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isPlaying, isPaused, isGameOver]);

  return (
    <div className="flex-1 flex flex-col w-full h-full relative overflow-hidden bg-black">
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <span className="text-[10px] font-black uppercase text-[var(--neon)] font-mono drop-shadow-md">Neural Snake 2D</span>
        <div className="flex gap-4 text-xs font-mono text-emerald-400 drop-shadow-md">
          <span>SCORE: {score}</span>
          <span>HIGH: {highScore}</span>
        </div>
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-full object-contain max-h-[85vh] block" />
        
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-6 p-4 text-center z-20">
            <h3 className="text-2xl md:text-4xl font-black tracking-widest text-emerald-400 font-mono uppercase drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              {isGameOver ? 'Vector Collision' : 'Neural Snake'}
            </h3>
            <button onClick={startGame} className="px-8 py-4 rounded-xl bg-emerald-500 text-black text-xs md:text-sm font-black uppercase tracking-widest cursor-pointer hover:scale-105 transition-transform hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              {isGameOver ? 'Restart Stream' : 'Initialize Vector'}
            </button>
          </div>
        )}
      </div>

      {/* D-Pad for Mobile */}
      {isPlaying && (
        <div className="flex flex-col items-center gap-2 mt-2 sm:hidden">
          <button onClick={() => changeDirection(0, -1)} className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><ArrowUp size={16} /></button>
          <div className="flex gap-6">
            <button onClick={() => changeDirection(-1, 0)} className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><ArrowLeft size={16} /></button>
            <button onClick={() => changeDirection(1, 0)} className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><ArrowRight size={16} /></button>
          </div>
          <button onClick={() => changeDirection(0, 1)} className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><ArrowDown size={16} /></button>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 2. MATRIX 2048
// ────────────────────────────────────────────────────────
function Matrix2048({ isMuted }: { isMuted: boolean }) {
  const [board, setBoard] = useState<number[][]>(Array(4).fill(0).map(() => Array(4).fill(0)));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setHighScore(Number(localStorage.getItem('high_score_2048') || '0'));
    resetGame();
  }, []);

  const addRandomTile = (currentBoard: number[][]) => {
    const emptyCells: {r: number, c: number}[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentBoard[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length > 0) {
      const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      currentBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const resetGame = () => {
    const newBoard = Array(4).fill(0).map(() => Array(4).fill(0));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  };

  const getTileColor = (val: number) => {
    switch (val) {
      case 2: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 4: return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 8: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      case 16: return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 32: return 'bg-blue-500/10 text-blue-400 border-blue-500/25';
      case 64: return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 128: return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
      case 256: return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 512: return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
      case 1024: return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 2048: return 'bg-red-500 text-white border-red-400/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
      default: return 'bg-[var(--bg)] border-[var(--border)] text-[var(--muted)]';
    }
  };

  const slide = (row: number[]) => {
    let arr = row.filter(val => val !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] = arr[i] * 2;
        setScore(s => {
          const newScore = s + arr[i];
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('high_score_2048', String(newScore));
          }
          return newScore;
        });
        arr[i + 1] = 0;
        playBeep(600, 'sine', 0.05, isMuted);
      }
    }
    arr = arr.filter(val => val !== 0);
    while (arr.length < 4) arr.push(0);
    return arr;
  };

  const move = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (gameOver) return;
    let tempBoard = board.map(row => [...row]);
    let moved = false;

    if (direction === 'LEFT' || direction === 'RIGHT') {
      for (let r = 0; r < 4; r++) {
        const original = [...tempBoard[r]];
        let row = tempBoard[r];
        if (direction === 'RIGHT') row.reverse();
        row = slide(row);
        if (direction === 'RIGHT') row.reverse();
        tempBoard[r] = row;
        if (JSON.stringify(original) !== JSON.stringify(row)) moved = true;
      }
    } else {
      for (let c = 0; c < 4; c++) {
        const original = [tempBoard[0][c], tempBoard[1][c], tempBoard[2][c], tempBoard[3][c]];
        let col = [...original];
        if (direction === 'DOWN') col.reverse();
        col = slide(col);
        if (direction === 'DOWN') col.reverse();
        for (let r = 0; r < 4; r++) tempBoard[r][c] = col[r];
        if (JSON.stringify(original) !== JSON.stringify(col)) moved = true;
      }
    }

    if (moved) {
      addRandomTile(tempBoard);
      setBoard(tempBoard);
      checkGameOver(tempBoard);
      playBeep(440, 'sine', 0.05, isMuted);
    }
  };

  const checkGameOver = (currentBoard: number[][]) => {
    // Check for empty spots
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentBoard[r][c] === 0) return;
      }
    }
    // Check horizontal and vertical merges
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (c < 3 && currentBoard[r][c] === currentBoard[r][c + 1]) return;
        if (r < 3 && currentBoard[r][c] === currentBoard[r + 1][c]) return;
      }
    }
    setGameOver(true);
    playBeep(150, 'sawtooth', 0.4, isMuted);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w'].includes(e.key)) { e.preventDefault(); move('UP'); }
      if (['ArrowDown', 's'].includes(e.key)) { e.preventDefault(); move('DOWN'); }
      if (['ArrowLeft', 'a'].includes(e.key)) { e.preventDefault(); move('LEFT'); }
      if (['ArrowRight', 'd'].includes(e.key)) { e.preventDefault(); move('RIGHT'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, gameOver]);

  return (
    <div className="flex-1 flex flex-col items-center gap-4 max-w-sm mx-auto">
      <div className="w-full flex items-center justify-between p-3 border border-blue-500/20 bg-blue-500/5 rounded-xl">
        <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 font-mono">Matrix 2048</span>
        <div className="flex gap-4 text-xs font-mono">
          <span>SCORE: {score}</span>
          <span>HIGH: {highScore}</span>
        </div>
      </div>

      <div className="relative border border-[var(--border)] rounded-2xl p-4 bg-black/50 aspect-square w-full grid grid-cols-4 gap-3">
        {board.map((row, r) => 
          row.map((val, c) => (
            <div 
              key={`${r}-${c}`} 
              className={`rounded-xl border flex items-center justify-center text-sm font-black transition-all font-mono ${getTileColor(val)}`}
            >
              {val > 0 ? val : ''}
            </div>
          ))
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-4 rounded-2xl text-center p-4">
            <h3 className="text-xl font-black text-rose-400 font-mono">CORE FULL</h3>
            <p className="text-[10px] text-[var(--muted)]">No remaining merge operations</p>
            <button onClick={resetGame} className="px-6 py-2.5 rounded-xl bg-blue-500 text-black text-[10px] font-black uppercase tracking-widest cursor-pointer">
              Flush &amp; Reset
            </button>
          </div>
        )}
      </div>

      {/* D-Pad / Controller buttons for touch */}
      <div className="flex flex-col items-center gap-2 mt-2 w-full">
        <button onClick={() => move('UP')} className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400"><ArrowUp size={16} /></button>
        <div className="flex gap-6">
          <button onClick={() => move('LEFT')} className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400"><ArrowLeft size={16} /></button>
          <button onClick={() => move('RIGHT')} className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400"><ArrowRight size={16} /></button>
        </div>
        <button onClick={() => move('DOWN')} className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400"><ArrowDown size={16} /></button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 3. THREAT SWEEPER (Minesweeper)
// ────────────────────────────────────────────────────────
interface Cell {
  r: number;
  c: number;
  isMine: boolean;
  neighborCount: number;
  isRevealed: boolean;
  isFlagged: boolean;
}

function ThreatSweeper({ isMuted }: { isMuted: boolean }) {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [flagMode, setFlagMode] = useState(false); // for touch screens

  const rows = 8;
  const cols = 8;
  const totalMines = 10;

  const initBoard = () => {
    let newGrid: Cell[][] = Array(rows).fill(null).map((_, r) => 
      Array(cols).fill(null).map((_, c) => ({
        r, c, isMine: false, neighborCount: 0, isRevealed: false, isFlagged: false
      }))
    );

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < totalMines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (r+dr >= 0 && r+dr < rows && c+dc >= 0 && c+dc < cols) {
                if (newGrid[r+dr][c+dc].isMine) count++;
              }
            }
          }
          newGrid[r][c].neighborCount = count;
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
  };

  useEffect(() => { initBoard(); }, []);

  const reveal = (gridCopy: Cell[][], r: number, c: number) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols || gridCopy[r][c].isRevealed || gridCopy[r][c].isFlagged) return;
    gridCopy[r][c].isRevealed = true;
    
    if (gridCopy[r][c].neighborCount === 0 && !gridCopy[r][c].isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          reveal(gridCopy, r + dr, c + dc);
        }
      }
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (gameOver || win) return;
    const gridCopy = grid.map(row => row.map(cell => ({ ...cell })));
    const cell = gridCopy[r][c];

    if (flagMode) {
      cell.isFlagged = !cell.isFlagged;
      playBeep(440, 'sine', 0.05, isMuted);
      setGrid(gridCopy);
      return;
    }

    if (cell.isFlagged || cell.isRevealed) return;

    if (cell.isMine) {
      // reveal all mines
      gridCopy.forEach(row => row.forEach(cl => { if (cl.isMine) cl.isRevealed = true; }));
      setGrid(gridCopy);
      setGameOver(true);
      playBeep(100, 'sawtooth', 0.5, isMuted);
      return;
    }

    reveal(gridCopy, r, c);
    playBeep(700, 'sine', 0.05, isMuted);

    // check win
    let unrevealedSafe = 0;
    gridCopy.forEach(row => row.forEach(cl => {
      if (!cl.isMine && !cl.isRevealed) unrevealedSafe++;
    }));

    if (unrevealedSafe === 0) {
      setWin(true);
      playBeep(880, 'sine', 0.3, isMuted);
    }
    setGrid(gridCopy);
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || win) return;
    const gridCopy = grid.map(row => row.map(cell => ({ ...cell })));
    const cell = gridCopy[r][c];
    if (cell.isRevealed) return;
    cell.isFlagged = !cell.isFlagged;
    playBeep(440, 'sine', 0.05, isMuted);
    setGrid(gridCopy);
  };

  return (
    <div className="flex-1 flex flex-col items-center gap-4 max-w-sm mx-auto select-none">
      <div className="w-full flex items-center justify-between p-3 border border-rose-500/20 bg-rose-500/5 rounded-xl">
        <span className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 font-mono">Threat Sweeper</span>
        <button 
          onClick={() => setFlagMode(!flagMode)}
          className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-colors ${
            flagMode ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30' : 'bg-transparent text-[var(--muted)] border-[var(--border)]'
          }`}
        >
          {flagMode ? 'Mode: Flag' : 'Mode: Sweeping'}
        </button>
      </div>

      <div className="relative border border-[var(--border)] rounded-2xl p-3 bg-black/50 aspect-square w-full grid grid-cols-8 gap-1.5">
        {grid.map((row, r) => 
          row.map((cell, c) => (
            <div 
              key={`${r}-${c}`}
              onClick={() => handleCellClick(r, c)}
              onContextMenu={(e) => handleRightClick(e, r, c)}
              className={`rounded-lg border flex items-center justify-center text-[11px] font-black font-mono cursor-pointer transition-all ${
                cell.isRevealed 
                  ? cell.isMine 
                    ? 'bg-rose-950 border-rose-500/30 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                    : 'bg-[var(--bg)] border-[var(--border)] text-emerald-400' 
                  : 'bg-[var(--card-bg)] hover:bg-[var(--border)] border-[var(--border)] text-[var(--muted2)]'
              }`}
            >
              {cell.isRevealed && !cell.isMine ? (cell.neighborCount > 0 ? cell.neighborCount : '') : ''}
              {!cell.isRevealed && cell.isFlagged ? <Shield size={10} className="text-rose-400" /> : ''}
              {cell.isRevealed && cell.isMine ? <ShieldAlert size={11} /> : ''}
            </div>
          ))
        )}

        {(gameOver || win) && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-4 rounded-2xl text-center p-4">
            <h3 className={`text-xl font-black font-mono ${win ? 'text-[var(--neon)]' : 'text-rose-500'}`}>
              {win ? 'SECTOR SECURED' : 'SECURITY COLLAPSE'}
            </h3>
            <p className="text-[10px] text-[var(--muted)]">
              {win ? 'All threat nodes decrypted successfully.' : 'Detonated payload threat block.'}
            </p>
            <button onClick={initBoard} className="px-6 py-2.5 rounded-xl bg-rose-500 text-black text-[10px] font-black uppercase tracking-widest cursor-pointer font-bold">
              Purge Matrix
            </button>
          </div>
        )}
      </div>
      <p className="text-[9px] text-[var(--muted)] font-mono uppercase tracking-widest">Right-click cell to deploy shield flag</p>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 4. NEURAL LINK MATCH (Memory Game)
// ────────────────────────────────────────────────────────
const MATCH_ICONS = [Cpu, Globe, Bot, Shield, Lock, Activity, Eye, RefreshCw];

function NeuralLinkMatch({ isMuted }: { isMuted: boolean }) {
  const [cards, setCards] = useState<{ id: number; iconIdx: number; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const initGame = () => {
    // 8 indices duplicated to make 16 cards
    const cardIndices = [...Array(8).keys(), ...Array(8).keys()];
    // Shuffle
    for (let i = cardIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardIndices[i], cardIndices[j]] = [cardIndices[j], cardIndices[i]];
    }

    setCards(cardIndices.map((idx, id) => ({ id, iconIdx: idx, isFlipped: false, isMatched: false })));
    setSelected([]);
    setMoves(0);
    setWon(false);
  };

  useEffect(() => { initGame(); }, []);

  const handleCardClick = (id: number) => {
    if (selected.length === 2 || cards[id].isFlipped || cards[id].isMatched || won) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);
    playBeep(600, 'sine', 0.05, isMuted);

    const nextSelected = [...selected, id];
    setSelected(nextSelected);

    if (nextSelected.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = nextSelected;
      if (cards[first].iconIdx === cards[second].iconIdx) {
        // match
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setSelected([]);
        playBeep(900, 'sine', 0.08, isMuted);

        if (newCards.every(c => c.isMatched)) {
          setWon(true);
          playBeep(880, 'sine', 0.3, isMuted);
        }
      } else {
        // fail, flip back
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards(newCards);
          setSelected([]);
        }, 850);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center gap-4 max-w-sm mx-auto select-none">
      <div className="w-full flex items-center justify-between p-3 border border-blue-500/20 bg-blue-500/5 rounded-xl">
        <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 font-mono">Neural Link Match</span>
        <span className="text-xs font-mono">MOVES: {moves}</span>
      </div>

      <div className="relative border border-[var(--border)] rounded-2xl p-4 bg-black/50 aspect-square w-full grid grid-cols-4 gap-3">
        {cards.map((card) => {
          const IconCmp = MATCH_ICONS[card.iconIdx];
          const revealed = card.isFlipped || card.isMatched;
          return (
            <div 
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`rounded-xl border flex items-center justify-center cursor-pointer transition-all duration-300 transform ${
                revealed 
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 scale-100 rotate-0'
                  : 'bg-[var(--card-bg)] border-[var(--border)] text-blue-500/20 scale-95 hover:border-[var(--border2)] hover:scale-100'
              }`}
            >
              {revealed ? <IconCmp size={18} /> : <Cpu size={16} className="opacity-30" />}
            </div>
          );
        })}

        {won && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-4 rounded-2xl text-center p-4">
            <h3 className="text-xl font-black text-blue-400 font-mono">SYNAPSE CONNECTED</h3>
            <p className="text-[10px] text-[var(--muted)]">All memory arrays mapped in {moves} moves</p>
            <button onClick={initGame} className="px-6 py-2.5 rounded-xl bg-blue-500 text-black text-[10px] font-black uppercase tracking-widest cursor-pointer font-bold">
              Reload Linker
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 5. DECRYPT SCRAMBLE (Word Game)
// ────────────────────────────────────────────────────────
const TECH_WORDS = [
  { word: 'FIREWALL', hint: 'Monitors inbound port telemetry.' },
  { word: 'DATABASE', hint: 'Structured catalog registry core.' },
  { word: 'QUANTUM', hint: 'Superseded sub-atomic logic gateway.' },
  { word: 'NEURAL', hint: 'Biomimetic machine synapse matrix.' },
  { word: 'SECURITY', hint: 'Integrity hardening metrics.' },
  { word: 'MALWARE', hint: 'Infected threat vector script.' },
  { word: 'ENCRYPTION', hint: 'Encipher matrix payload string.' },
];

function DecryptScramble({ isMuted }: { isMuted: boolean }) {
  const [wordObj, setWordObj] = useState(TECH_WORDS[0]);
  const [scrambled, setScrambled] = useState('');
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const selectWord = () => {
    const random = TECH_WORDS[Math.floor(Math.random() * TECH_WORDS.length)];
    setWordObj(random);
    setGuess('');
    setIsSuccess(null);

    // Scramble logic
    let arr = random.word.split('');
    while (arr.join('') === random.word) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    setScrambled(arr.join(''));
  };

  useEffect(() => { selectWord(); }, []);

  const handleDecrypt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim()) return;

    if (guess.trim().toUpperCase() === wordObj.word) {
      setScore(s => s + 10);
      setIsSuccess(true);
      playBeep(880, 'sine', 0.15, isMuted);
      setTimeout(() => { selectWord(); }, 1200);
    } else {
      setIsSuccess(false);
      playBeep(180, 'sawtooth', 0.25, isMuted);
      setTimeout(() => { setIsSuccess(null); }, 1200);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center gap-5 max-w-sm mx-auto">
      <div className="w-full flex items-center justify-between p-3 border border-amber-500/20 bg-amber-500/5 rounded-xl">
        <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 font-mono">Decrypt Scramble</span>
        <span className="text-xs font-mono">SCORE: {score}</span>
      </div>

      <div className="w-full border border-[var(--border)] rounded-2xl p-6 bg-black/60 flex flex-col gap-5 text-center font-mono">
        <div>
          <span className="text-[8px] font-black text-amber-500/50 uppercase tracking-[0.2em] block mb-2">Scrambled Data Telemetry</span>
          <div className="text-3xl font-black tracking-widest text-amber-400 uppercase select-none animate-pulse">
            {scrambled}
          </div>
        </div>

        <div className="border border-[var(--border)]/50 rounded-xl p-3.5 bg-[var(--bg)]/30 text-[11px] text-[var(--muted)] leading-relaxed">
          <span className="text-amber-500/70 font-black">HINT:</span> {wordObj.hint || 'Cyber network registry item.'}
        </div>

        <form onSubmit={handleDecrypt} className="space-y-3">
          <input 
            type="text" 
            placeholder="Type decrypted word..."
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={isSuccess === true}
            className="w-full h-11 px-4 rounded-xl bg-black/40 border border-amber-500/20 text-[12px] font-bold text-amber-400 text-center focus:outline-none focus:border-amber-500/50 placeholder:text-[var(--muted2)] transition-all uppercase"
          />

          <button 
            type="submit"
            disabled={isSuccess === true}
            className={`w-full py-2.5 rounded-xl font-mono text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
              isSuccess === true 
                ? 'bg-[var(--neon)]/10 text-[var(--neon)] border border-[var(--neon)]/20'
                : isSuccess === false 
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-amber-500 text-black font-bold hover:bg-amber-400'
            }`}
          >
            {isSuccess === true ? '✓ DECRYPTED' : isSuccess === false ? '✗ CORRUPTED DATA' : 'Commit Decrypt'}
          </button>
        </form>
        
        <button onClick={selectWord} className="text-[10px] text-[var(--muted)] hover:text-amber-400 transition-colors uppercase tracking-widest font-bold self-center cursor-pointer">
          Skip Vector
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 6. QUANTUM RPS (Rock Paper Scissors)
// ────────────────────────────────────────────────────────
const RPS_CHOICES = [
  { id: 'ROCK', name: 'Laser Core', emoji: '✊', icon: Cpu },
  { id: 'PAPER', name: 'Fire Shield', emoji: '✋', icon: Shield },
  { id: 'SCISSORS', name: 'EMP Pulse', emoji: '✌', icon: Zap }
];

function QuantumRPS({ isMuted }: { isMuted: boolean }) {
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [userSelect, setUserSelect] = useState<string | null>(null);
  const [aiSelect, setAiSelect] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  const playRound = (choice: string) => {
    if (animating) return;
    setAnimating(true);
    setUserSelect(null);
    setAiSelect(null);
    setResult(null);

    // animation loop beats
    let ticks = 0;
    playBeep(440, 'sine', 0.05, isMuted);
    const interval = setInterval(() => {
      setAiSelect(RPS_CHOICES[ticks % 3].id);
      ticks++;
      if (ticks > 6) {
        clearInterval(interval);
        
        const aiChoice = RPS_CHOICES[Math.floor(Math.random() * 3)].id;
        setUserSelect(choice);
        setAiSelect(aiChoice);

        let roundResult = '';
        if (choice === aiChoice) {
          roundResult = 'SYNC';
          playBeep(500, 'sine', 0.1, isMuted);
        } else if (
          (choice === 'ROCK' && aiChoice === 'SCISSORS') ||
          (choice === 'PAPER' && aiChoice === 'ROCK') ||
          (choice === 'SCISSORS' && aiChoice === 'PAPER')
        ) {
          roundResult = 'OVERRIDE';
          setUserScore(s => s + 1);
          playBeep(880, 'sine', 0.15, isMuted);
        } else {
          roundResult = 'BREACHED';
          setAiScore(s => s + 1);
          playBeep(200, 'sawtooth', 0.25, isMuted);
        }

        setResult(roundResult);
        setAnimating(false);
      }
    }, 150);
  };

  const getResultStyle = () => {
    if (result === 'OVERRIDE') return 'text-[var(--neon)]';
    if (result === 'BREACHED') return 'text-rose-500';
    return 'text-cyan-400';
  };

  return (
    <div className="flex-1 flex flex-col items-center gap-5 max-w-sm mx-auto">
      <div className="w-full flex items-center justify-between p-3 border border-cyan-500/20 bg-cyan-500/5 rounded-xl">
        <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 font-mono">Quantum RPS</span>
        <div className="flex gap-4 text-xs font-mono">
          <span>OPERATOR: {userScore}</span>
          <span>AI CORE: {aiScore}</span>
        </div>
      </div>

      <div className="w-full border border-[var(--border)] rounded-2xl p-5 bg-black/60 flex flex-col gap-6 text-center font-mono relative overflow-hidden">
        {/* Arena */}
        <div className="grid grid-cols-2 gap-4 items-center justify-center p-3 border border-[var(--border)]/50 rounded-xl bg-[var(--bg)]/30 min-h-[120px]">
          <div>
            <span className="text-[8px] text-[var(--muted)] uppercase block mb-1">OPERATOR Choice</span>
            <div className="text-4xl">{userSelect ? RPS_CHOICES.find(c => c.id === userSelect)?.emoji : '⚡'}</div>
            <span className="text-[10px] font-bold text-[var(--muted)] mt-1 block">
              {userSelect ? RPS_CHOICES.find(c => c.id === userSelect)?.name : 'Standby'}
            </span>
          </div>
          <div className="border-l border-[var(--border)]/30">
            <span className="text-[8px] text-[var(--muted)] uppercase block mb-1">AI CORE Choice</span>
            <div className="text-4xl">{aiSelect ? RPS_CHOICES.find(c => c.id === aiSelect)?.emoji : '🧠'}</div>
            <span className="text-[10px] font-bold text-[var(--muted)] mt-1 block">
              {aiSelect ? RPS_CHOICES.find(c => c.id === aiSelect)?.name : 'Analyzing'}
            </span>
          </div>
        </div>

        {/* Results */}
        <div className="min-h-[30px] flex items-center justify-center text-sm font-black uppercase tracking-widest">
          {result && (
            <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} className={getResultStyle()}>
              {result === 'OVERRIDE' ? '⚡ MATRIX OVERRIDDEN (WIN)' : 
               result === 'BREACHED' ? '❌ DATA BREACHED (LOSS)' : '⇅ DUPLICATE SYNC (TIE)'}
            </motion.span>
          )}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-3 gap-2">
          {RPS_CHOICES.map(item => (
            <button
              key={item.id}
              disabled={animating}
              onClick={() => playRound(item.id)}
              className="py-4 border border-[var(--border)] hover:border-cyan-500/40 rounded-xl bg-[var(--card-bg)] hover:bg-cyan-500/5 transition-all flex flex-col items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-[9px] font-black uppercase text-[var(--muted)]">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
