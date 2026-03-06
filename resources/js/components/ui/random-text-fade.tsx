import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface RandomTextFadeProps {
  text: string;
  className?: string;
  duration?: number;
  staggerDuration?: number;
  delay?: number;
}

const RandomTextFade: React.FC<RandomTextFadeProps> = ({
  text,
  className = "",
  duration = 0.5,
  staggerDuration = 1.5,
  delay = 0
}) => {
  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = (array: number[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Create random order for characters
  const randomOrder = useMemo(() => {
    const indices = text.split('').map((_, i) => i);
    return shuffleArray(indices);
  }, [text]);

  // Calculate delay for each character based on its position in random order
  const getCharDelay = (index: number) => {
    const position = randomOrder.indexOf(index);
    return delay + (position / text.length) * staggerDuration;
  };

  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
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

export default RandomTextFade;