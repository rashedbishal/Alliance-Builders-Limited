import { Home, Building2, TrendingUp, FileText, Search, DollarSign, Users, Shield, ClipboardCheck, Sparkles } from 'lucide-react';
import React from 'react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout';
import ScrollAnimation from '../components/ScrollAnimation';

const Services = () => {
    const mainServices = [
        {
            icon: Home,
            title: 'Residential Sales',
            description:
                'Find your dream home from our extensive portfolio of residential properties. From cozy apartments to luxury estates, we have something for every lifestyle and budget.',
            features: ['Property Matching', 'Virtual Tours', 'Neighborhood Guides', 'Negotiation Support'],
        },
        {
            icon: Building2,
            title: 'Commercial Real Estate',
            description:
                'Discover prime commercial spaces for your business. We specialize in office buildings, retail spaces, and mixed-use developments that drive growth.',
            features: ['Market Analysis', 'Investment Strategy', 'Lease Negotiation', 'Portfolio Management'],
        },
        {
            icon: TrendingUp,
            title: 'Investment Services',
            description:
                'Build wealth through strategic property investments. Our experts help you identify high-potential properties and maximize your returns.',
            features: ['ROI Analysis', 'Market Research', 'Portfolio Diversification', 'Risk Assessment'],
        },
    ];

    const additionalServices = [
        {
            icon: Search,
            title: 'Property Search',
            description: 'Personalized property search based on your specific requirements and preferences.',
        },
        {
            icon: DollarSign,
            title: 'Property Valuation',
            description: 'Accurate market valuations to help you price your property competitively.',
        },
        {
            icon: FileText,
            title: 'Legal Assistance',
            description: 'Expert guidance through contracts, paperwork, and legal requirements.',
        },
        {
            icon: Users,
            title: 'Relocation Services',
            description: 'Comprehensive support for clients moving from different cities or countries.',
        },
        {
            icon: Shield,
            title: 'Property Management',
            description: 'Full-service property management for landlords and investors.',
        },
        {
            icon: ClipboardCheck,
            title: 'Home Staging',
            description: 'Professional staging services to showcase your property at its best.',
        },
    ];

    const process = [
        {
            step: '01',
            title: 'Consultation',
            description: 'We start with understanding your needs, budget, and preferences through an in-depth consultation.',
        },
        {
            step: '02',
            title: 'Property Search',
            description: 'Our team curates a selection of properties that match your criteria and arranges viewings.',
        },
        {
            step: '03',
            title: 'Negotiation',
            description: 'We negotiate the best terms on your behalf, ensuring you get maximum value.',
        },
        {
            step: '04',
            title: 'Closing',
            description: 'We guide you through all paperwork and legal processes for a smooth transaction.',
        },
    ];

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-32 pb-20">
                    <div className="bg-gradient-hero absolute inset-0 opacity-20"></div>
                    <div className="relative z-10 container mx-auto px-4">
                        <PageBreadcrumb
                            items={[{ label: 'Services' }]}
                            variant="light"
                            className="mb-6"
                        />
                        <ScrollAnimation>
                            <Badge className="bg-gradient-accent mb-6 text-accent-foreground">Our Services</Badge>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.1}>
                            <h1 className="text-pink-shadow mb-6 text-5xl font-bold text-primary md:text-7xl">
                                Comprehensive Real
                                <br />
                                Estate Solutions
                            </h1>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.2}>
                            <p className="max-w-3xl text-xl text-muted-foreground">
                                From buying and selling to investment and management, we provide end-to-end real estate services tailored to your
                                needs.
                            </p>
                        </ScrollAnimation>
                    </div>
                </section>

                {/* Main Services */}
                <section className="bg-gradient-to-b from-background to-secondary/20 py-20">
                    <div className="container mx-auto px-4">
                        <div className="space-y-12">
                            {mainServices.map((service, index) => (
                                <ScrollAnimation key={index} delay={index * 0.15}>
                                    <Card className="shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-500">
                                        <CardContent className="p-8 md:p-12">
                                            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
                                                <div className="lg:col-span-2">
                                                    <div className="flex items-start gap-6">
                                                        <div className="bg-gradient-elegant flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl">
                                                            <service.icon className="h-8 w-8 text-primary-foreground" />
                                                        </div>
                                                        <div>
                                                            <h2 className="mb-4 text-3xl font-bold text-primary">{service.title}</h2>
                                                            <p className="mb-6 leading-relaxed text-muted-foreground">{service.description}</p>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                {service.features.map((feature, idx) => (
                                                                    <div key={idx} className="flex items-center gap-2">
                                                                        <Sparkles className="h-4 w-4 text-accent" />
                                                                        <span className="text-sm">{feature}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-center lg:justify-end">
                                                    <Button className="bg-gradient-elegant px-8 py-6 text-lg transition-opacity hover:opacity-90">
                                                        Learn More
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </ScrollAnimation>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Additional Services Grid */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <ScrollAnimation className="mb-16 text-center">
                            <div>
                                <Badge className="bg-gradient-accent mb-6 text-accent-foreground">Additional Services</Badge>
                                <h2 className="mb-6 text-4xl font-bold text-primary md:text-5xl">Everything You Need</h2>
                                <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
                                    We offer a complete suite of services to support your real estate journey from start to finish.
                                </p>
                            </div>
                        </ScrollAnimation>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {additionalServices.map((service, index) => (
                                <ScrollAnimation key={index} delay={index * 0.1}>
                                    <Card className="shadow-elegant hover:shadow-elegant-lg group transition-all duration-500">
                                        <CardContent className="p-8">
                                            <div className="bg-gradient-elegant mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                                                <service.icon className="h-7 w-7 text-primary-foreground" />
                                            </div>
                                            <h3 className="mb-3 text-xl font-bold transition-colors group-hover:text-primary">{service.title}</h3>
                                            <p className="leading-relaxed text-muted-foreground">{service.description}</p>
                                        </CardContent>
                                    </Card>
                                </ScrollAnimation>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Process Section */}
                <section className="bg-gradient-to-b from-secondary/20 to-background py-20">
                    <div className="container mx-auto px-4">
                        <ScrollAnimation className="mb-16 text-center">
                            <div>
                                <Badge className="bg-gradient-accent mb-6 text-accent-foreground">Our Process</Badge>
                                <h2 className="mb-6 text-4xl font-bold text-primary md:text-5xl">How We Work</h2>
                                <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
                                    Our streamlined process ensures a smooth and successful real estate experience.
                                </p>
                            </div>
                        </ScrollAnimation>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {process.map((item, index) => (
                                <ScrollAnimation key={index} delay={index * 0.15}>
                                    <div className="relative">
                                        <Card className="shadow-elegant hover:shadow-elegant-lg h-full transition-all duration-500">
                                            <CardContent className="p-8">
                                                <div className="mb-4 text-6xl font-bold text-primary/20">{item.step}</div>
                                                <h3 className="mb-3 text-2xl font-bold text-primary">{item.title}</h3>
                                                <p className="leading-relaxed text-muted-foreground">{item.description}</p>
                                            </CardContent>
                                        </Card>
                                        {index < process.length - 1 && (
                                            <div className="bg-gradient-elegant absolute top-1/2 -right-4 hidden h-0.5 w-8 lg:block"></div>
                                        )}
                                    </div>
                                </ScrollAnimation>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-hero py-20 text-primary-foreground">
                    <div className="container mx-auto px-4 text-center">
                        <ScrollAnimation>
                            <h2 className="mb-6 text-4xl font-bold md:text-5xl">Ready to Get Started?</h2>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.1}>
                            <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
                                Contact us today and let's discuss how we can help you achieve your real estate goals.
                            </p>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.2}>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <a href="/contact">
                                    <button className="shadow-elegant rounded-lg bg-background px-8 py-4 font-semibold text-foreground transition-transform hover:scale-105">
                                        Schedule Consultation
                                    </button>
                                </a>
                                <a href="/properties">
                                    <button className="rounded-lg border-2 border-primary-foreground bg-transparent px-8 py-4 font-semibold text-primary-foreground transition-all hover:bg-primary-foreground hover:text-primary">
                                        View Properties
                                    </button>
                                </a>
                            </div>
                        </ScrollAnimation>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default Services;
