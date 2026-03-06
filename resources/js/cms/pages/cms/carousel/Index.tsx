import { useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';
import type { Carousel } from '@/cms/types/cms';

interface Props {
  carousels: Carousel[];
}

function CarouselCard({ carousel, index }: { carousel: Carousel; index: number }) {
    const { data, setData, post, processing } = useForm({
        position: String(index + 1),
        property_name: carousel.property_name ?? '',
        description: carousel.description ?? '',
        image: null as File | null,
    });

  const [preview, setPreview] = useState<string | null>(
    carousel.image ? `${carousel.image}` : null
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
              onChange={e => setData('property_name', e.target.value)}
              placeholder="Enter property name..."
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={data.description}
              onChange={e => setData('description', e.target.value)}
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
                accept="image/*"
                className="uploader-input"
                onChange={handleFile}
              />
              <div style={{ fontSize: '2rem', marginBottom: 8, pointerEvents: 'none' }}>🖼️</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', pointerEvents: 'none' }}>
                Drag & drop or <span style={{ color: 'var(--gold)' }}>browse</span>
              </p>
              <p style={{ marginTop: 4, fontSize: '0.72rem', color: 'var(--muted)', pointerEvents: 'none' }}>
                JPG, PNG, WEBP · Leave empty to keep current
              </p>
            </div>
          </div>
          <div className="form-group">
            <label>Preview</label>
            <div className="preview-box" style={{ height: 140 }}>
              {preview
                ? <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
                : <div style={{ color: 'var(--muted)', fontSize: '0.78rem', textAlign: 'center', padding: 20 }}>📷<br/>No image selected</div>
              }
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={processing}>
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
