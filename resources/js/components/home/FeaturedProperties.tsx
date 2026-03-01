import { Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import ScrollAnimation from '../ScrollAnimation';
import PropertyCard from '../PropertyCard';
import LineMeet from '../ui/line-meet';
import SmoothRandomTextScale from '../ui/smooth-random-text-scale';
import {properties} from "@/routes";
import {usePage} from "@inertiajs/react";
import {ProjectThumb} from "@/types/ProjectThumb";
import { useFavorites } from '@/hooks/useFavorites';

const FeaturedProperties = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const {projects} = usePage<{projects: ProjectThumb[]}>().props;
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'For Sale': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Pre-Launch': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Ready to Move': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <section className="py-20 px-4 relative min-h-screen bg-black">


      {/* Overlay for better contrast */}
      <div className="absolute inset-0 backdrop-blur-[1px]"></div>

      <div className="max-w-7xl mx-auto relative z-0">
        {/* Section Header */}
        <ScrollAnimation>
          <div className="text-center mb-20">
            <div className="inline-block">
              <h2 className="pb-4 text-5xl lg:text-7xl font-medium tracking-wide mb-6">
                <SmoothRandomTextScale
                  text="Featured Properties"
                  className="text-white"
                  duration={1.2}
                  delay={.6}
                />
              </h2>

              <LineMeet lineColor='bg-blue-400' />
            </div>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mt-8 leading-relaxed">
              Discover our handpicked selection of premium properties that represent the finest in luxury living and investment opportunities
            </p>
          </div>
        </ScrollAnimation>

        {/* Design 2: Full Image Coverage - Second Set (with holographic) */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {projects.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                index={index}
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                isFavorite={isFavorite(property.id)}
                toggleFavorite={() => toggleFavorite(property.id)}
              />
            ))}
          </div>
        </div>


        {/* Futuristic CTA Section */}
        <ScrollAnimation delay={0.6}>
          <div className="text-center">
            <div className="relative inline-block">
              <Button size="lg" className="bg-[#0d4d90] text-white shadow-2xl border-0 rounded-2xl px-8 py-4 text-lg font-semibold backdrop-blur-md transform hover:scale-105 transition-all duration-300">
                <Link href={properties.url()} className="relative z-10">
                    Explore All Properties
                </Link>
              </Button>

            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default FeaturedProperties;
