import { Form, Head, Link } from '@inertiajs/react';
import { motion, type Variants } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import { route } from 'ziggy-js';
import logo from '@/assets/images/logo/alliance logo.webp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import InputError from '@/components/web/input-error';
import { home } from '@/routes';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
};

// Left-to-right wipe reveal for the brand wordmark.
const brandNameVariants: Variants = {
    hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
    show: {
        clipPath: 'inset(0 0% 0 0)',
        opacity: 1,
        transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
    },
};

// Word-by-word cascade for the headline.
const headlineContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
};
const headlineWord: Variants = {
    hidden: { opacity: 0, y: 24, rotateX: -60 },
    show: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
};

// Pop-in for the logo mark above "Welcome back".
const logoVariants: Variants = {
    hidden: { opacity: 0, scale: 0.6, rotate: -8 },
    show: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { duration: 0.7, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] },
    },
};

// Slide-in-from-right for form fields, staggered via the `custom` delay.
const fieldVariants: Variants = {
    hidden: { opacity: 0, x: 24 },
    show: (delay: number) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] },
    }),
};

// Springy scale pop for the submit button.
const buttonVariants: Variants = {
    hidden: { opacity: 0, scale: 0.85 },
    show: (delay: number) => ({
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 260, damping: 18, delay },
    }),
};

/**
 * Minimal line-art elevation of an apartment block — purely decorative,
 * drawn in strokes so it reads as an architectural sketch rather than a photo.
 */
function BuildingLineArt() {
    return (
        <svg
            viewBox="0 0 440 420"
            fill="none"
            className="h-full w-full"
            aria-hidden="true"
        >
            {/* Ground line */}
            <line
                x1="20"
                y1="396"
                x2="420"
                y2="396"
                stroke="currentColor"
                strokeOpacity="0.35"
                strokeWidth="1.5"
            />

            {/* Main tower */}
            <rect
                x="90"
                y="60"
                width="180"
                height="336"
                stroke="currentColor"
                strokeOpacity="0.55"
                strokeWidth="1.5"
            />
            {/* Roofline detail */}
            <line
                x1="90"
                y1="80"
                x2="270"
                y2="80"
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="1.5"
            />

            {/* Window grid */}
            {Array.from({ length: 7 }).map((_, row) =>
                Array.from({ length: 4 }).map((_, col) => (
                    <rect
                        key={`w-${row}-${col}`}
                        x={108 + col * 40}
                        y={100 + row * 40}
                        width="22"
                        height="26"
                        stroke="currentColor"
                        strokeOpacity={0.3}
                        strokeWidth="1"
                    />
                )),
            )}

            {/* Entrance */}
            <rect
                x="160"
                y="350"
                width="40"
                height="46"
                stroke="currentColor"
                strokeOpacity="0.55"
                strokeWidth="1.5"
            />
            <line
                x1="180"
                y1="350"
                x2="180"
                y2="396"
                stroke="currentColor"
                strokeOpacity="0.3"
                strokeWidth="1"
            />

            {/* Side annex, lower block */}
            <rect
                x="270"
                y="190"
                width="100"
                height="206"
                stroke="currentColor"
                strokeOpacity="0.45"
                strokeWidth="1.5"
            />
            {Array.from({ length: 4 }).map((_, row) =>
                Array.from({ length: 2 }).map((_, col) => (
                    <rect
                        key={`a-${row}-${col}`}
                        x={288 + col * 40}
                        y={212 + row * 40}
                        width="22"
                        height="26"
                        stroke="currentColor"
                        strokeOpacity={0.25}
                        strokeWidth="1"
                    />
                )),
            )}

            {/* Left low block */}
            <rect
                x="40"
                y="260"
                width="50"
                height="136"
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="1.5"
            />
            {Array.from({ length: 3 }).map((_, row) => (
                <rect
                    key={`l-${row}`}
                    x="54"
                    y={278 + row * 36}
                    width="22"
                    height="24"
                    stroke="currentColor"
                    strokeOpacity={0.25}
                    strokeWidth="1"
                />
            ))}

            {/* Rooftop railing accents */}
            <line
                x1="90"
                y1="60"
                x2="90"
                y2="48"
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="1.5"
            />
            <line
                x1="270"
                y1="60"
                x2="270"
                y2="48"
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="1.5"
            />
            <line
                x1="90"
                y1="48"
                x2="270"
                y2="48"
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="1.5"
            />

            {/* Dimension marks, architectural-drawing styling */}
            <line
                x1="90"
                y1="410"
                x2="90"
                y2="404"
                stroke="currentColor"
                strokeOpacity="0.3"
                strokeWidth="1"
            />
            <line
                x1="270"
                y1="410"
                x2="270"
                y2="404"
                stroke="currentColor"
                strokeOpacity="0.3"
                strokeWidth="1"
            />
            <line
                x1="90"
                y1="408"
                x2="270"
                y2="408"
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="1"
            />
        </svg>
    );
}

export default function Login({ status }: Props) {
    return (
        <div className="flex min-h-svh flex-col bg-background lg:flex-row">
            <Head title="Log in" />

            {/* Brand / illustration panel — hidden on small screens */}
            <div className="relative hidden flex-col justify-between overflow-hidden bg-secondary px-10 py-10 text-white lg:flex lg:w-1/2 xl:px-16">
                {/* Fine architectural grid texture */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />

                <motion.div
                    variants={brandNameVariants}
                    initial="hidden"
                    animate="show"
                    className="relative z-10"
                >
                    <Link
                        href={home()}
                        className="text-2xl font-bold tracking-tight lg:text-3xl"
                    >
                        Alliance Builders Limited
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.7,
                        delay: 0.15,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative z-10 mx-auto w-full max-w-sm text-primary-light/80"
                >
                    <BuildingLineArt />
                </motion.div>

                <div className="relative z-10">
                    <motion.h2
                        variants={headlineContainer}
                        initial="hidden"
                        animate="show"
                        className="flex flex-nowrap gap-x-2 text-xl font-semibold tracking-tight whitespace-nowrap [perspective:800px] lg:text-2xl xl:text-3xl"
                    >
                        {['Affordable', 'Apartments', 'for', 'All'].map(
                            (word) => (
                                <motion.span
                                    key={word}
                                    variants={headlineWord}
                                    className="inline-block"
                                >
                                    {word}
                                </motion.span>
                            ),
                        )}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.75,
                            ease: 'easeOut',
                        }}
                        className="mt-3 max-w-sm text-sm text-white/55"
                    >
                        Sign in to manage listings, media, and content for
                        Alliance Builders Limited.
                    </motion.p>
                </div>
            </div>

            {/* Form panel */}
            <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    className="w-full max-w-sm"
                >
                    {/* Logo above the heading on every breakpoint */}
                    <motion.div
                        variants={logoVariants}
                        initial="hidden"
                        animate="show"
                        className="mb-6 flex justify-center"
                    >
                        <Link href={home()}>
                            <img
                                src={logo}
                                alt="Alliance Builders Limited"
                                className="h-20 w-auto object-contain lg:h-24"
                            />
                        </Link>
                    </motion.div>

                    {/* Slogan shown only when the brand panel is hidden (mobile) */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-8 text-center text-sm font-medium whitespace-nowrap text-muted-foreground lg:hidden"
                    >
                        Affordable Apartments for All
                    </motion.p>

                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-foreground">
                            Welcome back
                        </h1>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            Sign in to the admin dashboard to continue.
                        </p>
                    </div>

                    <Form
                        method="post"
                        action={route('login.store')}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-5">
                                    <motion.div
                                        variants={fieldVariants}
                                        custom={0.15}
                                        initial="hidden"
                                        animate="show"
                                        className="grid gap-2"
                                    >
                                        <Label htmlFor="email">
                                            Email address
                                        </Label>
                                        <div className="relative">
                                            <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                className="h-11 pl-10 focus-visible:border-secondary focus-visible:ring-secondary/25"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </motion.div>

                                    <motion.div
                                        variants={fieldVariants}
                                        custom={0.25}
                                        initial="hidden"
                                        animate="show"
                                        className="grid gap-2"
                                    >
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                className="h-11 pl-10 focus-visible:border-secondary focus-visible:ring-secondary/25"
                                            />
                                        </div>
                                        <InputError message={errors.password} />
                                    </motion.div>

                                    <motion.div
                                        variants={buttonVariants}
                                        custom={0.4}
                                        initial="hidden"
                                        animate="show"
                                    >
                                        <Button
                                            type="submit"
                                            size="lg"
                                            tabIndex={4}
                                            disabled={processing}
                                            data-test="login-button"
                                            className="mt-1 w-full bg-secondary text-white shadow-md shadow-secondary/20 transition-colors hover:bg-secondary-light"
                                        >
                                            {processing && <Spinner />}
                                            Log in
                                        </Button>
                                    </motion.div>
                                </div>
                            </>
                        )}
                    </Form>

                    {status && (
                        <div className="mt-6 text-center text-sm font-medium text-success">
                            {status}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
