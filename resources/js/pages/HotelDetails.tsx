import { Link, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowLeft,
    Bath,
    Bed,
    Compass,
    MapPin,
    Sparkles,
    Star,
    Wifi,
    Wind,
} from 'lucide-react';
import React, { useRef, useState } from 'react';

import MapComponent from '@/components/MapComponent';
import ScrollAnimation from '@/components/ScrollAnimation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout';
import type { Project } from '@/types/Project';
import { properties } from '@/routes';
import FloatingGallery from '@/components/HotelDetails/FloatingGallery';
import HotelStats from '@/components/HotelDetails/HotelStats';
import SurroundingsSection from '@/components/HotelDetails/SurroundingsSection';

const OceanBackdrop = () => {
    const bubbles = [
        { left: '8%', size: 10, duration: 16, delay: 0 },
        { left: '18%', size: 6, duration: 12, delay: 2 },
        { left: '32%', size: 14, duration: 18, delay: 4 },
        { left: '48%', size: 8, duration: 14, delay: 1 },
        { left: '62%', size: 12, duration: 20, delay: 6 },
        { left: '74%', size: 7, duration: 13, delay: 3 },
        { left: '86%', size: 11, duration: 17, delay: 5 },
    ];

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Deep ocean gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_15%_5%,rgba(56,189,248,0.22),transparent_45%),radial-gradient(900px_circle_at_85%_15%,rgba(34,211,238,0.14),transparent_40%),radial-gradient(900px_circle_at_45%_0%,rgba(59,130,246,0.10),transparent_55%),linear-gradient(to_bottom,#020617_0%,#031428_18%,#05213d_40%,#041a33_60%,#020617_100%)]" />

            {/* Caustics / light rays */}
            <div className="absolute inset-0 opacity-60 mix-blend-screen [background:radial-gradient(60%_40%_at_50%_10%,rgba(125,211,252,0.18),transparent_60%)]" />
            <div className="absolute inset-0 opacity-30 [background:linear-gradient(115deg,transparent_0%,rgba(34,211,238,0.10)_35%,transparent_70%)] blur-2xl" />

            {/* Surface shimmer line */}
            <div className="absolute left-0 right-0 top-24 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />

            {/* Rising bubbles */}
            {bubbles.map((b, idx) => (
                <motion.div
                    // eslint-disable-next-line react/no-array-index-key
                    key={idx}
                    className="absolute bottom-[-60px] rounded-full border border-cyan-200/25 bg-cyan-200/5 backdrop-blur-sm"
                    style={{
                        left: b.left,
                        width: b.size,
                        height: b.size,
                        boxShadow:
                            '0 0 24px rgba(34,211,238,0.12), inset 0 0 18px rgba(125,211,252,0.12)',
                    }}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{
                        y: -1200,
                        opacity: [0, 0.55, 0.35, 0],
                        x: [0, -10, 6, -4, 0],
                        scale: [0.9, 1, 0.95, 1.05, 1],
                    }}
                    transition={{
                        duration: b.duration,
                        delay: b.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            {/* Seafloor haze */}
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-950/70 via-slate-950/30 to-transparent" />
        </div>
    );
};

const HotelDetails = () => {
    const [activeImage, setActiveImage] = useState(0);
    const { projectDetails } = usePage<{ projectDetails: Project }>().props;

    console.log('Project details', projectDetails);

    if (!projectDetails) {
        return (
            <AppLayout>
                <div className="flex min-h-screen items-center justify-center bg-slate-950">
                    <div className="text-center">
                        <h1 className="mb-4 text-4xl font-bold text-white">
                            Hotel Not Found
                        </h1>
                        <Link href="/hotels-resorts">
                            <Button className="bg-primary hover:bg-primary/90">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Hotels &amp; Resorts
                            </Button>
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const images =
        projectDetails.project_images?.map((img) => `/${img.image}`) || [];

    const hotelFeatures =
        projectDetails.facilities?.map((facility) => ({
            name: facility.name,
            icon:
                facility.name.toLowerCase().includes('spa') ||
                facility.name.toLowerCase().includes('pool') ||
                facility.name.toLowerCase().includes('bar')
                    ? Sparkles
                    : Wifi,
            description: facility.name,
        })) || [];

    if (projectDetails.details) {
        const detailsFeatures: {
            name: string;
            icon:
                | typeof Bed
                | typeof Bath
                | typeof Wind;
            description: string;
        }[] = [];

        if (projectDetails.details.bedroom) {
            detailsFeatures.push({
                name: 'Bedrooms',
                icon: Bed,
                description: projectDetails.details.bedroom,
            });
        }
        if (projectDetails.details.bathroom) {
            detailsFeatures.push({
                name: 'Bathrooms',
                icon: Bath,
                description: projectDetails.details.bathroom,
            });
        }
        if (projectDetails.details.balcony) {
            detailsFeatures.push({
                name: 'Balcony',
                icon: Wind,
                description: projectDetails.details.balcony,
            });
        }

        hotelFeatures.push(...detailsFeatures);
    }

    const primaryImage =
        images[activeImage] || projectDetails.project_images?.[0]?.image || '';

    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);

    return (
        <AppLayout>
            <div className="relative min-h-screen text-white">
                <OceanBackdrop />
                <div className="relative">

                    {/* 1. HERO SECTION */}
                    <section
                        ref={heroRef}
                        className="relative h-screen w-full overflow-hidden"
                    >
                        <motion.div style={{ y }} className="absolute inset-0">
                            <img
                                src={primaryImage}
                                alt={projectDetails.name}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-[#0a0a0a]" />
                        </motion.div>
                        <div className="relative z-10 container mx-auto flex h-full flex-col justify-end px-4 pb-20">

                            <div className="mb-4 flex flex-wrap gap-2">
                                <Badge className="bg-primary text-white">
                                    Jana Series
                                </Badge>
                            </div>
                            <h1 className="mb-4 font-serif text-6xl font-light tracking-tighter md:text-8xl">
                                {projectDetails.name}
                            </h1>
                            <div className="flex flex-col justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
                                <div className="flex items-center gap-3 text-lg text-white/60">
                                    <MapPin className="h-5 w-5 text-primary" />{' '}
                                    {projectDetails.address},{' '}
                                    {projectDetails.location?.name}
                                </div>
                                {/*<div className="text-3xl font-light md:text-5xl">*/}
                                {/*    {formatCurrency(projectDetails.price)}*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </section>

                    {/* Hotel Content */}
                    <section className="container mx-auto px-4 py-20">
                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                            <div className="space-y-6">
                                <ScrollAnimation>
                                    <Card className="border-cyan-200/20 bg-gradient-to-b from-slate-950/40 to-slate-950/70 backdrop-blur-xl">
                                        <CardContent className="space-y-4 p-6">
                                            <h3 className="text-lg font-semibold">
                                                Reservation Info
                                            </h3>
                                            <p className="text-sm text-slate-200/90">
                                                Get in touch with our team to
                                                know more about availability,
                                                pricing, and bespoke stay
                                                options tailored for you.
                                            </p>
                                            <div className="space-y-3 text-sm text-slate-200/90">
                                                <p>
                                                    <span className="text-slate-400">
                                                        Project ID:
                                                    </span>{' '}
                                                    {projectDetails.project_id}
                                                </p>
                                                {projectDetails.price && (
                                                    <p>
                                                        <span className="text-slate-400">
                                                            Indicative Price:
                                                        </span>{' '}
                                                        {projectDetails.price.toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                            <Button className="mt-2 w-full bg-cyan-500/90 hover:bg-cyan-500">
                                                Enquire About This Hotel
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </ScrollAnimation>

                                {primaryImage && (
                                    <ScrollAnimation delay={0.15}>
                                        <motion.div
                                            className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-lg"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <img
                                                src={primaryImage}
                                                alt={projectDetails.name}
                                                className="h-56 w-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
                                            <div className="absolute bottom-4 left-4">
                                                <p className="text-xs tracking-[0.2em] text-slate-300 uppercase">
                                                    Signature Collection
                                                </p>
                                                <p className="text-lg font-semibold">
                                                    Hotels &amp; Resorts
                                                </p>
                                            </div>
                                        </motion.div>
                                    </ScrollAnimation>
                                )}
                            </div>

                            <div className="space-y-10 lg:col-span-2">
                                <ScrollAnimation>
                                    <Card className="border-cyan-200/15 bg-slate-950/45 backdrop-blur-xl">
                                        <CardContent className="space-y-4 p-8">
                                            <Badge className="mb-3 bg-cyan-300/10 text-xs font-medium tracking-wide text-cyan-100 uppercase">
                                                Hotel Overview
                                            </Badge>
                                            <h2 className="mb-2 text-2xl font-semibold tracking-tight">
                                                A curated stay for modern
                                                travelers
                                            </h2>
                                            <p className="text-sm leading-relaxed text-slate-200/80">
                                                {projectDetails.description ??
                                                    'Experience a thoughtfully designed hotel with curated amenities, elegant interiors, and a calm atmosphere — ideal for both business and leisure stays.'}
                                            </p>
                                            <div className="mt-4 grid gap-4 text-sm text-slate-200/90 sm:grid-cols-2">
                                                <div>
                                                    <p className="text-slate-400">
                                                        Location
                                                    </p>
                                                    <p>
                                                        {projectDetails.location
                                                            ?.name ??
                                                            'To be announced'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-400">
                                                        Floors
                                                    </p>
                                                    <p>
                                                        {projectDetails.floors ??
                                                            'N/A'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-400">
                                                        Size
                                                    </p>
                                                    <p>
                                                        {projectDetails.size ??
                                                            'N/A'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-400">
                                                        Handover
                                                    </p>
                                                    <p>
                                                        {projectDetails.handover_date ??
                                                            'TBA'}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </ScrollAnimation>

                                <ScrollAnimation delay={0.15}>
                                    <Card className="border-cyan-200/15 bg-gradient-to-br from-slate-950/50 via-slate-950/60 to-cyan-950/30 backdrop-blur-xl">
                                        <CardContent className="p-8">
                                            <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight">
                                                Signature Amenities
                                            </h2>
                                            <div className="flex flex-col sm:flex-row justify-center gap-5">
                                                {hotelFeatures.length === 0 && (
                                                    <p className="col-span-3 text-center text-sm text-slate-300">
                                                        Amenities will be
                                                        announced soon.
                                                    </p>
                                                )}
                                                {hotelFeatures.map(
                                                    (feature, index) => {
                                                        const Icon =
                                                            feature.icon;
                                                        return (
                                                            <motion.div
                                                                key={`${feature.name}-${index}`}
                                                                className="w-1/4 relative flex flex-col items-center rounded-xl border border-cyan-200/10 bg-slate-950/30 px-4 py-5 text-center shadow-sm"
                                                                whileHover={{
                                                                    y: -4,
                                                                    scale: 1.02,
                                                                }}
                                                            >
                                                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-300/10 ring-1 ring-cyan-200/10">
                                                                    <Icon className="h-5 w-5 text-cyan-200" />
                                                                </div>
                                                                <h3 className="mb-1 text-sm font-semibold">
                                                                    {
                                                                        feature.name
                                                                    }
                                                                </h3>
                                                                <p className="text-xs text-slate-300">
                                                                    {
                                                                        feature.description
                                                                    }
                                                                </p>
                                                            </motion.div>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </ScrollAnimation>

                                <ScrollAnimation delay={0.25}>
                                    <Card className="border-cyan-200/15 bg-slate-950/55 backdrop-blur-xl">
                                        <CardContent className="p-6 md:p-8">
                                            <div className="mb-6 flex flex-col items-center gap-3 text-center md:flex-row md:justify-between md:text-left">
                                                <div>
                                                    <h2 className="text-xl font-semibold">
                                                        Explore on the Map
                                                    </h2>
                                                    <p className="text-xs text-slate-300">
                                                        Discover nearby
                                                        attractions and
                                                        surroundings.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="overflow-hidden rounded-2xl border border-cyan-200/15">
                                                <MapComponent width="100%" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </ScrollAnimation>
                            </div>
                        </div>
                    </section>

                    <FloatingGallery images={images} />

                    <HotelStats
                        details={projectDetails.details}
                        floors={projectDetails.floors}
                        size={projectDetails.size}
                    />

                    <SurroundingsSection project={projectDetails} />
                </div>
            </div>
        </AppLayout>
    );
};

export default HotelDetails;

