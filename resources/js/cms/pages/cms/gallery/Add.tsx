import { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import CMSLayout from '@/cms/layouts/CMSLayout';
import { GalleryType } from '@/cms/types/cms';
import { route } from 'ziggy-js';

const isWebp = (file: File) =>
    file.type === 'image/webp' ||
    file.name.toLowerCase().endsWith('.webp');

const VIDEO_EXTENSIONS = ['mp4', 'mov', 'avi'];

const isAllowedVideo = (file: File) =>
    file.type.startsWith('video/') ||
    VIDEO_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(`.${ext}`));

const MAX_IMAGE_SIZE_BYTES = 300 * 1024; // 300 KB limit for images
const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB limit for videos

interface Props {
  types: GalleryType[];
}

export default function GalleryAdd({ types }: Props) {
  const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm({
    gallery_type: '',
    media_type: '',
    title: '',
    description: '',
    gallery_content: null as File | null,
  });

  const [preview, setPreview] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [objectFit, setObjectFit] = useState<'contain' | 'cover'>('contain');
  const [fileTypeText, setFileTypeText] = useState('WEBP only · Max 300KB');
  const [uploadLabel, setUploadLabel] = useState('Upload Image');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleMediaTypeChange = (val: string) => {
    setData('media_type', val);
    setPreview(null);
    clearErrors('gallery_content');
    if (fileRef.current) fileRef.current.value = '';
    if (val === '1') {
      setUploadLabel('Upload Image');
      setFileTypeText('WEBP only · Max 300KB');
      fileRef.current?.setAttribute('accept', 'image/webp');
    } else if (val === '2') {
      setUploadLabel('Upload Video');
      setFileTypeText('MP4, MOV, AVI · Max 50MB');
      fileRef.current?.setAttribute('accept', 'video/*');
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (data.media_type === '1' && !isWebp(file)) {
        setError('gallery_content', 'Only WEBP images are allowed.');
        e.target.value = '';
        return;
    }

    if (data.media_type === '1' && file.size > MAX_IMAGE_SIZE_BYTES) {
        const fileSizeKb = Math.round(file.size / 1024);
        setError('gallery_content', `File size is ${fileSizeKb}KB. Maximum allowed image size is 300KB (aim for < 150KB for fast web load times).`);
        e.target.value = '';
        return;
    }

    if (data.media_type === '2' && !isAllowedVideo(file)) {
        setError('gallery_content', 'Only MP4, MOV, or AVI video files are allowed.');
        e.target.value = '';
        return;
    }

    if (data.media_type === '2' && file.size > MAX_VIDEO_SIZE_BYTES) {
        const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);
        setError('gallery_content', `File size is ${fileSizeMb}MB. Maximum allowed video size is 50MB.`);
        e.target.value = '';
        return;
    }

    clearErrors('gallery_content');
    setData('gallery_content', file);
    const url = URL.createObjectURL(file);
    if (file.type.startsWith('image/')) setPreview({ url, type: 'image' });
    else if (file.type.startsWith('video/')) setPreview({ url, type: 'video' });
  };

    const handleReset = () => {
        if (preview?.url) {
            URL.revokeObjectURL(preview.url);
        }

        reset();
        setPreview(null);
        setFileTypeText('WEBP only · Max 300KB');
        setUploadLabel('Upload Image');

        if (fileRef.current) {
            fileRef.current.value = '';
            fileRef.current.setAttribute('accept', 'image/webp');
        }
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      post(route('save-gallery'), {
          forceFormData: true,
          preserveScroll: true,
          onSuccess: (page) => {
              if (!page.props.flash?.error) {
                  handleReset();
              }
          },
      });
  };

  return (
    <CMSLayout title="Add Gallery Image" breadcrumb="Gallery Image Management / Add Image">
      <div className="page-header">
        <h2>Add Gallery Image</h2>
        <p>Upload a new image or video entry to the gallery</p>
        <div className="gold-line" />
      </div>

      <div className="section-card">
        <div className="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Image Details
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row cols-2">
            <div className="form-group">
              <label>Gallery Type <span style={{ color: '#FF8080' }}>*</span></label>
              <select
                value={data.gallery_type}
                onChange={e => setData('gallery_type', e.target.value)}
                className="h-10"
                required
              >
                <option value="" disabled>Select Gallery Type</option>
                {types.map(t => (
                  <option key={t.id} value={t.id}>{t.type}</option>
                ))}
              </select>
              {errors.gallery_type && <p style={{ color: '#FF8080', fontSize: '0.75rem', marginTop: 5 }}>{errors.gallery_type}</p>}
            </div>

            <div className="form-group">
              <label>Media Type <span style={{ color: '#FF8080' }}>*</span></label>
              <select
                value={data.media_type}
                onChange={e => handleMediaTypeChange(e.target.value)}
                className="h-10"
                required
              >
                <option value="" disabled>Select Media Type</option>
                <option value="1">Image</option>
                <option value="2">Video</option>
              </select>
              {errors.media_type && <p style={{ color: '#FF8080', fontSize: '0.75rem', marginTop: 5 }}>{errors.media_type}</p>}
            </div>
          </div>

          <div className="form-group">
            <label>Title <span style={{ color: '#FF8080' }}>*</span></label>
            <input
              type="text"
              value={data.title}
              onChange={e => setData('title', e.target.value)}
              placeholder="Enter image title..."
              required
            />
            {errors.title && <p style={{ color: '#FF8080', fontSize: '0.75rem', marginTop: 5 }}>{errors.title}</p>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={data.description}
              onChange={e => setData('description', e.target.value)}
              placeholder="Enter image description..."
            />
          </div>

          <div className="form-row cols-2" style={{ alignItems: 'start' }}>
            <div className="form-group">
              <label>
                {uploadLabel} <span style={{ color: '#FF8080' }}>*</span>
              </label>
              <div className="img-uploader">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/webp"
                  className="uploader-input"
                  onChange={handleFile}
                />
                <div style={{ fontSize: '2rem', marginBottom: 8, pointerEvents: 'none' }}>🖼️</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted)', pointerEvents: 'none' }}>
                  Drag & drop or <span style={{ color: 'var(--gold)' }}>browse</span>
                </p>
                <p style={{ marginTop: 4, fontSize: '0.72rem', color: 'var(--muted)', pointerEvents: 'none' }}>
                  {fileTypeText}
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
                  💡 <strong>Recommended:</strong> 1920 × 1080px (Landscape) or 1080 × 1350px (Portrait) · <strong>Strict Max 300KB</strong> (Target &lt; 150KB) · WEBP format
              </div>
              {errors.gallery_content && <p style={{ color: '#FF8080', fontSize: '0.75rem', marginTop: 5 }}>{errors.gallery_content}</p>}
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
                  {preview?.type === 'image' && (
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
                {preview?.type === 'image' && (
                  <img
                    src={preview.url}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: objectFit,
                    }}
                    alt="preview"
                  />
                )}
                {preview?.type === 'video' && (
                  <video controls style={{ width: '100%', height: '100%', objectFit: 'contain' }}>
                    <source src={preview.url} />
                    Your browser does not support video.
                  </video>
                )}
                {!preview && (
                  <div style={{ color: 'var(--muted)', fontSize: '0.78rem', textAlign: 'center', padding: 20 }}>
                    📷<br/>No content selected
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn-primary" disabled={processing}>
              {processing ? 'Uploading...' : 'Upload Content'}
            </button>
            <button type="button" className="btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </div>
    </CMSLayout>
  );
}
