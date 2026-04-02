import { usePage } from '@inertiajs/react';
import { motion, useScroll } from 'framer-motion';
import {
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
    Waves,
    ShieldCheck,
    FlameKindling,
    Wifi,
    Calendar,
    Video,
    Home,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import MapComponent from '@/components/MapComponent';
import ScrollAnimation from '@/components/ScrollAnimation';
import { Badge } from '@/components/ui/badge';
import AppLayout from "@/layouts/AppLayout";
import type { Project } from '@/types/Project';

const PropertyDetail = () => {
    const { projectDetails } = usePage<{ projectDetails: Project }>().props;
    const heroRef = useRef(null);
    const [activeImage, setActiveImage] = useState(0);

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

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        isDragging.current = true;
        startX.current = e.pageX;
        scrollLeftRef.current = scrollRef.current.scrollLeft;
        velX.current = 0;
        lastX.current = e.pageX;
        scrollRef.current.style.cursor = 'grabbing';
        scrollRef.current.style.scrollBehavior = 'auto';
        if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !scrollRef.current) return;
        e.preventDefault();
        const now = Date.now();
        const deltaTime = now - (lastX.current as any);
        velX.current = (e.pageX - lastX.current) / Math.max(deltaTime, 16);
        lastX.current = e.pageX;
        const walk = e.pageX - startX.current;
        scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
    };

    const handleMouseUp = () => {
        if (!scrollRef.current) return;
        isDragging.current = false;
        scrollRef.current.style.cursor = 'grab';
        scrollRef.current.style.scrollBehavior = 'smooth';

        // Snap to nearest slide
        const slideWidth = getSlideWidth();
        const gap = 16;
        const totalWidth = slideWidth + gap;
        const targetIndex = Math.round(scrollRef.current.scrollLeft / totalWidth);
        const targetScroll = targetIndex * totalWidth;
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.offsetWidth;

        scrollRef.current.scrollTo({
            left: Math.max(0, Math.min(targetScroll, maxScroll)),
            behavior: 'smooth'
        });
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') scrollToIndex('prev');
            if (e.key === 'ArrowRight') scrollToIndex('next');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [images.length]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animFrame.current) cancelAnimationFrame(animFrame.current);
        };
    }, []);

    const scrollToIndex = (direction: 'next' | 'prev') => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const isLarge = window.innerWidth >= 1024;
        const slideWidth = isLarge ? container.offsetWidth * 0.5 : 
                          window.innerWidth >= 768 ? container.offsetWidth * 0.6 :
                          window.innerWidth >= 640 ? container.offsetWidth * 0.7 :
                          container.offsetWidth * 0.85;
        const gap = 16; // sm:gap-6 = 24px, gap-4 = 16px
        const totalWidth = slideWidth + (window.innerWidth >= 640 ? gap : 16);
        const newScroll = container.scrollLeft + (direction === 'next' ? totalWidth : -totalWidth);
        
        container.scrollTo({
            left: newScroll,
            behavior: 'smooth'
        });
    };

    const getSlideWidth = () => {
        if (!scrollRef.current) return 0;
        const container = scrollRef.current;
        const isLarge = window.innerWidth >= 1024;
        return isLarge ? container.offsetWidth * 0.5 : 
               window.innerWidth >= 768 ? container.offsetWidth * 0.6 :
               window.innerWidth >= 640 ? container.offsetWidth * 0.7 :
               container.offsetWidth * 0.85;
    };

    const calculateCurrentIndex = (scrollLeft: number) => {
        if (!scrollRef.current) return 0;
        const slideWidth = getSlideWidth();
        const gap = 16;
        const totalWidth = slideWidth + gap;
        const index = Math.round(scrollLeft / totalWidth);
        return Math.max(0, Math.min(index, images.length - 1));
    };

    const totalImages = images.length;
    const progress = totalImages > 0 ? Math.min(((currentIndex + 1) / totalImages) * 100, 100) : 0;

    // Touch/swipe handling for gallery
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!scrollRef.current) return;
        isDragging.current = true;
        startX.current = e.touches[0].clientX;
        scrollLeftRef.current = scrollRef.current.scrollLeft;
        lastX.current = e.touches[0].clientX;
        velX.current = 0;
        scrollRef.current.style.scrollBehavior = 'auto';
        if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging.current || !scrollRef.current) return;
        const x = e.touches[0].clientX;
        velX.current = x - lastX.current;
        lastX.current = x;
        const walk = x - startX.current;
        scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
    };

    const handleTouchEnd = () => {
        if (!scrollRef.current) return;
        isDragging.current = false;
        scrollRef.current.style.scrollBehavior = 'smooth';

        // Snap to nearest slide with considered velocity
        const slideWidth = getSlideWidth();
        const gap = 16;
        const totalWidth = slideWidth + gap;
        const currentScroll = scrollRef.current.scrollLeft;
        
        // Consider velocity for flick gestures
        let targetIndex = Math.round(currentScroll / totalWidth);
        if (Math.abs(velX.current) > 1) {
            targetIndex += velX.current > 0 ? -1 : 1;
        }
        
        targetIndex = Math.max(0, Math.min(targetIndex, images.length - 1));
        const targetScroll = targetIndex * totalWidth;
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.offsetWidth;

        scrollRef.current.scrollTo({
            left: Math.max(0, Math.min(targetScroll, maxScroll)),
            behavior: 'smooth'
        });
        
        setCurrentIndex(targetIndex);
    };

    return (
        <AppLayout>
            <div className="bg-[#0a0a0a] text-white selection:bg-primary/30">

                {/* Hero + Gallery */}
                <section className="container mx-auto px-4 pt-24 pb-12 h-full">
                    <ScrollAnimation>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                            <div className="grid grid-cols-3 gap-3 lg:flex lg:flex-col">
                                {images.slice(0, 3).map((img, index) => (
                                    <motion.button
                                        key={index}
                                        type="button"
                                        onClick={() => setActiveImage(index)}
                                        className={`relative h-28 overflow-hidden rounded-2xl border transition-all duration-300 ${
                                            activeImage === index
                                                ? 'border-sky-400/80 shadow-lg shadow-sky-500/40'
                                                : 'border-white/10 hover:border-sky-400/50'
                                        }`}
                                        whileHover={{ scale: 1.03 }}
                                    >
                                        <img
                                            src={img}
                                            alt={`Property view ${index + 1}`}
                                            className=" w-full object-cover"
                                        />
                                        {activeImage === index && (
                                            <div className="pointer-events-none absolute inset-0 bg-sky-500/20" />
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            <div className="relative overflow-hidden rounded-3xl border border-cyan-200/15 bg-gradient-to-br from-cyan-400/10 via-slate-900/60 to-slate-950/80 lg:col-span-3">
                                <motion.div
                                    className="relative h-80 w-full overflow-hidden"
                                    initial={{ scale: 1.02, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {primaryImage && (
                                        <img
                                            src={primaryImage}
                                            alt={projectDetails.name}
                                            className=" w-full object-cover"
                                        />
                                    )}
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent" />
                                </motion.div>

                                <div className="pointer-events-none absolute inset-0">
                                    <div className="absolute -left-32 top-10 h-64 w-64 rounded-full bg-cyan-400/25 blur-3xl" />
                                    <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl" />
                                    <div className="absolute left-1/3 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
                                </div>

                                <div className="relative z-10 flex flex-col gap-4 px-6 pb-6 pt-4 md:px-10 md:pb-8">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <Badge className="bg-gradient-to-r from-cyan-300 to-sky-400 px-4 py-1.5 text-sm font-semibold text-slate-950">
                                                {projectDetails.handover_date && new Date(projectDetails.handover_date) <= new Date() ? 'Ready to Move' : 'Under Construction'}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="border-cyan-200/25 bg-slate-950/35 px-3 py-1 text-xs uppercase tracking-wide text-cyan-50/90"
                                            >
                                                {projectDetails.tags?.[0]?.name || 'Residential'}
                                            </Badge>
                                        </div>
                                        {projectDetails.price && (
                                            <div className="flex items-center gap-2 rounded-full bg-slate-950/45 px-4 py-1.5 ring-1 ring-cyan-200/10">
                                                <span className="text-xs text-slate-200">Starting from</span>
                                                <span className="text-sm font-semibold text-cyan-300">
                                                    {formatCurrency(projectDetails.price)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                        <div>
                                            <h1 className="mb-2 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
                                                {projectDetails.name}
                                            </h1>
                                            <div className="flex items-center text-sm text-slate-200/80">
                                                <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-sky-300" />
                                                <span>
                                                    {projectDetails.address ??
                                                        'Address to be announced'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {projectDetails.details
                                                ?.bedroom && (
                                                <div className="flex items-center gap-2 rounded-full bg-slate-950/45 px-4 py-1.5 text-xs ring-1 ring-cyan-200/10">
                                                    <Bed className="h-4 w-4 text-cyan-200" />
                                                    <span>
                                                        {
                                                            projectDetails
                                                                .details
                                                                .bedroom
                                                        }{' '}
                                                        Bedrooms
                                                    </span>
                                                </div>
                                            )}
                                            {projectDetails.details
                                                ?.bathroom && (
                                                <div className="flex items-center gap-2 rounded-full bg-slate-950/45 px-4 py-1.5 text-xs ring-1 ring-cyan-200/10">
                                                    <Bath className="h-4 w-4 text-cyan-200" />
                                                    <span>
                                                        {
                                                            projectDetails
                                                                .details
                                                                .bathroom
                                                        }{' '}
                                                        Bathrooms
                                                    </span>
                                                </div>
                                            )}
                                            {projectDetails.details
                                                ?.apartment_direction && (
                                                <div className="flex items-center gap-2 rounded-full bg-slate-950/45 px-4 py-1.5 text-xs ring-1 ring-cyan-200/10">
                                                    <Compass className="h-4 w-4 text-cyan-200" />
                                                    <span>
                                                        Facing{' '}
                                                        {
                                                            projectDetails
                                                                .details
                                                                .apartment_direction
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>
                </section>

                {/* 2. AT A GLANCE */}
                <section className="border-b border-white/5 py-24">
                    <div className="container mx-auto grid grid-cols-1 gap-16 px-4 lg:grid-cols-12">
                        <div className="lg:col-span-5">
                            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">
                                Project Overview
                            </span>
                            <h2 className="mt-6 mb-8 text-4xl leading-tight font-light">
                                {projectDetails.description}
                            </h2>
                            <div className="flex items-center gap-3 text-sm text-white/60">
                                <Home className="h-4 w-4 text-primary" />
                                <span>Project ID: {projectDetails.project_id}</span>
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
                                Features
                            </span>
                            <h2 className="mt-4 font-serif text-5xl font-light text-white">
                                Amenities & Facilities
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-white/50">
                                Thoughtfully designed features to enhance your living experience
                            </p>
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

                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="group relative">
                        {/* FLOATING ARROWS */}
                        <button
                            onClick={() => scrollToIndex('prev')}
                            className="group/btn absolute top-1/2 left-4 z-40 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:border-primary/50 hover:bg-primary hover:text-black"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="h-6 w-6 transition-transform duration-300 group-hover/btn:scale-110" />
                        </button>
                        <button
                            onClick={() => scrollToIndex('next')}
                            className="group/btn absolute top-1/2 right-4 z-40 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:border-primary/50 hover:bg-primary hover:text-black"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="h-6 w-6 transition-transform duration-300 group-hover/btn:scale-110" />
                        </button>

                        <div
                            ref={scrollRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onScroll={(e) => {
                                if (isDragging.current) return; // Don't update index while dragging
                                const index = calculateCurrentIndex(e.currentTarget.scrollLeft);
                                if (index !== currentIndex) {
                                    setCurrentIndex(index);
                                }
                            }}
                            className="no-scrollbar flex max-h-screen cursor-grab touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 select-none sm:gap-6"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                WebkitOverflowScrolling: 'touch',
                            }}
                        >
                            <style>{`
                                .no-scrollbar::-webkit-scrollbar { display: none; }
                                .gallery-slide {
                                    scroll-snap-align: center;
                                    scroll-snap-stop: always;
                                }
                            `}</style>
                            {images.map((img, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5, delay: i * 0.05 }}
                                    className="gallery-slide group relative h-full max-h-screen w-full flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-primary/30"
                                >
                                    <img
                                        src={img}
                                        className="h-full w-full object-cover"
                                        alt={`Gallery ${i + 1}`}
                                        draggable={false}
                                    />
                                    {/* Subtle gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300 group-hover:from-black/30" />
                                    <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 backdrop-blur-md transition-all duration-300 sm:bottom-6 sm:left-6 group-hover:border-primary/30 group-hover:bg-black/50">
                                        <span className="text-[10px] font-medium tracking-wider text-white/70 uppercase transition-colors duration-300 group-hover:text-primary/80">
                                            {String(i + 1).padStart(2, '0')} / {String(totalImages).padStart(2, '0')}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    </div>

                    <div className="container mx-auto max-w-6xl px-4 mt-6">
                        <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/5">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-primary to-sky-400"
                                animate={{ width: `${progress}%` }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}
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
