import { Link } from '@inertiajs/react';
import { ArrowRight, BadgeCheck, Building, CalendarClock, Eye, HardHat, Heart, KeyRound, Target } from 'lucide-react';
import collage6 from "@/assets/images/collage/collage-6.webp";
import manager from "@/assets/images/people/manager.webp";
import property3 from "@/assets/images/properties/property-3.webp";
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import AppLayout from '@/layouts/AppLayout';
import type { AboutPageContent, CompanyStats } from '@/types/PageContent';
import ScrollAnimation from '../components/ScrollAnimation';

interface Props {
    content: AboutPageContent;
    companyStats: CompanyStats;
}

/** Icons stay tied to each slot; the text comes from the CMS. */
const STAT_ICONS = [CalendarClock, KeyRound, HardHat, Building];
const VALUE_ICONS = [Target, Eye, Heart];

const About = ({ content, companyStats }: Props) => {
    const stats = (companyStats?.stats ?? []).map((stat, index) => ({
        ...stat,
        icon: STAT_ICONS[index] ?? Building,
    }));

    const values = (content?.values ?? []).map((value, index) => ({
        ...value,
        icon: VALUE_ICONS[index] ?? Target,
    }));

    const credentials = (content?.hero_credentials ?? '')
        .split('·')
        .map((item) => item.trim())
        .filter(Boolean);

    return (
        <AppLayout>
            <div className="min-h-screen bg-black">
                {/* Hero Section */}
                <section
                    style={{
                        backgroundImage: `url(${property3})`,
                        backgroundAttachment: 'fixed',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                    className="relative flex min-h-[70vh] items-center overflow-hidden pt-36 pb-20"
                >
                    {/* Darker on the text side so the copy stays readable */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/50"></div>
                    <div className="relative z-10 container mx-auto px-4">
                        <PageBreadcrumb
                            items={[{ label: 'About Us' }]}
                            className="mb-6"
                        />
                        <ScrollAnimation delay={0.1} className="max-w-4xl">
                            <h1 className="mb-6 text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                                {content?.hero_title}
                            </h1>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.2} className="max-w-2xl">
                            <p className="mb-8 text-lg leading-relaxed text-white/90 sm:text-xl">
                                {content?.hero_subtitle}
                            </p>
                        </ScrollAnimation>
                        {credentials.length > 0 && (
                            <ScrollAnimation delay={0.3}>
                                <ul className="mb-10 flex flex-wrap gap-3">
                                    {credentials.map((item) => (
                                        <li
                                            key={item}
                                            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
                                        >
                                            <BadgeCheck className="h-4 w-4 text-accent" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </ScrollAnimation>
                        )}
                        <ScrollAnimation delay={0.4}>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Link
                                    href="/properties"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-8 py-4 font-semibold text-accent-foreground shadow-lg transition-transform duration-300 hover:scale-105"
                                >
                                    View Projects
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center rounded-lg border-2 border-white/70 px-8 py-4 font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-black"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </ScrollAnimation>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="mx-auto w-full bg-gradient-to-br from-slate-950/80 via-black/90 to-slate-950/80
                                  p-10 px-5
                                  backdrop-blur-xl
                                  shadow-2xl shadow-black/70">
                    
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
                            {stats.map((stat, index) => (
                                <ScrollAnimation key={index} delay={index * 0.12}>
                                    <div
                                        className="group relative
                                                  rounded-2xl
                                                  bg-gradient-to-br from-slate-800/40 via-slate-900/40 to-black/50
                                                  p-1.5
                                                  transition-all duration-500
                                                  hover:scale-[1.06] hover:-translate-y-1.5"
                                    >
                                        {/* Main card with inset + outer shadow combo */}
                                        <Card
                                            className="
                relative overflow-hidden
                h-full
                bg-gradient-to-b from-slate-800/70 to-slate-950/80
                backdrop-blur-lg
                border border-white/6
                shadow-[0_8px_32px_-12px_rgba(0,0,0,0.9),inset_0_2px_1px_rgba(255,255,255,0.07),inset_0_-2px_1px_rgba(0,0,0,0.6)]
                transition-all duration-500
                group-hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,1),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-3px_2px_rgba(0,0,0,0.7)]
              "
                                        >
                                            <CardContent className="relative z-10 flex flex-col items-center justify-center p-8 text-center">
                                                {/* Icon container with subtle glow */}
                                                <div
                                                    className="
                    relative mb-5
                    rounded-full
                    bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-violet-600/20
                    p-4
                    shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]
                    group-hover:shadow-[0_0_30px_-4px_rgba(99,102,241,0.7)]
                    transition-shadow duration-700
                  "
                                                >
                                                    <div
                                                        className="
                      absolute inset-0 rounded-full
                      bg-gradient-to-br from-indigo-400/10 to-purple-500/10
                      blur-xl opacity-60
                      group-hover:opacity-80
                      transition-opacity
                    "
                                                    />
                                                    <stat.icon className="h-9 w-9 text-indigo-300/90" />
                                                </div>

                                                {/* Value with subtle gradient text */}
                                                <div
                                                    className="
                    mb-3 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200
                    bg-clip-text text-4xl md:text-5xl font-extrabold
                    text-transparent
                  "
                                                >
                                                    {stat.value}
                                                </div>

                                                <div className="text-sm md:text-base text-slate-400/90 font-medium tracking-wide">
                                                    {stat.label}
                                                </div>
                                            </CardContent>

                                            {/* Very subtle shine overlay on hover */}
                                            <div
                                                className="
                  pointer-events-none absolute inset-0
                  rounded-2xl
                  bg-gradient-to-tr from-white/5 via-transparent to-transparent
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-700
                "
                                            />
                                        </Card>
                                    </div>
                                </ScrollAnimation>
                            ))}
                        </div>
                </section>

                {/* Our Story */}
                <section className="bg-black py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                            <ScrollAnimation>
                                <div>
                                    <Badge className="text-lg bg-gradient-accent mb-6 text-accent-foreground">Our Story</Badge>
                                    <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">{content?.story_heading}</h2>
                                    {(content?.story_paragraphs ?? []).map((paragraph, index) => (
                                        <p key={index} className="mb-6 leading-relaxed text-white/90">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </ScrollAnimation>
                            <ScrollAnimation delay={0.2}>
                                <div className="relative">
                                    <img src={collage6} alt="Alliance Builders Ltd. project" className="shadow-elegant-xl h-[500px] w-full rounded-2xl object-cover" />
                                    <div className="animate-float bg-gradient-elegant shadow-elegant-lg absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 rounded-2xl p-8 text-primary-foreground">
                                        <div className="mb-2 text-5xl font-bold">{content?.years_value}</div>
                                        <div className="text-lg">{content?.years_label}</div>
                                    </div>
                                </div>
                            </ScrollAnimation>
                        </div>
                    </div>
                </section>

                {/* Management */}
                <section className="bg-gradient-to-b from-black to-slate-950 py-20">
                    <div className="container mx-auto px-4">
                        <ScrollAnimation className="mb-12 text-center">
                            <Badge className="text-lg bg-gradient-accent mb-6 text-accent-foreground">Management</Badge>
                            <h2 className="text-4xl font-bold text-white md:text-5xl">Leadership</h2>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.1}>
                            <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-elegant-xl backdrop-blur-sm md:grid-cols-5 md:p-8">
                                <div className="md:col-span-2">
                                    <img
                                        src={content?.md_image_url || manager}
                                        alt={content?.md_name || content?.md_title || 'Managing Director'}
                                        loading="lazy"
                                        className="aspect-[4/5] w-full rounded-xl object-cover object-top shadow-lg"
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
                                        {content?.md_title}
                                    </div>
                                    {content?.md_name && (
                                        <h3 className="mb-4 text-3xl font-bold text-white">{content.md_name}</h3>
                                    )}
                                    <p className="mb-8 text-lg leading-relaxed text-white/85">{content?.md_summary}</p>
                                    <Link
                                        href="/managing-director"
                                        className="inline-flex items-center gap-2 font-semibold text-white transition-colors hover:text-accent"
                                    >
                                        Read MD&apos;s Message
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </ScrollAnimation>
                    </div>
                </section>

                {/* Our Values */}
                <section className="bg-gradient-hero py-20">
                    <div className="container mx-auto px-4">
                        <ScrollAnimation className="mb-16 text-center">
                            <div>
                                <Badge className="text-lg bg-gradient-accent mb-6 text-accent-foreground">Our Values</Badge>
                                <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">{content?.values_heading}</h2>
                                <p className="mx-auto max-w-3xl text-xl text-white">
                                    {content?.values_intro}
                                </p>
                            </div>
                        </ScrollAnimation>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {values.map((value, index) => (
                                <ScrollAnimation key={index} delay={index * 0.15}>
                                    <Card className="shadow-elegant hover:shadow-elegant-lg group bg-white/80 text-center transition-all duration-500">
                                        <CardContent className="p-8">
                                            <div className="bg-gradient-elegant mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110">
                                                <value.icon className="h-10 w-10 text-primary-foreground" />
                                            </div>
                                            <h3 className="mb-4 text-2xl font-bold text-black transition-colors group-hover:text-primary">
                                                {value.title}
                                            </h3>
                                            <p className="leading-relaxed text-muted-foreground">{value.description}</p>
                                        </CardContent>
                                    </Card>
                                </ScrollAnimation>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                {/*<section className="py-20">*/}
                {/*    <div className="container mx-auto px-4">*/}
                {/*        <ScrollAnimation className="mb-16 text-center">*/}
                {/*            <div>*/}
                {/*                <Badge className="bg-gradient-accent mb-6 text-accent-foreground">Our Team</Badge>*/}
                {/*                <h2 className="mb-6 text-4xl font-bold text-primary md:text-5xl">Meet Our Leadership</h2>*/}
                {/*                <p className="mx-auto max-w-3xl text-xl text-muted-foreground">*/}
                {/*                    Our experienced team of professionals is dedicated to making your real estate dreams a reality.*/}
                {/*                </p>*/}
                {/*            </div>*/}
                {/*        </ScrollAnimation>*/}

                {/*        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">*/}
                {/*            {team.map((member, index) => (*/}
                {/*                <ScrollAnimation key={index} delay={index * 0.1}>*/}
                {/*                    <Card className="shadow-elegant hover:shadow-elegant-lg group overflow-hidden transition-all duration-500">*/}
                {/*                        <div className="relative overflow-hidden">*/}
                {/*                            <img*/}
                {/*                                src={member.image}*/}
                {/*                                alt={member.name}*/}
                {/*                                className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-110"*/}
                {/*                            />*/}
                {/*                            <div className="bg-gradient-hero absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-60"></div>*/}
                {/*                        </div>*/}
                {/*                        <CardContent className="p-6 text-center">*/}
                {/*                            <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-primary">{member.name}</h3>*/}
                {/*                            <p className="text-muted-foreground">{member.role}</p>*/}
                {/*                        </CardContent>*/}
                {/*                    </Card>*/}
                {/*                </ScrollAnimation>*/}
                {/*            ))}*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</section>*/}

                {/* CTA Section */}
                <section className="bg-black py-20 text-primary-foreground">
                    <div className="container mx-auto px-4 text-center">
                        <ScrollAnimation>
                            <h2 className="mb-6 text-4xl font-bold md:text-5xl">{content?.cta_heading}</h2>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.1}>
                            <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
                                {content?.cta_text}
                            </p>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.2}>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <a href="/contact">
                                    <button className="shadow-elegant rounded-lg bg-background px-8 py-4 font-semibold text-foreground transition-transform duration-300 hover:scale-105">
                                        Contact Us Today
                                    </button>
                                </a>
                                <a href="/properties">
                                    <button className="rounded-lg border-2 border-primary-foreground bg-transparent px-8 py-4 font-semibold text-primary-foreground transition-all duration-300 hover:bg-blue-400 hover:border-blue-400 hover:text-black">
                                        Browse Properties
                                    </button>
                                </a>
                            </div>
                        </ScrollAnimation>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default About;
