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
                    className={`group relative transform transition-all duration-700 hover:scale-105 ${
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
                            className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20"></div>

                        {/* Holographic Shine Effect */}
                        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-b from-transparent via-transparent to-cyan-400/30 -rotate-45 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-y-full transition-all duration-700 ease-out"></div>

                        {/* Content Overlay */}
                        <div className="relative z-10 h-full flex flex-col justify-between p-6">
                            {/* Action Buttons */}
                            <div className="flex justify-end">
                                <div onClick={(e) => e.preventDefault()}>
                                    {/* Floating Action Buttons */}
                                    <div className="flex space-x-2 opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        <Button
                                            size="sm"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleFavorite();
                                            }}
                                            className="bg-white/20 border border-white/30 text-white hover:bg-white/30 backdrop-blur-md rounded-full p-2 shadow-lg"
                                        >
                                            <Heart
                                                className={`h-4 w-4 transition ${
                                                    isFavorite
                                                        ? "fill-red-500 text-red-500 scale-110"
                                                        : "text-white"
                                                }`}
                                            />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Content */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors duration-300">
                                        {property.name}
                                    </h3>
                                    <div className="flex items-center text-white/70 mb-3">
                                        <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                                        <span className="text-sm">{property.location.name}</span>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-4 gap-2">
                                    <div className="text-center p-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur-md">
                                        <Bed className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                                        <div className="text-sm font-semibold text-white">{property.details.bedroom}</div>
                                        <div className="text-xs text-white/60">Beds</div>
                                    </div>
                                    <div className="text-center p-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur-md">
                                        <Bath className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                                        <div className="text-sm font-semibold text-white">{property.details.bathroom}</div>
                                        <div className="text-xs text-white/60">Baths</div>
                                    </div>
                                    <div className="text-center p-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur-md">
                                        <Square className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                                        <div className="text-sm font-semibold text-white">{property.details.apartment_size}</div>
                                        <div className="text-xs text-white/60">Sq Ft</div>
                                    </div>
                                    <div className="text-center p-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur-md">
                                        <Compass className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                                        <div className="text-sm font-semibold text-white">{property.details.apartment_direction}</div>
                                        <div className="text-xs text-white/60">Facing</div>
                                    </div>
                                </div>

                                {/* Features Tags */}
                                <div className="flex justify-between items-start">
                                    {property.tags && property.tags.length > 0 && (
                                        <div className='flex space-x-2'>
                                            {property.tags.slice(0, 2).map((tag: any) => (
                                                <div
                                                    key={tag.id}
                                                    className="px-3 py-1 rounded-full bg-white/20 border border-white/30 backdrop-blur-md text-white text-xs font-semibold shadow-lg"
                                                >
                                                    {tag.name}
                                                </div>
                                            ))}
                                            {property.tags.length > 2 && (
                                                <div className="px-3 py-1 rounded-full bg-white/20 border border-white/30 backdrop-blur-md text-white text-xs font-semibold shadow-lg">
                                                    +{property.tags.length - 2}
                                                </div>
                                            )}
                                        </div>
                                    )}
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
