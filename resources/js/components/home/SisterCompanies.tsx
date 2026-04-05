import {
  ExternalLink
} from "lucide-react";
import React from 'react';

// import logo images
// import alliance from "@/assets/images/logo/alliance logo.webp"
import beverage from "@/assets/images/logo/alliance-beverage-agro.svg"
import brokerage from "@/assets/images/logo/alliance-brokerage.svg"
import construction from "@/assets/images/logo/alliance-construction.svg"
import success from "@/assets/images/logo/alliance-success-builders.svg"
import jana from "@/assets/images/logo/jana.png"
import opticore from "@/assets/images/logo/opticore-solutions.svg"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ScrollAnimation from '../ScrollAnimation';

const SisterCompanies = () => {
  const companies = [
      {
          id: 1,
          name: 'Alliance Brokerage Ltd.',
          logo: brokerage,
          description:
              'Premier construction services specializing in residential and commercial projects with cutting-edge technology.',
          services: [
              'Construction Management',
              'Project Development',
              'Quality Assurance',
          ],
          founded: '2010',
          projects: '200+',
          color: 'bg-gradient-to-br from-tertiary-foreground to-tertiary-light',
          website: '#construction',
      },
      {
          id: 2,
          name: 'Alliance Beverage Agro',
          logo: beverage,
          description:
              'Innovative landscape architecture and sustainable urban planning solutions for modern developments.',
          services: [
              'Landscape Design',
              'Urban Planning',
              'Sustainability Consulting',
          ],
          founded: '2012',
          projects: '300+',
          color: 'bg-gradient-to-br from-success to-success-foreground',
          website: '#landscaping',
      },
      {
          id: 3,
          name: 'Alliance Construction',
          logo: construction,
          description:
              'Cutting-edge home automation and smart building solutions for residential and commercial properties.',
          services: [
              'Home Automation',
              'Security Systems',
              'Energy Management',
          ],
          founded: '2015',
          projects: '500+',
          color: 'bg-gradient-to-br from-neutral to-neutral-light',
          website: '#smarthome',
      },
      {
          id: 4,
          name: 'Alliance Success Builders',
          logo: success,
          description:
              'Comprehensive security solutions and property management services for residential and commercial clients.',
          services: [
              'Property Security',
              'Facility Management',
              'Risk Assessment',
          ],
          founded: '2008',
          projects: '400+',
          color: 'bg--gradient-to-br from-neutral to-neutral-light',
          website: '#security',
      },
      {
          id: 5,
          name: 'Hotel Jana',
          logo: jana,
          description:
              'Modern transportation and parking solutions designed for urban developments and commercial complexes.',
          services: [
              'Parking Solutions',
              'Transport Planning',
              'Mobility Consulting',
          ],
          founded: '2018',
          projects: '150+',
          color: 'bg-gradient-to-br from-tertiary-foreground to-tertiary-light',
          website: '#mobility',
      },
      {
          id: 6,
          name: 'Opticore Solutions Ltd.',
          logo: opticore,
          description:
              'Luxury interior design and custom craftsmanship for high-end residential and commercial spaces.',
          services: ['Interior Design', 'Custom Furniture', 'Luxury Finishes'],
          founded: '2014',
          projects: '250+',
          color: 'bg-gradient-to-br from-tertiary-foreground to-tertiary-light',
          website: '#interiors',
      },
  ];

  return (
    <section className="py-20 bg-black relative overflow-hidden">


      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Our Corporate Umbrella
            </h2>
            <p className="text-lg text-white max-w-3xl mx-auto leading-relaxed">
              Alliance Builders Ltd. is part of a comprehensive network of specialized companies, each bringing unique expertise
              to deliver complete real estate and construction solutions under one trusted umbrella.
            </p>
          </div>
        </ScrollAnimation>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {companies.map((company, index) => (
            <ScrollAnimation key={company.id} delay={index * 0.1}>
            <Card
              className="group relative overflow-hidden hover:shadow-elegant-xl transition-all duration-500 hover:-translate-y-3 bg-white cursor-pointer"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${company.color.replace('bg-gradient-to-br', 'bg-gradient-to-br')}`}></div>

              <CardContent className="p-8 relative z-10">
                {/* Logo and Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`shadow-black/70 shadow-2xl p-2 rounded-2xl ${company.color} group-hover:scale-110 transition-transform duration-300`}>
                    <img src={company.logo} className="h-32 text-white" />
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-muted"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                {/* Company Info */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {company.name}
                  </h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-relaxed">
                    {company.description}
                  </p>
                </div>

                {/* Services */}
                {/* <div className="mb-6">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                    Core Services
                  </h4>
                  <div className="space-y-2">
                    {company.services.map((service) => (
                      <div key={service} className="flex items-center text-sm text-foreground">
                        <ArrowUpRight className="h-3 w-3 mr-2 text-accent" />
                        {service}
                      </div>
                    ))}
                  </div>
                </div> */}

                {/* Stats */}
                {/* <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent">{company.projects}</div>
                    <div className="text-xs text-muted-foreground">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent">Since {company.founded}</div>
                    <div className="text-xs text-muted-foreground">Established</div>
                  </div>
                </div> */}

                {/* Hover Action - Fixed overlapping issue */}
                <div className="mt-4 pt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {/* <Button className="w-full bg-gradient-primary text-primary-foreground hover:bg-primary-dark shadow-elegant">
                    Learn More
                  </Button> */}
                </div>
              </CardContent>
            </Card>
            </ScrollAnimation>
          ))}
        </div>

        {/* Corporate Overview */}
        <ScrollAnimation delay={0.4}>
        <div className="bg-gradient-to-r from-magenta via-coral to-tertiary text-primary-foreground rounded-3xl p-12 shadow-elegant-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold mb-6">
                Complete Real Estate Ecosystem
              </h3>
              <p className="text-xl opacity-90 mb-8 leading-relaxed">
                Our integrated approach brings together expertise from construction, design, technology,
                security, and mobility to deliver comprehensive solutions that exceed expectations at every level.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30 shadow-elegant">
                  Explore Partnerships
                </Button>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent-dark shadow-elegant">
                  Download Brochure
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">6</div>
                <div className="text-white/80">Sister Companies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">1800+</div>
                <div className="text-white/80">Total Projects</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">25+</div>
                <div className="text-white/80">Cities Served</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">5000+</div>
                <div className="text-white/80">Team Members</div>
              </div>
            </div>
          </div>
        </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default SisterCompanies;
