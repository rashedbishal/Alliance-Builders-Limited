import { usePage } from '@inertiajs/react';
import React from 'react';
import { ArrowUpRight, HardHat, Layers, Award, Users } from 'lucide-react';
import ScrollAnimation from '../ScrollAnimation';

// Import logo images
import beverage from "@/assets/images/logo/alliance-beverage-agro.svg";
import brokerage from "@/assets/images/logo/alliance-brokerage.svg";
import construction from "@/assets/images/logo/alliance-construction.svg";
import success from "@/assets/images/logo/alliance-success-builders.svg";
import jana from "@/assets/images/logo/jana.webp";
import opticore from "@/assets/images/logo/opticore-solutions.svg";
import type { CompanyStats } from '@/types/PageContent';

interface Company {
  id: number;
  name: string;
  tag: string;
  logo: string;
  description: string;
  website: string;
}

const SisterCompanies: React.FC = () => {
  const companies: Company[] = [
    {
      id: 1,
      name: 'Alliance Brokerage Ltd.',
      tag: 'Real Estate & Investment',
      logo: brokerage,
      description: 'Strategic property brokerage, land acquisition, and commercial asset investment management.',
      website: 'https://www.facebook.com/people/Alliance-Brokerage/100094466712412/#',
    },
    {
      id: 2,
      name: 'Alliance Beverage Agro',
      tag: 'Agro & Sustainable Goods',
      logo: beverage,
      description: 'Sustainable agricultural processing and beverage manufacturing operating under strict quality standards.',
      website: 'https://www.facebook.com/alliancebeverageandagro/',
    },
    {
      id: 3,
      name: 'Alliance Construction',
      tag: 'Infrastructure & Engineering',
      logo: construction,
      description: 'World-class structural development, urban planning, and large-scale architectural engineering.',
      website: 'https://www.facebook.com/p/Alliance-Construction-61550523338981/',
    },
    {
      id: 4,
      name: 'Alliance Success Builders',
      tag: 'Security & Operations',
      logo: success,
      description: 'Comprehensive corporate security, residential facility management, and risk assessment services.',
      website: 'https://alliancesuccessbuilders.com/',
    },
    {
      id: 5,
      name: 'Hotel Jana',
      tag: 'Luxury Hospitality',
      logo: jana,
      description: 'Premium accommodations, boutique resort experiences, and modern hospitality service excellence.',
      website: 'https://invest.alliancebuildersltd.org/',
    },
    {
      id: 6,
      name: 'Opticore Solutions Ltd.',
      tag: 'IT & Digital Media',
      logo: opticore,
      description: 'Innovative IT solutions, video editing, graphics designing, 3D production, and digital marketing services.',
      website: 'https://opticoresolutionsltd.com/',
    },
  ];

  const { companyStats } = usePage<{ companyStats?: CompanyStats }>().props;

  // Icons stay tied to each slot; the values come from the CMS.
  const statIcons = [Layers, Award, HardHat, Users];
  const stats = (companyStats?.group_stats ?? []).map((stat, index) => ({
    ...stat,
    icon: statIcons[index] ?? Award,
  }));

  return (
    <section className="relative bg-gradient-to-b from-slate-100 via-slate-50 to-white py-24 text-slate-900 overflow-hidden">
      {/* Subtle Background Accent Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <ScrollAnimation once={true} yOffset={0}>
          <div className="mb-16 text-center">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-primary border border-primary/20 bg-primary/10 mb-4 shadow-sm">
              Corporate Network
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-6">
              Our Corporate Umbrella
            </h2>
            <p className="mx-auto max-w-2xl text-base lg:text-lg text-slate-600 leading-relaxed">
              Alliance Builders Ltd. operates a multi-disciplinary network of specialized enterprises, unifying real estate, hospitality, construction, and technology under one trusted brand.
            </p>
          </div>
        </ScrollAnimation>

        {/* Companies Grid */}
        <div className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <ScrollAnimation key={company.id} once={true} yOffset={0}>
              <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 h-full">
                <div>
                  {/* Category Pill Tag */}
                  <div className="mb-4">
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-600">
                      {company.tag}
                    </span>
                  </div>

                  {/* 3D Floating Logo */}
                  <div className="my-6 flex h-28 items-center justify-center py-2">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-full max-h-24 w-auto object-contain transition-all duration-300 drop-shadow-[0_10px_16px_rgba(13,77,144,0.25)] group-hover:drop-shadow-[0_18px_30px_rgba(13,77,144,0.45)] group-hover:-translate-y-1.5 group-hover:scale-[1.04]"
                    />
                  </div>

                  {/* Title & Description */}
                  <h3 className="mb-2.5 text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-primary">
                    {company.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {company.description}
                  </p>
                </div>

                {/* Direct External Link Action */}
                <div className="pt-4 border-t border-slate-100">
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors duration-200"
                  >
                    <span>Visit Website</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Corporate Ecosystem Overview Bar */}
        <ScrollAnimation once={true} yOffset={0}>
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 lg:p-12 shadow-lg">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              {stats.map((stat, idx) => (
                <div
                  key={stat.label}
                  className={`text-center flex flex-col items-center justify-center ${
                    idx > 0 ? 'pt-6 lg:pt-0' : ''
                  }`}
                >
                  <stat.icon className="h-6 w-6 text-primary mb-3" />
                  <div className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs lg:text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default SisterCompanies;
