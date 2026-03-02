@extends('layout')

@section('title', 'Remove Gallery Image')
@section('breadcrumb', 'Gallery Image Management / Remove Image')

@section('content')

    <div class="page-header">
        <h2>Remove Gallery Images</h2>
        <p>Select and delete images from the gallery</p>
        <div class="gold-line"></div>
    </div>

    <div class="section-card">
        <div class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
            </svg>
            Existing Gallery Images
            <span class="badge" style="margin-left:auto;">{{ $images->count() }} {{ Str::plural('Image', $images->count()) }}</span>
        </div>

        @if($images->isEmpty())
            <div style="text-align:center; padding:48px 20px; color:var(--muted);">
                <div style="font-size:2.5rem; margin-bottom:12px;">🖼️</div>
                <p style="font-size:0.88rem;">No gallery images found.</p>
            </div>
        @else
            <div class="img-grid">
                @foreach($images as $image)
                    <div class="img-grid-card" id="gallery-card-{{ $image->id }}">

                        {{-- Thumbnail --}}
                        @if($image->image_path)
                            <img class="thumb"
                                 src="{{ asset($image->image_path) }}"
                                 alt="{{ $image->title }}">
                        @else
                            <div class="thumb-placeholder">
                                <span style="font-size:1.8rem;">🖼️</span>
                            </div>
                        @endif

                        {{-- Card Body --}}
                        <div class="card-body">
                            <div class="card-title" title="{{ $image->title }}">{{ $image->title }}</div>
                            <div class="card-meta" style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px;">
                                @if($image->gallery_type)
                                    <span class="badge">{{ ucfirst($image->gallery_type) }}</span>
                                @endif
                                @if($image->media_type)
                                    <span class="badge" style="background:rgba(100,150,255,0.1); border-color:rgba(100,150,255,0.25); color:#A0B8FF;">
                  {{ ucfirst($image->media_type) }}
                </span>
                                @endif
                            </div>
                            <div class="card-actions">
                                <form action="#" method="POST" {{-- replace # with route('gallery.destroy', $image->id) --}}
                                id="delete-gallery-form-{{ $image->id }}"
                                      onsubmit="return confirmDelete(event, {{ $image->id }}, 'gallery-card-{{ $image->id }}')">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn-danger">🗑️ Delete</button>
                                </form>
                            </div>
                        </div>

                    </div>
                @endforeach
            </div>

            {{-- Pagination --}}
            @if($images->hasPages())
                <div style="margin-top:28px;">
                    {{ $images->links() }}
                </div>
            @endif

        @endif
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
        function confirmDelete(e, id, cardId) {
            e.preventDefault();
            if (!confirm('Delete this image? This cannot be undone.')) return false;
            const card = document.getElementById(cardId);
            if (card) {
                card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                card.style.transform  = 'scale(0.85)';
                card.style.opacity    = '0';
                setTimeout(() => {
                    document.getElementById('delete-gallery-form-' + id).submit();
                }, 300);
            }
            return false;
        }

        // Auto-dismiss flash toasts
        setTimeout(() => {
            document.querySelectorAll('.flash-toast').forEach(el => {
                el.style.transition = 'opacity 0.5s';
                el.style.opacity    = '0';
                setTimeout(() => el.remove(), 500);
            });
        }, 3000);
    </script>
@endpush