import { Form, Head, Link } from '@inertiajs/react';
import { motion, type Variants } from 'framer-motion';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
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

// Slowly drifting glow "orbs" behind the card — purely decorative.
const orbs = [
    {
        className: 'h-[30rem] w-[30rem] bg-[hsl(209,35%,57%)] -top-32 -left-32',
        animate: { x: [0, 60, -20, 0], y: [0, 40, -30, 0] },
        duration: 26,
    },
    {
        className: 'h-[26rem] w-[26rem] bg-[hsl(225,78%,40%)] -bottom-40 -right-24',
        animate: { x: [0, -50, 30, 0], y: [0, -30, 20, 0] },
        duration: 32,
    },
    {
        className: 'h-[20rem] w-[20rem] bg-[hsl(216,42%,76%)] top-1/3 right-1/4',
        animate: { x: [0, 30, -40, 0], y: [0, -20, 30, 0] },
        duration: 22,
    },
];

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 28, scale: 0.98 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
};

const fieldVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function Login({ status }: Props) {
    return (
        <div
            className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-10"
            style={{ background: 'var(--gradient-hero)' }}
        >
            <Head title="Log in" />

            {/* Animated glow orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {orbs.map((orb, i) => (
                    <motion.div
                        key={i}
                        className={`absolute rounded-full opacity-30 blur-3xl ${orb.className}`}
                        animate={orb.animate}
                        transition={{
                            duration: orb.duration,
                            repeat: Infinity,
                            repeatType: 'mirror',
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>

            {/* Fine dot-grid texture */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage:
                        'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
            />

            {/* Card */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="show"
                className="relative z-10 w-full max-w-md rounded-3xl border border-white/15 bg-white/[0.06] p-7 shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur-2xl sm:p-10"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                    className="flex justify-center"
                >
                    <Link
                        href={home()}
                        className="rounded-2xl bg-white p-3 shadow-lg shadow-black/25 ring-1 ring-black/5"
                    >
                        <img
                            src={logo}
                            alt="Alliance Builders Limited"
                            className="h-14 w-auto object-contain"
                        />
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-6 flex flex-col items-center gap-2 text-center"
                >
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.7rem] font-medium tracking-wide text-white/80">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Secure Admin Access
                    </span>
                    <h1 className="text-2xl font-semibold text-white">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-white/60">
                        Enter your email and password below to log in
                    </p>
                </motion.div>

                <Form
                    method="post"
                    action={route('login.store')}
                    resetOnSuccess={['password']}
                    className="mt-8 flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-5">
                                <motion.div
                                    variants={fieldVariants}
                                    initial="hidden"
                                    animate="show"
                                    transition={{ delay: 0.3 }}
                                    className="grid gap-2"
                                >
                                    <Label
                                        htmlFor="email"
                                        className="text-white/80"
                                    >
                                        Email address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/50" />
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="Email Address"
                                            className="h-11 border-white/15 bg-white/10 pl-10 text-white placeholder:text-white/40 focus-visible:border-white/30 focus-visible:ring-white/30"
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </motion.div>

                                <motion.div
                                    variants={fieldVariants}
                                    initial="hidden"
                                    animate="show"
                                    transition={{ delay: 0.38 }}
                                    className="grid gap-2"
                                >
                                    <Label
                                        htmlFor="password"
                                        className="text-white/80"
                                    >
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/50" />
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="Password"
                                            className="h-11 border-white/15 bg-white/10 pl-10 text-white placeholder:text-white/40 focus-visible:border-white/30 focus-visible:ring-white/30"
                                        />
                                    </div>
                                    <InputError message={errors.password} />
                                </motion.div>

                                <motion.div
                                    variants={fieldVariants}
                                    initial="hidden"
                                    animate="show"
                                    transition={{ delay: 0.46 }}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.015 }}
                                        whileTap={{ scale: 0.985 }}
                                    >
                                        <Button
                                            type="submit"
                                            size="lg"
                                            tabIndex={4}
                                            disabled={processing}
                                            data-test="login-button"
                                            className="mt-1 w-full border-0 bg-[linear-gradient(135deg,hsl(225,78%,48%),hsl(210,85%,38%))] text-white shadow-lg shadow-primary/30 transition-shadow hover:shadow-xl hover:shadow-primary/40"
                                        >
                                            {processing && <Spinner />}
                                            Log in
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </>
                    )}
                </Form>

                {status && (
                    <div className="mt-6 text-center text-sm font-medium text-emerald-300">
                        {status}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
