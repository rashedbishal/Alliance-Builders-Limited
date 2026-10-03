import { router, usePage } from '@inertiajs/react';
import {Search, MapPin, Home, Calendar} from "lucide-react";
import React, {useState} from 'react';
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import CustomSelect from '@/components/ui/CustomSelect';
import type {Location} from "@/types/Location";
import type {ProjectTypes} from "@/types/ProjectTypes";
import type {Tag} from "@/types/Tag";

import ScrollAnimation from '../ScrollAnimation';

const SearchSection = () => {
    const [searchFilters, setSearchFilters] = useState({
        location: '',
        propertyType: '',
        // status: ''
    });

    const {locations = []} = usePage<{locations: Location[]}>().props;
    const {projectTypes = []} = usePage<{projectTypes: ProjectTypes[]}>().props;

    const locationOptions = locations.map((location) => ({
        value: location.id.toString(),
        label: location.name,
    }));

    const propertyTypeOptions = projectTypes.map((type) => ({
        value: type.id.toString(),
        label: type.name,
    }));

    const handleSearch = () => {
        console.log('Search filters:', searchFilters);
        sessionStorage.setItem('propertyFilters', JSON.stringify({
            location: searchFilters.location,
            propertyType: searchFilters.propertyType,
        }));
        router.visit('/properties');
    };

    return (
        <section className="relative overflow-hidden bg-black py-16 pb-20 sm:py-20">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full animate-float"></div>
                <div className="absolute bottom-20 right-20 w-24 h-24 bg-accent rounded-full animate-float"
                     style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-primary-light rounded-full animate-float"
                     style={{animationDelay: '2s'}}></div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <ScrollAnimation>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl lg:text-5xl font-medium text-white mb-4 ">
                            Find Your Perfect Property
                        </h2>
                        <p className="text-lg text-white max-w-2xl mx-auto">
                            Search through our extensive portfolio of premium properties with advanced filtering options
                        </p>
                    </div>
                </ScrollAnimation>

                <ScrollAnimation delay={0.2}>
                    <Card className="max-w-6xl mx-auto shadow-elegant-xl bg-[rgba(255,255,255,0.1)] ">
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-white">
                                        <MapPin className="h-4 w-4 mr-2 text-white"/>
                                        Location
                                    </label>
                                    <CustomSelect
                                        value={searchFilters.location}
                                        onValueChange={(val) => setSearchFilters(prev => ({ ...prev, location: val }))}
                                        placeholder="Select location"
                                        options={locationOptions}
                                        triggerClassName="bg-[rgba(255,255,255,0.3)] border-border hover:border-accent transition-colors duration-300"
                                        contentClassName="bg-[rgba(30,30,30,0.9)] backdrop-blur-md border border-white/20 shadow-elegant"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-white">
                                        <Home className="h-4 w-4 mr-2 text-white"/>
                                        Property Type
                                    </label>
                                    <CustomSelect
                                        value={searchFilters.propertyType}
                                        onValueChange={(val) => setSearchFilters(prev => ({ ...prev, propertyType: val }))}
                                        placeholder="Select type"
                                        options={propertyTypeOptions}
                                        triggerClassName="bg-[rgba(255,255,255,0.3)] border-border hover:border-accent transition-colors duration-300"
                                        contentClassName="bg-[rgba(30,30,30,0.9)] backdrop-blur-md border border-white/20 shadow-elegant"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    onClick={handleSearch}
                                    size="lg"
                                    className="gap-0 bg-gradient-primary text-primary-foreground hover:bg-primary-dark shadow-elegant px-4 py-3 text-lg font-medium transform hover:scale-105 transition-all duration-300"
                                >
                                    <Search className="h-5 w-5 mr-2"/>
                                    Search Properties
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </ScrollAnimation>

                {/* Quick Stats */}
                <ScrollAnimation delay={0.4}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-2">124+</div>
                            <div className="text-sm text-white">Properties Listed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-2">25+</div>
                            <div className="text-sm text-white">Prime Locations</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-2">3500+</div>
                            <div className="text-sm text-white">Happy Clients</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-2">17+</div>
                            <div className="text-sm text-white">Years Experience</div>
                        </div>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
};

export default SearchSection;
