@extends('layout')

@section('title', 'Add Project')
@section('breadcrumb', 'Project Info Management / Add Project')

@section('content')

    <div class="page-header">
        <h2>Add New Project</h2>
        <p>Fill in all project details to add a new listing</p>
        <div class="gold-line"></div>
    </div>

    <form action="{{route('save-project')}}" method="POST" enctype="multipart/form-data"> {{-- replace # with route('project.store') --}}
        @csrf

        {{-- ==================== SECTION 1: Project Info ==================== --}}
        <div class="section-card">
            <div class="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M3 21h18M9 21V9l3-6 3 6v12M5 21V12l-2-2M19 21V12l2-2"/>
                    <path d="M9 12h6"/>
                </svg>
                Project Info
            </div>

            <div class="form-row cols-2">

                {{-- Project Type --}}
                <div class="form-group">
                    <label for="project_type_id">Project Type <span style="color:#FF8080;">*</span></label>
                    <select name="project_type_id" id="project_type_id" class="h-10">
                        <option value="" disabled selected>Select Project Type</option>
                      @foreach($types as $type)
                        <option value="{{ $type->id }}" >{{ $type->name }}</option>
                      @endforeach
                    </select>
                    @error('project_type_id')
                        <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p>
                    @enderror
                </div>

                {{-- Project Location --}}
                <div class="form-group">
                    <label for="location_id">Project Location <span style="color:#FF8080;">*</span></label>
                    <select name="location_id" id="location_id" class="h-10">
                        <option value="" disabled selected>Select Location</option>
                          @foreach($locations as $location)
                            <option value="{{ $location->id }}">{{ $location->name }}</option>
                          @endforeach
                    </select>
                    @error('location_id')
                    <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p>
                    @enderror
                </div>

            </div>

            <div class="form-row cols-3">
                <div class="form-group">
                    <label for="project_id">Project ID <span style="color:#FF8080;">*</span></label>
                    <input type="text" name="project_id" id="project_id" placeholder="e.g. ABL-2024-001">
                    @error('project_id') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="name">Project Name <span style="color:#FF8080;">*</span></label>
                    <input type="text" name="name" id="name" placeholder="Enter project name...">
                    @error('name') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="address">Full Address <span style="color:#FF8080;">*</span></label>
                    <input type="text" name="address" id="address" placeholder="Full address...">
                    @error('address') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="form-row cols-2">
                <div class="form-group">
                    <label for="google_map_url">Google Map URL</label>
                    <input type="url" name="google_map_url" id="google_map_url" placeholder="https://maps.google.com/...">
                    @error('google_map_url') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="youtube_video_id">YouTube Video ID</label>
                    <input type="text" name="youtube_video_id" id="youtube_video_id" placeholder="e.g. dQw4w9WgXcQ">
                    @error('youtube_video_id') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="form-row cols-3">
                <div class="form-group">
                    <label for="price">Price (BDT)</label>
                    <input type="text" name="price" id="price" placeholder="e.g. 1,20,00,000">
                    @error('price') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="size">Size (sqft)</label>
                    <input type="text" name="size" id="size" placeholder="e.g. 1450">
                    @error('size') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="floors">Number of Floors</label>
                    <input type="number" name="floors" id="floors" placeholder="e.g. 12">
                    @error('floors') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="form-row cols-2">
                <div class="form-group">
                    <label for="construction_start_date">Construction Start Date</label>
                    <input type="date" name="construction_start_date" id="construction_start_date">
                    @error('construction_start_date') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="handover_date">Handover Date</label>
                    <input type="date" name="handover_date" id="handover_date">
                    @error('handover_date') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="form-group">
                <label class="featured-check">
                    <input type="checkbox" name="isFeatured" value="1">
                    <span>Mark as Feature Project</span>
                </label>
            </div>

            <div class="form-row cols-2">
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea name="description" id="description" placeholder="Enter project description..."></textarea>
                    @error('description') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="surroundings">Surroundings</label>
                    <textarea name="surroundings" id="surroundings" placeholder="Describe surroundings and nearby amenities..."></textarea>
                    @error('surroundings') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
            </div>
        </div>

        {{-- ==================== SECTION 2: Apartment/Unit Details ==================== --}}
        <div class="section-card">
            <div class="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Apartment / Unit Details
            </div>

            <div class="form-row cols-4">
                <div class="form-group">
                    <label for="apartment_size">Apartment Size (sqft)</label>
                    <input type="text" name="apartment_size" id="apartment_size" placeholder="e.g. 1250">
                    @error('apartment_size') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="bedroom">Bedroom</label>
                    <input type="number" name="bedroom" id="bedroom" placeholder="e.g. 3">
                    @error('bedroom') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="bathroom">Bathroom</label>
                    <input type="number" name="bathroom" id="bathroom" placeholder="e.g. 2">
                    @error('bathroom') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="balcony">Balcony</label>
                    <input type="number" name="balcony" id="balcony" placeholder="e.g. 1">
                    @error('balcony') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="form-row cols-4">
                <div class="form-group">
                    <label for="kitchen">Kitchen</label>
                    <input type="number" name="kitchen" id="kitchen" placeholder="e.g. 1">
                    @error('kitchen') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="living_dining">Living / Dining</label>
                    <input type="text" name="living_dining" id="living_dining" placeholder="e.g. Combined">
                    @error('living_dining') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="parking">Parking</label>
                    <input type="number" name="parking" id="parking" placeholder="e.g. 1">
                    @error('parking') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="garage_no">Garage No.</label>
                    <input type="text" name="garage_no" id="garage_no" placeholder="e.g. G-12">
                    @error('garage_no') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="form-row cols-2">
                <div class="form-group">
                    <label for="garage_size">Garage Size (sqft)</label>
                    <input type="text" name="garage_size" id="garage_size" placeholder="e.g. 200">
                    @error('garage_size') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="apartment_direction">Apartment Direction</label>
                    <input type="text" name="apartment_direction" id="apartment_direction" placeholder="e.g. South-East facing">
                    @error('apartment_direction') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
            </div>
        </div>

        {{-- ==================== SECTION 3: Project Facilities ==================== --}}
        <div class="section-card">
            <div class="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                Project Facilities
            </div>

            <div class="checkbox-group">
              @foreach($facilities as $facility)
                <label class="checkbox-item">
                  <input type="checkbox" name="facilities[]" value="{{ $facility->id }}">
                  {{ $facility->name }}
                </label>
              @endforeach
            </div>
            @error('facilities')
            <p style="color:#FF8080; font-size:0.75rem; margin-top:10px;">{{ $message }}</p>
            @enderror
        </div>

        {{-- ==================== SECTION 4: Project Tags ==================== --}}
        <div class="section-card">
            <div class="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                    <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
                Project Tags
            </div>

            <div class="checkbox-group">
              @foreach($tags as $tag)
                <label class="checkbox-item">
                  <input type="checkbox" name="tags[]" value="{{ $tag->id }}">
                  {{ $tag->name }}
                </label>
              @endforeach
            </div>
            @error('tags')
            <p style="color:#FF8080; font-size:0.75rem; margin-top:10px;">{{ $message }}</p>
            @enderror
        </div>

        {{-- ==================== SECTION 5: Project Images ==================== --}}
        <div class="section-card">
            <div class="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                </svg>
                Project Images
            </div>

            {{-- Thumbnail --}}
            <p style="font-size:0.85rem; font-weight:600; color:var(--text); margin-bottom:14px;">
                Thumbnail Image <span class="badge">Single</span>
            </p>
            <div class="form-row cols-2" style="align-items:start; margin-bottom:24px;">
                <div class="form-group">
                    <label>Upload Here</label>
                    <div class="img-uploader">
                        <input type="file" name="thumbnail" accept="image/*"
                               onchange="previewImage(this, 'proj-thumb-preview')">
                        <div class="icon">🏗️</div>
                        <p>Upload thumbnail or <span>browse</span></p>
                        <p style="margin-top:4px; font-size:0.72rem;">Recommended: 800×600px</p>
                    </div>
                    @error('thumbnail') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div>
                    <label>Preview</label>
                    <div class="preview-box" style="height:155px;" id="proj-thumb-preview">
                        <div class="placeholder">📷<br>No thumbnail selected</div>
                    </div>
                </div>
            </div>

            <hr class="divider">

            {{-- Multiple Images --}}
            <p style="font-size:0.85rem; font-weight:600; color:var(--text); margin-bottom:14px;">
                Project Gallery Images <span class="badge">Multiple</span>
            </p>
            <div class="img-uploader" style="padding:40px;">
                <input type="file" name="project_images[]" accept="image/*" multiple
                       onchange="previewMultiple(this, 'multi-img-preview')">
                <div class="icon">🗂️</div>
                <p>Drag & drop or <span>browse multiple images</span></p>
                <p style="margin-top:4px; font-size:0.72rem;">JPG, PNG, WEBP — select multiple files</p>
            </div>
            @error('project_images') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
            @error('project_images.*') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
            <div id="multi-img-preview" style="display:flex; flex-wrap:wrap; gap:10px; margin-top:16px;"></div>

        </div>

        {{-- Form Actions --}}
        <div style="display:flex; gap:12px; padding-bottom:24px;">
            <button type="submit" class="btn-primary">Save Project</button>
            <button type="reset" class="btn-secondary" onclick="resetAllPreviews()">Reset All</button>
        </div>

    </form>

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
        function resetAllPreviews() {
            document.getElementById('proj-thumb-preview').innerHTML =
                '<div class="placeholder">📷<br>No thumbnail selected</div>';
            document.getElementById('multi-img-preview').innerHTML = '';
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