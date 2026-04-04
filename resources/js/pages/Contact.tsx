import { useForm } from '@inertiajs/react';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    CheckCircle,
    X,
    ArrowRight,
} from 'lucide-react';
import React, { useState } from 'react';
import { route } from 'ziggy-js';
import ScrollAnimation from '@/components/ScrollAnimation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout';
import MapComponent from '@/components/MapComponent';

const Contact = () => {
    const [showSuccess, setShowSuccess] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const mapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.564565954962!2d90.36879267429433!3d23.798515286929444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c12fae71412b%3A0xb6df06aab789d2d1!2sAlliance%20Builders%20Ltd!5e0!3m2!1sen!2sbd!4v1773468571161!5m2!1sen!2sbd" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade';

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Visit Us',
            details: [
                'House# 640 (1st Floor), West Kazipara Mirpur, Dhaka-1216, Bangladesh',
            ],
        },
        {
            icon: Phone,
            title: 'Call Us',
            details: ['+88-01928568853'],
        },
        {
            icon: Mail,
            title: 'Email Us',
            details: ['asad@alliancebuildersltd.org'],
        },
        {
            icon: Clock,
            title: 'Business Hours',
            details: ['Wed - Mon: 11:00 AM - 7:00 PM'],
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

    const inputClass = `
        w-full rounded-xl border border-white/10 bg-white/5
        px-5 py-4 text-white placeholder-white/30
        outline-none transition-all duration-300
        focus:border-primary focus:bg-white/8 focus:ring-1 focus:ring-primary/50
        hover:border-white/20
    `;

    return (
        <AppLayout>
            <div className="min-h-screen bg-[#060810]">
                {/* ── Success Popup ── */}
                {showSuccess && (
                    <div
                        onClick={() => setShowSuccess(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-5"
                        style={{
                            background: 'rgba(0,0,0,0.75)',
                            backdropFilter: 'blur(6px)',
                        }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="shadow-elegant-xl relative w-full max-w-md rounded-2xl border border-primary/20 p-12 text-center"
                            style={{
                                background:
                                    'linear-gradient(135deg, hsl(210,77%,10%), hsl(210,77%,15%))',
                                animation:
                                    'popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            }}
                        >
                            <style>{`
                                @keyframes popIn {
                                    from { opacity: 0; transform: scale(0.85) translateY(20px); }
                                    to   { opacity: 1; transform: scale(1) translateY(0); }
                                }
                                @keyframes pulse-ring {
                                    0%,100% { transform: scale(0.9); opacity: 0.6; }
                                    50% { transform: scale(1.15); opacity: 0.2; }
                                }
                            `}</style>

                            <button
                                onClick={() => setShowSuccess(false)}
                                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 transition-all hover:bg-white/10 hover:text-white"
                            >
                                <X size={15} />
                            </button>

                            <div className="relative mb-6 inline-block">
                                <div
                                    className="absolute inset-[-10px] rounded-full bg-primary/20"
                                    style={{
                                        animation:
                                            'pulse-ring 2s ease-in-out infinite',
                                    }}
                                />
                                <div className="bg-gradient-primary relative flex h-20 w-20 items-center justify-center rounded-full border border-primary/40">
                                    <CheckCircle
                                        size={38}
                                        className="text-white"
                                        strokeWidth={1.8}
                                    />
                                </div>
                            </div>

                            <h2 className="mb-3 text-2xl font-bold text-white">
                                Message Sent!
                            </h2>
                            <p className="mb-1 text-sm leading-relaxed text-white/50">
                                We've received your message and will get back to
                                you within{' '}
                                <strong className="text-primary">
                                    24 hours
                                </strong>
                                .
                            </p>
                            <p className="mb-8 text-xs text-white/30">
                                We look forward to connecting with you!
                            </p>

                            <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                            <button
                                onClick={() => setShowSuccess(false)}
                                className="bg-gradient-primary shadow-elegant-lg rounded-xl px-10 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Hero ── */}
                <section 
                    className="relative overflow-hidden h-screen pt-58 pb-24"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Dark overlay for blend */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70" />
                    
                    <div className="bg-gradient-hero absolute inset-0 opacity-10" />
                    {/* Decorative blobs */}
                    <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
                    <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-secondary/10 blur-[100px]" />

                    <div className="relative z-10 container mx-auto px-4">
                        <ScrollAnimation delay={0.1}>
                            <h1 className="mb-6 text-5xl leading-tight font-bold text-white md:text-7xl">
                                Let's Start a<br />
                                <span className="bg-gradient-primary bg-clip-text text-transparent">
                                    Conversation
                                </span>
                            </h1>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.2}>
                            <p className="max-w-2xl text-lg text-white/50">
                                We're here to help you find your dream property.
                                Reach out and let's make it happen together.
                            </p>
                        </ScrollAnimation>
                    </div>
                </section>

                {/* ── Contact Info Cards ── */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {contactInfo.map((info, index) => (
                                <ScrollAnimation
                                    key={index}
                                    delay={index * 0.1}
                                    className="h-full"
                                >
                                    <div className="group h-full rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.06]">
                                        <div className="bg-gradient-primary shadow-elegant mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                                            <info.icon className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="mb-2 text-sm font-bold tracking-widest text-white/40 uppercase">
                                            {info.title}
                                        </h3>
                                        {info.details.map((detail, idx) => (
                                            <p
                                                key={idx}
                                                className="text-sm leading-relaxed text-white/70"
                                            >
                                                {detail}
                                            </p>
                                        ))}
                                    </div>
                                </ScrollAnimation>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Main Content ── */}
                <section className="py-16 pb-32">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
                            {/* ── Contact Form (3 cols) ── */}
                            <ScrollAnimation className="lg:col-span-3">
                                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
                                    {/* Form header */}
                                    <div className="mb-10">
                                        <p className="mb-2 text-xs font-bold tracking-[0.3em] text-primary uppercase">
                                            Get in Touch
                                        </p>
                                        <h2 className="text-3xl font-bold text-white md:text-4xl">
                                            Send Us a Message
                                        </h2>
                                        <div className="bg-gradient-primary mt-4 h-px w-16" />
                                    </div>

                                    <form
                                        className="space-y-5"
                                        onSubmit={handleSubmit}
                                    >
                                        {/* Name + Email row */}
                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="block text-xs font-semibold tracking-wider text-white/40 uppercase">
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
                                                    className={inputClass}
                                                    placeholder="John Doe"
                                                    required
                                                />
                                                {errors.name && (
                                                    <p className="text-xs text-red-400">
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs font-semibold tracking-wider text-white/40 uppercase">
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
                                                    className={inputClass}
                                                    placeholder="john@example.com"
                                                    required
                                                />
                                                {errors.email && (
                                                    <p className="text-xs text-red-400">
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-2">
                                            <label className="block text-xs font-semibold tracking-wider text-white/40 uppercase">
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
                                                className={inputClass}
                                                placeholder="+880 19XX XXX XXX"
                                                required
                                            />
                                            {errors.phone && (
                                                <p className="text-xs text-red-400">
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>

                                        {/* Message */}
                                        <div className="space-y-2">
                                            <label className="block text-xs font-semibold tracking-wider text-white/40 uppercase">
                                                Message
                                            </label>
                                            <textarea
                                                rows={6}
                                                value={data.message}
                                                onChange={(e) =>
                                                    setData(
                                                        'message',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`${inputClass} resize-none`}
                                                placeholder="Tell us more about what you're looking for..."
                                                required
                                            />
                                            {errors.message && (
                                                <p className="text-xs text-red-400">
                                                    {errors.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="group bg-gradient-primary shadow-elegant-lg hover:shadow-elegant-xl flex w-full items-center justify-center gap-3 rounded-xl py-4 text-sm font-bold tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-60"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4" />
                                                    Send Message
                                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </ScrollAnimation>

                            {/* ── Right Side (2 cols) ── */}
                            <div className="flex flex-col gap-6 lg:col-span-2">
                                {/* Why Choose Us */}
                                <ScrollAnimation delay={0.15}>
                                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
                                        <p className="mb-2 text-xs font-bold tracking-[0.3em] text-primary uppercase">
                                            Why Us
                                        </p>
                                        <h3 className="mb-6 text-2xl font-bold text-white">
                                            Why Choose Us?
                                        </h3>
                                        <ul className="space-y-5">
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
                                            ].map((item, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-start gap-4"
                                                >
                                                    <div className="bg-gradient-primary shadow-elegant-sm mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg">
                                                        <span className="text-xs font-bold text-white">
                                                            ✓
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="mb-0.5 text-sm font-semibold text-white">
                                                            {item.title}
                                                        </p>
                                                        <p className="text-xs leading-relaxed text-white/40">
                                                            {item.desc}
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </ScrollAnimation>

                                {/* Office card */}
                                <ScrollAnimation delay={0.25}>
                                    <div className="relative overflow-hidden rounded-3xl border border-white/10 h-96">
                                        <div className="bg-gradient-navy absolute inset-0" />
                                        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
                                        <MapComponent width="100%" height="100%" src={mapUrl} />
                                    </div>
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
