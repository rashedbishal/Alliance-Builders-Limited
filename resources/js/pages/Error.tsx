import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowLeft,
    Ban,
    Clock,
    Headphones,
    Home,
    RefreshCw,
    SearchX,
    ServerCrash,
    ShieldAlert,
    Wrench,
} from 'lucide-react';
import React from 'react';
import { home, contact } from '@/routes';

interface ErrorPageProps {
    status: number;
    message?: string;
}

const errorDetails: Record<
    number,
    {
        title: string;
        subtitle: string;
        icon: React.ElementType;
        gradient: string;
        glowColor: string;
    }
> = {
    404: {
        title: 'Page Not Found',
        subtitle:
            'The page or property unit you are looking for has been relocated, renamed, or does not exist.',
        icon: SearchX,
        gradient: 'from-cyan-400 via-sky-400 to-blue-500',
        glowColor: 'rgba(6, 182, 212, 0.35)',
    },
    403: {
        title: 'Access Restricted',
        subtitle:
            'You do not have the required permissions or authorization to view this private resource.',
        icon: ShieldAlert,
        gradient: 'from-amber-300 via-orange-400 to-amber-500',
        glowColor: 'rgba(245, 158, 11, 0.35)',
    },
    405: {
        title: 'Method Not Allowed',
        subtitle:
            'The requested HTTP action is not supported or allowed for this URL endpoint.',
        icon: Ban,
        gradient: 'from-purple-400 via-indigo-400 to-violet-500',
        glowColor: 'rgba(168, 85, 247, 0.35)',
    },
    419: {
        title: 'Session Expired',
        subtitle:
            'Your security session has timed out due to inactivity. Please refresh the page and try again.',
        icon: Clock,
        gradient: 'from-emerald-400 via-teal-400 to-cyan-500',
        glowColor: 'rgba(16, 185, 129, 0.35)',
    },
    500: {
        title: 'Server Error',
        subtitle:
            'An unexpected technical glitch occurred on our server. Our engineering team has been notified.',
        icon: ServerCrash,
        gradient: 'from-rose-400 via-red-400 to-pink-500',
        glowColor: 'rgba(244, 63, 94, 0.35)',
    },
    503: {
        title: 'System Maintenance',
        subtitle:
            'We are currently undergoing brief scheduled upgrades to elevate your digital experience.',
        icon: Wrench,
        gradient: 'from-sky-300 via-blue-400 to-indigo-500',
        glowColor: 'rgba(56, 189, 248, 0.35)',
    },
};

export default function ErrorPage({ status = 404, message }: ErrorPageProps) {
    const config = errorDetails[status] || {
        title: 'Unexpected Error',
        subtitle: message || 'An unexpected error occurred while processing your request.',
        icon: AlertTriangle,
        gradient: 'from-cyan-400 via-sky-400 to-blue-500',
        glowColor: 'rgba(6, 182, 212, 0.35)',
    };

    const IconComponent = config.icon;

    const handleGoBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/';
        }
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#050505] px-4 py-12 text-white selection:bg-cyan-500/30">
            {/* Background Ambient Glow Effects */}
            <div className="pointer-events-none absolute inset-0">
                <div
                    className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] opacity-40"
                    style={{ background: config.glowColor }}
                />
                <div className="absolute right-1/4 top-1/4 h-80 w-80 rounded-full bg-blue-600/10 blur-[100px]" />
                <div className="absolute left-1/4 bottom-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />
            </div>

            <div className="container relative z-10 mx-auto max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-black/60 p-8 text-center shadow-2xl backdrop-blur-2xl sm:p-12 md:p-16"
                >
                    {/* Glowing Top Border Accent Line */}
                    <div
                        className={`absolute top-0 left-1/2 h-[2px] w-56 -translate-x-1/2 bg-gradient-to-r ${config.gradient}`}
                    />

                    {/* Integrated Icon Header */}
                    <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/[0.02] shadow-xl backdrop-blur-xl">
                        <IconComponent className="h-10 w-10 text-cyan-300" />
                    </div>

                    {/* Error Number Display */}
                    <div className="my-2 select-none">
                        <h1
                            className={`font-serif text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b ${config.gradient} sm:text-8xl md:text-9xl leading-none`}
                        >
                            {status}
                        </h1>
                    </div>

                    {/* Error Title & Subtitle */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="mt-6"
                    >
                        <h2 className="font-serif text-3xl font-light tracking-tight text-white sm:text-4xl">
                            {config.title}
                        </h2>
                        <p className="mx-auto mt-4 max-w-md text-sm text-slate-300/80 sm:text-base leading-relaxed">
                            {config.subtitle}
                        </p>
                    </motion.div>

                    {/* Navigation Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="mt-10 flex flex-wrap items-center justify-center gap-4"
                    >
                        <button
                            type="button"
                            onClick={handleGoBack}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:border-white/30 hover:bg-white/10 active:scale-95"
                        >
                            <ArrowLeft className="h-4 w-4 text-cyan-400" />
                            Go Back
                        </button>

                        <Link
                            href={home.url()}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-7 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:from-cyan-400 hover:to-sky-400 hover:shadow-cyan-500/40 active:scale-95"
                        >
                            <Home className="h-4 w-4" />
                            Return Home
                        </Link>

                        <Link
                            href={contact.url()}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-lg transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/10 hover:text-white active:scale-95"
                        >
                            <Headphones className="h-4 w-4 text-sky-400" />
                            Contact Support
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
