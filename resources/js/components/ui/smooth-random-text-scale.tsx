import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface SmoothRandomTextFadeProps {
  text: string;
  className?: string;
  duration?: number;
  totalDuration?: number;
  delay?: number;
}

const SmoothRandomTextFade: React.FC<SmoothRandomTextFadeProps> = ({
  text,
  className = "",
  duration = 0.8,
  totalDuration = 2,
  delay = 0
}) => {
  const shuffleArray = (array: number[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const randomOrder = useMemo(() => {
    const indices = text.split('').map((_, i) => i);
    return shuffleArray(indices);
  }, [text]);

  const getCharDelay = (index: number) => {
    const position = randomOrder.indexOf(index);
    const stagger = (totalDuration - duration) / Math.max(text.length - 1, 1);
    return delay + (position * stagger);
  };

  return (
    <span>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          className={className}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{
            duration,
            delay: getCharDelay(index),
            ease: "easeOut"
          }}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

export default SmoothRandomTextFade;