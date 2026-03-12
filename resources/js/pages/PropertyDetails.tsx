import { Link, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowLeft,
    Bath,
    Bed,
    Building2,
    Car,
    CheckCircle2,
    Compass,
    Hash,
    MapPin,
    Ruler,
    Square,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    Waves,
    ShieldCheck,
    FlameKindling,
    Wifi,
    Calendar,
    Video,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import MapComponent from '@/components/MapComponent';
import { Badge } from '@/components/ui/badge';
import AppLayout from "@/layouts/AppLayout";
import { properties } from "@/routes";
import type { Project } from '@/types/Project';
import ScrollAnimation from '@/components/ScrollAnimation';

const PropertyDetail = () => {
    const { projectDetails } = usePage<{ projectDetails: Project }>().props;
    const heroRef = useRef(null);

    // Gallery State & Refs
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    // const [isDragging, setIsDragging] = useState(false);
    // const [startX, setStartX] = useState(0);
    // const [scrollLeft, setScrollLeft] = useState(0);
    const isDragging = useRef(false);  // useRef instead of useState to avoid re-renders
    const startX = useRef(0);
    const scrollLeftRef = useRef(0);
    const velX = useRef(0);
    const lastX = useRef(0);
    const animFrame = useRef<number>(0);

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
        return new Date(dateString).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
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
        { label: 'Bathroom', value: projectDetails.details?.bathroom, icon: Bath },
        { label: 'Balcony', value: projectDetails.details?.balcony, icon: CheckCircle2 },
        { label: 'Kitchen', value: projectDetails.details?.kitchen, icon: CheckCircle2 },
        { label: 'Living & Dining', value: projectDetails.details?.living_dining, icon: CheckCircle2 },
        { label: 'Parking Slots', value: projectDetails.details?.parking, icon: Car },
        { label: 'Garage No.', value: projectDetails.details?.garage_no, icon: Car },
        { label: 'Garage Size', value: projectDetails.details?.garage_size, icon: Ruler },
    ].filter(spec => spec.value && spec.value !== "0");

    // --- MOUSE SWIPE LOGIC ---
    // const handleMouseDown = (e: React.MouseEvent) => {
    //     setIsDragging(true);
    //     setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    //     setScrollLeft(scrollRef.current?.scrollLeft || 0);
    // };
    //
    // const handleMouseMove = (e: React.MouseEvent) => {
    //     if (!isDragging || !scrollRef.current) return;
    //     e.preventDefault();
    //     const x = e.pageX - (scrollRef.current.offsetLeft || 0);
    //     const walk = (x - startX) * 2.5; // Scroll speed multiplier
    //     scrollRef.current.scrollLeft = scrollLeft - walk;
    // };
    //
    // const handleMouseUp = () => setIsDragging(false);
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        isDragging.current = true;
        startX.current = e.pageX;
        scrollLeftRef.current = scrollRef.current.scrollLeft;
        velX.current = 0;
        lastX.current = e.pageX;
        scrollRef.current.style.cursor = 'grabbing';
        if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !scrollRef.current) return;
        e.preventDefault();
        velX.current = e.pageX - lastX.current;
        lastX.current = e.pageX;
        const walk = e.pageX - startX.current;
        scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
    };

    const handleMouseUp = () => {
        if (!scrollRef.current) return;
        isDragging.current = false;
        scrollRef.current.style.cursor = 'grab';

        // Momentum / inertia after release
        const momentum = () => {
            if (!scrollRef.current) return;
            velX.current *= 0.92; // friction — lower = stops faster
            scrollRef.current.scrollLeft -= velX.current;
            if (Math.abs(velX.current) > 0.5) {
                animFrame.current = requestAnimationFrame(momentum);
            }
        };
        animFrame.current = requestAnimationFrame(momentum);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animFrame.current) cancelAnimationFrame(animFrame.current);
        };
    }, []);

    const scrollToIndex = (direction: 'next' | 'prev') => {
        if (!scrollRef.current) return;
        const scrollAmount = scrollRef.current.offsetWidth * 0.75;
        scrollRef.current.scrollBy({
            left: direction === 'next' ? scrollAmount : -scrollAmount,
            behavior: 'smooth'
        });
    };

    const totalImages = images.length;
    const progress = totalImages > 0 ? ((currentIndex + 1) / totalImages) * 100 : 0;

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
                                    label: 'Launch',
                                    value: formatDate(
                                        projectDetails.construction_start_date,
                                    ),
                                    icon: Calendar,
                                },
                                {
                                    label: 'Handover',
                                    value: formatDate(
                                        projectDetails.handover_date,
                                    ),
                                    icon: CheckCircle2,
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
                                <div
                                    key={i}
                                    className="group relative bg-[#0a0a0a] p-8"
                                >
                                    <stat.icon className="mb-4 h-5 w-5 text-white/40 transition-all duration-300 group-hover:text-primary" />
                                    <div className="mb-1 text-xs tracking-widest text-white/40 uppercase">
                                        {stat.label}
                                    </div>
                                    <div className="text-xl font-medium">
                                        {stat.value || '—'}
                                    </div>
                                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. AMENITIES: Interactive Grid with Spinning Icons */}
                <section className="py-24 bg-sidebar">
                    <div className="container mx-auto px-4">
                        <div className="mb-16 text-center">
                            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">
                                Lifestyle
                            </span>
                            <h2 className="mt-4 font-serif text-5xl font-light text-white">
                                Project Amenities
                            </h2>
                        </div>

                        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-6">
                            {projectDetails.facilities?.map((f) => {
                                const Icon = getFacilityIcon(f.name);
                                return (
                                    <ScrollAnimation>
                                        <motion.div
                                            key={f.id}
                                            whileHover={{ y: -5 }}
                                            className="group relative flex min-w-[220px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 transition-all duration-500 hover:border-primary/30"
                                        >
                                            {/* The Spinning Icon Container */}
                                            <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 transition-all duration-700 ease-in-out group-hover:rotate-[360deg] group-hover:bg-primary">
                                                <Icon className="h-8 w-8 text-primary-foreground transition-colors duration-500 group-hover:text-black" />
                                            </div>

                                            <span className="relative z-10 text-lg font-medium text-white/70 transition-colors group-hover:text-white">
                                                {f.name}
                                            </span>

                                            {/* Subtle background glow on hover */}
                                            <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                        </motion.div>
                                    </ScrollAnimation>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* 4. INTERNAL SPECIFICATIONS (50/50 SPLIT) */}
                <section className="overflow-hidden border-t border-white/5 bg-black py-24">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 items-start gap-24 lg:grid-cols-2">
                            <div className="h-fit lg:sticky lg:top-24">
                                <div className="relative flex flex-col gap-6">
                                    <motion.div
                                        initial={{ x: -50, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        transition={{ duration: 1 }}
                                        className="relative z-10 aspect-4/5 overflow-hidden rounded-4xl border border-white/10"
                                    >
                                        <img
                                            src={`/${projectDetails.project_images[0]?.image}`}
                                            className="h-full w-full object-cover"
                                            alt="Main"
                                        />
                                    </motion.div>
                                    <motion.div
                                        initial={{ x: 50, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        transition={{ duration: 1 }}
                                        className="-right-12 -bottom-40 z-20 aspect-3/4 w-[70%] overflow-hidden rounded-4xl border-2 border-black shadow-2xl lg:absolute"
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
                                        <ScrollAnimation>
                                            <div
                                                key={i}
                                                className="group relative flex items-center justify-between py-5"
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
                                        </ScrollAnimation>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. THE DRASTIC GALLERY (REDUCED HEIGHT & FLOATING ARROWS) */}
                <section className="overflow-hidden bg-[#050505] py-20">
                    <div className="container mx-auto mb-10 px-4">
                        <span className="text-[10px] font-bold tracking-[0.5em] text-primary uppercase">
                            Visual Portfolio
                        </span>
                        <h2 className="mt-2 font-serif text-4xl font-light text-white italic">
                            Gallery
                        </h2>
                    </div>

                    <div className="group relative px-4 md:px-[5vw]">
                        {/* FLOATING ARROWS */}
                        <button
                            onClick={() => scrollToIndex('prev')}
                            className="absolute top-1/2 left-8 z-40 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-primary hover:text-black"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={() => scrollToIndex('next')}
                            className="absolute top-1/2 right-8 z-40 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-primary hover:text-black"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>

                        <div
                            ref={scrollRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onScroll={(e) => {
                                const index = Math.round(
                                    e.currentTarget.scrollLeft /
                                        (e.currentTarget.offsetWidth * 0.7),
                                );
                                if (index !== currentIndex)
                                    setCurrentIndex(index);
                            }}
                            className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto pb-10 select-none"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                willChange: 'scroll-position', // GPU hint
                            }}
                        >
                            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                            {images.map((img, i) => (
                                <div
                                    key={i}
                                    className="relative aspect-[21/9] min-w-[75vw] snap-center overflow-hidden rounded-[2rem] border border-white/5 bg-white/5 md:min-w-[60vw]"
                                >
                                    <img
                                        src={img}
                                        className="pointer-events-none h-full w-full object-cover"
                                        alt={`Gallery ${i}`}
                                    />
                                    <div className="absolute bottom-6 left-6 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-md">
                                        <span className="font-mono text-[10px] tracking-widest text-white/60 uppercase">
                                            Perspective 0{i + 1}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="container mx-auto max-w-4xl px-4">
                        <div className="relative h-[1px] w-full bg-white/10">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-primary"
                                animate={{ width: `${progress}%` }}
                                transition={{ type: 'spring', stiffness: 100 }}
                            />
                        </div>
                    </div>
                </section>

                {/* 6. MEDIA: Contained Cinematic Tour */}
                <section className="border-t border-white/5 bg-black py-24">
                    <div className="container mx-auto px-4">
                        {/* Section Title - Above the Video */}
                        <div className="mb-12">
                            <span className="mb-4 block text-[10px] font-bold tracking-[0.5em] text-primary uppercase">
                                Cinematic Experience
                            </span>
                            <h2 className="font-serif text-5xl font-light tracking-tighter text-white italic md:text-6xl">
                                Virtual{' '}
                                <span className="ml-2 font-sans text-4xl font-bold tracking-widest text-primary/80 uppercase not-italic md:text-5xl">
                                    Walkthrough
                                </span>
                            </h2>
                        </div>

                        {/* Contained Video Wrapper */}
                        <div className="relative mx-auto max-w-6xl">
                            <div className="relative  overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl md:rounded-[3rem]">
                                {projectDetails.details?.youtube_video_id ? (
                                    <iframe
                                        className="h-[80dvh] w-full"
                                        src={`https://www.youtube.com/embed/${projectDetails.details.youtube_video_id}?rel=0&modestbranding=1`}
                                        title="Property Video Tour"
                                        allowFullScreen
                                    />
                                ) : (
                                    <div className="flex h-full w-full flex-col items-center justify-center">
                                        <Video className="mb-4 h-12 w-12 text-white/10" />
                                        <span className="text-[10px] tracking-[0.4em] text-white/20 uppercase">
                                            Visuals in Production
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Aesthetic accent behind the video */}
                            <div className="absolute -inset-4 -z-10 rounded-full bg-primary/5 opacity-50 blur-3xl" />
                        </div>
                    </div>
                </section>

                {/* 7. LOCATION: Accessible Neighborhood Map */}
                <section className="bg-[#0a0a0a] py-24">
                    <div className="container mx-auto mb-12 px-4">
                        <div className="flex flex-col justify-between gap-6 border-l-2 border-primary pl-8 md:flex-row md:items-end">
                            <div>
                                <span className="text-[10px] font-bold tracking-[0.5em] text-primary uppercase">
                                    Strategic Context
                                </span>
                                <h2 className="mt-2 font-serif text-5xl font-light tracking-tight text-white">
                                    The{' '}
                                    <span className="text-primary italic">
                                        Neighborhood
                                    </span>
                                </h2>
                            </div>
                            <div className="flex items-center gap-3 pb-1 font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
                                <MapPin className="h-4 w-4 text-primary/60" />
                                {projectDetails.address}
                            </div>
                        </div>
                    </div>

                    {/* Map Container - Now Unblocked */}
                    <div className="relative h-[65vh] w-full overflow-hidden border-y border-white/5">
                        <div className="h-full w-full contrast-[1.1] grayscale invert-[0.05] transition-all duration-1000 ease-in-out hover:grayscale-0">
                            <MapComponent width="100%" height="100%" src={projectDetails.google_map_url} />
                        </div>

                        {/* Decorative corner accents instead of full overlays */}
                        <div className="pointer-events-none absolute top-0 left-0 h-32 w-32 bg-gradient-to-br from-black to-transparent" />
                        <div className="pointer-events-none absolute right-0 bottom-0 h-32 w-32 bg-gradient-to-tl from-black to-transparent" />
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default PropertyDetail;
