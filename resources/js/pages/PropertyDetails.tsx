import { Link, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowLeft, Bath, Bed, Building2, Calendar, Car, CheckCircle2, 
    Compass, ExternalLink, Hash, MapPin, Ruler, Square, 
    Tag as TagIcon, Video, Waves, Wifi, Map as MapIcon,
    ChevronDown, Droplets, ShieldCheck
} from 'lucide-react';
import React, { useState, useRef, useMemo } from 'react';
import MapComponent from '@/components/MapComponent';
import ScrollAnimation from '@/components/ScrollAnimation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from "@/layouts/AppLayout";
import { properties } from "@/routes";
import type { Facility, Project } from '@/types/Project';

const PropertyDetail = () => {
    const { projectDetails, allFacilities } = usePage<{
        projectDetails: Project;
        allFacilities?: Facility[];
    }>().props;

    const [activeImage, setActiveImage] = useState(0);
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    if (!projectDetails) return null;

    const images = projectDetails.project_images?.map((img) => `/${img.image}`) ?? [];
    const primaryImage = images[0] ?? '';

    const formatCurrency = (value: number | null | undefined) => {
        if (!value) return 'Price on Request';
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const facilityIcon = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('wifi')) return Wifi;
        if (n.includes('pool')) return Waves;
        if (n.includes('garden')) return Droplets;
        if (n.includes('security')) return ShieldCheck;
        if (n.includes('parking')) return Car;
        return CheckCircle2;
    };

    return (
        <AppLayout>
            <div className="bg-[#0a0a0a] text-white selection:bg-primary/30">
                
                {/* 1. CINEMATIC HERO SECTION */}
                <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
                    <motion.div style={{ y }} className="absolute inset-0">
                        <img 
                            src={primaryImage} 
                            alt={projectDetails.name} 
                            className="h-full w-full object-cover scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0a0a0a]" />
                    </motion.div>

                    <div className="container relative z-10 flex h-full flex-col justify-end pb-20 mx-auto px-4">
                        <motion.div style={{ opacity }}>
                            <Link href={properties()} className="group mb-8 inline-flex items-center text-sm uppercase tracking-widest text-white/70 hover:text-white transition-colors">
                                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                Back to Collection
                            </Link>
                            <Badge className="mb-4 bg-primary text-white hover:bg-primary px-4 py-1">
                                {projectDetails.isFeatured ? 'Signature Collection' : 'Featured Property'}
                            </Badge>
                            <h1 className="max-w-4xl font-serif text-6xl font-light leading-tight md:text-8xl">
                                {projectDetails.name}
                            </h1>
                            <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-3 text-lg text-white/80">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    {projectDetails.location?.name} — {projectDetails.address}
                                </div>
                                <div className="text-3xl font-light tracking-tighter md:text-5xl">
                                    {formatCurrency(projectDetails.price)}
                                </div>
                            </div>
                        </motion.div>
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                            <ChevronDown />
                        </div>
                    </div>
                </section>

                {/* 2. AT A GLANCE (TECHNICAL PRECISION) */}
                <section className="py-24 border-b border-white/5">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                            <div className="lg:col-span-5">
                                <span className="text-xs uppercase tracking-[0.3em] text-primary font-bold">The Narrative</span>
                                <h2 className="mt-6 text-4xl font-light leading-snug">
                                    Architectural excellence meets modern living.
                                </h2>
                                <p className="mt-8 text-lg leading-relaxed text-white/60">
                                    {projectDetails.description}
                                </p>
                            </div>
                            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-3xl overflow-hidden">
                                {[
                                    { label: 'Apartment Size', value: projectDetails.size, icon: Square },
                                    { label: 'Total Floors', value: projectDetails.floors, icon: Building2 },
                                    { label: 'Bedrooms', value: projectDetails.details?.bedroom, icon: Bed },
                                    { label: 'Bathrooms', value: projectDetails.details?.bathroom, icon: Bath },
                                    { label: 'Completion', value: '2027 Q4', icon: Calendar },
                                    { label: 'Project ID', value: projectDetails.project_id, icon: Hash },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-[#0a0a0a] p-8 hover:bg-white/[0.02] transition-colors">
                                        <stat.icon className="h-5 w-5 text-primary mb-4" />
                                        <div className="text-xs uppercase tracking-widest text-white/40 mb-1">{stat.label}</div>
                                        <div className="text-xl font-medium">{stat.value || '—'}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. UNIT SPECIFICATIONS (BENTO GRID) */}
                <section className="py-24 bg-white/[0.02]">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <span className="text-xs uppercase tracking-[0.3em] text-primary font-bold">Specifications</span>
                            <h2 className="mt-4 text-5xl font-light">The Anatomy of Luxury</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Direction Card */}
                            <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent p-1">
                                <div className="h-full w-full rounded-[calc(1.5rem-1px)] bg-[#0a0a0a] p-10">
                                    <Compass className="h-10 w-10 text-primary mb-6" />
                                    <h3 className="text-2xl font-light mb-2">Primary Orientation</h3>
                                    <p className="text-white/60">Optimized for natural light and ventilation.</p>
                                    <div className="mt-6 text-4xl font-bold uppercase tracking-tighter text-primary">
                                        {projectDetails.details?.apartment_direction || 'South Facing'}
                                    </div>
                                </div>
                            </div>
                            {/* Detail List */}
                            {[
                                { label: 'Balconies', value: projectDetails.details?.balcony, icon: CheckCircle2 },
                                { label: 'Kitchen', value: projectDetails.details?.kitchen, icon: CheckCircle2 },
                                { label: 'Parking', value: projectDetails.details?.parking, icon: Car },
                                { label: 'Garage Size', value: projectDetails.details?.garage_size, icon: Ruler },
                            ].map((item, i) => (
                                <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col justify-between">
                                    <item.icon className="h-6 w-6 text-primary" />
                                    <div>
                                        <div className="text-xs uppercase tracking-widest text-white/40 mb-1">{item.label}</div>
                                        <div className="text-xl font-medium">{item.value || 'Yes'}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. LIFESTYLE AMENITIES */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                            <div className="max-w-xl">
                                <span className="text-xs uppercase tracking-[0.3em] text-primary font-bold">Amenities</span>
                                <h2 className="mt-4 text-5xl font-light">Elevated Living Experiences</h2>
                            </div>
                            <div className="text-white/40 uppercase tracking-widest text-sm">
                                {allFacilities?.length || 0} Exclusive Features
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {(allFacilities || projectDetails.facilities)?.map((facility) => {
                                const Icon = facilityIcon(facility.name);
                                return (
                                    <motion.div 
                                        key={facility.id}
                                        whileHover={{ y: -10 }}
                                        className="group relative h-64 overflow-hidden rounded-3xl bg-white/5 p-10 border border-white/10"
                                    >
                                        <div className="relative z-10 h-full flex flex-col justify-between">
                                            <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                                                <Icon className="h-7 w-7 text-white" />
                                            </div>
                                            <h4 className="text-2xl font-light">{facility.name}</h4>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* 5. GALLERY */}
                <section className="py-24 bg-white/[0.02]">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 flex items-center justify-between">
                            <h2 className="text-4xl font-light tracking-tight">Visual Gallery</h2>
                            <div className="flex gap-2">
                                {images.map((_, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => setActiveImage(i)}
                                        className={`h-1 transition-all ${activeImage === i ? 'w-8 bg-primary' : 'w-4 bg-white/20'}`} 
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="aspect-[21/9] w-full overflow-hidden rounded-[3rem] border border-white/10">
                            <motion.img 
                                key={activeImage}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                src={images[activeImage]} 
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </section>

                {/* 6. LOCATION & MAP */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
                            <div>
                                <MapIcon className="h-10 w-10 text-primary mb-6" />
                                <h2 className="text-4xl font-light mb-6">Strategic Location</h2>
                                <p className="text-white/60 mb-8 leading-relaxed">
                                    {projectDetails.surroundings}
                                </p>
                                <Button asChild variant="outline" className="rounded-full border-white/20 hover:bg-white hover:text-black px-8">
                                    <a href={projectDetails.google_map_url} target="_blank">
                                        Get Directions <ExternalLink className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                            <div className="lg:col-span-2 h-[500px] rounded-[3rem] overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                                <MapComponent width="100%" height="100%" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default PropertyDetail;