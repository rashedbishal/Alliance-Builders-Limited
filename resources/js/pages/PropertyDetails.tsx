import { usePage } from '@inertiajs/react';
import { motion, useScroll } from 'framer-motion';
import {
    Bath,
    Bed,
    Building2,
    Car,
    CheckCircle2,
    Hash,
    MapPin,
    Ruler,
    Square,
    ChevronLeft,
    ChevronRight,
    Expand,
    Heart,
    Waves,
    ShieldCheck,
    FlameKindling,
    Wifi,
    Calendar,
    Video,
    Home,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { Autoplay, Keyboard, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper/types';
import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import SurroundingsSection from '@/components/HotelDetails/SurroundingsSection';
import MapComponent from '@/components/MapComponent';
import SavedAnimation from '@/components/SavedAnimation';
import ScrollAnimation from '@/components/ScrollAnimation';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '@/hooks/useFavorites';
import AppLayout from '@/layouts/AppLayout';
import type { Project } from '@/types/Project';

import 'swiper/css';
import 'swiper/css/a11y';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

const PropertyDetail = () => {
    const { projectDetails } = usePage<{ projectDetails: Project }>().props;
    const heroRef = useRef(null);
    const { isFavorite, toggleFavorite, SAVED_EVENT } = useFavorites();
    const [activeImage, setActiveImage] = useState(0);
    const [showSaved, setShowSaved] = useState(false);

    // Gallery State
    const gallerySwiperRef = useRef<SwiperClass | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    // True while the browser's native fullscreen mode is active — the thumbnail
    // strip is dropped in that state so the image itself can claim the full
    // width/height of the screen, matching how a native media viewer behaves.
    const [isImmersiveFullscreen, setIsImmersiveFullscreen] = useState(false);
    // --- DATA HELPERS ---
    const images =
        projectDetails?.project_images?.map((img) => `/${img.image}`) ?? [];
    const primaryImage = images[0] ?? '/placeholder-property.jpg';

    // Auto-advance the hero image on mobile, where it behaves as a carousel (no side thumbnails)
    useEffect(() => {
        if (images.length <= 1) return;
        const timer = setInterval(() => {
            setActiveImage((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [images.length]);

    useEffect(() => {
        const handleSaved = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (
                customEvent.detail.id === projectDetails?.id &&
                customEvent.detail.isSaved
            ) {
                setShowSaved(true);
            }
        };

        window.addEventListener(SAVED_EVENT, handleSaved);
        return () => window.removeEventListener(SAVED_EVENT, handleSaved);
    }, [projectDetails?.id, SAVED_EVENT]);

    if (!projectDetails) return null;

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'TBA';
        return new Date(dateString).toLocaleDateString('en-GB', {
            month: 'short',
            year: 'numeric',
        });
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
            icon: Car,
        },
        {
            label: 'Garage Size',
            value: projectDetails.details?.garage_size
                ? `${projectDetails.details.garage_size} sq ft`
                : projectDetails.details?.garage_size,
            icon: Ruler,
        },
    ].filter((spec) => spec.value && spec.value !== '0');

    const totalImages = images.length;
    const progress =
        totalImages > 0
            ? Math.min(((currentIndex + 1) / totalImages) * 100, 100)
            : 0;

    const openLightboxAt = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    return (
        <>
            <SavedAnimation show={showSaved} />
            <AppLayout>
                <div className="bg-[#0a0a0a] text-white selection:bg-primary/30">
                    {/* Hero + Gallery */}
                    <section className="container mx-auto mb-6 max-w-[1280px] px-4 pt-24 pb-4 sm:px-6 lg:mb-8 lg:px-8 lg:pt-28 lg:pb-6">
                        <ScrollAnimation>
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-stretch">
                                <div className="hidden lg:grid lg:h-[min(calc(100dvh-9.5rem),540px)] lg:grid-rows-3 lg:gap-3 lg:overflow-hidden">
                                    {[0, 1, 2].map((index) => {
                                        const img = images[index];
                                        if (!img) {
                                            return (
                                                <div
                                                    key={`thumb-slot-${index}`}
                                                    className="h-full min-h-0 w-full"
                                                    aria-hidden
                                                />
                                            );
                                        }

                                        return (
                                            <motion.button
                                                key={index}
                                                type="button"
                                                onClick={() =>
                                                    setActiveImage(index)
                                                }
                                                className={`relative h-full max-h-full min-h-0 w-full overflow-hidden rounded-2xl border transition-all duration-300 ${
                                                    activeImage === index
                                                        ? 'border-sky-400/80 shadow-lg shadow-sky-500/40'
                                                        : 'border-white/10 hover:border-sky-400/50'
                                                }`}
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Property view ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                                {activeImage === index && (
                                                    <div className="pointer-events-none absolute inset-0 bg-sky-500/20" />
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                <div className="relative h-[calc(100dvh-9.5rem)] w-full overflow-hidden rounded-3xl border border-cyan-200/15 bg-gradient-to-br from-cyan-400/10 via-slate-900/60 to-slate-950/80 md:h-[calc(100dvh-9.5rem)] lg:h-[min(calc(100dvh-9.5rem),540px)]">
                                    <motion.div
                                        className="relative h-full w-full overflow-hidden"
                                        initial={{ scale: 1.02, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.6 }}
                                        key={activeImage}
                                    >
                                        {images[activeImage] && (
                                            <img
                                                src={images[activeImage]}
                                                alt={projectDetails.name}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        )}
                                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(2_6_23/0.9)_0%,rgb(2_6_23/0.65)_16%,rgb(2_6_23/0.25)_32%,transparent_52%)]" />
                                    </motion.div>

                                    <motion.button
                                        type="button"
                                        onClick={() =>
                                            toggleFavorite(projectDetails.id)
                                        }
                                        aria-pressed={isFavorite(
                                            projectDetails.id,
                                        )}
                                        aria-label={
                                            isFavorite(projectDetails.id)
                                                ? 'Remove from favorites'
                                                : 'Add to favorites'
                                        }
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.92 }}
                                        transition={{
                                            duration: 0.4,
                                            delay: 0.2,
                                        }}
                                        className={`absolute top-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-colors duration-300 md:top-6 md:right-6 ${
                                            isFavorite(projectDetails.id)
                                                ? 'border-red-400/60 bg-red-500/15 shadow-[0_4px_24px_rgba(239,68,68,0.35)]'
                                                : 'border-white/20 bg-black/40 hover:border-white/40 hover:bg-black/60'
                                        }`}
                                    >
                                        <Heart
                                            className={`h-5 w-5 transition-all duration-300 ${
                                                isFavorite(projectDetails.id)
                                                    ? 'scale-110 fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]'
                                                    : 'text-white'
                                            }`}
                                        />
                                    </motion.button>

                                    {images.length > 1 && (
                                        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2 lg:hidden">
                                            {images.map((_, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveImage(index)
                                                    }
                                                    aria-label={`Go to image ${index + 1}`}
                                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                                        activeImage === index
                                                            ? 'w-6 bg-cyan-300'
                                                            : 'w-1.5 bg-white/40'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <div className="pointer-events-none absolute inset-0">
                                        <div className="absolute top-10 -left-32 h-64 w-64 rounded-full bg-cyan-400/25 blur-3xl" />
                                        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl" />
                                        <div className="absolute top-0 left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 px-6 pt-20 pb-6 md:px-10 md:pb-8">
                                        <Badge className="w-fit bg-gradient-to-r from-cyan-300 to-sky-400 px-4 py-1.5 text-sm font-semibold text-slate-950">
                                            {projectDetails.handover_date &&
                                            new Date(
                                                projectDetails.handover_date,
                                            ) <= new Date()
                                                ? 'Ready to Move'
                                                : 'Under Construction'}
                                        </Badge>

                                        <div>
                                            <h1 className="mb-2 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
                                                {projectDetails.name}
                                            </h1>
                                            <div className="flex items-center text-sm text-slate-200/90">
                                                <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-sky-300" />
                                                <span>
                                                    {projectDetails.address ??
                                                        'Address to be announced'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollAnimation>
                    </section>

                    {/* 2. AT A GLANCE */}
                    <section className="border-b border-white/5 py-16 sm:py-20 lg:py-24">
                        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 lg:grid-cols-12 lg:gap-16">
                            <div className="lg:col-span-5">
                                <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">
                                    Project Overview
                                </span>
                                <h2 className="mt-4 mb-6 text-2xl leading-tight font-light sm:text-3xl lg:text-4xl">
                                    {projectDetails.description}
                                </h2>
                                <div className="flex items-center gap-3 text-sm text-white/60">
                                    <Home className="h-4 w-4 text-primary" />
                                    <span>
                                        Project ID: {projectDetails.project_id}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:rounded-3xl md:grid-cols-3 lg:col-span-7">
                                {[
                                    {
                                        label: 'Apartment Size',
                                        value: projectDetails.size
                                            ? `${projectDetails.size} sq ft`
                                            : projectDetails.size,
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
                                        className="group relative bg-[#0a0a0a] p-5 sm:p-6 lg:p-8"
                                    >
                                        <stat.icon className="mb-3 h-4 w-4 text-white/40 transition-all duration-300 group-hover:text-primary sm:mb-4 sm:h-5 sm:w-5" />
                                        <div className="mb-1 text-[10px] tracking-widest text-white/40 uppercase sm:text-xs">
                                            {stat.label}
                                        </div>
                                        <div className="truncate text-lg font-medium sm:text-xl">
                                            {stat.value || '—'}
                                        </div>
                                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 3. AMENITIES: Interactive Grid with Spinning Icons */}
                    <section className="bg-sidebar py-16 sm:py-20 lg:py-24">
                        <div className="container mx-auto px-4">
                            <div className="mb-10 text-center sm:mb-16">
                                <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">
                                    Features
                                </span>
                                <h2 className="mt-3 font-serif text-3xl font-light text-white sm:text-4xl lg:text-5xl">
                                    Amenities & Facilities
                                </h2>
                                <p className="mx-auto mt-3 max-w-2xl text-sm text-white/50 sm:text-base">
                                    Thoughtfully designed features to enhance
                                    your living experience
                                </p>
                            </div>

                            <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-4 sm:gap-6">
                                {projectDetails.facilities?.map((f) => {
                                    const Icon = getFacilityIcon(f.name);
                                    return (
                                        <ScrollAnimation key={f.id}>
                                            <motion.div
                                                whileHover={{ y: -5 }}
                                                className="group relative flex max-w-[280px] min-w-[140px] flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-500 hover:border-primary/30 sm:min-w-[200px] sm:rounded-[2rem] sm:p-8"
                                            >
                                                {/* The Spinning Icon Container */}
                                                <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 transition-all duration-700 ease-in-out group-hover:rotate-[360deg] group-hover:bg-primary sm:mb-6 sm:h-16 sm:w-16">
                                                    <Icon className="h-6 w-6 text-primary-foreground transition-colors duration-500 group-hover:text-black sm:h-8 sm:w-8" />
                                                </div>

                                                <span className="relative z-10 text-center text-sm font-medium text-white/70 transition-colors group-hover:text-white sm:text-lg">
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
                    <section className="overflow-hidden border-t border-white/5 bg-black py-16 sm:py-20 lg:py-24">
                        <div className="container mx-auto px-4 sm:px-6">
                            <div className="grid grid-cols-1 items-start gap-16 sm:gap-20 lg:grid-cols-2 lg:gap-24">
                                <div className="h-fit pb-24 sm:pb-32 lg:sticky lg:top-24 lg:pb-40">
                                    <div className="relative flex flex-col gap-6 pr-4 sm:pr-8 lg:pr-12">
                                        <motion.div
                                            initial={{ x: -50, opacity: 0 }}
                                            whileInView={{ x: 0, opacity: 1 }}
                                            transition={{ duration: 1 }}
                                            className="relative z-10 aspect-4/5 overflow-hidden rounded-2xl border border-white/10 sm:rounded-3xl lg:rounded-4xl"
                                        >
                                            <img
                                                src={images[0] || primaryImage}
                                                className="h-full w-full object-cover"
                                                alt="Main"
                                            />
                                        </motion.div>
                                        <motion.div
                                            initial={{ x: 50, opacity: 0 }}
                                            whileInView={{ x: 0, opacity: 1 }}
                                            transition={{ duration: 1 }}
                                            className="absolute right-0 -bottom-20 z-20 aspect-3/4 w-[65%] rounded-2xl border-2 border-black shadow-2xl sm:-right-4 sm:-bottom-28 sm:w-[70%] sm:rounded-3xl lg:-right-12 lg:-bottom-40 lg:rounded-4xl"
                                        >
                                            <div className="h-full w-full overflow-hidden rounded-[calc(var(--radius-2xl)-2px)] sm:rounded-[calc(var(--radius-3xl)-2px)] lg:rounded-[calc(var(--radius-4xl)-2px)]">
                                                <img
                                                    src={
                                                        images[1] ||
                                                        images[0] ||
                                                        primaryImage
                                                    }
                                                    className="h-full w-full object-cover"
                                                    alt="Detail"
                                                />
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="mb-8 font-serif text-3xl leading-tight font-light tracking-tight sm:mb-12 sm:text-5xl lg:mb-16 lg:text-6xl">
                                        Unit <br />
                                        <span className="text-primary italic">
                                            Specifications
                                        </span>
                                    </h2>
                                    <div className="divide-y divide-white/10">
                                        {unitSpecs.map((spec, i) => (
                                            <ScrollAnimation key={i}>
                                                <div className="group relative flex items-center justify-between py-4 sm:py-5">
                                                    <div className="flex min-w-0 items-center gap-3 sm:gap-6 lg:gap-8">
                                                        <div className="flex flex-shrink-0 flex-col items-start gap-1">
                                                            <span className="font-mono text-[10px] text-primary/60">
                                                                0{i + 1}
                                                            </span>
                                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] group-hover:bg-primary/10 sm:h-10 sm:w-10">
                                                                <spec.icon className="h-4 w-4 text-white/20 transition-all duration-500 group-hover:text-primary sm:h-5 sm:w-5" />
                                                            </div>
                                                        </div>
                                                        <h3 className="truncate text-base font-light text-white/40 transition-colors group-hover:text-white sm:text-lg lg:text-xl">
                                                            {spec.label}
                                                        </h3>
                                                    </div>
                                                    <span className="ml-2 flex-shrink-0 text-xl font-light tracking-tighter transition-colors group-hover:text-primary sm:text-2xl lg:text-3xl">
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
                            <h2 className="mt-2 font-serif text-3xl font-light text-white italic sm:text-4xl">
                                Gallery
                            </h2>
                        </div>

                        <div className="container mx-auto max-w-6xl px-4">
                            <div className="group relative">
                                {/* FLOATING ARROWS */}
                                <button
                                    onClick={() =>
                                        gallerySwiperRef.current?.slidePrev()
                                    }
                                    className="group/btn absolute top-1/2 left-4 z-40 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:border-primary/50 hover:bg-primary hover:text-black"
                                    aria-label="Previous slide"
                                >
                                    <ChevronLeft className="h-6 w-6 transition-transform duration-300 group-hover/btn:scale-110" />
                                </button>
                                <button
                                    onClick={() =>
                                        gallerySwiperRef.current?.slideNext()
                                    }
                                    className="group/btn absolute top-1/2 right-4 z-40 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:border-primary/50 hover:bg-primary hover:text-black"
                                    aria-label="Next slide"
                                >
                                    <ChevronRight className="h-6 w-6 transition-transform duration-300 group-hover/btn:scale-110" />
                                </button>

                                <Swiper
                                    modules={[Autoplay, Keyboard, A11y]}
                                    onSwiper={(swiper) => {
                                        gallerySwiperRef.current = swiper;
                                    }}
                                    onSlideChange={(swiper) =>
                                        setCurrentIndex(swiper.realIndex)
                                    }
                                    slidesPerView={1.15}
                                    spaceBetween={16}
                                    centeredSlides={false}
                                    grabCursor
                                    loop={images.length > 1}
                                    keyboard={{
                                        enabled: true,
                                        onlyInViewport: true,
                                    }}
                                    autoplay={
                                        images.length > 1
                                            ? {
                                                  delay: 5000,
                                                  disableOnInteraction: false,
                                                  pauseOnMouseEnter: true,
                                              }
                                            : false
                                    }
                                    breakpoints={{
                                        640: {
                                            slidesPerView: 1.6,
                                            spaceBetween: 24,
                                        },
                                        1024: {
                                            slidesPerView: 2.2,
                                            spaceBetween: 24,
                                        },
                                    }}
                                    className="max-h-screen px-4 pb-6"
                                >
                                    {images.map((img, i) => (
                                        <SwiperSlide key={i} className="h-auto">
                                            <motion.button
                                                type="button"
                                                onClick={() =>
                                                    openLightboxAt(i)
                                                }
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.95,
                                                }}
                                                whileInView={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                viewport={{
                                                    once: true,
                                                    margin: '-100px',
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: i * 0.05,
                                                }}
                                                className="group/slide relative block h-full w-full cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left transition-all duration-300 hover:border-primary/30"
                                            >
                                                <img
                                                    src={img}
                                                    className="aspect-4/3 h-full w-full object-cover"
                                                    alt={`Gallery ${i + 1}`}
                                                    draggable={false}
                                                />
                                                {/* Subtle gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300 group-hover/slide:from-black/30" />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/slide:opacity-100">
                                                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-md">
                                                        <Expand className="h-5 w-5 text-white" />
                                                    </span>
                                                </div>
                                                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 backdrop-blur-md transition-all duration-300 group-hover/slide:border-primary/30 group-hover/slide:bg-black/50 sm:bottom-6 sm:left-6">
                                                    <span className="text-[10px] font-medium tracking-wider text-white/70 uppercase transition-colors duration-300 group-hover/slide:text-primary/80">
                                                        {String(i + 1).padStart(
                                                            2,
                                                            '0',
                                                        )}{' '}
                                                        /{' '}
                                                        {String(
                                                            totalImages,
                                                        ).padStart(2, '0')}
                                                    </span>
                                                </div>
                                            </motion.button>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>

                        <Lightbox
                            open={lightboxOpen}
                            close={() => setLightboxOpen(false)}
                            index={lightboxIndex}
                            slides={images.map((img) => ({
                                src: img,
                                alt: projectDetails.name,
                            }))}
                            plugins={
                                isImmersiveFullscreen
                                    ? [Zoom, Fullscreen, Counter]
                                    : [Zoom, Fullscreen, Counter, Thumbnails]
                            }
                            animation={{ swipe: 250 }}
                            controller={{
                                closeOnPullDown: true,
                                closeOnBackdropClick: true,
                            }}
                            carousel={{
                                finite: images.length <= 1,
                                padding: 0,
                                imageFit: 'contain',
                                // YARL caps an image's rendered size to its native pixel
                                // resolution by default (anti-upscale guard) — that leaves
                                // large empty bars around any image smaller than the
                                // screen. Force it to always fill the slide box on at
                                // least one axis, upscaling if needed, like a native
                                // media viewer.
                                imageProps: {
                                    style: {
                                        width: '100%',
                                        height: '100%',
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                    },
                                },
                            }}
                            zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
                            on={{
                                enterFullscreen: () =>
                                    setIsImmersiveFullscreen(true),
                                exitFullscreen: () =>
                                    setIsImmersiveFullscreen(false),
                            }}
                            styles={{
                                container: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                                },
                            }}
                        />

                        <div className="container mx-auto mt-6 max-w-6xl px-4">
                            <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/5">
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-primary to-sky-400"
                                    animate={{ width: `${progress}%` }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                    style={{
                                        boxShadow:
                                            '0 0 20px rgba(6, 182, 212, 0.5)',
                                    }}
                                />
                            </div>
                        </div>
                    </section>

                    {/* 6. MEDIA: Contained Cinematic Tour */}
                    <section className="border-t border-white/5 bg-black py-16 sm:py-20 lg:py-24">
                        <div className="container mx-auto px-4">
                            {/* Section Title - Above the Video */}
                            <div className="mb-8 sm:mb-12">
                                <span className="mb-3 block text-[10px] font-bold tracking-[0.5em] text-primary uppercase">
                                    Cinematic Experience
                                </span>
                                <h2 className="font-serif text-3xl font-light tracking-tighter text-white italic sm:text-5xl md:text-6xl">
                                    Virtual{' '}
                                    <span className="inline-block font-sans text-2xl font-bold tracking-widest text-primary/80 uppercase not-italic sm:ml-2 sm:text-4xl md:text-5xl">
                                        Walkthrough
                                    </span>
                                </h2>
                            </div>

                            {/* Contained Video Wrapper */}
                            <div className="relative mx-auto max-w-6xl">
                                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl sm:rounded-[2rem] md:rounded-[3rem]">
                                    {projectDetails.details
                                        ?.youtube_video_id ? (
                                        <iframe
                                            className="aspect-video h-auto min-h-[220px] w-full sm:min-h-[360px] lg:h-[75dvh]"
                                            src={`https://www.youtube.com/embed/${projectDetails.details.youtube_video_id}?rel=0&modestbranding=1`}
                                            title="Property Video Tour"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <div className="flex h-56 w-full flex-col items-center justify-center sm:h-80 lg:h-96">
                                            <Video className="mb-4 h-10 w-10 text-white/10 sm:h-12 sm:w-12" />
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
                    <section className="bg-[#0a0a0a] py-16 sm:py-20 lg:py-24">
                        <div className="container mx-auto mb-8 px-4 sm:mb-12">
                            <div className="flex flex-col justify-between gap-4 border-l-2 border-primary pl-4 sm:pl-8 md:flex-row md:items-end">
                                <div>
                                    <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase sm:tracking-[0.5em]">
                                        Strategic Context
                                    </span>
                                    <h2 className="mt-2 font-serif text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
                                        The{' '}
                                        <span className="text-primary italic">
                                            Neighborhood
                                        </span>
                                    </h2>
                                </div>
                                <div className="flex items-center gap-3 pb-1 font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
                                    <MapPin className="h-4 w-4 flex-shrink-0 text-primary/60" />
                                    <span className="truncate">
                                        {projectDetails.address}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Map Container - Enhanced Visual Design */}
                        <div className="container mx-auto px-4">
                            <div className="group relative">
                                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-sky-500/10 to-cyan-500/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                                <div className="relative h-[45vh] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl transition-all duration-500 group-hover:border-primary/30 sm:h-[55vh] lg:h-[65vh]">
                                    <div className="h-full w-full contrast-[1.1] grayscale invert-[0.05] transition-all duration-1000 ease-in-out group-hover:grayscale-0 group-hover:invert-[0.02]">
                                        <MapComponent
                                            width="100%"
                                            height="100%"
                                            src={projectDetails.google_map_url}
                                        />
                                    </div>

                                    {/* Subtle top-left fade for depth */}
                                    <div className="pointer-events-none absolute top-0 left-0 h-1/3 w-1/3 rounded-full bg-gradient-to-br from-black/20 to-transparent blur-2xl" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <SurroundingsSection project={projectDetails} />
                </div>
            </AppLayout>
        </>
    );
};

export default PropertyDetail;
