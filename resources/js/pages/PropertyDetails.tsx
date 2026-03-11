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

                {/* 2. AT A GLANCE (TECHNICAL PRECISION) */}
                <section className="border-b border-white/5 py-24">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
                            <div className="lg:col-span-5">
                                <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">
                                    The Narrative
                                </span>
                                <h2 className="mt-6 text-4xl leading-snug font-light">
                                    Architectural excellence meets modern
                                    living.
                                </h2>
                                <p className="mt-8 text-lg leading-relaxed text-white/60 italic">
                                    "{projectDetails.description}"
                                </p>
                            </div>

                            {/* HOVER HIGHLIGHT GRID */}
                            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-3 lg:col-span-7">
                                {[
                                    {
                                        label: 'Apartment Size',
                                        value: projectDetails.size,
                                        icon: Square,
                                    },
                                    {
                                        label: 'Total Floors',
                                        value: projectDetails.floors,
                                        icon: Building2,
                                    },
                                    {
                                        label: 'Bedrooms',
                                        value: projectDetails.details?.bedroom,
                                        icon: Bed,
                                    },
                                    {
                                        label: 'Bathrooms',
                                        value: projectDetails.details?.bathroom,
                                        icon: Bath,
                                    },
                                    {
                                        label: 'Handover',
                                        value: formatDate(
                                            projectDetails.handover_date,
                                        ),
                                        icon: Calendar,
                                    },
                                    {
                                        label: 'Project ID',
                                        value: projectDetails.project_id,
                                        icon: Hash,
                                    },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{
                                            backgroundColor:
                                                'rgba(255, 255, 255, 0.03)',
                                            transition: { duration: 0.2 },
                                        }}
                                        className="group relative cursor-default bg-[#0a0a0a] p-8 transition-all duration-300"
                                    >
                                        {/* Hover Border Highlight Effect */}
                                        <div className="absolute inset-0 border-1 border-primary/0 transition-all duration-500 group-hover:border-primary/30" />

                                        <stat.icon className="mb-4 h-5 w-5 text-white/40 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />

                                        <div className="mb-1 text-xs tracking-widest text-white/40 uppercase transition-colors group-hover:text-white/60">
                                            {stat.label}
                                        </div>

                                        <div className="text-xl font-medium transition-transform duration-300 group-hover:translate-x-1">
                                            {stat.value || '—'}
                                        </div>

                                        {/* Subtle Bottom Glow on Hover */}
                                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. AMENITIES: Centered Flex Logic */}
                <section className="bg-[#0d0d0d] py-24">
                    <div className="container mx-auto px-4">
                        <div className="mb-16 text-center">
                            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">
                                Lifestyle & Comfort
                            </span>
                            <h2 className="mt-4 font-serif text-5xl font-light tracking-tight">
                                Project Amenities
                            </h2>
                        </div>

                        {/* DYNAMIC FLEX LOGIC:
            Uses 'flex-wrap' to wrap items and 'justify-center' to handle
            any count of items (1, 2, 5, etc.) gracefully.
        */}
                        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-6">
                            {projectDetails.facilities?.map((f) => {
                                const Icon = getFacilityIcon(f.name);
                                return (
                                    <motion.div
                                        key={f.id}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="group relative flex min-w-[200px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 md:min-w-[240px]"
                                    >
                                        {/* Background Glow Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                        <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 transition-all duration-700 group-hover:rotate-[360deg] group-hover:bg-primary">
                                            <Icon className="h-8 w-8 text-primary transition-colors group-hover:text-white" />
                                        </div>

                                        <span className="relative z-10 text-lg font-medium tracking-wide transition-colors group-hover:text-white">
                                            {f.name}
                                        </span>

                                        {/* Animated Border Reveal */}
                                        <div className="absolute inset-0 scale-90 rounded-[2rem] border border-primary/20 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* 4. INTERNAL SPECIFICATIONS: Balanced Dual-Image & Technical Table */}
                <section className="overflow-hidden border-t border-white/5 bg-black py-24">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-24">
                            {/* LEFT: Equal Width Dual-Image Column (Sticky) */}
                            <div className="h-fit lg:sticky lg:top-24">
                                <div className="relative flex flex-col gap-6">
                                    <span className="mb-4 text-[10px] font-bold tracking-[0.5em] text-primary uppercase">
                                        Structural Visualization
                                    </span>

                                    {/* Primary Image: Taller Aspect */}
                                    <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10">
                                        <motion.img
                                            initial={{ scale: 1.1, opacity: 0 }}
                                            whileInView={{
                                                scale: 1,
                                                opacity: 1,
                                            }}
                                            transition={{ duration: 1.2 }}
                                            src={`/${projectDetails.project_images[0]?.image}`}
                                            className="h-full w-full object-cover"
                                            alt="Main Architectural View"
                                        />
                                    </div>

                                    {/* Secondary Image: Shifted and Scaled up */}
                                    <motion.div
                                        initial={{ x: 50, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 1 }}
                                        className="group -right-12 -bottom-16 z-20 aspect-[3/4] w-[70%] overflow-hidden rounded-[2rem] border-[12px] border-black shadow-2xl lg:absolute"
                                    >
                                        <img
                                            src={`/${projectDetails.project_images[1]?.image || projectDetails.project_images[0]?.image}`}
                                            className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                            alt="Secondary Detail View"
                                        />
                                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                            <p className="font-mono text-xs tracking-widest text-white uppercase">
                                                Exterior Detail 02
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* Technical Branding Stamp */}
                                    <div className="pt-20 lg:pt-32">
                                        <div className="flex items-center gap-4">
                                            <div className="h-px w-12 bg-primary" />
                                            <span className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase">
                                                Alliance Builders x ICSE
                                                Engineering
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: Equal Width Technical Data Table */}
                            <div className="pt-12 lg:pt-0">
                                <div className="mb-16">
                                    <h2 className="font-serif text-6xl leading-tight font-light tracking-tight text-white">
                                        Unit <br />
                                        <span className="text-primary italic">
                                            Specifications
                                        </span>
                                    </h2>
                                    <div className="mt-6 h-1 w-20 bg-primary" />
                                </div>

                                <div className="divide-y divide-white/10">
                                    {unitSpecs.map((spec, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group relative flex items-center justify-between py-10"
                                        >
                                            <div className="flex items-center gap-8">
                                                <div className="flex flex-col items-start gap-1">
                                                    <span className="font-mono text-[10px] text-primary/60">
                                                        0{i + 1}
                                                    </span>
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] transition-all duration-500 group-hover:border-primary/40 group-hover:bg-primary/10">
                                                        <spec.icon className="h-5 w-5 text-white/20 transition-all duration-500 group-hover:text-primary" />
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-light text-white/40 transition-colors group-hover:text-white">
                                                    {spec.label}
                                                </h3>
                                            </div>

                                            <div className="text-right">
                                                <span className="text-3xl font-light tracking-tighter text-white transition-colors group-hover:text-primary">
                                                    {spec.value}
                                                </span>
                                            </div>

                                            {/* Hover Highlight line */}
                                            <div className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-700 group-hover:w-full" />
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Technical Direction Footer */}
                                <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                                    <div className="bg-black p-8">
                                        <p className="mb-2 text-[10px] tracking-widest text-white/30 uppercase">
                                            Orientation
                                        </p>
                                        <p className="text-xl font-medium text-white">
                                            {
                                                projectDetails.details
                                                    ?.apartment_direction
                                            }
                                        </p>
                                    </div>
                                    <div className="bg-black p-8">
                                        <p className="mb-2 text-[10px] tracking-widest text-white/30 uppercase">
                                            Build Class
                                        </p>
                                        <p className="text-xl font-medium text-white">
                                            Alliance Grade A
                                        </p>
                                    </div>
                                </div>
                            </div>
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
