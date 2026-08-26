import { Link } from '@inertiajs/react';
import { MapPin, Bed, Bath, Square, Heart, Compass } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import ScrollAnimation from '@/components/ScrollAnimation';
import { Button } from "@/components/ui/button";
import { useFavorites } from '@/hooks/useFavorites';
import type { ProjectThumb } from '@/types/ProjectThumb';
import SavedAnimation from './SavedAnimation';

interface PropertyCardProps {
    property: ProjectThumb;
    index: number;
    hoveredCard: number | null;
    setHoveredCard: (id: number | null) => void;
    isFavorite: boolean;
    toggleFavorite: () => void;
    showEyeButton?: boolean;
}

const SAMPLE_BUILDING_IMAGES = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&h=1500&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=1500&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=1500&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=1500&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&h=1500&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=1500&q=80',
];

const PropertyCard = ({
    property,
    index,
    hoveredCard,
    setHoveredCard,
    isFavorite,
    toggleFavorite,
}: PropertyCardProps) => {
    const [showSaved, setShowSaved] = useState(false);
    const { SAVED_EVENT } = useFavorites();

    const fallbackImg = SAMPLE_BUILDING_IMAGES[index % SAMPLE_BUILDING_IMAGES.length];
    const [imgSrc, setImgSrc] = useState<string>(property.image?.path || fallbackImg);

    useEffect(() => {
        if (property.image?.path) {
            setImgSrc(property.image.path);
        } else {
            setImgSrc(fallbackImg);
        }
    }, [property.image?.path, fallbackImg]);

    useEffect(() => {
        const handleSaved = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (customEvent.detail.id === property.id && customEvent.detail.isSaved) {
                setShowSaved(true);
            }
        };

        window.addEventListener(SAVED_EVENT, handleSaved);
        return () => window.removeEventListener(SAVED_EVENT, handleSaved);
    }, [property.id, SAVED_EVENT]);
    return (
        <>
            <SavedAnimation show={showSaved} />
            <ScrollAnimation delay={index * 0.01}>
            <Link href={`${property.slug}`} className="block">
                <div
                    className={`group relative transition-all duration-700 ${
                        hoveredCard === property.id ? 'z-20' : 'z-10'
                    }`}
                    onMouseEnter={() => setHoveredCard(property.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                >
                    {/* Full Background Image Card */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500">

                        {/* Glossy Glaze Effect */}
                        <div className="absolute -top-[200%] -left-[200%] w-[200px] h-[400%] bg-gradient-to-r from-white/0 via-white/10 via-white/20 via-white/30 via-white/40 via-white/50 via-white/60 via-white/50 via-white/40 via-white/30 via-white/20 via-white/10 to-white/0 rotate-45 pointer-events-none transition-all ease-in-out group-hover:top-full group-hover:left-full z-50" style={{ transitionDuration: '900ms' }}></div>

                        {/* Background Image */}
                        <img
                            src={imgSrc}
                            loading='lazy'
                            alt={property.name}
                            onError={() => setImgSrc(fallbackImg)}
                            className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 from-0% via-black/60 via-40% to-transparent to-70%"></div>

                        {/* Holographic Shine Effect */}
                        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-b from-transparent via-transparent to-cyan-400/30 -rotate-45 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-y-full transition-all duration-1000 ease-in-out"></div>

                        {/* Content Overlay */}
                        <div className="relative z-10 h-full flex flex-col justify-between p-6">
                            {/* Top Bar: Badges (Top-Left) & Fav Button (Top-Right) */}
                            <div className="flex justify-between items-start w-full">
                                {/* Badges appearing from Top-Left */}
                                <div className="opacity-0 group-hover:opacity-100 transform -translate-x-3 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-1000 ease-in-out">
                                    {property.tags && property.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {property.tags.slice(0, 2).map((tag: any) => (
                                                <div
                                                    key={tag.id}
                                                    className="px-3 py-1 rounded-full bg-black/60 border border-white/30 backdrop-blur-md text-white text-xs font-semibold shadow-lg"
                                                >
                                                    {tag.name}
                                                </div>
                                            ))}
                                            {property.tags.length > 2 && (
                                                <div className="px-3 py-1 rounded-full bg-black/60 border border-white/30 backdrop-blur-md text-white text-xs font-semibold shadow-lg">
                                                    +{property.tags.length - 2}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Striking Favorite Button (Top-Right) */}
                                <div onClick={(e) => e.preventDefault()}>
                                    <div className="opacity-0 group-hover:opacity-100 transform translate-x-3 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-1000 ease-in-out">
                                        <Button
                                            size="icon"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleFavorite();
                                            }}
                                            className="h-10 w-10 bg-black/70 border-2 border-white/50 text-white hover:bg-black/90 hover:border-white/80 backdrop-blur-md rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 group/fav"
                                        >
                                            <Heart
                                                className={`h-5 w-5 transition-all duration-300 ${
                                                    isFavorite
                                                        ? "fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.9)] scale-110"
                                                        : "text-white"
                                                }`}
                                            />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Content */}
                            <div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors duration-700 ease-in-out">
                                        {property.name}
                                    </h3>
                                    <div className="flex items-center text-white/70">
                                        <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                                        <span className="text-sm">{property.location.name}</span>
                                    </div>
                                </div>

                                {/* Expandable Stats Container */}
                                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-in-out">
                                    <div className="overflow-hidden space-y-4 pt-3">
                                        {/* Stats Grid - bright semi-transparent glass */}
                                        <div className="grid grid-cols-4 gap-2">
                                            <div className="text-center p-2 bg-white/20 border border-white/30 rounded-lg backdrop-blur-md shadow-lg [transform:translateZ(0)]">
                                                <Bed className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                                                <div className="text-sm font-semibold text-white">{property.details.bedroom}</div>
                                                <div className="text-xs text-white/60">Beds</div>
                                            </div>
                                            <div className="text-center p-2 bg-white/20 border border-white/30 rounded-lg backdrop-blur-md shadow-lg [transform:translateZ(0)]">
                                                <Bath className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                                                <div className="text-sm font-semibold text-white">{property.details.bathroom}</div>
                                                <div className="text-xs text-white/60">Baths</div>
                                            </div>
                                            <div className="text-center p-2 bg-white/20 border border-white/30 rounded-lg backdrop-blur-md shadow-lg [transform:translateZ(0)]">
                                                <Square className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                                                <div className="text-sm font-semibold text-white">{property.details.apartment_size}</div>
                                                <div className="text-xs text-white/60">Sq Ft</div>
                                            </div>
                                            <div className="text-center p-2 bg-white/20 border border-white/30 rounded-lg backdrop-blur-md shadow-lg [transform:translateZ(0)]">
                                                <Compass className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                                                <div className="text-sm font-semibold text-white">{property.details.apartment_direction}</div>
                                                <div className="text-xs text-white/60">Facing</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </ScrollAnimation>
        </>
    );
};

export default PropertyCard;
