import React, { useEffect, useMemo, useRef, useState } from 'react';

interface ParallaxBackgroundProps {
  image?: string;
  images?: string[];
  speed?: number;
  overlay?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  image,
  images,
  speed = 0.5,
  overlay = true,
  className = '',
  children
}) => {
  const [offsetY, setOffsetY] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Negative when the section scrolls past the top
      const localOffset = -rect.top;
      setOffsetY(localOffset);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
  const totalImages = images && images.length ? images.length : 1;
  const sectionHeight = Math.max(1, viewportHeight);
  const progress = (offsetY / sectionHeight) % 1; // 0..1 within each viewport height
  const currentIndex = images && images.length ? Math.floor(offsetY / sectionHeight) % totalImages : 0;
  const nextIndex = images && images.length ? (currentIndex + 1) % totalImages : 0;

  const currentImage = useMemo(() => {
    if (images && images.length) return images[currentIndex];
    return image as string;
  }, [images, currentIndex, image]);

  const nextImage = useMemo(() => {
    if (images && images.length) return images[nextIndex];
    return image as string;
  }, [images, nextIndex, image]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Parallax Background Layers */}
      <div className="absolute inset-0">
        {/* Current layer */}
        <div
          className="absolute inset-0 w-full h-[140%] bg-cover bg-center bg-no-repeat will-change-transform pointer-events-none"
          style={{
            backgroundImage: `url(${currentImage})`,
            transform: `translateY(${offsetY * speed}px) scale(1.1)`,
            opacity: 1 - progress,
            transition: 'opacity 150ms linear',
          }}
        />
        {/* Next layer for crossfade */}
        <div
          className="absolute inset-0 w-full h-[140%] bg-cover bg-center bg-no-repeat will-change-transform pointer-events-none"
          style={{
            backgroundImage: `url(${nextImage})`,
            transform: `translateY(${offsetY * speed}px) scale(1.1)`,
            opacity: progress,
            transition: 'opacity 150ms linear',
          }}
        />
      </div>
      
      {/* Animated Overlay Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full animate-wave blur-xl" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-accent/10 rounded-full animate-float blur-lg" />
        <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-secondary/10 rounded-full animate-parallax-slow blur-2xl" />
      </div>

      {/* Dark Overlay for Better Text Readability */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/40" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ParallaxBackground;