<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'CMS') — Alliance Builders Limited</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --gold: #C9A84C;
            --gold-light: #E8C97A;
            --dark: #0F1117;
            --darker: #080B10;
            --surface: #161B26;
            --surface2: #1E2535;
            --border: rgba(201,168,76,0.15);
            --text: #E8EAF0;
            --muted: #7A839A;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: var(--darker); color: var(--text); min-height: 100vh; }
        h1,h2,h3,h4 { font-family: 'Playfair Display', serif; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--dark); }
        ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }

        /* Sidebar */
        #sidebar {
            width: 280px; background: var(--dark);
            border-right: 1px solid var(--border);
            display: flex; flex-direction: column;
            transition: transform 0.3s ease;
            position: fixed; top: 0; left: 0; z-index: 50; height: 100vh; overflow-y: auto;
        }
        #sidebar .logo-area {
            padding: 28px 24px 20px;
            border-bottom: 1px solid var(--border);
            flex-shrink: 0;
        }
        #sidebar .logo-area h1 { font-size: 1.1rem; color: var(--gold); line-height: 1.2; }
        #sidebar .logo-area p { font-size: 0.7rem; color: var(--muted); letter-spacing: 0.15em; text-transform: uppercase; margin-top: 4px; }

        .nav-item { position: relative; }
        .nav-link {
            display: flex; align-items: center; gap: 12px;
            padding: 11px 24px; font-size: 0.82rem; font-weight: 500;
            color: var(--muted); cursor: pointer; transition: all 0.2s;
            border-left: 3px solid transparent; text-decoration: none;
            user-select: none;
        }
        .nav-link:hover { color: var(--text); background: rgba(201,168,76,0.05); }
        .nav-link.active { color: var(--gold); border-left-color: var(--gold); background: rgba(201,168,76,0.08); }
        .nav-link svg { width: 16px; height: 16px; flex-shrink: 0; }
        .nav-link .chevron { margin-left: auto; transition: transform 0.25s; }
        .nav-link.open .chevron { transform: rotate(90deg); }

        .submenu { overflow: hidden; max-height: 0; transition: max-height 0.3s ease; }
        .submenu.open { max-height: 200px; }
        .submenu-link {
            display: flex; align-items: center; gap: 10px;
            padding: 9px 24px 9px 52px; font-size: 0.78rem;
            color: var(--muted); cursor: pointer; transition: all 0.2s;
            text-decoration: none;
        }
        .submenu-link:hover { color: var(--text); background: rgba(201,168,76,0.04); }
        .submenu-link.active { color: var(--gold-light); }
        .submenu-link::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

        .nav-section-label {
            padding: 16px 24px 6px; font-size: 0.65rem; letter-spacing: 0.12em;
            text-transform: uppercase; color: var(--muted); opacity: 0.6;
        }

        .logout-btn {
            margin-top: auto; padding: 20px 24px;
            border-top: 1px solid var(--border); flex-shrink: 0;
        }
        .logout-btn button {
            display: flex; align-items: center; gap: 10px;
            width: 100%; padding: 10px 16px; border-radius: 8px;
            background: rgba(255,80,80,0.08); border: 1px solid rgba(255,80,80,0.2);
            color: #FF8080; font-size: 0.82rem; font-weight: 500;
            cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .logout-btn button:hover { background: rgba(255,80,80,0.15); border-color: rgba(255,80,80,0.4); }

        /* Main */
        #main { margin-left: 280px; min-height: 100vh; transition: margin 0.3s; }

        #topbar {
            height: 60px; background: var(--dark); border-bottom: 1px solid var(--border);
            display: flex; align-items: center; padding: 0 28px; gap: 16px;
            position: sticky; top: 0; z-index: 40;
        }
        #topbar .breadcrumb { font-size: 0.8rem; color: var(--muted); flex: 1; }
        #topbar .breadcrumb span { color: var(--gold); }
        #menu-toggle { display: none; background: none; border: none; color: var(--text); cursor: pointer; }

        /* Page Content */
        .page-content { padding: 32px 28px; }

        /* Cards / Sections */
        .section-card {
            background: var(--surface); border: 1px solid var(--border);
            border-radius: 14px; padding: 28px; margin-bottom: 24px;
        }
        .section-title {
            font-size: 1.05rem; color: var(--gold); margin-bottom: 20px;
            padding-bottom: 12px; border-bottom: 1px solid var(--border);
            display: flex; align-items: center; gap: 10px;
        }
        .section-title svg { width: 18px; height: 18px; }

        /* Form Elements */
        label { font-size: 0.78rem; color: var(--muted); display: block; margin-bottom: 6px; font-weight: 500; letter-spacing: 0.02em; }
        input[type="text"], input[type="url"], input[type="date"], input[type="number"],
        textarea, select {
            width: 100%; background: var(--darker); border: 1px solid rgba(201,168,76,0.2);
            border-radius: 8px; padding: 10px 14px; color: var(--text);
            font-size: 0.83rem; font-family: 'DM Sans', sans-serif;
            transition: border-color 0.2s, box-shadow 0.2s; outline: none;
        }
        input:focus, textarea:focus, select:focus {
            border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,0.1);
        }
        select option { background: var(--surface); }
        textarea { resize: vertical; min-height: 90px; }

        .form-group { margin-bottom: 18px; }
        .form-row { display: grid; gap: 16px; }
        .form-row.cols-2 { grid-template-columns: 1fr 1fr; }
        .form-row.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
        .form-row.cols-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }

        /* Buttons */
        .btn-primary {
            padding: 11px 28px; background: linear-gradient(135deg, var(--gold), #A8782A);
            border: none; border-radius: 8px; color: #0F1117; font-weight: 600;
            font-size: 0.83rem; cursor: pointer; font-family: 'DM Sans', sans-serif;
            transition: all 0.2s; letter-spacing: 0.02em;
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,168,76,0.3); }
        .btn-danger {
            padding: 8px 18px; background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.3);
            border-radius: 7px; color: #FF8080; font-size: 0.78rem; font-weight: 500;
            cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        .btn-danger:hover { background: rgba(255,80,80,0.2); border-color: rgba(255,80,80,0.5); }
        .btn-secondary {
            padding: 11px 24px; background: var(--surface2); border: 1px solid var(--border);
            border-radius: 8px; color: var(--text); font-size: 0.83rem; font-weight: 500;
            cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        .btn-secondary:hover { border-color: var(--gold); color: var(--gold); }
        .btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Image Uploader */
        .img-uploader {
            border: 2px dashed rgba(201,168,76,0.25); border-radius: 10px; padding: 28px;
            text-align: center; transition: all 0.2s; position: relative;
            background: var(--darker); cursor: pointer;
        }
        .img-uploader:hover { border-color: var(--gold); background: rgba(201,168,76,0.03); }
        .img-uploader input[type="file"] {
            position: absolute; inset: 0; opacity: 0; cursor: pointer;
            width: 100%; height: 100%; z-index: 2;
        }
        .img-uploader .icon { font-size: 2rem; margin-bottom: 8px; pointer-events: none; }
        .img-uploader p { font-size: 0.8rem; color: var(--muted); pointer-events: none; }
        .img-uploader span { color: var(--gold); }

        .preview-box {
            border-radius: 10px; overflow: hidden; border: 1px solid var(--border);
            background: var(--darker); min-height: 140px;
            display: flex; align-items: center; justify-content: center;
        }
        .preview-box img { width: 100%; height: 100%; object-fit: cover; }
        .preview-box .placeholder { color: var(--muted); font-size: 0.78rem; text-align: center; padding: 20px; }

        /* Image Grid (Remove Pages) */
        .img-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .img-grid-card {
            background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
            overflow: hidden; transition: all 0.25s;
        }
        .img-grid-card:hover { border-color: rgba(255,80,80,0.4); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .img-grid-card .thumb { width: 100%; height: 140px; object-fit: cover; display: block; }
        .img-grid-card .thumb-placeholder {
            width: 100%; height: 140px; display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, var(--surface), var(--darker)); color: var(--muted); font-size: 0.75rem;
        }
        .img-grid-card .card-body { padding: 12px 14px; }
        .img-grid-card .card-title { font-size: 0.8rem; font-weight: 600; color: var(--text); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .img-grid-card .card-meta { font-size: 0.72rem; color: var(--muted); margin-bottom: 10px; }
        .img-grid-card .card-actions { display: flex; justify-content: flex-end; }

        /* Checkbox Group */
        .checkbox-group { display: flex; flex-wrap: wrap; gap: 10px; }
        .checkbox-item {
            display: flex; align-items: center; gap: 7px;
            background: var(--darker); border: 1px solid rgba(201,168,76,0.15);
            border-radius: 7px; padding: 7px 12px; cursor: pointer;
            transition: all 0.2s; font-size: 0.78rem; color: var(--muted);
            user-select: none;
        }
        .checkbox-item:hover { border-color: var(--gold); color: var(--text); }
        .checkbox-item input { accent-color: var(--gold); width: 14px; height: 14px; }
        .checkbox-item.checked { border-color: var(--gold); background: rgba(201,168,76,0.08); color: var(--gold-light); }

        /* Featured Checkbox */
        .featured-check { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .featured-check input { accent-color: var(--gold); width: 16px; height: 16px; }
        .featured-check span { font-size: 0.83rem; color: var(--text); }

        /* Page Header */
        .page-header { margin-bottom: 28px; }
        .page-header h2 { font-size: 1.5rem; color: var(--text); }
        .page-header p { font-size: 0.83rem; color: var(--muted); margin-top: 5px; }
        .page-header .gold-line { width: 40px; height: 3px; background: linear-gradient(90deg, var(--gold), transparent); border-radius: 2px; margin-top: 10px; }

        /* Badge */
        .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 0.68rem; font-weight: 600; background: rgba(201,168,76,0.15); color: var(--gold); border: 1px solid rgba(201,168,76,0.25); }

        /* Divider */
        .divider { border: none; border-top: 1px solid var(--border); margin: 24px 0; }

        /* Banner Card */
        .banner-card {
            background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
            padding: 22px; margin-bottom: 20px; position: relative;
            transition: border-color 0.2s;
        }
        .banner-card:hover { border-color: rgba(201,168,76,0.35); }
        .banner-num {
            position: absolute; top: -12px; left: 20px;
            background: linear-gradient(135deg, var(--gold), #A8782A);
            color: #0F1117; font-size: 0.7rem; font-weight: 700;
            padding: 3px 14px; border-radius: 20px; letter-spacing: 0.08em;
        }

        /* Responsive */
        @media (max-width: 900px) {
            #sidebar { transform: translateX(-100%); }
            #sidebar.open { transform: translateX(0); }
            #main { margin-left: 0; }
            #menu-toggle { display: block; }
            .form-row.cols-4 { grid-template-columns: 1fr 1fr; }
            .form-row.cols-3 { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
            .form-row.cols-2,
            .form-row.cols-3,
            .form-row.cols-4 { grid-template-columns: 1fr; }
            .page-content { padding: 20px 16px; }
            #topbar { padding: 0 16px; }
            .img-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
        }

        /* Overlay */
        #overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 49; }
        #overlay.active { display: block; }
    </style>
    @stack('styles')
</head>
<body>

{{-- Mobile Overlay --}}
<div id="overlay" onclick="closeSidebar()"></div>

{{-- Sidebar --}}
@include('partials.sidebar')

{{-- Main --}}
<div id="main">

    {{-- Topbar --}}
    <header id="topbar">
        <button id="menu-toggle" onclick="toggleSidebar()">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
        </button>
        <div class="breadcrumb">
            Dashboard / <span>@yield('breadcrumb', 'Dashboard')</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--gold),#8A5A00);display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;color:#0F1117;">
                {{ strtoupper(substr(Auth::user()->name ?? 'AB', 0, 2)) }}
            </div>
        </div>
    </header>

    {{-- Page Content --}}
    <div class="page-content">
        @yield('content')
    </div>

</div>{{-- /main --}}

<script>
    function toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
        document.getElementById('overlay').classList.toggle('active');
    }
    function closeSidebar() {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('active');
    }

    // Image preview helper — usable on any page
    function previewImage(input, previewId) {
        const file = input.files[0];
        if (!file) return;
        const preview = document.getElementById(previewId);
        const url = URL.createObjectURL(file);
        preview.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover;display:block;">`;
    }

    // Multiple image preview helper
    function previewMultiple(input, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        Array.from(input.files).forEach(file => {
            const url = URL.createObjectURL(file);
            container.innerHTML += `
        <div style="width:90px;height:70px;border-radius:8px;overflow:hidden;border:1px solid var(--border);flex-shrink:0;">
          <img src="${url}" style="width:100%;height:100%;object-fit:cover;">
        </div>`;
        });
    }

    // Checkbox highlight toggle
    function toggleChecked(input) {
        input.closest('.checkbox-item').classList.toggle('checked', input.checked);
    }
</script>

@stack('scripts')
</body>
</html>