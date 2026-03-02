@extends('layout')

@section('title', 'Add Project')
@section('breadcrumb', 'Project Info Management / Add Project')

@section('content')

    <div class="page-header">
        <h2>Add New Project</h2>
        <p>Fill in all project details to add a new listing</p>
        <div class="gold-line"></div>
    </div>

    <form action="#" method="POST" enctype="multipart/form-data"> {{-- replace # with route('project.store') --}}
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
                    <label for="project_type">Project Type <span style="color:#FF8080;">*</span></label>
                    <select name="project_type" id="project_type">
                        <option value="" disabled {{ old('project_type') ? '' : 'selected' }}>Select Project Type</option>
                        <option value="residential" {{ old('project_type') == 'residential' ? 'selected' : '' }}>Residential</option>
                        <option value="commercial"  {{ old('project_type') == 'commercial'  ? 'selected' : '' }}>Commercial</option>
                        <option value="mixed_use"   {{ old('project_type') == 'mixed_use'   ? 'selected' : '' }}>Mixed Use</option>
                        {{--
                          Dynamic:
                          @foreach($projectTypes as $type)
                            <option value="{{ $type->id }}" {{ old('project_type') == $type->id ? 'selected' : '' }}>{{ $type->name }}</option>
                          @endforeach
                        --}}
                    </select>
                    @error('project_type')
                    <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p>
                    @enderror
                </div>

                {{-- Project Location --}}
                <div class="form-group">
                    <label for="project_location">Project Location <span style="color:#FF8080;">*</span></label>
                    <select name="project_location" id="project_location">
                        <option value="" disabled {{ old('project_location') ? '' : 'selected' }}>Select Location</option>
                        <option value="gulshan"      {{ old('project_location') == 'gulshan'      ? 'selected' : '' }}>Gulshan</option>
                        <option value="banani"       {{ old('project_location') == 'banani'       ? 'selected' : '' }}>Banani</option>
                        <option value="bashundhara"  {{ old('project_location') == 'bashundhara'  ? 'selected' : '' }}>Bashundhara</option>
                        <option value="dhanmondi"    {{ old('project_location') == 'dhanmondi'    ? 'selected' : '' }}>Dhanmondi</option>
                        <option value="uttara"       {{ old('project_location') == 'uttara'       ? 'selected' : '' }}>Uttara</option>
                        <option value="mirpur"       {{ old('project_location') == 'mirpur'       ? 'selected' : '' }}>Mirpur</option>
                        <option value="mohakhali"    {{ old('project_location') == 'mohakhali'    ? 'selected' : '' }}>Mohakhali</option>
                        {{--
                          Dynamic:
                          @foreach($locations as $location)
                            <option value="{{ $location->id }}" {{ old('project_location') == $location->id ? 'selected' : '' }}>{{ $location->name }}</option>
                          @endforeach
                        --}}
                    </select>
                    @error('project_location')
                    <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p>
                    @enderror
                </div>

            </div>

            <div class="form-row cols-3">
                <div class="form-group">
                    <label for="project_id">Project ID <span style="color:#FF8080;">*</span></label>
                    <input type="text" name="project_id" id="project_id" value="{{ old('project_id') }}" placeholder="e.g. ABL-2024-001">
                    @error('project_id') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="project_name">Project Name <span style="color:#FF8080;">*</span></label>
                    <input type="text" name="project_name" id="project_name" value="{{ old('project_name') }}" placeholder="Enter project name...">
                    @error('project_name') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="full_address">Full Address <span style="color:#FF8080;">*</span></label>
                    <input type="text" name="full_address" id="full_address" value="{{ old('full_address') }}" placeholder="Full address...">
                    @error('full_address') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="form-row cols-2">
                <div class="form-group">
                    <label for="google_map_url">Google Map URL</label>
                    <input type="url" name="google_map_url" id="google_map_url" value="{{ old('google_map_url') }}" placeholder="https://maps.google.com/...">
                    @error('google_map_url') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="youtube_video_id">YouTube Video ID</label>
                    <input type="text" name="youtube_video_id" id="youtube_video_id" value="{{ old('youtube_video_id') }}" placeholder="e.g. dQw4w9WgXcQ">
                    @error('youtube_video_id') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="form-row cols-3">
                <div class="form-group">
                    <label for="price">Price (BDT)</label>
                    <input type="text" name="price" id="price" value="{{ old('price') }}" placeholder="e.g. 1,20,00,000">
                    @error('price') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="size">Size (sqft)</label>
                    <input type="text" name="size" id="size" value="{{ old('size') }}" placeholder="e.g. 1450">
                    @error('size') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="floors">Number of Floors</label>
                    <input type="number" name="floors" id="floors" value="{{ old('floors') }}" placeholder="e.g. 12">
                    @error('floors') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="form-row cols-2">
                <div class="form-group">
                    <label for="construction_start_date">Construction Start Date</label>
                    <input type="date" name="construction_start_date" id="construction_start_date" value="{{ old('construction_start_date') }}">
                    @error('construction_start_date') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="handover_date">Handover Date</label>
                    <input type="date" name="handover_date" id="handover_date" value="{{ old('handover_date') }}">
                    @error('handover_date') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="form-group">
                <label class="featured-check">
                    <input type="checkbox" name="is_featured" value="1" {{ old('is_featured') ? 'checked' : '' }}>
                    <span>Mark as Feature Project</span>
                </label>
            </div>

            <div class="form-row cols-2">
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea name="description" id="description" placeholder="Enter project description..." style="min-height:110px;">{{ old('description') }}</textarea>
                    @error('description') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="surroundings">Surroundings</label>
                    <textarea name="surroundings" id="surroundings" placeholder="Describe surroundings and nearby amenities..." style="min-height:110px;">{{ old('surroundings') }}</textarea>
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
                    <input type="text" name="apartment_size" id="apartment_size" value="{{ old('apartment_size') }}" placeholder="e.g. 1250">
                    @error('apartment_size') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="bedroom">Bedroom</label>
                    <input type="number" name="bedroom" id="bedroom" value="{{ old('bedroom') }}" placeholder="e.g. 3">
                    @error('bedroom') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="bathroom">Bathroom</label>
                    <input type="number" name="bathroom" id="bathroom" value="{{ old('bathroom') }}" placeholder="e.g. 2">
                    @error('bathroom') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="balcony">Balcony</label>
                    <input type="number" name="balcony" id="balcony" value="{{ old('balcony') }}" placeholder="e.g. 1">
                    @error('balcony') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="form-row cols-4">
                <div class="form-group">
                    <label for="kitchen">Kitchen</label>
                    <input type="number" name="kitchen" id="kitchen" value="{{ old('kitchen') }}" placeholder="e.g. 1">
                    @error('kitchen') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="living_dining">Living / Dining</label>
                    <input type="text" name="living_dining" id="living_dining" value="{{ old('living_dining') }}" placeholder="e.g. Combined">
                    @error('living_dining') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="parking">Parking</label>
                    <input type="number" name="parking" id="parking" value="{{ old('parking') }}" placeholder="e.g. 1">
                    @error('parking') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="garage_no">Garage No.</label>
                    <input type="text" name="garage_no" id="garage_no" value="{{ old('garage_no') }}" placeholder="e.g. G-12">
                    @error('garage_no') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="form-row cols-2">
                <div class="form-group">
                    <label for="garage_size">Garage Size (sqft)</label>
                    <input type="text" name="garage_size" id="garage_size" value="{{ old('garage_size') }}" placeholder="e.g. 200">
                    @error('garage_size') <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label for="apartment_direction">Apartment Direction</label>
                    <input type="text" name="apartment_direction" id="apartment_direction" value="{{ old('apartment_direction') }}" placeholder="e.g. South-East facing">
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
                @php
                    $facilities = [
                      'swimming_pool'       => 'Swimming Pool',
                      'gymnasium'           => 'Gymnasium',
                      'community_hall'      => 'Community Hall',
                      'children_play_area'  => 'Children Play Area',
                      'rooftop_garden'      => 'Rooftop Garden',
                      'generator_backup'    => 'Generator Backup',
                      'solar_panel'         => 'Solar Panel',
                      'cctv_security'       => 'CCTV Security',
                      'intercom_system'     => 'Intercom System',
                      'fire_safety_system'  => 'Fire Safety System',
                      'earthquake_resistant'=> 'Earthquake Resistant',
                      'passenger_lift'      => 'Passenger Lift',
                      'car_parking'         => 'Car Parking',
                      'visitor_parking'     => 'Visitor Parking',
                      'guard_house'         => 'Guard House',
                      'water_reservoir'     => 'Water Reservoir',
                      'sewage_treatment'    => 'Sewage Treatment',
                      'waste_management'    => 'Waste Management',
                      'landscaped_garden'   => 'Landscaped Garden',
                      'jogging_track'       => 'Jogging Track',
                    ];
                @endphp

                @foreach($facilities as $value => $label)
                    @php $checked = in_array($value, old('facilities', [])); @endphp
                    <label class="checkbox-item {{ $checked ? 'checked' : '' }}">
                        <input type="checkbox"
                               name="facilities[]"
                               value="{{ $value }}"
                               {{ $checked ? 'checked' : '' }}
                               onchange="toggleChecked(this)">
                        {{ $label }}
                    </label>
                @endforeach

                {{--
                  Dynamic from DB:
                  @foreach($facilities as $facility)
                    @php $checked = in_array($facility->id, old('facilities', [])); @endphp
                    <label class="checkbox-item {{ $checked ? 'checked' : '' }}">
                      <input type="checkbox" name="facilities[]" value="{{ $facility->id }}" {{ $checked ? 'checked' : '' }} onchange="toggleChecked(this)">
                      {{ $facility->name }}
                    </label>
                  @endforeach
                --}}
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
                @php
                    $tags = [
                      'luxury'            => 'Luxury',
                      'affordable'        => 'Affordable',
                      'ready_to_move'     => 'Ready to Move',
                      'under_construction'=> 'Under Construction',
                      'pre_launch'        => 'Pre-Launch',
                      'sea_view'          => 'Sea View',
                      'lake_view'         => 'Lake View',
                      'city_view'         => 'City View',
                      'eco_friendly'      => 'Eco-Friendly',
                      'smart_home'        => 'Smart Home',
                      'pet_friendly'      => 'Pet Friendly',
                      'gated_community'   => 'Gated Community',
                      'corner_plot'       => 'Corner Plot',
                      'south_facing'      => 'South Facing',
                      'north_facing'      => 'North Facing',
                    ];
                @endphp

                @foreach($tags as $value => $label)
                    @php $checked = in_array($value, old('tags', [])); @endphp
                    <label class="checkbox-item {{ $checked ? 'checked' : '' }}">
                        <input type="checkbox"
                               name="tags[]"
                               value="{{ $value }}"
                               {{ $checked ? 'checked' : '' }}
                               onchange="toggleChecked(this)">
                        {{ $label }}
                    </label>
                @endforeach

                {{--
                  Dynamic from DB:
                  @foreach($tags as $tag)
                    @php $checked = in_array($tag->id, old('tags', [])); @endphp
                    <label class="checkbox-item {{ $checked ? 'checked' : '' }}">
                      <input type="checkbox" name="tags[]" value="{{ $tag->id }}" {{ $checked ? 'checked' : '' }} onchange="toggleChecked(this)">
                      {{ $tag->name }}
                    </label>
                  @endforeach
                --}}
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