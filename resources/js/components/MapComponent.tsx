import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, ExternalLink, Maximize2 } from 'lucide-react';

interface MapComponentProps {
    width?: string;
    height?: string;
    src: string;
    locationName?: string;
}

const MapComponent = ({ width = '100%', height = '100%', src, locationName = 'Project Location' }: MapComponentProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [showOverlay, setShowOverlay] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleMapClick = () => {
        setShowOverlay(false);
    };

    const handleOpenInMaps = () => {
        window.open(src, '_blank', 'noopener,noreferrer');
    };

    const handleIframeError = () => {
        setHasError(true);
        setIsLoaded(true);
    };

    return (
        <div
            className="group relative h-full w-full overflow-hidden rounded-xl"
            style={{ width, height }}
        >
            {/* Loading skeleton */}
            {!isLoaded && (
                <div className="absolute inset-0 animate-pulse bg-white/[0.03]" />
            )}

            {/* Map iframe */}
            <iframe
                src={src}
                className="absolute inset-0 h-full w-full border-0 transition-opacity duration-500"
                style={{
                    filter: 'brightness(0.85) contrast(1.15) saturate(1.35)',
                    opacity: isLoaded && !hasError ? 1 : 0,
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
                onLoad={() => setIsLoaded(true)}
                onError={handleIframeError}
            />

            {/* Beautiful gradient overlays */}
            {/* Top gradient - for nav blend */}
            {/* <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0a0a0a] to-transparent" />

            {/* Bottom gradient - for content blend */}
            {/* <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" /> */}

            {/* Side gradients */}
            {/* <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
            <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent" /> */}

            {/* Click overlay - shows on hover/first view */}
            <AnimatePresence>
                {showOverlay && !hasError && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/20 backdrop-blur-[1px] transition-colors hover:bg-black/10"
                        onClick={handleMapClick}
                    >
                        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-black/60 px-8 py-6 backdrop-blur-md">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                                <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-white/80">Click to explore map</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-slate-950/50 to-slate-950/80 backdrop-blur-sm">
                    <div className="text-center">
                        <MapPin className="mx-auto mb-3 h-8 w-8 text-primary/50" />
                        <h3 className="text-sm font-medium text-white/80">Map unavailable</h3>
                        <p className="mt-1 text-xs text-white/50">Open in Google Maps for full details</p>
                    </div>
                    <button
                        onClick={handleOpenInMaps}
                        className="mt-2 rounded-lg bg-primary/80 px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary"
                    >
                        <ExternalLink className="mr-2 inline h-3 w-3" />
                        Open in Google Maps
                    </button>
                </div>
            )}

            {/* Location info card - positioned bottom-left */}
            {/* <div className="absolute bottom-6 left-6 z-10 max-w-xs">
                <div className="rounded-xl border border-white/10 bg-[#0a0a0a]/90 p-4 shadow-2xl backdrop-blur-md">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                            <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-sm font-medium text-white">{locationName}</h4>
                            <p className="mt-0.5 text-xs text-white/50">View location on map</p>
                        </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                        <button
                            onClick={handleOpenInMaps}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            <ExternalLink className="h-3 w-3" />
                            Open Maps
                        </button>
                        <button
                            onClick={() => setShowOverlay(true)}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 transition-colors hover:bg-white/10"
                        >
                            <Maximize2 className="h-3 w-3" />
                            Overlay
                        </button>
                    </div>
                </div>
            </div> */}

            {/* Map controls - positioned bottom-right */}
            {/* <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
                <button
                    onClick={handleOpenInMaps}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#0a0a0a]/90 text-white/70 shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:bg-primary hover:text-white"
                    title="Get directions"
                >
                    <Navigation className="h-4 w-4" />
                </button>
            </div> */}

            {/* Corner accents */}
            <div className="pointer-events-none absolute top-4 left-4 h-8 w-8 border-l-2 border-t-2 border-primary/30" />
            <div className="pointer-events-none absolute top-4 right-4 h-8 w-8 border-r-2 border-t-2 border-primary/30" />
            <div className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 border-l-2 border-b-2 border-primary/30" />
            <div className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-r-2 border-b-2 border-primary/30" />
        </div>
    );
};

export default MapComponent;
