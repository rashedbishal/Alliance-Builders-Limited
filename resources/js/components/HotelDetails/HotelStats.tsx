import { motion } from 'framer-motion';

const HotelStats = ({ details, floors, size }: any) => {
    const stats = [
        { label: 'Floors', value: floors },
        { label: 'Bedrooms', value: details?.bedroom },
        { label: 'Bathrooms', value: details?.bathroom },
        { label: 'Parking', value: details?.parking },
        { label: 'Property Size', value: size },
    ];

    return (
        <section className="bg-gradient-navy relative overflow-hidden py-28">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 gap-10 text-center md:grid-cols-5">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="space-y-2"
                        >
                            <p className="text-5xl font-light text-white">
                                {stat.value || '—'}
                            </p>
                            <p className="text-xs tracking-widest text-white/50 uppercase">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HotelStats;
