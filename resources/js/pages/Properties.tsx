import { router, usePage } from '@inertiajs/react';
import { Search, X, Sparkles, ArrowDown } from 'lucide-react';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import golden from "@/assets/images/architecture/golden-building.jpg";
import bgBlack from "@/assets/images/backgrounds/bg-black.jpg";
import PropertyCard from '@/components/PropertyCard';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WritingText } from '@/components/ui/shadcn-io/writing-text';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useFavorites } from '@/hooks/useFavorites';
import AppLayout from '@/layouts/AppLayout';
import type { ProjectThumb } from '@/types/ProjectThumb';
import type { ProjectTypes } from '@/types/ProjectTypes';

const Properties = () => {
    const { projects } = usePage<{ projects: ProjectThumb[] }>().props;
    const { url } = usePage();
    const { favorites, toggleFavorite, isFavorite } = useFavorites();
    const { projectTypes } = usePage<{ projectTypes: ProjectTypes[] }>().props;

    // Properties.tsx - on mount
    const [locationFilter, setLocationFilter] = useState('');
    const [propertyType, setPropertyType] = useState('');

    const save = sessionStorage.getItem('propertyFilters');

    // console.log('projects', projects);
    // console.log('saved data here!!!!!:', save);

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
                'Handover': 'handover',
                'Ongoing': 'ongoing',
                'Upcoming': 'upcoming',
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

    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    // Handle case where projects is undefined
    const projectList = projects || [];

    const isHotelProject = (project: ProjectThumb) => {
        const typeId =
            (project as any).project_type_id ??
            (project as any).projectType?.id ??
            null;

        return typeId === 4;
    };

    const nonHotelProjects = projectList.filter(
        (project) => !isHotelProject(project),
    );

    const pageUrl = usePage().url;

    //
    const queryParams = new URLSearchParams(pageUrl.split('?')[1] || '');

    const [searchTerm, setSearchTerm] = useState(
        queryParams.get('search') || '',
    );

    // Check for tab query parameter
    const currentUrl = new URL(url, window.location.origin);
    const tabParam = currentUrl.searchParams.get('tab');

    const activeTab =
        tabParam === 'favorites'
            ? 'favorites'
            : url === '/properties'
              ? 'all'
              : url === '/upcoming'
                ? 'upcoming'
                : url === '/ongoing'
                  ? 'ongoing'
                  : url === '/handover'
                    ? 'handover'
                    : 'all';

    // Add a handler for tab changes:
    const handleTabChange = (newTab: string) => {
        if (newTab === 'favorites') {
            // Stay on properties page with tab parameter
            router.get(
                '/properties?tab=favorites',
                {},
                { preserveState: true, preserveScroll: true, replace: true },
            );
            return;
        }

        const tabRoutes: Record<string, string> = {
            all: '/properties',
            upcoming: '/upcoming',
            ongoing: '/ongoing',
            handover: '/handover',
        };
        router.get(
            tabRoutes[newTab] ?? '/properties',
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    // Filter properties based on active tab and search
    const filteredProperties = useMemo(() => {
        let filtered = nonHotelProjects;

        // Filter by tab (All, Favorites, Upcoming, Ongoing, Handover)
        if (activeTab === 'favorites') {
            filtered = filtered.filter((p) => favorites.includes(p.id));
        } else if (activeTab === 'upcoming') {
            filtered = filtered.filter(
                (p) => (p as any).project_type?.name === 'Upcoming',
            );
        } else if (activeTab === 'ongoing') {
            filtered = filtered.filter(
                (p) => (p as any).project_type?.name === 'Ongoing',
            );
        } else if (activeTab === 'handover') {
            filtered = filtered.filter(
                (p) => (p as any).project_type?.name === 'Handover',
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

        // Add location filter
        if (locationFilter && locationFilter !== 'all') {
            filtered = filtered.filter(
                (p) => (p as any).location_id?.toString() === locationFilter,
            );
        }

        return filtered;
    }, [nonHotelProjects, activeTab, searchTerm, favorites, locationFilter]);

    const resultsRef = useRef<HTMLDivElement>(null);
    const isFiltered = Boolean(searchTerm.trim() || (locationFilter && locationFilter !== 'all'));

    const scrollToResults = () => {
        if (resultsRef.current) {
            const yOffset = -90;
            const y = resultsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                {/* Hero Section - Squeezes dynamically when searching */}
                <section
                    className={`relative flex w-full items-center justify-center overflow-hidden transition-all duration-[1500ms] delay-500 ease-in-out ${
                        isFiltered
                            ? 'min-h-[42vh] pt-28 pb-10'
                            : 'min-h-screen pt-16 pb-16'
                    }`}
                    style={{
                        backgroundImage: `url(${bgBlack})`,
                        backgroundAttachment: 'fixed',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <div className="bg-gradient-hero absolute inset-0 opacity-20"></div>
                    <div className="relative z-10 container mx-auto flex h-full w-full flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 transition-all duration-[1500ms] delay-500 ease-in-out">
                        <h1 className={`animate-fade-in text-magenta text-white-shadow px-2 text-center font-bold transition-all duration-[1500ms] delay-500 ease-in-out ${
                            isFiltered ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl md:text-5xl lg:text-7xl'
                        }`}>
                            Find Your Dream Property
                        </h1>
                        
                        <div
                            className={`overflow-hidden transition-all duration-[1500ms] delay-500 ease-in-out ${
                                isFiltered
                                    ? 'max-h-0 opacity-0 scale-95 mt-0 pointer-events-none'
                                    : 'max-h-48 opacity-100 scale-100 mt-4 sm:mt-6'
                            }`}
                        >
                            <p className="animate-fade-in text-blue-shadow px-4 text-center text-sm text-white sm:px-6 sm:text-base md:px-8 md:text-lg lg:px-12 lg:text-2xl">
                                <WritingText
                                    spacing={9}
                                    text="Explore the best properties handpicked just for you. Whether you're looking for a luxury villa, a modern apartment, or a cozy house, we have something for everyone."
                                />
                            </p>
                        </div>

                        {/* Search Filters Card */}
                        <Card
                            className={`shadow-2xl bg-slate-900/85 backdrop-blur-xl border border-slate-700/80 text-white rounded-2xl animate-scale-in mx-auto h-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl transition-all duration-[1500ms] delay-500 ease-in-out ${
                                isFiltered ? 'mt-6 sm:mt-6' : 'mt-8 sm:mt-10 md:mt-12'
                            }`}
                            style={{ animationDelay: '400ms' }}
                        >
                            <CardContent className="p-3.5 sm:p-4">
                                <div className="grid grid-cols-1 gap-3 text-slate-900">
                                    <div className="relative flex items-center">
                                        <Search className="absolute left-3.5 h-5 w-5 text-slate-500 pointer-events-none" />
                                        <Input
                                            placeholder="Search location or property..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="pl-10 pr-10 text-sm h-11 bg-white border-white text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/40 rounded-xl font-medium shadow-inner"
                                        />
                                        {searchTerm && (
                                            <button
                                                onClick={() => setSearchTerm('')}
                                                className="absolute right-3 p-1 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-200 transition-colors"
                                                title="Clear search"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Live Search Results Badge & Quick Actions */}
                                <div
                                    className={`overflow-hidden transition-all duration-[1500ms] delay-500 ease-in-out ${
                                        isFiltered
                                            ? 'max-h-20 opacity-100 mt-3.5 pt-3 border-t border-slate-700/80 pointer-events-auto'
                                            : 'max-h-0 opacity-0 mt-0 pt-0 border-t-0 pointer-events-none'
                                    }`}
                                >
                                    <div className="flex items-center justify-between text-xs sm:text-sm text-slate-200">
                                        <span className="flex items-center gap-1.5 font-semibold text-slate-100">
                                            <Sparkles className="h-4 w-4 text-amber-400" />
                                            Found {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={scrollToResults}
                                                className="inline-flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                <span>View Results</span>
                                                <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    setLocationFilter('');
                                                }}
                                                className="font-medium text-slate-400 hover:text-red-400 transition-colors pl-2 border-l border-slate-700"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
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
                        ref={resultsRef}
                        className="bg-gradient-to-b from-background to-secondary/20 py-16 lg:py-20"
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
                                            All ({nonHotelProjects.length})
                                        </TabsTrigger>
                                        <TabsTrigger value="upcoming">
                                            Upcoming (
                                            {nonHotelProjects.filter(
                                                (p) =>
                                                    (p as any).project_type
                                                        ?.name === 'Upcoming',
                                            ).length}
                                            )
                                        </TabsTrigger>
                                        <TabsTrigger value="ongoing">
                                            Ongoing (
                                            {nonHotelProjects.filter(
                                                (p) =>
                                                    (p as any).project_type
                                                        ?.name === 'Ongoing',
                                            ).length}
                                            )
                                        </TabsTrigger>
                                        <TabsTrigger value="handover">
                                            Handover (
                                            {nonHotelProjects.filter(
                                                (p) =>
                                                    (p as any).project_type
                                                        ?.name === 'Handover',
                                            ).length}
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
                                            <p className="text-2xl text-primary/70">
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
};

export default Properties;
