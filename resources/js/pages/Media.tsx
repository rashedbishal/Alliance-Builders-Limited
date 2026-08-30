import { usePage } from "@inertiajs/react";
import type { Image } from "@types/Image";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Calendar, Newspaper, ArrowRight, ArrowUpRight, ExternalLink, Sparkles, Play, Quote } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

// Import media assets
import heroVideo from '@/assets/videos/PixVerse_V5_Image_Text_360P_Hero_section_video.mp4';

// Import UI
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout';

interface Media {
    media_title: string;
    media_type: string;
    news_hyperlink: string;
    isFeatured: boolean;
    created_date: string;
    image: Image;
}

// Animated floating particles component
const FloatingParticles = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full"
                    initial={{
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                    }}
                    animate={{
                        y: [null, -100],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "linear",
                    }}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                />
            ))}
        </div>
    );
};

// Mouse spotlight effect
const useSpotlight = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return { mouseX, mouseY, handleMouseMove };
};

// 3D Tilt Card Component
const TiltCard = ({ children, className, featured = false }: { children: React.ReactNode; className?: string; featured?: boolean }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const rotateXValue = (mouseY / (rect.height / 2)) * -8;
        const rotateYValue = (mouseX / (rect.width / 2)) * 8;

        setRotateX(rotateXValue);
        setRotateY(rotateYValue);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.15s ease-out',
            }}
            animate={{
                scale: isHovered ? 1.02 : 1,
            }}
            transition={{ duration: 0.3 }}
        >
            {children}
            {isHovered && (
                <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at ${50 + rotateY * 2}% ${50 + rotateX * 2}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
                    }}
                />
            )}
        </motion.div>
    );
};

// Magnetic button component
const MagneticButton = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = (e.clientX - centerX) * 0.3;
        const distanceY = (e.clientY - centerY) * 0.3;
        setPosition({ x: distanceX, y: distanceY });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.button
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
            {children}
        </motion.button>
    );
};

// Gradient mesh background
const GradientMesh = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-30"
                style={{
                    background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
                    top: '10%',
                    left: '10%',
                }}
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
                    bottom: '20%',
                    right: '10%',
                }}
                animate={{
                    x: [0, -80, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-25"
                style={{
                    background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
                    top: '50%',
                    left: '50%',
                }}
                animate={{
                    x: [0, 120, 0],
                    y: [0, -80, 0],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
};

// Text scramble effect
const ScrambleText = ({ text, className }: { text: string; className?: string }) => {
    const [displayText, setDisplayText] = useState(text);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    useEffect(() => {
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(
                text
                    .split("")
                    .map((char, index) => {
                        if (char === " ") return char;
                        if (index < iteration) return text[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );
            iteration += 1 / 2;
            if (iteration >= text.length) clearInterval(interval);
        }, 30);
        return () => clearInterval(interval);
    }, [text]);

    return <span className={className}>{displayText}</span>;
};

const Media = () => {
    const { contents } = usePage<{ contents: Media[] }>().props;
    const featuredContent = contents.length > 0
        ? contents.find((content) => content.isFeatured) || contents[0]
        : null;

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
    const ySpring = useSpring(y, springConfig);

    // Spotlight for featured card
    const { mouseX: featuredX, mouseY: featuredY, handleMouseMove: handleFeaturedMouseMove } = useSpotlight();
    const spotlightBackground = useMotionTemplate`
        radial-gradient(
            650px circle at ${featuredX}px ${featuredY}px,
            rgba(255,255,255,0.15),
            transparent 80%
        )
    `;

    return (
        <AppLayout>
            <div
                ref={containerRef}
                className="relative min-h-screen overflow-hidden bg-slate-950"
            >
                {/* Animated Background Elements */}
                <GradientMesh />
                <FloatingParticles />

                {/* Hero Section */}
                <motion.section
                    className="relative flex h-screen items-center justify-center overflow-hidden"
                    style={{ opacity }}
                >
                    {/* Video Background with Ken Burns effect */}
                    <motion.div className="absolute inset-0" style={{ scale }}>
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="h-full w-full object-cover"
                            style={{ filter: 'brightness(0.4) saturate(1.2)' }}
                        >
                            <source src={heroVideo} type="video/mp4" />
                        </video>
                    </motion.div>

                    {/* Animated overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />

                    {/* Radial vignette */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                'radial-gradient(circle at 50% 50%, transparent 0%, rgba(2,6,23,0.6) 100%)',
                        }}
                    />

                    {/* Grid pattern overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                                              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                            backgroundSize: '100px 100px',
                        }}
                    />

                    {/* Hero Content */}
                    <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 1,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                        >
                            {/* Pre-title with animated border */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-md"
                            >
                                <Sparkles className="h-4 w-4 text-yellow-400" />
                                <span className="text-sm font-medium text-white/80">
                                    Press & Media Coverage
                                </span>
                            </motion.div>

                            {/* Main Title with gradient and animation */}
                            <h1 className="mb-6 text-6xl font-bold tracking-tight text-white md:text-8xl lg:text-9xl">
                                <motion.span
                                    className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                                    initial={{ opacity: 0, y: 100 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.3,
                                        duration: 0.8,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                >
                                    Media
                                </motion.span>
                                <br />
                                <motion.span
                                    className="inline-block"
                                    initial={{ opacity: 0, y: 100 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.4,
                                        duration: 0.8,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                >
                                    <ScrambleText
                                        text="Coverage"
                                        className="text-white"
                                    />
                                </motion.span>
                            </h1>

                            {/* Subtitle with fade in */}
                            <motion.p
                                className="mx-auto mb-10 max-w-2xl text-lg text-white/60 md:text-xl"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                            >
                                Discover the latest news, press releases, and
                                media features
                                <br className="hidden md:block" />
                                showcasing{' '}
                                <span className="font-medium text-white">
                                    Alliance Builders Ltd.
                                </span>{' '}
                                achievements
                            </motion.p>

                        </motion.div>

                        {/* Animated scroll indicator — sits below the subtitle in normal flow */}
                        <motion.div
                            className="mt-16 flex justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                        >
                            <motion.div
                                className="flex flex-col items-center gap-2"
                                animate={{ y: [0, 10, 0] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            >
                                <span className="text-xs tracking-widest text-white/40 uppercase">
                                    Scroll
                                </span>
                                <div className="h-12 w-px bg-gradient-to-b from-white/40 to-transparent" />
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Media Content Section */}
                <section className="relative z-10 px-4 py-24 md:px-16">
                    <div className="mx-auto max-w-7xl">
                        {/* Section Header */}
                        <motion.div
                            className="mb-16 text-center"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="mb-4 inline-flex items-center gap-2">
                                <div className="h-px w-8 bg-gradient-to-r from-transparent to-blue-400" />
                                <span className="text-sm font-medium tracking-widest text-blue-400 uppercase">
                                    Featured Story
                                </span>
                                <div className="h-px w-8 bg-gradient-to-l from-transparent to-blue-400" />
                            </div>
                        </motion.div>

                        {/* Featured News Card */}
                        {featuredContent ? (
                            <div className="mb-24">
                                <TiltCard featured className="relative">
                                    <motion.div
                                        initial={{ opacity: 0, y: 60 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.8,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                        viewport={{ once: true }}
                                    >
                                        <a
                                            href={
                                                featuredContent.news_hyperlink
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group block"
                                            onMouseMove={
                                                handleFeaturedMouseMove
                                            }
                                        >
                                            <Card className="relative overflow-hidden rounded-3xl border-0 bg-slate-900/50 backdrop-blur-xl">
                                                {/* Spotlight effect layer */}
                                                <motion.div
                                                    className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                                    style={{
                                                        background:
                                                            spotlightBackground,
                                                    }}
                                                />

                                                {/* Image container */}
                                                <div className="relative h-[600px] overflow-hidden">
                                                    <motion.img
                                                        src={
                                                            featuredContent
                                                                .image.path
                                                        }
                                                        alt={
                                                            featuredContent
                                                                .image.title
                                                        }
                                                        className="h-full w-full object-cover"
                                                        whileHover={{
                                                            scale: 1.05,
                                                        }}
                                                        transition={{
                                                            duration: 0.6,
                                                        }}
                                                    />

                                                    {/* Animated gradient overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                                                    {/* Shine effect */}
                                                    <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                                                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                                                    </div>

                                                    {/* Play button for video content */}
                                                    {featuredContent.media_type
                                                        .toLowerCase()
                                                        .includes('video') && (
                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                                            <motion.div
                                                                className="flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md"
                                                                whileHover={{
                                                                    scale: 1.1,
                                                                }}
                                                                whileTap={{
                                                                    scale: 0.95,
                                                                }}
                                                            >
                                                                <Play className="ml-1 h-8 w-8 fill-white text-white" />
                                                            </motion.div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content overlay */}
                                                <div className="absolute right-0 bottom-0 left-0 p-8 md:p-12">
                                                    {/* Featured badge */}
                                                    <motion.div
                                                        initial={{
                                                            opacity: 0,
                                                            x: -20,
                                                        }}
                                                        whileInView={{
                                                            opacity: 1,
                                                            x: 0,
                                                        }}
                                                        transition={{
                                                            delay: 0.2,
                                                            duration: 0.5,
                                                        }}
                                                        viewport={{
                                                            once: true,
                                                        }}
                                                    >
                                                        <Badge className="mb-4 border-0 bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-1.5 text-sm font-bold text-slate-950">
                                                            <Sparkles className="mr-1 h-3 w-3" />
                                                            Featured Story
                                                        </Badge>
                                                    </motion.div>

                                                    {/* Media type tag */}
                                                    <div className="mb-4 flex items-center gap-3">
                                                        <Badge className="border-white/20 bg-white/10 text-white backdrop-blur-sm">
                                                            {
                                                                featuredContent.media_type
                                                            }
                                                        </Badge>
                                                        <div className="flex items-center gap-2 text-sm text-white/60">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date(
                                                                featuredContent.created_date,
                                                            ).toLocaleDateString(
                                                                'en-US',
                                                                {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                },
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Title with reveal animation */}
                                                    <motion.h2
                                                        className="mb-6 text-3xl leading-tight font-bold text-white md:text-5xl"
                                                        initial={{
                                                            opacity: 0,
                                                            y: 20,
                                                        }}
                                                        whileInView={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        transition={{
                                                            delay: 0.3,
                                                            duration: 0.6,
                                                        }}
                                                        viewport={{
                                                            once: true,
                                                        }}
                                                    >
                                                        {
                                                            featuredContent.media_title
                                                        }
                                                    </motion.h2>

                                                    {/* CTA with magnetic effect */}
                                                    <MagneticButton className="group/btn inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-slate-950 transition-colors hover:bg-white/90">
                                                        <span>
                                                            Read Full Story
                                                        </span>
                                                        <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                                                    </MagneticButton>
                                                </div>

                                                {/* Decorative corner accents */}
                                                <div className="absolute top-4 right-4 h-20 w-20 rounded-tr-2xl border-t-2 border-r-2 border-white/10" />
                                                <div className="absolute bottom-4 left-4 h-20 w-20 rounded-bl-2xl border-b-2 border-l-2 border-white/10" />
                                            </Card>
                                        </a>
                                    </motion.div>
                                </TiltCard>
                            </div>
                        ) : (
                            <motion.p
                                className="mb-24 text-center text-lg text-slate-400"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                No featured news available.
                            </motion.p>
                        )}

                        {/* All News Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            {/* Section header with animated divider */}
                            <div className="mb-12 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                                        <Newspaper className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-white">
                                            All Coverage
                                        </h2>
                                        <p className="text-sm text-slate-400">
                                            {contents.length} articles
                                        </p>
                                    </div>
                                </div>

                                {/* Animated line */}
                                <motion.div
                                    className="mx-8 hidden h-px flex-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-transparent md:block"
                                    initial={{ scaleX: 0, originX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    transition={{ duration: 1, delay: 0.3 }}
                                    viewport={{ once: true }}
                                />
                            </div>
                        </motion.div>

                        {/* News Grid with staggered animations */}
                        {contents.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {contents
                                    .map((article, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 60 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.6,
                                                delay: index * 0.1,
                                                ease: [0.16, 1, 0.3, 1],
                                            }}
                                            viewport={{
                                                once: true,
                                                margin: '-50px',
                                            }}
                                        >
                                            <TiltCard className="h-full">
                                                <a
                                                    href={
                                                        article.news_hyperlink
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group block h-full"
                                                >
                                                    <Card className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm transition-colors duration-300 hover:border-white/20">
                                                        {/* Image */}
                                                        <div className="relative h-52 overflow-hidden">
                                                            <motion.img
                                                                src={
                                                                    article
                                                                        .image
                                                                        .path
                                                                }
                                                                alt={
                                                                    article.media_title
                                                                }
                                                                className="h-full w-full object-cover"
                                                                whileHover={{
                                                                    scale: 1.1,
                                                                }}
                                                                transition={{
                                                                    duration: 0.6,
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                                                            {/* Hover overlay */}
                                                            <div className="absolute inset-0 bg-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                                            {/* Media type badge */}
                                                            <div className="absolute top-4 left-4">
                                                                <Badge className="border-white/20 bg-slate-950/80 text-xs text-white backdrop-blur-md">
                                                                    {
                                                                        article.media_type
                                                                    }
                                                                </Badge>
                                                            </div>

                                                            {/* External link icon on hover */}
                                                            <div className="absolute top-4 right-4 translate-y-2 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                                                                    <ExternalLink className="h-4 w-4 text-white" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Content */}
                                                        <div className="p-6">
                                                            {/* Date with icon */}
                                                            <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
                                                                <Calendar className="h-3.5 w-3.5" />
                                                                {new Date(
                                                                    article.created_date,
                                                                ).toLocaleDateString(
                                                                    'en-US',
                                                                    {
                                                                        year: 'numeric',
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                    },
                                                                )}
                                                            </div>

                                                            {/* Title */}
                                                            <h3 className="mb-4 line-clamp-2 text-lg font-semibold text-white transition-colors group-hover:text-blue-400">
                                                                {
                                                                    article.media_title
                                                                }
                                                            </h3>

                                                            {/* Read more link */}
                                                            <div className="flex items-center gap-2 text-sm font-medium text-blue-400 group-hover:text-blue-300">
                                                                <span>
                                                                    Read Article
                                                                </span>
                                                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                            </div>
                                                        </div>

                                                        {/* Bottom gradient accent */}
                                                        <div className="absolute right-0 bottom-0 left-0 h-1 origin-left scale-x-0 transform bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform duration-500 group-hover:scale-x-100" />
                                                    </Card>
                                                </a>
                                            </TiltCard>
                                        </motion.div>
                                    ))}
                            </div>
                        ) : (
                            <motion.div
                                className="py-20 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-900">
                                    <Newspaper className="h-8 w-8 text-slate-500" />
                                </div>
                                <p className="text-lg text-slate-400">
                                    No news articles available yet.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Quote/Marquee Section */}
                <section className="overflow-hidden border-y border-white/5 py-20">
                    <motion.div
                        className="flex"
                        animate={{ x: ['0%', '-50%'] }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: 'loop',
                                duration: 30,
                                ease: 'linear',
                            },
                        }}
                    >
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="flex shrink-0 items-center gap-8 px-8"
                            >
                                <Quote className="h-8 w-8 text-blue-500/50" />
                                <span className="text-2xl font-light whitespace-nowrap text-white/20 md:text-4xl">
                                    Alliance Builders Limited — Excellence in
                                    Every Structure
                                </span>
                                <div className="h-2 w-2 rounded-full bg-blue-500/50" />
                            </div>
                        ))}
                    </motion.div>
                </section>

                {/* Newsletter CTA Section */}
                <section className="px-4 py-24">
                    <div className="mx-auto max-w-4xl">
                        <motion.div
                            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-1"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="relative overflow-hidden rounded-[22px] bg-slate-950 p-8 text-center md:p-12">
                                {/* Background glow */}
                                <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/20 blur-[100px]" />

                                <div className="relative z-10">
                                    <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">
                                        Stay Updated with Our News Site
                                    </h3>
                                    <p className="mx-auto mb-8 max-w-lg text-slate-400">
                                        Browse the current affairs and news,
                                        National and international news, sports, politics,
                                        entertainment, IT, etc. all at one place.

                                    </p>
                                    <MagneticButton className="rounded-full bg-white font-semibold text-slate-950 transition-colors hover:bg-white/90">
                                        <a
                                            href="https://jananews24.com/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="gap-2 inline-flex items-center justify-center rounded-full px-8 py-4"
                                        >
                                            <span className="text-sm sm:text-md">View Our News Site</span>
                                            <ArrowUpRight className="h-4 w-4" />
                                        </a>
                                    </MagneticButton>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Custom CSS for additional effects */}
                <style>{`
                    .bg-powder {
                        background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
                    }

                    .line-clamp-2 {
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                `}</style>
            </div>
        </AppLayout>
    );
};

export default Media;
