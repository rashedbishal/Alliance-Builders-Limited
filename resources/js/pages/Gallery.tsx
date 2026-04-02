import { usePage } from '@inertiajs/react';
import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
    useMotionValue,
    useSpring,
} from 'framer-motion';
import {
    Video,
    ImageIcon,
    X,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    Play,
    Expand,
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import heroVideo from '@/assets/videos/PixVerse_V5_Image_Text_360P_Hero_section_video.mp4';
import AppLayout from '@/layouts/AppLayout';
import type { Images } from '@/types/Images';

type GalleryType = 'handover' | 'inauguration' | 'construction' | 'events';

interface Videos {
    id: number;
    path: string;
    title: string;
    description: string;
    created_at: string;
}

interface Galleries {
    id: number;
    type: string;
    images: Images[];
    videos: Videos[];
}

interface MediaItem {
    type: 'video' | 'image';
    src: string;
    title: string;
    date?: string;
    description?: string;
    index: number;
}

const galleryCategories = [
    {
        id: 'handover' as GalleryType,
        title: 'Project Handover',
        label: '01',
        accent: 'from-blue-600 to-blue-400',
    },
    {
        id: 'inauguration' as GalleryType,
        title: 'Inauguration',
        label: '02',
        accent: 'from-indigo-600 to-indigo-400',
    },
    {
        id: 'construction' as GalleryType,
        title: 'Construction',
        label: '03',
        accent: 'from-cyan-600 to-cyan-400',
    },
    {
        id: 'events' as GalleryType,
        title: 'Events & Activity',
        label: '04',
        accent: 'from-sky-600 to-sky-400',
    },
];

// ─── Magnetic cursor ───────────────────────────────────────────────────────────
const MagneticCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const move = (e: MouseEvent) => {
            cursorX.set(e.clientX - 12);
            cursorY.set(e.clientY - 12);
        };
        const over = (e: MouseEvent) => {
            if ((e.target as Element)?.closest('[data-magnetic]'))
                setIsHovering(true);
        };
        const out = () => setIsHovering(false);
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseover', over);
        window.addEventListener('mouseout', out);
        return () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseover', over);
            window.removeEventListener('mouseout', out);
        };
    }, []);

    return (
        <motion.div
            className="pointer-events-none fixed z-[999] hidden lg:block"
            style={{ x: cursorXSpring, y: cursorYSpring }}
        >
            <motion.div
                animate={{
                    scale: isHovering ? 2.5 : 1,
                    opacity: isHovering ? 0.6 : 0.4,
                }}
                transition={{ duration: 0.2 }}
                className="h-6 w-6 rounded-full border border-white/60 bg-white/10 backdrop-blur-sm"
            />
        </motion.div>
    );
};

// ─── Lightbox ─────────────────────────────────────────────────────────────────
const Lightbox = ({
    items,
    currentIndex,
    onClose,
    onNext,
    onPrev,
}: {
    items: MediaItem[];
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}) => {
    const item = items[currentIndex];

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose, onNext, onPrev]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{
                background: 'rgba(13,21,38,0.97)',
                backdropFilter: 'blur(24px)',
            }}
            onClick={onClose}
        >
            {/* Top bar */}
            <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between px-8 py-6">
                <div>
                    <p className="mb-1 text-xs tracking-[0.3em] text-white/30 uppercase">
                        {currentIndex + 1} / {items.length}
                    </p>
                    <h3 className="text-lg font-light text-white">
                        {item.title}
                    </h3>
                </div>
                <button
                    onClick={onClose}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all hover:bg-white/10 hover:text-white"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Media */}
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative w-full max-w-6xl px-20"
                onClick={(e) => e.stopPropagation()}
            >
                {item.type === 'video' ? (
                    <video
                        controls
                        autoPlay
                        className="w-full rounded-2xl shadow-2xl"
                        style={{ maxHeight: '75vh', objectFit: 'contain' }}
                    >
                        <source src={item.src} type="video/mp4" />
                    </video>
                ) : (
                    <img
                        src={item.src}
                        alt={item.title}
                        className="w-full rounded-2xl shadow-2xl"
                        style={{ maxHeight: '75vh', objectFit: 'contain' }}
                    />
                )}
            </motion.div>

            {/* Nav arrows */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                }}
                className="absolute top-1/2 left-4 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all hover:scale-110 hover:bg-white/15 hover:text-white"
            >
                <ChevronLeft size={22} />
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                }}
                className="absolute top-1/2 right-4 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all hover:scale-110 hover:bg-white/15 hover:text-white"
            >
                <ChevronRight size={22} />
            </button>

            {/* Bottom strip thumbnails */}
            <div className="absolute right-0 bottom-6 left-0 flex justify-center gap-2 overflow-x-auto px-8">
                {items
                    .slice(Math.max(0, currentIndex - 4), currentIndex + 5)
                    .map((thumb, i) => {
                        const realIdx = Math.max(0, currentIndex - 4) + i;
                        return (
                            <button
                                key={realIdx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                className={`h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                                    realIdx === currentIndex
                                        ? 'border-white/60 opacity-100'
                                        : 'border-transparent opacity-40 hover:opacity-70'
                                }`}
                            >
                                {thumb.type === 'image' ? (
                                    <img
                                        src={thumb.src}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-white/10">
                                        <Play
                                            size={12}
                                            className="text-white/60"
                                        />
                                    </div>
                                )}
                            </button>
                        );
                    })}
            </div>
        </motion.div>
    );
};

// ─── Image Card ───────────────────────────────────────────────────────────────
const ImageCard = ({
    item,
    index,
    onClick,
    colSpan = false,
}: {
    item: any;
    index: number;
    onClick: () => void;
    colSpan?: boolean;
}) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <motion.div
            data-magnetic
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 40 }}
            transition={{
                duration: 0.6,
                delay: index * 0.04,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={`group relative cursor-pointer overflow-hidden rounded-2xl ${colSpan ? 'col-span-2 row-span-2' : ''}`}
            style={{
                aspectRatio: colSpan ? '16/9' : index % 5 === 0 ? '3/4' : '4/3',
            }}
            onClick={onClick}
            whileHover={{ scale: 1.015 }}
        >
            {/* Skeleton */}
            {!loaded && (
                <div className="absolute inset-0 animate-pulse rounded-2xl bg-white/5" />
            )}

            <img
                src={item.src}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                onLoad={() => setLoaded(true)}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
                <div className="flex justify-end">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                        <Expand size={14} className="text-white" />
                    </div>
                </div>
                <div>
                    <h4 className="text-sm leading-tight font-semibold text-white">
                        {item.title}
                    </h4>
                    {item.date && (
                        <p className="mt-1 text-xs text-white/50">
                            {item.date}
                        </p>
                    )}
                </div>
            </div>

            {/* Corner accent */}
            <div className="absolute top-0 left-0 h-px w-0 bg-gradient-to-r from-white/60 to-transparent transition-all duration-500 group-hover:w-full" />
            <div className="absolute top-0 left-0 h-0 w-px bg-gradient-to-b from-white/60 to-transparent transition-all duration-500 group-hover:h-full" />
        </motion.div>
    );
};

// ─── Video Card ───────────────────────────────────────────────────────────────
const VideoCard = ({
    item,
    index,
    onClick,
}: {
    item: any;
    index: number;
    onClick: () => void;
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            data-magnetic
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            className="group hover:shadow-elegant-lg relative cursor-pointer overflow-hidden rounded-2xl border border-gray-100 shadow-sm"
            style={{ background: 'white' }}
            onClick={onClick}
            onMouseEnter={() => {
                setIsHovered(true);
                videoRef.current?.play();
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0;
                }
            }}
            whileHover={{ scale: 1.02 }}
        >
            <div className="relative aspect-video overflow-hidden">
                <video
                    ref={videoRef}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    muted
                    loop
                    playsInline
                >
                    <source src={item.src} type="video/mp4" />
                </video>

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        animate={{
                            scale: isHovered ? 1.1 : 1,
                            opacity: isHovered ? 0.9 : 0.7,
                        }}
                        className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md"
                    >
                        <Play
                            size={24}
                            className="ml-1 text-white"
                            fill="white"
                        />
                    </motion.div>
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Duration badge */}
                <div className="absolute top-3 right-3 rounded-full border border-white/10 bg-black/50 px-2 py-1 text-xs text-white/70 backdrop-blur-sm">
                    <Video size={10} className="mr-1 inline" />
                    Video
                </div>
            </div>

            <div className="p-5" style={{ background: 'white' }}>
                <h3 className="mb-1 font-semibold text-gray-800 transition-colors group-hover:text-primary">
                    {item.title}
                </h3>
                <p className="text-xs text-gray-400">{item.date}</p>
                {item.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                        {item.description}
                    </p>
                )}
            </div>

            <div className="bg-gradient-primary absolute bottom-0 left-0 h-px w-0 transition-all duration-500 group-hover:w-full" />
        </motion.div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const Gallery = () => {
    const [activeGallery, setActiveGallery] = useState<GalleryType>('handover');
    const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
    const [lightbox, setLightbox] = useState<{
        items: MediaItem[];
        index: number;
    } | null>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const { galleries } = usePage<{ galleries: Galleries[] }>().props;

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    const typeMap: Record<string, GalleryType> = {
        'Project Handover': 'handover',
        'Project Inauguration': 'inauguration',
        'Construction Images': 'construction',
        'Events & Activities': 'events',
    };

    const galleryContent: Record<
        GalleryType,
        { images: any[]; videos: any[] }
    > = galleries.reduce(
        (acc, gallery) => {
            const key = typeMap[gallery.type];
            if (!key) return acc;
            acc[key] = {
                videos: gallery.videos.map((vid) => ({
                    src: vid.path,
                    title: vid.title ?? gallery.type,
                    date: new Date(vid.created_at).toLocaleDateString('en-GB', {
                        month: 'short',
                        year: 'numeric',
                    }),
                    description: vid.description,
                })),
                images: gallery.images.map((img) => ({
                    src: (img as any).path,
                    title: (img as any).title ?? gallery.type,
                    date: new Date((img as any).created_at).toLocaleDateString(
                        'en-GB',
                        { month: 'short', year: 'numeric' },
                    ),
                    description: (img as any).description,
                })),
            };
            return acc;
        },
        {} as Record<GalleryType, { images: any[]; videos: any[] }>,
    );

    const currentContent = galleryContent[activeGallery] || {
        images: [],
        videos: [],
    };

    const allItems: MediaItem[] = [
        ...currentContent.images.map((img, i) => ({
            ...img,
            type: 'image' as const,
            index: i,
        })),
        ...currentContent.videos.map((vid, i) => ({
            ...vid,
            type: 'video' as const,
            index: currentContent.images.length + i,
        })),
    ];

    const openLightbox = useCallback(
        (type: 'image' | 'video', idx: number) => {
            const items =
                type === 'image'
                    ? currentContent.images.map((img, i) => ({
                          ...img,
                          type: 'image' as const,
                          index: i,
                      }))
                    : currentContent.videos.map((vid, i) => ({
                          ...vid,
                          type: 'video' as const,
                          index: i,
                      }));
            setLightbox({ items, index: idx });
        },
        [currentContent],
    );

    const totalImages = currentContent.images.length;
    const totalVideos = currentContent.videos.length;

    return (
        <AppLayout>
            <div
                className="min-h-screen"
                style={{ background: '#0d1526', color: 'white' }}
            >
                <MagneticCursor />

                {/* ── HERO ─────────────────────────────────────────────────── */}
                <section
                    ref={heroRef}
                    className="relative h-screen overflow-hidden"
                >
                    <motion.div
                        style={{ y: heroY }}
                        className="absolute inset-0"
                    >
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="h-full w-full object-cover"
                            style={{ filter: 'brightness(0.25) saturate(1.4)' }}
                        >
                            <source src={heroVideo} type="video/mp4" />
                        </video>
                    </motion.div>

                    {/* Grain overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        }}
                    />

                    {/* Grid lines */}
                    <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                            backgroundSize: '80px 80px',
                        }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-[#0d1526]/40 via-transparent to-[#0d1526]" />

                    {/* Hero content */}
                    <motion.div
                        style={{ opacity: heroOpacity }}
                        className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 60 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 1.2,
                                ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                        >
                            <p className="mb-6 text-[10px] tracking-[0.5em] text-white/30 uppercase">
                                Alliance Builders Ltd
                            </p>
                            <h1
                                className="mb-6 leading-none font-light tracking-tighter"
                                style={{
                                    fontSize: 'clamp(4rem, 12vw, 10rem)',
                                    fontFamily: 'Georgia, serif',
                                }}
                            >
                                <span className="text-white/90 italic">
                                    Our
                                </span>{' '}
                                <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                                    Gallery
                                </span>
                            </h1>
                            <p className="mx-auto max-w-lg text-lg leading-relaxed font-light text-white/40">
                                A visual archive of milestones, craftsmanship,
                                and community
                            </p>
                        </motion.div>

                        {/* Category pills */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="mt-16 flex flex-wrap justify-center gap-3"
                        >
                            {galleryCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    data-magnetic
                                    onClick={() => setActiveGallery(cat.id)}
                                    className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                                        activeGallery === cat.id
                                            ? 'border-white/40 bg-white/10 text-white backdrop-blur-md'
                                            : 'border-white/15 bg-white/[0.05] text-white/50 hover:border-white/30 hover:text-white/80'
                                    }`}
                                >
                                    <span className="mr-2 text-[10px] text-white/30">
                                        {cat.label}
                                    </span>
                                    {cat.title}
                                </button>
                            ))}
                        </motion.div>

                        {/* Scroll indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
                        >
                            <p className="text-[9px] tracking-[0.4em] text-white/20 uppercase">
                                Scroll
                            </p>
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 1.5,
                                    ease: 'easeInOut',
                                }}
                                className="h-8 w-px bg-gradient-to-b from-white/30 to-transparent"
                            />
                        </motion.div>
                    </motion.div>
                </section>

                {/* ── GALLERY SECTION — bright ─────────────────────────────── */}
                <section
                    className="relative py-24"
                    style={{ background: '#f4f6fb' }}
                >
                    {/* Subtle dot pattern */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.4]"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle, #c7d2e8 1px, transparent 1px)',
                            backgroundSize: '28px 28px',
                        }}
                    />

                    <div className="relative container mx-auto px-4 lg:px-8">
                        {/* Section header */}
                        <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeGallery}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <p className="mb-2 text-[10px] font-semibold tracking-[0.4em] text-primary uppercase">
                                            {
                                                galleryCategories.find(
                                                    (c) =>
                                                        c.id === activeGallery,
                                                )?.label
                                            }{' '}
                                            —
                                        </p>
                                        <h2
                                            className="text-4xl font-light tracking-tight text-gray-900 lg:text-6xl"
                                            style={{
                                                fontFamily: 'Georgia, serif',
                                            }}
                                        >
                                            {
                                                galleryCategories.find(
                                                    (c) =>
                                                        c.id === activeGallery,
                                                )?.title
                                            }
                                        </h2>
                                        <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                                            <span>{totalImages} photos</span>
                                            <span className="h-px w-8 bg-gray-300" />
                                            <span>{totalVideos} videos</span>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Category switcher pills */}
                            <div className="flex flex-wrap gap-2">
                                {galleryCategories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        data-magnetic
                                        onClick={() => setActiveGallery(cat.id)}
                                        className={`rounded-xl border px-4 py-2 text-xs font-semibold tracking-wide shadow-sm transition-all duration-300 ${
                                            activeGallery === cat.id
                                                ? 'shadow-elegant border-primary bg-primary text-white'
                                                : 'border-gray-200 bg-white text-gray-500 hover:border-primary/40 hover:text-primary'
                                        }`}
                                    >
                                        {cat.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab switcher */}
                        <div className="mb-10 flex w-fit items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
                            {[
                                {
                                    id: 'images',
                                    icon: ImageIcon,
                                    label: `Photos (${totalImages})`,
                                },
                                {
                                    id: 'videos',
                                    icon: Video,
                                    label: `Videos (${totalVideos})`,
                                },
                            ].map(({ id, icon: Icon, label }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id as any)}
                                    className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                                        activeTab === id
                                            ? 'bg-gradient-primary shadow-elegant text-white'
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    <Icon size={14} />
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${activeGallery}-${activeTab}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5 }}
                            >
                                {activeTab === 'images' ? (
                                    currentContent.images.length > 0 ? (
                                        <div
                                            className="columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4"
                                            style={{ columnFill: 'balance' }}
                                        >
                                            {currentContent.images.map(
                                                (image, index) => (
                                                    <div
                                                        key={index}
                                                        className="mb-4 break-inside-avoid"
                                                    >
                                                        <ImageCard
                                                            item={image}
                                                            index={index}
                                                            onClick={() =>
                                                                openLightbox(
                                                                    'image',
                                                                    index,
                                                                )
                                                            }
                                                            colSpan={false}
                                                        />
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <EmptyState type="images" />
                                    )
                                ) : currentContent.videos.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {currentContent.videos.map(
                                            (video, index) => (
                                                <VideoCard
                                                    key={index}
                                                    item={video}
                                                    index={index}
                                                    onClick={() =>
                                                        openLightbox(
                                                            'video',
                                                            index,
                                                        )
                                                    }
                                                />
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <EmptyState type="videos" />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </section>

                {/* ── STATS STRIP — bright ─────────────────────────────────── */}
                <section className="py-16" style={{ background: '#eef1f8' }}>
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {[
                                {
                                    value:
                                        galleries.reduce(
                                            (a, g) => a + g.images.length,
                                            0,
                                        ) + '+',
                                    label: 'Total Photos',
                                },
                                {
                                    value:
                                        galleries.reduce(
                                            (a, g) => a + g.videos.length,
                                            0,
                                        ) + '+',
                                    label: 'Total Videos',
                                },
                                { value: '4', label: 'Categories' },
                                {
                                    value: galleries.length + '+',
                                    label: 'Gallery Albums',
                                },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group hover:shadow-elegant rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div
                                        className="mb-2 text-4xl font-light text-primary transition-colors group-hover:text-primary-dark"
                                        style={{ fontFamily: 'Georgia, serif' }}
                                    >
                                        {stat.value}
                                    </div>
                                    <div className="text-xs font-medium tracking-[0.2em] text-gray-400 uppercase">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── LIGHTBOX ─────────────────────────────────────────────── */}
                <AnimatePresence>
                    {lightbox && (
                        <Lightbox
                            items={lightbox.items}
                            currentIndex={lightbox.index}
                            onClose={() => setLightbox(null)}
                            onNext={() =>
                                setLightbox((prev) =>
                                    prev
                                        ? {
                                              ...prev,
                                              index:
                                                  (prev.index + 1) %
                                                  prev.items.length,
                                          }
                                        : null,
                                )
                            }
                            onPrev={() =>
                                setLightbox((prev) =>
                                    prev
                                        ? {
                                              ...prev,
                                              index:
                                                  (prev.index -
                                                      1 +
                                                      prev.items.length) %
                                                  prev.items.length,
                                          }
                                        : null,
                                )
                            }
                        />
                    )}
                </AnimatePresence>
            </div>
        </AppLayout>
    );
};

const EmptyState = ({ type }: { type: 'images' | 'videos' }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-32 text-center"
    >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
            {type === 'images' ? (
                <ImageIcon size={28} className="text-gray-300" />
            ) : (
                <Video size={28} className="text-gray-300" />
            )}
        </div>
        <p className="text-sm text-gray-400">
            No {type} available for this category yet.
        </p>
    </motion.div>
);

export default Gallery;
