import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';
import type { Tag } from '@/cms/types/cms';

interface Props {
    tags: Tag[];
}

export default function TagUpdate({ tags }: Props) {
    const [selected, setSelected] = useState<Tag | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        id: '',
        name: '',
        description: '',
    });

    const handleSelect = (id: string) => {
        const tag = tags.find(t => String(t.id) === id) ?? null;
        setSelected(tag);
        if (tag) {
            setData({
                id: String(tag.id),
                name: tag.name,
                description: tag.description ?? '',
            });
        } else {
            setData({ id: '', name: '', description: '' });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tag-update-store'), {
            preserveScroll: true,
            onSuccess: () => {
                setSelected(null);
                setData({ id: '', name: '', description: '' });
            },
        });
    };

    return (
        <CMSLayout title="Update Tag" breadcrumb="Project Configuration / Tag Config / Update">
            <div className="page-header">
                <h2>Update Tag</h2>
                <p>Select and update an existing tag</p>
                <div className="gold-line" />
            </div>

            {/* Selector */}
            <div className="section-card">
                <div className="section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    Select Tag
                </div>
                <div className="form-group">
                    <label>Tag <span style={{ color: '#FF8080' }}>*</span></label>
                    <select
                        value={selected ? String(selected.id) : ''}
                        onChange={e => handleSelect(e.target.value)}
                        className="h-10"
                    >
                        <option value="">Select a tag to update</option>
                        {tags.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Edit Form */}
            {selected && (
                <div className="section-card">
                    <div className="section-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit Tag
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Tag Name <span style={{ color: '#FF8080' }}>*</span></label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Enter tag name..."
                            />
                            {errors.name && (
                                <p style={{ color: '#FF8080', fontSize: '0.75rem', marginTop: 5 }}>{errors.name}</p>
                            )}
                            <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 5 }}>
                                Slug will be auto-updated from the name.
                            </p>
                        </div>

                        <div className="form-group">
                            <label>Description <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span></label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Brief description of this tag..."
                            />
                            {errors.description && (
                                <p style={{ color: '#FF8080', fontSize: '0.75rem', marginTop: 5 }}>{errors.description}</p>
                            )}
                        </div>

                        <button type="submit" className="btn-primary" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Tag'}
                        </button>
                    </form>
                </div>
            )}
        </CMSLayout>
    );
}
