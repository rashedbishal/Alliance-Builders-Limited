import TestimonialBackground from '@images/home/testimonials-background.webp';
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { contact } from '@/routes';
import type { CompanyStats } from '@/types/PageContent';
import type { Testimonial } from '@/types/Testimonial';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ScrollAnimation from '../ScrollAnimation';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const { testimonials: cmsTestimonials, companyStats } = usePage<{
    testimonials?: Testimonial[];
    companyStats?: CompanyStats;
  }>().props;
  const stats = companyStats?.stats ?? [];

  const testimonials = (cmsTestimonials ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    role: t.role ?? '',
    company: t.company ?? '',
    image: t.image ?? '',
    rating: t.rating,
    text: t.quote,
    propertyType: t.property_type ?? '',
  }));

  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlay, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index);
  };

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 relative" style={{backgroundImage: `url(${TestimonialBackground})`, backgroundAttachment: 'fixed', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Section Header */}
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Client Success Stories
            </h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              Hear from clients who have trusted Alliance Builders Ltd. with their homes
            </p>
          </div>
        </ScrollAnimation>

        {/* Main Testimonial Display */}
        <>
          <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-white/10 border  border-white/20 shadow-elegant-xl animate-scale-in animate-blur-in">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <Quote className="h-16 w-16 text-accent mx-auto mb-6 opacity-50" />
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-accent fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl lg:text-2xl text-black leading-relaxed font-medium italic mb-8">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                {testimonials[currentTestimonial].image ? (
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-20 h-20 rounded-full border-4 border-accent shadow-elegant object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full border-4 border-accent shadow-elegant bg-accent/20 flex items-center justify-center text-2xl font-bold text-accent">
                    {testimonials[currentTestimonial].name.charAt(0)}
                  </div>
                )}
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-black">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-accent font-semibold">
                    {testimonials[currentTestimonial].role}
                  </div>
                  <div className="text-gray-800">
                    {testimonials[currentTestimonial].company}
                  </div>
                  <div className="text-sm text-gray-700 mt-2">
                    {testimonials[currentTestimonial].propertyType}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </>

        {/* Navigation Controls */}
        <ScrollAnimation delay={0.3}>
        <div className="flex justify-center items-center space-x-6 mb-8">
          <Button
            onClick={prevTestimonial}
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full p-3"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <div className="flex space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                onMouseEnter={() => setIsAutoPlay(false)}
                onMouseLeave={() => setIsAutoPlay(true)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? 'bg-accent scale-125 shadow-elegant'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextTestimonial}
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full p-3"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        </ScrollAnimation>

        {/* Client Logos/Stats */}
        <ScrollAnimation delay={0.4}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">{stat.value}</div>
              <div className="text-black/80">{stat.label}</div>
            </div>
          ))}
        </div>
        </ScrollAnimation>

        {/* Call to Action */}
        <ScrollAnimation delay={0.5}>
          <div className="text-center mt-16">
          <Button size="lg" asChild className="bg-accent hover:bg-accent-dark text-accent-foreground shadow-elegant-lg px-6 py-4 text-lg font-semibold transition-all duration-300">
            <Link href={contact.url()}>
              Share Your Experience
            </Link>
          </Button>
        </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default TestimonialsSection;
