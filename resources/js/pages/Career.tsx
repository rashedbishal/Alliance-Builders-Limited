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
import type { LucideIcon } from 'lucide-react';
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

type FormErrorKey = keyof ApplicationForm | 'form';
type FormErrors = Partial<Record<FormErrorKey, string>>;

const OTHER = 'other';
const CV_MAX_BYTES = 5 * 1024 * 1024;
const CV_EXTENSIONS = ['pdf', 'docx'];
const MESSAGE_MAX = 5000;
const PHONE_REGEX = /^01[3-9]\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CLOSING_SOON_DAYS = 7;
const DEFAULT_HERO =
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&h=900&fit=crop';

/** Order in which fields appear on the form — used to focus the first error. */
const FIELD_ORDER: FormErrorKey[] = [
    'form',
    'job_post_id',
    'custom_position',
    'name',
    'email',
    'phone',
    'message',
    'cv',
];

/* ── Side panel copy (pending client approval) ── */
const HIRING_STEPS = [
    {
        title: 'Apply Online',
        desc: 'Submit the form with your CV. It only takes a few minutes.',
    },
    {
        title: 'Application Review',
        desc: 'Our HR team reviews every application against the requirements of the role.',
    },
    {
        title: 'Interview',
        desc: 'Shortlisted candidates are contacted by phone or email to schedule an interview.',
    },
    {
        title: 'Offer & Onboarding',
        desc: 'Successful candidates receive an offer and a warm welcome to the team.',
    },
];

const APPLY_TIPS = [
    {
        title: 'Keep your CV up to date',
        desc: 'PDF or DOCX format, no larger than 5 MB.',
    },
    {
        title: 'Use an active phone number and email',
        desc: 'This is how our team will reach you about your application.',
    },
    {
        title: 'Tailor your cover letter',
        desc: 'Mention the role and the experience that makes you a good fit.',
    },
];

const formatDate = (iso: string) =>
    new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

/** Whole days from today until the given date (0 = today). */
const daysUntil = (iso: string) => {
    const target = new Date(`${iso.slice(0, 10)}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((target.getTime() - today.getTime()) / 86_400_000);
};

const deadlineInfo = (iso: string) => {
    const days = daysUntil(iso);
    if (days <= 0) return { text: 'Closes today', soon: true };
    if (days === 1) return { text: 'Closes tomorrow', soon: true };
    if (days <= CLOSING_SOON_DAYS)
        return { text: `Closes in ${days} days`, soon: true };
    return { text: `Apply by ${formatDate(iso)}`, soon: false };
};

const vacancyLabel = (vacancies: number | null) =>
    vacancies ? `${vacancies} Vacanc${vacancies === 1 ? 'y' : 'ies'}` : null;

/** Split the CMS heading so its last word gets the brand gradient. */
const splitHeading = (heading: string) => {
    const trimmed = heading.trim();
    const idx = trimmed.lastIndexOf(' ');
    return idx === -1
        ? { lead: '', accent: trimmed }
        : { lead: trimmed.slice(0, idx), accent: trimmed.slice(idx + 1) };
};

function FieldError({ id, message }: { id?: string; message?: string }) {
    return message ? (
        <p id={id} className="text-xs text-red-400">
            {message}
        </p>
    ) : null;
}

/** Compact chip row used on the openings list. */
function JobMeta({ job }: { job: Job }) {
    const items = [
        { icon: Building2, value: job.department },
        { icon: MapPin, value: job.location },
        { icon: Clock, value: job.job_type },
        { icon: Users, value: vacancyLabel(job.vacancies) },
    ].filter((i) => i.value);

    if (items.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {items.map(({ icon: Icon, value }, i) => (
                <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
                >
                    <Icon className="h-3.5 w-3.5 text-primary-light" />
                    {value}
                </span>
            ))}
        </div>
    );
}

/** Labelled detail grid used in the job details dialog. */
function JobDetailsGrid({ job }: { job: Job }) {
    const items: { icon: LucideIcon; label: string; value: string | null }[] = [
        { icon: Building2, label: 'Department', value: job.department },
        { icon: MapPin, label: 'Location', value: job.location },
        { icon: Clock, label: 'Job Type', value: job.job_type },
        {
            icon: Users,
            label: 'Vacancies',
            value: job.vacancies ? String(job.vacancies) : null,
        },
        { icon: Briefcase, label: 'Experience', value: job.experience },
        { icon: Wallet, label: 'Salary', value: job.salary },
    ];
    const visible = items.filter((i) => i.value);

    if (visible.length === 0) return null;

    return (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {visible.map(({ icon: Icon, label, value }) => (
                <div
                    key={label}
                    className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3"
                >
                    <dt className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                        <Icon className="h-3.5 w-3.5 text-primary-light" />
                        {label}
                    </dt>
                    <dd className="text-sm font-medium break-words text-white">
                        {value}
                    </dd>
                </div>
            ))}
        </dl>
    );
}

const Career = ({ settings, jobs }: Props) => {
    const hasJobs = jobs.length > 0;
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [highlightPosition, setHighlightPosition] = useState(false);
    const [draggingCv, setDraggingCv] = useState(false);
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

    const formErrors = errors as FormErrors;
    const needsCustomPosition = !hasJobs || data.job_post_id === OTHER;

    const heading = splitHeading(
        settings.heading || 'Build Your Career With Us',
    );

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    /** Scroll to (and focus) the first field that has an error. */
    const focusFirstError = (errs: FormErrors) => {
        const key = FIELD_ORDER.find((k) => errs[k]);
        if (!key) return;
        // Wait a frame so conditionally rendered fields/messages are in the DOM.
        requestAnimationFrame(() => {
            if (key === 'form') {
                scrollToForm();
                return;
            }
            const target =
                key === 'cv'
                    ? document.getElementById('cv-dropzone')
                    : document.getElementById(key);
            if (!target) return;
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const focusable = key === 'cv' ? cvInputRef.current : target;
            focusable?.focus({ preventScroll: true });
        });
    };

    const applyFor = (job: Job) => {
        setData('job_post_id', String(job.id));
        clearErrors('job_post_id', 'custom_position');
        setSelectedJob(null);
        // Wait for the dialog close animation before scrolling, then briefly
        // highlight the pre-selected position so the change is noticeable.
        setTimeout(() => {
            scrollToForm();
            setHighlightPosition(true);
            setTimeout(() => setHighlightPosition(false), 1800);
        }, 200);
    };

    const processCv = (file: File | null) => {
        if (!file) {
            setData('cv', null);
            return;
        }
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        const error = !CV_EXTENSIONS.includes(ext)
            ? 'Your CV must be a PDF or DOCX file.'
            : file.size > CV_MAX_BYTES
              ? 'Your CV must not be larger than 5 MB.'
              : null;
        if (error) {
            setError('cv', error);
            setData('cv', null);
            if (cvInputRef.current) cvInputRef.current.value = '';
            return;
        }
        clearErrors('cv');
        setData('cv', file);
    };

    const handleCv = (e: React.ChangeEvent<HTMLInputElement>) => {
        processCv(e.target.files?.[0] ?? null);
    };

    const handleCvDrag = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDraggingCv(true);
        } else if (e.type === 'dragleave') {
            setDraggingCv(false);
        }
    };

    const handleCvDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setDraggingCv(false);
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        // Clear any earlier click-selected file so the input and state agree.
        if (cvInputRef.current) cvInputRef.current.value = '';
        processCv(file);
    };

    const validate = (): FormErrors => {
        const errs: FormErrors = {};
        if (hasJobs && !data.job_post_id) {
            errs.job_post_id =
                'Please select the position you are applying for.';
        }
        if (needsCustomPosition && !data.custom_position.trim()) {
            errs.custom_position =
                'Please enter the position you are applying for.';
        }
        if (!data.name.trim()) {
            errs.name = 'Please enter your full name.';
        }
        if (!data.email.trim()) {
            errs.email = 'Please enter your email address.';
        } else if (!EMAIL_REGEX.test(data.email.trim())) {
            errs.email = 'Please enter a valid email address.';
        }
        if (!PHONE_REGEX.test(data.phone)) {
            errs.phone =
                'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).';
        }
        if (!data.message.trim()) {
            errs.message = 'Please write a short cover letter.';
        }
        if (!data.cv) {
            errs.cv = 'Please upload your CV (PDF or DOCX).';
        }
        return errs;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        const clientErrors = validate();
        if (Object.keys(clientErrors).length > 0) {
            setError(clientErrors as Record<keyof ApplicationForm, string>);
            focusFirstError(clientErrors);
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
            onError: (serverErrors) => focusFirstError(serverErrors),
        });
    };

    /** Shared a11y props for a field that can show an error. */
    const fieldA11y = (key: keyof ApplicationForm, hintId?: string) => {
        const errorId = formErrors[key] ? `${key}-error` : undefined;
        const describedBy = [hintId, errorId].filter(Boolean).join(' ');
        return {
            'aria-invalid': formErrors[key] ? true : undefined,
            'aria-describedby': describedBy || undefined,
        };
    };

    const inputClass = `
        w-full rounded-xl border border-white/10 bg-white/5
        px-5 py-4 text-white placeholder-white/30
        outline-none transition-all duration-300
        focus:border-primary focus:bg-white/8 focus:ring-1 focus:ring-primary/50
        hover:border-white/20
        aria-invalid:border-red-400/50
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
                .job-description li::marker { color: var(--color-primary-light); }
                .job-description a { color: var(--color-primary-light); text-decoration: underline; }
                .job-description blockquote { border-left: 3px solid var(--color-primary); padding-left: 1rem; color: rgba(255,255,255,0.55); font-style: italic; }
                .job-description strong, .job-description b { color: #fff; }
                .job-description hr { border-color: rgba(255,255,255,0.1); }
            `}</style>

            <div className="min-h-screen bg-[#060810]">
                {/* ── Success Dialog ── */}
                <DialogPrimitive.Root
                    open={showSuccess}
                    onOpenChange={setShowSuccess}
                >
                    <DialogPrimitive.Portal>
                        <DialogPrimitive.Overlay
                            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-5"
                            style={{
                                background: 'rgba(0,0,0,0.75)',
                                backdropFilter: 'blur(6px)',
                            }}
                        >
                            <DialogPrimitive.Content
                                className="shadow-elegant-xl relative w-full max-w-md rounded-2xl border border-primary/20 p-12 text-center outline-none"
                                style={{
                                    background:
                                        'linear-gradient(135deg, hsl(210,77%,10%), hsl(210,77%,15%))',
                                    animation:
                                        'popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                }}
                            >
                                <DialogPrimitive.Close
                                    className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 transition-all hover:bg-white/10 hover:text-white"
                                    aria-label="Close"
                                >
                                    <X size={15} />
                                </DialogPrimitive.Close>

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

                                <DialogPrimitive.Title className="mb-3 text-2xl font-bold text-white">
                                    Application Submitted!
                                </DialogPrimitive.Title>
                                <DialogPrimitive.Description asChild>
                                    <div>
                                        <p className="mb-1 text-sm leading-relaxed text-white/50">
                                            Thank you for your interest in
                                            joining{' '}
                                            <strong className="text-primary-light">
                                                Alliance Builders Limited
                                            </strong>
                                            .
                                        </p>
                                        <p className="mb-8 text-xs text-white/30">
                                            Our team will review your
                                            application and contact you if your
                                            profile matches our requirements.
                                        </p>
                                    </div>
                                </DialogPrimitive.Description>

                                <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                                <DialogPrimitive.Close className="bg-gradient-primary shadow-elegant-lg rounded-xl px-10 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:opacity-90">
                                    Close
                                </DialogPrimitive.Close>
                            </DialogPrimitive.Content>
                        </DialogPrimitive.Overlay>
                    </DialogPrimitive.Portal>
                </DialogPrimitive.Root>

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
                                        <p className="mb-2 text-xs font-bold tracking-[0.3em] text-primary-light uppercase">
                                            Job Opening
                                        </p>
                                        <DialogPrimitive.Title className="text-2xl font-bold text-white md:text-3xl">
                                            {selectedJob.title}
                                        </DialogPrimitive.Title>
                                        <DialogPrimitive.Close
                                            className="absolute top-6 right-6 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all hover:bg-white/10 hover:text-white"
                                            aria-label="Close"
                                        >
                                            <X size={16} />
                                        </DialogPrimitive.Close>
                                    </div>

                                    <div className="flex-1 space-y-8 overflow-y-auto p-6 md:p-8">
                                        <DialogPrimitive.Description asChild>
                                            <div>
                                                <JobDetailsGrid
                                                    job={selectedJob}
                                                />
                                            </div>
                                        </DialogPrimitive.Description>
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
                                                    <CalendarClock className="h-4 w-4 text-primary-light" />
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
                    className="relative min-h-screen overflow-hidden pt-58 pb-24"
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
                                <span className="bg-gradient-to-r from-primary-light to-accent-light bg-clip-text text-transparent">
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
                                <p className="mb-2 text-xs font-bold tracking-[0.3em] text-primary-light uppercase">
                                    Join Our Team
                                </p>
                                <h2 className="text-3xl font-bold text-white md:text-4xl">
                                    Current Openings
                                </h2>
                                <div className="bg-gradient-primary mt-4 h-px w-16" />
                            </div>
                        </ScrollAnimation>

                        {hasJobs ? (
                            <ul className="space-y-4">
                                {jobs.map((job, index) => {
                                    const deadline = job.deadline
                                        ? deadlineInfo(job.deadline)
                                        : null;
                                    return (
                                        <li key={job.id}>
                                            <ScrollAnimation
                                                delay={
                                                    Math.min(index, 5) * 0.08
                                                }
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedJob(job)
                                                    }
                                                    className="group flex w-full flex-col gap-5 rounded-2xl border border-white/8 bg-white/[0.03] p-6 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/[0.06] md:flex-row md:items-center md:justify-between md:gap-8 md:px-8"
                                                >
                                                    <div className="flex min-w-0 items-start gap-5">
                                                        <div className="bg-gradient-primary shadow-elegant inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                                                            <Briefcase className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div className="min-w-0 space-y-3">
                                                            <h3 className="text-xl font-bold break-words text-white transition-colors group-hover:text-primary-light">
                                                                {job.title}
                                                            </h3>
                                                            <JobMeta
                                                                job={job}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-4 md:flex-col md:items-end md:justify-center md:border-0 md:pt-0">
                                                        {deadline && (
                                                            <span
                                                                className={
                                                                    deadline.soon
                                                                        ? 'inline-flex items-center gap-1.5 rounded-full border border-primary-light/40 bg-primary-light/15 px-3 py-1 text-[11px] font-semibold text-white'
                                                                        : 'inline-flex items-center gap-1.5 rounded-full border border-primary-light/20 bg-primary-light/10 px-3 py-1 text-[11px] font-semibold text-primary-light'
                                                                }
                                                            >
                                                                {deadline.soon ? (
                                                                    <span className="relative flex h-2 w-2">
                                                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-light opacity-75" />
                                                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-light" />
                                                                    </span>
                                                                ) : (
                                                                    <CalendarClock className="h-3.5 w-3.5" />
                                                                )}
                                                                {deadline.text}
                                                            </span>
                                                        )}
                                                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-light">
                                                            View Details
                                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                        </span>
                                                    </div>
                                                </button>
                                            </ScrollAnimation>
                                        </li>
                                    );
                                })}
                            </ul>
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
                                        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary-light hover:underline"
                                    >
                                        Submit Your CV
                                        <ArrowRight className="h-4 w-4" />
                                    </a>
                                </div>
                            </ScrollAnimation>
                        )}
                    </div>
                </section>

                {/* ── Application Form + Side Panel ── */}
                <section id="apply" className="scroll-mt-24 py-16 pb-32">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
                            {/* Form (3 cols) */}
                            <ScrollAnimation className="lg:col-span-3">
                                <div
                                    ref={formRef}
                                    className="scroll-mt-24 rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10"
                                >
                                    <div className="mb-10">
                                        <p className="mb-2 text-xs font-bold tracking-[0.3em] text-primary-light uppercase">
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
                                        noValidate
                                    >
                                        {formErrors.form && (
                                            <div
                                                role="alert"
                                                className="rounded-xl border border-red-400/30 bg-red-400/10 px-5 py-3 text-sm text-red-300"
                                            >
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
                                                        className={
                                                            highlightPosition
                                                                ? `${inputClass} cursor-pointer appearance-none border-primary-light! bg-primary/10! pr-12 ring-2 ring-primary-light/50 [&>option]:bg-[#0b1220] [&>option]:text-white`
                                                                : `${inputClass} cursor-pointer appearance-none pr-12 [&>option]:bg-[#0b1220] [&>option]:text-white`
                                                        }
                                                        required
                                                        {...fieldA11y(
                                                            'job_post_id',
                                                        )}
                                                    >
                                                        <option
                                                            value=""
                                                            disabled
                                                        >
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
                                                            Other (please
                                                            specify)
                                                        </option>
                                                    </select>
                                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-5 h-4 w-4 -translate-y-1/2 text-white/40" />
                                                </div>
                                                <FieldError
                                                    id="job_post_id-error"
                                                    message={
                                                        formErrors.job_post_id
                                                    }
                                                />
                                            </div>
                                        )}

                                        {needsCustomPosition && (
                                            <div
                                                className={
                                                    hasJobs
                                                        ? 'space-y-2 duration-300 animate-in fade-in-0 slide-in-from-top-2'
                                                        : 'space-y-2'
                                                }
                                            >
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
                                                    {...fieldA11y(
                                                        'custom_position',
                                                    )}
                                                />
                                                <FieldError
                                                    id="custom_position-error"
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
                                                    {...fieldA11y('name')}
                                                />
                                                <FieldError
                                                    id="name-error"
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
                                                    {...fieldA11y('email')}
                                                />
                                                <FieldError
                                                    id="email-error"
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
                                                {...fieldA11y(
                                                    'phone',
                                                    'phone-hint',
                                                )}
                                            />
                                            <p
                                                id="phone-hint"
                                                className="text-xs text-white/30"
                                            >
                                                11-digit Bangladeshi mobile
                                                number, e.g. 017XXXXXXXX
                                            </p>
                                            <FieldError
                                                id="phone-error"
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
                                                maxLength={MESSAGE_MAX}
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
                                                {...fieldA11y('message')}
                                            />
                                            <div className="flex items-start justify-between gap-4">
                                                <FieldError
                                                    id="message-error"
                                                    message={formErrors.message}
                                                />
                                                <span
                                                    className={
                                                        data.message.length >=
                                                        MESSAGE_MAX * 0.9
                                                            ? 'ml-auto shrink-0 text-xs text-white/60 tabular-nums'
                                                            : 'ml-auto shrink-0 text-xs text-white/30 tabular-nums'
                                                    }
                                                >
                                                    {data.message.length}/
                                                    {MESSAGE_MAX}
                                                </span>
                                            </div>
                                        </div>

                                        {/* CV upload */}
                                        <div className="space-y-2">
                                            <span className={labelClass}>
                                                Upload CV
                                            </span>
                                            <label
                                                id="cv-dropzone"
                                                htmlFor="cv"
                                                onDragEnter={handleCvDrag}
                                                onDragOver={handleCvDrag}
                                                onDragLeave={handleCvDrag}
                                                onDrop={handleCvDrop}
                                                className={
                                                    draggingCv
                                                        ? 'group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-primary-light bg-primary/10 px-5 py-8 text-center transition-all duration-300 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-primary-light/50 [&>*]:pointer-events-none'
                                                        : data.cv
                                                          ? 'group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 px-5 py-8 text-center transition-all duration-300 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-primary-light/50 [&>*]:pointer-events-none'
                                                          : formErrors.cv
                                                            ? 'group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-red-400/40 bg-white/[0.03] px-5 py-8 text-center transition-all duration-300 hover:border-primary/40 hover:bg-white/5 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-primary-light/50 [&>*]:pointer-events-none'
                                                            : 'group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.03] px-5 py-8 text-center transition-all duration-300 hover:border-primary/40 hover:bg-white/5 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-primary-light/50 [&>*]:pointer-events-none'
                                                }
                                            >
                                                <input
                                                    ref={cvInputRef}
                                                    id="cv"
                                                    type="file"
                                                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                    onChange={handleCv}
                                                    className="sr-only"
                                                    {...fieldA11y('cv')}
                                                />
                                                {data.cv ? (
                                                    <>
                                                        <FileText className="h-8 w-8 text-primary-light" />
                                                        <span className="text-sm font-semibold break-all text-white">
                                                            {data.cv.name}
                                                        </span>
                                                        <span className="text-xs text-white/40">
                                                            {(
                                                                data.cv.size /
                                                                1024 /
                                                                1024
                                                            ).toFixed(2)}{' '}
                                                            MB · Click or drop
                                                            to change
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload
                                                            className={
                                                                draggingCv
                                                                    ? 'h-8 w-8 text-primary-light transition-colors'
                                                                    : 'h-8 w-8 text-white/30 transition-colors group-hover:text-primary-light'
                                                            }
                                                        />
                                                        <span className="text-sm text-white/60">
                                                            {draggingCv
                                                                ? 'Drop your CV here'
                                                                : 'Click to upload or drag & drop your CV'}
                                                        </span>
                                                        <span className="text-xs text-white/30">
                                                            PDF or DOCX only ·
                                                            Max 5 MB
                                                        </span>
                                                    </>
                                                )}
                                            </label>
                                            <FieldError
                                                id="cv-error"
                                                message={formErrors.cv}
                                            />
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

                            {/* Side panel (2 cols) */}
                            <div className="flex flex-col gap-6 lg:col-span-2">
                                {/* How we hire */}
                                <ScrollAnimation delay={0.15}>
                                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
                                        <p className="mb-2 text-xs font-bold tracking-[0.3em] text-primary-light uppercase">
                                            The Process
                                        </p>
                                        <h3 className="mb-6 text-2xl font-bold text-white">
                                            How We Hire
                                        </h3>
                                        <ol className="relative space-y-6 before:absolute before:top-3 before:bottom-3 before:left-[15px] before:w-px before:bg-gradient-to-b before:from-primary/50 before:via-primary/20 before:to-transparent">
                                            {HIRING_STEPS.map((step, i) => (
                                                <li
                                                    key={step.title}
                                                    className="relative flex items-start gap-4"
                                                >
                                                    <div className="bg-gradient-primary shadow-elegant-sm flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white">
                                                        {String(i + 1).padStart(
                                                            2,
                                                            '0',
                                                        )}
                                                    </div>
                                                    <div className="pt-1">
                                                        <p className="mb-0.5 text-sm font-semibold text-white">
                                                            {step.title}
                                                        </p>
                                                        <p className="text-xs leading-relaxed text-white/40">
                                                            {step.desc}
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </ScrollAnimation>

                                {/* Before you apply */}
                                <ScrollAnimation delay={0.25}>
                                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
                                        <p className="mb-2 text-xs font-bold tracking-[0.3em] text-primary-light uppercase">
                                            Quick Tips
                                        </p>
                                        <h3 className="mb-6 text-2xl font-bold text-white">
                                            Before You Apply
                                        </h3>
                                        <ul className="space-y-5">
                                            {[
                                                ...APPLY_TIPS,
                                                hasJobs
                                                    ? {
                                                          title: "Don't see the right role?",
                                                          desc: 'Choose “Other” in the position list and tell us the role you are interested in.',
                                                      }
                                                    : {
                                                          title: 'Tell us what you are looking for',
                                                          desc: 'Enter your desired position and we will be in touch when a suitable opportunity opens up.',
                                                      },
                                            ].map((item) => (
                                                <li
                                                    key={item.title}
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
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default Career;
