import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';

interface Props {
    tags: { id: number; name: string; description?: string }[];
}
export default function TagAdd({ tags }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tag-store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <CMSLayout
            title="Add Tag"
            breadcrumb="Project Configuration / Tag Config / Add"
        >
            <div className="page-header">
                <h2>Add Tag</h2>
                <p>Create a new tag for projects</p>
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
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                        <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                    Existing Tags
                    <span className="badge" style={{ marginLeft: 8 }}>
                        {tags.length} {tags.length === 1 ? 'Tag' : 'Tags'}
                    </span>
                </div>

                {tags.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '32px 20px',
                            color: 'var(--muted)',
                            fontSize: '0.83rem',
                        }}
                    >
                        No tags added yet.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {tags.map((t) => (
                            <div
                                key={t.id}
                                style={{
                                    background: 'var(--darker)',
                                    border: '1px solid rgba(201,168,76,0.2)',
                                    borderRadius: 8,
                                    padding: '8px 14px',
                                    fontSize: '0.82rem',
                                    color: 'var(--text)',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 7,
                                            height: 7,
                                            borderRadius: '50%',
                                            background: 'var(--gold)',
                                            flexShrink: 0,
                                            display: 'inline-block',
                                        }}
                                    />
                                    <span style={{ fontWeight: 500 }}>
                                        {t.name}
                                    </span>
                                    {t.description && (
                                        <span
                                            style={{
                                                fontSize: '0.72rem',
                                                color: 'var(--muted)',
                                                marginLeft: 4,
                                            }}
                                        >
                                            — {t.description}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="section-card">
                <div className="section-title">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                        <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                    Tag Information
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>
                            Tag Name <span style={{ color: '#FF8080' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Luxury, Affordable, Commercial..."
                        />
                        {errors.name && (
                            <p
                                style={{
                                    color: '#FF8080',
                                    fontSize: '0.75rem',
                                    marginTop: 5,
                                }}
                            >
                                {errors.name}
                            </p>
                        )}
                        <p
                            style={{
                                fontSize: '0.72rem',
                                color: 'var(--muted)',
                                marginTop: 5,
                            }}
                        >
                            Slug will be auto-generated from the name.
                        </p>
                    </div>

                    <div className="form-group">
                        <label>
                            Description{' '}
                            <span
                                style={{
                                    color: 'var(--muted)',
                                    fontWeight: 400,
                                }}
                            >
                                (optional)
                            </span>
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Brief description of this tag..."
                        />
                        {errors.description && (
                            <p
                                style={{
                                    color: '#FF8080',
                                    fontSize: '0.75rem',
                                    marginTop: 5,
                                }}
                            >
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={processing}
                    >
                        {processing ? 'Saving...' : 'Add Tag'}
                    </button>
                </form>
            </div>
        </CMSLayout>
    );
}
