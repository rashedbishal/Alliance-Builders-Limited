import { useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';
import type { ProjectType, Location, Facility, Tag, Project } from '@/cms/types/cms';

const isWebp = (file: File) =>
    file.type === 'image/webp' ||
    file.name.toLowerCase().endsWith('.webp');

const APARTMENT_DIRECTIONS = [
  'North', 'North-East', 'East', 'South-East',
  'South', 'South-West', 'West', 'North-West',
];
const BEDROOM_MIN = 0;
const BEDROOM_MAX = 10;
const BATHROOM_MIN = 1;
const BATHROOM_MAX = 10;
const SQFT_MIN = 100;
const SQFT_MAX = 50000;
const DESCRIPTION_MAX = 300;
const SURROUNDINGS_MAX = 500;

const nextDay = (dateStr: string) => {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return undefined;
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <p style={{ color: '#FF8080', fontSize: '0.75rem', marginTop: 5 }}>
      {message}
    </p>
  );
};

interface Props {
  types: ProjectType[];
  locations: Location[];
  facilities: Facility[];
  tags: Tag[];
}

export default function ProjectUpdate({ types, locations, facilities, tags }: Props) {
  const [selectedType, setSelectedType] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectOptions, setProjectOptions] = useState<{ id: number; name: string }[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm({
    project_id_db: '',
    name: '', address: '', google_map_url: '', price: '',
    size: '', floors: '', construction_start_date: '', handover_date: '',
    isFeatured: false as boolean, description: '', surroundings: '',
    project_type_id: '', location_id: '', project_id: '',
    apartment_size: '', bedroom: '', bathroom: '', balcony: '',
    kitchen: '', living_dining: '', parking: '',
    garage_no: '', garage_size: '', apartment_direction: '', youtube_video_id: '',
    facilities: [] as number[],
    tags: [] as number[],
    thumbnail: null as File | null,
    project_images: [] as File[],
  });

    const [thumbPreview, setThumbPreview] = useState<string | null>(null);
    const [existingThumb, setExistingThumb] = useState<string | null>(null);
    const [projectImagePreviews, setProjectImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<{ id: number; image: string; url: string }[]>([]);
    const [deletingImageIds, setDeletingImageIds] = useState<Set<number>>(new Set());
      const thumbRef = useRef<HTMLInputElement>(null);
      const imagesRef = useRef<HTMLInputElement>(null);

  const fetchProjectsByType = async (typeId: string) => {
    setSelectedType(typeId);
    setSelectedProjectId('');
    setLoaded(false);
    reset();
    setProjectOptions([]);
    if (!typeId) return;
    setLoadingProjects(true);
    try {
      const res = await fetch(`/cms/projects/by-type?type=${typeId}`);
      const data = await res.json();
      setProjectOptions(data);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchProjectData = async (id: string) => {
    setSelectedProjectId(id);
    setLoaded(false);
    if (!id) return;
    setLoadingData(true);
    try {
      const res = await fetch(`/cms/projects/${id}/data`);
      const project: Project = await res.json();
      setData({
        project_id_db: String(project.id),
        name: project.name ?? '',
        address: project.address ?? '',
        google_map_url: project.google_map_url ?? '',
        price: String(project.price ?? ''),
        size: project.size ?? '',
        floors: project.floors ?? '',
        construction_start_date: project.construction_start_date ?? '',
        handover_date: project.handover_date ?? '',
        isFeatured: !!project.isFeatured,
        description: project.description ?? '',
        surroundings: project.surroundings ?? '',
        project_type_id: String(project.project_type_id ?? ''),
        location_id: String(project.location_id ?? ''),
        project_id: project.project_id ?? '',
        apartment_size: project.details?.apartment_size ?? '',
        bedroom: project.details?.bedroom ?? '',
        bathroom: project.details?.bathroom ?? '',
        balcony: project.details?.balcony ?? '',
        kitchen: project.details?.kitchen ?? '',
        living_dining: project.details?.living_dining ?? '',
        parking: project.details?.parking ?? '',
        garage_no: project.details?.garage_no ?? '',
        garage_size: project.details?.garage_size ?? '',
        apartment_direction: project.details?.apartment_direction ?? '',
        youtube_video_id: project.details?.youtube_video_id ?? '',
        facilities: (project.facilities ?? []).map(f => f.id),
        tags: (project.tags ?? []).map(t => t.id),
        thumbnail: null,
        project_images: [],
      });
        if (project.image?.path) setExistingThumb(`${project.image.path}`);
        else setExistingThumb(null);

        const imgs = (project.project_images ?? []).map((img) => ({
            id: img.id,
            image: img.image,
            url: `/${img.image}`,
        }));
        setExistingImages(imgs);

        setThumbPreview(null);
        setProjectImagePreviews([]);
        setLoaded(true);
    } finally {
      setLoadingData(false);
    }
  };

  const toggleFacility = (id: number) => {
    setData('facilities', data.facilities.includes(id)
      ? data.facilities.filter(f => f !== id)
      : [...data.facilities, id]);
  };

  const toggleTag = (id: number) => {
    setData('tags', data.tags.includes(id)
      ? data.tags.filter(t => t !== id)
      : [...data.tags, id]);
  };

    const getXsrfToken = () => {
        const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
        return match ? decodeURIComponent(match[1]) : '';
    };

    const deleteExistingImage = async (imageId: number) => {
        if (!confirm('Delete this image? This cannot be undone.')) return;
        setDeletingImageIds((prev) => new Set(prev).add(imageId));
        try {
            const res = await fetch(route('destroy-project-image'), {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getXsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ image_id: imageId }),
            });
            const result = await res.json();
            if (result.success) {
                setExistingImages((prev) =>
                    prev.filter((img) => img.id !== imageId),
                );
            } else {
                alert(
                    'Failed to delete: ' + (result.message ?? 'Unknown error'),
                );
            }
        } catch(err) {
            console.log('DELETE ERROR:', err);
            alert('Failed to delete image: ' + err);
        } finally {
            setDeletingImageIds((prev) => {
                const s = new Set(prev);
                s.delete(imageId);
                return s;
            });
        }
    };

  const handleThumb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isWebp(file)) {
        setError('thumbnail', 'Only WEBP images are allowed.');
        e.target.value = '';
        return;
    }

    if (file.size > 300 * 1024) {
        const fileSizeKb = Math.round(file.size / 1024);
        setError('thumbnail', `File size is ${fileSizeKb}KB. Maximum allowed thumbnail size is 300KB (aim for < 150KB).`);
        e.target.value = '';
        return;
    }

    clearErrors('thumbnail');
    setData('thumbnail', file);
    setThumbPreview(URL.createObjectURL(file));
  };

  const handleProjectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const rejected = files.some(f => !isWebp(f));

    if (rejected) {
        setError('project_images', 'Only WEBP images are allowed.');
        e.target.value = '';
        return;
    }

    const overSized = files.find(f => f.size > 300 * 1024);
    if (overSized) {
        setError('project_images', 'One or more images exceed the 300KB limit. Please compress project gallery WEBP images.');
        e.target.value = '';
        return;
    }

    clearErrors('project_images');
    setData('project_images', files);
    setProjectImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('update-project'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                if (!page.props.flash?.error) {
                    setSelectedType('');
                    setSelectedProjectId('');
                    setProjectOptions([]);
                    setLoaded(false);
                }
            },
        });
    };

  return (
      <CMSLayout
          title="Update Project"
          breadcrumb="Project Info Management / Update Project"
      >
          <div className="page-header">
              <h2>Update Project</h2>
              <p>Select and update an existing project</p>
              <div className="gold-line" />
          </div>

          {/* Project Selector */}
          <div className="section-card">
              <div className="section-title">
                  <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                  >
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                  </svg>
                  Select Project
              </div>
              <div className="form-row cols-2">
                  <div className="form-group">
                      <label>
                          Project Type{' '}
                          <span style={{ color: '#FF8080' }}>*</span>
                      </label>
                      <select
                          value={selectedType}
                          onChange={(e) => fetchProjectsByType(e.target.value)}
                          className="h-10"
                      >
                          <option value="">Select Project Type</option>
                          {types.map((t) => (
                              <option key={t.id} value={t.id}>
                                  {t.name}
                              </option>
                          ))}
                      </select>
                  </div>
                  <div className="form-group">
                      <label>
                          Project Name{' '}
                          <span style={{ color: '#FF8080' }}>*</span>
                      </label>
                      <select
                          value={selectedProjectId}
                          onChange={(e) => fetchProjectData(e.target.value)}
                          disabled={!selectedType || loadingProjects}
                          className="h-10"
                      >
                          <option value="">Select Project Name</option>
                          {projectOptions.map((p) => (
                              <option key={p.id} value={p.id}>
                                  {p.name}
                              </option>
                          ))}
                      </select>
                  </div>
              </div>
              {(loadingProjects || loadingData) && (
                  <p
                      style={{
                          fontSize: '0.8rem',
                          color: 'var(--muted)',
                          marginTop: -8,
                      }}
                  >
                      ⏳{' '}
                      {loadingProjects
                          ? 'Loading projects...'
                          : 'Loading project data...'}
                  </p>
              )}
          </div>

          {loaded && (
              <form onSubmit={handleSubmit}>
                  {/* Basic Info */}
                  <div className="section-card">
                      <div className="section-title">
                          <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                          >
                              <path d="M3 21h18M9 21V9l3-6 3 6v12M5 21V12l-2-2M19 21V12l2-2" />
                          </svg>
                          Basic Information
                      </div>

                      <div className="form-row cols-2">
                          <div className="form-group">
                              <label>
                                  Project Name{' '}
                                  <span style={{ color: '#FF8080' }}>*</span>
                              </label>
                              <input
                                  type="text"
                                  value={data.name}
                                  onChange={(e) =>
                                      setData('name', e.target.value)
                                  }
                              />
                              {errors.name && (
                                  <p
                                      style={{
                                          color: '#FF8080',
                                          fontSize: '0.75rem',
                                          marginTop: 5,
                                      }}
                                  >
                                      {errors.name}
                                  </p>
                              )}
                          </div>
                          <div className="form-group">
                              <label>
                                  Project ID{' '}
                                  <span style={{ color: '#FF8080' }}>*</span>
                              </label>
                              <input
                                  type="text"
                                  value={data.project_id}
                                  onChange={(e) =>
                                      setData('project_id', e.target.value)
                                  }
                              />
                          </div>
                      </div>

                      <div className="form-row cols-2">
                          <div className="form-group">
                              <label>Project Type</label>
                              <select
                                  value={data.project_type_id}
                                  onChange={(e) =>
                                      setData('project_type_id', e.target.value)
                                  }
                                  className="h-10"
                              >
                                  <option value="" disabled>
                                      Select type
                                  </option>
                                  {types.map((t) => (
                                      <option key={t.id} value={t.id}>
                                          {t.name}
                                      </option>
                                  ))}
                              </select>
                          </div>
                          <div className="form-group">
                              <label>Location</label>
                              <select
                                  value={data.location_id}
                                  onChange={(e) =>
                                      setData('location_id', e.target.value)
                                  }
                                  className="h-10"
                              >
                                  <option value="" disabled>
                                      Select location
                                  </option>
                                  {locations.map((l) => (
                                      <option key={l.id} value={l.id}>
                                          {l.name}
                                      </option>
                                  ))}
                              </select>
                          </div>
                      </div>

                      <div className="form-group">
                          <label>Address</label>
                          <input
                              type="text"
                              value={data.address}
                              onChange={(e) =>
                                  setData('address', e.target.value)
                              }
                          />
                      </div>

                      <div className="form-row cols-4">
                          <div className="form-group">
                              <label>Price (BDT)</label>
                              <input
                                  type="number"
                                  value={data.price}
                                  onChange={(e) =>
                                      setData('price', e.target.value)
                                  }
                              />
                          </div>
                          <div className="form-group">
                              <label>Size</label>
                              <div style={{ position: 'relative' }}>
                                  <input
                                      type="number"
                                      min={SQFT_MIN}
                                      max={SQFT_MAX}
                                      step="1"
                                      inputMode="numeric"
                                      value={data.size}
                                      onChange={(e) =>
                                          setData('size', e.target.value)
                                      }
                                      placeholder="e.g. 1200"
                                      style={{ paddingRight: 56 }}
                                  />
                                  <span
                                      style={{
                                          position: 'absolute',
                                          top: '50%',
                                          right: 14,
                                          transform: 'translateY(-50%)',
                                          color: 'var(--muted)',
                                          fontSize: '0.78rem',
                                          pointerEvents: 'none',
                                      }}
                                  >
                                      sq ft
                                  </span>
                              </div>
                              <FieldError message={errors.size} />
                          </div>
                          <div className="form-group">
                              <label>Floors</label>
                              <input
                                  type="text"
                                  value={data.floors}
                                  onChange={(e) =>
                                      setData('floors', e.target.value)
                                  }
                              />
                          </div>
                          <div className="form-group">
                              <label>Featured</label>
                              <label
                                  className="featured-check"
                                  style={{ marginTop: 10 }}
                              >
                                  <input
                                      type="checkbox"
                                      checked={data.isFeatured}
                                      onChange={(e) =>
                                          setData(
                                              'isFeatured',
                                              e.target.checked,
                                          )
                                      }
                                  />
                                  <span>Mark as Featured</span>
                              </label>
                          </div>
                      </div>

                      <div className="form-row cols-2">
                          <div className="form-group">
                              <label>Construction Start Date</label>
                              <input
                                  type="date"
                                  value={data.construction_start_date}
                                  onChange={(e) =>
                                      setData(
                                          'construction_start_date',
                                          e.target.value,
                                      )
                                  }
                              />
                              <FieldError message={errors.construction_start_date} />
                          </div>
                          <div className="form-group">
                              <label>Handover Date</label>
                              <input
                                  type="date"
                                  value={data.handover_date}
                                  min={nextDay(data.construction_start_date)}
                                  onChange={(e) =>
                                      setData('handover_date', e.target.value)
                                  }
                              />
                              <FieldError message={errors.handover_date} />
                          </div>
                      </div>

                      <div className="form-group">
                          <label>Google Map Embed URL</label>
                          <input
                              type="url"
                              value={data.google_map_url}
                              onChange={(e) =>
                                  setData('google_map_url', e.target.value)
                              }
                          />
                      </div>
                      <div className="form-group">
                          <label>Description</label>
                          <textarea
                              value={data.description}
                              maxLength={DESCRIPTION_MAX}
                              onChange={(e) =>
                                  setData('description', e.target.value)
                              }
                          />
                          <p style={{ color: 'var(--muted)', fontSize: '0.72rem', marginTop: 5, textAlign: 'right' }}>
                              {data.description.length}/{DESCRIPTION_MAX}
                          </p>
                          <FieldError message={errors.description} />
                      </div>
                      <div className="form-group">
                          <label>Surroundings</label>
                          <textarea
                              value={data.surroundings}
                              maxLength={SURROUNDINGS_MAX}
                              onChange={(e) =>
                                  setData('surroundings', e.target.value)
                              }
                          />
                          <p style={{ color: 'var(--muted)', fontSize: '0.72rem', marginTop: 5, textAlign: 'right' }}>
                              {data.surroundings.length}/{SURROUNDINGS_MAX}
                          </p>
                          <FieldError message={errors.surroundings} />
                      </div>
                  </div>

                  {/* Apartment Details */}
                  <div className="section-card">
                      <div className="section-title">
                          <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                          >
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <path d="M9 9h6M9 12h6M9 15h4" />
                          </svg>
                          Apartment Details
                      </div>
                      <div className="form-row cols-3">
                          <div className="form-group">
                              <label>Apartment Size</label>
                              <div style={{ position: 'relative' }}>
                                  <input
                                      type="number"
                                      min={SQFT_MIN}
                                      max={SQFT_MAX}
                                      step="1"
                                      inputMode="numeric"
                                      value={(data as any).apartment_size}
                                      onChange={(e) =>
                                          setData('apartment_size' as any, e.target.value)
                                      }
                                      placeholder="e.g. 1200"
                                      style={{ paddingRight: 56 }}
                                  />
                                  <span
                                      style={{
                                          position: 'absolute',
                                          top: '50%',
                                          right: 14,
                                          transform: 'translateY(-50%)',
                                          color: 'var(--muted)',
                                          fontSize: '0.78rem',
                                          pointerEvents: 'none',
                                      }}
                                  >
                                      sq ft
                                  </span>
                              </div>
                              <FieldError message={errors.apartment_size} />
                          </div>
                          <div className="form-group">
                              <label>Bedroom</label>
                              <input
                                  type="number"
                                  min={BEDROOM_MIN}
                                  max={BEDROOM_MAX}
                                  step="1"
                                  inputMode="numeric"
                                  value={data.bedroom}
                                  onChange={(e) =>
                                      setData('bedroom', e.target.value)
                                  }
                                  placeholder="0-10"
                              />
                              <FieldError message={errors.bedroom} />
                          </div>
                          <div className="form-group">
                              <label>Bathroom</label>
                              <input
                                  type="number"
                                  min={BATHROOM_MIN}
                                  max={BATHROOM_MAX}
                                  step="1"
                                  inputMode="numeric"
                                  value={data.bathroom}
                                  onChange={(e) =>
                                      setData('bathroom', e.target.value)
                                  }
                                  placeholder="1-10"
                              />
                              <FieldError message={errors.bathroom} />
                          </div>
                          {[
                              { key: 'balcony', label: 'Balcony' },
                              { key: 'kitchen', label: 'Kitchen' },
                              { key: 'living_dining', label: 'Living/Dining' },
                          ].map(({ key, label }) => (
                              <div className="form-group" key={key}>
                                  <label>{label}</label>
                                  <input
                                      type="text"
                                      value={(data as any)[key]}
                                      onChange={(e) =>
                                          setData(key as any, e.target.value)
                                      }
                                  />
                              </div>
                          ))}
                      </div>
                      <div className="form-row cols-4">
                          {[
                              { key: 'parking', label: 'Parking' },
                              { key: 'garage_no', label: 'Garage No.' },
                              { key: 'garage_size', label: 'Garage Size' },
                          ].map(({ key, label }) => (
                              <div className="form-group" key={key}>
                                  <label>{label}</label>
                                  <input
                                      type="text"
                                      value={(data as any)[key]}
                                      onChange={(e) =>
                                          setData(key as any, e.target.value)
                                      }
                                  />
                              </div>
                          ))}
                          <div className="form-group">
                              <label>Apt Direction</label>
                              <select
                                  value={data.apartment_direction}
                                  onChange={(e) =>
                                      setData('apartment_direction', e.target.value)
                                  }
                                  className="h-10"
                              >
                                  <option value="">Select direction</option>
                                  {APARTMENT_DIRECTIONS.map((dir) => (
                                      <option key={dir} value={dir}>
                                          {dir}
                                      </option>
                                  ))}
                              </select>
                              <FieldError message={errors.apartment_direction} />
                          </div>
                      </div>
                      <div className="form-group">
                          <label>YouTube Video ID</label>
                          <input
                              type="text"
                              value={data.youtube_video_id}
                              onChange={(e) =>
                                  setData('youtube_video_id', e.target.value)
                              }
                          />
                      </div>
                  </div>

                  {/* Facilities */}
                  <div className="section-card">
                      <div className="section-title">
                          <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                          >
                              <path d="M9 11l3 3L22 4" />
                              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                          </svg>
                          Facilities
                      </div>
                      <div className="checkbox-group">
                          {facilities.map((f) => (
                              <div
                                  key={f.id}
                                  className={`checkbox-item ${data.facilities.includes(f.id) ? 'checked' : ''}`}
                                  onClick={() => toggleFacility(f.id)}
                                  style={{ cursor: 'pointer' }}
                              >
                                  <input
                                      type="checkbox"
                                      checked={data.facilities.includes(f.id)}
                                      onChange={() => toggleFacility(f.id)}
                                      onClick={(e) => e.stopPropagation()}
                                  />
                                  {f.name}
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Tags */}
                  <div className="section-card">
                      <div className="section-title">
                          <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                          >
                              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                              <line x1="7" y1="7" x2="7.01" y2="7" />
                          </svg>
                          Tags
                      </div>
                      <div className="checkbox-group">
                          {tags.map((t) => (
                              <div
                                  key={t.id}
                                  className={`checkbox-item ${data.tags.includes(t.id) ? 'checked' : ''}`}
                                  onClick={() => toggleTag(t.id)}
                                  style={{ cursor: 'pointer' }}
                              >
                                  <input
                                      type="checkbox"
                                      checked={data.tags.includes(t.id)}
                                      onChange={() => toggleTag(t.id)}
                                      onClick={(e) => e.stopPropagation()}
                                  />
                                  {t.name}
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Images */}
                  <div className="section-card">
                      <div className="section-title">
                          <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                          >
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="M21 15l-5-5L5 21" />
                          </svg>
                          Images
                      </div>

                      <div
                          className="form-row cols-2"
                          style={{ alignItems: 'start' }}
                      >
                          <div className="form-group">
                              <label>
                                  Thumbnail (leave empty to keep current)
                              </label>
                              <div className="img-uploader">
                                  <input
                                      ref={thumbRef}
                                      type="file"
                                      accept="image/webp"
                                      className="uploader-input"
                                      onChange={handleThumb}
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
                                      WEBP only · Max 300KB (Target under 150KB)
                                  </p>
                              </div>
                              {errors.thumbnail && (
                                  <p
                                      style={{
                                          color: '#FF8080',
                                          fontSize: '0.75rem',
                                          marginTop: 5,
                                      }}
                                  >
                                      {errors.thumbnail}
                                  </p>
                              )}
                          </div>
                          <div className="form-group">
                              <label>Thumbnail Preview</label>
                              <div
                                  className="preview-box"
                                  style={{ height: 185 }}
                              >
                                  {thumbPreview || existingThumb ? (
                                      <img
                                          src={thumbPreview ?? existingThumb!}
                                          style={{
                                              width: '100%',
                                              height: '100%',
                                              objectFit: 'cover',
                                          }}
                                          alt="thumb"
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
                                          No image
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>

                      {existingImages.length > 0 && (
                          <div className="form-group">
                              <label style={{ marginBottom: 12 }}>
                                  Existing Project Images{' '}
                                  <span
                                      className="badge"
                                      style={{ marginLeft: 8 }}
                                  >
                                      {existingImages.length}{' '}
                                      {existingImages.length === 1
                                          ? 'Image'
                                          : 'Images'}
                                  </span>
                              </label>
                              <div className="img-grid">
                                  {existingImages.map((img) => (
                                      <div
                                          key={img.id}
                                          style={{
                                              position: 'relative',
                                              borderRadius: 10,
                                              overflow: 'hidden',
                                              border: '1px solid var(--border)',
                                              background: 'var(--surface)',
                                              opacity: deletingImageIds.has(
                                                  img.id,
                                              )
                                                  ? 0.4
                                                  : 1,
                                              transform: deletingImageIds.has(
                                                  img.id,
                                              )
                                                  ? 'scale(0.95)'
                                                  : 'none',
                                              transition:
                                                  'opacity 0.3s, transform 0.3s',
                                          }}
                                      >
                                          <img
                                              src={img.url}
                                              alt={img.image}
                                              style={{
                                                  width: '100%',
                                                  height: 130,
                                                  objectFit: 'cover',
                                                  display: 'block',
                                              }}
                                          />
                                          <button
                                              type="button"
                                              onClick={() =>
                                                  deleteExistingImage(img.id)
                                              }
                                              disabled={deletingImageIds.has(
                                                  img.id,
                                              )}
                                              style={{
                                                  position: 'absolute',
                                                  top: 6,
                                                  right: 6,
                                                  background:
                                                      'rgba(255,80,80,0.85)',
                                                  border: 'none',
                                                  borderRadius: 6,
                                                  color: '#fff',
                                                  fontSize: '0.72rem',
                                                  fontWeight: 600,
                                                  padding: '4px 8px',
                                                  cursor: 'pointer',
                                              }}
                                          >
                                              {deletingImageIds.has(img.id)
                                                  ? '...'
                                                  : '🗑️ Delete'}
                                          </button>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}

                      <div className="form-group">
                          <label>Add More Project Images</label>
                          <div className="img-uploader">
                              <input
                                  ref={imagesRef}
                                  type="file"
                                  accept="image/webp"
                                  multiple
                                  className="uploader-input"
                                  onChange={handleProjectImages}
                              />
                              <div
                                  style={{
                                      fontSize: '2rem',
                                      marginBottom: 8,
                                      pointerEvents: 'none',
                                  }}
                              >
                                  🗂️
                              </div>
                              <p
                                  style={{
                                      fontSize: '0.8rem',
                                      color: 'var(--muted)',
                                      pointerEvents: 'none',
                                  }}
                              >
                                  Select multiple images ·{' '}
                                  <span style={{ color: 'var(--gold)' }}>
                                      browse
                                  </span>
                              </p>
                          </div>
                          {errors.project_images && (
                              <p
                                  style={{
                                      color: '#FF8080',
                                      fontSize: '0.75rem',
                                      marginTop: 5,
                                  }}
                              >
                                  {errors.project_images}
                              </p>
                          )}
                          {projectImagePreviews.length > 0 && (
                              <div
                                  style={{
                                      display: 'flex',
                                      gap: 10,
                                      flexWrap: 'wrap',
                                      marginTop: 12,
                                  }}
                              >
                                  {projectImagePreviews.map((src, i) => (
                                      <div
                                          key={i}
                                          style={{
                                              width: 90,
                                              height: 70,
                                              borderRadius: 8,
                                              overflow: 'hidden',
                                              border: '1px solid var(--border)',
                                          }}
                                      >
                                          <img
                                              src={src}
                                              style={{
                                                  width: '100%',
                                                  height: '100%',
                                                  objectFit: 'cover',
                                              }}
                                              alt={`img-${i}`}
                                          />
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                      <button
                          type="submit"
                          className="btn-primary"
                          disabled={processing}
                      >
                          {processing ? 'Updating...' : 'Update Project'}
                      </button>
                  </div>
              </form>
          )}
      </CMSLayout>
  );
}
