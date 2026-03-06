import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import heroProperty1 from "@/assets/hero-property-1.jpg";
import heroProperty2 from "@/assets/hero-property-2.jpg";
import abstractBg1 from "../assets/abstract-bg-1.jpg";
import abstractBg2 from "../assets/abstract-bg-2.jpg";
import abstractBg3 from "../assets/abstract-bg-3.jpg";
import houseVideo from "../assets/house.mp4";
// Removed ParallaxBackground usage in hero; rendering media directly

import interior from '../assets/interior.png';
import skyView from '../assets/sky-view.png';
import skyView2 from '../assets/sky-view2.png';
import property from '../assets/property.jpg';
import property2 from '../assets/property-2.jpg';
import interiorVideo from '../assets/interior.mp4';
import skyViewVideo from '../assets/sky-scraper.mp4';
import cityBuilding from '../assets/city-building.mp4';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const touchStartXRef = useRef<number | null>(null);
  const directionRef = useRef<"next" | "prev">("next");

  const slides: Array<{
    type: 'image' | 'video';
    src: string;
    title: string;
    subtitle: string;
    position: 'top-left' | 'top-right' | 'center-left' | 'center-right' | 'bottom-left' | 'bottom-right';
  }> = [
    { type: 'video', src: interiorVideo, title: 'Refined Interiors', subtitle: 'Spaces crafted for modern living', position: 'center-left' },
    { type: 'image', src: interior, title: 'Luxury That Inspires', subtitle: 'Design-forward residences', position: 'top-right' },
    { type: 'video', src: skyViewVideo, title: 'Skyline Perspectives', subtitle: 'Elevated urban experiences', position: 'bottom-left' },
    { type: 'image', src: skyView, title: 'Breathtaking Views', subtitle: 'Where city meets sky', position: 'center-right' },
    { type: 'video', src: houseVideo, title: 'Moments at Home', subtitle: 'Comfort, warmth, belonging', position: 'top-left' },
    { type: 'image', src: skyView2, title: 'Above It All', subtitle: 'Panoramas that amaze', position: 'bottom-right' },
    { type: 'video', src: cityBuilding, title: 'Iconic Architecture', subtitle: 'Timeless structures, modern life', position: 'center-left' },
    { type: 'image', src: property, title: 'Distinctive Properties', subtitle: 'Curated for discerning tastes', position: 'top-right' },
    { type: 'image', src: property2, title: 'Crafted Excellence', subtitle: 'Attention in every detail', position: 'center-left' },
  ];

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isAutoPlay) return;
    const active = slides[currentSlide];
    if (active.type === 'image') {
      const id = setInterval(() => {
        goToSlide((currentSlide + 1) % slides.length);
      }, 4000);
      return () => clearInterval(id);
    }
  }, [currentSlide, isAutoPlay, slides]);

  const handleVideoEnded = () => {
    if (!isAutoPlay) return;
    goToSlide((currentSlide + 1) % slides.length);
  };

  const nextSlide = () => {
    directionRef.current = 'next';
    goToSlide((currentSlide + 1) % slides.length);
  };

  const goPrevSlide = () => {
    directionRef.current = 'prev';
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  const goToSlide = (targetIndex: number) => {
    const current = slides[currentSlide];
    const target = slides[targetIndex];
    setContentVisible(false);
    setPrevSlide(currentSlide);
    requestAnimationFrame(() => setIsFading(true));
    setTimeout(() => {
      setIsFading(false);
      setPrevSlide(null);
      setCurrentSlide(targetIndex);
      setContentVisible(true);
    }, 700);
  };

  return (
    <section
      className="relative h-screen overflow-hidden"
      onMouseMove={(e) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 10; // -5..5 deg
        const y = (e.clientY / innerHeight - 0.5) * -10; // -5..5 deg
        setTilt({ x, y });
      }}
      onTouchStart={(e) => {
        touchStartXRef.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const startX = touchStartXRef.current;
        if (startX == null) return;
        const endX = e.changedTouches[0].clientX;
        const delta = endX - startX;
        if (Math.abs(delta) > 50) {
          if (delta < 0) nextSlide(); else goPrevSlide();
        }
        touchStartXRef.current = null;
      }}
    >
      {/* Media Layers with crossfade (handles image->video and video->image) */}
      {/* Previous slide (fading out) */}
      {prevSlide !== null && (
        slides[prevSlide].type === 'image' ? (
          <img
            key={`prev-${slides[prevSlide].src}`}
            src={slides[prevSlide].src}
            alt="Previous slide"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isFading ? 'opacity-0' : 'opacity-100'}`}
          />
        ) : (
          <video
            key={`prev-${slides[prevSlide].src}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isFading ? 'opacity-0' : 'opacity-100'}`}
            autoPlay
            muted
            playsInline
          >
            <source src={slides[prevSlide].src} type="video/mp4" />
          </video>
        )
      )}
      {/* Current slide (fading in) */}
      {slides[currentSlide].type === 'image' ? (
        <img
          key={`cur-${slides[currentSlide].src}`}
          src={slides[currentSlide].src}
          alt="Current slide"
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${directionRef.current === 'next' ? 'translate-x-0' : 'translate-x-0'}`}
          style={{ opacity: prevSlide !== null ? (isFading ? 1 : 0) : 1 }}
        />
      ) : (
        <video
          key={`cur-${slides[currentSlide].src}`}
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover`}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          style={{ opacity: prevSlide !== null ? (isFading ? 1 : 0) : 1 }}
        >
          <source src={slides[currentSlide].src} type="video/mp4" />
        </video>
      )}

      {/* Content */}
      {/* Content */}
      <div className="relative z-10 h-full" style={{ transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`, transition: 'transform 150ms linear' }}>
        <div className="container mx-auto px-4 lg:px-8 h-full">
          <div
            className={`absolute px-4 ${
              slides[currentSlide].position === 'top-left' ? 'top-24 left-4 lg:left-6' : ''
            } ${slides[currentSlide].position === 'top-right' ? 'top-24 right-4 lg:right-6' : ''}
            ${slides[currentSlide].position === 'center-left' ? 'top-1/2 -translate-y-1/2 left-4 lg:left-6' : ''}
            ${slides[currentSlide].position === 'center-right' ? 'top-1/2 -translate-y-1/2 right-4 lg:right-6' : ''}
            ${slides[currentSlide].position === 'bottom-left' ? 'bottom-32 left-4 lg:left-6' : ''}
            ${slides[currentSlide].position === 'bottom-right' ? 'bottom-32 right-4 lg:right-6' : ''}
            w-full max-w-lg lg:max-w-xl transition-all duration-700 ${contentVisible ? (directionRef.current === 'next' ? 'opacity-100 translate-x-0' : 'opacity-100 translate-x-0') : (directionRef.current === 'next' ? 'opacity-0 -translate-x-4' : 'opacity-0 translate-x-4')}
            `}
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg text-orange-shadow">
              {slides[currentSlide].title}
            </h1>
            <p className="text-base md:text-lg text-white/90 mb-6 drop-shadow-lg text-pink-shadow leading-relaxed">
              {slides[currentSlide].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="default" className="p-4 bg-accent text-accent-foreground hover:scale-105 hover:shadow-elegant-lg transition-transform duration-300">
                Explore Properties
              </Button>
              <Button size="default" variant="outline" className="p-4 bg-[#fc5d62] border-white text-white hover:bg-white hover:text-primary hover:scale-105 transition-transform duration-300">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="absolute bottom-8 left-8 z-20 flex items-center space-x-4">
        <Button
          variant={isAutoPlay ? "default" : "outline"}
          size="sm"
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className={isAutoPlay ? "bg-[#fc5d62] text-primary-foreground" : "border-white text-white hover:bg-white hover:text-primary"}
        >
          {isAutoPlay ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {isAutoPlay ? 'Pause' : 'Play'}
        </Button>
      </div>

      {/* Slideshow Controls */}
      <>
          <div className=" absolute bottom-8 right-8 z-20 flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goPrevSlide}
              className=" bg-[#fc5d62] border-white text-white hover:bg-white hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="bg-[#fc5d62] border-white text-white hover:bg-white hover:text-primary"
            >
              {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="bg-[#fc5d62] border-white text-white hover:bg-white hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-accent scale-125' : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
      </>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10 animate-float">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;