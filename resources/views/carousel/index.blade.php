@extends('layout')

@section('title', 'Carousel Banner Management')
@section('breadcrumb', 'Carousel Banner Management')

@section('content')

    <div class="page-header">
        <h2>Carousel Banner Management</h2>
        <p>Manage the 5 homepage carousel banner images</p>
        <div class="gold-line"></div>
    </div>

    {{-- ===================== 1st Banner ===================== --}}
    <div class="banner-card">
        <span class="banner-num">1st Banner</span>
        <form action="{{ route('update-carousel') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <input type="hidden" name="position" value="1">

            <div class="form-row cols-2" style="align-items: start; margin-top: 14px;">
                <div class="form-group">
                    <label>Upload Banner Image</label>
                    <div class="img-uploader">
                        <input type="file" name="image" accept="image/*"
                               onchange="previewImage(this, 'cb-prev-1')">
                        <div class="icon">🖼️</div>
                        <p>Drag & drop or <span>browse</span></p>
                        <p style="margin-top:4px; font-size:0.72rem;">Recommended: 1920×600px · JPG, PNG, WEBP</p>
                    </div>
                </div>
                <div>
                    <label>Preview</label>
                    <div class="preview-box" style="height: 155px;" id="cb-prev-1">
                        @if(!empty($banners[0]->image_path))
                            <img src="{{ asset($banners[0]->image_path) }}" style="width:100%;height:100%;object-fit:cover;">
                        @else
                            <div class="placeholder">🖼️<br>No banner selected</div>
                        @endif
                    </div>
                </div>
            </div>

            <div class="form-row cols-2" style="margin-top: 14px;">
                <div class="form-group">
                    <label>Property Name</label>
                    <input type="text" name="property_name" value="{{ old('property_name') }}" placeholder="Enter property name...">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" name="description" value="{{ old('description') }}" placeholder="Enter description...">
                </div>
            </div>

            @if($errors->has('banner_image.1'))
                <p style="color:#FF8080; font-size:0.78rem; margin-top:6px;">{{ $errors->first('banner_image.1') }}</p>
            @endif

            <div style="display:flex; gap:10px; margin-top:12px;">
                <button type="submit" class="btn-primary" style="padding:9px 22px; font-size:0.8rem;">Save Banner</button>
                @if(!empty($banners[0]->image_path))
                    <a href="#" {{-- replace # with route('carousel.clear', 1) --}}
                    onclick="return confirm('Clear this banner image?')"
                       class="btn-secondary" style="padding:9px 18px; font-size:0.8rem; text-decoration:none;">
                        Clear
                    </a>
                @endif
            </div>
        </form>
    </div>

    {{-- ===================== 2nd Banner ===================== --}}
    <div class="banner-card">
        <span class="banner-num">2nd Banner</span>
        <form action="#" method="POST" enctype="multipart/form-data"> {{-- replace # with route('carousel.update', 2) --}}
            @csrf
            <input type="hidden" name="position" value="2">

            <div class="form-row cols-2" style="align-items: start; margin-top: 14px;">
                <div class="form-group">
                    <label>Upload Banner Image</label>
                    <div class="img-uploader">
                        <input type="file" name="banner_image" accept="image/*"
                               onchange="previewImage(this, 'cb-prev-2')">
                        <div class="icon">🖼️</div>
                        <p>Drag & drop or <span>browse</span></p>
                        <p style="margin-top:4px; font-size:0.72rem;">Recommended: 1920×600px · JPG, PNG, WEBP</p>
                    </div>
                </div>
                <div>
                    <label>Preview</label>
                    <div class="preview-box" style="height: 155px;" id="cb-prev-2">
                        @if(!empty($banners[1]->image_path))
                            <img src="{{ asset($banners[1]->image_path) }}" style="width:100%;height:100%;object-fit:cover;">
                        @else
                            <div class="placeholder">🖼️<br>No banner selected</div>
                        @endif
                    </div>
                </div>
            </div>

            <div class="form-row cols-2" style="margin-top: 14px;">
                <div class="form-group">
                    <label>Property Name</label>
                    <input type="text" name="property_name" value="{{ old('property_name') }}" placeholder="Enter property name...">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" name="description" value="{{ old('description') }}" placeholder="Enter description...">
                </div>
            </div>

            @if($errors->has('banner_image.2'))
                <p style="color:#FF8080; font-size:0.78rem; margin-top:6px;">{{ $errors->first('banner_image.2') }}</p>
            @endif

            <div style="display:flex; gap:10px; margin-top:12px;">
                <button type="submit" class="btn-primary" style="padding:9px 22px; font-size:0.8rem;">Save Banner</button>
                @if(!empty($banners[1]->image_path))
                    <a href="#" {{-- replace # with route('carousel.clear', 2) --}}
                    onclick="return confirm('Clear this banner image?')"
                       class="btn-secondary" style="padding:9px 18px; font-size:0.8rem; text-decoration:none;">
                        Clear
                    </a>
                @endif
            </div>
        </form>
    </div>

    {{-- ===================== 3rd Banner ===================== --}}
    <div class="banner-card">
        <span class="banner-num">3rd Banner</span>
        <form action="#" method="POST" enctype="multipart/form-data"> {{-- replace # with route('carousel.update', 3) --}}
            @csrf
            <input type="hidden" name="position" value="3">

            <div class="form-row cols-2" style="align-items: start; margin-top: 14px;">
                <div class="form-group">
                    <label>Upload Banner Image</label>
                    <div class="img-uploader">
                        <input type="file" name="banner_image" accept="image/*"
                               onchange="previewImage(this, 'cb-prev-3')">
                        <div class="icon">🖼️</div>
                        <p>Drag & drop or <span>browse</span></p>
                        <p style="margin-top:4px; font-size:0.72rem;">Recommended: 1920×600px · JPG, PNG, WEBP</p>
                    </div>
                </div>
                <div>
                    <label>Preview</label>
                    <div class="preview-box" style="height: 155px;" id="cb-prev-3">
                        @if(!empty($banners[2]->image_path))
                            <img src="{{ asset($banners[2]->image_path) }}" style="width:100%;height:100%;object-fit:cover;">
                        @else
                            <div class="placeholder">🖼️<br>No banner selected</div>
                        @endif
                    </div>
                </div>
            </div>

            <div class="form-row cols-2" style="margin-top: 14px;">
                <div class="form-group">
                    <label>Property Name</label>
                    <input type="text" name="property_name" value="{{ old('property_name') }}" placeholder="Enter property name...">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" name="description" value="{{ old('description') }}" placeholder="Enter description...">
                </div>
            </div>

            @if($errors->has('banner_image.3'))
                <p style="color:#FF8080; font-size:0.78rem; margin-top:6px;">{{ $errors->first('banner_image.3') }}</p>
            @endif

            <div style="display:flex; gap:10px; margin-top:12px;">
                <button type="submit" class="btn-primary" style="padding:9px 22px; font-size:0.8rem;">Save Banner</button>
                @if(!empty($banners[2]->image_path))
                    <a href="#" {{-- replace # with route('carousel.clear', 3) --}}
                    onclick="return confirm('Clear this banner image?')"
                       class="btn-secondary" style="padding:9px 18px; font-size:0.8rem; text-decoration:none;">
                        Clear
                    </a>
                @endif
            </div>
        </form>
    </div>

    {{-- ===================== 4th Banner ===================== --}}
    <div class="banner-card">
        <span class="banner-num">4th Banner</span>
        <form action="#" method="POST" enctype="multipart/form-data"> {{-- replace # with route('carousel.update', 4) --}}
            @csrf
            <input type="hidden" name="position" value="4">

            <div class="form-row cols-2" style="align-items: start; margin-top: 14px;">
                <div class="form-group">
                    <label>Upload Banner Image</label>
                    <div class="img-uploader">
                        <input type="file" name="banner_image" accept="image/*"
                               onchange="previewImage(this, 'cb-prev-4')">
                        <div class="icon">🖼️</div>
                        <p>Drag & drop or <span>browse</span></p>
                        <p style="margin-top:4px; font-size:0.72rem;">Recommended: 1920×600px · JPG, PNG, WEBP</p>
                    </div>
                </div>
                <div>
                    <label>Preview</label>
                    <div class="preview-box" style="height: 155px;" id="cb-prev-4">
                        @if(!empty($banners[3]->image_path))
                            <img src="{{ asset($banners[3]->image_path) }}" style="width:100%;height:100%;object-fit:cover;">
                        @else
                            <div class="placeholder">🖼️<br>No banner selected</div>
                        @endif
                    </div>
                </div>
            </div>

            <div class="form-row cols-2" style="margin-top: 14px;">
                <div class="form-group">
                    <label>Property Name</label>
                    <input type="text" name="property_name" value="{{ old('property_name') }}" placeholder="Enter property name...">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" name="description" value="{{ old('description') }}" placeholder="Enter description...">
                </div>
            </div>

            @if($errors->has('banner_image.4'))
                <p style="color:#FF8080; font-size:0.78rem; margin-top:6px;">{{ $errors->first('banner_image.4') }}</p>
            @endif

            <div style="display:flex; gap:10px; margin-top:12px;">
                <button type="submit" class="btn-primary" style="padding:9px 22px; font-size:0.8rem;">Save Banner</button>
                @if(!empty($banners[3]->image_path))
                    <a href="#" {{-- replace # with route('carousel.clear', 4) --}}
                    onclick="return confirm('Clear this banner image?')"
                       class="btn-secondary" style="padding:9px 18px; font-size:0.8rem; text-decoration:none;">
                        Clear
                    </a>
                @endif
            </div>
        </form>
    </div>

    {{-- ===================== 5th Banner ===================== --}}
    <div class="banner-card">
        <span class="banner-num">5th Banner</span>
        <form action="#" method="POST" enctype="multipart/form-data"> {{-- replace # with route('carousel.update', 5) --}}
            @csrf
            <input type="hidden" name="position" value="5">

            <div class="form-row cols-2" style="align-items: start; margin-top: 14px;">
                <div class="form-group">
                    <label>Upload Banner Image</label>
                    <div class="img-uploader">
                        <input type="file" name="banner_image" accept="image/*"
                               onchange="previewImage(this, 'cb-prev-5')">
                        <div class="icon">🖼️</div>
                        <p>Drag & drop or <span>browse</span></p>
                        <p style="margin-top:4px; font-size:0.72rem;">Recommended: 1920×600px · JPG, PNG, WEBP</p>
                    </div>
                </div>
                <div>
                    <label>Preview</label>
                    <div class="preview-box" style="height: 155px;" id="cb-prev-5">
                        @if(!empty($banners[4]->image_path))
                            <img src="{{ asset($banners[4]->image_path) }}" style="width:100%;height:100%;object-fit:cover;">
                        @else
                            <div class="placeholder">🖼️<br>No banner selected</div>
                        @endif
                    </div>
                </div>
            </div>

            <div class="form-row cols-2" style="margin-top: 14px;">
                <div class="form-group">
                    <label>Property Name</label>
                    <input type="text" name="property_name" value="{{ old('property_name') }}" placeholder="Enter property name...">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" name="description" value="{{ old('description') }}" placeholder="Enter description...">
                </div>
            </div>

            @if($errors->has('banner_image.5'))
                <p style="color:#FF8080; font-size:0.78rem; margin-top:6px;">{{ $errors->first('banner_image.5') }}</p>
            @endif

            <div style="display:flex; gap:10px; margin-top:12px;">
                <button type="submit" class="btn-primary" style="padding:9px 22px; font-size:0.8rem;">Save Banner</button>
                @if(!empty($banners[4]->image_path))
                    <a href="#" {{-- replace # with route('carousel.clear', 5) --}}
                    onclick="return confirm('Clear this banner image?')"
                       class="btn-secondary" style="padding:9px 18px; font-size:0.8rem; text-decoration:none;">
                        Clear
                    </a>
                @endif
            </div>
        </form>
    </div>

    {{-- Session Flash Messages --}}
    @if(session('success'))
        <div style="position:fixed;bottom:24px;right:24px;background:rgba(50,180,100,0.15);border:1px solid rgba(50,180,100,0.4);color:#80FFB0;padding:12px 20px;border-radius:10px;font-size:0.82rem;z-index:999;">
            ✅ {{ session('success') }}
        </div>
    @endif
    @if(session('error'))
        <div style="position:fixed;bottom:24px;right:24px;background:rgba(255,80,80,0.1);border:1px solid rgba(255,80,80,0.3);color:#FF8080;padding:12px 20px;border-radius:10px;font-size:0.82rem;z-index:999;">
            ❌ {{ session('error') }}
        </div>
    @endif

@endsection

@push('scripts')
    <script>
        {{-- Auto-dismiss flash messages after 3 seconds --}}
        setTimeout(() => {
            document.querySelectorAll('[style*="position:fixed"][style*="bottom:24px"]')
                .forEach(el => { el.style.transition = 'opacity 0.5s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 500); });
        }, 3000);
    </script>
@endpush