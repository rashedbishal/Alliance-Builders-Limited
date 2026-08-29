import TestimonialBackground from '@images/home/testimonials-background.webp';
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { contact } from '@/routes';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ScrollAnimation from '../ScrollAnimation';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Property Investor",
      company: "Johnson Holdings",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "EstateElite transformed our investment portfolio completely. Their market insights and professional approach helped us identify premium properties that have appreciated significantly. The team's dedication to excellence is unmatched in the industry.",
      propertyType: "Commercial Investment"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Landowner",
      company: "Chen Development Group",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Working with EstateElite on our land development project was exceptional. They understood our vision and delivered beyond expectations. The entire process was transparent, professional, and resulted in a remarkable development that exceeded our ROI projections.",
      propertyType: "Land Development"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Home Buyer",
      company: "Marketing Executive",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Finding our dream home seemed impossible until we met EstateElite. They listened to our needs, understood our budget, and presented options that perfectly matched our requirements. The buying process was smooth and stress-free.",
      propertyType: "Luxury Residence"
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Business Owner",
      company: "Thompson Enterprises",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "EstateElite helped us secure the perfect commercial space for our expanding business. Their understanding of commercial real estate and negotiation skills saved us both time and money. Highly recommended for any business property needs.",
      propertyType: "Commercial Space"
    },
    {
      id: 5,
      name: "Lisa Wang",
      role: "Real Estate Developer",
      company: "Wang Properties",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "As a fellow developer, I can appreciate quality work when I see it. EstateElite's attention to detail, innovative designs, and commitment to sustainability sets them apart. They've become our preferred partner for joint ventures.",
      propertyType: "Development Partnership"
    }
  ];

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
              Hear from our satisfied clients who have experienced excellence in real estate services with EstateElite
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
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-20 h-20 rounded-full border-4 border-accent shadow-elegant"
                />
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
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">98%</div>
            <div className="text-black/80">Client Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">1000+</div>
            <div className="text-black/80">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">15+</div>
            <div className="text-black/80">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">50+</div>
            <div className="text-black/80">Awards Won</div>
          </div>
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
