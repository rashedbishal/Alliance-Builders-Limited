import React, { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from 'lucide-react';

import { WritingText } from '@/components/ui/shadcn-io/writing-text';

import ScrollAnimation from '@/components/ScrollAnimation';
import PropertyCard from '@/components/PropertyCard';

import bgBlack from "@/assets/images/backgrounds/bg-black.jpg";
import golden from "@/assets/images/architecture/golden-building.jpg";

import building from '@/assets/images/architecture/buildings.jpg';
import AppLayout from '@/layouts/AppLayout';
import {propertyDetails} from "@/routes";
import { usePage } from '@inertiajs/react';
import { ProjectThumb } from '@/types/ProjectThumb';
import { useFavorites } from '@/hooks/useFavorites';

const Properties = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [propertyType, setPropertyType] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [activeTab, setActiveTab] = useState('all');
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const { projects } = usePage<{ projects: ProjectThumb[] }>().props;
    const { favorites, toggleFavorite, isFavorite } = useFavorites();

    // Handle case where projects is undefined
    const projectList = projects || [];

    

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'For Sale': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            case 'Pre-Launch': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
            case 'Ready to Move': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    // Filter properties based on active tab and search
    const filteredProperties = useMemo(() => {
        let filtered = projectList;

        // Filter by tab (All, Favorites, Upcoming, Running, Handover)
        if (activeTab === 'favorites') {
            filtered = filtered.filter(p => favorites.includes(p.id));
        } else if (activeTab === 'upcoming') {
            filtered = filtered.filter(p => (p as any).project_type?.name === 'Upcoming Project');
        } else if (activeTab === 'running') {
            filtered = filtered.filter(p => (p as any).project_type?.name === 'Ongoing Project');
        } else if (activeTab === 'handover') {
            filtered = filtered.filter(p => (p as any).project_type?.name === 'Handover Project');
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.location?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by property type (you can extend this based on backend data)
        if (propertyType !== 'all') {
            filtered = filtered.filter(p => p.name?.toLowerCase() === propertyType.toLowerCase());
        }

        return filtered;
    }, [projectList, activeTab, searchTerm, propertyType, favorites]);

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="pt-4 w-full h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundImage: `url(${bgBlack})`, backgroundAttachment: 'fixed', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} >
                    <div className="absolute inset-0 bg-gradient-hero opacity-20"></div>
                    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 w-full flex flex-col h-full justify-center items-center">
                        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold text-center animate-fade-in text-magenta text-white-shadow px-2 sm:px-4">
                            Find Your Dream Property
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg lg:text-2xl text-center text-white animate-fade-in text-blue-shadow mt-4 sm:mt-6 px-4 sm:px-6 md:px-8 lg:px-12" style={{ animationDelay: '200ms' }}>
                            <WritingText
                                spacing={9}
                                text="Explore the best properties handpicked just for you. Whether you're looking for a luxury villa, a modern apartment, or a cozy house, we have something for everyone."
                            />
                        </p>

                        {/* Search Filters */}
                        <Card className="h-auto w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-5xl mx-auto shadow-elegant-lg animate-scale-in mt-8 sm:mt-10 md:mt-12" style={{ animationDelay: '400ms' }}>
                            <CardContent className="p-4 sm:p-5 md:p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 text-black">
                                    <div className="md:col-span-2 relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            placeholder="Search location or property..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 text-sm"
                                        />
                                    </div>
                                    <Select value={propertyType} onValueChange={setPropertyType} >
                                        <SelectTrigger className="text-sm">
                                            <SelectValue placeholder="Property Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="villa">Villa</SelectItem>
                                            <SelectItem value="apartment">Apartment</SelectItem>
                                            <SelectItem value="house">House</SelectItem>
                                            <SelectItem value="penthouse">Penthouse</SelectItem>
                                            <SelectItem value="loft">Loft</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={priceRange} onValueChange={setPriceRange}>
                                        <SelectTrigger className="text-sm">
                                            <SelectValue placeholder="Price Range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Prices</SelectItem>
                                            <SelectItem value="under1m">Under $1M</SelectItem>
                                            <SelectItem value="1m-2m">$1M - $2M</SelectItem>
                                            <SelectItem value="2m-5m">$2M - $5M</SelectItem>
                                            <SelectItem value="over5m">Over $5M</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Loading or Empty State */}
                {projectList.length === 0 ? (
                    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
                        <div className="container mx-auto px-4">
                            <div className="text-center py-16">
                                <p className="text-white/70 text-lg">Loading properties...</p>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="py-20 bg-gradient-to-b from-background to-secondary/20" style={{ backgroundImage: `url(${golden})`, backgroundAttachment: 'fixed', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} >
                        <div className="container mx-auto px-4">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <div className="flex justify-center mb-12">
                                    <TabsList className="grid w-full max-w-4xl grid-cols-5">
                                        <TabsTrigger value="all">All ({projectList.length})</TabsTrigger>
                                        <TabsTrigger value="upcoming">Upcoming ({projectList.filter(p => (p as any).project_type?.name === 'Upcoming Project').length})</TabsTrigger>
                                        <TabsTrigger value="running">Running ({projectList.filter(p => (p as any).project_type?.name === 'Ongoing Project').length})</TabsTrigger>
                                        <TabsTrigger value="handover">Handover ({projectList.filter(p => (p as any).project_type?.name === 'Handover Project').length})</TabsTrigger>
                                        <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="all" className="space-y-6">
                                    {filteredProperties.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {filteredProperties.map((property, index) => (
                                                <PropertyCard
                                                    key={property.id}
                                                    property={property}
                                                    index={index}
                                                    hoveredCard={hoveredCard}
                                                    setHoveredCard={setHoveredCard}
                                                    isFavorite={isFavorite(property.id)}
                                                    toggleFavorite={() => toggleFavorite(property.id)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16">
                                            <p className="text-white/70 text-lg">No properties found matching your filters.</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="upcoming" className="space-y-6">
                                    {filteredProperties.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {filteredProperties.map((property, index) => (
                                                <PropertyCard
                                                    key={property.id}
                                                    property={property}
                                                    index={index}
                                                    hoveredCard={hoveredCard}
                                                    setHoveredCard={setHoveredCard}
                                                    isFavorite={isFavorite(property.id)}
                                                    toggleFavorite={() => toggleFavorite(property.id)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16">
                                            <p className="text-white/70 text-lg">No upcoming properties at the moment.</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="running" className="space-y-6">
                                    {filteredProperties.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {filteredProperties.map((property, index) => (
                                                <PropertyCard
                                                    key={property.id}
                                                    property={property}
                                                    index={index}
                                                    hoveredCard={hoveredCard}
                                                    setHoveredCard={setHoveredCard}
                                                    isFavorite={isFavorite(property.id)}
                                                    toggleFavorite={() => toggleFavorite(property.id)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16">
                                            <p className="text-white/70 text-lg">No running projects currently available.</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="handover" className="space-y-6">
                                    {filteredProperties.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {filteredProperties.map((property, index) => (
                                                <PropertyCard
                                                    key={property.id}
                                                    property={property}
                                                    index={index}
                                                    hoveredCard={hoveredCard}
                                                    setHoveredCard={setHoveredCard}
                                                    isFavorite={isFavorite(property.id)}
                                                    toggleFavorite={() => toggleFavorite(property.id)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16">
                                            <p className="text-white/70 text-lg">No properties ready for handover.</p>
                                        </div>
                                    )}
                                </TabsContent>


                                <TabsContent value="favorites" className="space-y-6">
                                    {filteredProperties.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {filteredProperties.map((property, index) => (
                                                <PropertyCard
                                                    key={property.id}
                                                    property={property}
                                                    index={index}
                                                    hoveredCard={hoveredCard}
                                                    setHoveredCard={setHoveredCard}
                                                    isFavorite={isFavorite(property.id)}
                                                    toggleFavorite={() => toggleFavorite(property.id)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16">
                                            <p className="text-white/70 text-lg">
                                                {favorites.length === 0
                                                    ? "No favorite properties yet. Add one by clicking the heart icon!"
                                                    : "No results found in your favorites matching the search."}
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </section>
                )}
            </div>
        </AppLayout>
    );
};

export default Properties;
