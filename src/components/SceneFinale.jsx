import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Star } from 'lucide-react';
import AudioSys from '../utils/AudioSystem';

const CREDITS = [
  { role: "Starring", name: "Rashika - My Younger Sis" },
  { role: "Best at", name: "Winning Every Argument (Wait, No I Do)" },
  { role: "Special Talent", name: "Making Me Laugh Despite Everything" },
  { role: "Soundtrack", name: "Our Playful Banter & Inside Jokes" },
  { role: "Directed By", name: "Destiny (A.K.A Your Awesome Older Sibling)" }
];

const Constellation = ({ onComplete }) => {
  // Heart constellation points (0-100 scale)
  const points = [
    { id: 1, cx: 50, cy: 85 }, // Bottom point
    { id: 2, cx: 25, cy: 60 },
    { id: 3, cx: 10, cy: 35 },
    { id: 4, cx: 25, cy: 15 },
    { id: 5, cx: 50, cy: 30 }, // Top center dip
    { id: 6, cx: 75, cy: 15 },
    { id: 7, cx: 90, cy: 35 },
    { id: 8, cx: 75, cy: 60 },
  ];

  // Lines connecting the points
  const lines = [
    "M 50 85 L 25 60", "M 25 60 L 10 35", "M 10 35 L 25 15", "M 25 15 L 50 30",
    "M 50 30 L 75 15", "M 75 15 L 90 35", "M 90 35 L 75 60", "M 75 60 L 50 85",
    // Inner constellation web connections
    "M 25 60 L 50 30", "M 75 60 L 50 30", "M 25 15 L 75 15"
  ];

  useEffect(() => {
    // Play a magical chime when constellation starts
    setTimeout(() => {
      AudioSys.playChime(800);
    }, 500);
  }, []);

  return (
    <motion.div 
      className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
      onAnimationComplete={() => setTimeout(onComplete, 2500)}
    >
      {/* Glowing backdrop */}
      <motion.div 
        className="absolute inset-0 rounded-full bg-pink-500/10 blur-[50px]"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {/* Draw lines */}
        {lines.map((d, i) => (
          <motion.path
            key={`line-${i}`}
            d={d}
            stroke="url(#gold-gradient)"
            strokeWidth="0.5"
            strokeDasharray="2 1"
            fill="transparent"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1.5, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
        
        {/* Draw stars at vertices */}
        {points.map((p, i) => (
          <g key={`star-${p.id}`}>
            <motion.circle
              cx={p.cx}
              cy={p.cy}
              r="1.5"
              fill="#fff"
              className="drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.2, type: "spring" }}
            />
            {/* Twinkle effect */}
            <motion.circle
              cx={p.cx}
              cy={p.cy}
              r="3"
              fill="url(#gold-gradient)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 2, 1], opacity: [0, 0.8, 0] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity, repeatDelay: Math.random() * 2 }}
            />
          </g>
        ))}

        <defs>
          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>
      </svg>

      {/* Heartbeat pulse inside constellation */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 2, duration: 2 }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-1/2 h-1/2 bg-pink-500/20 blur-[20px] rounded-full"
        />
      </motion.div>
    </motion.div>
  );
};

const SceneFinale = ({ onRestart }) => {
  const [phase, setPhase] = useState('credits'); // 'credits' | 'constellation' | 'final'

  useEffect(() => {
    // No timers needed, all phase changes are triggered by animation completion
  }, []);

  return (
    <div className="relative flex w-full h-full flex-col items-center justify-center py-6 sm:py-10 md:py-12 overflow-hidden bg-black/40">
      <AnimatePresence>
        
        {/* Phase 1: Cinematic Credit Roll */}
        {phase === 'credits' && (
          <motion.div
            key="credits"
            className="absolute top-full left-0 w-full flex flex-col items-center text-center"
            initial={{ y: "0%" }}
            animate={{ y: "calc(-100% - 100vh)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 20, ease: "linear" }}
            onAnimationComplete={() => setPhase('constellation')}
          >
            <h2 
              className="text-3xl sm:text-5xl text-white font-cinzel uppercase tracking-[0.4em] drop-shadow-lg"
              style={{ marginBottom: '100px' }}
            >
              The Journey
            </h2>
            
            <div className="w-full flex flex-col items-center">
              {CREDITS.map((credit, i) => (
                <div key={i} className="flex flex-col items-center text-center" style={{ marginBottom: i === CREDITS.length - 1 ? '0px' : '100px' }}>
                  <span 
                    className="text-[10px] sm:text-sm text-white/60 uppercase tracking-[0.3em] font-medium"
                    style={{ marginBottom: '12px' }}
                  >
                    {credit.role}
                  </span>
                  <span className="text-xl sm:text-3xl text-white font-cinzel tracking-wide drop-shadow-md">
                    {credit.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Phase 2: Glowing Constellation */}
        {phase === 'constellation' && (
          <motion.div
            key="constellation"
            className="absolute inset-0 flex flex-col items-center justify-center w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8 }}
          >
            <Constellation onComplete={() => setPhase('final')} />
          </motion.div>
        )}

        {/* Phase 3: Final Message & Button */}
        {phase === 'final' && (
          <motion.div
            key="final"
            className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <p className="kicker-text pointer-events-none mb-4 tracking-[0.3em] text-pink-300/80">HAPPY BIRTHDAY</p>
            <h1 className="title-cinematic font-cinzel leading-tight pointer-events-none text-center bg-clip-text text-transparent bg-gradient-to-b from-white via-amber-100 to-amber-500 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]">
              May Your Life<br />
              Shine Brighter<br />
              Than These Stars
            </h1>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1.5 }}
              onClick={onRestart}
              className="mt-12 sm:mt-16 flex items-center gap-3 px-8 py-4 rounded-full bg-black/40 border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10 hover:border-[#d4af37] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-500 backdrop-blur-xl font-medium tracking-[0.2em] text-xs sm:text-sm uppercase"
            >
              <RefreshCw className="w-4 h-4" />
              Relive the Magic
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default SceneFinale;
