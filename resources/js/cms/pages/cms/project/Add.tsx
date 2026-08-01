import { useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';
import type { ProjectType, Location, Facility, Tag } from '@/cms/types/cms';

const isWebp = (file: File) =>
    file.type === 'image/webp' ||
    file.name.toLowerCase().endsWith('.webp');

interface Props {
    types: ProjectType[];
    locations: Location[];
    facilities: Facility[];
    tags: Tag[];
}

export default function ProjectAdd({
    types,
    locations,
    facilities,
    tags,
}: Props) {
    const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm({
        name: '',
        address: '',
        google_map_url: '',
        price: '',
        size: '',
        floors: '',
        construction_start_date: '',
        handover_date: '',
        isFeatured: false as boolean,
        description: '',
        surroundings: '',
        project_type_id: '',
        location_id: '',
        project_id: '',
        apartment_size: '',
        bedroom: '',
        bathroom: '',
        balcony: '',
        kitchen: '',
        living_dining: '',
        parking: '',
        garage_no: '',
        garage_size: '',
        apartment_direction: '',
        youtube_video_id: '',
        facilities: [] as number[],
        tags: [] as number[],
        thumbnail: null as File | null,
        project_images: [] as File[],
    });

    const [thumbPreview, setThumbPreview] = useState<string | null>(null);
    const [projectImagePreviews, setProjectImagePreviews] = useState<string[]>(
        [],
    );
    const thumbRef = useRef<HTMLInputElement>(null);
    const imagesRef = useRef<HTMLInputElement>(null);

    const toggleFacility = (id: number) => {
        setData(
            'facilities',
            data.facilities.includes(id)
                ? data.facilities.filter((f) => f !== id)
                : [...data.facilities, id],
        );
    };

    const toggleTag = (id: number) => {
        setData(
            'tags',
            data.tags.includes(id)
                ? data.tags.filter((t) => t !== id)
                : [...data.tags, id],
        );
    };

    const handleThumb = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!isWebp(file)) {
            setError('thumbnail', 'Only WEBP images are allowed.');
            e.target.value = '';
            return;
        }

        clearErrors('thumbnail');
        setData('thumbnail', file);
        setThumbPreview(URL.createObjectURL(file));
    };

    const handleProjectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const rejected = files.some((f) => !isWebp(f));

        if (rejected) {
            setError('project_images', 'Only WEBP images are allowed.');
            e.target.value = '';
            return;
        }

        clearErrors('project_images');
        setData('project_images', files);
        setProjectImagePreviews(files.map((f) => URL.createObjectURL(f)));
    };

    const handleReset = () => {
        if (thumbPreview) {
            URL.revokeObjectURL(thumbPreview);
        }

        projectImagePreviews.forEach((url) => URL.revokeObjectURL(url));

        reset();
        setThumbPreview(null);
        setProjectImagePreviews([]);

        if (thumbRef.current) {
            thumbRef.current.value = '';
        }

        if (imagesRef.current) {
            imagesRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('save-project'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                if (!page.props.flash?.error) {
                    handleReset();
                }
            },
        });
    };

    return (
        <CMSLayout
            title="Add Project"
            breadcrumb="Project Info Management / Add Project"
        >
            <div className="page-header">
                <h2>Add Project</h2>
                <p>Add a new property to the portfolio</p>
                <div className="gold-line" />
            </div>

            <form onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div className="section-card">
                    <div className="section-title">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="M3 21h18M9 21V9l3-6 3 6v12M5 21V12l-2-2M19 21V12l2-2" />
                        </svg>
                        Basic Information
                    </div>

                    <div className="form-row cols-2">
                        <div className="form-group">
                            <label>
                                Project Name{' '}
                                <span style={{ color: '#FF8080' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Enter project name..."
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
                        </div>
                        <div className="form-group">
                            <label>
                                Project ID{' '}
                                <span style={{ color: '#FF8080' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={data.project_id}
                                onChange={(e) =>
                                    setData('project_id', e.target.value)
                                }
                                placeholder="e.g. ABL-001"
                            />
                            {errors.project_id && (
                                <p
                                    style={{
                                        color: '#FF8080',
                                        fontSize: '0.75rem',
                                        marginTop: 5,
                                    }}
                                >
                                    {errors.project_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="form-row cols-2">
                        <div className="form-group">
                            <label>
                                Project Type{' '}
                                <span style={{ color: '#FF8080' }}>*</span>
                            </label>
                            <select
                                value={data.project_type_id}
                                onChange={(e) =>
                                    setData('project_type_id', e.target.value)
                                }
                                className="h-10"
                            >
                                <option value="" disabled>
                                    Select Project Type
                                </option>
                                {types.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                            {errors.project_type_id && (
                                <p
                                    style={{
                                        color: '#FF8080',
                                        fontSize: '0.75rem',
                                        marginTop: 5,
                                    }}
                                >
                                    {errors.project_type_id}
                                </p>
                            )}
                        </div>
                        <div className="form-group">
                            <label>
                                Location{' '}
                                <span style={{ color: '#FF8080' }}>*</span>
                            </label>
                            <select
                                value={data.location_id}
                                onChange={(e) =>
                                    setData('location_id', e.target.value)
                                }
                                className="h-10"
                            >
                                <option value="" disabled>
                                    Select Location
                                </option>
                                {locations.map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.name}
                                    </option>
                                ))}
                            </select>
                            {errors.location_id && (
                                <p
                                    style={{
                                        color: '#FF8080',
                                        fontSize: '0.75rem',
                                        marginTop: 5,
                                    }}
                                >
                                    {errors.location_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Enter full address..."
                        />
                    </div>

                    <div className="form-row cols-4">
                        <div className="form-group">
                            <label>Price (BDT)</label>
                            <input
                                type="number"
                                value={data.price}
                                onChange={(e) =>
                                    setData('price', e.target.value)
                                }
                                placeholder="0"
                            />
                        </div>
                        <div className="form-group">
                            <label>Size</label>
                            <input
                                type="text"
                                value={data.size}
                                onChange={(e) =>
                                    setData('size', e.target.value)
                                }
                                placeholder="e.g. 1200 sqft"
                            />
                        </div>
                        <div className="form-group">
                            <label>Floors</label>
                            <input
                                type="text"
                                value={data.floors}
                                onChange={(e) =>
                                    setData('floors', e.target.value)
                                }
                                placeholder="e.g. G+12"
                            />
                        </div>
                        <div className="form-group">
                            <label>Featured</label>
                            <label
                                className="featured-check"
                                style={{ marginTop: 10 }}
                            >
                                <input
                                    type="checkbox"
                                    checked={data.isFeatured}
                                    onChange={(e) =>
                                        setData('isFeatured', e.target.checked)
                                    }
                                />
                                <span>Mark as Featured</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-row cols-2">
                        <div className="form-group">
                            <label>Construction Start Date</label>
                            <input
                                type="date"
                                value={data.construction_start_date}
                                onChange={(e) =>
                                    setData(
                                        'construction_start_date',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Handover Date</label>
                            <input
                                type="date"
                                value={data.handover_date}
                                onChange={(e) =>
                                    setData('handover_date', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Google Map Embed URL</label>
                        <input
                            type="url"
                            value={data.google_map_url}
                            onChange={(e) =>
                                setData('google_map_url', e.target.value)
                            }
                            placeholder="https://maps.google.com/..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Enter project description..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Surroundings</label>
                        <textarea
                            value={data.surroundings}
                            onChange={(e) =>
                                setData('surroundings', e.target.value)
                            }
                            placeholder="Enter surrounding info..."
                        />
                    </div>
                </div>

                {/* Apartment Details */}
                <div className="section-card">
                    <div className="section-title">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M9 9h6M9 12h6M9 15h4" />
                        </svg>
                        Apartment Details
                    </div>

                    <div className="form-row cols-3">
                        {[
                            { key: 'apartment_size', label: 'Apartment Size' },
                            { key: 'bedroom', label: 'Bedroom' },
                            { key: 'bathroom', label: 'Bathroom' },
                            { key: 'balcony', label: 'Balcony' },
                            { key: 'kitchen', label: 'Kitchen' },
                            { key: 'living_dining', label: 'Living/Dining' },
                        ].map(({ key, label }) => (
                            <div className="form-group" key={key}>
                                <label>{label}</label>
                                <input
                                    type="text"
                                    value={(data as any)[key]}
                                    onChange={(e) =>
                                        setData(key as any, e.target.value)
                                    }
                                    placeholder={`Enter ${label.toLowerCase()}...`}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="form-row cols-4">
                        {[
                            { key: 'parking', label: 'Parking' },
                            { key: 'garage_no', label: 'Garage No.' },
                            { key: 'garage_size', label: 'Garage Size' },
                            {
                                key: 'apartment_direction',
                                label: 'Apt Direction',
                            },
                        ].map(({ key, label }) => (
                            <div className="form-group" key={key}>
                                <label>{label}</label>
                                <input
                                    type="text"
                                    value={(data as any)[key]}
                                    onChange={(e) =>
                                        setData(key as any, e.target.value)
                                    }
                                    placeholder={`Enter...`}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="form-group">
                        <label>YouTube Video ID</label>
                        <input
                            type="text"
                            value={data.youtube_video_id}
                            onChange={(e) =>
                                setData('youtube_video_id', e.target.value)
                            }
                            placeholder="e.g. dQw4w9WgXcQ"
                        />
                    </div>
                </div>

                {/* Facilities */}
                <div className="section-card">
                    <div className="section-title">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="M9 11l3 3L22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                        Facilities
                    </div>
                    <div className="checkbox-group">
                        {facilities.map((f) => (
                            <div
                                key={f.id}
                                className={`checkbox-item ${data.facilities.includes(f.id) ? 'checked' : ''}`}
                                onClick={() => toggleFacility(f.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <input
                                    type="checkbox"
                                    checked={data.facilities.includes(f.id)}
                                    onChange={() => toggleFacility(f.id)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                {f.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tags */}
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
                        Tags
                    </div>
                    <div className="checkbox-group">
                        {tags.map((t) => (
                            <div
                                key={t.id}
                                className={`checkbox-item ${data.tags.includes(t.id) ? 'checked' : ''}`}
                                onClick={() => toggleTag(t.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <input
                                    type="checkbox"
                                    checked={data.tags.includes(t.id)}
                                    onChange={() => toggleTag(t.id)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                {t.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Images */}
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
                        Images
                    </div>

                    <div
                        className="form-row cols-2"
                        style={{ alignItems: 'start' }}
                    >
                        <div className="form-group">
                            <label>
                                Thumbnail{' '}
                                <span style={{ color: '#FF8080' }}>*</span>
                            </label>
                            <div
                                className="img-uploader"
                            >
                                <input
                                    ref={thumbRef}
                                    type="file"
                                    accept="image/webp"
                                    className="uploader-input"
                                    onChange={handleThumb}
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
                                    WEBP only · Max 10MB
                                </p>
                            </div>
                            {errors.thumbnail && (
                                <p
                                    style={{
                                        color: '#FF8080',
                                        fontSize: '0.75rem',
                                        marginTop: 5,
                                    }}
                                >
                                    {errors.thumbnail}
                                </p>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Thumbnail Preview</label>
                            <div
                                className="preview-box"
                                style={{ height: 185 }}
                            >
                                {thumbPreview ? (
                                    <img
                                        src={thumbPreview}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                        alt="thumbnail"
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
                                        No image selected
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Project Images (Multiple)</label>
                        <div
                            className="img-uploader"
                        >
                            <input
                                ref={imagesRef}
                                type="file"
                                accept="image/webp"
                                multiple
                                className="uploader-input"
                                onChange={handleProjectImages}
                            />
                            <div
                                style={{
                                    fontSize: '2rem',
                                    marginBottom: 8,
                                    pointerEvents: 'none',
                                }}
                            >
                                🗂️
                            </div>
                            <p
                                style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--muted)',
                                    pointerEvents: 'none',
                                }}
                            >
                                Select multiple images ·{' '}
                                <span style={{ color: 'var(--gold)' }}>
                                    browse
                                </span>
                            </p>
                        </div>
                        {errors.project_images && (
                            <p
                                style={{
                                    color: '#FF8080',
                                    fontSize: '0.75rem',
                                    marginTop: 5,
                                }}
                            >
                                {errors.project_images}
                            </p>
                        )}
                        {projectImagePreviews.length > 0 && (
                            <div
                                style={{
                                    display: 'flex',
                                    gap: 10,
                                    flexWrap: 'wrap',
                                    marginTop: 12,
                                }}
                            >
                                {projectImagePreviews.map((src, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: 90,
                                            height: 70,
                                            borderRadius: 8,
                                            overflow: 'hidden',
                                            border: '1px solid var(--border)',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <img
                                            src={src}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                            alt={`img-${i}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={processing}
                    >
                        {processing ? 'Saving...' : 'Add Project'}
                    </button>
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={handleReset}
                    >
                        Reset
                    </button>
                </div>
            </form>
        </CMSLayout>
    );
}
