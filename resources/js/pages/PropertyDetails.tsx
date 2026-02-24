import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Bed, Bath, Square, Car, Calendar, Home, Heart, Share2, ArrowLeft, Wifi, Shield, Bell, ParkingCircle, Wind, Waves, Phone, Camera, Dumbbell, Trees } from 'lucide-react';
import { motion } from 'framer-motion';

import { WritingText } from '@/components/ui/shadcn-io/writing-text';

import ScrollAnimation from '@/components/ScrollAnimation';
import MapComponent from '@/components/MapComponent';
import AppLayout from "@/layouts/AppLayout";
import {properties} from "@/routes";
import {Project} from "@/types/Project";

const PropertyDetail = () => {
    const [activeImage, setActiveImage] = useState(0);
    const {projectDetails} = usePage<{projectDetails: Project}>().props;

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
    const images = projectDetails.project_images?.map(img => img.image) || [];
    
    // Map facilities to features with appropriate icons
    const mappedFeatures = projectDetails.facilities?.map(facility => ({
        name: facility.name,
        icon: Wifi, // Default icon - adjust based on facility name if needed
        description: facility.name
    })) || [];

    // Add details-based features if details exist
    if (projectDetails.details) {
        const detailsFeatures = [];
        if (projectDetails.details.parking) detailsFeatures.push({ name: "Parking", icon: ParkingCircle, description: `Parking: ${projectDetails.details.parking}` });
        if (projectDetails.details.garage_no) detailsFeatures.push({ name: "Garage", icon: ParkingCircle, description: `Garage spaces: ${projectDetails.details.garage_no}` });
        if (projectDetails.details.balcony) detailsFeatures.push({ name: "Balcony", icon: Wind, description: `Balcony: ${projectDetails.details.balcony}` });
        if (projectDetails.details.kitchen) detailsFeatures.push({ name: "Kitchen", icon: Wifi, description: `Kitchen: ${projectDetails.details.kitchen}` });
        mappedFeatures.push(...detailsFeatures);
    }

    const property = {
        id: projectDetails.id,
        title: projectDetails.name,
        location: projectDetails.location || "Not specified",
        beds: projectDetails.details?.bedroom || "N/A",
        baths: projectDetails.details?.bathroom || "N/A",
        sqft: projectDetails.details?.apartment_size || projectDetails.size || "N/A",
        facing: projectDetails.details?.apartment_direction || "Not specified",
        status: projectDetails.isFeatured ? "Featured" : "Available",
        type: projectDetails.tag?.[0]?.name || "Property",
        image: projectDetails.project_images?.[0]?.image || "",
        features: mappedFeatures,
        price: projectDetails.price ? `$${projectDetails.price.toLocaleString()}` : "Contact for Price",
        parking: projectDetails.details?.garage_no ? parseInt(projectDetails.details.garage_no) : 0,
        yearBuilt: projectDetails.construction_start_date || "Not specified",
        description: projectDetails.description || "Beautiful property with premium features",
        images: images.length > 0 ? images : [projectDetails.project_images?.[0]?.image || ""]
    };

    console.log(projectDetails.project_images);
    console.log(property.image);

    return (
        <AppLayout>
            <div className="min-h-screen bg-black" >
                {/* Back Button */}
                <div className="container mx-auto px-4 pt-28 pb-8">
                    <ScrollAnimation>
                        <Link href={properties()}>
                            <Button variant="ghost" className='p-4 text-white hover:bg-white/10'>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Properties
                            </Button>
                        </Link>
                    </ScrollAnimation>
                </div>

                {/* Image Gallery */}
                <section className="container mx-auto px-4 pb-12">
                    <ScrollAnimation>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="flex lg:col-span-2">
                                <img
                                    src={property.images[activeImage]}
                                    alt={property.title}
                                    className="w-full h-[500px] object-cover rounded-lg shadow-elegant-lg"
                                />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-col gap-4">
                                {property.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`View ${index + 1}`}
                                        className={`w-full h-40 object-cover rounded-lg cursor-pointer transition-all duration-300 ${activeImage === index ? 'ring-2 ring-white' : 'hover:opacity-75'
                                        }`}
                                        onClick={() => setActiveImage(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </ScrollAnimation>
                </section>

                {/* Property Details */}
                <section className="container w-3/4 mx-auto px-4 pb-20">
                    <div className="space-y-16">
                        {/* Header Card */}
                        <ScrollAnimation>
                            <div className="relative overflow-hidden rounded-2xl">
                                {/* Background with gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />

                                {/* Glass morphism card */}
                                <div className="relative backdrop-blur-xl bg-white/10 shadow-2xl">
                                    <div className="p-8 md:p-12">
                                        {/* Top Section - Title and Actions */}
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 px-4 py-1.5 text-sm font-medium">
                                                        {property.status}
                                                    </Badge>
                                                    <Badge variant="outline" className="border-white/30 text-white px-4 py-1.5">
                                                        {property.type}
                                                    </Badge>
                                                </div>
                                                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
                                                    {projectDetails.name}
                                                </h1>
                                                <div className="flex items-center text-white/80 text-lg">
                                                    <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                                                    <span>{property.location}</span>
                                                </div>
                                            </div>

                                            {/* Price and Actions */}
                                            <div className="flex flex-col items-end gap-4">
                                                {/* <div className="text-right">
                        <div className="text-sm text-white/70 mb-1">Starting From</div>
                        <div className="text-5xl font-bold text-white">{property.price}</div>
                      </div> */}
                                                <div className="flex gap-3">
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <Button size="icon" className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30">
                                                            <Heart className="h-5 w-5 text-white" />
                                                        </Button>
                                                    </motion.div>
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <Button size="icon" className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30">
                                                            <Share2 className="h-5 w-5 text-white" />
                                                        </Button>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Stats - Modern Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { icon: Bed, value: property.beds, label: "Bedrooms", color: "from-blue-500 to-cyan-500" },
                                                { icon: Bath, value: property.baths, label: "Bathrooms", color: "from-purple-500 to-pink-500" },
                                                { icon: Square, value: property.sqft, label: "Square Feet", color: "from-orange-500 to-red-500" },
                                                { icon: Car, value: property.parking, label: "Parking", color: "from-green-500 to-emerald-500" }
                                            ].map((stat, index) => {
                                                const Icon = stat.icon;
                                                return (
                                                    <motion.div
                                                        key={index}
                                                        className="relative group"
                                                        whileHover={{ y: -5 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <div className="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
                                                            {/* Gradient accent on hover */}
                                                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${stat.color} rounded-xl transition-opacity duration-300`} />

                                                            <div className="relative">
                                                                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stat.color} mb-3`}>
                                                                    <Icon className="h-6 w-6 text-white" />
                                                                </div>
                                                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                                                <div className="text-sm text-white/70">{stat.label}</div>
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
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="grid grid-cols-2 gap-4">
                                    {property.images.slice(0, 2).map((img, index) => (
                                        <motion.img
                                            key={index}
                                            src={img}
                                            alt={`Property view ${index + 1}`}
                                            className="w-full h-64 object-cover rounded-lg shadow-lg"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    ))}
                                </div>
                                <Card className="bg-white/80 shadow-elegant-lg">
                                    <CardContent className="p-8">
                                        <Badge className="bg-primary/10 text-primary mb-4">{property.type.toUpperCase()}</Badge>
                                        <h2 className="text-3xl font-bold mb-4 text-black">{property.title}</h2>
                                        <p className="text-muted-foreground leading-relaxed mb-4">
                                            {property.description}
                                        </p>
                                        <div className="mt-4 space-y-2 text-black">
                                            <p><strong>Location:</strong> {property.location}</p>
                                            <p><strong>Beds:</strong> {property.beds} | <strong>Baths:</strong> {property.baths}</p>
                                            <p><strong>Size:</strong> {property.sqft}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </ScrollAnimation>

                        {/* Features Grid */}
                        <ScrollAnimation delay={0.3}>
                            <Card className="bg-black border-0 backdrop-blur-lg shadow-elegant-lg">
                                <CardContent className="p-8">
                                    <h2 className="text-3xl font-bold mb-8 text-center text-white">Property Features</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {property.features.map((feature, index) => {
                                            const Icon = feature.icon;
                                            return (
                                                <>

                                                    <motion.div
                                                        key={index}
                                                        className="relative backdrop-blur-xl bg-white/10 shadow-2xl flex flex-col items-center text-center p-6 rounded-lg "
                                                        whileHover={{ y: -5 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        {/* Background with gradient */}
                                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />
                                                        <div className="p-4 rounded-full bg-primary/10 mb-4">
                                                            <Icon className="h-8 w-8 text-white" />
                                                        </div>
                                                        <h3 className="font-bold text-lg mb-2 text-white">{feature.name}</h3>
                                                        <p className="text-sm text-white">{feature.description}</p>
                                                    </motion.div>
                                                </>

                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollAnimation>

                        {/* Large Property Image */}
                        <ScrollAnimation delay={0.4}>
                            <motion.div
                                className="relative h-[500px] rounded-lg overflow-hidden shadow-elegant-lg"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.5 }}
                            >
                                <img
                                    src={property.images[0]}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            </motion.div>
                        </ScrollAnimation>

                        {/* Floor Plans Section */}
                        {/* <ScrollAnimation delay={0.5}>
            <Card className="bg-white/80 shadow-elegant-lg">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Badge className="bg-primary/10 text-primary mb-4">RESIDENCE PLANS</Badge>
                  <h2 className="text-4xl font-bold text-black">FLOOR PLANS</h2>
                </div>

                <Tabs defaultValue="ground" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-8">
                    <TabsTrigger value="basement">BASEMENT</TabsTrigger>
                    <TabsTrigger value="ground">GROUND FLOOR</TabsTrigger>
                    <TabsTrigger value="second">2ND FLOOR</TabsTrigger>
                    <TabsTrigger value="rooftop">ROOFTOP</TabsTrigger>
                  </TabsList>

                  {property.floorPlans.map((plan) => (
                    <TabsContent key={plan.id} value={plan.id} className="mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> */}
                        {/* Floor Plan Info */}
                        {/* <div className="space-y-6">
                          <div>
                            <h3 className="text-2xl font-bold mb-2 text-black">{plan.area}</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                              The living room faces full south (direction with center residence column)
                            </p>
                          </div>

                          <div className="space-y-4 text-black">
                            <div className="flex justify-between py-3 border-b border-border">
                              <span className="font-medium">Location</span>
                              <span className="text-muted-foreground">{plan.location}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-border">
                              <span className="font-medium">Levels</span>
                              <span className="text-muted-foreground">{plan.levels}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-border">
                              <span className="font-medium">Parking</span>
                              <span className="text-muted-foreground">{plan.parking}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-border">
                              <span className="font-medium">Total Area</span>
                              <span className="font-bold text-primary">{plan.area}</span>
                            </div>
                          </div>

                          <div className="flex gap-4 pt-4">
                            <Button className="flex-1 bg-primary hover:bg-primary/90">
                              TAKE A TOUR
                            </Button>
                            <Button variant="outline" className="flex-1">
                              DOWNLOAD FILE
                            </Button>
                          </div>
                        </div>

                        {/* Floor Plan Image */}
                        {/* <div className="lg:col-span-2">
                          <div className="bg-gray-50 rounded-lg p-8 h-full flex items-center justify-center">
                            <img
                              src={skyView}
                              alt={`${plan.name} floor plan`}
                              className="w-full h-auto max-h-[500px] object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </ScrollAnimation> */}

                        {/* Video Album Section */}
                        <ScrollAnimation delay={0.6}>
                            <Card className="bg-white/80 shadow-elegant-lg">
                                <CardContent className="p-8">
                                    <div className="text-center mb-8">
                                        <Badge className="bg-primary/10 text-primary mb-4">VISUAL TOUR</Badge>
                                        <h2 className="text-4xl font-bold text-black">ECOPI GARDEN ALBUM</h2>
                                    </div>

                                    <Tabs defaultValue="all" className="w-full">
                                        <TabsList className="flex justify-center mb-8 flex-wrap">
                                            <TabsTrigger value="all">All</TabsTrigger>
                                            <TabsTrigger value="living">Living Room</TabsTrigger>
                                            <TabsTrigger value="bed">Bed Room</TabsTrigger>
                                            <TabsTrigger value="bath">Bath Room</TabsTrigger>
                                            <TabsTrigger value="basement">Basement</TabsTrigger>
                                            <TabsTrigger value="kitchen">Kitchen</TabsTrigger>
                                            <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="all" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {property.images.map((img, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="relative h-48 rounded-lg overflow-hidden cursor-pointer group"
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`Gallery ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Button size="sm" variant="secondary">View</Button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </TabsContent>

                                        {['living', 'bed', 'bath', 'basement', 'kitchen', 'entertainment'].map((tab) => (
                                            <TabsContent key={tab} value={tab} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {property.images.slice(0, 3).map((img, index) => (
                                                    <motion.div
                                                        key={index}
                                                        className="relative h-48 rounded-lg overflow-hidden cursor-pointer group"
                                                        whileHover={{ scale: 1.05 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <img
                                                            src={img}
                                                            alt={`${tab} ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Button size="sm" variant="secondary">View</Button>
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
                            <Card className="text-center shadow-elegant-lg border-0 items-center mx-auto">
                                <CardContent>
                                    <div className='mt-16 flex flex-col gap-4'>
                                        <h2 className='text-4xl lg:text-5xl font-medium text-white mb-4'>Find In Google Map</h2>
                                        <div className='flex justify-center'>
                                            <MapComponent width='100%' />
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
