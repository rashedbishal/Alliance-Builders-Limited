import { ArrowUpRight, ExternalLink } from 'lucide-react';
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
import { Link } from '@inertiajs/react';

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
          website:
              'https://www.facebook.com/people/Alliance-Brokerage/100094466712412/#',
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
          website: 'https://www.facebook.com/alliancebeverageandagro/',
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
          website: 'https://www.facebook.com/alliancebeverageandagro/',
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
          website: 'https://alliancesuccessbuilders.com/',
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
          website: 'https://invest.alliancebuildersltd.org/',
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
          website: 'https://opticoresolutionsltd.com/',
      },
  ];

  return (
      <section className="relative overflow-hidden bg-black py-20">
          <div className="relative z-10 container mx-auto px-4 lg:px-8">
              {/* Section Header */}
              <ScrollAnimation once={true}>
                  <div className="mb-16 text-center">
                      <h2 className="mb-6 text-4xl font-bold text-white lg:text-5xl">
                          Our Corporate Umbrella
                      </h2>
                      <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white">
                          Alliance Builders Ltd. is part of a comprehensive
                          network of specialized companies, each bringing unique
                          expertise to deliver complete real estate and
                          construction solutions under one trusted umbrella.
                      </p>
                  </div>
              </ScrollAnimation>

              {/* Companies Grid */}
              <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {companies.map((company, index) => (
                      <ScrollAnimation key={company.id} delay={0} once={true} yOffset={0}>
                          <Card className="group hover:shadow-elegant-xl relative cursor-pointer overflow-hidden bg-white transition-transform duration-500 hover:-translate-y-3">
                              <div
                                  className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10 ${company.color}`}
                              ></div>

                              <CardContent className="relative z-10 p-8">
                                  {/* Logo and Header */}
                                  <div className="mb-6 flex items-center justify-between">
                                      <Link
                                          href={company.website}
                                          className={`rounded-2xl p-2 shadow-2xl shadow-black/70 ${company.color} transition-transform duration-300 group-hover:scale-110`}
                                      >
                                          <img
                                              src={company.logo}
                                              className="h-32 text-white"
                                          />
                                      </Link>
                                      <Button
                                          size="sm"
                                          variant="ghost"
                                          className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-muted"
                                      >
                                          <ExternalLink className="h-4 w-4" />
                                      </Button>
                                  </div>

                                  {/* Company Info */}
                                  <div className="mb-6">
                                      <h3 className="mb-3 text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                                          {company.name}
                                      </h3>
                                      <p className="leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                                          {company.description}
                                      </p>
                                  </div>
                              </CardContent>
                          </Card>
                      </ScrollAnimation>
                  ))}
              </div>

              {/* Corporate Overview */}
              <ScrollAnimation delay={0.4} once={true}>
                  <div className="shadow-elegant-xl rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617] p-12">
                      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                          <div>
                              <h3 className="mb-6 text-white text-3xl font-bold lg:text-4xl">
                                  Complete Real Estate Ecosystem
                              </h3>
                              <p className="mb-8 text-gray-50 text-xl leading-relaxed opacity-90">
                                  Our integrated approach brings together
                                  expertise from construction, design,
                                  technology, security, and mobility to deliver
                                  comprehensive solutions that exceed
                                  expectations at every level.
                              </p>
                              <div className="flex flex-col gap-4 sm:flex-row">
                                  <Button
                                      size="lg"
                                      className="shadow-elegant border border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                                  >
                                      Explore Partnerships
                                  </Button>
                                  <Button
                                      size="lg"
                                      className="shadow-elegant bg-accent text-accent-foreground hover:bg-accent-dark"
                                  >
                                      Download Brochure
                                  </Button>
                              </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                              <div className="text-center">
                                  <div className="mb-2 text-4xl font-bold text-accent">
                                      6
                                  </div>
                                  <div className="text-white/80">
                                      Sister Companies
                                  </div>
                              </div>
                              <div className="text-center">
                                  <div className="mb-2 text-4xl font-bold text-accent">
                                      1800+
                                  </div>
                                  <div className="text-white/80">
                                      Total Projects
                                  </div>
                              </div>
                              <div className="text-center">
                                  <div className="mb-2 text-4xl font-bold text-accent">
                                      25+
                                  </div>
                                  <div className="text-white/80">
                                      Cities Served
                                  </div>
                              </div>
                              <div className="text-center">
                                  <div className="mb-2 text-4xl font-bold text-accent">
                                      5000+
                                  </div>
                                  <div className="text-white/80">
                                      Team Members
                                  </div>
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
