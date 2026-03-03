@extends('layout')

@section('title', 'Pop-up Settings')
@section('breadcrumb', 'Pop-up Settings')

@section('content')

    <div class="page-header">
        <h2>Pop-up Settings</h2>
        <p>Manage the homepage popup visibility and image</p>
        <div class="gold-line"></div>
    </div>

    <div class="section-card">
        <div class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 9h6M9 12h6M9 15h4"/>
            </svg>
            Popup Configuration
        </div>

        <form action="{{route('save-popup')}}" method="POST" enctype="multipart/form-data"> {{-- replace # with route('popup.update') --}}
            @csrf

            {{-- Enable / Disable Toggle --}}
            <div class="form-group" style="margin-bottom: 28px;">
                <label style="margin-bottom: 12px;">Popup Status</label>
                <label class="toggle-switch">
                    <input type="hidden" name="isEnabled" value="0">
                    <input type="checkbox"
                           name="isEnabled"
                           value="1"
                           id="popup-toggle"
                           {{ $popup->isEnabled ? 'checked' : '' }}
                           onchange="updateToggleLabel(this)">
                    <span class="toggle-slider"></span>
                    <span class="toggle-label" id="toggle-label">
                        {{ $popup->isEnabled ? 'Enabled' : 'Disabled' }}
                    </span>
                </label>
                @error('isEnabled')
                <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p>
                @enderror
            </div>

            {{-- Image Upload + Preview --}}
            <div class="form-row cols-2" style="align-items: start;">

                <div class="form-group">
                    <label for="popup_image">Popup Image</label>
                    <div class="img-uploader">
                        <input type="file"
                               name="image"
                               id="popup_image"
                               accept="image/*"
                               onchange="previewImage(this, 'popup-preview')">
                        <div class="icon">🖼️</div>
                        <p>Drag & drop or <span>browse</span></p>
                        <p style="margin-top:4px; font-size:0.72rem;">JPG, PNG, WEBP · Leave empty to keep current</p>
                    </div>
                    @error('image')
                    <p style="color:#FF8080; font-size:0.75rem; margin-top:5px;">{{ $message }}</p>
                    @enderror
                </div>

                <div class="form-group">
                    <label>Preview</label>
                    <div class="preview-box" style="height: 158px;" id="popup-preview">
                        @if(isset($popup->image) && trim($popup->image) !== '')
                            <img src="{{ asset($popup->image) }}" style="width:100%;height:100%;object-fit:cover;display:block;">
                        @else
                            <div class="placeholder">📷<br>No image selected</div>
                        @endif
                    </div>
                </div>

            </div>

            <div style="display:flex; gap:12px; margin-top:8px;">
                <button type="submit" class="btn-primary">Save Settings</button>
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
        /* Toggle Switch */
        .toggle-switch {
            display: flex;
            align-items: center;
            gap: 14px;
            cursor: pointer;
            user-select: none;
        }
        .toggle-switch input { display: none; }
        .toggle-slider {
            position: relative;
            width: 52px;
            height: 28px;
            background: var(--surface2);
            border: 1px solid rgba(201,168,76,0.2);
            border-radius: 34px;
            transition: all 0.3s ease;
            flex-shrink: 0;
        }
        .toggle-slider::after {
            content: '';
            position: absolute;
            top: 3px;
            left: 3px;
            width: 20px;
            height: 20px;
            background: var(--muted);
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        .toggle-switch input:checked + .toggle-slider {
            background: rgba(201,168,76,0.2);
            border-color: var(--gold);
        }
        .toggle-switch input:checked + .toggle-slider::after {
            left: 27px;
            background: var(--gold);
        }
        .toggle-label {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--muted);
            transition: color 0.3s;
            min-width: 60px;
        }
        .toggle-switch input:checked ~ .toggle-label {
            color: var(--gold);
        }

        /* Flash Toasts */
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
        function updateToggleLabel(checkbox) {
            document.getElementById('toggle-label').textContent = checkbox.checked ? 'Enabled' : 'Disabled';
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