@extends('layout')

@section('title', 'Remove Project')
@section('breadcrumb', 'Project Info Management / Remove Project')

@section('content')

    <div class="page-header">
        <h2>Remove Project</h2>
        <p>Select a project to permanently delete it</p>
        <div class="gold-line"></div>
    </div>

    <div class="section-card">
        <div class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4h6v2"/>
            </svg>
            Select Project to Delete
        </div>

        <div class="form-row cols-2" style="margin-bottom: 24px;">

            {{-- Project Type --}}
            <div class="form-group">
                <label for="del_project_type">Project Type <span style="color:#FF8080;">*</span></label>
                <select id="del_project_type" onchange="fetchDeleteProjectNames(this.value)">
                    <option value="">Select Project Type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="mixed_use">Mixed Use</option>
                    {{--
                      Dynamic:
                      @foreach($projectTypes as $type)
                        <option value="{{ $type->id }}">{{ $type->name }}</option>
                      @endforeach
                    --}}
                </select>
            </div>

            {{-- Project Name --}}
            <div class="form-group">
                <label for="del_project_name">Project Name <span style="color:#FF8080;">*</span></label>
                <select id="del_project_name" onchange="onProjectSelected(this)" disabled>
                    <option value="">Select Project Name</option>
                </select>
            </div>

        </div>

        <div id="del-loading" style="display:none; font-size:0.8rem; color:var(--muted); margin-top:-14px; margin-bottom:16px;">
            ⏳ Loading projects...
        </div>

        {{-- Warning Panel (hidden until project is selected) --}}
        <div id="delete-warning" style="display:none; padding:16px; background:rgba(255,80,80,0.06); border:1px solid rgba(255,80,80,0.2); border-radius:10px; margin-bottom:20px;">
            <p style="font-size:0.83rem; color:#FF8080; margin-bottom:4px;">
                ⚠️ <strong>Warning:</strong> This action is <strong>irreversible</strong>.
            </p>
            <p style="font-size:0.8rem; color:var(--muted);">
                All data associated with <strong id="selected-project-name" style="color:#FF8080;"></strong>
                — including images, unit details, facilities and tags — will be permanently deleted.
            </p>
        </div>

        {{-- Delete Form --}}
        <form action="#" method="POST" id="delete-project-form" {{-- replace # — JS sets action dynamically --}}
        onsubmit="return confirmProjectDelete(event)">
            @csrf
            @method('DELETE')
            <input type="hidden" name="project_db_id" id="project_db_id" value="">

            <button type="submit"
                    id="delete-btn"
                    class="btn-danger"
                    disabled
                    style="padding:11px 28px; font-size:0.83rem; opacity:0.4; cursor:not-allowed; transition: all 0.2s;">
                🗑️ &nbsp;Delete Project
            </button>
        </form>

    </div>

    {{-- Session Flash Messages --}}
    @if(session('success'))
        <div class="flash-toast flash-success">✅ {{ session('success') }}</div>
    @endif
    @if(session('error'))
        <div class="flash-toast flash-error">❌ {{ session('error') }}</div>
    @endif

@endsection

@push('styles')
    <style>
        .flash-toast {
            position: fixed; bottom: 24px; right: 24px;
            padding: 12px 20px; border-radius: 10px;
            font-size: 0.82rem; z-index: 999;
            animation: slideUp 0.3s ease;
        }
        .flash-success { background: rgba(50,180,100,0.15); border: 1px solid rgba(50,180,100,0.4); color: #80FFB0; }
        .flash-error   { background: rgba(255,80,80,0.1);  border: 1px solid rgba(255,80,80,0.3);  color: #FF8080; }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
        }
    </style>
@endpush

@push('scripts')
    <script>
        // -------------------------------------------------------
        // AJAX: fetch project names by type for delete page
        // Replace URL with your actual route:
        // `/cms/projects/by-type?type=${type}`
        // Expected JSON: [{ id: 1, name: "Project A" }, ...]
        // -------------------------------------------------------
        function fetchDeleteProjectNames(type) {
            const nameSelect = document.getElementById('del_project_name');
            const loader     = document.getElementById('del-loading');
            const warning    = document.getElementById('delete-warning');
            const btn        = document.getElementById('delete-btn');

            nameSelect.innerHTML = '<option value="">Select Project Name</option>';
            nameSelect.disabled  = true;
            warning.style.display = 'none';
            btn.disabled          = true;
            btn.style.opacity     = '0.4';
            btn.style.cursor      = 'not-allowed';
            document.getElementById('project_db_id').value = '';

            if (!type) return;

            loader.style.display = 'block';

            fetch(`/cms/projects/by-type?type=${type}`) {{-- replace with actual route --}}
                .then(res => res.json())
                .then(projects => {
                    loader.style.display = 'none';
                    projects.forEach(p => {
                        const opt = document.createElement('option');
                        opt.value        = p.id;
                        opt.textContent  = p.name;
                        opt.dataset.name = p.name;
                        nameSelect.appendChild(opt);
                    });
                    nameSelect.disabled = false;
                })
                .catch(() => {
                    loader.style.display = 'none';
                    nameSelect.disabled  = false;
                });
        }

        function onProjectSelected(select) {
            const warning = document.getElementById('delete-warning');
            const btn     = document.getElementById('delete-btn');
            const nameEl  = document.getElementById('selected-project-name');
            const hiddenId = document.getElementById('project_db_id');
            const form     = document.getElementById('delete-project-form');

            if (!select.value) {
                warning.style.display = 'none';
                btn.disabled          = true;
                btn.style.opacity     = '0.4';
                btn.style.cursor      = 'not-allowed';
                hiddenId.value        = '';
                return;
            }

            const selectedOption = select.options[select.selectedIndex];
            const projectName    = selectedOption.dataset.name || selectedOption.textContent;
            const projectId      = select.value;

            nameEl.textContent    = projectName;
            hiddenId.value        = projectId;
            form.action           = `/cms/projects/${projectId}`; {{-- replace with actual route --}}
                warning.style.display = 'block';
            btn.disabled          = false;
            btn.style.opacity     = '1';
            btn.style.cursor      = 'pointer';
        }

        function confirmProjectDelete(e) {
            const projectName = document.getElementById('selected-project-name').textContent;
            if (!confirm(`Are you sure you want to permanently delete "${projectName}"?\n\nThis action cannot be undone.`)) {
                e.preventDefault();
                return false;
            }
            return true;
        }

        setTimeout(() => {
            document.querySelectorAll('.flash-toast').forEach(el => {
                el.style.transition = 'opacity 0.5s';
                el.style.opacity    = '0';
                setTimeout(() => el.remove(), 500);
            });
        }, 3000);
    </script>
@endpush