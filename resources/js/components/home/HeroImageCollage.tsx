import {usePage} from "@inertiajs/react";
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import BlurText from '@/components/ui/shadcn-io/blur-text/index';
import type {Carousel} from "@/types/Carousel";
import {CarouselImageUrl} from "@/utils/carousel/carouselImageUrl";

const HeroImageCollage = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const { carousels } = usePage<{ carousels: Carousel[] }>().props;

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const dynamicCarousels = isMobile ? carousels.slice(0,3) : carousels;

  return (
      <section
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative flex h-screen w-full items-center justify-center overflow-hidden"
      >
          {/* Overlay */}
          {!isHovered && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                      duration: 3.0, // ← change this value (in seconds)
                      ease: 'easeOut',
                  }}
                  className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-black/20 p-4"
              >
                  <BlurText
                      className="text-blue-shadow text-3xl sm:text-5xl md:text-6xl font-bold text-white justify-center"
                      text="Shape Your Dreams With Alliance Builders Ltd."
                  />
              </motion.div>
          )}
          <div className="relative flex h-screen w-full flex-row gap-0">
              {dynamicCarousels.map((carousel, index) => (
                  <div
                      key={index}
                      className={`relative cursor-pointer overflow-hidden transition-all duration-1200 ease-in-out ${
                          activeIndex === index
                              ? 'flex-6'
                              : activeIndex !== null
                                ? 'flex-[0.8]'
                                : 'flex-1'
                      }`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                      style={{ transitionDuration: '1200ms' }}
                  >
                      {/* Gradient Overlay */}
                      <div
                          className={`pointer-events-none absolute inset-0 z-10 transition-all duration-[1200ms] ${
                              activeIndex === index
                                  ? 'bg-gradient-to-br from-black/0 to-black/0'
                                  : 'bg-gradient-to-br from-black/60 to-black/30'
                          }`}
                      />

                      {/* Radial Glow */}
                      <div
                          className={`bg-radial-gradient pointer-events-none absolute inset-0 z-20 transition-opacity duration-[1200ms] ${
                              activeIndex === index
                                  ? 'opacity-100'
                                  : 'opacity-0'
                          }`}
                          style={{
                              transitionDuration: '1200ms',
                              background:
                                  'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
                          }}
                      />

                      {/* Image */}
                      <img
                          src={CarouselImageUrl(carousel.image)}
                          alt={carousel.property_name}
                          className={`h-full w-full object-cover transition-all ${
                              activeIndex === index
                                  ? 'scale-[1.15] rotate-2 brightness-110 grayscale-0'
                                  : 'brightness-75 grayscale-[0.3]'
                          }`}
                          style={{
                              transitionTimingFunction:
                                  'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                              transitionDuration: '1200ms',
                          }}
                      />

                      {/* Text Overlay */}
                      <div
                          className={`absolute right-0 bottom-0 left-0 z-30 bg-gradient-to-t from-black/80 to-transparent px-10 py-20 sm:py-10 transition-transform duration-[1200ms] ${
                              activeIndex === index
                                  ? 'translate-y-0'
                                  : 'translate-y-full'
                          }`}
                          style={{
                              transitionTimingFunction:
                                  'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                              transitionDuration: '1200ms',
                          }}
                      >
                          <h2
                              className={`mb-2 text-5xl font-bold text-white transition-all duration-[1200ms] ${
                                  activeIndex === index
                                      ? 'translate-y-0 scale-100 opacity-100'
                                      : 'translate-y-8 scale-75 opacity-0'
                              }`}
                              style={{
                                  transitionTimingFunction:
                                      'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                              }}
                          >
                              {carousel.property_name}
                          </h2>
                          <p
                              className={`text-xl text-white/95 transition-all duration-[1200ms] ${
                                  activeIndex === index
                                      ? 'translate-x-0 opacity-100'
                                      : '-translate-x-8 opacity-0'
                              }`}
                              style={{
                                  transitionTimingFunction:
                                      'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                              }}
                          >
                              {carousel.description}
                          </p>
                      </div>
                  </div>
              ))}
          </div>
      </section>
  );
};

export default HeroImageCollage;
