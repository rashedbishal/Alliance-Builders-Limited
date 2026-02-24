import React, { useMemo, useState } from "react";
import ScrollAnimation from "../ScrollAnimation";
import PropertyCard from "../PropertyCard";
import { usePage } from "@inertiajs/react";
import { ProjectThumb } from "@/types/ProjectThumb";
import { useFavorites } from "@/hooks/useFavorites";

const FavoriteProperties = () => {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const { projects } = usePage<{ projects: ProjectThumb[] }>().props;
    const { favorites } = useFavorites();

    // ✅ Filter favorite properties from backend data
    const favoriteProperties = useMemo(() => {
        return projects.filter(p => favorites.includes(p.id));
    }, [projects, favorites]);

    const { toggleFavorite, isFavorite } = useFavorites();

    if (favoriteProperties.length === 0) {
        return (
            <section className="py-20 text-center text-black">
                <h2 className="text-3xl font-semibold mb-4">
                    No Favorite Properties Yet ❤️
                </h2>
                <p className="text-black/70">
                    Tap the heart icon on any property to save it here.
                </p>
            </section>
        );
    }

    return (
        <section className="py-20 px-4 bg-black text-white">
            <div className="max-w-7xl mx-auto">
                <ScrollAnimation>
                    <h2 className="text-4xl font-bold mb-12 text-center">
                        Your Favorite Properties
                    </h2>
                </ScrollAnimation>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {favoriteProperties.map((property, index) => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                            index={index}
                            hoveredCard={hoveredCard}
                            setHoveredCard={setHoveredCard}
                            isFavorite={isFavorite(property.id)}
                            toggleFavorite={() => toggleFavorite(property.id)}
                            showEyeButton={false}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FavoriteProperties;
