import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Bath,
    Bed,
    Compass,
    MapPin,
    Sparkles,
    Star,
    Wifi,
    Wind,
} from 'lucide-react';
import React, { useState } from 'react';

import AppLayout from '@/layouts/AppLayout';
import MapComponent from '@/components/MapComponent';
import ScrollAnimation from '@/components/ScrollAnimation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Project } from '@/types/Project';

const HotelDetails = () => {
    const [activeImage, setActiveImage] = useState(0);
    const { projectDetails } = usePage<{ projectDetails: Project }>().props;

    if (!projectDetails) {
        return (
            <AppLayout>
                <div className="flex min-h-screen items-center justify-center bg-slate-950">
                    <div className="text-center">
                        <h1 className="mb-4 text-4xl font-bold text-white">
                            Hotel Not Found
                        </h1>
                        <Link href="/hotels-resorts">
                            <Button className="bg-primary hover:bg-primary/90">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Hotels &amp; Resorts
                            </Button>
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const images =
        projectDetails.project_images?.map((img) => img.image) || [];

    const hotelFeatures =
        projectDetails.facilities?.map((facility) => ({
            name: facility.name,
            icon:
                facility.name.toLowerCase().includes('spa') ||
                facility.name.toLowerCase().includes('pool') ||
                facility.name.toLowerCase().includes('bar')
                    ? Sparkles
                    : Wifi,
            description: facility.name,
        })) || [];

    if (projectDetails.details) {
        const detailsFeatures: {
            name: string;
            icon:
                | typeof Bed
                | typeof Bath
                | typeof Wind;
            description: string;
        }[] = [];

        if (projectDetails.details.bedroom) {
            detailsFeatures.push({
                name: 'Bedrooms',
                icon: Bed,
                description: projectDetails.details.bedroom,
            });
        }
        if (projectDetails.details.bathroom) {
            detailsFeatures.push({
                name: 'Bathrooms',
                icon: Bath,
                description: projectDetails.details.bathroom,
            });
        }
        if (projectDetails.details.balcony) {
            detailsFeatures.push({
                name: 'Balcony',
                icon: Wind,
                description: projectDetails.details.balcony,
            });
        }

        hotelFeatures.push(...detailsFeatures);
    }

    const primaryImage =
        images[activeImage] || projectDetails.project_images?.[0]?.image || '';

    return (
        <AppLayout>
            <div className="min-h-screen bg-slate-950 text-white">
                {/* Back Button */}
                <div className="container mx-auto px-4 pb-6 pt-28">
                    <ScrollAnimation>
                        <Link href="/hotels-resorts">
                            <Button
                                variant="ghost"
                                className="p-4 text-white hover:bg-white/10"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Hotels &amp; Resorts
                            </Button>
                        </Link>
                    </ScrollAnimation>
                </div>

                {/* Hero + Gallery */}
                <section className="container mx-auto px-4 pb-12">
                    <ScrollAnimation>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-slate-900 to-slate-950 lg:col-span-2">
                                <motion.div
                                    className="relative h-[420px] w-full overflow-hidden"
                                    initial={{ scale: 1.02, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {primaryImage && (
                                        <img
                                            src={primaryImage}
                                            alt={projectDetails.name}
                                            className="h-full w-full object-cover"
                                        />
                                    )}
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent" />
                                </motion.div>

                                <div className="pointer-events-none absolute inset-0">
                                    <div className="absolute -left-32 top-10 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
                                    <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
                                </div>

                                <div className="relative z-10 flex flex-col gap-4 px-6 pb-6 pt-4 md:px-10 md:pb-8">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <Badge className="bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-1.5 text-sm font-semibold text-slate-950">
                                                Signature Hotel
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="border-sky-400/40 bg-slate-950/40 px-3 py-1 text-xs uppercase tracking-wide text-sky-100"
                                            >
                                                Hotels &amp; Resorts
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-300">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className="h-4 w-4 fill-amber-300"
                                                />
                                            ))}
                                            <span className="ml-1 text-xs text-slate-200">
                                                Premium Experience
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                        <div>
                                            <h1 className="mb-2 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
                                                {projectDetails.name}
                                            </h1>
                                            <div className="flex items-center text-sm text-slate-200/80">
                                                <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-sky-300" />
                                                <span>
                                                    {projectDetails.address ??
                                                        'Address to be announced'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {projectDetails.details
                                                ?.bedroom && (
                                                <div className="flex items-center gap-2 rounded-full bg-slate-950/60 px-4 py-1.5 text-xs">
                                                    <Bed className="h-4 w-4 text-sky-300" />
                                                    <span>
                                                        {
                                                            projectDetails
                                                                .details
                                                                .bedroom
                                                        }{' '}
                                                        Beds
                                                    </span>
                                                </div>
                                            )}
                                            {projectDetails.details
                                                ?.bathroom && (
                                                <div className="flex items-center gap-2 rounded-full bg-slate-950/60 px-4 py-1.5 text-xs">
                                                    <Bath className="h-4 w-4 text-sky-300" />
                                                    <span>
                                                        {
                                                            projectDetails
                                                                .details
                                                                .bathroom
                                                        }{' '}
                                                        Baths
                                                    </span>
                                                </div>
                                            )}
                                            {projectDetails.details
                                                ?.apartment_direction && (
                                                <div className="flex items-center gap-2 rounded-full bg-slate-950/60 px-4 py-1.5 text-xs">
                                                    <Compass className="h-4 w-4 text-sky-300" />
                                                    <span>
                                                        Facing{' '}
                                                        {
                                                            projectDetails
                                                                .details
                                                                .apartment_direction
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 lg:flex lg:flex-col">
                                {images.slice(0, 3).map((img, index) => (
                                    <motion.button
                                        key={index}
                                        type="button"
                                        onClick={() => setActiveImage(index)}
                                        className={`relative h-28 overflow-hidden rounded-2xl border transition-all duration-300 ${
                                            activeImage === index
                                                ? 'border-sky-400/80 shadow-lg shadow-sky-500/40'
                                                : 'border-white/10 hover:border-sky-400/50'
                                        }`}
                                        whileHover={{ scale: 1.03 }}
                                    >
                                        <img
                                            src={img}
                                            alt={`Hotel view ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                        {activeImage === index && (
                                            <div className="pointer-events-none absolute inset-0 bg-sky-500/20" />
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </ScrollAnimation>
                </section>

                {/* Hotel Content */}
                <section className="container mx-auto px-4 pb-20">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                        <div className="space-y-10 lg:col-span-2">
                            <ScrollAnimation>
                                <Card className="border-white/10 bg-slate-950/60 backdrop-blur-xl">
                                    <CardContent className="space-y-4 p-8">
                                        <Badge className="mb-3 bg-sky-500/15 text-xs font-medium uppercase tracking-wide text-sky-200">
                                            Hotel Overview
                                        </Badge>
                                        <h2 className="mb-2 text-2xl font-semibold tracking-tight">
                                            A curated stay for modern
                                            travelers
                                        </h2>
                                        <p className="text-sm leading-relaxed text-slate-200/80">
                                            {projectDetails.description ??
                                                'Experience a thoughtfully designed hotel with curated amenities, elegant interiors, and a calm atmosphere — ideal for both business and leisure stays.'}
                                        </p>
                                        <div className="mt-4 grid gap-4 text-sm text-slate-200/90 sm:grid-cols-2">
                                            <div>
                                                <p className="text-slate-400">
                                                    Location
                                                </p>
                                                <p>
                                                    {projectDetails.location
                                                        ?.name ?? 'To be announced'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400">
                                                    Floors
                                                </p>
                                                <p>
                                                    {projectDetails.floors ??
                                                        'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400">
                                                    Size
                                                </p>
                                                <p>
                                                    {projectDetails.size ??
                                                        'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400">
                                                    Handover
                                                </p>
                                                <p>
                                                    {projectDetails.handover_date ??
                                                        'TBA'}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </ScrollAnimation>

                            <ScrollAnimation delay={0.15}>
                                <Card className="border-sky-500/20 bg-gradient-to-br from-slate-950 via-slate-950/80 to-sky-950/40 backdrop-blur-xl">
                                    <CardContent className="p-8">
                                        <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight">
                                            Signature Amenities
                                        </h2>
                                        <div className="grid gap-5 md:grid-cols-3">
                                            {hotelFeatures.length === 0 && (
                                                <p className="col-span-3 text-center text-sm text-slate-300">
                                                    Amenities will be announced
                                                    soon.
                                                </p>
                                            )}
                                            {hotelFeatures.map(
                                                (feature, index) => {
                                                    const Icon = feature.icon;
                                                    return (
                                                        <motion.div
                                                            key={`${feature.name}-${index}`}
                                                            className="relative flex flex-col items-center rounded-xl border border-white/10 bg-slate-950/40 px-4 py-5 text-center shadow-sm"
                                                            whileHover={{
                                                                y: -4,
                                                                scale: 1.02,
                                                            }}
                                                        >
                                                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/15">
                                                                <Icon className="h-5 w-5 text-sky-300" />
                                                            </div>
                                                            <h3 className="mb-1 text-sm font-semibold">
                                                                {feature.name}
                                                            </h3>
                                                            <p className="text-xs text-slate-300">
                                                                {
                                                                    feature.description
                                                                }
                                                            </p>
                                                        </motion.div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </ScrollAnimation>

                            <ScrollAnimation delay={0.25}>
                                <Card className="border-white/10 bg-slate-950/70 backdrop-blur-xl">
                                    <CardContent className="p-6 md:p-8">
                                        <div className="mb-6 flex flex-col items-center gap-3 text-center md:flex-row md:justify-between md:text-left">
                                            <div>
                                                <h2 className="text-xl font-semibold">
                                                    Explore on the Map
                                                </h2>
                                                <p className="text-xs text-slate-300">
                                                    Discover nearby attractions
                                                    and surroundings.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="overflow-hidden rounded-2xl border border-sky-500/20">
                                            <MapComponent width="100%" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </ScrollAnimation>
                        </div>

                        <div className="space-y-6">
                            <ScrollAnimation>
                                <Card className="border-sky-500/30 bg-gradient-to-b from-slate-950 to-slate-950/80 backdrop-blur-xl">
                                    <CardContent className="space-y-4 p-6">
                                        <h3 className="text-lg font-semibold">
                                            Reservation Info
                                        </h3>
                                        <p className="text-sm text-slate-200/90">
                                            Get in touch with our team to know
                                            more about availability, pricing,
                                            and bespoke stay options tailored
                                            for you.
                                        </p>
                                        <div className="space-y-3 text-sm text-slate-200/90">
                                            <p>
                                                <span className="text-slate-400">
                                                    Project ID:
                                                </span>{' '}
                                                {projectDetails.project_id}
                                            </p>
                                            {projectDetails.price && (
                                                <p>
                                                    <span className="text-slate-400">
                                                        Indicative Price:
                                                    </span>{' '}
                                                    {projectDetails.price.toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                        <Button className="mt-2 w-full bg-sky-500 hover:bg-sky-600">
                                            Enquire About This Hotel
                                        </Button>
                                    </CardContent>
                                </Card>
                            </ScrollAnimation>

                            {primaryImage && (
                                <ScrollAnimation delay={0.15}>
                                    <motion.div
                                        className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-lg"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <img
                                            src={primaryImage}
                                            alt={projectDetails.name}
                                            className="h-56 w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
                                        <div className="absolute bottom-4 left-4">
                                            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                                                Signature Collection
                                            </p>
                                            <p className="text-lg font-semibold">
                                                Hotels &amp; Resorts
                                            </p>
                                        </div>
                                    </motion.div>
                                </ScrollAnimation>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default HotelDetails;

