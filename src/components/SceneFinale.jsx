import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const SceneFinale = ({ onRestart }) => {
  return (
    <div className="content-wrapper pointer-events-auto py-6 sm:py-10 md:py-14 flex flex-col items-center">
      <p className="kicker-text pointer-events-none">Happy Birthday</p>
      <h1 className="title-cinematic font-cinzel leading-tight pointer-events-none">
        May Your Life<br />
        Shine Brighter<br />
        Than These Stars
      </h1>
      
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={onRestart}
        className="mt-12 sm:mt-16 flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md font-medium tracking-wide text-xs sm:text-sm"
      >
        <RefreshCw className="w-4 h-4" />
        Relive the Magic
      </motion.button>
    </div>
  );
};

export default SceneFinale;
