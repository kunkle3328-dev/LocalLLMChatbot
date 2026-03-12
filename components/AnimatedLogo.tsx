import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedLogo: React.FC<{ className?: string; animated?: boolean }> = ({ className, animated = true }) => {
  return (
    <motion.div 
      className={`relative flex items-center justify-center ${className}`}
      animate={animated ? { rotate: [0, 360] } : {}}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {/* Outer Glow */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-30"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Main Logo Container */}
      <div className="relative w-full h-full bg-[#050507] rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15),transparent_70%)]" />
        <span className="text-white font-black text-3xl italic tracking-tighter">N</span>
      </div>
    </motion.div>
  );
};
