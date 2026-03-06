import React from 'react';
import { motion } from 'framer-motion';

interface LineMeetProps {
  className?: string;
  delay?: number;
  duration?: number;
  lineColor?: string;
  lineHeight?: string;
  width?: string;  // New prop
}

const LineMeet: React.FC<LineMeetProps> = ({
  className = "",
  delay = 0,
  duration = 1,
  lineColor = "bg-primary",
  lineHeight = "h-0.5",
  width = "w-full"  // Default to full width
}) => {
  return (
    <div className={`relative ${width} ${className}`}>
      {/* Left line */}
      <motion.div
        className={`absolute left-0 ${lineColor} ${lineHeight}`}
        initial={{ width: 0 }}
        whileInView={{ width: '50%' }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{
          duration,
          delay,
          ease: "easeInOut"
        }}
      />
      
      {/* Right line */}
      <motion.div
        className={`absolute right-0 ${lineColor} ${lineHeight}`}
        initial={{ width: 0 }}
        whileInView={{ width: '50%' }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{
          duration,
          delay,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default LineMeet;