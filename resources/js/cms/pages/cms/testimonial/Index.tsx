import { router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';
import type { Testimonial } from '@/cms/types/cms';

const isWebp = (file: File) =>
    file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');

const MAX_SIZE_BYTES = 300 * 1024; // 300 KB limit, matches other CMS image uploads

interface Props {
    testimonials: Testimonial[];
}

interface FormFields {
    testimonial_id: number | null;
    name: string;
    role: string;
    company: string;
    rating: string;
    quote: string;
    property_type: string;
    image: File | null;
}

function TestimonialForm({
    testimonial,
    onDone,
}: {
    testimonial?: Testimonial;
    onDone?: () => void;
}) {
    const isEdit = !!testimonial;
    const {
        data,
        setData,
        post,
        processing,
        errors,
        setError,
        clearErrors,
        reset,
    } = useForm<FormFields>({
        testimonial_id: testimonial?.id ?? null,
        name: testimonial?.name ?? '',
        role: testimonial?.role ?? '',
        company: testimonial?.company ?? '',
        rating: String(testimonial?.rating ?? 5),
        quote: testimonial?.quote ?? '',
        property_type: testimonial?.property_type ?? '',
        image: null,
    });

    const [preview, setPreview] = useState<string | null>(
        testimonial?.image ?? null,
    );
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!isWebp(file)) {
            setError('image', 'Only WEBP images are allowed.');
            e.target.value = '';
            return;
        }

        if (file.size > MAX_SIZE_BYTES) {
            const fileSizeKb = Math.round(file.size / 1024);
            setError(
                'image',
                `File size is ${fileSizeKb}KB. Maximum allowed file size is 300KB.`,
            );
            e.target.value = '';
            return;
        }

        clearErrors('image');
        setData('image', file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const routeName = isEdit ? 'testimonial-update' : 'testimonial-store';

        post(route(routeName), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (!isEdit) {
                    reset();
                    setPreview(null);
                    if (fileRef.current) fileRef.current.value = '';
                }
                onDone?.();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-row cols-3">
                <div className="form-group">
                    <label>
                        Name <span style={{ color: '#FF8080' }}>*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={data.name}
                        onChange={(e) => {
                            clearErrors('name');
                            setData('name', e.target.value);
                        }}
                        placeholder="Client name..."
                    />
                    {errors.name && (
                        <span
                            style={{
                                marginTop: 4,
                                display: 'block',
                                color: '#FF8080',
                                fontSize: '0.78rem',
                            }}
                        >
                            {errors.name}
                        </span>
                    )}
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <input
                        type="text"
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                        placeholder="e.g. Property Investor"
                    />
                </div>
                <div className="form-group">
                    <label>Company</label>
                    <input
                        type="text"
                        value={data.company}
                        onChange={(e) => setData('company', e.target.value)}
                        placeholder="e.g. Johnson Holdings"
                    />
                </div>
            </div>

            <div className="form-row cols-2">
                <div className="form-group">
                    <label>
                        Rating <span style={{ color: '#FF8080' }}>*</span>
                    </label>
                    <select
                        required
                        value={data.rating}
                        onChange={(e) => setData('rating', e.target.value)}
                    >
                        {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>
                                {n} Star{n > 1 ? 's' : ''}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Property Type</label>
                    <input
                        type="text"
                        value={data.property_type}
                        onChange={(e) =>
                            setData('property_type', e.target.value)
                        }
                        placeholder="e.g. Commercial Investment"
                    />
                </div>
            </div>

            <div className="form-group">
                <label>
                    Quote <span style={{ color: '#FF8080' }}>*</span>
                </label>
                <textarea
                    required
                    maxLength={1000}
                    value={data.quote}
                    onChange={(e) => {
                        clearErrors('quote');
                        setData('quote', e.target.value);
                    }}
                    placeholder="What did the client say?"
                />
                {errors.quote && (
                    <span
                        style={{
                            marginTop: 4,
                            display: 'block',
                            color: '#FF8080',
                            fontSize: '0.78rem',
                        }}
                    >
                        {errors.quote}
                    </span>
                )}
            </div>

            <div className="form-row cols-2" style={{ alignItems: 'start' }}>
                <div className="form-group">
                    <label>Client Photo</label>
                    <div className="img-uploader">
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/webp"
                            className="uploader-input"
                            onChange={handleFile}
                        />
                        <div
                            style={{
                                fontSize: '2rem',
                                marginBottom: 8,
                                pointerEvents: 'none',
                            }}
                        >
                            🖼️
                        </div>
                        <p
                            style={{
                                fontSize: '0.8rem',
                                color: 'var(--muted)',
                                pointerEvents: 'none',
                            }}
                        >
                            Drag & drop or{' '}
                            <span style={{ color: 'var(--gold)' }}>browse</span>
                        </p>
                        <p
                            style={{
                                marginTop: 4,
                                fontSize: '0.72rem',
                                color: 'var(--muted)',
                                pointerEvents: 'none',
                            }}
                        >
                            WEBP format · Max 300KB
                            {isEdit
                                ? ' · Leave empty to keep current'
                                : ' (optional)'}
                        </p>
                    </div>
                    {errors.image && (
                        <span
                            style={{
                                marginTop: 6,
                                display: 'block',
                                color: '#FF8080',
                                fontSize: '0.78rem',
                            }}
                        >
                            {errors.image}
                        </span>
                    )}
                </div>
                <div className="form-group">
                    <label>Preview</label>
                    <div
                        className="preview-box"
                        style={{
                            minHeight: 140,
                            width: 140,
                            height: 140,
                            borderRadius: '50%',
                            overflow: 'hidden',
                        }}
                    >
                        {preview ? (
                            <img
                                src={preview}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                                alt="preview"
                            />
                        ) : (
                            <div
                                style={{
                                    color: 'var(--muted)',
                                    fontSize: '0.78rem',
                                    textAlign: 'center',
                                    padding: 20,
                                }}
                            >
                                📷
                                <br />
                                No photo
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button type="submit" className="btn-primary" disabled={processing}>
                {processing
                    ? 'Saving...'
                    : isEdit
                      ? 'Update Testimonial'
                      : 'Add Testimonial'}
            </button>
        </form>
    );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const confirmDelete = () => {
        if (
            !confirm(
                `Delete the testimonial from "${testimonial.name}"? This cannot be undone.`,
            )
        ) {
            return;
        }
        setDeleting(true);
        router.post(
            route('testimonial-destroy'),
            { testimonial_id: testimonial.id },
            {
                preserveScroll: true,
                onFinish: () => setDeleting(false),
            },
        );
    };

    if (editing) {
        return (
            <div className="banner-card">
                <div className="banner-num">EDITING</div>
                <TestimonialForm
                    testimonial={testimonial}
                    onDone={() => setEditing(false)}
                />
                <button
                    type="button"
                    className="btn-secondary"
                    style={{ marginTop: 12, marginLeft: 12 }}
                    onClick={() => setEditing(false)}
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <div className="banner-card">
            <div
                style={{
                    display: 'flex',
                    gap: 18,
                    alignItems: 'flex-start',
                    opacity: deleting ? 0.4 : 1,
                }}
            >
                <div
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        flexShrink: 0,
                        background: 'var(--darker)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border)',
                    }}
                >
                    {testimonial.image ? (
                        <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <span style={{ fontSize: '1.5rem' }}>👤</span>
                    )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: 12,
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontWeight: 700,
                                    color: 'var(--text)',
                                    fontSize: '0.95rem',
                                }}
                            >
                                {testimonial.name}
                            </div>
                            <div
                                style={{
                                    fontSize: '0.78rem',
                                    color: 'var(--gold-light)',
                                }}
                            >
                                {[testimonial.role, testimonial.company]
                                    .filter(Boolean)
                                    .join(' · ')}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setEditing(true)}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                className="btn-danger"
                                onClick={confirmDelete}
                                disabled={deleting}
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: 8, color: 'var(--gold)' }}>
                        {'★'.repeat(testimonial.rating)}
                        <span style={{ color: 'var(--muted)' }}>
                            {'★'.repeat(5 - testimonial.rating)}
                        </span>
                    </div>

                    <p
                        style={{
                            marginTop: 8,
                            fontSize: '0.85rem',
                            color: 'var(--muted)',
                            fontStyle: 'italic',
                        }}
                    >
                        &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    {testimonial.property_type && (
                        <span className="badge" style={{ marginTop: 8 }}>
                            {testimonial.property_type}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function TestimonialIndex({ testimonials }: Props) {
    return (
        <CMSLayout
            title="Testimonial Settings"
            breadcrumb="Testimonial Settings"
        >
            <div className="page-header">
                <h2>Testimonial Settings</h2>
                <p>Manage the client testimonials shown on the homepage</p>
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
                    Add New Testimonial
                </div>
                <TestimonialForm />
            </div>

            <div className="section-card">
                <div className="section-title">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    Existing Testimonials
                    <span className="badge" style={{ marginLeft: 'auto' }}>
                        {testimonials.length}{' '}
                        {testimonials.length === 1
                            ? 'Testimonial'
                            : 'Testimonials'}
                    </span>
                </div>

                {testimonials.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '48px 20px',
                            color: 'var(--muted)',
                        }}
                    >
                        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>
                            💬
                        </div>
                        <p style={{ fontSize: '0.88rem' }}>
                            No testimonials yet. Add one above.
                        </p>
                    </div>
                ) : (
                    testimonials.map((testimonial) => (
                        <TestimonialCard
                            key={testimonial.id}
                            testimonial={testimonial}
                        />
                    ))
                )}
            </div>
        </CMSLayout>
    );
}
