import { router, usePage } from '@inertiajs/react';
import { Search, X, Sparkles, ArrowDown, SearchX, Building2, RotateCcw } from 'lucide-react';
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

const EmptyState = ({
    title = "No Properties Found",
    message,
    showReset = false,
    onReset,
}: {
    title?: string;
    message: string;
    showReset?: boolean;
    onReset?: () => void;
}) => (
    <div className="py-12 flex justify-center">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-slate-900/90 border border-slate-700/90 backdrop-blur-xl shadow-2xl text-center transition-all duration-500">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-amber-400 shadow-inner">
                <SearchX className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-wide">
                {title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
                {message}
            </p>
            {showReset && onReset && (
                <button
                    onClick={onReset}
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all transform hover:scale-105 active:scale-95"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset Search & Filters
                </button>
            )}
        </div>
    </div>
);

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

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const resultsRef = useRef<HTMLDivElement>(null);
    const isFiltered = Boolean(searchTerm.trim() || (locationFilter && locationFilter !== 'all'));
    const isSqueezed = isFiltered || isScrolled;

    const scrollToResults = () => {
        if (resultsRef.current) {
            const yOffset = -90;
            const y = resultsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setLocationFilter('');
    };

    // Below md, tabs wrap onto multiple lines — give each its own border/card so
    // they read as distinct chips instead of floating text. At md+ they collapse
    // back into the seamless single-row pill look.
    const tabTriggerClass =
        'rounded-xl border border-border/60 bg-white/60 py-2.5 shadow-sm transition-all ' +
        'data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-md ' +
        'md:rounded-sm md:border-0 md:bg-transparent md:py-1.5 md:shadow-none ' +
        'md:data-[state=active]:bg-background md:data-[state=active]:text-foreground md:data-[state=active]:shadow-sm';

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                {/* Hero Section - Squeezes dynamically when searching or scrolling down */}
                <section
                    className={`relative flex w-full items-center justify-center overflow-hidden transition-all duration-[1200ms] ease-in-out ${
                        isSqueezed
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
                    <div className="relative z-10 container mx-auto flex h-full w-full flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 transition-all duration-[1200ms] ease-in-out">
                        <h1 className={`animate-fade-in text-magenta text-white-shadow px-2 text-center font-bold transition-all duration-[1200ms] ease-in-out ${
                            isSqueezed ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl md:text-5xl lg:text-7xl'
                        }`}>
                            Find Your Dream Property
                        </h1>
                        
                        <div
                            className={`overflow-hidden transition-all duration-[1200ms] ease-in-out ${
                                isSqueezed
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
                            className={`shadow-2xl bg-slate-900/85 backdrop-blur-xl border border-slate-700/80 text-white rounded-2xl animate-scale-in mx-auto h-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl transition-all duration-[1200ms] ease-in-out ${
                                isSqueezed ? 'mt-6 sm:mt-6' : 'mt-8 sm:mt-10 md:mt-12'
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
                                                onClick={handleResetFilters}
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
                            <div className="py-12 flex justify-center">
                                <div className="w-full max-w-sm p-8 rounded-2xl bg-slate-900/90 border border-slate-700/90 backdrop-blur-xl shadow-2xl text-center">
                                    <Building2 className="h-10 w-10 text-amber-400 mx-auto mb-3 animate-pulse" />
                                    <p className="text-base font-semibold text-white">Loading properties...</p>
                                </div>
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
                                    <TabsList className="grid h-auto w-full max-w-4xl grid-cols-2 gap-2 rounded-2xl border border-border/70 bg-white/80 p-2 shadow-lg backdrop-blur-md sm:grid-cols-3 sm:gap-2.5 sm:p-2.5 md:grid-cols-5 md:gap-0 md:rounded-md md:border-0 md:bg-muted md:p-1 md:shadow-none">
                                        <TabsTrigger value="all" className={tabTriggerClass}>
                                            All ({nonHotelProjects.length})
                                        </TabsTrigger>
                                        <TabsTrigger value="upcoming" className={tabTriggerClass}>
                                            Upcoming (
                                            {nonHotelProjects.filter(
                                                (p) =>
                                                    (p as any).project_type
                                                        ?.name === 'Upcoming',
                                            ).length}
                                            )
                                        </TabsTrigger>
                                        <TabsTrigger value="ongoing" className={tabTriggerClass}>
                                            Ongoing (
                                            {nonHotelProjects.filter(
                                                (p) =>
                                                    (p as any).project_type
                                                        ?.name === 'Ongoing',
                                            ).length}
                                            )
                                        </TabsTrigger>
                                        <TabsTrigger value="handover" className={tabTriggerClass}>
                                            Handover (
                                            {nonHotelProjects.filter(
                                                (p) =>
                                                    (p as any).project_type
                                                        ?.name === 'Handover',
                                            ).length}
                                            )
                                        </TabsTrigger>
                                        <TabsTrigger value="favorites" className={tabTriggerClass}>
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
                                        <EmptyState
                                            title="No Properties Found"
                                            message="We couldn't find any properties matching your current search or filter criteria."
                                            showReset={isFiltered}
                                            onReset={handleResetFilters}
                                        />
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
                                        <EmptyState
                                            title="No Upcoming Projects"
                                            message="There are currently no upcoming projects matching your criteria."
                                            showReset={isFiltered}
                                            onReset={handleResetFilters}
                                        />
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
                                        <EmptyState
                                            title="No Ongoing Projects"
                                            message="There are currently no ongoing projects matching your criteria."
                                            showReset={isFiltered}
                                            onReset={handleResetFilters}
                                        />
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
                                        <EmptyState
                                            title="No Handover Projects"
                                            message="There are currently no handover projects matching your criteria."
                                            showReset={isFiltered}
                                            onReset={handleResetFilters}
                                        />
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
                                        <EmptyState
                                            title={favorites.length === 0 ? "No Saved Favorites" : "No Favorites Found"}
                                            message={
                                                favorites.length === 0
                                                    ? "You haven't saved any favorite properties yet. Click the heart icon on any property card to save it here!"
                                                    : "No properties in your saved favorites match the current search."
                                            }
                                            showReset={isFiltered && favorites.length > 0}
                                            onReset={handleResetFilters}
                                        />
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
