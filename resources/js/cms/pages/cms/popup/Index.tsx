import { useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';
import type { Popup } from '@/cms/types/cms';

interface Props {
  popup: Popup;
}

export default function PopupIndex({ popup }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    isEnabled: popup.isEnabled ? '1' : '0',
    image: null as File | null,
  });

  const currentImage = popup.imagePath
    ? `/storage/popup/${popup.imagePath}`
    : null;

  const [preview, setPreview] = useState<string | null>(currentImage);
  const [enabled, setEnabled] = useState(popup.isEnabled);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setData('image', file);
    setPreview(URL.createObjectURL(file));
  };

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    setData('isEnabled', next ? '1' : '0');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('save-popup'));
  };

  return (
    <CMSLayout title="Pop-up Settings" breadcrumb="Pop-up Settings">
      <div className="page-header">
        <h2>Pop-up Settings</h2>
        <p>Manage the homepage popup visibility and image</p>
        <div className="gold-line" />
      </div>

      <div className="section-card">
        <div className="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 9h6M9 12h6M9 15h4"/>
          </svg>
          Popup Configuration
        </div>

        <form onSubmit={handleSubmit}>
          {/* Toggle */}
          <div className="form-group" style={{ marginBottom: 28 }}>
            <label style={{ marginBottom: 12 }}>Popup Status</label>
            <div
              className="toggle-switch"
              style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', userSelect: 'none' }}
              onClick={handleToggle}
            >
              <div className={`toggle-slider${enabled ? ' on' : ''}`} />
              <span className={`toggle-label${enabled ? ' on' : ''}`}>
                {enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            {errors.isEnabled && <p style={{ color: '#FF8080', fontSize: '0.75rem', marginTop: 5 }}>{errors.isEnabled}</p>}
          </div>

          {/* Image Upload + Preview */}
          <div className="form-row cols-2" style={{ alignItems: 'start' }}>
            <div className="form-group">
              <label>Popup Image</label>
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
              {errors.image && <p style={{ color: '#FF8080', fontSize: '0.75rem', marginTop: 5 }}>{errors.image}</p>}
            </div>

            <div className="form-group">
              <label>Preview</label>
              <div className="preview-box" style={{ height: 158 }}>
                {preview
                  ? <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="popup preview" />
                  : <div style={{ color: 'var(--muted)', fontSize: '0.78rem', textAlign: 'center', padding: 20 }}>📷<br/>No image selected</div>
                }
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn-primary" disabled={processing}>
              {processing ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </CMSLayout>
  );
}
