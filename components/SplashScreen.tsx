
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_NAME, TAGLINE } from '../constants';

interface SplashScreenProps {
  duration: number;
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ duration, onFinish }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onFinish, 1000);
    }, duration - 1000);
    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-[#050507] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
          transition={{ duration: 1 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="relative"
          >
            <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full" />
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic">
              {APP_NAME}
            </h1>
          </motion.div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.7 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-[0.5em]"
          >
            {TAGLINE}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
