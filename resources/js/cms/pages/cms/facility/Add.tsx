import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';

interface Props {
    facilities: { id: number; name: string }[];
}

export default function FacilityAdd({ facilities }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('facility-store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <CMSLayout
            title="Add Facility"
            breadcrumb="Project Configuration / Facility Config / Add"
        >
            <div className="page-header">
                <h2>Add Facility</h2>
                <p>Create a new facility option for projects</p>
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
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                    Existing Facilities
                    <span className="badge" style={{ marginLeft: 8 }}>
                        {facilities.length}{' '}
                        {facilities.length === 1 ? 'Facility' : 'Facilities'}
                    </span>
                </div>

                {facilities.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '32px 20px',
                            color: 'var(--muted)',
                            fontSize: '0.83rem',
                        }}
                    >
                        No facilities added yet.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {facilities.map((f) => (
                            <div
                                key={f.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    background: 'var(--darker)',
                                    border: '1px solid rgba(201,168,76,0.2)',
                                    borderRadius: 8,
                                    padding: '8px 14px',
                                    fontSize: '0.82rem',
                                    color: 'var(--text)',
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
                                {f.name}
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
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                    Facility Information
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>
                            Facility Name{' '}
                            <span style={{ color: '#FF8080' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Swimming Pool, Gym, Parking..."
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

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={processing}
                    >
                        {processing ? 'Saving...' : 'Add Facility'}
                    </button>
                </form>
            </div>
        </CMSLayout>
    );
}
