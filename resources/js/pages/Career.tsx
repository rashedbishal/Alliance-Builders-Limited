import { useForm } from '@inertiajs/react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
    ArrowRight,
    Briefcase,
    Building2,
    CalendarClock,
    CheckCircle,
    ChevronDown,
    Clock,
    FileText,
    MapPin,
    Send,
    Upload,
    Users,
    Wallet,
    X,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { route } from 'ziggy-js';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import ScrollAnimation from '@/components/ScrollAnimation';
import AppLayout from '@/layouts/AppLayout';

interface CareerSettings {
    hero_image: string | null;
    heading: string | null;
    subtitle: string | null;
    no_openings_message: string | null;
}

interface Job {
    id: number;
    title: string;
    department: string | null;
    location: string | null;
    job_type: string | null;
    vacancies: number | null;
    experience: string | null;
    salary: string | null;
    deadline: string | null;
    description: string;
    created_at: string;
}

interface Props {
    settings: CareerSettings;
    jobs: Job[];
}

interface ApplicationForm {
    job_post_id: string;
    custom_position: string;
    name: string;
    phone: string;
    email: string;
    message: string;
    cv: File | null;
}

const OTHER = 'other';
const CV_MAX_BYTES = 5 * 1024 * 1024;
const CV_EXTENSIONS = ['pdf', 'docx'];
const PHONE_REGEX = /^01[3-9]\d{8}$/;
const DEFAULT_HERO =
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&h=900&fit=crop';

const formatDate = (iso: string) =>
    new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

/** Split the CMS heading so its last word gets the brand gradient. */
const splitHeading = (heading: string) => {
    const trimmed = heading.trim();
    const idx = trimmed.lastIndexOf(' ');
    return idx === -1
        ? { lead: '', accent: trimmed }
        : { lead: trimmed.slice(0, idx), accent: trimmed.slice(idx + 1) };
};

function FieldError({ message }: { message?: string }) {
    return message ? <p className="text-xs text-red-400">{message}</p> : null;
}

function JobMeta({ job, compact = false }: { job: Job; compact?: boolean }) {
    const items = [
        { icon: Building2, value: job.department },
        { icon: MapPin, value: job.location },
        { icon: Clock, value: job.job_type },
        {
            icon: Users,
            value: job.vacancies
                ? `${job.vacancies} Vacanc${job.vacancies === 1 ? 'y' : 'ies'}`
                : null,
        },
        { icon: Briefcase, value: compact ? null : job.experience },
        { icon: Wallet, value: compact ? null : job.salary },
    ].filter((i) => i.value);

    if (items.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {items.map(({ icon: Icon, value }, i) => (
                <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
                >
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    {value}
                </span>
            ))}
        </div>
    );
}

const Career = ({ settings, jobs }: Props) => {
    const hasJobs = jobs.length > 0;
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);
    const cvInputRef = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        setError,
        clearErrors,
        reset,
        transform,
    } = useForm<ApplicationForm>({
        job_post_id: '',
        custom_position: '',
        name: '',
        phone: '',
        email: '',
        message: '',
        cv: null,
    });

    const formErrors = errors as Partial<
        Record<keyof ApplicationForm | 'form', string>
    >;
    const needsCustomPosition = !hasJobs || data.job_post_id === OTHER;

    const heading = splitHeading(
        settings.heading || 'Build Your Career With Us',
    );

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const applyFor = (job: Job) => {
        setData('job_post_id', String(job.id));
        clearErrors('job_post_id', 'custom_position');
        setSelectedJob(null);
        // Wait for the dialog close animation before scrolling.
        setTimeout(scrollToForm, 200);
    };

    const handleCv = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) {
            setData('cv', null);
            return;
        }
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        if (!CV_EXTENSIONS.includes(ext)) {
            setError('cv', 'Your CV must be a PDF or DOCX file.');
            setData('cv', null);
            e.target.value = '';
            return;
        }
        if (file.size > CV_MAX_BYTES) {
            setError('cv', 'Your CV must not be larger than 5 MB.');
            setData('cv', null);
            e.target.value = '';
            return;
        }
        clearErrors('cv');
        setData('cv', file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        if (!PHONE_REGEX.test(data.phone)) {
            setError(
                'phone',
                'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).',
            );
            return;
        }
        if (!data.cv) {
            setError('cv', 'Please upload your CV (PDF or DOCX).');
            return;
        }

        transform((d) => ({
            ...d,
            job_post_id: d.job_post_id === OTHER ? '' : d.job_post_id,
            custom_position:
                !hasJobs || d.job_post_id === OTHER ? d.custom_position : '',
        }));

        post(route('career.apply'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                if (cvInputRef.current) cvInputRef.current.value = '';
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
    const labelClass =
        'block text-xs font-semibold tracking-wider text-white/40 uppercase';

    return (
        <AppLayout>
            <style>{`
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.85) translateY(20px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes pulse-ring {
                    0%,100% { transform: scale(0.9); opacity: 0.6; }
                    50% { transform: scale(1.15); opacity: 0.2; }
                }
                .job-description { color: rgba(255,255,255,0.7); font-size: 0.95rem; line-height: 1.75; }
                .job-description > * + * { margin-top: 0.75rem; }
                .job-description > :first-child { margin-top: 0; }
                .job-description h2, .job-description h3, .job-description h4 { color: #fff; font-weight: 700; line-height: 1.3; margin-top: 1.5rem; }
                .job-description h2 { font-size: 1.35rem; }
                .job-description h3 { font-size: 1.15rem; }
                .job-description h4 { font-size: 1rem; }
                .job-description ul, .job-description ol { padding-left: 1.4rem; }
                .job-description ul { list-style: disc; }
                .job-description ol { list-style: decimal; }
                .job-description li + li { margin-top: 0.35rem; }
                .job-description li p { margin: 0; }
                .job-description li::marker { color: var(--color-primary); }
                .job-description a { color: var(--color-primary); text-decoration: underline; }
                .job-description blockquote { border-left: 3px solid var(--color-primary); padding-left: 1rem; color: rgba(255,255,255,0.55); font-style: italic; }
                .job-description strong, .job-description b { color: #fff; }
                .job-description hr { border-color: rgba(255,255,255,0.1); }
            `}</style>

            <div className="min-h-screen bg-[#060810]">
                {/* ── Success Popup ── */}
                {showSuccess && (
                    <div
                        onClick={() => setShowSuccess(false)}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-5"
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
                            <button
                                onClick={() => setShowSuccess(false)}
                                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 transition-all hover:bg-white/10 hover:text-white"
                                aria-label="Close"
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
                                Application Submitted!
                            </h2>
                            <p className="mb-1 text-sm leading-relaxed text-white/50">
                                Thank you for your interest in joining{' '}
                                <strong className="text-primary">
                                    Alliance Builders Limited
                                </strong>
                                .
                            </p>
                            <p className="mb-8 text-xs text-white/30">
                                Our team will review your application and
                                contact you if your profile matches our
                                requirements.
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

                {/* ── Job Details Modal ── */}
                <DialogPrimitive.Root
                    open={selectedJob !== null}
                    onOpenChange={(open) => !open && setSelectedJob(null)}
                >
                    <DialogPrimitive.Portal>
                        <DialogPrimitive.Overlay
                            className="fixed inset-0 z-[100] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
                            style={{
                                background: 'rgba(0,0,0,0.75)',
                                backdropFilter: 'blur(6px)',
                            }}
                        />
                        <DialogPrimitive.Content
                            className="shadow-elegant-xl fixed top-1/2 left-1/2 z-[101] flex max-h-[90vh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-primary/20 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
                            style={{
                                background:
                                    'linear-gradient(135deg, hsl(210,77%,8%), hsl(210,77%,12%))',
                            }}
                        >
                            {selectedJob && (
                                <>
                                    <div className="relative border-b border-white/10 p-6 pr-16 md:p-8 md:pr-20">
                                        <p className="mb-2 text-xs font-bold tracking-[0.3em] text-primary uppercase">
                                            Job Opening
                                        </p>
                                        <DialogPrimitive.Title className="mb-4 text-2xl font-bold text-white md:text-3xl">
                                            {selectedJob.title}
                                        </DialogPrimitive.Title>
                                        <DialogPrimitive.Description asChild>
                                            <div>
                                                <JobMeta job={selectedJob} />
                                            </div>
                                        </DialogPrimitive.Description>
                                        <DialogPrimitive.Close
                                            className="absolute top-6 right-6 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all hover:bg-white/10 hover:text-white"
                                            aria-label="Close"
                                        >
                                            <X size={16} />
                                        </DialogPrimitive.Close>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                                        <div
                                            className="job-description"
                                            // Sanitized server-side by App\Services\RichTextSanitizer.
                                            dangerouslySetInnerHTML={{
                                                __html: selectedJob.description,
                                            }}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-4 border-t border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between md:px-8">
                                        <div className="text-xs text-white/40">
                                            {selectedJob.deadline ? (
                                                <span className="inline-flex items-center gap-1.5">
                                                    <CalendarClock className="h-4 w-4 text-primary" />
                                                    Apply before{' '}
                                                    <strong className="text-white/70">
                                                        {formatDate(
                                                            selectedJob.deadline,
                                                        )}
                                                    </strong>
                                                </span>
                                            ) : (
                                                <span>
                                                    Posted on{' '}
                                                    {formatDate(
                                                        selectedJob.created_at,
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                applyFor(selectedJob)
                                            }
                                            className="group bg-gradient-primary shadow-elegant-lg inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
                                        >
                                            Apply for this Position
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </DialogPrimitive.Content>
                    </DialogPrimitive.Portal>
                </DialogPrimitive.Root>

                {/* ── Hero ── */}
                <section
                    className="relative h-screen overflow-hidden pt-58 pb-24"
                    style={{
                        backgroundImage: `url(${settings.hero_image || DEFAULT_HERO})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70" />
                    <div className="bg-gradient-hero absolute inset-0 opacity-10" />
                    <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
                    <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-secondary/10 blur-[100px]" />

                    <div className="relative z-10 container mx-auto px-4">
                        <PageBreadcrumb
                            items={[{ label: 'Career' }]}
                            className="mb-6"
                        />
                        <ScrollAnimation delay={0.1}>
                            <h1 className="mb-6 text-5xl leading-tight font-bold text-white md:text-7xl">
                                {heading.lead && <>{heading.lead} </>}
                                <span className="bg-gradient-primary bg-clip-text text-transparent">
                                    {heading.accent}
                                </span>
                            </h1>
                        </ScrollAnimation>
                        {settings.subtitle && (
                            <ScrollAnimation delay={0.2}>
                                <p className="max-w-2xl text-lg whitespace-pre-line text-white/50">
                                    {settings.subtitle}
                                </p>
                            </ScrollAnimation>
                        )}
                        <ScrollAnimation delay={0.3}>
                            <div className="mt-10 flex flex-wrap gap-4">
                                <a
                                    href="#openings"
                                    className="group bg-gradient-primary shadow-elegant-lg inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
                                >
                                    <Briefcase className="h-4 w-4" />
                                    {hasJobs
                                        ? `View Openings (${jobs.length})`
                                        : 'Current Openings'}
                                </a>
                                <a
                                    href="#apply"
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-white/10"
                                >
                                    <Send className="h-4 w-4" />
                                    Apply Now
                                </a>
                            </div>
                        </ScrollAnimation>
                    </div>
                </section>

                {/* ── Openings ── */}
                <section id="openings" className="scroll-mt-24 py-20">
                    <div className="container mx-auto px-4">
                        <ScrollAnimation>
                            <div className="mb-12">
                                <p className="mb-2 text-xs font-bold tracking-[0.3em] text-primary uppercase">
                                    Join Our Team
                                </p>
                                <h2 className="text-3xl font-bold text-white md:text-4xl">
                                    Current Openings
                                </h2>
                                <div className="bg-gradient-primary mt-4 h-px w-16" />
                            </div>
                        </ScrollAnimation>

                        {hasJobs ? (
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                                {jobs.map((job, index) => (
                                    <ScrollAnimation
                                        key={job.id}
                                        delay={Math.min(index, 5) * 0.08}
                                        className="h-full"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setSelectedJob(job)}
                                            className="group flex h-full w-full flex-col rounded-2xl border border-white/8 bg-white/[0.03] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-white/[0.06]"
                                        >
                                            <div className="mb-5 flex items-start justify-between gap-4">
                                                <div className="bg-gradient-primary shadow-elegant inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                                                    <Briefcase className="h-5 w-5 text-white" />
                                                </div>
                                                {job.deadline && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                                                        <CalendarClock className="h-3.5 w-3.5" />
                                                        {formatDate(
                                                            job.deadline,
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-primary">
                                                {job.title}
                                            </h3>
                                            <div className="mb-6">
                                                <JobMeta job={job} compact />
                                            </div>
                                            <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary">
                                                View Details
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </button>
                                    </ScrollAnimation>
                                ))}
                            </div>
                        ) : (
                            <ScrollAnimation>
                                <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center md:p-14">
                                    <div className="bg-gradient-primary shadow-elegant mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl">
                                        <Briefcase className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="mb-4 text-2xl font-bold text-white">
                                        No Open Positions at the Moment
                                    </h3>
                                    <p className="mx-auto max-w-xl text-sm leading-relaxed whitespace-pre-line text-white/50">
                                        {settings.no_openings_message ||
                                            'There are currently no open positions. However, we are always interested in hearing from talented professionals. Please submit your application below and we will contact you when a suitable opportunity becomes available.'}
                                    </p>
                                    <a
                                        href="#apply"
                                        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                                    >
                                        Submit Your CV
                                        <ArrowRight className="h-4 w-4" />
                                    </a>
                                </div>
                            </ScrollAnimation>
                        )}
                    </div>
                </section>

                {/* ── Application Form ── */}
                <section id="apply" className="scroll-mt-24 py-16 pb-32">
                    <div
                        ref={formRef}
                        className="container mx-auto scroll-mt-24 px-4"
                    >
                        <ScrollAnimation>
                            <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
                                <div className="mb-10">
                                    <p className="mb-2 text-xs font-bold tracking-[0.3em] text-primary uppercase">
                                        Apply Now
                                    </p>
                                    <h2 className="text-3xl font-bold text-white md:text-4xl">
                                        Submit Your Application
                                    </h2>
                                    <div className="bg-gradient-primary mt-4 h-px w-16" />
                                </div>

                                <form
                                    className="space-y-5"
                                    onSubmit={handleSubmit}
                                >
                                    {formErrors.form && (
                                        <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-5 py-3 text-sm text-red-300">
                                            {formErrors.form}
                                        </div>
                                    )}

                                    {/* Position */}
                                    {hasJobs && (
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="job_post_id"
                                                className={labelClass}
                                            >
                                                Position Applying For
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="job_post_id"
                                                    value={data.job_post_id}
                                                    onChange={(e) => {
                                                        clearErrors(
                                                            'job_post_id',
                                                            'custom_position',
                                                        );
                                                        setData(
                                                            'job_post_id',
                                                            e.target.value,
                                                        );
                                                    }}
                                                    className={`${inputClass} cursor-pointer appearance-none pr-12 [&>option]:bg-[#0b1220] [&>option]:text-white`}
                                                    required
                                                >
                                                    <option value="" disabled>
                                                        Select a position
                                                    </option>
                                                    {jobs.map((job) => (
                                                        <option
                                                            key={job.id}
                                                            value={String(
                                                                job.id,
                                                            )}
                                                        >
                                                            {job.title}
                                                        </option>
                                                    ))}
                                                    <option value={OTHER}>
                                                        Other (please specify)
                                                    </option>
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-5 h-4 w-4 -translate-y-1/2 text-white/40" />
                                            </div>
                                            <FieldError
                                                message={formErrors.job_post_id}
                                            />
                                        </div>
                                    )}

                                    {needsCustomPosition && (
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="custom_position"
                                                className={labelClass}
                                            >
                                                {hasJobs
                                                    ? 'Please Specify the Position'
                                                    : 'Desired Position'}
                                            </label>
                                            <input
                                                id="custom_position"
                                                type="text"
                                                maxLength={255}
                                                value={data.custom_position}
                                                onChange={(e) => {
                                                    clearErrors(
                                                        'custom_position',
                                                    );
                                                    setData(
                                                        'custom_position',
                                                        e.target.value,
                                                    );
                                                }}
                                                className={inputClass}
                                                placeholder="e.g. Site Engineer, Accountant, Architect"
                                                required
                                            />
                                            <FieldError
                                                message={
                                                    formErrors.custom_position
                                                }
                                            />
                                        </div>
                                    )}

                                    {/* Name + Email */}
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="name"
                                                className={labelClass}
                                            >
                                                Full Name
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                maxLength={255}
                                                autoComplete="name"
                                                value={data.name}
                                                onChange={(e) => {
                                                    clearErrors('name');
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    );
                                                }}
                                                className={inputClass}
                                                placeholder="Your full name"
                                                required
                                            />
                                            <FieldError
                                                message={formErrors.name}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="email"
                                                className={labelClass}
                                            >
                                                Email Address
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                maxLength={255}
                                                autoComplete="email"
                                                value={data.email}
                                                onChange={(e) => {
                                                    clearErrors('email');
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    );
                                                }}
                                                className={inputClass}
                                                placeholder="you@example.com"
                                                required
                                            />
                                            <FieldError
                                                message={formErrors.email}
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="phone"
                                            className={labelClass}
                                        >
                                            Mobile Number
                                        </label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            inputMode="numeric"
                                            autoComplete="tel"
                                            maxLength={11}
                                            pattern="01[3-9][0-9]{8}"
                                            value={data.phone}
                                            onChange={(e) => {
                                                clearErrors('phone');
                                                setData(
                                                    'phone',
                                                    e.target.value
                                                        .replace(/\D/g, '')
                                                        .slice(0, 11),
                                                );
                                            }}
                                            className={inputClass}
                                            placeholder="01XXXXXXXXX"
                                            required
                                        />
                                        <p className="text-xs text-white/30">
                                            11-digit Bangladeshi mobile number,
                                            e.g. 017XXXXXXXX
                                        </p>
                                        <FieldError
                                            message={formErrors.phone}
                                        />
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="message"
                                            className={labelClass}
                                        >
                                            Cover Letter
                                        </label>
                                        <textarea
                                            id="message"
                                            rows={6}
                                            maxLength={5000}
                                            value={data.message}
                                            onChange={(e) => {
                                                clearErrors('message');
                                                setData(
                                                    'message',
                                                    e.target.value,
                                                );
                                            }}
                                            className={`${inputClass} resize-none`}
                                            placeholder="Briefly introduce yourself, your experience and why you would like to join us..."
                                            required
                                        />
                                        <FieldError
                                            message={formErrors.message}
                                        />
                                    </div>

                                    {/* CV upload */}
                                    <div className="space-y-2">
                                        <span className={labelClass}>
                                            Upload CV
                                        </span>
                                        <label
                                            htmlFor="cv"
                                            className={`group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-5 py-8 text-center transition-all duration-300 ${
                                                data.cv
                                                    ? 'border-primary/50 bg-primary/5'
                                                    : 'border-white/10 bg-white/[0.03] hover:border-primary/40 hover:bg-white/5'
                                            }`}
                                        >
                                            <input
                                                ref={cvInputRef}
                                                id="cv"
                                                type="file"
                                                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                onChange={handleCv}
                                                className="sr-only"
                                            />
                                            {data.cv ? (
                                                <>
                                                    <FileText className="h-8 w-8 text-primary" />
                                                    <span className="text-sm font-semibold break-all text-white">
                                                        {data.cv.name}
                                                    </span>
                                                    <span className="text-xs text-white/40">
                                                        {(
                                                            data.cv.size /
                                                            1024 /
                                                            1024
                                                        ).toFixed(2)}{' '}
                                                        MB · Click to change
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="h-8 w-8 text-white/30 transition-colors group-hover:text-primary" />
                                                    <span className="text-sm text-white/60">
                                                        Click to upload your CV
                                                    </span>
                                                    <span className="text-xs text-white/30">
                                                        PDF or DOCX only · Max 5
                                                        MB
                                                    </span>
                                                </>
                                            )}
                                        </label>
                                        <FieldError message={formErrors.cv} />
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
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4" />
                                                Submit Application
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </ScrollAnimation>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default Career;
