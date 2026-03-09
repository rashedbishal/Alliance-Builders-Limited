import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import React from 'react';
import ScrollAnimation from '@/components/ScrollAnimation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout';

const Contact = () => {
    const contactInfo = [
        {
            icon: MapPin,
            title: 'Visit Us',
            details: ['123 Estate Avenue', 'Miami Beach, FL 33139'],
        },
        {
            icon: Phone,
            title: 'Call Us',
            details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
        },
        {
            icon: Mail,
            title: 'Email Us',
            details: ['info@estateelite.com', 'support@estateelite.com'],
        },
        {
            icon: Clock,
            title: 'Business Hours',
            details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat - Sun: 10:00 AM - 4:00 PM'],
        },
    ];

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-32 pb-20">
                    <div className="bg-gradient-hero absolute inset-0 opacity-20"></div>
                    <div className="relative z-10 container mx-auto px-4">
                        <ScrollAnimation>
                            <Badge className="bg-gradient-accent mb-6 text-accent-foreground">Contact Us</Badge>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.1}>
                            <h1 className="mb-6 text-5xl font-bold text-primary md:text-7xl">
                                Let's Start a<br />
                                Conversation
                            </h1>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.2}>
                            <p className="max-w-3xl text-xl text-muted-foreground">
                                We're here to help you find your dream property. Reach out to us and let's make it happen together.
                            </p>
                        </ScrollAnimation>
                    </div>
                </section>

                {/* Contact Info Cards */}
                <section className="bg-black py-20">
                    <div className="container mx-auto px-4">
                        <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {contactInfo.map((info, index) => (
                                <ScrollAnimation key={index} delay={index * 0.1}>
                                    <Card className="shadow-elegant hover:shadow-elegant-lg bg-white/80 text-center transition-all duration-500">
                                        <CardContent className="p-8">
                                            <div className="bg-gradient-elegant mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
                                                <info.icon className="h-8 w-8 text-primary-foreground" />
                                            </div>
                                            <h3 className="mb-3 text-xl font-bold text-black/60">{info.title}</h3>
                                            {info.details.map((detail, idx) => (
                                                <p key={idx} className="text-muted-foreground">
                                                    {detail}
                                                </p>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </ScrollAnimation>
                            ))}
                        </div>

                        {/* Contact Form */}
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                            <ScrollAnimation>
                                <Card className="shadow-elegant-lg bg-white/60">
                                    <CardContent className="p-8">
                                        <h2 className="mb-6 text-3xl font-bold text-primary">Send Us a Message</h2>
                                        <form className="space-y-6">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">Full Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded-lg border border-border bg-black/20 px-4 py-3 shadow-inner transition-all outline-none focus:ring-2 focus:ring-primary"
                                                    placeholder="John"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">Email Address</label>
                                                <input
                                                    type="email"
                                                    className="w-full rounded-lg border border-border bg-black/20 px-4 py-3 shadow-inner transition-all outline-none focus:ring-2 focus:ring-primary"
                                                    placeholder="john.doe@example.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    className="w-full rounded-lg border border-border bg-black/20 px-4 py-3 shadow-inner transition-all outline-none focus:ring-2 focus:ring-primary"
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">Message</label>
                                                <textarea
                                                    rows={10}
                                                    className="w-full resize-none rounded-lg border border-border bg-black/20 px-4 py-3 shadow-inner transition-all outline-none focus:ring-2 focus:ring-primary"
                                                    placeholder="Tell us more about what you're looking for..."
                                                ></textarea>
                                            </div>
                                            <Button className="bg-gradient-elegant w-full py-6 text-lg transition-opacity hover:opacity-90">
                                                <Send className="mr-2 h-5 w-5" />
                                                Send Message
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </ScrollAnimation>

                            <div className="space-y-8">
                                <ScrollAnimation delay={0.2}>
                                    <Card className="shadow-elegant-lg overflow-hidden">
                                        <div className="flex h-[400px] items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                                            <div className="p-8 text-center">
                                                <MapPin className="mx-auto mb-4 h-16 w-16 text-primary" />
                                                <h3 className="mb-2 text-2xl font-bold">Visit Our Office</h3>
                                                <p className="text-muted-foreground">
                                                    123 Estate Avenue
                                                    <br />
                                                    Miami Beach, FL 33139
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </ScrollAnimation>
                                <ScrollAnimation delay={0.3}>
                                    <Card className="shadow-elegant-lg">
                                        <CardContent className="p-8">
                                            <h3 className="mb-4 text-2xl font-bold text-primary">Why Choose Us?</h3>
                                            <ul className="space-y-4">
                                                <li className="flex items-start gap-3">
                                                    <div className="bg-gradient-elegant mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                                                        <span className="text-sm text-primary-foreground">✓</span>
                                                    </div>
                                                    <div>
                                                        <strong className="mb-1 block">Quick Response</strong>
                                                        <span className="text-muted-foreground">We respond to all inquiries within 24 hours</span>
                                                    </div>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <div className="bg-gradient-elegant mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                                                        <span className="text-sm text-primary-foreground">✓</span>
                                                    </div>
                                                    <div>
                                                        <strong className="mb-1 block">Expert Guidance</strong>
                                                        <span className="text-muted-foreground">Professional advice from experienced agents</span>
                                                    </div>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <div className="bg-gradient-elegant mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                                                        <span className="text-sm text-primary-foreground">✓</span>
                                                    </div>
                                                    <div>
                                                        <strong className="mb-1 block">Personalized Service</strong>
                                                        <span className="text-muted-foreground">Tailored solutions for your unique needs</span>
                                                    </div>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <div className="bg-gradient-elegant mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                                                        <span className="text-sm text-primary-foreground">✓</span>
                                                    </div>
                                                    <div>
                                                        <strong className="mb-1 block">Transparent Process</strong>
                                                        <span className="text-muted-foreground">No hidden fees or surprises along the way</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </CardContent>
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

export default Contact;
