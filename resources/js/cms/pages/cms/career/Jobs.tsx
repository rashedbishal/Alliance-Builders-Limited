import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import RichTextEditor from '@/cms/components/RichTextEditor';
import CMSLayout from '@/cms/layouts/CMSLayout';
import type { JobPost } from '@/cms/types/cms';

interface Props {
    jobs: JobPost[];
    jobTypes: string[];
}

interface FormFields {
    job_post_id: number | null;
    title: string;
    department: string;
    location: string;
    job_type: string;
    vacancies: string;
    experience: string;
    salary: string;
    deadline: string;
    description: string;
    notification_email: string;
    is_active: boolean;
}

const errorStyle: React.CSSProperties = {
    marginTop: 4,
    display: 'block',
    color: '#FF8080',
    fontSize: '0.78rem',
};

const hintStyle: React.CSSProperties = {
    marginTop: 4,
    display: 'block',
    color: 'var(--muted)',
    fontSize: '0.72rem',
};

const todayIso = () => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const isExpired = (deadline: string | null) =>
    !!deadline && deadline < todayIso();

const formatDate = (iso: string) =>
    new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

function FieldError({ message }: { message?: string }) {
    return message ? <span style={errorStyle}>{message}</span> : null;
}

function JobForm({
    job,
    jobTypes,
    onDone,
}: {
    job?: JobPost;
    jobTypes: string[];
    onDone?: () => void;
}) {
    const isEdit = !!job;
    const { data, setData, post, processing, errors, clearErrors, reset } =
        useForm<FormFields>({
            job_post_id: job?.id ?? null,
            title: job?.title ?? '',
            department: job?.department ?? '',
            location: job?.location ?? '',
            job_type: job?.job_type ?? '',
            vacancies: job?.vacancies ? String(job.vacancies) : '',
            experience: job?.experience ?? '',
            salary: job?.salary ?? '',
            deadline: job?.deadline ?? '',
            description: job?.description ?? '',
            notification_email: job?.notification_email ?? '',
            is_active: job?.is_active ?? true,
        });

    const set = <K extends keyof FormFields>(key: K, value: FormFields[K]) => {
        clearErrors(key);
        (setData as (k: K, v: FormFields[K]) => void)(key, value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route(isEdit ? 'career-job-update' : 'career-job-store'), {
            preserveScroll: true,
            onSuccess: () => {
                if (!isEdit) reset();
                onDone?.();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-row cols-3">
                <div className="form-group">
                    <label>
                        Job Title <span style={{ color: '#FF8080' }}>*</span>
                    </label>
                    <input
                        type="text"
                        required
                        maxLength={255}
                        value={data.title}
                        onChange={(e) => set('title', e.target.value)}
                        placeholder="e.g. Site Engineer (Civil)"
                    />
                    <FieldError message={errors.title} />
                </div>
                <div className="form-group">
                    <label>
                        Department <span style={{ color: '#FF8080' }}>*</span>
                    </label>
                    <input
                        type="text"
                        required
                        maxLength={255}
                        value={data.department}
                        onChange={(e) => set('department', e.target.value)}
                        placeholder="e.g. Engineering"
                    />
                    <FieldError message={errors.department} />
                </div>
                <div className="form-group">
                    <label>
                        Location <span style={{ color: '#FF8080' }}>*</span>
                    </label>
                    <input
                        type="text"
                        required
                        maxLength={255}
                        value={data.location}
                        onChange={(e) => set('location', e.target.value)}
                        placeholder="e.g. Dhaka Head Office"
                    />
                    <FieldError message={errors.location} />
                </div>
            </div>

            <div className="form-row cols-4">
                <div className="form-group">
                    <label>
                        Job Type <span style={{ color: '#FF8080' }}>*</span>
                    </label>
                    <select
                        required
                        value={data.job_type}
                        onChange={(e) => set('job_type', e.target.value)}
                    >
                        <option value="" disabled>
                            — Select job type —
                        </option>
                        {jobTypes.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                    <FieldError message={errors.job_type} />
                </div>
                <div className="form-group">
                    <label>
                        Vacancies <span style={{ color: '#FF8080' }}>*</span>
                    </label>
                    <input
                        type="number"
                        required
                        min={1}
                        max={9999}
                        value={data.vacancies}
                        onChange={(e) => set('vacancies', e.target.value)}
                        placeholder="e.g. 2"
                    />
                    <FieldError message={errors.vacancies} />
                </div>
                <div className="form-group">
                    <label>
                        Experience <span style={{ color: '#FF8080' }}>*</span>
                    </label>
                    <input
                        type="text"
                        required
                        maxLength={255}
                        value={data.experience}
                        onChange={(e) => set('experience', e.target.value)}
                        placeholder="e.g. 3-5 years"
                    />
                    <FieldError message={errors.experience} />
                </div>
                <div className="form-group">
                    <label>
                        Salary <span style={{ color: '#FF8080' }}>*</span>
                    </label>
                    <input
                        type="text"
                        required
                        maxLength={255}
                        value={data.salary}
                        onChange={(e) => set('salary', e.target.value)}
                        placeholder="e.g. Negotiable"
                    />
                    <FieldError message={errors.salary} />
                </div>
            </div>

            <div className="form-row cols-2">
                <div className="form-group">
                    <label>
                        Application Deadline{' '}
                        <span style={{ color: '#FF8080' }}>*</span>
                    </label>
                    <input
                        type="date"
                        required
                        value={data.deadline}
                        onChange={(e) => set('deadline', e.target.value)}
                    />
                    <span style={hintStyle}>
                        The post is hidden from the Career page automatically
                        after this date.
                    </span>
                    <FieldError message={errors.deadline} />
                </div>
                <div className="form-group">
                    <label>
                        Notification Email{' '}
                        <span style={{ color: '#FF8080' }}>*</span>
                    </label>
                    <input
                        type="email"
                        required
                        inputMode="email"
                        maxLength={255}
                        value={data.notification_email}
                        onChange={(e) =>
                            set('notification_email', e.target.value)
                        }
                        placeholder="e.g. hr@alliancebuildersltd.org"
                    />
                    <span style={hintStyle}>
                        Every application for this job is emailed here with the
                        CV attached.
                    </span>
                    <FieldError message={errors.notification_email} />
                </div>
            </div>

            <div className="form-group">
                <label>
                    Job Description <span style={{ color: '#FF8080' }}>*</span>
                </label>
                <RichTextEditor
                    value={data.description}
                    onChange={(html) => set('description', html)}
                    placeholder="Overview, responsibilities, requirements, benefits..."
                />
                <FieldError message={errors.description} />
            </div>

            <div className="form-group">
                <label>Visibility</label>
                <div
                    className="toggle-switch"
                    onClick={() => set('is_active', !data.is_active)}
                >
                    <div
                        className={
                            data.is_active
                                ? 'toggle-slider on'
                                : 'toggle-slider'
                        }
                    />
                    <span
                        className={
                            data.is_active ? 'toggle-label on' : 'toggle-label'
                        }
                    >
                        {data.is_active
                            ? 'Active — shown on the Career page'
                            : 'Inactive — hidden from the Career page'}
                    </span>
                </div>
                <FieldError message={errors.is_active} />
            </div>

            <button type="submit" className="btn-primary" disabled={processing}>
                {processing
                    ? 'Saving...'
                    : isEdit
                      ? 'Update Job Post'
                      : 'Publish Job Post'}
            </button>
        </form>
    );
}

function StatusBadge({ job }: { job: JobPost }) {
    let label = 'Live';
    let color = '#5FD38D';
    let bg = 'rgba(95,211,141,0.12)';
    let border = 'rgba(95,211,141,0.35)';

    if (!job.is_active) {
        label = 'Inactive';
        color = 'var(--muted)';
        bg = 'var(--surface2)';
        border = 'var(--border)';
    } else if (isExpired(job.deadline)) {
        label = 'Expired';
        color = '#FF8080';
        bg = 'rgba(255,80,80,0.1)';
        border = 'rgba(255,80,80,0.3)';
    }

    return (
        <span
            className="badge"
            style={{ color, background: bg, borderColor: border }}
        >
            {label}
        </span>
    );
}

function JobCard({ job, jobTypes }: { job: JobPost; jobTypes: string[] }) {
    const [editing, setEditing] = useState(false);
    const [busy, setBusy] = useState(false);

    const toggle = () => {
        setBusy(true);
        router.post(
            route('career-job-toggle'),
            { job_post_id: job.id },
            { preserveScroll: true, onFinish: () => setBusy(false) },
        );
    };

    const confirmDelete = () => {
        const count = job.applications_count ?? 0;
        const extra =
            count > 0
                ? `\n\nIts ${count} application${count === 1 ? '' : 's'} will be kept under Career → Applications.`
                : '';
        if (
            !confirm(
                `Delete the job post "${job.title}"? This cannot be undone.${extra}`,
            )
        ) {
            return;
        }
        setBusy(true);
        router.post(
            route('career-job-destroy'),
            { job_post_id: job.id },
            { preserveScroll: true, onFinish: () => setBusy(false) },
        );
    };

    if (editing) {
        return (
            <div className="banner-card">
                <div className="banner-num">EDITING</div>
                <JobForm
                    job={job}
                    jobTypes={jobTypes}
                    onDone={() => setEditing(false)}
                />
                <button
                    type="button"
                    className="btn-secondary"
                    style={{ marginTop: 12 }}
                    onClick={() => setEditing(false)}
                >
                    Cancel
                </button>
            </div>
        );
    }

    const meta = [
        job.department,
        job.location,
        job.job_type,
        job.vacancies
            ? `${job.vacancies} vacanc${job.vacancies === 1 ? 'y' : 'ies'}`
            : null,
        job.experience,
        job.salary,
    ].filter(Boolean);

    return (
        <div className="banner-card" style={{ opacity: busy ? 0.5 : 1 }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 16,
                    flexWrap: 'wrap',
                }}
            >
                <div style={{ flex: 1, minWidth: 220 }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            flexWrap: 'wrap',
                        }}
                    >
                        <span
                            style={{
                                fontWeight: 700,
                                color: 'var(--text)',
                                fontSize: '1rem',
                            }}
                        >
                            {job.title}
                        </span>
                        <StatusBadge job={job} />
                    </div>
                    {meta.length > 0 && (
                        <div
                            style={{
                                marginTop: 6,
                                fontSize: '0.78rem',
                                color: 'var(--gold-light)',
                            }}
                        >
                            {meta.join(' · ')}
                        </div>
                    )}
                    <div
                        style={{
                            marginTop: 8,
                            fontSize: '0.75rem',
                            color: 'var(--muted)',
                            display: 'flex',
                            gap: 16,
                            flexWrap: 'wrap',
                        }}
                    >
                        <span>
                            Deadline:{' '}
                            {job.deadline ? formatDate(job.deadline) : 'None'}
                        </span>
                        <span>Applications: {job.applications_count ?? 0}</span>
                        <span>
                            Email: {job.notification_email || 'Not set'}
                        </span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '8px 16px' }}
                        onClick={() => setEditing(true)}
                        disabled={busy}
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '8px 16px' }}
                        onClick={toggle}
                        disabled={busy}
                    >
                        {job.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                        type="button"
                        className="btn-danger"
                        onClick={confirmDelete}
                        disabled={busy}
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CareerJobs({ jobs, jobTypes }: Props) {
    return (
        <CMSLayout title="Job Posts" breadcrumb="Career / Job Posts">
            <div className="page-header">
                <h2>Job Posts</h2>
                <p>
                    Create and manage the job openings shown on the Career page
                </p>
                <div className="gold-line" />
            </div>

            <div className="section-card">
                <div className="section-title">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add New Job Post
                </div>
                <JobForm jobTypes={jobTypes} />
            </div>

            <div className="section-card">
                <div className="section-title">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                    Existing Job Posts
                    <span className="badge" style={{ marginLeft: 'auto' }}>
                        {jobs.length} {jobs.length === 1 ? 'Post' : 'Posts'}
                    </span>
                </div>

                {jobs.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '48px 20px',
                            color: 'var(--muted)',
                        }}
                    >
                        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>
                            💼
                        </div>
                        <p style={{ fontSize: '0.88rem' }}>
                            No job posts yet. Add one above.
                        </p>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <JobCard key={job.id} job={job} jobTypes={jobTypes} />
                    ))
                )}
            </div>
        </CMSLayout>
    );
}
