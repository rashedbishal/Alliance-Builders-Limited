import { motion } from 'framer-motion';

const SurroundingsSection = ({ project }: any) => {
    const areaImages: string[] =
        project.project_images
            ?.map((img: { image: string }) => `/${img.image}`)
            .slice(0, 2) || [];

    return (
        <section className="relative overflow-hidden py-32">
            <div className="bg-gradient-elegant absolute inset-0 opacity-30" />

            <div className="relative z-10 container mx-auto px-4">
                <div className="grid items-center gap-16 md:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <p className="mb-3 text-xs tracking-[0.3em] text-white/40 uppercase">
                            Surroundings
                        </p>

                        <h2 className="mb-6 text-5xl font-light">
                            Explore {project.location?.name}
                        </h2>

                        <p className="leading-relaxed text-white/70">
                            {project.surroundings ||
                                'Surrounded by breathtaking views and curated experiences, this destination invites you to discover culture, cuisine, and nature all within reach.'}
                        </p>

                        <div className="mt-6 text-sm text-white/60">
                            📍 {project.address}, {project.location?.name}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                    >
                        {areaImages.map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt={`${project.location?.name ?? 'Area'} surroundings`}
                                className={`aspect-video w-full rounded-3xl object-cover shadow-elegant-xl ${
                                    areaImages.length === 1
                                        ? 'sm:col-span-2'
                                        : ''
                                }`}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default SurroundingsSection;
