import { motion } from 'framer-motion';

const FloatingGallery = ({ images }: { images: string[] }) => {
    return (
        <section className="relative py-32 overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-gradient-deep" />

            <div className="container relative z-10 mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-light tracking-tight">
                        Discover the Experience
                    </h2>
                    <p className="mt-4 text-white/60 max-w-xl mx-auto">
                        Every corner of this destination is designed to evoke calm,
                        luxury and the rhythm of the ocean.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {images.map((img, i) => (
                        <motion.div
                            key={i}
                            className="relative group"
                            initial={{ opacity: 0, y: 80 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: i * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <motion.img
                                src={img}
                                className="rounded-3xl shadow-elegant-xl object-cover h-[420px] w-full"
                                whileHover={{
                                    scale: 1.05,
                                    rotate: i % 2 ? -1 : 1,
                                }}
                                transition={{ duration: 0.4 }}
                            />

                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

                            <div className="absolute bottom-6 left-6 text-white">
                                <p className="text-xs uppercase tracking-widest text-white/50">
                                    Signature View
                                </p>
                                <p className="text-lg font-semibold">
                                    Ocean Luxury
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FloatingGallery;
