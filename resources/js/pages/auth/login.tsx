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

const panelVariants: Variants = {
    hidden: { opacity: 0, x: -24 },
    show: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
};

const fieldVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
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
                    variants={panelVariants}
                    initial="hidden"
                    animate="show"
                    className="relative z-10 flex items-center gap-3"
                >
                    <Link href={home()} className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                            <img
                                src={logo}
                                alt=""
                                className="h-7 w-auto object-contain"
                            />
                        </div>
                        <span className="text-lg font-semibold tracking-tight">
                            Alliance Builders Limited
                        </span>
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

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="relative z-10"
                >
                    <h2 className="text-xl font-semibold tracking-tight whitespace-nowrap lg:text-2xl xl:text-3xl">
                        Affordable Apartments for All
                    </h2>
                    <p className="mt-3 max-w-sm text-sm text-white/55">
                        Sign in to manage listings, media, and content for
                        Alliance Builders Limited.
                    </p>
                </motion.div>
            </div>

            {/* Form panel */}
            <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    className="w-full max-w-sm"
                >
                    {/* Logo shown only when the brand panel is hidden (mobile) */}
                    <div className="mb-8 flex flex-col items-center gap-2 text-center lg:hidden">
                        <Link href={home()}>
                            <img
                                src={logo}
                                alt="Alliance Builders Limited"
                                className="h-28 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-sm font-medium whitespace-nowrap text-muted-foreground">
                            Affordable Apartments for All
                        </p>
                    </div>

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
                                        initial="hidden"
                                        animate="show"
                                        transition={{ delay: 0.15 }}
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
                                        initial="hidden"
                                        animate="show"
                                        transition={{ delay: 0.22 }}
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
                                        variants={fieldVariants}
                                        initial="hidden"
                                        animate="show"
                                        transition={{ delay: 0.3 }}
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
