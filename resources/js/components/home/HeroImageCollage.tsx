import React, { useState } from 'react';
import {Carousel} from "@/types/Carousel";
import {CarouselImageUrl} from "@/utils/carousel/carouselImageUrl";
import {usePage} from "@inertiajs/react";

const HeroImageCollage = () => {
    const [activeIndex, setActiveIndex] = useState<number>(NaN);
    const { carousels } = usePage<{ carousels: Carousel[] }>().props;

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-screen flex flex-row gap-0">
        {carousels.map((carousel, index) => (
          <div
            key={index}
            className={`relative overflow-hidden cursor-pointer transition-all duration-[1200ms] ease-in-out ${
              activeIndex === index ? 'flex-[6]' : activeIndex !== null ? 'flex-[0.8]' : 'flex-1'
            }`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(NaN)}
            style={{ transitionDuration: '1200ms'}}
          >
            {/* Gradient Overlay */}
            <div
              className={`absolute inset-0 pointer-events-none z-10 transition-all duration-[1200ms] ${
                activeIndex === index
                  ? 'bg-gradient-to-br from-black/0 to-black/0'
                  : 'bg-gradient-to-br from-black/60 to-black/30'
              }`}
            />

            {/* Radial Glow */}
            <div
              className={`absolute inset-0 pointer-events-none z-20 bg-radial-gradient transition-opacity duration-[1200ms] ${
                activeIndex === index ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transitionDuration: '1200ms', background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)'
              }}
            />

            {/* Image */}
            <img
              src={CarouselImageUrl(carousel.image)}
              alt={carousel.property_name}
              className={`w-full h-full object-cover transition-all ${
                activeIndex === index
                  ? 'scale-[1.15] rotate-2 grayscale-0 brightness-110'
                  : 'grayscale-[0.3] brightness-75'
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                transitionDuration: '1200ms'
              }}
            />

            {/* Text Overlay */}
            <div
              className={`absolute bottom-0 left-0 right-0 p-10 z-30 bg-gradient-to-t from-black/80 to-transparent transition-transform duration-[1200ms] ${
                activeIndex === index ? 'translate-y-0' : 'translate-y-full'
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                transitionDuration: '1200ms'
              }}
            >
              <h2
                className={`text-5xl font-bold text-white mb-2 transition-all duration-[1200ms] ${
                  activeIndex === index
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-75 translate-y-8'
                }`}
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                }}
              >
                {carousel.property_name}
              </h2>
              <p
                className={`text-xl text-white/95 transition-all duration-[1200ms] ${
                  activeIndex === index
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-8'
                }`}
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
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
