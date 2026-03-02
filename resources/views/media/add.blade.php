@extends('layout')

@section('title', 'Add Media Coverage')
@section('breadcrumb', 'Media Coverage Management / Add Image')

@section('content')

    <div class="page-header">
        <h2>Add Media Coverage</h2>
        <p>Upload a new media coverage entry</p>
        <div class="gold-line"></div>
    </div>

    <div class="section-card">
        <div class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M4 6h16M4 10h16M4 14h10"/>
                <circle cx="18" cy="17" r="3"/>
                <path d="M20.2 19.2L22 21"/>
            </svg>
            Media Details
        </div>

        <form action="{{route('save-media')}}" method="POST" enctype="multipart/form-data"> {{-- replace # with route('media.store') --}}
            @csrf

            <div class="form-row cols-2">

                {{-- Media Title --}}
                <div class="form-group">
                    <label for="media_title">Media Title <span style="color:#FF8080;">*</span></label>
                    <input type="text"
                           name="media_title"
                           id="media_title"
                           placeholder="Enter media title...">
                    @error('media_title')
                    <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p>
                    @enderror
                </div>

                {{-- Media Type --}}
                <div class="form-group">
                    <label for="media_type">Media Type <span style="color:#FF8080;">*</span></label>
                    <input type="text"
                           name="media_type"
                           id="media_type"
                           placeholder="Enter media type...">
                    @error('media_type')
                    <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p>
                    @enderror
                </div>

            </div>

            {{-- Hyperlink --}}
            <div class="form-group">
                <label for="news_hyperlink">Hyperlink</label>
                <input type="url"
                       name="news_hyperlink"
                       id="news_hyperlink"
                       placeholder="https://example.com/article...">
                @error('news_hyperlink')
                <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p>
                @enderror
            </div>

            {{-- Mark as Featured --}}
            <div class="form-group">
                <label class="featured-check">
                    <input type="checkbox"
                           name="isFeatured"
                           value="1"
                            {{ old('is_featured') ? 'checked' : '' }}>
                    <span>Mark as Featured Media</span>
                </label>
            </div>

            {{-- Image Upload + Preview --}}
            <div class="form-row cols-2" style="align-items: start;">

                <div class="form-group">
                    <label for="image">Upload Image <span style="color:#FF8080;">*</span></label>
                    <div class="img-uploader">
                        <input type="file"
                               name="image"
                               id="image"
                               accept="image/*"
                               onchange="previewImage(this, 'media-add-preview')">
                        <div class="icon">📰</div>
                        <p>Drag & drop or <span>browse</span></p>
                        <p style="margin-top:4px; font-size:0.72rem;">JPG, PNG, WEBP · Max 10MB</p>
                    </div>
                    @error('media_image')
                    <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p>
                    @enderror
                </div>

                <div class="form-group">
                    <label>Preview</label>
                    <div class="preview-box" style="height: 185px;" id="media-add-preview">
                        <div class="placeholder">📷<br>No image selected</div>
                    </div>
                </div>

            </div>

            {{-- Actions --}}
            <div style="display:flex; gap:12px; margin-top:8px;">
                <button type="submit" class="btn-primary">Add Media Coverage</button>
                <button type="reset" class="btn-secondary" onclick="resetPreview('media-add-preview')">Reset</button>
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
        function resetPreview(previewId) {
            document.getElementById(previewId).innerHTML =
                '<div class="placeholder">📷<br>No image selected</div>';
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
