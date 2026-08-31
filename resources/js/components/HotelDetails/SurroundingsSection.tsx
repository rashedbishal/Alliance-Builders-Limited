import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const SurroundingsSection = ({
    project,
    containerClassName = 'container mx-auto px-4',
}: {
    project: any;
    containerClassName?: string;
}) => {
    const areaImages: string[] =
        project.project_images
            ?.map((img: { image: string }) => `/${img.image}`)
            .slice(0, 2) || [];

    return (
        <section className="relative overflow-hidden py-32">
            <div className="bg-gradient-elegant absolute inset-0 opacity-30" />

            <div className={`relative z-10 ${containerClassName}`}>
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

                    {/* Offset image diptych: a dominant primary shot with the
                        second image overlapping its corner as an elevated
                        card, echoing the layered-image treatment used on the
                        Property Details page. */}
                    {areaImages.length > 1 ? (
                        <div className="relative ml-auto w-full max-w-md pb-12 sm:pb-16">
                            <motion.div
                                initial={{ opacity: 0, x: 60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="relative z-10 aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
                            >
                                <img
                                    src={areaImages[0]}
                                    alt={`${project.location?.name ?? 'Area'} surroundings`}
                                    className="h-full w-full object-cover"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -40, y: 40 }}
                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.25 }}
                                viewport={{ once: true }}
                                className="absolute -bottom-10 -left-4 z-20 aspect-[3/4] w-[58%] overflow-hidden rounded-2xl border-2 border-primary/40 shadow-2xl sm:-left-8 sm:w-[55%]"
                            >
                                <img
                                    src={areaImages[1]}
                                    alt={`${project.location?.name ?? 'Area'} highlight`}
                                    className="h-full w-full object-cover"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                viewport={{ once: true }}
                                className="absolute right-4 bottom-2 z-30 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 shadow-lg backdrop-blur-md sm:right-6"
                            >
                                <MapPin className="h-3.5 w-3.5 text-primary" />
                                <span className="text-xs font-medium tracking-wide text-white/90">
                                    {project.location?.name ?? 'The Area'}
                                </span>
                            </motion.div>
                        </div>
                    ) : (
                        areaImages.map((src, index) => (
                            <motion.img
                                key={index}
                                src={src}
                                alt={`${project.location?.name ?? 'Area'} surroundings`}
                                initial={{ opacity: 0, x: 60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="aspect-video w-full rounded-3xl border border-white/10 object-cover shadow-2xl"
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default SurroundingsSection;
