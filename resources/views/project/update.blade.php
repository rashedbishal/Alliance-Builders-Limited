@extends('layout')

@section('title', 'Update Project')
@section('breadcrumb', 'Project Info Management / Update Project')

@section('content')

    <div class="page-header">
        <h2>Update Project</h2>
        <p>Select a project to update its information</p>
        <div class="gold-line"></div>
    </div>

    {{-- ==================== Step 1: Select Project ==================== --}}
    <div class="section-card">
        <div class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Select Project to Update
        </div>

        <div class="form-row cols-2">
            <div class="form-group">
                <label for="filter_project_type">Project Type <span style="color:#FF8080;">*</span></label>
                <select id="filter_project_type" onchange="fetchProjectNames(this.value)" class="h-10">
                    <option value="" selected >Select Project Name</option>
                  @foreach($types as $type)
                    <option value="{{ $type->id }}" {{ request('project_type_id') == $type->id ? 'selected' : '' }}>{{ $type->name }}</option>
                  @endforeach
                </select>
            </div>

            <div class="form-group">
                <label for="filter_project_name">Project Name <span style="color:#FF8080;">*</span></label>
                <select id="filter_project_name" onchange="loadProjectData(this.value)" class="h-10" disabled>
                    <option value="">Select Project Name</option>
                </select>
            </div>
        </div>

        <div id="loading-indicator" style="display:none; font-size:0.8rem; color:var(--muted); margin-top:-8px; margin-bottom:8px;">
            ⏳ Loading projects...
        </div>
    </div>

    {{-- ==================== Step 2: Update Form (hidden until project selected) ==================== --}}
    <div id="update-form-wrapper" style="display:none;">

        <form action="{{route('update-project')}}" method="POST" enctype="multipart/form-data" id="update-form"> {{-- replace # with route('project.update', ':id') — JS fills :id --}}
            @csrf
            <input type="hidden" name="project_id_db" id="project_id_db" value="">{{-- DB primary key --}}

            <div style="padding:10px 16px; background:rgba(201,168,76,0.05); border-left:3px solid var(--gold); border-radius:4px; margin-bottom:20px; font-size:0.82rem; color:var(--muted);">
                ✏️ Update the fields below and click <strong style="color:var(--gold);">Save Changes</strong>.
            </div>

            {{-- ===== Project Info ===== --}}
            <div class="section-card">
                <div class="section-title" style="font-size:0.95rem;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M3 21h18M9 21V9l3-6 3 6v12"/>
                    </svg>
                    Project Info
                </div>

                <div class="form-row cols-2">
                    <div class="form-group">
                        <label>Project Type</label>
                        <select name="project_type_id" id="upd_project_type_id" class="h-10">
                            <option value="">Select Project Type</option>
                            @foreach($types as $type)
                                <option value="{{ $type->id }}" >{{ $type->name }}</option>
                            @endforeach
                        </select>
                        @error('project_type_id') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                    </div>
                    <div class="form-group">
                        <label>Project Location</label>
                        <select name="location_id" id="upd_location_id" class="h-10">
                            <option value="" disabled>Select Location</option>
                            @foreach($locations as $location)
                                <option value="{{ $location->id }}">{{ $location->name }}</option>
                            @endforeach
                        </select>
                        @error('location_id') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                    </div>
                </div>

                <div class="form-row cols-3">
                    <div class="form-group">
                        <label>Project ID</label>
                        <input type="text" name="project_id" id="upd_project_id" placeholder="ABL-...">
                        @error('project_id') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                    </div>
                    <div class="form-group">
                        <label>Project Name</label>
                        <input type="text" name="name" id="upd_name" placeholder="Project name">
                        @error('name') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                    </div>
                    <div class="form-group">
                        <label>Full Address</label>
                        <input type="text" name="address" id="upd_address" placeholder="Address...">
                        @error('address') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                    </div>
                </div>

                <div class="form-row cols-2">
                    <div class="form-group">
                        <label>Google Map URL</label>
                        <input type="url" name="google_map_url" id="upd_google_map_url" placeholder="Map URL...">
                    </div>
                    <div class="form-group">
                        <label>YouTube Video ID</label>
                        <input type="text" name="youtube_video_id" id="upd_youtube_video_id" placeholder="Video ID...">
                    </div>
                </div>

                <div class="form-row cols-3">
                    <div class="form-group">
                        <label>Price (BDT)</label>
                        <input type="text" name="price" id="upd_price" placeholder="Price...">
                    </div>
                    <div class="form-group">
                        <label>Size (sqft)</label>
                        <input type="text" name="size" id="upd_size" placeholder="Size...">
                    </div>
                    <div class="form-group">
                        <label>Number of Floors</label>
                        <input type="number" name="floors" id="upd_floors" placeholder="Floors">
                    </div>
                </div>

                <div class="form-row cols-2">
                    <div class="form-group">
                        <label>Construction Start Date</label>
                        <input type="date" name="construction_start_date" id="upd_construction_start_date">
                    </div>
                    <div class="form-group">
                        <label>Handover Date</label>
                        <input type="date" name="handover_date" id="upd_handover_date">
                    </div>
                </div>

                <div class="form-group">
                    <label class="featured-check">
                        <input type="checkbox" name="isFeatured" id="upd_is_featured" value="1">
                        <span>Mark as Feature Project</span>
                    </label>
                </div>

                <div class="form-row cols-2">
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="description" id="upd_description" style="min-height:110px;" placeholder="Description..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>Surroundings</label>
                        <textarea name="surroundings" id="upd_surroundings" style="min-height:110px;" placeholder="Surroundings..."></textarea>
                    </div>
                </div>
            </div>

            {{-- ===== Apartment/Unit Details ===== --}}
            <div class="section-card">
                <div class="section-title" style="font-size:0.95rem;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    Apartment / Unit Details
                </div>

                <div class="form-row cols-4">
                    <div class="form-group"><label>Apartment Size (sqft)</label><input type="text" name="apartment_size" id="upd_apartment_size" placeholder="sqft"></div>
                    <div class="form-group"><label>Bedroom</label><input type="number" name="bedroom" id="upd_bedroom" placeholder="0"></div>
                    <div class="form-group"><label>Bathroom</label><input type="number" name="bathroom" id="upd_bathroom" placeholder="0"></div>
                    <div class="form-group"><label>Balcony</label><input type="number" name="balcony" id="upd_balcony" placeholder="0"></div>
                </div>
                <div class="form-row cols-4">
                    <div class="form-group"><label>Kitchen</label><input type="number" name="kitchen" id="upd_kitchen" placeholder="0"></div>
                    <div class="form-group"><label>Living / Dining</label><input type="text" name="living_dining" id="upd_living_dining" placeholder="..."></div>
                    <div class="form-group"><label>Parking</label><input type="number" name="parking" id="upd_parking" placeholder="0"></div>
                    <div class="form-group"><label>Garage No.</label><input type="text" name="garage_no" id="upd_garage_no" placeholder="G-..."></div>
                </div>
                <div class="form-row cols-2">
                    <div class="form-group"><label>Garage Size (sqft)</label><input type="text" name="garage_size" id="upd_garage_size" placeholder="sqft"></div>
                    <div class="form-group"><label>Apartment Direction</label><input type="text" name="apartment_direction" id="upd_apartment_direction" placeholder="e.g. South-East"></div>
                </div>
            </div>

            {{-- ===== Project Facilities ===== --}}
            <div class="section-card">
                <div class="section-title" style="font-size:0.95rem;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    Project Facilities
                </div>
                <div class="checkbox-group" id="upd-facilities-group">
                    @foreach($facilities as $facility)
                        <label class="checkbox-item" data-facility="{{ $facility->id }}">
                            <input type="checkbox" name="facilities[]" value="{{ $facility->id }}" onchange="toggleChecked(this)">
                            {{ $facility->name }}
                        </label>
                    @endforeach
                </div>
            </div>

            {{-- ===== Project Tags ===== --}}
            <div class="section-card">
                <div class="section-title" style="font-size:0.95rem;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                        <line x1="7" y1="7" x2="7.01" y2="7"/>
                    </svg>
                    Project Tags
                </div>
                <div class="checkbox-group" id="upd-tags-group">
                    @foreach($tags as $tag)
                        <label class="checkbox-item" data-tag="{{ $tag->id }}">
                            <input type="checkbox" name="tags[]" value="{{ $tag->id }}" onchange="toggleChecked(this)">
                            {{ $tag->name }}
                        </label>
                    @endforeach
                </div>
            </div>

            {{-- ===== Project Images ===== --}}
            <div class="section-card">
                <div class="section-title" style="font-size:0.95rem;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                    </svg>
                    Project Images
                </div>

                <p style="font-size:0.85rem; font-weight:600; color:var(--text); margin-bottom:14px;">
                    Update Thumbnail <span class="badge">Single</span>
                </p>
                <div class="form-row cols-2" style="align-items:start; margin-bottom:24px;">
                    <div class="form-group">
                        <label>Upload here</label>
                        <div class="img-uploader">
                            <input type="file" name="thumbnail" accept="image/*" onchange="previewImage(this, 'upd-thumb-preview')">
                            <div class="icon">🏗️</div>
                            <p>Replace thumbnail or <span>browse</span></p>
                            <p style="margin-top:4px; font-size:0.72rem;">Leave empty to keep current thumbnail</p>
                        </div>
                    </div>
                    <div>
                        <label>Current / New Thumbnail</label>
                        <div class="preview-box" style="height:155px;" id="upd-thumb-preview">
                            <div class="placeholder">📷<br>Current thumbnail will appear here</div>
                        </div>
                    </div>
                </div>

                <hr class="divider">

                <p style="font-size:0.85rem; font-weight:600; color:var(--text); margin-bottom:14px;">
                    Add More Gallery Images <span class="badge">Multiple</span>
                </p>
                <div class="img-uploader" style="padding:40px;">
                    <input type="file" name="project_images[]" accept="image/*" multiple
                           onchange="previewMultiple(this, 'upd-multi-preview')">
                    <div class="icon">🗂️</div>
                    <p>Add more images or <span>browse</span></p>
                    <p style="margin-top:4px; font-size:0.72rem;">Leave empty to keep existing gallery images</p>
                </div>
                <div id="upd-multi-preview" style="display:flex; flex-wrap:wrap; gap:10px; margin-top:16px;"></div>
            </div>

            {{-- Form Actions --}}
            <div style="display:flex; gap:12px; padding-bottom:24px;">
                <button type="submit" class="btn-primary">Save Changes</button>
                <button type="button" class="btn-secondary" onclick="cancelUpdate()">Cancel</button>
            </div>

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
        // AJAX: fetch project names by type
        // Replace the fetch URL with your actual route, e.g.:
        // `/cms/projects/by-type?type=${type}`
        // Expected JSON response: [{ id: 1, name: "Project A" }, ...]
        // -------------------------------------------------------
        function fetchProjectNames(type) {
            const nameSelect = document.getElementById('filter_project_name');
            const loader     = document.getElementById('loading-indicator');
            const wrapper    = document.getElementById('update-form-wrapper');

            nameSelect.innerHTML = '<option value="">Select Project Name</option>';
            nameSelect.disabled = true;
            wrapper.style.display = 'none';

            if (!type) return;

            loader.style.display = 'block';

            // replace with actual route
            fetch(`/cms/projects/by-type?type=${type}`)
                .then(res => res.json())
                .then(projects => {
                    loader.style.display = 'none';

                    projects.forEach(p => {
                        const opt = document.createElement('option');
                        opt.value = p.id;
                        opt.textContent = p.name;
                        nameSelect.appendChild(opt);
                    });

                    nameSelect.disabled = false;
                })
                .catch(err => {
                    console.error(err);
                    loader.style.display = 'none';
                    nameSelect.disabled = false;
                });
        }

        // -------------------------------------------------------
        // AJAX: load project data into form fields
        // Replace the fetch URL with your actual route, e.g.:
        // `/cms/projects/${id}/data`
        // Expected JSON: full project object matching field names
        // -------------------------------------------------------
        function loadProjectData(id) {
            const wrapper = document.getElementById('update-form-wrapper');
            if (!id) { wrapper.style.display = 'none'; return; }

            fetch(`/cms/projects/${id}/data`)
                .then(res => res.json())
                .then(p => {
                    console.log(p);
                    // Update form action with correct project ID
                    // document.getElementById('update-form').action = `/cms/projects/${id}`;
                    document.getElementById('project_id_db').value = id;
                    const details = p.details ?? {};

                    // Fill text/number/date/url fields
                    const projectFields = [
                        'project_type_id','location_id','project_id','name','address','isFeatured',
                        'google_map_url','price','size','floors',
                        'construction_start_date','handover_date','description','surroundings',
                    ];

                    const detailsFields = [
                        'apartment_size','bedroom','bathroom','balcony','kitchen','living_dining',
                        'parking','garage_no','garage_size','apartment_direction','youtube_video_id'
                    ];


                    projectFields.forEach(field => {
                        const el = document.getElementById('upd_' + field);
                        if (!el) return;
                        if (el.tagName === 'SELECT') {
                            el.value = p[field] ?? '';
                        } else {
                            if (field === 'construction_start_date' || field === 'handover_date') {
                                el.value = p[field] ? p[field].split('T')[0] : '';
                            } else {
                                el.value = p[field] ?? '';
                            }
                        }
                    });

                    detailsFields.forEach(field => {
                        const el = document.getElementById('upd_' + field);
                        if (!el) return;
                        if (el.tagName === 'SELECT') {
                            el.value = details[field] ?? '';
                        } else {
                            el.value = details[field] ?? '';
                        }
                    });


                    // Featured checkbox
                    const featuredCb = document.getElementById('upd_is_featured');
                    featuredCb.checked = !!p.isFeatured;

                    // Facilities checkboxes
                    const selectedFacilities = (p.facilities ?? []).map(f => f.id); // extract IDs
                    document.querySelectorAll('#upd-facilities-group .checkbox-item input[type=checkbox]')
                        .forEach(cb => {
                            cb.checked = selectedFacilities.includes(Number(cb.value)); // compare as numbers
                            cb.parentElement.classList.toggle('checked', cb.checked);
                        });

                    // Tags checkboxes
                    const selectedTags = (p.tags ?? []).map(t => t.id); // extract IDs
                    document.querySelectorAll('#upd-tags-group .checkbox-item input[type=checkbox]')
                        .forEach(cb => {
                            cb.checked = selectedTags.includes(Number(cb.value));
                            cb.parentElement.classList.toggle('checked', cb.checked);
                        });

                    // Show existing thumbnail
                    if (p.image && p.image.path) {
                        document.getElementById('upd-thumb-preview').innerHTML =
                            `<img src="/${p.image.path}" style="width:100%;height:100%;object-fit:cover;display:block;">`;
                    } else {
                        document.getElementById('upd-thumb-preview').innerHTML =
                            '<div class="placeholder">📷<br>No thumbnail</div>';
                    }

                    // Clear multi preview
                    document.getElementById('upd-multi-preview').innerHTML = '';

                    // Reveal form
                    wrapper.style.display = 'block';
                    wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                })
                .catch(err => {
                    console.error('Failed to load project data:', err);
                    alert('Could not load project data. Please try again.');
                });
        }

        function cancelUpdate() {
            document.getElementById('update-form-wrapper').style.display = 'none';
            document.getElementById('filter_project_name').value = '';
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
