import { usePage, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, Car, Heart, Share2, ArrowLeft, Wifi, ParkingCircle, Wind } from 'lucide-react';
import React, { useState } from 'react';
import MapComponent from '@/components/MapComponent';
import ScrollAnimation from '@/components/ScrollAnimation';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


import AppLayout from "@/layouts/AppLayout";
import {properties} from "@/routes";
import type {Project} from "@/types/Project";

const PropertyDetail = () => {
    const [activeImage, setActiveImage] = useState(0);
    const {projectDetails} = usePage<{projectDetails: Project}>().props;

    console.log(projectDetails);

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

    // Map backend data to property object
    // ---------- IMAGES ----------
    const images =
        projectDetails.project_images?.map((img) => "/" + img.image) ?? [];


// ---------- AMENITIES (FACILITIES) ----------
    const amenityIconMap = {
        wifi: Wifi,
        parking: ParkingCircle,
        garage: ParkingCircle,
        balcony: Wind,
    };

    const amenities =
        projectDetails.facilities?.map((facility) => {
            const key = facility.name.toLowerCase();
            const Icon = amenityIconMap[key] || Wifi;

            return {
                name: facility.name,
                icon: Icon,
                description: facility.name,
            };
        }) ?? [];


// ---------- DETAILS FEATURES ----------
    if (projectDetails.details) {
        const d = projectDetails.details;

        if (d.parking)
            amenities.push({
                name: "Parking",
                icon: ParkingCircle,
                description: `${d.parking} Parking`,
            });

        if (d.garage_no)
            amenities.push({
                name: "Garage",
                icon: ParkingCircle,
                description: `${d.garage_no} Garage`,
            });

        if (d.balcony)
            amenities.push({
                name: "Balcony",
                icon: Wind,
                description: `${d.balcony} Balcony`,
            });
    }


// ---------- PROPERTY OBJECT ----------
    const property = {
        id: projectDetails.id,
        title: projectDetails.name,
        description: projectDetails.description ?? "",
        address: projectDetails.address ?? "",
        location: projectDetails.location?.name ?? "Unknown",

        beds: projectDetails.details?.bedroom ?? "N/A",
        baths: projectDetails.details?.bathroom ?? "N/A",

        sqft:
            projectDetails.details?.apartment_size ??
            projectDetails.size ??
            "N/A",

        facing: projectDetails.details?.apartment_direction ?? "N/A",

        parking: parseInt(projectDetails.details?.garage_no ?? 0),

        status: projectDetails.isFeatured ? "Featured" : "Available",

        type: projectDetails.tag?.[0]?.name ?? "Property",

        price: projectDetails.price
            ? `$${projectDetails.price.toLocaleString()}`
            : "Contact for Price",

        yearBuilt: projectDetails.construction_start_date ?? "",

        amenities,

        images: images.length ? images : [],
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-black">
                {/* Back Button */}
                <div className="container mx-auto px-4 pt-28 pb-8">
                    <ScrollAnimation>
                        <Link href={properties()}>
                            <Button
                                variant="ghost"
                                className="p-4 text-white hover:bg-white/10"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Properties
                            </Button>
                        </Link>
                    </ScrollAnimation>
                </div>

                {/* Image Gallery */}
                <section className="container mx-auto px-4 pb-12">
                    <ScrollAnimation>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                            <div className="flex lg:col-span-2">
                                {property.images.length > 0 && (
                                    <img
                                        src={property.images[activeImage]}
                                        alt={property.title}
                                        className="shadow-elegant-lg h-[500px] w-full rounded-lg object-cover"
                                    />
                                )}
                            </div>

                            {property.images.length > 0 && (
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:flex lg:flex-col">
                                    {property.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`View ${index + 1}`}
                                            className={`h-40 w-full cursor-pointer rounded-lg object-cover transition-all duration-300 ${
                                                activeImage === index
                                                    ? 'ring-2 ring-white'
                                                    : 'hover:opacity-75'
                                            }`}
                                            onClick={() =>
                                                setActiveImage(index)
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </ScrollAnimation>
                </section>

                {/* Property Details */}
                <section className="container mx-auto w-3/4 px-4 pb-20">
                    <div className="space-y-16">
                        {/* Header Card */}
                        <ScrollAnimation>
                            <div className="relative overflow-hidden rounded-2xl">
                                {/* Background with gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />

                                {/* Glass morphism card */}
                                <div className="relative bg-white/10 shadow-2xl backdrop-blur-xl">
                                    <div className="p-8 md:p-12">
                                        {/* Top Section - Title and Actions */}
                                        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-start">
                                            <div className="flex-1">
                                                <div className="mb-4 flex items-center gap-3">
                                                    <Badge className="border-0 bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-sm font-medium text-white">
                                                        {property.status}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className="border-white/30 px-4 py-1.5 text-white"
                                                    >
                                                        {property.type}
                                                    </Badge>
                                                </div>
                                                <h1 className="mb-4 text-4xl leading-tight font-bold text-white md:text-5xl">
                                                    {projectDetails.name}
                                                </h1>
                                                <div className="flex items-center text-lg text-white/80">
                                                    <MapPin className="mr-2 h-5 w-5 flex-shrink-0" />
                                                    <span>
                                                        {property.location}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Price and Actions */}
                                            <div className="flex flex-col items-end gap-4">
                                                {/* <div className="text-right">
                        <div className="text-sm text-white/70 mb-1">Starting From</div>
                        <div className="text-5xl font-bold text-white">{property.price}</div>
                      </div> */}
                                                <div className="flex gap-3">
                                                    <motion.div
                                                        whileHover={{
                                                            scale: 1.05,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.95,
                                                        }}
                                                    >
                                                        <Button
                                                            size="icon"
                                                            className="h-12 w-12 rounded-full border border-white/30 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                                                        >
                                                            <Heart className="h-5 w-5 text-white" />
                                                        </Button>
                                                    </motion.div>
                                                    <motion.div
                                                        whileHover={{
                                                            scale: 1.05,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.95,
                                                        }}
                                                    >
                                                        <Button
                                                            size="icon"
                                                            className="h-12 w-12 rounded-full border border-white/30 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                                                        >
                                                            <Share2 className="h-5 w-5 text-white" />
                                                        </Button>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Stats - Modern Grid */}
                                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                            {[
                                                {
                                                    icon: Bed,
                                                    value: property.beds,
                                                    label: 'Bedrooms',
                                                    color: 'from-blue-500 to-cyan-500',
                                                },
                                                {
                                                    icon: Bath,
                                                    value: property.baths,
                                                    label: 'Bathrooms',
                                                    color: 'from-purple-500 to-pink-500',
                                                },
                                                {
                                                    icon: Square,
                                                    value: property.sqft,
                                                    label: 'Square Feet',
                                                    color: 'from-orange-500 to-red-500',
                                                },
                                                {
                                                    icon: Car,
                                                    value: property.parking,
                                                    label: 'Parking',
                                                    color: 'from-green-500 to-emerald-500',
                                                },
                                            ].map((stat, index) => {
                                                const Icon = stat.icon;
                                                return (
                                                    <motion.div
                                                        key={index}
                                                        className="group relative"
                                                        whileHover={{ y: -5 }}
                                                        transition={{
                                                            duration: 0.2,
                                                        }}
                                                    >
                                                        <div className="relative rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/20">
                                                            {/* Gradient accent on hover */}
                                                            <div
                                                                className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 ${stat.color} rounded-xl transition-opacity duration-300`}
                                                            />

                                                            <div className="relative">
                                                                <div
                                                                    className={`inline-flex rounded-lg bg-gradient-to-br p-3 ${stat.color} mb-3`}
                                                                >
                                                                    <Icon className="h-6 w-6 text-white" />
                                                                </div>
                                                                <div className="mb-1 text-3xl font-bold text-white">
                                                                    {stat.value}
                                                                </div>
                                                                <div className="text-sm text-white/70">
                                                                    {stat.label}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollAnimation>

                        {/* Description Section with Images */}
                        <ScrollAnimation delay={0.2}>
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                <div className="grid grid-cols-2 gap-4">
                                    {property.images
                                        .slice(0, 2)
                                        .map((img, index) => (
                                            <motion.img
                                                key={index}
                                                src={img}
                                                alt={`Property view ${index + 1}`}
                                                className="h-64 w-full rounded-lg object-cover shadow-lg"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        ))}
                                </div>
                                <Card className="shadow-elegant-lg bg-white/80">
                                    <CardContent className="p-8">
                                        <Badge className="mb-4 bg-primary/10 text-primary">
                                            {property.type.toUpperCase()}
                                        </Badge>
                                        <h2 className="mb-4 text-3xl font-bold text-black">
                                            {property.title}
                                        </h2>
                                        <p className="mb-4 leading-relaxed text-muted-foreground">
                                            {property.description}
                                        </p>
                                        <div className="mt-4 space-y-2 text-black">
                                            <p>
                                                <strong>Address:</strong>{' '}
                                                {property.address}
                                            </p>
                                            <p>
                                                <strong>Beds:</strong>{' '}
                                                {property.beds} |{' '}
                                                <strong>Baths:</strong>{' '}
                                                {property.baths}
                                            </p>
                                            <p>
                                                <strong>Size:</strong>{' '}
                                                {property.sqft}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </ScrollAnimation>

                        {/* Features Grid */}
                        <ScrollAnimation delay={0.3}>
                            <Card className="shadow-elegant-lg border-0 bg-black backdrop-blur-lg">
                                <CardContent className="p-8">
                                    <h2 className="mb-8 text-center text-3xl font-bold text-white">
                                        Amenities
                                    </h2>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        {property.amenities.map(
                                            (amenity, index) => {
                                                const Icon = amenity.icon;
                                                return (
                                                    <>
                                                        <motion.div
                                                            key={index}
                                                            className="relative flex flex-col items-center rounded-lg bg-white/10 p-6 text-center shadow-2xl backdrop-blur-xl"
                                                            whileHover={{
                                                                y: -5,
                                                            }}
                                                            transition={{
                                                                duration: 0.3,
                                                            }}
                                                        >
                                                            {/* Background with gradient */}
                                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />
                                                            <div className="mb-4 rounded-full bg-primary/10 p-4">
                                                                <Icon className="h-8 w-8 text-white" />
                                                            </div>
                                                            <h3 className="mb-2 text-lg font-bold text-white">
                                                                {amenity.name}
                                                            </h3>
                                                            <p className="text-sm text-white">
                                                                {
                                                                    amenity.description
                                                                }
                                                            </p>
                                                        </motion.div>
                                                    </>
                                                );
                                            },
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollAnimation>

                        {/* Large Property Image */}
                        <ScrollAnimation delay={0.4}>
                            {property.images?.[0] && (
                                <motion.div
                                    className="shadow-elegant-lg relative h-[500px] overflow-hidden rounded-lg"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <img
                                        src={property.images[0]}
                                        alt={property.title}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                </motion.div>
                            )}
                        </ScrollAnimation>

                        {/* Video Album Section */}
                        <ScrollAnimation delay={0.6}>
                            <Card className="shadow-elegant-lg bg-white/80">
                                <CardContent className="p-8">
                                    <div className="mb-8 text-center">
                                        <Badge className="mb-4 bg-primary/10 text-primary">
                                            VISUAL TOUR
                                        </Badge>
                                        <h2 className="text-4xl font-bold text-black">
                                            ECOPI GARDEN ALBUM
                                        </h2>
                                    </div>

                                    <Tabs defaultValue="all" className="w-full">
                                        <TabsList className="mb-8 flex flex-wrap justify-center">
                                            <TabsTrigger value="all">
                                                All
                                            </TabsTrigger>
                                            <TabsTrigger value="living">
                                                Living Room
                                            </TabsTrigger>
                                            <TabsTrigger value="bed">
                                                Bed Room
                                            </TabsTrigger>
                                            <TabsTrigger value="bath">
                                                Bath Room
                                            </TabsTrigger>
                                            <TabsTrigger value="basement">
                                                Basement
                                            </TabsTrigger>
                                            <TabsTrigger value="kitchen">
                                                Kitchen
                                            </TabsTrigger>
                                            <TabsTrigger value="entertainment">
                                                Entertainment
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent
                                            value="all"
                                            className="grid grid-cols-2 gap-4 md:grid-cols-4"
                                        >
                                            {property.images.map(
                                                (img, index) => (
                                                    <motion.div
                                                        key={index}
                                                        className="group relative h-48 cursor-pointer overflow-hidden rounded-lg"
                                                        whileHover={{
                                                            scale: 1.05,
                                                        }}
                                                        transition={{
                                                            duration: 0.3,
                                                        }}
                                                    >
                                                        <img
                                                            src={img}
                                                            alt={`Gallery ${index + 1}`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                            >
                                                                View
                                                            </Button>
                                                        </div>
                                                    </motion.div>
                                                ),
                                            )}
                                        </TabsContent>

                                        {[
                                            'living',
                                            'bed',
                                            'bath',
                                            'basement',
                                            'kitchen',
                                            'entertainment',
                                        ].map((tab) => (
                                            <TabsContent
                                                key={tab}
                                                value={tab}
                                                className="grid grid-cols-2 gap-4 md:grid-cols-4"
                                            >
                                                {property.images
                                                    .slice(0, 3)
                                                    .map((img, index) => (
                                                        <motion.div
                                                            key={index}
                                                            className="group relative h-48 cursor-pointer overflow-hidden rounded-lg"
                                                            whileHover={{
                                                                scale: 1.05,
                                                            }}
                                                            transition={{
                                                                duration: 0.3,
                                                            }}
                                                        >
                                                            <img
                                                                src={img}
                                                                alt={`${tab} ${index + 1}`}
                                                                className="h-full w-full object-cover"
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                                                <Button
                                                                    size="sm"
                                                                    variant="secondary"
                                                                >
                                                                    View
                                                                </Button>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                            </TabsContent>
                                        ))}
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </ScrollAnimation>

                        {/* Map Section */}
                        <ScrollAnimation delay={0.7}>
                            <Card className="shadow-elegant-lg mx-auto items-center border-0 text-center">
                                <CardContent>
                                    <div className="mt-16 flex flex-col gap-4">
                                        <h2 className="mb-4 text-4xl font-medium text-white lg:text-5xl">
                                            Find In Google Map
                                        </h2>
                                        <div className="flex justify-center">
                                            <MapComponent
                                                width="100%"
                                                // mapUrl={projectDetails.google_map_url}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollAnimation>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default PropertyDetail;
