import { Link, router } from '@inertiajs/react';
import { Fragment, useState } from 'react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';
import type { JobApplication } from '@/cms/types/cms';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedApplications {
    data: JobApplication[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
    prev_page_url: string | null;
}

interface Props {
    applications: PaginatedApplications;
}

const cellStyle: React.CSSProperties = {
    padding: '13px 16px',
    color: 'var(--muted)',
    whiteSpace: 'nowrap',
};

const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

function DownloadIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    );
}

function DetailRow({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div
            style={{
                display: 'flex',
                gap: 12,
                marginBottom: 10,
                flexWrap: 'wrap',
            }}
        >
            <div
                style={{
                    width: 130,
                    flexShrink: 0,
                    fontSize: '0.72rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    fontWeight: 600,
                    paddingTop: 2,
                }}
            >
                {label}
            </div>
            <div
                style={{
                    flex: 1,
                    minWidth: 200,
                    color: 'var(--text)',
                    fontSize: '0.83rem',
                }}
            >
                {children}
            </div>
        </div>
    );
}

export default function CareerApplications({ applications }: Props) {
    const [expanded, setExpanded] = useState<number | null>(null);
    const [deleting, setDeleting] = useState<number | null>(null);

    const startSerial =
        (applications.current_page - 1) * applications.per_page + 1;

    const confirmDelete = (app: JobApplication) => {
        if (
            !confirm(
                `Delete the application from "${app.name}" for "${app.job_title}"?\n\nThe uploaded CV will also be permanently deleted. This cannot be undone.`,
            )
        ) {
            return;
        }
        setDeleting(app.id);
        // If this is the last row on a page beyond the first, go back a page
        // after deleting so the admin doesn't land on an empty page.
        const goBack =
            applications.data.length === 1 && applications.prev_page_url;
        router.post(
            route('career-application-destroy'),
            { application_id: app.id },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setExpanded(null);
                    if (goBack) {
                        router.visit(applications.prev_page_url as string, {
                            preserveScroll: true,
                        });
                    }
                },
                onFinish: () => setDeleting(null),
            },
        );
    };

    return (
        <CMSLayout title="Job Applications" breadcrumb="Career / Applications">
            <div className="page-header">
                <h2>Job Applications</h2>
                <p>
                    Applications submitted through the Career page. Click a row
                    to see the full details.
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
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    All Candidates
                    <span
                        className="badge"
                        style={{ marginLeft: 'auto', fontSize: '0.72rem' }}
                    >
                        {applications.total} total
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
                                    '',
                                    '#',
                                    'Name',
                                    'Phone',
                                    'Position',
                                    'Date',
                                    'Actions',
                                ].map((col, i) => (
                                    <th
                                        key={i}
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
                            {applications.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
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
                                        No applications yet
                                    </td>
                                </tr>
                            ) : (
                                applications.data.map((app, idx) => {
                                    const isOpen = expanded === app.id;
                                    return (
                                        <Fragment key={app.id}>
                                            <tr
                                                onClick={() =>
                                                    setExpanded(
                                                        isOpen ? null : app.id,
                                                    )
                                                }
                                                style={{
                                                    borderBottom: isOpen
                                                        ? 'none'
                                                        : '1px solid rgba(201,168,76,0.07)',
                                                    background: isOpen
                                                        ? 'rgba(201,168,76,0.05)'
                                                        : 'transparent',
                                                    cursor: 'pointer',
                                                    opacity:
                                                        deleting === app.id
                                                            ? 0.4
                                                            : 1,
                                                    transition:
                                                        'background 0.15s',
                                                }}
                                            >
                                                <td
                                                    style={{
                                                        ...cellStyle,
                                                        width: 32,
                                                        paddingRight: 0,
                                                    }}
                                                >
                                                    <svg
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        style={{
                                                            transition:
                                                                'transform 0.2s',
                                                            transform: isOpen
                                                                ? 'rotate(90deg)'
                                                                : 'none',
                                                            color: 'var(--gold)',
                                                        }}
                                                    >
                                                        <path d="M9 18l6-6-6-6" />
                                                    </svg>
                                                </td>
                                                <td
                                                    style={{
                                                        ...cellStyle,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {startSerial + idx}
                                                </td>
                                                <td
                                                    style={{
                                                        ...cellStyle,
                                                        color: 'var(--text)',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {app.name}
                                                </td>
                                                <td style={cellStyle}>
                                                    <a
                                                        href={`tel:${app.phone}`}
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        style={{
                                                            color: 'inherit',
                                                            textDecoration:
                                                                'none',
                                                        }}
                                                    >
                                                        {app.phone}
                                                    </a>
                                                </td>
                                                <td
                                                    style={{
                                                        ...cellStyle,
                                                        whiteSpace: 'normal',
                                                        minWidth: 160,
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            color: 'var(--gold-light)',
                                                        }}
                                                    >
                                                        {app.job_title}
                                                    </span>
                                                    {app.job_post_id ===
                                                        null && (
                                                        <span
                                                            className="badge"
                                                            style={{
                                                                marginLeft: 8,
                                                                fontSize:
                                                                    '0.6rem',
                                                            }}
                                                            title="Not linked to an active job post (typed-in position, or the job post was deleted)"
                                                        >
                                                            Unlisted
                                                        </span>
                                                    )}
                                                </td>
                                                <td
                                                    style={{
                                                        ...cellStyle,
                                                        fontSize: '0.75rem',
                                                    }}
                                                >
                                                    {new Date(
                                                        app.created_at,
                                                    ).toLocaleDateString(
                                                        'en-GB',
                                                        {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        },
                                                    )}
                                                </td>
                                                <td
                                                    style={cellStyle}
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            gap: 8,
                                                        }}
                                                    >
                                                        <a
                                                            href={route(
                                                                'career-application-cv',
                                                                app.id,
                                                            )}
                                                            className="btn-secondary"
                                                            style={{
                                                                padding:
                                                                    '7px 14px',
                                                                fontSize:
                                                                    '0.75rem',
                                                                display:
                                                                    'inline-flex',
                                                                alignItems:
                                                                    'center',
                                                                gap: 6,
                                                                textDecoration:
                                                                    'none',
                                                            }}
                                                            title={
                                                                app.cv_original_name
                                                            }
                                                        >
                                                            <DownloadIcon />
                                                            CV
                                                        </a>
                                                        <button
                                                            type="button"
                                                            className="btn-danger"
                                                            style={{
                                                                padding:
                                                                    '7px 14px',
                                                                fontSize:
                                                                    '0.75rem',
                                                            }}
                                                            disabled={
                                                                deleting ===
                                                                app.id
                                                            }
                                                            onClick={() =>
                                                                confirmDelete(
                                                                    app,
                                                                )
                                                            }
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {isOpen && (
                                                <tr
                                                    style={{
                                                        background:
                                                            'rgba(201,168,76,0.05)',
                                                        borderBottom:
                                                            '1px solid rgba(201,168,76,0.15)',
                                                    }}
                                                >
                                                    <td
                                                        colSpan={7}
                                                        style={{
                                                            padding:
                                                                '6px 24px 22px 56px',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                background:
                                                                    'var(--darker)',
                                                                border: '1px solid var(--border)',
                                                                borderRadius: 10,
                                                                padding: 20,
                                                            }}
                                                        >
                                                            <DetailRow label="Position">
                                                                {app.job_title}
                                                            </DetailRow>
                                                            <DetailRow label="Full Name">
                                                                {app.name}
                                                            </DetailRow>
                                                            <DetailRow label="Phone">
                                                                <a
                                                                    href={`tel:${app.phone}`}
                                                                    style={{
                                                                        color: 'var(--text)',
                                                                    }}
                                                                >
                                                                    {app.phone}
                                                                </a>
                                                            </DetailRow>
                                                            <DetailRow label="Email">
                                                                {app.email ? (
                                                                    <a
                                                                        href={`mailto:${app.email}`}
                                                                        style={{
                                                                            color: 'var(--gold)',
                                                                        }}
                                                                    >
                                                                        {
                                                                            app.email
                                                                        }
                                                                    </a>
                                                                ) : (
                                                                    <span
                                                                        style={{
                                                                            color: 'var(--muted)',
                                                                        }}
                                                                    >
                                                                        Not
                                                                        provided
                                                                    </span>
                                                                )}
                                                            </DetailRow>
                                                            <DetailRow label="Submitted">
                                                                {formatDateTime(
                                                                    app.created_at,
                                                                )}
                                                            </DetailRow>
                                                            <DetailRow label="CV">
                                                                <a
                                                                    href={route(
                                                                        'career-application-cv',
                                                                        app.id,
                                                                    )}
                                                                    style={{
                                                                        color: 'var(--gold)',
                                                                        display:
                                                                            'inline-flex',
                                                                        alignItems:
                                                                            'center',
                                                                        gap: 6,
                                                                    }}
                                                                >
                                                                    <DownloadIcon />
                                                                    {
                                                                        app.cv_original_name
                                                                    }
                                                                </a>
                                                            </DetailRow>
                                                            <DetailRow label="Cover Letter">
                                                                <div
                                                                    style={{
                                                                        whiteSpace:
                                                                            'pre-line',
                                                                        lineHeight: 1.65,
                                                                        color: 'var(--text)',
                                                                        wordBreak:
                                                                            'break-word',
                                                                    }}
                                                                >
                                                                    {
                                                                        app.message
                                                                    }
                                                                </div>
                                                            </DetailRow>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {applications.last_page > 1 && (
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
                            Page {applications.current_page} of{' '}
                            {applications.last_page} — {applications.total}{' '}
                            entries
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                gap: 6,
                                flexWrap: 'wrap',
                            }}
                        >
                            {applications.links.map((link, i) => {
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
