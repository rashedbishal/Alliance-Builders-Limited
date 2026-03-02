@extends('layout')

@section('title', 'Remove Media Coverage')
@section('breadcrumb', 'Media Coverage Management / Remove Image')

@section('content')

    <div class="page-header">
        <h2>Remove Media Coverage</h2>
        <p>Delete existing media coverage entries</p>
        <div class="gold-line"></div>
    </div>

    <div class="section-card">
        <div class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M4 6h16M4 10h16M4 14h10"/>
                <circle cx="18" cy="17" r="3"/>
                <path d="M20.2 19.2L22 21"/>
            </svg>
            Existing Media Entries
            <span class="badge" style="margin-left:auto;">{{ $mediaItems->count() }} {{ Str::plural('Entry', $mediaItems->count()) }}</span>
        </div>

        @if($mediaItems->isEmpty())
            <div style="text-align:center; padding:48px 20px; color:var(--muted);">
                <div style="font-size:2.5rem; margin-bottom:12px;">📰</div>
                <p style="font-size:0.88rem;">No media coverage entries found.</p>
            </div>
        @else
            <div class="img-grid">
                @foreach($mediaItems as $item)
                    <div class="img-grid-card" id="media-card-{{ $item->id }}">

                        {{-- Thumbnail or Type Icon --}}
                        @if($item->image_path)
                            <img class="thumb"
                                 src="{{ asset($item->image_path) }}"
                                 alt="{{ $item->media_title }}">
                        @else
                            <div class="thumb-placeholder" style="font-size:2.5rem;">
                                @switch($item->media_type)
                                    @case('newspaper')     📰 @break
                                    @case('online_portal') 🌐 @break
                                    @case('television')    📺 @break
                                    @case('magazine')      📖 @break
                                    @case('blog')          ✍️  @break
                                    @default               📄
                                @endswitch
                            </div>
                        @endif

                        {{-- Card Body --}}
                        <div class="card-body">
                            <div class="card-title" title="{{ $item->media_title }}">{{ $item->media_title }}</div>
                            <div class="card-meta" style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px;">
                                @if($item->media_type)
                                    <span class="badge">{{ ucwords(str_replace('_', ' ', $item->media_type)) }}</span>
                                @endif
                                @if($item->is_featured)
                                    <span class="badge" style="background:rgba(201,168,76,0.2); border-color:var(--gold);">⭐ Featured</span>
                                @endif
                            </div>
                            @if($item->hyperlink)
                                <a href="{{ $item->hyperlink }}" target="_blank"
                                   style="display:block; font-size:0.72rem; color:var(--muted); margin-bottom:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"
                                   title="{{ $item->hyperlink }}">
                                    🔗 {{ $item->hyperlink }}
                                </a>
                            @endif
                            <div class="card-actions">
                                <form action="#" method="POST" {{-- replace # with route('media.destroy', $item->id) --}}
                                id="delete-media-form-{{ $item->id }}"
                                      onsubmit="return confirmDelete(event, {{ $item->id }}, 'media-card-{{ $item->id }}')">
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
            @if($mediaItems->hasPages())
                <div style="margin-top:28px;">
                    {{ $mediaItems->links() }}
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
            if (!confirm('Delete this media entry? This cannot be undone.')) return false;
            const card = document.getElementById(cardId);
            if (card) {
                card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                card.style.transform  = 'scale(0.85)';
                card.style.opacity    = '0';
                setTimeout(() => {
                    document.getElementById('delete-media-form-' + id).submit();
                }, 300);
            }
            return false;
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