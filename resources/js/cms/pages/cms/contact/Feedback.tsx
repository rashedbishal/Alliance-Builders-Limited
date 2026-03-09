import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';

interface Feedback {
    id: number;
    name: string;
    email: string;
    phone: string;
    message: string;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedFeedbacks {
    data: Feedback[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface Props {
    feedbacks: PaginatedFeedbacks;
}

export default function FeedbackIndex({ feedbacks }: Props) {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const canDownload = fromDate !== '' && toDate !== '';

    const handleDownload = () => {
        if (!canDownload) return;
        const url =
            route('feedback-download') + `?from=${fromDate}&to=${toDate}`;
        window.location.href = url;
    };

    const startSerial = (feedbacks.current_page - 1) * feedbacks.per_page + 1;

    return (
        <CMSLayout title="Incoming Feedback" breadcrumb="Incoming Feedback">
            <div className="page-header">
                <h2>Incoming Feedback</h2>
                <p>View and export contact form submissions</p>
                <div className="gold-line" />
            </div>

            {/* Download Section */}
            <div className="section-card" style={{ marginBottom: 24 }}>
                <div className="section-title">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export Feedback Data
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: 16,
                        flexWrap: 'wrap',
                    }}
                >
                    <div
                        className="form-group"
                        style={{
                            marginBottom: 0,
                            flex: '1 1 180px',
                            minWidth: 160,
                        }}
                    >
                        <label>From Date</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>
                    <div
                        className="form-group"
                        style={{
                            marginBottom: 0,
                            flex: '1 1 180px',
                            minWidth: 160,
                        }}
                    >
                        <label>To Date</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                    <div style={{ flex: '0 0 auto' }}>
                        <button
                            onClick={handleDownload}
                            disabled={!canDownload}
                            className="btn-primary"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                opacity: canDownload ? 1 : 0.45,
                                cursor: canDownload ? 'pointer' : 'not-allowed',
                                transform: 'none',
                            }}
                        >
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Download Excel
                        </button>
                        {!canDownload && (
                            <p
                                style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--muted)',
                                    marginTop: 5,
                                    textAlign: 'center',
                                }}
                            >
                                Select both dates to enable
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="section-card">
                <div className="section-title">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    All Submissions
                    <span
                        className="badge"
                        style={{ marginLeft: 'auto', fontSize: '0.72rem' }}
                    >
                        {feedbacks.total} total
                    </span>
                </div>

                <div style={{ overflowX: 'auto', borderRadius: 10 }}>
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '0.82rem',
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background: 'var(--darker)',
                                    borderBottom: '1px solid var(--border)',
                                }}
                            >
                                {[
                                    '#',
                                    'Name',
                                    'Email',
                                    'Phone',
                                    'Message',
                                    'Date',
                                ].map((col) => (
                                    <th
                                        key={col}
                                        style={{
                                            padding: '12px 16px',
                                            textAlign: 'left',
                                            color: 'var(--gold)',
                                            fontFamily: "'DM Sans', sans-serif",
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                            letterSpacing: '0.06em',
                                            textTransform: 'uppercase',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {feedbacks.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        style={{
                                            padding: '48px 16px',
                                            textAlign: 'center',
                                            color: 'var(--muted)',
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: '2rem',
                                                marginBottom: 8,
                                            }}
                                        >
                                            📭
                                        </div>
                                        No feedback submissions yet
                                    </td>
                                </tr>
                            ) : (
                                feedbacks.data.map((item, idx) => (
                                    <tr
                                        key={item.id}
                                        style={{
                                            borderBottom:
                                                '1px solid rgba(201,168,76,0.07)',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={(e) =>
                                            ((
                                                e.currentTarget as HTMLTableRowElement
                                            ).style.background =
                                                'rgba(201,168,76,0.03)')
                                        }
                                        onMouseLeave={(e) =>
                                            ((
                                                e.currentTarget as HTMLTableRowElement
                                            ).style.background = 'transparent')
                                        }
                                    >
                                        <td
                                            style={{
                                                padding: '13px 16px',
                                                color: 'var(--muted)',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {startSerial + idx}
                                        </td>
                                        <td
                                            style={{
                                                padding: '13px 16px',
                                                color: 'var(--text)',
                                                fontWeight: 500,
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {item.name}
                                        </td>
                                        <td
                                            style={{
                                                padding: '13px 16px',
                                                color: 'var(--muted)',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {item.email}
                                        </td>
                                        <td
                                            style={{
                                                padding: '13px 16px',
                                                color: 'var(--muted)',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {item.phone}
                                        </td>
                                        <td
                                            style={{
                                                padding: '13px 16px',
                                                color: 'var(--muted)',
                                                maxWidth: 280,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    maxWidth: 260,
                                                }}
                                                title={item.message}
                                            >
                                                {item.message}
                                            </div>
                                        </td>
                                        <td
                                            style={{
                                                padding: '13px 16px',
                                                color: 'var(--muted)',
                                                whiteSpace: 'nowrap',
                                                fontSize: '0.75rem',
                                            }}
                                        >
                                            {new Date(
                                                item.created_at,
                                            ).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {feedbacks.last_page > 1 && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 24,
                            flexWrap: 'wrap',
                            gap: 12,
                        }}
                    >
                        <p
                            style={{
                                fontSize: '0.78rem',
                                color: 'var(--muted)',
                            }}
                        >
                            Page {feedbacks.current_page} of{' '}
                            {feedbacks.last_page} — {feedbacks.total} entries
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                gap: 6,
                                flexWrap: 'wrap',
                            }}
                        >
                            {feedbacks.links.map((link, i) => {
                                const isArrow =
                                    link.label.includes('&laquo;') ||
                                    link.label.includes('&raquo;');
                                const label = link.label
                                    .replace('&laquo; Previous', '←')
                                    .replace('Next &raquo;', '→');
                                return (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        preserveScroll
                                        style={{
                                            padding: '6px 13px',
                                            borderRadius: 7,
                                            fontSize: '0.78rem',
                                            fontWeight: link.active ? 700 : 400,
                                            background: link.active
                                                ? 'rgba(201,168,76,0.15)'
                                                : 'var(--surface2)',
                                            border: link.active
                                                ? '1px solid rgba(201,168,76,0.5)'
                                                : '1px solid var(--border)',
                                            color: link.active
                                                ? 'var(--gold)'
                                                : link.url
                                                  ? 'var(--muted)'
                                                  : 'rgba(122,131,154,0.3)',
                                            pointerEvents: link.url
                                                ? 'auto'
                                                : 'none',
                                            textDecoration: 'none',
                                            transition: 'all 0.2s',
                                            cursor: link.url
                                                ? 'pointer'
                                                : 'default',
                                        }}
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </CMSLayout>
    );
}
