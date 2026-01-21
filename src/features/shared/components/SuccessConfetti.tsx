'use client'

import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface SuccessConfettiProps {
  active: boolean;
}

// Generar partículas fuera del componente para que sean estables
const generateParticles = () => Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100 - 50,
  y: Math.random() * -100 - 50,
  delay: Math.random() * 0.3,
  duration: 1 + Math.random() * 0.5,
  rotation: Math.random() * 360,
  color: ['#00FFFF', '#22d3ee', '#06b6d4'][Math.floor(Math.random() * 3)]
}));

/**
 * Confetti visual minimalista para celebrar compras exitosas
 * Usa partículas animadas puras de CSS/Motion para evitar dependencias pesadas
 */
export const SuccessConfetti: React.FC<SuccessConfettiProps> = ({ active }) => {
  const particles = useMemo(() => generateParticles(), []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
          style={{ backgroundColor: particle.color }}
          initial={{ 
            x: 0, 
            y: 0, 
            opacity: 1, 
            scale: 1,
            rotate: 0
          }}
          animate={{
            x: particle.x * 10,
            y: particle.y * 5,
            opacity: 0,
            scale: 0,
            rotate: particle.rotation
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeOut'
          }}
        />
      ))}
    </div>
  );
};
