import { router } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';
import type { GalleryType } from '@/cms/types/cms';

interface Props {
  types: GalleryType[];
}

export default function GalleryRemove({ types }: Props) {
  const [galleryTypeFilter, setGalleryTypeFilter] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('');

  const totalImages = types.reduce((acc, t) => acc + (t.images?.length ?? 0), 0);
  const totalVideos = types.reduce((acc, t) => acc + (t.videos?.length ?? 0), 0);
  const totalItems = totalImages + totalVideos;

  const confirmDelete = (id: number, mediaType: '1' | '2', galleryTypeName: string) => {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    router.post(route('destroy-gallery'), {
      gallery_item_id: id,
      gallery_type: galleryTypeName,
      media_type: mediaType,
    }, {
      preserveScroll: true,
      onSuccess: () => {},
    });
  };

  const isVisible = (galleryTypeName: string, mediaType: 'image' | 'video') => {
    if (galleryTypeFilter && galleryTypeName.toLowerCase() !== galleryTypeFilter.toLowerCase()) return false;
    if (mediaTypeFilter && mediaType !== mediaTypeFilter) return false;
    if (!galleryTypeFilter && !mediaTypeFilter) return false; // hide all by default
    return true;
  };

  return (
    <CMSLayout title="Remove Gallery Image" breadcrumb="Gallery Image Management / Remove Image">
      <div className="page-header">
        <h2>Remove Gallery Images</h2>
        <p>Select and delete images from the gallery</p>
        <div className="gold-line" />
      </div>

      <div className="section-card">
        <div className="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
          Existing Gallery Images
          <span className="badge" style={{ marginLeft: 'auto' }}>
            {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <select
            value={galleryTypeFilter}
            onChange={e => setGalleryTypeFilter(e.target.value)}
            className="h-10"
            style={{ width: 'auto', minWidth: 180 }}
          >
            <option value="">All Gallery Types</option>
            {types.map(t => (
              <option key={t.id} value={t.type.toLowerCase()}>{t.type.charAt(0).toUpperCase() + t.type.slice(1)}</option>
            ))}
          </select>

          <select
            value={mediaTypeFilter}
            onChange={e => setMediaTypeFilter(e.target.value)}
            className="h-10"
            style={{ width: 'auto', minWidth: 160 }}
          >
            <option value="">All Media Types</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        {types.every(t => !t.images?.length && !t.videos?.length) ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🖼️</div>
            <p style={{ fontSize: '0.88rem' }}>No gallery images found.</p>
          </div>
        ) : (
          <div className="img-grid">
            {types.map(type =>
              <>
                {(type.images ?? []).map(image => {
                  const visible = isVisible(type.type, 'image');
                  if (!visible) return null;
                  return (
                    <div
                      key={`img-${image.id}`}
                      className="img-grid-card"
                    >
                      <img
                        className="thumb"
                        src={`${image.path}`}
                        alt={image.title}
                        style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={image.title}>
                          {image.title}
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                          <span className="badge">{type.type.charAt(0).toUpperCase() + type.type.slice(1)}</span>
                          <span className="badge" style={{ background: 'rgba(100,150,255,0.1)', borderColor: 'rgba(100,150,255,0.25)', color: '#A0B8FF' }}>Image</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            className="btn-danger"
                            onClick={() => confirmDelete(image.id, '1', type.type)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {(type.videos ?? []).map(video => {
                  const visible = isVisible(type.type, 'video');
                  if (!visible) return null;
                  return (
                    <div
                      key={`vid-${video.id}`}
                      className="img-grid-card"
                    >
                      <video
                        style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
                        muted
                      >
                        <source src={`${video.path}`} />
                      </video>
                      <div style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={video.title}>
                          {video.title}
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                          <span className="badge">{type.type.charAt(0).toUpperCase() + type.type.slice(1)}</span>
                          <span className="badge" style={{ background: 'rgba(100,150,255,0.1)', borderColor: 'rgba(100,150,255,0.25)', color: '#A0B8FF' }}>Video</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            className="btn-danger"
                            onClick={() => confirmDelete(video.id, '2', type.type)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </CMSLayout>
  );
}
