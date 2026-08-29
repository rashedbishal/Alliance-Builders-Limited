import { router } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { GalleryType } from '@/cms/types/cms';

const cmsSelectTriggerClass =
  'h-10 w-auto min-w-[190px] rounded-lg border border-[rgba(201,168,76,0.2)] bg-[var(--darker)] px-3.5 text-[0.83rem] text-[var(--text)] focus:border-[var(--gold)] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)]';
const cmsSelectContentClass = 'min-w-[190px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]';
const cmsSelectItemClass =
  'text-[var(--text)] hover:bg-[rgba(201,168,76,0.1)] focus:border-[rgba(201,168,76,0.3)] focus:bg-[rgba(201,168,76,0.15)] focus:text-[var(--gold-light)]';

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
          <Select
            value={galleryTypeFilter || 'all'}
            onValueChange={v => setGalleryTypeFilter(v === 'all' ? '' : v)}
          >
            <SelectTrigger className={cmsSelectTriggerClass}>
              <SelectValue placeholder="All Gallery Types" />
            </SelectTrigger>
            <SelectContent className={cmsSelectContentClass}>
              <SelectItem value="all" className={cmsSelectItemClass}>All Gallery Types</SelectItem>
              {types.map(t => (
                <SelectItem key={t.id} value={t.type.toLowerCase()} className={cmsSelectItemClass}>
                  {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={mediaTypeFilter || 'all'}
            onValueChange={v => setMediaTypeFilter(v === 'all' ? '' : v)}
          >
            <SelectTrigger className={cmsSelectTriggerClass}>
              <SelectValue placeholder="All Media Types" />
            </SelectTrigger>
            <SelectContent className={cmsSelectContentClass}>
              <SelectItem value="all" className={cmsSelectItemClass}>All Media Types</SelectItem>
              <SelectItem value="image" className={cmsSelectItemClass}>Image</SelectItem>
              <SelectItem value="video" className={cmsSelectItemClass}>Video</SelectItem>
            </SelectContent>
          </Select>
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
