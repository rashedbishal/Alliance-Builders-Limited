import { router } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';
import type { MediaCoverage } from '@/cms/types/cms';

interface Props {
  mediaItems: {
    data: MediaCoverage[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
  };
}

const mediaIcons: Record<string, string> = {
  newspaper: '📰',
  online_portal: '🌐',
  television: '📺',
  magazine: '📖',
  blog: '✍️',
};

export default function MediaRemove({ mediaItems }: Props) {
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const confirmDelete = (id: number) => {
    if (!confirm('Delete this media entry? This cannot be undone.')) return;
    setDeletingIds(prev => new Set(prev).add(id));
    router.post(route('destroy-media'), { media_item_id: id }, {
      preserveScroll: true,
      onFinish: () => setDeletingIds(prev => { const s = new Set(prev); s.delete(id); return s; }),
    });
  };

  const formatType = (t: string) => t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <CMSLayout title="Remove Media Coverage" breadcrumb="Media Coverage Management / Remove Image">
      <div className="page-header">
        <h2>Remove Media Coverage</h2>
        <p>Delete existing media coverage entries</p>
        <div className="gold-line" />
      </div>

      <div className="section-card">
        <div className="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 6h16M4 10h16M4 14h10"/>
            <circle cx="18" cy="17" r="3"/>
            <path d="M20.2 19.2L22 21"/>
          </svg>
          Existing Media Entries
          <span className="badge" style={{ marginLeft: 'auto' }}>
            {mediaItems.data.length} {mediaItems.data.length === 1 ? 'Entry' : 'Entries'}
          </span>
        </div>

        {mediaItems.data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📰</div>
            <p style={{ fontSize: '0.88rem' }}>No media coverage entries found.</p>
          </div>
        ) : (
          <>
            <div className="img-grid">
              {mediaItems.data.map(item => (
                <div
                  key={item.id}
                  className="img-grid-card"
                  style={{
                    opacity: deletingIds.has(item.id) ? 0 : 1,
                    transform: deletingIds.has(item.id) ? 'scale(0.85)' : 'none',
                    transition: 'transform 0.3s ease, opacity 0.3s ease',
                  }}
                >
                  {item.image?.path ? (
                    <img
                      style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
                      src={`${item.image.path}`}
                      alt={item.media_title}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'linear-gradient(135deg, var(--surface), var(--darker))',
                      fontSize: '2.5rem',
                    }}>
                      {mediaIcons[item.media_type] ?? '📄'}
                    </div>
                  )}

                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.media_title}>
                      {item.media_title}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                      {item.media_type && <span className="badge">{formatType(item.media_type)}</span>}
                      {item.isFeatured ? (
                        <span className="badge" style={{ background: 'rgba(201,168,76,0.2)', borderColor: 'var(--gold)' }}>⭐ Featured</span>
                      ) : ' '}
                    </div>
                    {item.news_hyperlink && (
                      <a
                        href={item.news_hyperlink}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'block', fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        title={item.news_hyperlink}
                      >
                        🔗 {item.news_hyperlink}
                      </a>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button className="btn-danger" onClick={() => confirmDelete(item.id)}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {mediaItems.last_page > 1 && (
              <div style={{ marginTop: 28, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {mediaItems.links.map((link, i) => (
                  <button
                    key={i}
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url)}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    style={{
                      padding: '6px 12px', borderRadius: 6, fontSize: '0.78rem', cursor: link.url ? 'pointer' : 'not-allowed',
                      background: link.active ? 'rgba(201,168,76,0.2)' : 'var(--surface)',
                      border: link.active ? '1px solid var(--gold)' : '1px solid var(--border)',
                      color: link.active ? 'var(--gold)' : 'var(--muted)',
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </CMSLayout>
  );
}
