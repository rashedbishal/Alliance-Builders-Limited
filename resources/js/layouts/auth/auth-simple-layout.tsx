import { Link } from '@inertiajs/react';
import cityBackground from '@/assets/images/backgrounds/city-7.webp';
import logo from '@/assets/images/logo/alliance logo.webp';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh bg-background">
            {/* Decorative brand panel — visible on large screens only */}
            <div
                className="relative hidden w-[45%] shrink-0 flex-col justify-between bg-cover bg-center p-10 lg:flex xl:p-14"
                style={{ backgroundImage: `url(${cityBackground})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-secondary-dark/95 via-secondary/85 to-primary-dark/90" />

                <Link href={home()} className="relative z-10 inline-flex">
                    <img
                        src={logo}
                        alt="Alliance Builders Limited"
                        className="h-12 w-auto object-contain"
                    />
                </Link>

                <div className="relative z-10 max-w-md space-y-3 text-white">
                    <p className="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">
                        Content Management Portal
                    </p>
                    <h2 className="text-3xl font-semibold leading-tight">
                        Shape Your Dreams With Alliance Builders Ltd.
                    </h2>
                    <p className="text-sm text-white/70">
                        Securely manage carousels, properties, media, and
                        site settings from one place.
                    </p>
                </div>
            </div>

            {/* Form panel */}
            <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-sm">
                    <div className="mb-8 flex justify-center lg:hidden">
                        <Link href={home()} className="inline-flex">
                            <img
                                src={logo}
                                alt="Alliance Builders Limited"
                                className="h-16 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-xl shadow-black/5 sm:p-8">
                        <div className="mb-6 space-y-1.5 text-center">
                            <h1 className="text-2xl font-semibold text-foreground">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-sm text-balance text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
