import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import AudioSys from '../utils/AudioSystem';
import PUZZLE_IMG from '../assets/pic1.jpeg';
import TeddyBear from './ui/TeddyBear';

const ScenePuzzle = ({ onComplete }) => {
  const [pieces, setPieces] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isWin, setIsWin] = useState(false);

  useEffect(() => {
    let indices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setPieces(indices.map((correctVal) => ({ id: correctVal, correctVal })));
  }, []);

  const handlePieceClick = (index) => {
    if (isWin) return;
    if (selectedIdx === null) {
      setSelectedIdx(index);
      AudioSys.playChime(1500);
    } else {
      if (selectedIdx === index) {
        setSelectedIdx(null);
        return;
      }
      // Physical Swap in Array
      const newPieces = [...pieces];
      const temp = newPieces[selectedIdx];
      newPieces[selectedIdx] = newPieces[index];
      newPieces[index] = temp;
      
      setPieces(newPieces);
      setSelectedIdx(null);
      AudioSys.playPop();
      checkWin(newPieces);
    }
  };

  const checkWin = (currentPieces) => {
    const win = currentPieces.every((p, i) => p.correctVal === i);
    if (win) {
      setIsWin(true);
      AudioSys.playExplosion();
      if (window.createGlobalExplosion) {
        window.createGlobalExplosion(window.innerWidth / 2, window.innerHeight / 2, null, 100, true);
      }
    }
  };

  return (
    <>
      <div className="content-wrapper relative z-20 pointer-events-none">
        <AnimatePresence mode="wait">
          {!isWin ? (
            <motion.p 
              key="hint"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="subtitle-elegant"
            >
              Complete the picture to unlock the surprise.
            </motion.p>
          ) : (
            <motion.h2 
              key="win"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="title-cinematic font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-500 drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]"
            >
              Perfect!
            </motion.h2>
          )}
        </AnimatePresence>
      </div>
      <div className="puzzle-stage relative flex flex-col items-center justify-center p-4 sm:p-8 perspective-[1000px]">
        <motion.div 
          layout
          animate={{
            gap: isWin ? 0 : 4,
            scale: isWin ? 1.05 : 1,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="puzzle-grid relative bg-black/40 p-2 sm:p-4 rounded-xl border border-white/10"
          style={{
             boxShadow: isWin ? '0 0 50px rgba(212, 175, 55, 0.4), inset 0 0 20px rgba(212,175,55,0.2)' : '0 10px 30px rgba(0,0,0,0.5)',
             borderColor: isWin ? 'rgba(212, 175, 55, 0.5)' : 'rgba(255,255,255,0.1)'
          }}
        >
          {/* Win Shine Sweep Overlay */}
          {isWin && (
            <motion.div 
              className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-tr from-transparent via-white/40 to-transparent -skew-x-12"
              initial={{ x: "-150%" }}
              animate={{ x: "150%" }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
            />
          )}

          {pieces.map((p, i) => (
            <motion.div
              layout
              key={p.id}
              className={`puzzle-piece relative ${isWin ? 'cursor-default' : 'cursor-pointer hover:brightness-110'} overflow-hidden`}
              animate={{
                scale: selectedIdx === i ? 1.15 : 1,
                y: selectedIdx === i ? -10 : 0,
                rotateX: selectedIdx === i ? 10 : 0,
                rotateY: selectedIdx === i ? -10 : 0,
                borderRadius: isWin ? '0px' : '8px',
                boxShadow: selectedIdx === i 
                  ? '0 25px 50px rgba(0,0,0,0.8), 0 0 20px rgba(255,69,121,0.6)' 
                  : '0 4px 6px rgba(0,0,0,0.3)',
              }}
              whileHover={!isWin && selectedIdx !== i ? { scale: 1.02, zIndex: 5 } : {}}
              transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.8 }}
              style={{
                backgroundImage: `url(${PUZZLE_IMG})`,
                backgroundSize: '300% 300%',
                backgroundPosition: `${(p.correctVal % 3) * 50}% ${Math.floor(p.correctVal / 3) * 50}%`,
                backgroundRepeat: 'no-repeat',
                border: selectedIdx === i ? '3px solid #ff4579' : (isWin ? 'none' : '1px solid rgba(255,255,255,0.15)'),
                zIndex: selectedIdx === i ? 50 : 1,
              }}
              onClick={() => handlePieceClick(i)}
            >
              {/* Subtle glass reflection on pieces */}
              {!isWin && <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />}
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="bottom-button-container h-24 sm:h-32">
        {isWin && (
          <button onClick={onComplete} className="btn-luxury animate-fade-up shadow-[0_0_20px_rgba(212,175,55,0.4)] border-[#d4af37]/60">
            Unlock The Secret
          </button>
        )}
      </div>

      {/* Premium Teddy Bear Friends - Moved teddy3 up with topOffset */}
      <TeddyBear type="teddy3" delay={1.2} sizeMultiplier={1.4} topOffset={-25} />
      <TeddyBear type="teddy4" delay={2.2} sizeMultiplier={1.3} stackReserve={0.05} bottomOffset={45} />
    </>
  );
};

export default ScenePuzzle;
