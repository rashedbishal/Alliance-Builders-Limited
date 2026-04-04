import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';

const FloatingGallery = ({ images }: { images: string[] }) => {
    const [currentImageIndices, setCurrentImageIndices] = useState<number[]>([]);
    const [animationType, setAnimationType] = useState<string[]>([]);

    // Define animation exit/enter patterns
    const animationPatterns = [
        {
            name: 'slideLeft',
            exit: { x: -300, opacity: 0 },
            enter: { x: 300, opacity: 0 },
            animate: { x: 0, opacity: 1 },
        },
        {
            name: 'slideRight',
            exit: { x: 300, opacity: 0 },
            enter: { x: -300, opacity: 0 },
            animate: { x: 0, opacity: 1 },
        },
        {
            name: 'slideUp',
            exit: { y: -300, opacity: 0 },
            enter: { y: 300, opacity: 0 },
            animate: { y: 0, opacity: 1 },
        },
        {
            name: 'slideDown',
            exit: { y: 300, opacity: 0 },
            enter: { y: -300, opacity: 0 },
            animate: { y: 0, opacity: 1 },
        },
        {
            name: 'flipLeft',
            exit: { rotateY: 90, opacity: 0 },
            enter: { rotateY: -90, opacity: 0 },
            animate: { rotateY: 0, opacity: 1 },
        },
        {
            name: 'flipRight',
            exit: { rotateY: -90, opacity: 0 },
            enter: { rotateY: 90, opacity: 0 },
            animate: { rotateY: 0, opacity: 1 },
        },
        {
            name: 'scaleOut',
            exit: { scale: 0, opacity: 0 },
            enter: { scale: 0, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
        },
    ];

    // Initialize indices
    useEffect(() => {
        const initialIndices = images.map(() => Math.floor(Math.random() * images.length));
        setCurrentImageIndices(initialIndices);

        const initialAnimations = images.map(() =>
            animationPatterns[Math.floor(Math.random() * animationPatterns.length)].name
        );
        setAnimationType(initialAnimations);
    }, [images.length]);

    // Set up continuous carousel for each tile
    useEffect(() => {
        if (images.length === 0 || currentImageIndices.length === 0) return;

        const intervals = images.map((_, idx) => {
            return setInterval(() => {
                // Randomly select next image
                setCurrentImageIndices((prev) => {
                    const updated = [...prev];
                    updated[idx] = (prev[idx] + 1 + Math.floor(Math.random() * (images.length - 1))) % images.length;
                    return updated;
                });

                // Randomly select next animation
                setAnimationType((prev) => {
                    const updated = [...prev];
                    updated[idx] = animationPatterns[Math.floor(Math.random() * animationPatterns.length)].name;
                    return updated;
                });
            }, 3000 + Math.random() * 4000); // Random interval between 3-7 seconds
        });

        return () => {
            intervals.forEach((interval) => clearInterval(interval));
        };
    }, [images.length, currentImageIndices.length]);

    const getSizeClass = (index: number) => {
        const sizes = ['md:col-span-2 md:row-span-1', 'md:col-span-1 md:row-span-2', 'md:col-span-1 md:row-span-1', 'md:col-span-2 md:row-span-2'];
        return sizes[index % sizes.length];
    };

    const getHeight = (index: number) => {
        const heights = ['h-[250px]', 'h-[300px]', 'h-[280px]', 'h-[400px]', 'h-[320px]'];
        return heights[index % heights.length];
    };

    const getAnimationPattern = (animName: string) => {
        return animationPatterns.find((p) => p.name === animName) || animationPatterns[0];
    };

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            {/* Animated background accents */}
            <motion.div
                className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
                animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
                transition={{ duration: 12, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-0 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl"
                animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
                transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            />

            <div className="container relative z-10 mx-auto px-4">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-4">
                        Discover the Experience
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg">
                        Every corner of this destination is designed to evoke calm,
                        luxury and the rhythm of the ocean.
                    </p>
                </motion.div>

                {/* Windows 8 Style Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 auto-rows-max">
                    {images.map((_, i) => {
                        const sizeClass = getSizeClass(i);
                        const heightClass = getHeight(i);
                        const currentIdx = currentImageIndices[i] || 0;
                        const currentImage = images[currentIdx];
                        const animPattern = getAnimationPattern(animationType[i]);

                        return (
                            <div
                                key={i}
                                className={`relative group rounded-2xl overflow-hidden cursor-pointer shadow-lg transition-shadow duration-300 hover:shadow-2xl ${sizeClass} ${heightClass}`}
                            >
                                {/* Animated Background Glow */}
                                <motion.div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-500/30 via-transparent to-sky-500/30 transition-opacity duration-300 z-20"
                                />

                                {/* Image carousel */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentIdx}
                                        initial={animPattern.enter}
                                        animate={animPattern.animate}
                                        exit={animPattern.exit}
                                        transition={{
                                            duration: 0.8,
                                            ease: 'easeInOut',
                                        }}
                                        className="absolute inset-0"
                                    >
                                        <img
                                            src={currentImage}
                                            alt={`Gallery ${i + 1}`}
                                            className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                {/* Enhanced Overlay */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 group-hover:from-black/50 group-hover:via-black/10 transition-all duration-300"
                                />

                                {/* Shine/Flip Effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent z-15"
                                    initial={{ x: '-100%' }}
                                    whileHover={{
                                        x: '100%',
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        ease: 'easeInOut',
                                    }}
                                />

                                {/* Content */}
                                <motion.div
                                    className="absolute inset-0 flex flex-col justify-between p-4 md:p-6 z-20"
                                    initial={{ opacity: 0, y: 10 }}
                                    whileHover={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div />
                                    <div>
                                        <motion.p
                                            className="text-xs uppercase tracking-widest text-cyan-300/70 mb-2 font-semibold"
                                            animate={{
                                                color: ['rgba(6, 182, 212, 0.7)', 'rgba(6, 182, 212, 1)', 'rgba(6, 182, 212, 0.7)'],
                                            }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        >
                                            Signature View
                                        </motion.p>
                                        <p className="text-lg md:text-2xl font-semibold text-white">
                                            Ocean Luxury
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Animated Border on Hover */}
                                <motion.div
                                    className="absolute inset-0 rounded-2xl border-2 border-cyan-400/0 pointer-events-none z-20"
                                    whileHover={{
                                        borderColor: 'rgba(6, 182, 212, 0.6)',
                                    }}
                                    transition={{ duration: 0.3 }}
                                />

                                {/* Corner accent indicator */}
                                <motion.div
                                    className="absolute top-3 right-3 w-1.5 h-1.5 bg-cyan-400 rounded-full z-20"
                                    animate={{
                                        opacity: [0.5, 1, 0.5],
                                        scale: [1, 1.3, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FloatingGallery;
