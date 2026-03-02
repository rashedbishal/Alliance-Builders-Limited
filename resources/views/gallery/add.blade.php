@extends('layout')

@section('title', 'Add Gallery Image')
@section('breadcrumb', 'Gallery Image Management / Add Image')

@section('content')

    <div class="page-header">
        <h2>Add Gallery Image</h2>
        <p>Upload a new image to the gallery</p>
        <div class="gold-line"></div>
    </div>

    <div class="section-card">
        <div class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M12 5v14M5 12h14"/>
            </svg>
            Image Details
        </div>

        <form action="#" method="POST" enctype="multipart/form-data"> {{-- replace # with route('gallery.store') --}}
            @csrf

            <div class="form-row cols-2">

                {{-- Gallery Type --}}
                <div class="form-group">
                    <label for="gallery_type">Gallery Type <span style="color:#FF8080;">*</span></label>
                    <select name="gallery_type" id="gallery_type">
                        <option value="" disabled {{ old('gallery_type') ? '' : 'selected' }}>Select Gallery Type</option>
                        {{--
                          Option A — Static list:
                        --}}
                        <option value="residential"    {{ old('gallery_type') == 'residential'    ? 'selected' : '' }}>Residential</option>
                        <option value="commercial"     {{ old('gallery_type') == 'commercial'     ? 'selected' : '' }}>Commercial</option>
                        <option value="interior"       {{ old('gallery_type') == 'interior'       ? 'selected' : '' }}>Interior</option>
                        <option value="exterior"       {{ old('gallery_type') == 'exterior'       ? 'selected' : '' }}>Exterior</option>
                        <option value="construction"   {{ old('gallery_type') == 'construction'   ? 'selected' : '' }}>Construction</option>
                        {{--
                          Option B — Dynamic from DB (comment out static list above and use this):
                          @foreach($galleryTypes as $type)
                            <option value="{{ $type->id }}" {{ old('gallery_type') == $type->id ? 'selected' : '' }}>
                              {{ $type->name }}
                            </option>
                          @endforeach
                        --}}
                    </select>
                    @error('gallery_type')
                    <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p>
                    @enderror
                </div>

                {{-- Media Type --}}
                <div class="form-group">
                    <label for="media_type">Media Type <span style="color:#FF8080;">*</span></label>
                    <select name="media_type" id="media_type">
                        <option value="" disabled {{ old('media_type') ? '' : 'selected' }}>Select Media Type</option>
                        <option value="image"                {{ old('media_type') == 'image'                ? 'selected' : '' }}>Image</option>
                        <option value="render"               {{ old('media_type') == 'render'               ? 'selected' : '' }}>Render</option>
                        <option value="architectural_drawing" {{ old('media_type') == 'architectural_drawing' ? 'selected' : '' }}>Architectural Drawing</option>
                        {{--
                          Dynamic option:
                          @foreach($mediaTypes as $type)
                            <option value="{{ $type->id }}" {{ old('media_type') == $type->id ? 'selected' : '' }}>
                              {{ $type->name }}
                            </option>
                          @endforeach
                        --}}
                    </select>
                    @error('media_type')
                    <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p>
                    @enderror
                </div>

            </div>

            {{-- Title --}}
            <div class="form-group">
                <label for="title">Title <span style="color:#FF8080;">*</span></label>
                <input type="text"
                       name="title"
                       id="title"
                       value="{{ old('title') }}"
                       placeholder="Enter image title...">
                @error('title')
                <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p>
                @enderror
            </div>

            {{-- Description --}}
            <div class="form-group">
                <label for="description">Description</label>
                <textarea name="description"
                          id="description"
                          placeholder="Enter image description...">{{ old('description') }}</textarea>
                @error('description')
                <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p>
                @enderror
            </div>

            {{-- Image Upload + Preview --}}
            <div class="form-row cols-2" style="align-items: start;">

                <div class="form-group">
                    <label for="gallery_image">Upload Image <span style="color:#FF8080;">*</span></label>
                    <div class="img-uploader">
                        <input type="file"
                               name="gallery_image"
                               id="gallery_image"
                               accept="image/*"
                               onchange="previewImage(this, 'gallery-add-preview')">
                        <div class="icon">🖼️</div>
                        <p>Drag & drop or <span>browse</span></p>
                        <p style="margin-top:4px; font-size:0.72rem;">JPG, PNG, WEBP · Max 10MB</p>
                    </div>
                    @error('gallery_image')
                    <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p>
                    @enderror
                </div>

                <div class="form-group">
                    <label>Preview</label>
                    <div class="preview-box" style="height: 185px;" id="gallery-add-preview">
                        <div class="placeholder">📷<br>No image selected</div>
                    </div>
                </div>

            </div>

            {{-- Actions --}}
            <div style="display:flex; gap:12px; margin-top:8px;">
                <button type="submit" class="btn-primary">Upload Image</button>
                <button type="reset" class="btn-secondary" onclick="resetPreview('gallery-add-preview')">Reset</button>
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
        .flash-success {
            background: rgba(50,180,100,0.15);
            border: 1px solid rgba(50,180,100,0.4);
            color: #80FFB0;
        }
        .flash-error {
            background: rgba(255,80,80,0.1);
            border: 1px solid rgba(255,80,80,0.3);
            color: #FF8080;
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
        }
    </style>
@endpush

@push('scripts')
    <script>
        // Reset preview box back to placeholder
        function resetPreview(previewId) {
            document.getElementById(previewId).innerHTML =
                '<div class="placeholder">📷<br>No image selected</div>';
        }

        // Auto-dismiss flash toasts
        setTimeout(() => {
            document.querySelectorAll('.flash-toast').forEach(el => {
                el.style.transition = 'opacity 0.5s';
                el.style.opacity = '0';
                setTimeout(() => el.remove(), 500);
            });
        }, 3000);
    </script>
@endpush