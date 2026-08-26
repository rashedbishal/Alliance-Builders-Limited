import { useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';
import type { Carousel } from '@/cms/types/cms';

const isWebp = (file: File) =>
    file.type === 'image/webp' ||
    file.name.toLowerCase().endsWith('.webp');

const MAX_SIZE_BYTES = 300 * 1024; // 300 KB limit

interface Props {
  carousels: Carousel[];
}

function CarouselCard({ carousel, index }: { carousel: Carousel; index: number }) {
    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        position: String(index + 1),
        property_name: carousel.property_name ?? '',
        description: carousel.description ?? '',
        image: null as File | null,
    });

  const [preview, setPreview] = useState<string | null>(
    carousel.image ? `${carousel.image}` : null
  );
  const [objectFit, setObjectFit] = useState<'contain' | 'cover'>('contain');
  const fileRef = useRef<HTMLInputElement>(null);

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
        setError('image', `File size is ${fileSizeKb}KB. Maximum allowed file size is 300KB (aim for < 150KB for fast web load times).`);
        e.target.value = '';
        return;
    }

    clearErrors('image');
    setData('image', file);
    setPreview(URL.createObjectURL(file));
  };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('update-carousel'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

  return (
      <div className="banner-card">
          <div className="banner-num">BANNER {index + 1}</div>
          <form onSubmit={handleSubmit}>
              <input type="hidden" name="position" value={data.position} />

              <div className="form-row cols-2" style={{ marginTop: 12 }}>
                  <div className="form-group">
                      <label>Property Name</label>
                      <input
                          type="text"
                          value={data.property_name}
                          onChange={(e) =>
                              setData('property_name', e.target.value)
                          }
                          placeholder="Enter property name..."
                      />
                  </div>
                  <div className="form-group">
                      <label>Description</label>
                      <input
                          type="text"
                          value={data.description}
                          onChange={(e) =>
                              setData('description', e.target.value)
                          }
                          placeholder="Enter description..."
                      />
                  </div>
              </div>

              <div className="form-row cols-2" style={{ alignItems: 'start' }}>
                  <div className="form-group">
                      <label>Upload Image</label>
                      <div className="img-uploader">
                          <input
                              ref={fileRef}
                              type="file"
                              accept="image/webp"
                              className="uploader-input"
                              onChange={handleFile}
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
                              WEBP format · Max 300KB · Leave empty to keep current
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
                          💡 <strong>Recommended:</strong> 1920 × 1080px (16:9) or 2560 × 1080px (21:9) · <strong>Strict Max 300KB</strong> (Target &lt; 150KB for fast loads) · WEBP format
                      </div>
                      {errors.image && (
                          <span className="text-sm text-red-500" style={{ marginTop: 6, display: 'block', color: '#FF8080', fontSize: '0.78rem' }}>
                              {errors.image}
                          </span>
                      )}
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
                          {preview && (
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
                          {preview ? (
                              <img
                                  src={preview}
                                  style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: objectFit,
                                  }}
                                  alt="preview"
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

              <button
                  type="submit"
                  className="btn-primary"
                  disabled={processing}
              >
                  {processing ? 'Saving...' : 'Update Banner'}
              </button>
          </form>
      </div>
  );
}

export default function CarouselIndex({ carousels }: Props) {
  return (
    <CMSLayout title="Carousel Banner" breadcrumb="Carousel Banner">
      <div className="page-header">
        <h2>Carousel Banner</h2>
        <p>Manage the homepage carousel banners</p>
        <div className="gold-line" />
      </div>

      <div className="section-card">
        <div className="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="6" width="20" height="12" rx="2"/>
            <path d="M17 12H7M12 7l5 5-5 5"/>
          </svg>
          Banner Management
        </div>

        {carousels.map((carousel, i) => (
          <CarouselCard key={carousel.id} carousel={carousel} index={i} />
        ))}
      </div>
    </CMSLayout>
  );
}
