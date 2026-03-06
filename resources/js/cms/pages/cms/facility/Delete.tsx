import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';
import type { Facility } from '@/cms/types/cms';

interface Props {
    facilities: Facility[];
}

export default function FacilityDelete({ facilities }: Props) {
    const [selected, setSelected] = useState<Facility | null>(null);

    const { data, setData, post, processing } = useForm({
        id: '',
    });

    const handleSelect = (id: string) => {
        const facility = facilities.find(f => String(f.id) === id) ?? null;
        setSelected(facility);
        setData('id', id);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm(`Delete "${selected?.name}"? This cannot be undone.`)) return;
        post(route('facility-destroy'), {
            preserveScroll: true,
            onSuccess: () => {
                setSelected(null);
                setData('id', '');
            },
        });
    };

    return (
        <CMSLayout title="Delete Facility" breadcrumb="Project Configuration / Facility Config / Delete">
            <div className="page-header">
                <h2>Delete Facility</h2>
                <p>Permanently remove a facility option</p>
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
                        <option value="">Select a facility to delete</option>
                        {facilities.map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Warning + Confirm */}
            {selected && (
                <div className="section-card" style={{ borderColor: 'rgba(255,80,80,0.3)' }}>
                    <div className="section-title" style={{ color: '#FF8080', borderBottomColor: 'rgba(255,80,80,0.2)' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                        </svg>
                        Confirm Deletion
                    </div>

                    <div style={{
                        background: 'rgba(255,80,80,0.06)',
                        border: '1px solid rgba(255,80,80,0.2)',
                        borderRadius: 10,
                        padding: '16px 20px',
                        marginBottom: 20,
                    }}>
                        <p style={{ fontSize: '0.83rem', color: 'var(--text)', marginBottom: 6 }}>
                            You are about to delete:
                        </p>
                        <p style={{ fontSize: '1rem', color: '#FF8080', fontWeight: 600, fontFamily: 'Playfair Display, serif' }}>
                            {selected.name}
                        </p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 8 }}>
                            ⚠️ This action is irreversible. This facility will be removed from all associated projects.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <button type="submit" className="btn-danger" disabled={processing} style={{ padding: '10px 24px', fontSize: '0.83rem' }}>
                            {processing ? 'Deleting...' : '🗑️ Delete Facility'}
                        </button>
                    </form>
                </div>
            )}
        </CMSLayout>
    );
}
