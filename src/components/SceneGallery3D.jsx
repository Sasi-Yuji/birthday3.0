import React, { useState } from 'react';
import { ScrollTriggered } from "./ui/stack-card";
import { motion, AnimatePresence } from 'framer-motion';

const SceneGallery3D = ({ onComplete }) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = (e) => {
    if (e.target.scrollTop > 50 && !hasScrolled) {
      setHasScrolled(true);
    }
  };

  return (
    <div
      onScroll={handleScroll}
      className="scene-gallery-3d-root w-full h-full relative bg-transparent overflow-y-auto overflow-x-hidden flex flex-col items-center pb-32"
    >
      {/* Background VFX */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 fixed">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/20 via-transparent to-blue-900/20" />
      </div>

      <div className="z-10 w-full flex flex-col items-center pt-20">
        <h1 className="gallery3d-title flex flex-nowrap justify-center font-cinzel font-black text-white drop-shadow-2xl text-2xl sm:text-4xl mb-4">
          ✨ CHRONICLES OF JOY ✨
        </h1>
        <p className="gallery3d-subtitle text-[9px] sm:text-xs tracking-[0.4em] text-white/90 font-bold uppercase mb-10">
          💖 A TIMELESS CELEBRATION 💫
        </p>

        <ScrollTriggered />
      </div>

      {/* BUTTON - BOTTOM */}
      <div className="z-40 mt-20 mb-20 flex justify-center w-full">
        <button
          onClick={onComplete}
          className="btn-luxury px-10 py-4 sm:px-16 sm:py-5 animate-fade-up shadow-2xl transition-transform hover:scale-105 active:scale-95"
        >
          CONTINUE THE JOURNEY ➔
        </button>
      </div>



    </div>
  );
};

export default SceneGallery3D;
