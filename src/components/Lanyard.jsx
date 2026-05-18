import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu } from 'lucide-react';
import './Lanyard.css'; // CRITICAL: Import the custom card landscape styles!

// ---------------------------------------------------------------- //
// Scalable SVG Vector Items                                        //
// ---------------------------------------------------------------- //
const SVGStrawberry = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 filter drop-shadow-md animate-bounce">
    {/* Stem */}
    <path d="M12 2 C13 5 15 5 17 4 C15 6 13 6 12 8 C11 6 9 6 7 4 C9 5 11 5 12 2 Z" fill="#2ed573" />
    {/* Berry Body */}
    <path d="M12 7 C18 7 19 12 17 17 C15 20 13 22 12 22 C11 22 9 20 7 17 C5 12 6 7 12 7 Z" fill="#ff4757" />
    {/* Seeds */}
    <circle cx="10" cy="11" r="0.6" fill="#ffd15c" />
    <circle cx="14" cy="11" r="0.6" fill="#ffd15c" />
    <circle cx="12" cy="14" r="0.6" fill="#ffd15c" />
    <circle cx="9" cy="15" r="0.6" fill="#ffd15c" />
    <circle cx="15" cy="15" r="0.6" fill="#ffd15c" />
    <circle cx="12" cy="18" r="0.6" fill="#ffd15c" />
  </svg>
);

const SVGHeart = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 filter drop-shadow-md animate-pulse">
    <path 
      d="M12 21.35 l-1.45-1.32 C5.4 15.36 2 12.28 2 8.5 C2 5.42 4.42 3 7.5 3 c1.74 0 3.41 0.81 4.5 2.09 C13.09 3.81 14.76 3 16.5 3 C19.58 3 22 5.42 22 8.5 c0 3.78-3.4 6.86-8.55 11.54 L12 21.35 z" 
      fill="#ff4757" 
    />
  </svg>
);

// ---------------------------------------------------------------- //
// Full-Card Vector Meadow Landscape Simulation                     //
// ---------------------------------------------------------------- //
const TamagotchiCard = () => {
  const [state, setState] = useState('idle'); // idle, walking, eating, dancing, sleeping
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [posX, setPosX] = useState(22); // Horizontal percentage (perfectly centered for the large vector cat)
  const [showItem, setShowItem] = useState(null); // 'strawberry' or 'heart'
  const [itemX, setItemX] = useState(50);
  const [zzzList, setZzzList] = useState([]); // Floating Zzz text bubbles
  const zzzCounter = useRef(0);

  // Status lights
  const isFoodLit = state === 'eating' || showItem === 'strawberry';
  const isPlayLit = state === 'dancing' || showItem === 'heart';
  const isSleepLit = state === 'sleeping';

  // Sound effects synthesiser using Web Audio API
  const playRetroBeep = (freq = 880, duration = 0.08, type = 'square') => {
    if (typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("AudioContext blocked:", e);
    }
  };

  const playHappyJingle = () => {
    if (typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 - E5 - G5 - C6 arpeggio

      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.08);

        gain.gain.setValueAtTime(0.03, audioCtx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.08 + 0.14);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + i * 0.08);
        osc.stop(audioCtx.currentTime + i * 0.08 + 0.14);
      });
    } catch (e) {}
  };

  const playSleepChime = () => {
    if (typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [440.00, 349.23, 261.63]; // A4 - F4 - C4 falling sleepy chime

      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle'; // Soft sound
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.15);

        gain.gain.setValueAtTime(0.05, audioCtx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.15 + 0.25);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + i * 0.15);
        osc.stop(audioCtx.currentTime + i * 0.15 + 0.25);
      });
    } catch (e) {}
  };

  // AI Wandering loops for the pet
  useEffect(() => {
    if (state === 'sleeping' || state === 'eating' || state === 'dancing') return;

    // Timer to randomly walk or stand idle
    const behaviorTimer = setInterval(() => {
      const chance = Math.random();
      if (chance < 0.45) {
        setState('walking');
        setDirection(Math.random() > 0.5 ? 1 : -1);
      } else {
        setState('idle');
      }
    }, 4500);

    return () => clearInterval(behaviorTimer);
  }, [state]);

  // Pet physical position slider for walking (large bounds limit)
  useEffect(() => {
    if (state !== 'walking') return;

    const walkSpeed = 1.3;
    const walkTimer = setInterval(() => {
      setPosX(curr => {
        let next = curr + direction * walkSpeed;
        
        // Turn around on wider borders
        if (next >= 48) {
          setDirection(-1);
          return 48;
        }
        if (next <= 4) {
          setDirection(1);
          return 4;
        }
        return next;
      });
    }, 85);

    return () => clearInterval(walkTimer);
  }, [state, direction]);

  // Floating Zzz animations in sleep mode
  useEffect(() => {
    if (state !== 'sleeping') {
      setZzzList([]);
      return;
    }

    const zInterval = setInterval(() => {
      const id = zzzCounter.current++;
      setZzzList(prev => [...prev, { id, left: posX + 30 }]);

      // Decay/Float Zzz texts
      setTimeout(() => {
        setZzzList(prev => prev.filter(z => z.id !== id));
      }, 2500);
    }, 1200);

    return () => clearInterval(zInterval);
  }, [state, posX]);

  // Action: Feed the Pet
  const handleFeed = () => {
    if (state === 'eating') return;
    
    // Wake up if sleeping
    if (state === 'sleeping') {
      playRetroBeep(660, 0.1);
      setState('idle');
      return;
    }

    playRetroBeep(523.25, 0.08); // Sweet start beep
    setState('idle'); // Interrupt walking
    
    // Drop strawberry on screen
    const targetX = posX > 26 ? 8 : 42;
    setItemX(targetX);
    setShowItem('strawberry');

    // Make pet run towards food
    setTimeout(() => {
      setDirection(posX < targetX ? 1 : -1);
      setState('walking');
      
      // Keep walking until overlapping item
      const approachTimer = setInterval(() => {
        setPosX(curr => {
          const diff = targetX - curr;
          if (Math.abs(diff) < 4) {
            clearInterval(approachTimer);
            // Arrived! Eat the strawberry
            setState('eating');
            playRetroBeep(330, 0.05, 'triangle');
            
            // Chew frame eating animation
            let munchCount = 0;
            const chewInterval = setInterval(() => {
              playRetroBeep(260 + (munchCount % 2) * 60, 0.04, 'triangle');
              munchCount++;
              if (munchCount >= 6) {
                clearInterval(chewInterval);
                setShowItem(null); // Eat strawberry
                playHappyJingle();
                setState('dancing'); // Dance out of joy!
                
                setTimeout(() => {
                  setState('idle');
                }, 2000);
              }
            }, 350);

            return curr;
          }
          return curr + (diff > 0 ? 2 : -2);
        });
      }, 100);
    }, 400);
  };

  // Action: Play / Dance
  const handlePlay = () => {
    if (state === 'dancing' || state === 'eating') return;

    // Wake up if sleeping
    if (state === 'sleeping') {
      playRetroBeep(660, 0.1);
      setState('idle');
      return;
    }

    playHappyJingle();
    setState('dancing');
    
    // Show pixel hearts floating out
    setShowItem('heart');
    setItemX(posX + 10);

    setTimeout(() => {
      setShowItem(null);
      setState('idle');
    }, 2500);
  };

  // Action: Toggle Sleep
  const handleSleepToggle = () => {
    if (state === 'sleeping') {
      // Wake up
      playRetroBeep(783.99, 0.08);
      setState('idle');
    } else {
      // Put to sleep
      playSleepChime();
      setState('sleeping');
    }
  };

  return (
    <div className={`pixel-card-landscape select-none w-full h-full relative ${state === 'sleeping' ? 'sleep-mode' : ''}`}>
      
      {/* Warm twinkling gold stars */}
      <span className="pixel-star" style={{ top: '15%', left: '15%', animationDelay: '0.2s' }}>✦</span>
      <span className="pixel-star" style={{ top: '35%', left: '72%', animationDelay: '1.2s' }}>✦</span>
      <span className="pixel-star" style={{ top: '50%', left: '10%', animationDelay: '0.7s' }}>✦</span>
      <span className="pixel-star" style={{ top: '12%', left: '44%', animationDelay: '1.8s' }}>✦</span>
      <span className="pixel-star" style={{ top: '42%', left: '30%', animationDelay: '2.3s' }}>✦</span>
      
      <span className="pixel-moon">🌙</span>

      {/* Floating Status Indicator Overlay (Top Left) */}
      <div className="pixel-status-bar">
        <span className={`pixel-status-icon ${isFoodLit ? 'active' : ''}`}>🥣</span>
        <span className={`pixel-status-icon ${isPlayLit ? 'active' : ''}`}>💖</span>
        <span className={`pixel-status-icon ${isSleepLit ? 'active' : ''}`}>💤</span>
      </div>

      {/* Grassy Meadow Path bottom layer */}
      <div className="pixel-meadow">
        <span className="meadow-flower" style={{ left: '10%', animationDelay: '0.4s' }}>🌸</span>
        <span className="meadow-flower" style={{ left: '42%', animationDelay: '1.4s' }}>🌸</span>
        <span className="meadow-flower" style={{ left: '75%', animationDelay: '0.9s' }}>🌸</span>
      </div>

      {/* Huge Vector Pet Active Screen Space */}
      <div className="pixel-pet-area">
        {/* Floating Hearts/Strawberry Food item */}
        {showItem === 'strawberry' && (
          <div 
            className="absolute bottom-[24px] transition-all duration-300 z-10"
            style={{ left: `${itemX}%` }}
          >
            <SVGStrawberry />
          </div>
        )}
        {showItem === 'heart' && (
          <div 
            className="absolute bottom-[80px] transition-all duration-[2000ms] ease-out translate-y-[-24px] opacity-0 z-10"
            style={{ left: `${itemX}%`, opacity: 0.95 }}
          >
            <SVGHeart />
          </div>
        )}

        {/* Sleeping Floating Zzz */}
        {zzzList.map(z => (
          <span
            key={z.id}
            className="absolute text-[12px] font-black text-white/80 pointer-events-none select-none animate-ping z-10"
            style={{
              left: `${z.left}%`,
              bottom: `95px`,
              transform: `translateY(-30px) scale(1.35)`,
              transition: 'all 2s ease-out',
            }}
          >
            Zzz
          </span>
        ))}

        {/* CUTE SMOOTH VECTOR WHITE CAT (From Special Gift Room Door) */}
        <div 
          className={`cute-vector-cat ${state} transition-all duration-100 ease-linear z-10`}
          style={{ 
            left: `${posX}%`,
            transform: `scaleX(${direction})` 
          }}
        >
          {/* Ears */}
          <div className="vector-cat-ear left">
            <div className="vector-cat-ear-inner"></div>
          </div>
          <div className="vector-cat-ear right">
            <div className="vector-cat-ear-inner"></div>
          </div>
          
          {/* Face Elements */}
          <div className="vector-cat-face">
            <div className={`vector-cat-eye left ${state === 'sleeping' ? 'closed' : ''}`}></div>
            <div className={`vector-cat-eye right ${state === 'sleeping' ? 'closed' : ''}`}></div>
            <div className="vector-cat-nose"></div>
            <div className={`vector-cat-mouth ${state === 'eating' ? 'open' : ''}`}></div>
            <div className="vector-cat-blush left"></div>
            <div className="vector-cat-blush right"></div>
          </div>

          {/* Wagging Tail */}
          <div className="vector-cat-tail"></div>

          {/* Sleeping cap overlay */}
          {state === 'sleeping' && (
            <div className="absolute -top-[14px] left-[18px] rotate-[-12deg] z-10 pointer-events-none scale-[0.8]">
              <svg viewBox="0 0 32 32" className="w-10 h-10 filter drop-shadow-sm">
                <path d="M 6,24 C 6,24 10,12 20,10 C 26,9 28,16 28,16 L 22,24 Z" fill="#54a0ff" />
                <circle cx="28" cy="16" r="3" fill="#ffffff" />
                <rect x="5" y="22" width="18" height="4" rx="2" fill="#ffffff" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Sleek Floating Glass Dock Controller at bottom (pops up active on card hover) */}
      <div className="sleek-glass-controller">
        <button 
          className="controller-btn" 
          onClick={handleFeed}
          title="Feed Strawberry"
        >
          🥣
        </button>
        <button 
          className="controller-btn" 
          onClick={handlePlay}
          title="Play Happy"
        >
          💖
        </button>
        <button 
          className="controller-btn" 
          onClick={handleSleepToggle}
          title="Toggle Sleep"
        >
          💤
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- //
// Standalone Lanyard Hanging Card Scene                            //
// ---------------------------------------------------------------- //
const Lanyard = () => {
  return (
    <div className="lanyard-standalone-wrapper relative flex justify-center items-start pt-6 md:pt-10 h-[300px] sm:h-[350px] md:h-[400px] pointer-events-none">
      <motion.div 
        className="relative group cursor-grab active:cursor-grabbing pointer-events-auto"
        animate={{ y: [-10, 10, -10], rotate: [-1, 1, -1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ y: -15, scale: 1.05, rotate: 0 }}
        style={{ transformOrigin: "top center" }}
      >
        {/* Thick Lanyard Strap */}
        <div className="absolute -top-[300px] sm:-top-[350px] md:-top-[400px] left-1/2 -translate-x-1/2 w-6 sm:w-8 md:w-12 h-[300px] sm:h-[350px] md:h-[400px] bg-highlight z-20 flex flex-col items-center justify-end pb-4 sm:pb-6 md:pb-8 overflow-hidden border-x border-white/5 shadow-[inset_0_4px_15px_rgba(0,0,0,0.5)]">
          {/* Subtle woven texture */}
          <div className="absolute inset-0 opacity-10 flex space-x-[1px] md:space-x-[2px] justify-center pointer-events-none">
            <div className="w-[1px] h-full bg-white"></div>
            <div className="w-[1px] h-full bg-white"></div>
            <div className="w-[1px] h-full bg-transparent mx-0.5"></div>
            <div className="w-[1px] h-full bg-white"></div>
            <div className="w-[1px] h-full bg-white"></div>
          </div>
          {/* Repeating Logos */}
          <div className="flex flex-col items-center space-y-8 sm:space-y-12 md:space-y-16 text-white/20 z-10 pointer-events-none">
            <Terminal size={10} className="sm:w-[12px] sm:h-[12px] md:w-[14px] md:h-[14px]" />
            <Cpu size={10} className="sm:w-[12px] sm:h-[12px] md:w-[14px] md:h-[14px]" />
            <Terminal size={10} className="sm:w-[12px] sm:h-[12px] md:w-[14px] md:h-[14px]" />
          </div>
        </div>
        
        {/* Lanyard Hardware / ID Clasp */}
        <div className="absolute -top-[35px] sm:-top-[45px] md:-top-[60px] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center drop-shadow-[0_8px_8px_rgba(0,0,0,0.25)] cursor-pointer pointer-events-none group-hover:-translate-y-1 transition-transform duration-300">
          {/* Strap Fold over the D-Ring */}
          <div className="w-6 sm:w-8 md:w-12 h-4 sm:h-5 md:h-7 bg-highlight rounded-b-[3px] md:rounded-b-[4px] shadow-md z-20 flex flex-col justify-end items-center pb-0.5 md:pb-1 border-b border-black/50">
            <div className="w-4 sm:w-5 md:w-8 h-[1px] bg-white/10 mb-[2px] md:mb-1"></div>
            <div className="w-4 sm:w-5 md:w-8 h-[1px] bg-white/10"></div>
          </div>
          
          {/* D-Ring Loop */}
          <div className="w-5 sm:w-6 md:w-9 h-4 sm:h-5 md:h-7 border-[2px] sm:border-[3px] md:border-[4px] border-[#222] rounded-b-[6px] sm:rounded-b-[8px] md:rounded-b-[12px] -mt-1.5 md:-mt-3 z-10 shadow-sm relative backdrop-blur-sm"></div>
          
          {/* Swivel Mechanism */}
          <div className="w-1.5 sm:w-2 md:w-3 h-3 sm:h-4 md:h-[18px] bg-gradient-to-b from-[#333] to-[#111] rounded-[1px] md:rounded-[2px] z-20 -mt-1 md:-mt-2 border border-[#444] relative shadow-md">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[1px] md:h-[2px] bg-[#1a1a1a] rounded-full"></div>
          </div>

          {/* Clasp Hook */}
          <div className="w-2.5 sm:w-3 md:w-[18px] h-5 sm:h-6 md:h-[35px] border-[2px] sm:border-[3px] md:border-[4px] border-[#222] rounded-b-[6px] sm:rounded-b-[8px] md:rounded-b-[10px] border-t-0 -mt-0.5 md:-mt-1 z-10 relative box-border">
            <div className="absolute right-[-2.5px] sm:right-[-3px] md:right-[-4px] top-1 w-[2.5px] sm:w-[3px] md:w-[4px] h-[55%] bg-[#2a2a2a] rounded-full border-l border-white/5"></div>
          </div>
        </div>

        {/* Decorative Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-gold/5 rounded-[1.5rem] md:rounded-[2rem] rotate-3 group-hover:rotate-6 transition-all duration-500 scale-95 md:scale-100 blur-[2px] opacity-80"></div>

        {/* The Main Card Container */}
        <div className="relative z-10 w-[160px] h-[220px] sm:w-[200px] sm:h-[280px] md:w-[280px] md:h-[360px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-white/95 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08),_0_0_30px_rgba(255,255,255,0.8)_inset] group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12),_0_0_25px_rgba(255,255,255,0.9)_inset] p-2 pt-6 sm:p-3 sm:pt-8 md:p-4 md:pt-12 transition-all duration-500">
          {/* The Punch Hole */}
          <div className="absolute top-2 sm:top-3 md:top-4 left-1/2 -translate-x-1/2 w-8 sm:w-10 md:w-14 h-1.5 sm:h-2 md:h-[10px] bg-black/10 rounded-full shadow-[inset_0_4px_6px_rgba(0,0,0,0.4),_0_1px_1px_rgba(255,255,255,0.9)] border border-black/5 z-20 pointer-events-none"></div>

          <div className="w-full h-full rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden relative bg-transparent flex items-center justify-center">
            
            {/* Full-Screen Meadow Landscape with Smooth Vector Cat */}
            <TamagotchiCard />

            {/* Overlapping 3D Flying Butterflies in Front of Screen */}
            <div className="card-butterfly b-1">
              <div className="card-butterfly-wings">
                <div className="card-butterfly-body"></div>
                <div className="card-butterfly-wing left" style={{ color: '#ffcbd5', backgroundColor: 'rgba(255, 203, 213, 0.45)' }}></div>
                <div className="card-butterfly-wing right" style={{ color: '#ffcbd5', backgroundColor: 'rgba(255, 203, 213, 0.45)' }}></div>
              </div>
            </div>

            <div className="card-butterfly b-2">
              <div className="card-butterfly-wings">
                <div className="card-butterfly-body"></div>
                <div className="card-butterfly-wing left" style={{ color: '#ffd15c', backgroundColor: 'rgba(255, 209, 92, 0.45)' }}></div>
                <div className="card-butterfly-wing right" style={{ color: '#ffd15c', backgroundColor: 'rgba(255, 209, 92, 0.45)' }}></div>
              </div>
            </div>

          </div>

          {/* Floating Badge */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 bg-gold/95 backdrop-blur-md text-white px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl shadow-lg z-30 pointer-events-none"
          >
            <span className="text-[10px] sm:text-xs md:text-sm font-black">99.9%</span>
            <span className="text-[6px] sm:text-[7px] md:text-[8px] ml-1 uppercase font-bold text-white/80 leading-tight">Uptime</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Lanyard;
