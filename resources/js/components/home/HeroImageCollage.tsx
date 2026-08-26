import { Link, usePage } from "@inertiajs/react";
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import BlurText from '@/components/ui/shadcn-io/blur-text/index';
import type {Carousel} from "@/types/Carousel";
import {CarouselImageUrl} from "@/utils/carousel/carouselImageUrl";

interface ProjectItem {
    id: number;
    name: string;
    slug: string;
}

const HeroImageCollage = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const { carousels = [], projects = [] } = usePage<{ carousels?: Carousel[]; projects?: ProjectItem[] }>().props;

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const dynamicCarousels = isMobile ? (carousels ?? []).slice(0, 3) : (carousels ?? []);

  return (
      <section
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative flex h-screen min-h-screen w-full items-center justify-center overflow-hidden"
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
          <div className="relative flex h-full w-full flex-row gap-0">
              {dynamicCarousels.map((carousel, index) => {
                  const targetSlug = carousel.project?.slug || projects.find(p => p.name.toLowerCase().trim() === carousel.property_name?.toLowerCase().trim())?.slug;

                  return (
                  <div
                      key={index}
                      className={`relative overflow-hidden transition-all duration-1200 ease-in-out ${
                          activeIndex === index
                              ? 'flex-[6]'
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
                      <motion.img
                          src={CarouselImageUrl(carousel.image)}
                          alt={carousel.property_name}
                          className="h-full w-full object-cover"
                          initial={false}
                          animate={
                              activeIndex === index
                                  ? {
                                        scale: 1.15,
                                        rotate: [0, 2.5, 0],
                                        filter: 'brightness(1.1) grayscale(0%)',
                                    }
                                  : {
                                        scale: 1,
                                        rotate: 0,
                                        filter: 'brightness(0.75) grayscale(0.3)',
                                    }
                          }
                          transition={{
                              duration: 1.2,
                              ease: 'easeOut',
                          }}
                      />

                      {/* Text Overlay */}
                      <div
                          className={`absolute right-0 bottom-0 left-0 z-30 bg-gradient-to-t from-black/95 via-black/60 to-transparent px-8 sm:px-12 py-16 sm:py-10 transition-transform duration-[1200ms] ${
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
                          {targetSlug ? (
                              <Link
                                  href={`/${targetSlug}`}
                                  className="group/title block max-w-fit"
                              >
                                  <div className="flex items-center gap-3 mb-2">
                                      <h2
                                          className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white group-hover/title:text-amber-400 transition-all duration-500 ${
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
                                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 group-hover/title:bg-amber-400 group-hover/title:text-slate-950 border border-white/20 group-hover/title:border-amber-400 text-white backdrop-blur-md transition-all duration-500 shadow-lg group-hover/title:scale-110 shrink-0">
                                          <ArrowUpRight className="w-5 h-5 group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-transform" />
                                      </div>
                                  </div>
                              </Link>
                          ) : (
                              <h2
                                  className={`mb-2 text-3xl sm:text-4xl md:text-5xl font-bold text-white transition-all duration-[1200ms] ${
                                      activeIndex === index
                                          ? 'translate-y-0 scale-100 opacity-100'
                                          : 'translate-y-8 scale-75 opacity-0'
                                  }`}
                              >
                                  {carousel.property_name}
                              </h2>
                          )}
                          
                          <p
                              className={`text-base sm:text-lg text-white/90 max-w-2xl transition-all duration-[1200ms] ${
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
              );
              })}
          </div>
      </section>
  );
};

export default HeroImageCollage;
