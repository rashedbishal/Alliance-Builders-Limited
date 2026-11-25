import AboutBackground from '@images/home/about-section.webp';
import {Link, usePage} from "@inertiajs/react";
import {
  Building,
  Building2,
  Users,
  Award,
  Handshake,
  Shield,
  Clock,
  CalendarClock,
  HardHat,
  KeyRound,
  BadgeCheck,
  Layers
} from "lucide-react";
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { WritingText } from '@/components/ui/shadcn-io/writing-text';
import {contact, properties} from "@/routes";
import type { CompanyStats, HomeAboutContent } from '@/types/PageContent';
import ScrollAnimation from '../ScrollAnimation';
import ScrollSlideIn from '../ScrollSlideIn';
import TradeLicenseBadge from '../TradeLicenseBadge';
import LineMeet from '../ui/line-meet';

const AboutSection = () => {
  const { homeAbout, companyStats } = usePage<{
    homeAbout?: HomeAboutContent;
    companyStats?: CompanyStats;
  }>().props;

  // Icons and colours stay tied to each slot; the text comes from the CMS.
  const serviceStyles = [
    { icon: Building2, color: "text-accent" },
    { icon: Handshake, color: "text-primary" },
    { icon: Users, color: "text-accent" },
    { icon: Shield, color: "text-primary" }
  ];
  const featureIcons = [Award, BadgeCheck, Clock, Layers];
  const statIcons = [CalendarClock, KeyRound, HardHat, Building];

  const services = (homeAbout?.services ?? []).map((service, index) => ({
    ...service,
    ...(serviceStyles[index] ?? serviceStyles[0])
  }));

  const features = (homeAbout?.features ?? []).map((feature, index) => ({
    ...feature,
    stats: feature.stat,
    icon: featureIcons[index] ?? Award
  }));

  const stats = (companyStats?.stats ?? []).map((stat, index) => ({
    ...stat,
    icon: statIcons[index] ?? Building
  }));

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Image Container */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none"
        style={{
          backgroundImage: `url(${AboutBackground})`,
          filter: 'grayscale(40%)'
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <ScrollAnimation className="mx-auto md:w-[65%] text-center mb-16 bg-white/50 backdrop-blur-lg p-8 rounded-2xl shadow-elegant-xl">
          <h2 className="text-4xl lg:text-5xl font-semibold text-black mb-6">
            {homeAbout?.heading}
          </h2>
          <p className="text-lg bg-black rounded-2xl p-4 text-white shadow-xl max-w-3xl mx-auto leading-relaxed">
            <WritingText
              text={homeAbout?.intro ?? ''}
              spacing={5}
            />
          </p>
        </ScrollAnimation>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {services.map((service, index) => (
            <ScrollAnimation
              key={service.title}
              delay={index * 0.1}
              className="h-full rounded-xl border border-border/50 bg-white/80 backdrop-blur-lg group hover:shadow-elegant-lg transition-transform transition-shadow duration-500 hover:-translate-y-2 hover:scale-105"
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className={`p-4 rounded-full bg-muted group-hover:bg-accent/10 transition-all duration-300 ${service.color}`}>
                    <service.icon className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </ScrollAnimation>
          ))}
        </div>

        {/* Company Stats (shared with the About page) */}
        {stats.length > 0 && (
          <ScrollAnimation className="mb-20 grid grid-cols-2 gap-4 rounded-2xl bg-black/85 p-6 shadow-elegant-xl backdrop-blur-lg md:grid-cols-4 md:p-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <stat.icon className="mb-3 h-7 w-7 text-accent" />
                <div className="text-3xl font-bold text-white md:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-white/70 md:text-base">{stat.label}</div>
              </div>
            ))}
          </ScrollAnimation>
        )}

        {/* Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollSlideIn className="bg-white/50 rounded-2xl p-8 shadow-elegant-xl text-center backdrop-blur-lg">
            <h3 className="text-3xl lg:text-4xl font-semibold text-black mb-6">
              {homeAbout?.why_heading}
            </h3>
            <p className="bg-black rounded-2xl p-4 text-lg text-white mb-8 leading-relaxed">
              <WritingText
                text={homeAbout?.why_text ?? ''}
                spacing={5}
              />
            </p>
          </ScrollSlideIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <ScrollSlideIn
                direction="right"
                key={feature.title}
                delay={index * 0.1}
                className="h-full rounded-xl border border-border/50 bg-white/80 backdrop-blur-lg group hover:shadow-elegant-lg transition-transform transition-shadow duration-300 hover:-translate-y-1 hover:scale-105"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-all duration-300">
                      <feature.icon className="h-6 w-6 text-primary"/>
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-accent">{feature.stats}</div>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </ScrollSlideIn>
            ))}
          </div>
        </div>

        <ScrollAnimation className="mt-16">
          <TradeLicenseBadge />
        </ScrollAnimation>

        <LineMeet lineColor="bg-white" width="w-3/4" lineHeight="h-1" className="mt-16 mb-32 items-center mx-auto" />

        {/* Call to Action */}
        <ScrollAnimation delay={0.5} className="md:w-3/4 lg:w-2/4 mx-auto text-center mt-16 bg-white/50 rounded-2xl p-8 m-4 shadow-elegant-xl backdrop-blur-lg">
          <h3 className="text-3xl font-bold mb-4">{homeAbout?.cta_heading}</h3>
          <div className="mx-auto p-8 bg-black/90 rounded-2xl p-12 shadow-elegant-xl text-white">
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              {homeAbout?.cta_text}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg px-8 py-3 font-semibold transition-all duration-300">
                <Link href={properties.url()}>
                    Browse Properties
                </Link>
              </Button>
              <Button size="lg" asChild className="bg-white/10 hover:bg-white/20 border border-white/30 text-white backdrop-blur-sm shadow-md px-8 py-3 font-semibold transition-all duration-300">
                <Link href={contact.url()}>
                    Schedule Meeting
                </Link>
              </Button>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default AboutSection;
