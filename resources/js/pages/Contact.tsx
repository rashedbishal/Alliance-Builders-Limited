import { useForm } from '@inertiajs/react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, X } from 'lucide-react';
import React, { useState } from 'react';
import { route } from 'ziggy-js';
import ScrollAnimation from '@/components/ScrollAnimation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout';

const Contact = () => {
    const [showSuccess, setShowSuccess] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

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
            details: [
                'Mon - Fri: 9:00 AM - 6:00 PM',
                'Sat - Sun: 10:00 AM - 4:00 PM',
            ],
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('contact.store'), {
            onSuccess: () => {
                reset();
                setShowSuccess(true);
            },
        });
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                {/* ── Success Popup ── */}
                {showSuccess && (
                    <>
                        {/* Backdrop */}
                        <div
                            onClick={() => setShowSuccess(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(0,0,0,0.65)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 1000,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '20px',
                            }}
                        >
                            {/* Modal */}
                            <div
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    background:
                                        'linear-gradient(135deg, #0F1117 0%, #161B26 100%)',
                                    border: '1px solid rgba(201,168,76,0.3)',
                                    borderRadius: 20,
                                    padding: '48px 40px',
                                    maxWidth: 460,
                                    width: '100%',
                                    textAlign: 'center',
                                    position: 'relative',
                                    boxShadow:
                                        '0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(201,168,76,0.08)',
                                    animation:
                                        'popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    fontFamily: "'DM Sans', sans-serif",
                                }}
                            >
                                <style>{`
                                    @keyframes popIn {
                                        from { opacity: 0; transform: scale(0.85) translateY(20px); }
                                        to   { opacity: 1; transform: scale(1)    translateY(0);    }
                                    }
                                    @keyframes pulse-ring {
                                        0%   { transform: scale(0.9); opacity: 0.8; }
                                        50%  { transform: scale(1.1); opacity: 0.4; }
                                        100% { transform: scale(0.9); opacity: 0.8; }
                                    }
                                `}</style>

                                {/* Close button */}
                                <button
                                    onClick={() => setShowSuccess(false)}
                                    style={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 16,
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '50%',
                                        width: 32,
                                        height: 32,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: '#7A839A',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                        (
                                            e.currentTarget as HTMLButtonElement
                                        ).style.background =
                                            'rgba(255,255,255,0.1)';
                                        (
                                            e.currentTarget as HTMLButtonElement
                                        ).style.color = '#E8EAF0';
                                    }}
                                    onMouseLeave={(e) => {
                                        (
                                            e.currentTarget as HTMLButtonElement
                                        ).style.background =
                                            'rgba(255,255,255,0.05)';
                                        (
                                            e.currentTarget as HTMLButtonElement
                                        ).style.color = '#7A839A';
                                    }}
                                >
                                    <X size={16} />
                                </button>

                                {/* Icon */}
                                <div
                                    style={{
                                        position: 'relative',
                                        display: 'inline-block',
                                        marginBottom: 24,
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: -10,
                                            borderRadius: '50%',
                                            background: 'rgba(201,168,76,0.15)',
                                            animation:
                                                'pulse-ring 2s ease-in-out infinite',
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: 72,
                                            height: 72,
                                            borderRadius: '50%',
                                            background:
                                                'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(201,168,76,0.1))',
                                            border: '2px solid rgba(201,168,76,0.5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                        }}
                                    >
                                        <CheckCircle
                                            size={36}
                                            color="#C9A84C"
                                            strokeWidth={1.8}
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <h2
                                    style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: '1.6rem',
                                        color: '#E8EAF0',
                                        marginBottom: 12,
                                        lineHeight: 1.3,
                                    }}
                                >
                                    Message Sent!
                                </h2>
                                <p
                                    style={{
                                        color: '#7A839A',
                                        fontSize: '0.92rem',
                                        lineHeight: 1.7,
                                        marginBottom: 8,
                                    }}
                                >
                                    Thank you for reaching out to us. We've
                                    received your message and will get back to
                                    you within{' '}
                                    <strong style={{ color: '#C9A84C' }}>
                                        24 hours
                                    </strong>
                                    .
                                </p>
                                <p
                                    style={{
                                        color: '#7A839A',
                                        fontSize: '0.85rem',
                                        marginBottom: 32,
                                    }}
                                >
                                    We look forward to connecting with you!
                                </p>

                                {/* Divider */}
                                <div
                                    style={{
                                        width: '100%',
                                        height: 1,
                                        background:
                                            'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)',
                                        marginBottom: 28,
                                    }}
                                />

                                <button
                                    onClick={() => setShowSuccess(false)}
                                    style={{
                                        padding: '12px 40px',
                                        background:
                                            'linear-gradient(135deg, #C9A84C, #A8782A)',
                                        border: 'none',
                                        borderRadius: 10,
                                        color: '#0F1117',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        fontFamily: "'DM Sans', sans-serif",
                                        letterSpacing: '0.03em',
                                        transition: 'all 0.2s',
                                        boxShadow:
                                            '0 6px 20px rgba(201,168,76,0.25)',
                                    }}
                                    onMouseEnter={(e) => {
                                        (
                                            e.currentTarget as HTMLButtonElement
                                        ).style.transform = 'translateY(-2px)';
                                        (
                                            e.currentTarget as HTMLButtonElement
                                        ).style.boxShadow =
                                            '0 10px 28px rgba(201,168,76,0.35)';
                                    }}
                                    onMouseLeave={(e) => {
                                        (
                                            e.currentTarget as HTMLButtonElement
                                        ).style.transform = 'translateY(0)';
                                        (
                                            e.currentTarget as HTMLButtonElement
                                        ).style.boxShadow =
                                            '0 6px 20px rgba(201,168,76,0.25)';
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-32 pb-20">
                    <div className="bg-gradient-hero absolute inset-0 opacity-20"></div>
                    <div className="relative z-10 container mx-auto px-4">
                        <ScrollAnimation>
                            <Badge className="bg-gradient-accent mb-6 text-accent-foreground">
                                Contact Us
                            </Badge>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.1}>
                            <h1 className="mb-6 text-5xl font-bold text-primary md:text-7xl">
                                Let's Start a<br />
                                Conversation
                            </h1>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.2}>
                            <p className="max-w-3xl text-xl text-muted-foreground">
                                We're here to help you find your dream property.
                                Reach out to us and let's make it happen
                                together.
                            </p>
                        </ScrollAnimation>
                    </div>
                </section>

                {/* Contact Info Cards */}
                <section className="bg-black py-20">
                    <div className="container mx-auto px-4">
                        <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {contactInfo.map((info, index) => (
                                <ScrollAnimation
                                    key={index}
                                    delay={index * 0.1}
                                >
                                    <Card className="shadow-elegant hover:shadow-elegant-lg bg-white/80 text-center transition-all duration-500">
                                        <CardContent className="p-8">
                                            <div className="bg-gradient-elegant mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
                                                <info.icon className="h-8 w-8 text-primary-foreground" />
                                            </div>
                                            <h3 className="mb-3 text-xl font-bold text-black/60">
                                                {info.title}
                                            </h3>
                                            {info.details.map((detail, idx) => (
                                                <p
                                                    key={idx}
                                                    className="text-muted-foreground"
                                                >
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
                                        <h2 className="mb-6 text-3xl font-bold text-primary">
                                            Send Us a Message
                                        </h2>
                                        <form
                                            className="space-y-6"
                                            onSubmit={handleSubmit}
                                        >
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-lg border border-border bg-black/20 px-4 py-3 shadow-inner transition-all outline-none focus:ring-2 focus:ring-primary"
                                                    placeholder="John"
                                                    required
                                                />
                                                {errors.name && (
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData(
                                                            'email',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-lg border border-border bg-black/20 px-4 py-3 shadow-inner transition-all outline-none focus:ring-2 focus:ring-primary"
                                                    placeholder="john.doe@example.com"
                                                    required
                                                />
                                                {errors.email && (
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={data.phone}
                                                    onChange={(e) =>
                                                        setData(
                                                            'phone',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-lg border border-border bg-black/20 px-4 py-3 shadow-inner transition-all outline-none focus:ring-2 focus:ring-primary"
                                                    placeholder="+1 (555) 000-0000"
                                                    required
                                                />
                                                {errors.phone && (
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {errors.phone}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">
                                                    Message
                                                </label>
                                                <textarea
                                                    rows={10}
                                                    value={data.message}
                                                    onChange={(e) =>
                                                        setData(
                                                            'message',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full resize-none rounded-lg border border-border bg-black/20 px-4 py-3 shadow-inner transition-all outline-none focus:ring-2 focus:ring-primary"
                                                    placeholder="Tell us more about what you're looking for..."
                                                    required
                                                ></textarea>
                                                {errors.message && (
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {errors.message}
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="bg-gradient-elegant w-full py-6 text-lg transition-opacity hover:opacity-90"
                                            >
                                                <Send className="mr-2 h-5 w-5" />
                                                {processing
                                                    ? 'Sending...'
                                                    : 'Send Message'}
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
                                                <h3 className="mb-2 text-2xl font-bold">
                                                    Visit Our Office
                                                </h3>
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
                                            <h3 className="mb-4 text-2xl font-bold text-primary">
                                                Why Choose Us?
                                            </h3>
                                            <ul className="space-y-4">
                                                {[
                                                    {
                                                        title: 'Quick Response',
                                                        desc: 'We respond to all inquiries within 24 hours',
                                                    },
                                                    {
                                                        title: 'Expert Guidance',
                                                        desc: 'Professional advice from experienced agents',
                                                    },
                                                    {
                                                        title: 'Personalized Service',
                                                        desc: 'Tailored solutions for your unique needs',
                                                    },
                                                    {
                                                        title: 'Transparent Process',
                                                        desc: 'No hidden fees or surprises along the way',
                                                    },
                                                ].map((item) => (
                                                    <li
                                                        key={item.title}
                                                        className="flex items-start gap-3"
                                                    >
                                                        <div className="bg-gradient-elegant mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                                                            <span className="text-sm text-primary-foreground">
                                                                ✓
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <strong className="mb-1 block">
                                                                {item.title}
                                                            </strong>
                                                            <span className="text-muted-foreground">
                                                                {item.desc}
                                                            </span>
                                                        </div>
                                                    </li>
                                                ))}
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
