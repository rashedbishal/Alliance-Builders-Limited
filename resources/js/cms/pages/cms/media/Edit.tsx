import { useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';
import type { MediaCoverage } from '@/cms/types/cms';

const isWebp = (file: File) =>
    file.type === 'image/webp' ||
    file.name.toLowerCase().endsWith('.webp');

const MAX_SIZE_BYTES = 300 * 1024; // 300 KB limit

interface Props {
  mediaItems: MediaCoverage[];
}

export default function MediaEdit({ mediaItems }: Props) {
  const [selectedId, setSelectedId] = useState('');
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [objectFit, setObjectFit] = useState<'contain' | 'cover'>('contain');
  const fileRef = useRef<HTMLInputElement>(null);

  const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm({
    media_id: '',
    media_title: '',
    media_type: '',
    news_hyperlink: '',
    isFeatured: false as boolean,
    image: null as File | null,
  });

  const handleSelect = (id: string) => {
    setSelectedId(id);
    reset();
    clearErrors();
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';

    if (!id) {
      setExistingImage(null);
      return;
    }

    const item = mediaItems.find(m => String(m.id) === id);
    if (!item) return;

    setData({
      media_id: String(item.id),
      media_title: item.media_title,
      media_type: item.media_type,
      news_hyperlink: item.news_hyperlink,
      isFeatured: !!item.isFeatured,
      image: null,
    });
    setExistingImage(item.image?.path ?? null);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isWebp(file)) {
        setError('image', 'Only WEBP images are allowed.');
        e.target.value = '';
        return;
    }

    if (file.size > MAX_SIZE_BYTES) {
        const fileSizeKb = Math.round(file.size / 1024);
        setError('image', `File size is ${fileSizeKb}KB. Maximum allowed image size is 300KB (aim for < 100KB for fast web load times).`);
        e.target.value = '';
        return;
    }

    clearErrors('image');
    setData('image', file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('update-media'), {
        forceFormData: true,
        preserveScroll: true,
    });
  };

  const displayedImage = preview ?? existingImage;

  return (
    <CMSLayout title="Edit Media Coverage" breadcrumb="Media Coverage Management / Edit Media">
      <div className="page-header">
        <h2>Edit Media Coverage</h2>
        <p>Update an existing media coverage entry</p>
        <div className="gold-line" />
      </div>

      <div className="section-card">
        <div className="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 6h16M4 10h16M4 14h10"/>
            <circle cx="18" cy="17" r="3"/>
            <path d="M20.2 19.2L22 21"/>
          </svg>
          Media Details
        </div>

        <div className="form-group">
          <label>Select Media Entry</label>
          <select
            value={selectedId}
            onChange={e => handleSelect(e.target.value)}
            className="h-10"
          >
            <option value="">Select a media entry to edit...</option>
            {mediaItems.map(item => (
              <option key={item.id} value={item.id}>{item.media_title}</option>
            ))}
          </select>
        </div>

        {selectedId && (
          <form onSubmit={handleSubmit}>
            <div className="form-row cols-2">
              <div className="form-group">
                <label>Media Title <span style={{ color: '#FF8080' }}>*</span></label>
                <input
                  type="text"
                  value={data.media_title}
                  onChange={e => setData('media_title', e.target.value)}
                  placeholder="Enter media title..."
                  required
                />
                {errors.media_title && <p style={{ color: '#FF8080', fontSize: '0.75rem', marginTop: 5 }}>{errors.media_title}</p>}
              </div>

              <div className="form-group">
                <label>Media Type <span style={{ color: '#FF8080' }}>*</span></label>
                <input
                  type="text"
                  value={data.media_type}
                  onChange={e => setData('media_type', e.target.value)}
                  placeholder="Enter media type..."
                  required
                />
                {errors.media_type && <p style={{ color: '#FF8080', fontSize: '0.75rem', marginTop: 5 }}>{errors.media_type}</p>}
              </div>
            </div>

            <div className="form-group">
              <label>Hyperlink <span style={{ color: '#FF8080' }}>*</span></label>
              <input
                type="url"
                value={data.news_hyperlink}
                onChange={e => setData('news_hyperlink', e.target.value)}
                placeholder="https://example.com/article..."
                required
              />
              {errors.news_hyperlink && <p style={{ color: '#FF8080', fontSize: '0.75rem', marginTop: 5 }}>{errors.news_hyperlink}</p>}
            </div>

            <div className="form-group">
              <label className="featured-check">
                <input
                  type="checkbox"
                  checked={data.isFeatured}
                  onChange={e => setData('isFeatured', e.target.checked)}
                  style={{ accentColor: 'var(--gold)', width: 16, height: 16 }}
                />
                <span style={{ fontSize: '0.83rem', color: 'var(--text)' }}>Mark as Featured Media</span>
              </label>
            </div>

            <div className="form-row cols-2" style={{ alignItems: 'start' }}>
              <div className="form-group">
                <label>Replace Image</label>
                <div className="img-uploader">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/webp"
                    className="uploader-input"
                    onChange={handleFile}
                  />
                  <div style={{ fontSize: '2rem', marginBottom: 8, pointerEvents: 'none' }}>📰</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)', pointerEvents: 'none' }}>
                    Drag & drop or <span style={{ color: 'var(--gold)' }}>browse</span>
                  </p>
                  <p style={{ marginTop: 4, fontSize: '0.72rem', color: 'var(--muted)', pointerEvents: 'none' }}>
                    WEBP format · Max 300KB · Leave empty to keep current image
                  </p>
                </div>
                <div
                    style={{
                        marginTop: 8,
                        padding: '8px 12px',
                        borderRadius: 6,
                        background: 'rgba(201,168,76,0.06)',
                        border: '1px solid rgba(201,168,76,0.15)',
                        fontSize: '0.75rem',
                        color: 'var(--gold-light)',
                    }}
                >
                    💡 <strong>Recommended:</strong> 1200 × 630px · <strong>Strict Max 300KB</strong> (Target &lt; 100KB) · WEBP format
                </div>
                {errors.image && <p style={{ color: '#FF8080', fontSize: '0.75rem', marginTop: 5 }}>{errors.image}</p>}
              </div>

              <div className="form-group">
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 6,
                    }}
                >
                    <label style={{ margin: 0 }}>Preview</label>
                    {displayedImage && (
                        <div style={{ display: 'flex', gap: 6 }}>
                            <button
                                type="button"
                                onClick={() => setObjectFit('contain')}
                                style={{
                                    padding: '2px 8px',
                                    fontSize: '0.7rem',
                                    borderRadius: 4,
                                    border: '1px solid var(--border)',
                                    background:
                                        objectFit === 'contain'
                                            ? 'var(--gold)'
                                            : 'transparent',
                                    color:
                                        objectFit === 'contain'
                                            ? '#000'
                                            : 'var(--text)',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                }}
                            >
                                Fit Uncropped
                            </button>
                            <button
                                type="button"
                                onClick={() => setObjectFit('cover')}
                                style={{
                                    padding: '2px 8px',
                                    fontSize: '0.7rem',
                                    borderRadius: 4,
                                    border: '1px solid var(--border)',
                                    background:
                                        objectFit === 'cover'
                                            ? 'var(--gold)'
                                            : 'transparent',
                                    color:
                                        objectFit === 'cover'
                                            ? '#000'
                                            : 'var(--text)',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                  }}
                            >
                                Fill Frame
                            </button>
                        </div>
                    )}
                </div>
                <div
                    className="preview-box"
                    style={{
                        minHeight: 220,
                        maxHeight: 280,
                        width: '100%',
                        aspectRatio: '16/9',
                        background: '#0a0b0e',
                        borderRadius: 10,
                        overflow: 'hidden',
                        border: '1px solid var(--border)',
                    }}
                >
                  {displayedImage ? (
                    <img
                      src={displayedImage}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: objectFit,
                      }}
                      alt="preview"
                    />
                  ) : (
                    <div style={{ color: 'var(--muted)', fontSize: '0.78rem', textAlign: 'center', padding: 20 }}>
                      📷<br/>No image
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="submit" className="btn-primary" disabled={processing}>
                {processing ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => handleSelect('')}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </CMSLayout>
  );
}
