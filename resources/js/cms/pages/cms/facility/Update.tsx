import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';
import type { Facility } from '@/cms/types/cms';

interface Props {
    facilities: Facility[];
}

export default function FacilityUpdate({ facilities }: Props) {
    const [selected, setSelected] = useState<Facility | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        id: '',
        name: '',
    });

    const handleSelect = (id: string) => {
        const facility = facilities.find(f => String(f.id) === id) ?? null;
        setSelected(facility);
        if (facility) {
            setData({ id: String(facility.id), name: facility.name });
        } else {
            setData({ id: '', name: '' });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('facility-update-store'), {
            preserveScroll: true,
            onSuccess: () => {
                setSelected(null);
                setData({ id: '', name: '' });
            },
        });
    };

    return (
        <CMSLayout title="Update Facility" breadcrumb="Project Configuration / Facility Config / Update">
            <div className="page-header">
                <h2>Update Facility</h2>
                <p>Select and update an existing facility</p>
                <div className="gold-line" />
            </div>

            {/* Selector */}
            <div className="section-card">
                <div className="section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    Select Facility
                </div>
                <div className="form-group">
                    <label>Facility <span style={{ color: '#FF8080' }}>*</span></label>
                    <select
                        value={selected ? String(selected.id) : ''}
                        onChange={e => handleSelect(e.target.value)}
                        className="h-10"
                    >
                        <option value="">Select a facility to update</option>
                        {facilities.map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
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
                        Edit Facility
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Facility Name <span style={{ color: '#FF8080' }}>*</span></label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Enter facility name..."
                            />
                            {errors.name && (
                                <p style={{ color: '#FF8080', fontSize: '0.75rem', marginTop: 5 }}>{errors.name}</p>
                            )}
                        </div>

                        <button type="submit" className="btn-primary" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Facility'}
                        </button>
                    </form>
                </div>
            )}
        </CMSLayout>
    );
}
