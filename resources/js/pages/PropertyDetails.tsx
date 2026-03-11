import { Link, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowLeft, Bath, Bed, Building2, Calendar, Car, CheckCircle2,
    Compass, ExternalLink, Hash, MapPin, Ruler, Square,
    Video, Waves, Wifi, Map as MapIcon, ChevronDown,
    Droplets, ShieldCheck, FlameKindling
} from 'lucide-react';
import React, { useState, useRef } from 'react';
import MapComponent from '@/components/MapComponent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from "@/layouts/AppLayout";
import { properties } from "@/routes";
import type { Project } from '@/types/Project';

const PropertyDetail = () => {
    // We only pull projectDetails to ensure absolute data accuracy
    const { projectDetails } = usePage<{ projectDetails: Project }>().props;

    const heroRef = useRef(null);
    const [activeImage, setActiveImage] = useState(0);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

    if (!projectDetails) return null;

    // --- DATA HELPERS ---
    const images = projectDetails.project_images?.map((img) => `/${img.image}`) ?? [];
    const primaryImage = images[0] ?? '/placeholder-property.jpg';

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'TBA';
        return new Date(dateString).toLocaleDateString('en-GB', {
            month: 'short',
            year: 'numeric'
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Dynamic Icon Mapper for Facilities
    const getFacilityIcon = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('wifi')) return Wifi;
        if (n.includes('fire')) return FlameKindling;
        if (n.includes('pool')) return Waves;
        if (n.includes('garden')) return Droplets;
        if (n.includes('security')) return ShieldCheck;
        return CheckCircle2;
    };

    // Dynamic Unit Specs Filter (Utilizing projectDetails.details)
    const unitSpecs = [
        { label: 'Bedroom', value: projectDetails.details?.bedroom, icon: Bed },
        { label: 'Bathroom', value: projectDetails.details?.bathroom, icon: Bath },
        { label: 'Balcony', value: projectDetails.details?.balcony, icon: CheckCircle2 },
        { label: 'Kitchen', value: projectDetails.details?.kitchen, icon: CheckCircle2 },
        { label: 'Living & Dining', value: projectDetails.details?.living_dining, icon: CheckCircle2 },
        { label: 'Parking Slots', value: projectDetails.details?.parking, icon: Car },
        { label: 'Garage No.', value: projectDetails.details?.garage_no, icon: Hash },
        { label: 'Garage Size', value: projectDetails.details?.garage_size, icon: Ruler },
    ].filter(spec => spec.value && spec.value !== "0");

    return (
        <AppLayout>
            <div className="bg-[#0a0a0a] text-white selection:bg-primary/30">
                {/* HERO: 100% Dynamic from projectDetails */}
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
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0a]" />
                    </motion.div>

                    <div className="relative z-10 container mx-auto flex h-full flex-col justify-end px-4 pb-20">
                        <Link
                            href={properties()}
                            className="mb-6 inline-flex items-center text-xs tracking-[0.2em] text-white/50 uppercase transition-colors hover:text-white"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to
                            Collection
                        </Link>

                        <div className="mb-4 flex flex-wrap gap-2">
                            {projectDetails.isFeatured === 1 && (
                                <Badge className="bg-primary text-white">
                                    Signature Series
                                </Badge>
                            )}
                            {projectDetails.tags?.map((tag) => (
                                <Badge
                                    key={tag.id}
                                    variant="outline"
                                    className="border-white/20 text-white/70"
                                >
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>

                        <h1 className="mb-4 font-serif text-6xl font-light tracking-tighter md:text-8xl">
                            {projectDetails.name}
                        </h1>
                        <div className="flex flex-col justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
                            <div className="flex items-center gap-3 text-lg text-white/60">
                                <MapPin className="h-5 w-5 text-primary" />
                                {projectDetails.address},{' '}
                                {projectDetails.location?.name}
                            </div>
                            <div className="text-3xl font-light md:text-5xl">
                                {formatCurrency(projectDetails.price)}
                            </div>
                        </div>
                    </div>
                </section>

                {/* AT A GLANCE: Dynamic Date and ID Logic */}
                <section className="border-b border-white/5 py-24">
                    <div className="container mx-auto grid grid-cols-1 gap-16 px-4 lg:grid-cols-12">
                        <div className="lg:col-span-5">
                            <h2 className="mb-8 text-4xl leading-tight font-light">
                                {projectDetails.description}
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between border-b border-white/5 pb-4">
                                    <span className="text-xs tracking-widest text-white/40 uppercase">
                                        Project ID
                                    </span>
                                    <span className="font-medium">
                                        {projectDetails.project_id}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-4">
                                    <span className="text-xs tracking-widest text-white/40 uppercase">
                                        Commenced
                                    </span>
                                    <span className="font-medium">
                                        {formatDate(
                                            projectDetails.construction_start_date,
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-4">
                                    <span className="text-xs tracking-widest text-white/40 uppercase">
                                        Handover
                                    </span>
                                    <span className="font-medium">
                                        {formatDate(
                                            projectDetails.handover_date,
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 lg:col-span-7">
                            {/* Core Stats Bento */}
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
                                <Building2 className="mb-6 h-8 w-8 text-primary" />
                                <div className="mb-1 text-4xl font-light">
                                    {projectDetails.floors}
                                </div>
                                <div className="text-xs tracking-widest text-white/40 uppercase">
                                    Storeys High
                                </div>
                            </div>
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
                                <Square className="mb-6 h-8 w-8 text-primary" />
                                <div className="mb-1 text-4xl font-light">
                                    {projectDetails.size}
                                </div>
                                <div className="text-xs tracking-widest text-white/40 uppercase">
                                    Sq Ft Area
                                </div>
                            </div>
                            <div className="col-span-2 rounded-3xl border border-white/10 bg-gradient-to-r from-primary/10 to-transparent p-10">
                                <Compass className="mb-6 h-8 w-8 text-primary" />
                                <div className="mb-1 text-2xl font-light">
                                    {
                                        projectDetails.details
                                            ?.apartment_direction
                                    }
                                </div>
                                <div className="text-xs tracking-widest text-white/40 uppercase">
                                    Unit Orientation
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AMENITIES: Strictly filtering based on backend 'facilities' array */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <h2 className="mb-12 text-center text-3xl font-light tracking-widest uppercase">
                            Lifestyle Amenities
                        </h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {projectDetails.facilities?.map((f) => {
                                const Icon = getFacilityIcon(f.name);
                                return (
                                    <div
                                        key={f.id}
                                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <span className="font-medium">
                                            {f.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* UNIT SPECS: Dynamic mapping from our filtered array */}
                <section className="bg-white/[0.02] py-24">
                    <div className="container mx-auto px-4">
                        <h2 className="mb-12 text-3xl font-light tracking-widest uppercase">
                            Internal Specifications
                        </h2>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {unitSpecs.map((spec, i) => (
                                <div
                                    key={i}
                                    className="rounded-3xl border border-white/5 bg-[#0a0a0a] p-8"
                                >
                                    <spec.icon className="mb-4 h-5 w-5 text-white/20" />
                                    <div className="mb-1 text-2xl font-medium">
                                        {spec.value}
                                    </div>
                                    <div className="text-xs tracking-widest text-white/40 uppercase">
                                        {spec.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. FULL-PAGE DYNAMIC GALLERY */}
                {projectDetails.project_images &&
                    projectDetails.project_images.length > 0 && (
                        <section className="overflow-hidden bg-black py-24">
                            <div className="mb-12 px-4">
                                <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">
                                    Immersive View
                                </span>
                                <h2 className="mt-4 font-serif text-5xl font-light">
                                    Project Gallery
                                </h2>
                            </div>

                            {/* Full-Width Carousel / Scroll Area */}
                            <div className="relative w-full">
                                <div
                                    className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-12"
                                    style={{ scrollbarWidth: 'none' }}
                                >
                                    {projectDetails.project_images.map(
                                        (imageObj, index) => (
                                            <motion.div
                                                key={imageObj.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                transition={{
                                                    delay: index * 0.1,
                                                }}
                                                viewport={{ once: true }}
                                                className="group relative aspect-[16/9] min-w-[85vw] snap-center overflow-hidden rounded-[2rem] border border-white/10 md:min-w-[70vw] lg:min-w-[60vw]"
                                            >
                                                <img
                                                    src={`/${imageObj.image}`}
                                                    alt={`${projectDetails.name} view ${index + 1}`}
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />

                                                {/* Glassmorphism Caption */}
                                                <div className="absolute right-8 bottom-8 left-8 rounded-2xl border border-white/10 bg-black/20 p-6 opacity-0 backdrop-blur-md transition-opacity duration-500 group-hover:opacity-100">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs tracking-widest text-white/60 uppercase">
                                                                Property View
                                                            </p>
                                                            <h4 className="text-xl font-medium">
                                                                {
                                                                    projectDetails.name
                                                                }{' '}
                                                                — Perspective{' '}
                                                                {index + 1}
                                                            </h4>
                                                        </div>
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ),
                                    )}
                                </div>

                                {/* Visual Progress Bar */}
                                <div className="container mx-auto px-4">
                                    <div className="relative h-px w-full bg-white/10">
                                        <motion.div
                                            className="absolute top-0 left-0 h-full bg-primary"
                                            style={{
                                                width: `${(1 / projectDetails.project_images.length) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                {/* MEDIA & LOCATION */}
                <section className="container mx-auto px-4 py-24">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                        <div className="aspect-video overflow-hidden rounded-[2rem] border border-white/10">
                            {projectDetails.details?.youtube_video_id ? (
                                <iframe
                                    className="h-full w-full"
                                    src={`https://www.youtube.com/embed/${projectDetails.details.youtube_video_id}`}
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-white/5 text-sm tracking-widest text-white/30 uppercase">
                                    Virtual Tour Coming Soon
                                </div>
                            )}
                        </div>
                        <div className="h-full min-h-[400px] overflow-hidden rounded-[2rem] border border-white/10">
                            <MapComponent width="100%" height="100%" />
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default PropertyDetail;
