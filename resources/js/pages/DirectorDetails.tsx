import { usePage, Link } from '@inertiajs/react';
import { Mail, Phone, Linkedin, ArrowLeft, Award, Briefcase, GraduationCap } from 'lucide-react';
import React from 'react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import ScrollAnimation from '@/components/ScrollAnimation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout';
import {directors} from "@/routes";

const directorsData = {
    1: {
        name: 'John Anderson',
        position: 'Chief Executive Officer',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=800&fit=crop',
        bio: 'Leading Alliance Real Estate with over 20 years of industry experience',
        email: 'john.anderson@alliance.com',
        phone: '+1 234 567 8901',
        linkedin: '#',
        fullBio:
            "John Anderson brings over two decades of real estate expertise to Alliance Real Estate. His visionary leadership has transformed the company into one of the region's most trusted names in property development and management. Under his guidance, Alliance has completed over 100 major projects valued at more than $2 billion.",
        education: ['MBA in Real Estate Development - Harvard Business School', 'Bachelor of Commerce - University of Toronto'],
        experience: [
            'CEO at Alliance Real Estate (2015 - Present)',
            'Senior VP at Premier Properties (2010 - 2015)',
            'Director of Development at Urban Ventures (2005 - 2010)',
        ],
        achievements: [
            'Real Estate Executive of the Year 2023',
            'Led $500M+ in successful project completions',
            'Featured speaker at International Real Estate Summit',
        ],
    },
    2: {
        name: 'Sarah Mitchell',
        position: 'Chief Operating Officer',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop',
        bio: 'Driving operational excellence and strategic growth initiatives',
        email: 'sarah.mitchell@alliance.com',
        phone: '+1 234 567 8902',
        linkedin: '#',
        fullBio:
            'Sarah Mitchell is a strategic leader with a proven track record in operational excellence. Her innovative approach to process optimization has increased company efficiency by 40% while maintaining the highest quality standards. She oversees all operational aspects of Alliance Real Estate.',
        education: ['Master of Business Administration - Stanford Graduate School', 'Bachelor of Engineering - MIT'],
        experience: [
            'COO at Alliance Real Estate (2018 - Present)',
            'VP of Operations at Metro Development Corp (2013 - 2018)',
            'Operations Manager at BuildRight Inc (2008 - 2013)',
        ],
        achievements: [
            'Operations Excellence Award 2022',
            'Implemented cutting-edge project management systems',
            'Reduced operational costs by 25% while improving quality',
        ],
    },
    3: {
        name: 'Michael Chen',
        position: 'Chief Financial Officer',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop',
        bio: 'Expert in financial strategy and investment management',
        email: 'michael.chen@alliance.com',
        phone: '+1 234 567 8903',
        linkedin: '#',
        fullBio:
            "Michael Chen oversees all financial operations at Alliance Real Estate. His strategic financial planning and risk management expertise have been instrumental in the company's sustained growth and profitability. He has successfully secured over $300M in financing for major developments.",
        education: [
            'CFA Charter - CFA Institute',
            'Master of Finance - London School of Economics',
            'Bachelor of Accounting - University of California, Berkeley',
        ],
        experience: [
            'CFO at Alliance Real Estate (2016 - Present)',
            'Finance Director at Capital Properties (2011 - 2016)',
            'Senior Financial Analyst at Goldman Sachs (2006 - 2011)',
        ],
        achievements: [
            'CFO of the Year - Real Estate Sector 2021',
            'Secured $300M+ in project financing',
            'Maintained 15%+ annual growth in profitability',
        ],
    },
};

const DirectorDetail = () => {
    const { props } = usePage();
    const id = props.id as string | undefined;
    const directorId = id ? parseInt(id) : null;
    const director = directorId ? directorsData[directorId as keyof typeof directorsData] : null;

    if (!director) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <h1 className="mb-4 text-4xl font-bold">Director Not Found</h1>
                    <Link href={directors()}>
                        <Button>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Directors
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
                {/* Back Button */}
                <section className="px-4 pt-32">
                    <div className="container mx-auto max-w-7xl">
                        <PageBreadcrumb
                            items={[
                                { label: 'Directors', href: '/directors' },
                                { label: director.name },
                            ]}
                            variant="light"
                            className="mb-4"
                        />
                        <ScrollAnimation>
                            <Link href="/directors">
                                <Button variant="ghost" className="mb-8 hover:bg-primary/10">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to All Directors
                                </Button>
                            </Link>
                        </ScrollAnimation>
                    </div>
                </section>

                {/* Director Profile */}
                <section className="px-4 pb-20">
                    <div className="container mx-auto max-w-7xl">
                        <div className="grid gap-12 lg:grid-cols-3">
                            {/* Left Column - Image and Contact */}
                            <div className="lg:col-span-1">
                                <ScrollAnimation>
                                    <Card className="shadow-elegant-lg sticky top-32 overflow-hidden border-border bg-card/50 backdrop-blur-sm">
                                        <div className="relative h-96 overflow-hidden">
                                            <img src={director.image} alt={director.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="space-y-6 p-6">
                                            <div>
                                                <h1 className="mb-2 text-3xl font-bold text-foreground">{director.name}</h1>
                                                <p className="font-semibold text-primary">{director.position}</p>
                                            </div>

                                            <div className="space-y-3">
                                                <a
                                                    href={`mailto:${director.email}`}
                                                    className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
                                                >
                                                    <Mail className="h-5 w-5 transition-transform group-hover:scale-110" />
                                                    <span className="text-sm">{director.email}</span>
                                                </a>
                                                <a
                                                    href={`tel:${director.phone}`}
                                                    className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
                                                >
                                                    <Phone className="h-5 w-5 transition-transform group-hover:scale-110" />
                                                    <span className="text-sm">{director.phone}</span>
                                                </a>
                                                <a
                                                    href={director.linkedin}
                                                    className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
                                                >
                                                    <Linkedin className="h-5 w-5 transition-transform group-hover:scale-110" />
                                                    <span className="text-sm">LinkedIn Profile</span>
                                                </a>
                                            </div>

                                            <Button className="w-full bg-gradient-to-r from-primary to-accent transition-opacity hover:opacity-90">
                                                Contact {director.name.split(' ')[0]}
                                            </Button>
                                        </div>
                                    </Card>
                                </ScrollAnimation>
                            </div>

                            {/* Right Column - Details */}
                            <div className="space-y-8 lg:col-span-2">
                                <ScrollAnimation delay={0.2}>
                                    <Card className="shadow-elegant border-border bg-card/50 p-8 backdrop-blur-sm">
                                        <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold">
                                            <Briefcase className="h-6 w-6 text-primary" />
                                            About
                                        </h2>
                                        <p className="text-lg leading-relaxed text-muted-foreground">{director.fullBio}</p>
                                    </Card>
                                </ScrollAnimation>

                                <ScrollAnimation delay={0.3}>
                                    <Card className="shadow-elegant border-border bg-card/50 p-8 backdrop-blur-sm">
                                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
                                            <GraduationCap className="h-6 w-6 text-primary" />
                                            Education
                                        </h2>
                                        <ul className="space-y-4">
                                            {director.education.map((edu, index) => (
                                                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                                                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                                                    <span className="text-lg">{edu}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                </ScrollAnimation>

                                <ScrollAnimation delay={0.4}>
                                    <Card className="shadow-elegant border-border bg-card/50 p-8 backdrop-blur-sm">
                                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
                                            <Briefcase className="h-6 w-6 text-primary" />
                                            Experience
                                        </h2>
                                        <ul className="space-y-4">
                                            {director.experience.map((exp, index) => (
                                                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                                                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                                                    <span className="text-lg">{exp}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                </ScrollAnimation>

                                <ScrollAnimation delay={0.5}>
                                    <Card className="shadow-elegant border-border bg-card/50 p-8 backdrop-blur-sm">
                                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
                                            <Award className="h-6 w-6 text-primary" />
                                            Key Achievements
                                        </h2>
                                        <ul className="space-y-4">
                                            {director.achievements.map((achievement, index) => (
                                                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                                                    <Award className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                                                    <span className="text-lg">{achievement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                </ScrollAnimation>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default DirectorDetail;
