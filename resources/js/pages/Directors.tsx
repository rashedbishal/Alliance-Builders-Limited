import { Link } from '@inertiajs/react';
import { Mail, Phone, Linkedin } from 'lucide-react';
import React from 'react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import ScrollAnimation from '@/components/ScrollAnimation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout';
import {directorDetails} from "@/routes";

const directors = [
    {
        id: 1,
        name: "John Anderson",
        position: "Chief Executive Officer",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
        bio: "Leading Alliance Real Estate with over 20 years of industry experience",
        email: "john.anderson@alliance.com",
        phone: "+1 234 567 8901",
        linkedin: "#"
    },
    {
        id: 2,
        name: "Sarah Mitchell",
        position: "Chief Operating Officer",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
        bio: "Driving operational excellence and strategic growth initiatives",
        email: "sarah.mitchell@alliance.com",
        phone: "+1 234 567 8902",
        linkedin: "#"
    },
    {
        id: 3,
        name: "Michael Chen",
        position: "Chief Financial Officer",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        bio: "Expert in financial strategy and investment management",
        email: "michael.chen@alliance.com",
        phone: "+1 234 567 8903",
        linkedin: "#"
    },
    {
        id: 4,
        name: "Emily Rodriguez",
        position: "Director of Sales",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
        bio: "Building relationships and exceeding sales targets consistently",
        email: "emily.rodriguez@alliance.com",
        phone: "+1 234 567 8904",
        linkedin: "#"
    },
    {
        id: 5,
        name: "David Thompson",
        position: "Director of Marketing",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
        bio: "Creative strategist with a passion for brand development",
        email: "david.thompson@alliance.com",
        phone: "+1 234 567 8905",
        linkedin: "#"
    },
    {
        id: 6,
        name: "Jennifer Lee",
        position: "Director of Legal Affairs",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop",
        bio: "Ensuring compliance and protecting company interests",
        email: "jennifer.lee@alliance.com",
        phone: "+1 234 567 8906",
        linkedin: "#"
    }
];

const Directors = () => {
    return (
        <AppLayout>
            <div className="min-h-screen bg-black">
                {/* Hero Section */}
                <section className="relative px-4 pt-36 pb-20">
                    <div className="container mx-auto max-w-7xl">
                        <PageBreadcrumb
                            items={[{ label: 'Directors' }]}
                            className="mb-6"
                        />
                        <ScrollAnimation>
                            <h1 className="mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-center text-5xl font-bold text-white md:text-6xl lg:text-7xl">
                                Our Directors Team
                            </h1>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.2}>
                            <p className="mx-auto max-w-3xl text-center text-xl text-white">
                                Meet the visionary leaders driving Alliance Real Estate towards excellence and innovation
                            </p>
                        </ScrollAnimation>
                    </div>
                </section>

                {/* Directors Grid */}
                <section className="px-4 py-20">
                    <div className="container mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {directors.map((director, index) => (
                                <ScrollAnimation key={director.id} delay={index * 0.1}>
                                    <Link href={directorDetails(director.id)}>
                                        <Card className="group hover:shadow-elegant-lg cursor-pointer overflow-hidden border-border bg-white backdrop-blur-sm transition-all duration-500 hover:-translate-y-2">
                                            <div className="relative h-80 overflow-hidden">
                                                <img
                                                    src={director.image}
                                                    alt={director.name}
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                            </div>
                                            <div className="space-y-4 p-6">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                                                        {director.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm font-semibold text-primary">{director.position}</p>
                                                </div>
                                                <p className="line-clamp-2 text-muted-foreground">{director.bio}</p>
                                                <div className="flex gap-3 pt-4">
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        className="rounded-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                                                    >
                                                        <Mail className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        className="rounded-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                                                    >
                                                        <Phone className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        className="rounded-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                                                    >
                                                        <Linkedin className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                </ScrollAnimation>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default Directors;
