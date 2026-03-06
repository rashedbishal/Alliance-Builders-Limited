import { router } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';
import type { ProjectType } from '@/cms/types/cms';

interface Props {
  types: ProjectType[];
}

interface ProjectOption {
  id: number;
  name: string;
}

export default function ProjectRemove({ types }: Props) {
  const [selectedType, setSelectedType] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedProjectName, setSelectedProjectName] = useState('');
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const fetchProjects = async (typeId: string) => {
    setSelectedType(typeId);
    setSelectedProjectId('');
    setSelectedProjectName('');
    setShowWarning(false);
    setProjects([]);
    if (!typeId) return;
    setLoading(true);
    try {
      const res = await fetch(`/cms/projects/by-type?type=${typeId}`);
      const data: ProjectOption[] = await res.json();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex]?.text ?? '';
    setSelectedProjectId(id);
    setSelectedProjectName(name);
    setShowWarning(!!id);
  };

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !selectedProjectName) return;
    if (!confirm(`Are you sure you want to permanently delete "${selectedProjectName}"?\n\nThis action cannot be undone.`)) return;
    router.post(route('destroy-project'), { project_db_id: selectedProjectId }, {
      onSuccess: () => {
        setSelectedProjectId('');
        setSelectedProjectName('');
        setShowWarning(false);
        setProjects([]);
        setSelectedType('');
      },
    });
  };

  return (
    <CMSLayout title="Remove Project" breadcrumb="Project Info Management / Remove Project">
      <div className="page-header">
        <h2>Remove Project</h2>
        <p>Select a project to permanently delete it</p>
        <div className="gold-line" />
      </div>

      <div className="section-card">
        <div className="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
          Select Project to Delete
        </div>

        <div className="form-row cols-2" style={{ marginBottom: 24 }}>
          <div className="form-group">
            <label>Project Type <span style={{ color: '#FF8080' }}>*</span></label>
            <select
              value={selectedType}
              onChange={e => fetchProjects(e.target.value)}
              className="h-10"
            >
              <option value="">Select Project Type</option>
              {types.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Project Name <span style={{ color: '#FF8080' }}>*</span></label>
            <select
              value={selectedProjectId}
              onChange={handleProjectSelect}
              disabled={!selectedType || loading || projects.length === 0}
              className="h-10"
            >
              <option value="">Select Project Name</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: -14, marginBottom: 16 }}>
            ⏳ Loading projects...
          </div>
        )}

        {showWarning && (
          <div style={{
            padding: 16, background: 'rgba(255,80,80,0.06)', border: '1px solid rgba(255,80,80,0.2)',
            borderRadius: 10, marginBottom: 20,
          }}>
            <p style={{ fontSize: '0.83rem', color: '#FF8080', marginBottom: 4 }}>
              ⚠️ <strong>Warning:</strong> This action is <strong>irreversible</strong>.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
              All data associated with <strong style={{ color: '#FF8080' }}>{selectedProjectName}</strong>
              {' '}— including images, project details — will be permanently deleted.
            </p>
          </div>
        )}

        <form onSubmit={handleDelete}>
          <button
            type="submit"
            className="btn-danger"
            disabled={!selectedProjectId}
            style={{
              padding: '11px 28px', fontSize: '0.83rem',
              opacity: selectedProjectId ? 1 : 0.4,
              cursor: selectedProjectId ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}
          >
            🗑️ &nbsp;Delete Project
          </button>
        </form>
      </div>
    </CMSLayout>
  );
}
