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
import PageBreadcrumb from '@/components/PageBreadcrumb';
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
                className="relative w-full max-w-6xl px-3 sm:px-8 md:px-20"
                onClick={(e) => e.stopPropagation()}
            >
                {item.type === 'video' ? (
                    <video
                        controls
                        autoPlay
                        className="w-full rounded-lg sm:rounded-2xl shadow-2xl"
                        style={{ maxHeight: 'calc(100vh - 140px)', objectFit: 'contain' }}
                    >
                        <source src={item.src} type="video/mp4" />
                    </video>
                ) : (
                    <img
                        src={item.src}
                        alt={item.title}
                        className="w-full rounded-lg sm:rounded-2xl shadow-2xl"
                        style={{ maxHeight: 'calc(100vh - 140px)', objectFit: 'contain' }}
                    />
                )}
            </motion.div>

            {/* Nav arrows */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                }}
                className="absolute top-1/2 left-2 sm:left-4 flex h-10 w-10 sm:h-14 sm:w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all hover:scale-110 hover:bg-white/15 hover:text-white"
            >
                <ChevronLeft size={16} className="sm:hidden" />
                <ChevronLeft size={22} className="hidden sm:block" />
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                }}
                className="absolute top-1/2 right-2 sm:right-4 flex h-10 w-10 sm:h-14 sm:w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all hover:scale-110 hover:bg-white/15 hover:text-white"
            >
                <ChevronRight size={16} className="sm:hidden" />
                <ChevronRight size={22} className="hidden sm:block" />
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
    featured = false,
}: {
    item: any;
    index: number;
    onClick: () => void;
    featured?: boolean;
}) => {
    const [loaded, setLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Varying aspect ratios for visual interest
    const getAspectRatio = () => {
        if (featured) return 'aspect-[16/10]';
        if (index % 5 === 0) return 'aspect-[3/4]';
        if (index % 3 === 0) return 'aspect-square';
        return 'aspect-[4/3]';
    };

    return (
        <motion.div
            data-magnetic
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 30 }}
            transition={{
                duration: 0.5,
                delay: Math.min(index * 0.05, 0.5),
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={`group relative cursor-pointer overflow-hidden rounded-xl ${
                featured ? 'col-span-2 row-span-2' : ''
            } ${getAspectRatio()}`}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background/skeleton */}
            <div className="absolute inset-0 bg-white/[0.03]" />
            {!loaded && (
                <div className="absolute inset-0 animate-pulse bg-white/[0.05]">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
                </div>
            )}

            {/* Image */}
            <motion.img
                src={item.src}
                alt={item.title}
                className="h-full w-full object-cover"
                onLoad={() => setLoaded(true)}
                animate={{
                    scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            />

            {/* Subtle border */}
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />

            {/* Gradient overlay - always visible but intensifies on hover */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
                animate={{
                    opacity: isHovered ? 1 : 0.3,
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Hover content */}
            <motion.div
                className="absolute inset-0 flex flex-col justify-between p-4"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex justify-end">
                    <motion.div
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: isHovered ? 1 : 0.8,
                            opacity: isHovered ? 1 : 0,
                        }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                    >
                        <Expand size={14} className="text-white" />
                    </motion.div>
                </div>

                <div>
                    <motion.h4
                        className={`font-medium text-white ${featured ? 'text-base' : 'text-sm'}`}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{
                            y: isHovered ? 0 : 10,
                            opacity: isHovered ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, delay: 0.05 }}
                    >
                        {item.title}
                    </motion.h4>
                    {item.date && (
                        <motion.p
                            className="mt-1 text-xs text-white/60"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{
                                y: isHovered ? 0 : 10,
                                opacity: isHovered ? 1 : 0,
                            }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            {item.date}
                        </motion.p>
                    )}
                    {item.description && (
                        <motion.p
                            className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/50"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{
                                y: isHovered ? 0 : 10,
                                opacity: isHovered ? 1 : 0,
                            }}
                            transition={{ duration: 0.3, delay: 0.15 }}
                        >
                            {item.description}
                        </motion.p>
                    )}
                </div>
            </motion.div>

            {/* Corner accent animation */}
            <motion.div
                className="absolute top-0 left-0 h-px bg-gradient-to-r from-white/40 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: isHovered ? '100%' : 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            />
            <motion.div
                className="absolute top-0 left-0 w-px bg-gradient-to-b from-white/40 to-transparent"
                initial={{ height: 0 }}
                animate={{ height: isHovered ? '100%' : 0 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
            />
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]"
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
        >
            {/* Video thumbnail area */}
            <div className="relative aspect-video overflow-hidden">
                <motion.video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    muted
                    loop
                    playsInline
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    <source src={item.src} type="video/mp4" />
                </motion.video>

                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md"
                        animate={{
                            scale: isHovered ? 1.1 : 1,
                            opacity: isHovered ? 1 : 0.8,
                            borderColor: isHovered ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)',
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <Play
                            size={22}
                            className="ml-0.5 text-white"
                            fill="white"
                        />
                    </motion.div>
                </div>

                {/* Video badge */}
                <motion.div
                    className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] text-white/70 backdrop-blur-sm"
                    animate={{
                        opacity: isHovered ? 1 : 0.7,
                    }}
                >
                    <Video size={10} />
                    <span>Video</span>
                </motion.div>

                {/* Top gradient line on hover */}
                <motion.div
                    className="absolute top-0 left-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ width: '0%', left: '50%' }}
                    animate={{
                        width: isHovered ? '100%' : '0%',
                        left: isHovered ? '0%' : '50%',
                    }}
                    transition={{ duration: 0.4 }}
                />
            </div>

            {/* Info area */}
            <div className="relative p-5">
                <h3 className="mb-1 text-sm font-medium text-white/90 transition-colors group-hover:text-white">
                    {item.title}
                </h3>
                <p className="text-xs text-white/40">{item.date}</p>
                {item.description && (
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/50">
                        {item.description}
                    </p>
                )}

                {/* Subtle bottom glow on hover */}
                <motion.div
                    className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ width: '0%', left: '50%' }}
                    animate={{
                        width: isHovered ? '100%' : '0%',
                        left: isHovered ? '0%' : '50%',
                    }}
                    transition={{ duration: 0.4 }}
                />
            </div>
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

                    <div className="absolute top-36 right-0 left-0 z-10 container mx-auto px-4">
                        <PageBreadcrumb items={[{ label: 'Gallery' }]} />
                    </div>

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

                {/* ── GALLERY SECTION ───────────────────────────────────────── */}
                <section
                    className="relative py-20 lg:py-28"
                    style={{ background: 'linear-gradient(180deg, #0a0f1a 0%, #0d1526 50%, #0a0f1a 100%)' }}
                >
                    {/* Subtle noise texture overlay */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.015]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        }}
                    />

                    {/* Accent line */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section header */}
                        <div className="mb-12 lg:mb-16">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeGallery}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
                                >
                                    {/* Left - Title */}
                                    <div>
                                        <div className="mb-4 flex items-center gap-4">
                                            <span className="text-[11px] font-medium tracking-[0.3em] text-white/30 uppercase">
                                                {galleryCategories.find((c) => c.id === activeGallery)?.label}
                                            </span>
                                            <div className="h-px w-12 bg-gradient-to-r from-white/20 to-transparent" />
                                        </div>
                                        <h2
                                            className="text-3xl font-light tracking-tight text-white/95 sm:text-4xl lg:text-5xl"
                                            style={{ fontFamily: 'Georgia, serif' }}
                                        >
                                            {galleryCategories.find((c) => c.id === activeGallery)?.title}
                                        </h2>
                                        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/40">
                                            {totalImages} photos · {totalVideos} videos
                                        </p>
                                    </div>

                                    {/* Right - Category tabs */}
                                    <div className="flex flex-wrap gap-2">
                                        {galleryCategories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                data-magnetic
                                                onClick={() => setActiveGallery(cat.id)}
                                                className={`group relative overflow-hidden rounded-lg border px-4 py-2.5 text-xs font-medium tracking-wide transition-all duration-500 ${
                                                    activeGallery === cat.id
                                                        ? 'border-white/20 bg-white/10 text-white'
                                                        : 'border-white/10 bg-transparent text-white/50 hover:border-white/15 hover:text-white/70'
                                                }`}
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    <span className={`text-[9px] transition-colors ${activeGallery === cat.id ? 'text-white/60' : 'text-white/30'}`}>
                                                        {cat.label}
                                                    </span>
                                                    <span>{cat.title}</span>
                                                </span>
                                                {activeGallery === cat.id && (
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Tab switcher */}
                        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex w-fit items-center gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1 backdrop-blur-sm">
                                {[
                                    { id: 'images', icon: ImageIcon, label: 'Photos', count: totalImages },
                                    { id: 'videos', icon: Video, label: 'Videos', count: totalVideos },
                                ].map(({ id, icon: Icon, label, count }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveTab(id as any)}
                                        className={`flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                                            activeTab === id
                                                ? 'bg-white/10 text-white shadow-[0_2px_8px_rgba(255,255,255,0.05)]'
                                                : 'text-white/40 hover:text-white/70'
                                        }`}
                                    >
                                        <Icon size={15} className={activeTab === id ? 'text-white/80' : 'text-white/40'} />
                                        <span>{label}</span>
                                        <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] ${
                                            activeTab === id ? 'bg-white/20 text-white/80' : 'bg-white/5 text-white/40'
                                        }`}>
                                            {count}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Filter indicator */}
                            <div className="flex items-center gap-2 text-xs text-white/30">
                                <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                                <span>Showing all {activeTab}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${activeGallery}-${activeTab}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                                {activeTab === 'images' ? (
                                    currentContent.images.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                                            {currentContent.images.map((image, index) => (
                                                <ImageCard
                                                    key={index}
                                                    item={image}
                                                    index={index}
                                                    onClick={() => openLightbox('image', index)}
                                                    featured={index === 0 && currentContent.images.length > 2}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState type="images" />
                                    )
                                ) : currentContent.videos.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                        {currentContent.videos.map((video, index) => (
                                            <VideoCard
                                                key={index}
                                                item={video}
                                                index={index}
                                                onClick={() => openLightbox('video', index)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState type="videos" />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </section>

                {/* ── STATS STRIP ──────────────────────────────────────────── */}
                <section className="relative py-14 border-t border-white/[0.03]" style={{ background: '#080c14' }}>
                    {/* Subtle gradient line */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
                            {[
                                {
                                    value: galleries.reduce((a, g) => a + g.images.length, 0) + '+',
                                    label: 'Photos',
                                },
                                {
                                    value: galleries.reduce((a, g) => a + g.videos.length, 0) + '+',
                                    label: 'Videos',
                                },
                                { value: '4', label: 'Categories' },
                                { value: galleries.length + '+', label: 'Albums' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08, duration: 0.4 }}
                                    className="group relative overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.02] p-6 text-center transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03]"
                                >
                                    {/* Subtle corner accent */}
                                    <div className="absolute top-0 right-0 h-8 w-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        <div className="absolute top-0 right-0 h-px w-6 bg-gradient-to-l from-white/20 to-transparent" />
                                        <div className="absolute top-0 right-0 h-6 w-px bg-gradient-to-b from-white/20 to-transparent" />
                                    </div>

                                    <div
                                        className="mb-1 text-3xl font-light text-white/90 transition-colors group-hover:text-white md:text-4xl"
                                        style={{ fontFamily: 'Georgia, serif' }}
                                    >
                                        {stat.value}
                                    </div>
                                    <div className="text-[10px] font-medium tracking-[0.2em] text-white/30 uppercase transition-colors group-hover:text-white/40">
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-28 text-center"
    >
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm">
            {type === 'images' ? (
                <ImageIcon size={24} className="text-white/30" />
            ) : (
                <Video size={24} className="text-white/30" />
            )}
        </div>
        <p className="text-sm text-white/40">
            No {type} available for this category yet.
        </p>
        <p className="mt-2 text-xs text-white/25">
            Check back later for new content
        </p>
    </motion.div>
);

export default Gallery;
