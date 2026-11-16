import { router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';
import type { CareerSettings } from '@/cms/types/cms';

const isWebp = (file: File) =>
    file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');

const MAX_SIZE_BYTES = 300 * 1024; // 300 KB limit, matches other CMS image uploads

interface Props {
    settings: CareerSettings;
}

interface FormFields {
    heading: string;
    subtitle: string;
    no_openings_message: string;
    default_email: string;
    hero_image: File | null;
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

export default function CareerSettingsPage({ settings }: Props) {
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm<FormFields>({
            heading: settings.heading ?? '',
            subtitle: settings.subtitle ?? '',
            no_openings_message: settings.no_openings_message ?? '',
            default_email: settings.default_email ?? '',
            hero_image: null,
        });

    const [preview, setPreview] = useState<string | null>(settings.hero_image);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!isWebp(file)) {
            setError('hero_image', 'Only WEBP images are allowed.');
            e.target.value = '';
            return;
        }

        if (file.size > MAX_SIZE_BYTES) {
            const fileSizeKb = Math.round(file.size / 1024);
            setError(
                'hero_image',
                `File size is ${fileSizeKb}KB. Maximum allowed file size is 300KB.`,
            );
            e.target.value = '';
            return;
        }

        clearErrors('hero_image');
        setData('hero_image', file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('career-settings-update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setData('hero_image', null);
                if (fileRef.current) fileRef.current.value = '';
            },
        });
    };

    const removeImage = () => {
        if (
            !confirm(
                'Remove the current hero image? The Career page will fall back to the default image.',
            )
        ) {
            return;
        }
        router.post(
            route('career-settings-remove-image'),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setPreview(null);
                    setData('hero_image', null);
                    if (fileRef.current) fileRef.current.value = '';
                },
            },
        );
    };

    return (
        <CMSLayout
            title="Career Page Settings"
            breadcrumb="Career / Page Settings"
        >
            <div className="page-header">
                <h2>Career Page Settings</h2>
                <p>
                    Control the hero section, messages and default email of the
                    public Career page
                </p>
                <div className="gold-line" />
            </div>

            <form onSubmit={handleSubmit}>
                <div className="section-card">
                    <div className="section-title">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" />
                        </svg>
                        Hero Section
                    </div>

                    <div className="form-group">
                        <label>
                            Heading <span style={{ color: '#FF8080' }}>*</span>
                        </label>
                        <input
                            type="text"
                            required
                            maxLength={255}
                            value={data.heading}
                            onChange={(e) => {
                                clearErrors('heading');
                                setData('heading', e.target.value);
                            }}
                            placeholder="e.g. Build Your Career With Us"
                        />
                        {errors.heading && (
                            <span style={errorStyle}>{errors.heading}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Subtitle</label>
                        <textarea
                            maxLength={1000}
                            value={data.subtitle}
                            onChange={(e) => {
                                clearErrors('subtitle');
                                setData('subtitle', e.target.value);
                            }}
                            placeholder="A short introduction shown under the heading"
                        />
                        {errors.subtitle && (
                            <span style={errorStyle}>{errors.subtitle}</span>
                        )}
                    </div>

                    <div
                        className="form-row cols-2"
                        style={{ alignItems: 'start' }}
                    >
                        <div className="form-group">
                            <label>Hero Image</label>
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
                                    <span style={{ color: 'var(--gold)' }}>
                                        browse
                                    </span>
                                </p>
                                <p
                                    style={{
                                        marginTop: 4,
                                        fontSize: '0.72rem',
                                        color: 'var(--muted)',
                                        pointerEvents: 'none',
                                    }}
                                >
                                    WEBP format · Max 300KB · Leave empty to
                                    keep current
                                </p>
                            </div>
                            {errors.hero_image && (
                                <span style={{ ...errorStyle, marginTop: 6 }}>
                                    {errors.hero_image}
                                </span>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Preview</label>
                            <div
                                className="preview-box"
                                style={{ aspectRatio: '16 / 9' }}
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                        alt="Career hero preview"
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
                                        No image — the default image is shown
                                    </div>
                                )}
                            </div>
                            {settings.hero_image && !data.hero_image && (
                                <button
                                    type="button"
                                    className="btn-danger"
                                    style={{ marginTop: 10 }}
                                    onClick={removeImage}
                                >
                                    🗑️ Remove Image
                                </button>
                            )}
                        </div>
                    </div>
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
                        Messages & Notifications
                    </div>

                    <div className="form-group">
                        <label>"No Openings" Message</label>
                        <textarea
                            maxLength={2000}
                            value={data.no_openings_message}
                            onChange={(e) => {
                                clearErrors('no_openings_message');
                                setData('no_openings_message', e.target.value);
                            }}
                            placeholder="Shown on the Career page when there are no active job posts"
                        />
                        {errors.no_openings_message && (
                            <span style={errorStyle}>
                                {errors.no_openings_message}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Default Careers Email</label>
                        <input
                            type="text"
                            inputMode="email"
                            maxLength={255}
                            value={data.default_email}
                            onChange={(e) => {
                                clearErrors('default_email');
                                setData('default_email', e.target.value);
                            }}
                            placeholder="e.g. careers@alliancebuildersltd.org"
                        />
                        <span style={hintStyle}>
                            Applications for a position that isn't listed
                            ("Other" or typed-in positions) are emailed here
                            with the CV attached. Leave empty to send no email —
                            they will still appear under Career → Applications.
                        </span>
                        {errors.default_email && (
                            <span style={errorStyle}>
                                {errors.default_email}
                            </span>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={processing}
                >
                    {processing ? 'Saving...' : 'Save Settings'}
                </button>
            </form>
        </CMSLayout>
    );
}
