import { router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import golden from "@/assets/images/architecture/golden-building.jpg";
import bgBlack from "@/assets/images/backgrounds/bg-black.jpg";
import PropertyCard from '@/components/PropertyCard';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WritingText } from '@/components/ui/shadcn-io/writing-text';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useFavorites } from '@/hooks/useFavorites';
import AppLayout from '@/layouts/AppLayout';
import type { ProjectThumb } from '@/types/ProjectThumb';
import type { ProjectTypes } from '@/types/ProjectTypes';
// import { route } from 'ziggy-js';

const Properties = () => {
    const { projects } = usePage<{ projects: ProjectThumb[] }>().props;
    const { url } = usePage();
    const { favorites, toggleFavorite, isFavorite } = useFavorites();
    const { projectTypes } = usePage<{ projectTypes: ProjectTypes[] }>().props;

    // Properties.tsx - on mount
    const [locationFilter, setLocationFilter] = useState('');
    const [propertyType, setPropertyType] = useState('all');

    const save = sessionStorage.getItem('propertyFilters');

    console.log('saved data here!!!!!:', save);

    // useEffect(() => {
    //     const saved = sessionStorage.getItem('propertyFilters');
    //     if (saved) {
    //         const filters = JSON.parse(saved);
    //         sessionStorage.removeItem('propertyFilters'); // clear after reading
    //
    //         // Apply location filter
    //         if (filters.location) {
    //             setLocationFilter(filters.location);
    //         }
    //
    //         // Switch tab based on propertyType id
    //         if (filters.propertyType) {
    //             const tabMap: Record<string, string> = {
    //                 '1': 'handover',  // id: 1 → Handover Project
    //                 '2': 'ongoing',   // id: 2 → Ongoing Project
    //                 '3': 'upcoming',  // id: 3 → Upcoming Project
    //                 '4': 'all',       // id: 4 → Hotels & Resorts (no dedicated tab)
    //             };
    //             const targetTab = tabMap[filters.propertyType] ?? 'all';
    //             router.get(
    //                 targetTab === 'all' ? '/properties' : `/${targetTab}`,
    //                 {},
    //                 { preserveState: true, preserveScroll: true, replace: true }
    //             );
    //         }
    //     }
    // }, []);

    useEffect(() => {
        const saved = sessionStorage.getItem('propertyFilters');

        // Not coming from home page search — do nothing
        if (!saved) return;

        sessionStorage.removeItem('propertyFilters'); // clear after reading

        const filters = JSON.parse(saved);
        const { location, propertyType } = filters;

        // Handle location — only filter if provided
        if (location) {
            setLocationFilter(location);
        }

        // Handle propertyType — only switch tab if provided
        if (propertyType) {
            const typeObj = projectTypes.find(
                (t) => t.id.toString() === propertyType,
            );
            const nameToTab: Record<string, string> = {
                'Handover Project': 'handover',
                'Ongoing Project': 'ongoing',
                'Upcoming Project': 'upcoming',
            };
            const targetTab = nameToTab[typeObj?.name ?? ''] ?? 'all';
            router.get(
                targetTab === 'all' ? '/properties' : `/${targetTab}`,
                {},
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }
        // If propertyType is empty → stay on current tab (default 'all')
    }, []);

    const [priceRange, setPriceRange] = useState('all');
    // const [activeTab, setActiveTab] = useState();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    // Handle case where projects is undefined
    const projectList = projects || [];

    const pageUrl = usePage().url;
    //
    const queryParams = new URLSearchParams(pageUrl.split('?')[1] || '');
    // const urlTab = queryParams.get('tab') || 'all';

    const [searchTerm, setSearchTerm] = useState(
        queryParams.get('search') || '',
    );

    const activeTab =
        url === '/properties'
            ? 'all'
            : url === '/upcoming'
              ? 'upcoming'
              : url === '/ongoing'
                ? 'ongoing'
                : url === '/handover'
                  ? 'handover'
                  : url === '/favorites'
                    ? 'favorites'
                    : 'all';

    // Add a handler for tab changes:
    const handleTabChange = (newTab: string) => {
        const tabRoutes: Record<string, string> = {
            all: '/properties',
            upcoming: '/upcoming',
            ongoing: '/ongoing',
            handover: '/handover',
            favorites: '/favorites',
        };
        router.get(
            tabRoutes[newTab] ?? '/properties',
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'For Sale':
                return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            case 'Pre-Launch':
                return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
            case 'Ready to Move':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    // Filter properties based on active tab and search
    const filteredProperties = useMemo(() => {
        let filtered = projectList;

        // Filter by tab (All, Favorites, Upcoming, Ongoing, Handover)
        if (activeTab === 'favorites') {
            filtered = filtered.filter((p) => favorites.includes(p.id));
        } else if (activeTab === 'upcoming') {
            filtered = filtered.filter(
                (p) => (p as any).project_type?.name === 'Upcoming Project',
            );
        } else if (activeTab === 'ongoing') {
            filtered = filtered.filter(
                (p) => (p as any).project_type?.name === 'Ongoing Project',
            );
        } else if (activeTab === 'handover') {
            filtered = filtered.filter(
                (p) => (p as any).project_type?.name === 'Handover Project',
            );
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.address?.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        // Filter by property type (you can extend this based on backend data)
        // if (propertyType && propertyType !== 'all') {
        //     filtered = filtered.filter(
        //         (p) => p.name?.toLowerCase() === propertyType.toLowerCase(),
        //     );
        // }

        // Add location filter
        if (locationFilter && locationFilter !== 'all') {
            filtered = filtered.filter(
                (p) => (p as any).location_id?.toString() === locationFilter,
            );
        }

        return filtered;
    }, [projectList, activeTab, searchTerm, propertyType, favorites, locationFilter]);

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section
                    className="relative flex h-screen w-full items-center justify-center overflow-hidden pt-4"
                    style={{
                        backgroundImage: `url(${bgBlack})`,
                        backgroundAttachment: 'fixed',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <div className="bg-gradient-hero absolute inset-0 opacity-20"></div>
                    <div className="relative z-10 container mx-auto flex h-full w-full flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12">
                        <h1 className="animate-fade-in text-magenta text-white-shadow px-2 text-center text-2xl font-bold sm:px-4 sm:text-3xl md:text-5xl lg:text-7xl">
                            Find Your Dream Property
                        </h1>
                        <p
                            className="animate-fade-in text-blue-shadow mt-4 px-4 text-center text-sm text-white sm:mt-6 sm:px-6 sm:text-base md:px-8 md:text-lg lg:px-12 lg:text-2xl"
                            style={{ animationDelay: '200ms' }}
                        >
                            <WritingText
                                spacing={9}
                                text="Explore the best properties handpicked just for you. Whether you're looking for a luxury villa, a modern apartment, or a cozy house, we have something for everyone."
                            />
                        </p>

                        {/* Search Filters */}
                        <Card
                            className="shadow-elegant-lg animate-scale-in mx-auto mt-8 h-auto w-full max-w-xs sm:mt-10 sm:max-w-md md:mt-12 md:max-w-2xl lg:max-w-5xl"
                            style={{ animationDelay: '400ms' }}
                        >
                            <CardContent className="p-4 sm:p-5 md:p-6">
                                <div className="grid grid-cols-1 gap-3 text-black sm:gap-4 md:grid-cols-2">
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search location or property..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="pl-10 text-sm"
                                        />
                                    </div>
                                    {/*<Select*/}
                                    {/*    value={propertyType}*/}
                                    {/*    onValueChange={setPropertyType}*/}
                                    {/*>*/}
                                    {/*    <SelectTrigger className="text-sm">*/}
                                    {/*        <SelectValue placeholder="Property Type" />*/}
                                    {/*    </SelectTrigger>*/}
                                    {/*    <SelectContent>*/}
                                    {/*        <SelectItem value="all">*/}
                                    {/*            All*/}
                                    {/*        </SelectItem>*/}
                                    {/*        {projectTypes.map((type) => (*/}
                                    {/*            <SelectItem key={type.id} value={type.id.toString()}>*/}
                                    {/*                {type.name}*/}
                                    {/*            </SelectItem>*/}
                                    {/*        ))}*/}
                                    {/*    </SelectContent>*/}
                                    {/*</Select>*/}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Loading or Empty State */}
                {projectList.length === 0 ? (
                    <section className="bg-gradient-to-b from-background to-secondary/20 py-20">
                        <div className="container mx-auto px-4">
                            <div className="py-16 text-center">
                                <p className="text-lg text-white/70">
                                    Loading properties...
                                </p>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section
                        className="bg-gradient-to-b from-background to-secondary/20 py-20"
                        style={{
                            backgroundImage: `url(${golden})`,
                            backgroundAttachment: 'fixed',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        <div className="container mx-auto px-4">
                            <Tabs
                                value={activeTab}
                                onValueChange={handleTabChange}
                                className="w-full"
                            >
                                <div className="mb-12 flex justify-center">
                                    <TabsList className="grid h-auto w-full max-w-4xl grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                                        <TabsTrigger value="all">
                                            All ({projectList.length})
                                        </TabsTrigger>
                                        <TabsTrigger value="upcoming">
                                            Upcoming (
                                            {
                                                projectList.filter(
                                                    (p) =>
                                                        (p as any).project_type
                                                            ?.name ===
                                                        'Upcoming Project',
                                                ).length
                                            }
                                            )
                                        </TabsTrigger>
                                        <TabsTrigger value="ongoing">
                                            Ongoing (
                                            {
                                                projectList.filter(
                                                    (p) =>
                                                        (p as any).project_type
                                                            ?.name ===
                                                        'Ongoing Project',
                                                ).length
                                            }
                                            )
                                        </TabsTrigger>
                                        <TabsTrigger value="handover">
                                            Handover (
                                            {
                                                projectList.filter(
                                                    (p) =>
                                                        (p as any).project_type
                                                            ?.name ===
                                                        'Handover Project',
                                                ).length
                                            }
                                            )
                                        </TabsTrigger>
                                        <TabsTrigger value="favorites">
                                            Favorites ({favorites.length})
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="all" className="space-y-6">
                                    {filteredProperties.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                            {filteredProperties.map(
                                                (property, index) => (
                                                    <PropertyCard
                                                        key={property.id}
                                                        property={property}
                                                        index={index}
                                                        hoveredCard={
                                                            hoveredCard
                                                        }
                                                        setHoveredCard={
                                                            setHoveredCard
                                                        }
                                                        isFavorite={isFavorite(
                                                            property.id,
                                                        )}
                                                        toggleFavorite={() =>
                                                            toggleFavorite(
                                                                property.id,
                                                            )
                                                        }
                                                    />
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-16 text-center">
                                            <p className="text-lg text-white/70">
                                                No properties found matching
                                                your filters.
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent
                                    value="upcoming"
                                    className="space-y-6"
                                >
                                    {filteredProperties.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                            {filteredProperties.map(
                                                (property, index) => (
                                                    <PropertyCard
                                                        key={property.id}
                                                        property={property}
                                                        index={index}
                                                        hoveredCard={
                                                            hoveredCard
                                                        }
                                                        setHoveredCard={
                                                            setHoveredCard
                                                        }
                                                        isFavorite={isFavorite(
                                                            property.id,
                                                        )}
                                                        toggleFavorite={() =>
                                                            toggleFavorite(
                                                                property.id,
                                                            )
                                                        }
                                                    />
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-16 text-center">
                                            <p className="text-lg text-white/70">
                                                No upcoming properties at the
                                                moment.
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent
                                    value="ongoing"
                                    className="space-y-6"
                                >
                                    {filteredProperties.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                            {filteredProperties.map(
                                                (property, index) => (
                                                    <PropertyCard
                                                        key={property.id}
                                                        property={property}
                                                        index={index}
                                                        hoveredCard={
                                                            hoveredCard
                                                        }
                                                        setHoveredCard={
                                                            setHoveredCard
                                                        }
                                                        isFavorite={isFavorite(
                                                            property.id,
                                                        )}
                                                        toggleFavorite={() =>
                                                            toggleFavorite(
                                                                property.id,
                                                            )
                                                        }
                                                    />
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-16 text-center">
                                            <p className="text-lg text-white/70">
                                                No ongoing projects currently
                                                available.
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent
                                    value="handover"
                                    className="space-y-6"
                                >
                                    {filteredProperties.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                            {filteredProperties.map(
                                                (property, index) => (
                                                    <PropertyCard
                                                        key={property.id}
                                                        property={property}
                                                        index={index}
                                                        hoveredCard={
                                                            hoveredCard
                                                        }
                                                        setHoveredCard={
                                                            setHoveredCard
                                                        }
                                                        isFavorite={isFavorite(
                                                            property.id,
                                                        )}
                                                        toggleFavorite={() =>
                                                            toggleFavorite(
                                                                property.id,
                                                            )
                                                        }
                                                    />
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-16 text-center">
                                            <p className="text-lg text-white/70">
                                                No properties ready for
                                                handover.
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent
                                    value="favorites"
                                    className="space-y-6"
                                >
                                    {filteredProperties.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                            {filteredProperties.map(
                                                (property, index) => (
                                                    <PropertyCard
                                                        key={property.id}
                                                        property={property}
                                                        index={index}
                                                        hoveredCard={
                                                            hoveredCard
                                                        }
                                                        setHoveredCard={
                                                            setHoveredCard
                                                        }
                                                        isFavorite={isFavorite(
                                                            property.id,
                                                        )}
                                                        toggleFavorite={() =>
                                                            toggleFavorite(
                                                                property.id,
                                                            )
                                                        }
                                                    />
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-16 text-center">
                                            <p className="text-lg text-white/70">
                                                {favorites.length === 0
                                                    ? 'No favorite properties yet. Add one by clicking the heart icon!'
                                                    : 'No results found in your favorites matching the search.'}
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
};;;;

export default Properties;
