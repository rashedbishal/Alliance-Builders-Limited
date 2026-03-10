import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Bath,
    Bed,
    Building2,
    Calendar,
    Car,
    CheckCircle2,
    Compass,
    ExternalLink,
    Hash,
    MapPin,
    Ruler,
    ShieldCheck,
    Square,
    Tag as TagIcon,
    Video,
    Waves,
    Wifi,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import MapComponent from '@/components/MapComponent';
import ScrollAnimation from '@/components/ScrollAnimation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';


import AppLayout from "@/layouts/AppLayout";
import {properties} from "@/routes";
import type { Facility, Project } from '@/types/Project';

const PropertyDetail = () => {
    const [activeImage, setActiveImage] = useState(0);
    const { projectDetails, allFacilities } = usePage<{
        projectDetails: Project;
        allFacilities?: Facility[];
    }>().props;

    // Handle property not found
    if (!projectDetails) {
        return (
            <AppLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">Property Not Found</h1>
                        <Link href={properties()}>
                            <Button className="bg-primary hover:bg-primary/90">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Properties
                            </Button>
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const normalize = (value: string) =>
        value
            .trim()
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

    const formatDate = (value: string | null | undefined) => {
        if (!value) return '—';
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return '—';
        return d.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    };

    const formatCurrency = (value: number | null | undefined) => {
        if (value === null || value === undefined) return 'Contact for price';
        try {
            return new Intl.NumberFormat('en-BD', {
                style: 'currency',
                currency: 'BDT',
                maximumFractionDigits: 0,
            }).format(value);
        } catch {
            return value.toLocaleString();
        }
    };

    const images =
        projectDetails.project_images?.map((img) => `/${img.image}`) ?? [];

    const primaryImage = images[activeImage] ?? images[0] ?? '';

    const facilityIcon = (facilityName: string) => {
        const key = normalize(facilityName);
        const map: Record<string, LucideIcon> = {
            wifi: Wifi,
            'wi-fi': Wifi,
            internet: Wifi,
            security: ShieldCheck,
            '24-7-security': ShieldCheck,
            parking: Car,
            garage: Car,
            pool: Waves,
            'swimming-pool': Waves,
        };
        return map[key] ?? CheckCircle2;
    };

    const tagList = projectDetails.tags ?? projectDetails.tag ?? [];

    const facilityIds = useMemo(() => {
        const ids = new Set<number>();
        (projectDetails.facilities ?? []).forEach((f) => ids.add(f.id));
        return ids;
    }, [projectDetails.facilities]);

    const presentFacilities = useMemo(() => {
        const source = (allFacilities?.length ? allFacilities : projectDetails.facilities) ?? [];
        return source
            .filter((f) => facilityIds.has(f.id))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [allFacilities, facilityIds, projectDetails.facilities]);

    const quickFacts = [
        {
            label: 'Bedrooms',
            value: projectDetails.details?.bedroom ?? '—',
            icon: Bed,
        },
        {
            label: 'Bathrooms',
            value: projectDetails.details?.bathroom ?? '—',
            icon: Bath,
        },
        {
            label: 'Size',
            value:
                projectDetails.details?.apartment_size ??
                projectDetails.size ??
                '—',
            icon: Square,
        },
        {
            label: 'Floors',
            value: projectDetails.floors ?? '—',
            icon: Building2,
        },
    ];

    return (
        <AppLayout>
            <div className="min-h-screen bg-black text-white">
                {/* Back Button */}
                <div className="container mx-auto px-4 pb-6 pt-28">
                    <ScrollAnimation>
                        <Link href={properties()}>
                            <Button
                                variant="ghost"
                                className="px-0 text-white/90 hover:bg-transparent hover:text-white"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Properties
                            </Button>
                        </Link>
                    </ScrollAnimation>
                </div>

                {/* Hero: Gallery + Summary */}
                <section className="container mx-auto px-4 pb-10">
                    <ScrollAnimation>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div className="grid grid-cols-4 gap-3 lg:flex lg:flex-col">
                                {images.slice(0, 5).map((img, index) => (
                                    <motion.button
                                        key={`${img}-${index}`}
                                        type="button"
                                        onClick={() => setActiveImage(index)}
                                        className={`relative h-20 overflow-hidden rounded-xl border transition-all duration-300 lg:h-24 ${
                                            activeImage === index
                                                ? 'border-white/40 bg-white/5'
                                                : 'border-white/10 hover:border-white/25'
                                        }`}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <img
                                            src={img}
                                            alt={`Property view ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </motion.button>
                                ))}
                            </div>

                            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 lg:col-span-2">
                                {primaryImage ? (
                                    <motion.div
                                        className="relative h-[420px] w-full overflow-hidden"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <img
                                            src={primaryImage}
                                            alt={projectDetails.name}
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                    </motion.div>
                                ) : (
                                    <div className="flex h-[420px] items-center justify-center text-white/60">
                                        No images available
                                    </div>
                                )}

                                <div className="relative z-10 px-6 pb-6 pt-4 md:px-10">
                                    <div className="mb-3 flex flex-wrap items-center gap-2">
                                        {projectDetails.isFeatured && (
                                            <Badge className="border-0 bg-primary/90 text-white">
                                                Featured
                                            </Badge>
                                        )}
                                        {tagList.slice(0, 2).map((t) => (
                                            <Badge
                                                key={t.id}
                                                variant="outline"
                                                className="border-white/20 bg-black/20 text-white/90"
                                            >
                                                {t.name}
                                            </Badge>
                                        ))}
                                    </div>

                                    <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                                        {projectDetails.name}
                                    </h1>
                                    <div className="mt-2 space-y-1 text-sm text-white/80">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                            <div>
                                                <div>
                                                    {projectDetails.location
                                                        ?.name ?? '—'}
                                                </div>
                                                {projectDetails.address && (
                                                    <div className="text-white/60">
                                                        {projectDetails.address}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                        <div>
                                            <div className="text-xs uppercase tracking-wide text-white/60">
                                                Indicative price
                                            </div>
                                            <div className="text-2xl font-semibold">
                                                {formatCurrency(
                                                    projectDetails.price,
                                                )}
                                            </div>
                                        </div>
                                        {projectDetails.google_map_url && (
                                            <Button
                                                asChild
                                                variant="secondary"
                                                className="bg-white/15 text-white hover:bg-white/25"
                                            >
                                                <a
                                                    href={
                                                        projectDetails.google_map_url
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Open in Google Maps
                                                    <ExternalLink className="ml-2 h-4 w-4" />
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>
                </section>

                {/* Content */}
                <section className="container mx-auto px-4 pb-20">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                        {/* Left rail - At a Glance */}
                        <ScrollAnimation>
                            <Card className="border-white/10 bg-white/5 backdrop-blur-xl lg:sticky lg:top-28 lg:h-fit">
                                <CardContent className="p-6 text-sm text-white/85">
                                    <h2 className="text-base font-semibold">
                                        At a Glance
                                    </h2>
                                    <div className="mt-4 grid gap-3">
                                        <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                                            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/60">
                                                <MapPin className="h-3.5 w-3.5" />
                                                Location
                                            </span>
                                            <span className="text-right text-sm">
                                                {projectDetails.location?.name ??
                                                    '—'}
                                            </span>
                                        </div>
                                        <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                                            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/60">
                                                <Square className="h-3.5 w-3.5" />
                                                Apartment Size
                                            </span>
                                            <span className="text-right text-sm">
                                                {projectDetails.details
                                                    ?.apartment_size ??
                                                    projectDetails.size ??
                                                    '—'}
                                            </span>
                                        </div>
                                        <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                                            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/60">
                                                <Bed className="h-3.5 w-3.5" />
                                                Bedroom
                                            </span>
                                            <span className="text-right text-sm">
                                                {projectDetails.details
                                                    ?.bedroom ?? '—'}
                                            </span>
                                        </div>
                                        <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                                            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/60">
                                                <Bath className="h-3.5 w-3.5" />
                                                Bathroom
                                            </span>
                                            <span className="text-right text-sm">
                                                {projectDetails.details
                                                    ?.bathroom ?? '—'}
                                            </span>
                                        </div>
                                        <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                                            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/60">
                                                <Building2 className="h-3.5 w-3.5" />
                                                No. of Floors
                                            </span>
                                            <span className="text-right text-sm">
                                                {projectDetails.floors ?? '—'}
                                            </span>
                                        </div>
                                        <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                                            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/60">
                                                <Calendar className="h-3.5 w-3.5" />
                                                Launch / Start
                                            </span>
                                            <span className="text-right text-sm">
                                                {formatDate(
                                                    projectDetails.construction_start_date,
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                                            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/60">
                                                <Calendar className="h-3.5 w-3.5" />
                                                Expected Completion
                                            </span>
                                            <span className="text-right text-sm">
                                                {formatDate(
                                                    projectDetails.handover_date,
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/60">
                                                <Hash className="h-3.5 w-3.5" />
                                                Project ID
                                            </span>
                                            <span className="text-right text-sm">
                                                {projectDetails.project_id ??
                                                    '—'}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollAnimation>

                        {/* Main sections */}
                        <div className="space-y-10 lg:col-span-2">
                            <ScrollAnimation>
                                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                                    <CardContent className="p-8">
                                        <div className="mb-3 flex items-center gap-2">
                                            <Badge className="bg-white/10 text-white">
                                                Overview
                                            </Badge>
                                        </div>
                                        <p className="text-sm leading-relaxed text-white/80">
                                            {projectDetails.description ??
                                                '—'}
                                        </p>

                                        {projectDetails.surroundings && (
                                            <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-5">
                                                <div className="flex items-center gap-2 text-sm font-semibold">
                                                    <MapPin className="h-4 w-4" />
                                                    Surroundings
                                                </div>
                                                <p className="mt-2 text-sm text-white/75">
                                                    {projectDetails.surroundings}
                                                </p>
                                            </div>
                                        )}

                                        {tagList.length > 0 && (
                                            <div className="mt-6">
                                                <div className="flex items-center gap-2 text-sm font-semibold">
                                                    <TagIcon className="h-4 w-4" />
                                                    Tags
                                                </div>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {tagList.map((t) => (
                                                        <Badge
                                                            key={t.id}
                                                            variant="outline"
                                                            className="border-white/15 bg-black/10 text-white/80"
                                                        >
                                                            {t.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </ScrollAnimation>

                            <ScrollAnimation delay={0.12}>
                                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                                    <CardContent className="p-8">
                                        <h2 className="text-xl font-semibold">
                                            Unit specifications
                                        </h2>

                                        <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                                            {[
                                                {
                                                    label: 'Apartment size',
                                                    value: projectDetails.details
                                                        ?.apartment_size,
                                                    icon: Square,
                                                },
                                                {
                                                    label: 'Facing',
                                                    value: projectDetails.details
                                                        ?.apartment_direction,
                                                    icon: Compass,
                                                },
                                                {
                                                    label: 'Bedrooms',
                                                    value: projectDetails.details
                                                        ?.bedroom,
                                                    icon: Bed,
                                                },
                                                {
                                                    label: 'Bathrooms',
                                                    value: projectDetails.details
                                                        ?.bathroom,
                                                    icon: Bath,
                                                },
                                                {
                                                    label: 'Balcony',
                                                    value: projectDetails.details
                                                        ?.balcony,
                                                    icon: CheckCircle2,
                                                },
                                                {
                                                    label: 'Kitchen',
                                                    value: projectDetails.details
                                                        ?.kitchen,
                                                    icon: CheckCircle2,
                                                },
                                                {
                                                    label: 'Living & Dining',
                                                    value: projectDetails.details
                                                        ?.living_dining,
                                                    icon: CheckCircle2,
                                                },
                                                {
                                                    label: 'Parking',
                                                    value: projectDetails.details
                                                        ?.parking,
                                                    icon: Car,
                                                },
                                                {
                                                    label: 'Garage (No.)',
                                                    value: projectDetails.details
                                                        ?.garage_no,
                                                    icon: Car,
                                                },
                                                {
                                                    label: 'Garage size',
                                                    value: projectDetails.details
                                                        ?.garage_size,
                                                    icon: Ruler,
                                                },
                                            ]
                                                .filter((x) => x.value)
                                                .map((item) => {
                                                    const Icon = item.icon;
                                                    return (
                                                        <div
                                                            key={item.label}
                                                            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/10 p-4"
                                                        >
                                                            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                                                                <Icon className="h-4 w-4 text-white/85" />
                                                            </div>
                                                            <div>
                                                                <div className="text-xs uppercase tracking-wide text-white/60">
                                                                    {item.label}
                                                                </div>
                                                                <div className="mt-1 font-medium text-white">
                                                                    {item.value}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </CardContent>
                                </Card>
                            </ScrollAnimation>

                            <ScrollAnimation delay={0.2}>
                                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                                    <CardContent className="p-8">
                                        <h2 className="text-xl font-semibold">
                                            Amenities
                                        </h2>
                                        <p className="mt-1 text-sm text-white/65">
                                            Selected facilities available in
                                            this property.
                                        </p>

                                        {presentFacilities.length === 0 ? (
                                            <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-5 text-sm text-white/70">
                                                Amenities will be announced
                                                soon.
                                            </div>
                                        ) : (
                                            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                                {presentFacilities.map((f) => {
                                                    const Icon = facilityIcon(
                                                        f.name,
                                                    );
                                                    return (
                                                        <motion.div
                                                            key={f.id}
                                                            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 p-4"
                                                            whileHover={{
                                                                y: -3,
                                                                scale: 1.01,
                                                            }}
                                                            transition={{
                                                                duration: 0.2,
                                                            }}
                                                        >
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                                                                <Icon className="h-5 w-5 text-white/90" />
                                                            </div>
                                                            <div className="text-sm font-medium text-white">
                                                                {f.name}
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </ScrollAnimation>

                            {projectDetails.details?.youtube_video_id && (
                                <ScrollAnimation delay={0.28}>
                                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                                        <CardContent className="p-8">
                                            <div className="flex items-center gap-2">
                                                <Video className="h-5 w-5" />
                                                <h2 className="text-xl font-semibold">
                                                    Video tour
                                                </h2>
                                            </div>
                                            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                                                <iframe
                                                    className="aspect-video w-full"
                                                    src={`https://www.youtube.com/embed/${projectDetails.details.youtube_video_id}`}
                                                    title="YouTube video player"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    referrerPolicy="strict-origin-when-cross-origin"
                                                    allowFullScreen
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </ScrollAnimation>
                            )}

                            <ScrollAnimation delay={0.35}>
                                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                                    <CardContent className="p-8">
                                        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                                            <div>
                                                <h2 className="text-xl font-semibold">
                                                    Location
                                                </h2>
                                                <p className="mt-1 text-sm text-white/65">
                                                    Explore the neighborhood and
                                                    nearby points of interest.
                                                </p>
                                            </div>
                                            {projectDetails.google_map_url && (
                                                <Button
                                                    asChild
                                                    variant="secondary"
                                                    className="bg-white/15 text-white hover:bg-white/25"
                                                >
                                                    <a
                                                        href={
                                                            projectDetails.google_map_url
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        View on Google Maps
                                                        <ExternalLink className="ml-2 h-4 w-4" />
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                                            <MapComponent width="100%" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </ScrollAnimation>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default PropertyDetail;
