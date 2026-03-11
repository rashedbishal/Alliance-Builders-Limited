import { Link, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowLeft,
    Bath,
    Bed,
    Building2,
    Calendar,
    Car,
    CheckCircle2,
    Compass,
    ExternalLink,
    Hash,
    MapPin,
    Ruler,
    Square,
    Video,
    Waves,
    Wifi,
    Map as MapIcon,
    ChevronDown,
    Droplets,
    ShieldCheck,
    FlameKindling,
    ChevronLeft,
    ChevronRight,
    Maximize2,
} from 'lucide-react';
import React, { useState, useRef } from 'react';
import MapComponent from '@/components/MapComponent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/AppLayout';
import { properties } from '@/routes';
import type { Project } from '@/types/Project';

const PropertyDetail = () => {
    const { projectDetails } = usePage<{ projectDetails: Project }>().props;
    const heroRef = useRef(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);

    if (!projectDetails) return null;

    // --- DATA HELPERS ---
    const images =
        projectDetails.project_images?.map((img) => `/${img.image}`) ?? [];
    const primaryImage = images[0] ?? '/placeholder-property.jpg';

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'TBA';
        return new Date(dateString).toLocaleDateString('en-GB', {
            month: 'short',
            year: 'numeric',
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const getFacilityIcon = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('wifi')) return Wifi;
        if (n.includes('fire')) return FlameKindling;
        if (n.includes('pool')) return Waves;
        if (n.includes('security')) return ShieldCheck;
        return CheckCircle2;
    };

    const unitSpecs = [
        { label: 'Bedroom', value: projectDetails.details?.bedroom, icon: Bed },
        {
            label: 'Bathroom',
            value: projectDetails.details?.bathroom,
            icon: Bath,
        },
        {
            label: 'Balcony',
            value: projectDetails.details?.balcony,
            icon: CheckCircle2,
        },
        {
            label: 'Kitchen',
            value: projectDetails.details?.kitchen,
            icon: CheckCircle2,
        },
        {
            label: 'Living & Dining',
            value: projectDetails.details?.living_dining,
            icon: CheckCircle2,
        },
        {
            label: 'Parking Slots',
            value: projectDetails.details?.parking,
            icon: Car,
        },
        {
            label: 'Garage No.',
            value: projectDetails.details?.garage_no,
            icon: Hash,
        },
        {
            label: 'Garage Size',
            value: projectDetails.details?.garage_size,
            icon: Ruler,
        },
    ].filter((spec) => spec.value && spec.value !== '0');

    // --- GALLERY LOGIC ---
    const totalImages = projectDetails.project_images?.length || 0;
    const progress =
        totalImages > 1 ? (currentIndex / (totalImages - 1)) * 100 : 100;

    const scrollToIndex = (index: number) => {
        if (!containerRef.current) return;
        const width = containerRef.current.offsetWidth;
        containerRef.current.scrollTo({
            left: index * (width * 0.7),
            behavior: 'smooth',
        });
        setCurrentIndex(index);
    };

    return (
        <AppLayout>
            <div className="bg-[#0a0a0a] text-white selection:bg-primary/30">
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
                        <h1 className="mb-4 font-serif text-6xl font-light tracking-tighter drop-shadow-2xl md:text-8xl">
                            {projectDetails.name}
                        </h1>
                        <div className="flex flex-col justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
                            <div className="flex items-center gap-3 text-lg text-white/60">
                                <MapPin className="h-5 w-5 text-primary" />{' '}
                                {projectDetails.address},{' '}
                                {projectDetails.location?.name}
                            </div>
                            <div className="text-3xl font-light md:text-5xl">
                                {formatCurrency(projectDetails.price)}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. AT A GLANCE */}
                <section className="border-b border-white/5 py-24">
                    <div className="container mx-auto grid grid-cols-1 gap-16 px-4 lg:grid-cols-12">
                        <div className="lg:col-span-5">
                            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">
                                The Narrative
                            </span>
                            <h2 className="mt-6 mb-8 text-4xl leading-tight font-light">
                                {projectDetails.description}
                            </h2>
                            <div className="space-y-4">
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
                                    label: 'Parking',
                                    value: projectDetails.details?.parking,
                                    icon: Car,
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
                                    }}
                                    className="group relative bg-[#0a0a0a] p-8 transition-all duration-300"
                                >
                                    <stat.icon className="mb-4 h-5 w-5 text-white/40 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
                                    <div className="mb-1 text-xs tracking-widest text-white/40 uppercase transition-colors group-hover:text-white/60">
                                        {stat.label}
                                    </div>
                                    <div className="text-xl font-medium transition-transform duration-300 group-hover:translate-x-1">
                                        {stat.value || '—'}
                                    </div>
                                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. AMENITIES (CENTERED FLEX) */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="mb-16 text-center">
                            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">
                                Lifestyle
                            </span>
                            <h2 className="mt-4 font-serif text-5xl font-light">
                                Project Amenities
                            </h2>
                        </div>
                        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-6">
                            {projectDetails.facilities?.map((f) => {
                                const Icon = getFacilityIcon(f.name);
                                return (
                                    <motion.div
                                        key={f.id}
                                        whileHover={{ y: -5 }}
                                        className="group relative flex min-w-[220px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8"
                                    >
                                        <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 transition-all duration-700 group-hover:rotate-[360deg] group-hover:bg-primary">
                                            <Icon className="h-8 w-8 text-primary transition-colors group-hover:text-white" />
                                        </div>
                                        <span className="relative z-10 text-lg font-medium transition-colors group-hover:text-white">
                                            {f.name}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* 4. INTERNAL SPECIFICATIONS (BALANCED DUAL-IMAGE SPLIT) */}
                <section className="overflow-hidden border-t border-white/5 bg-black py-24">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 items-start gap-24 lg:grid-cols-2">
                            <div className="h-fit lg:sticky lg:top-24">
                                <div className="relative flex flex-col gap-6">
                                    <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10">
                                        <img
                                            src={`/${projectDetails.project_images[0]?.image}`}
                                            className="h-full w-full object-cover"
                                            alt="Main"
                                        />
                                    </div>
                                    <motion.div
                                        initial={{ x: 50, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        className="-right-12 -bottom-16 z-20 aspect-[3/4] w-[70%] overflow-hidden rounded-[2rem] border-[12px] border-black shadow-2xl lg:absolute"
                                    >
                                        <img
                                            src={`/${projectDetails.project_images[1]?.image || projectDetails.project_images[0]?.image}`}
                                            className="h-full w-full object-cover"
                                            alt="Detail"
                                        />
                                    </motion.div>
                                </div>
                            </div>
                            <div>
                                <h2 className="mb-16 font-serif text-6xl leading-tight font-light tracking-tight">
                                    Unit <br />
                                    <span className="text-primary italic">
                                        Specifications
                                    </span>
                                </h2>
                                <div className="divide-y divide-white/10">
                                    {unitSpecs.map((spec, i) => (
                                        <div
                                            key={i}
                                            className="group relative flex items-center justify-between py-10"
                                        >
                                            <div className="flex items-center gap-8">
                                                <div className="flex flex-col items-start gap-1">
                                                    <span className="font-mono text-[10px] text-primary/60">
                                                        0{i + 1}
                                                    </span>
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] group-hover:bg-primary/10">
                                                        <spec.icon className="h-5 w-5 text-white/20 transition-all duration-500 group-hover:text-primary" />
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-light text-white/40 transition-colors group-hover:text-white">
                                                    {spec.label}
                                                </h3>
                                            </div>
                                            <span className="text-3xl font-light tracking-tighter transition-colors group-hover:text-primary">
                                                {spec.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. THE DRASTIC GALLERY */}
                <section className="overflow-hidden bg-[#050505] py-32">
                    <div className="container mx-auto mb-16 flex flex-col justify-between gap-8 px-4 md:flex-row md:items-end">
                        <div>
                            <span className="text-xs font-bold tracking-[0.5em] text-primary uppercase">
                                Immersive View
                            </span>
                            <h2 className="mt-4 font-serif text-6xl font-light text-white italic">
                                Gallery
                            </h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => scrollToIndex(currentIndex - 1)}
                                disabled={currentIndex === 0}
                                className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 text-white transition-all hover:bg-primary hover:text-black disabled:opacity-20"
                            >
                                <ChevronLeft />
                            </button>
                            <button
                                onClick={() => scrollToIndex(currentIndex + 1)}
                                disabled={currentIndex === totalImages - 1}
                                className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 text-white transition-all hover:bg-primary hover:text-black disabled:opacity-20"
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    </div>
                    <div className="relative cursor-grab active:cursor-grabbing">
                        <motion.div
                            ref={containerRef}
                            className="no-scrollbar flex snap-x snap-mandatory gap-8 overflow-x-auto px-[10vw] pb-20"
                            onScroll={(e) => {
                                const index = Math.round(
                                    e.currentTarget.scrollLeft /
                                        (e.currentTarget.offsetWidth * 0.7),
                                );
                                if (index !== currentIndex)
                                    setCurrentIndex(index);
                            }}
                        >
                            {projectDetails.project_images?.map((img, i) => (
                                <div
                                    key={img.id}
                                    className="group relative aspect-[16/10] min-w-[80vw] snap-center overflow-hidden rounded-[3rem] border border-white/5 md:min-w-[65vw]"
                                >
                                    <img
                                        src={`/${img.image}`}
                                        className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                        alt="Detail"
                                    />
                                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-12 opacity-0 transition-all group-hover:opacity-100">
                                        <div className="flex w-full items-end justify-between">
                                            <h4 className="text-3xl font-light">
                                                {projectDetails.name}
                                            </h4>
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                                                <Maximize2 className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                    <div className="container mx-auto px-4">
                        <div className="relative h-[2px] w-full rounded-full bg-white/10">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-primary"
                                animate={{ width: `${progress}%` }}
                                transition={{ type: 'spring' }}
                            />
                        </div>
                    </div>
                </section>

                {/* 6. FULL WIDE VIDEO */}
                <section className="h-[70vh] w-full bg-black">
                    {projectDetails.details?.youtube_video_id ? (
                        <iframe
                            className="h-full w-full"
                            src={`https://www.youtube.com/embed/${projectDetails.details.youtube_video_id}`}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center tracking-[0.5em] text-white/20 uppercase">
                            Experience Coming Soon
                        </div>
                    )}
                </section>

                {/* 7. FULL WIDE MAP */}
                <section className="h-[60vh] w-full grayscale transition-all duration-1000 hover:grayscale-0">
                    <MapComponent width="100%" height="100%" />
                </section>
            </div>
        </AppLayout>
    );
};

export default PropertyDetail;
