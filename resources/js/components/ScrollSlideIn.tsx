import React from 'react';
import { motion } from 'framer-motion';

interface ScrollSlideInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  distance?: number;
  once?: boolean;
}

const ScrollSlideIn: React.FC<ScrollSlideInProps> = ({ 
  children, 
  className = "",
  delay = 0,
  duration = 0.6,
  direction = 'left',
  distance = 100,
  once = true
}) => {
  // Determine initial position based on direction
  const getInitialPosition = () => {
    switch(direction) {
      case 'left':
        return { opacity: 0, x: -distance };
      case 'right':
        return { opacity: 0, x: distance };
      case 'top':
        return { opacity: 0, y: -distance };
      case 'bottom':
        return { opacity: 0, y: distance };
      default:
        return { opacity: 0, x: -distance };
    }
  };

  return (
    <motion.div
      className={className}
      initial={getInitialPosition()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ 
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollSlideIn;