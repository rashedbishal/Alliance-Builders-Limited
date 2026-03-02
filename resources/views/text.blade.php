<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alliance Builders Limited — CMS</title>
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
            width: 280px; min-height: 100vh; background: var(--dark);
            border-right: 1px solid var(--border);
            display: flex; flex-direction: column;
            transition: transform 0.3s ease;
            position: fixed; top: 0; left: 0; z-index: 50; height: 100vh; overflow-y: auto;
        }
        #sidebar .logo-area {
            padding: 28px 24px 20px;
            border-bottom: 1px solid var(--border);
        }
        #sidebar .logo-area h1 { font-size: 1.1rem; color: var(--gold); line-height: 1.2; }
        #sidebar .logo-area p { font-size: 0.7rem; color: var(--muted); letter-spacing: 0.15em; text-transform: uppercase; margin-top: 4px; }

        .nav-item { position: relative; }
        .nav-link {
            display: flex; align-items: center; gap: 12px;
            padding: 11px 24px; font-size: 0.82rem; font-weight: 500;
            color: var(--muted); cursor: pointer; transition: all 0.2s;
            border-left: 3px solid transparent;
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
        }
        .submenu-link:hover { color: var(--text); background: rgba(201,168,76,0.04); }
        .submenu-link.active { color: var(--gold-light); }
        .submenu-link::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

        .nav-section-label {
            padding: 16px 24px 6px; font-size: 0.65rem; letter-spacing: 0.12em;
            text-transform: uppercase; color: var(--muted); opacity: 0.6;
        }

        /* Logout */
        .logout-btn {
            margin-top: auto; padding: 20px 24px;
            border-top: 1px solid var(--border);
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
            display: flex; align-items: center; padding: 0 28px; gap: 16px; position: sticky; top: 0; z-index: 40;
        }
        #topbar .breadcrumb { font-size: 0.8rem; color: var(--muted); }
        #topbar .breadcrumb span { color: var(--gold); }
        #menu-toggle { display: none; background: none; border: none; color: var(--text); cursor: pointer; }

        .page-content { padding: 32px 28px; display: none; }
        .page-content.active { display: block; }

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
        .btn-secondary[disabled] { opacity: 0.4; cursor: not-allowed; }

        /* Image Uploader */
        .img-uploader {
            border: 2px dashed rgba(201,168,76,0.25); border-radius: 10px; padding: 28px;
            text-align: center; cursor: pointer; transition: all 0.2s; position: relative;
            background: var(--darker);
        }
        .img-uploader:hover { border-color: var(--gold); background: rgba(201,168,76,0.03); }
        .img-uploader input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; z-index: 2; }
        .img-uploader .icon { font-size: 2rem; margin-bottom: 8px; pointer-events: none; }
        .img-uploader p { font-size: 0.8rem; color: var(--muted); pointer-events: none; }
        .img-uploader span { color: var(--gold); }

        .preview-box {
            border-radius: 10px; overflow: hidden; border: 1px solid var(--border);
            background: var(--darker); min-height: 140px;
            display: flex; align-items: center; justify-content: center;
        }
        .preview-box img { width: 100%; height: 100%; object-fit: cover; display: none; }
        .preview-box .placeholder { color: var(--muted); font-size: 0.78rem; text-align: center; padding: 20px; }

        /* Carousel Banner Cards */
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

        /* Grid for remove pages */
        .img-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .img-grid-card {
            background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
            overflow: hidden; transition: all 0.25s;
        }
        .img-grid-card:hover { border-color: rgba(255,80,80,0.4); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .img-grid-card .thumb { width: 100%; height: 140px; object-fit: cover; display: block; background: var(--darker); }
        .img-grid-card .thumb-placeholder {
            width: 100%; height: 140px; display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, var(--surface), var(--darker)); color: var(--muted); font-size: 0.75rem;
        }
        .img-grid-card .card-body { padding: 12px 14px; }
        .img-grid-card .card-title { font-size: 0.8rem; font-weight: 600; color: var(--text); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .img-grid-card .card-meta { font-size: 0.72rem; color: var(--muted); margin-bottom: 10px; }
        .img-grid-card .card-actions { display: flex; justify-content: flex-end; }

        /* Checkbox group */
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

        /* Featured checkbox */
        .featured-check { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .featured-check input { accent-color: var(--gold); width: 16px; height: 16px; }
        .featured-check span { font-size: 0.83rem; color: var(--text); }

        /* Page header */
        .page-header { margin-bottom: 28px; }
        .page-header h2 { font-size: 1.5rem; color: var(--text); }
        .page-header p { font-size: 0.83rem; color: var(--muted); margin-top: 5px; }
        .page-header .gold-line { width: 40px; height: 3px; background: linear-gradient(90deg, var(--gold), transparent); border-radius: 2px; margin-top: 10px; }

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
            .form-row.cols-2, .form-row.cols-3, .form-row.cols-4 { grid-template-columns: 1fr; }
            .page-content { padding: 20px 16px; }
            #topbar { padding: 0 16px; }
            .img-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
        }

        /* Overlay */
        #overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 49; }
        #overlay.active { display: block; }

        /* Tag badge */
        .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 0.68rem; font-weight: 600; background: rgba(201,168,76,0.15); color: var(--gold); border: 1px solid rgba(201,168,76,0.25); }

        /* Divider */
        .divider { border: none; border-top: 1px solid var(--border); margin: 24px 0; }
    </style>
</head>
<body>

<!-- Overlay for mobile -->
<div id="overlay" onclick="closeSidebar()"></div>

<!-- Sidebar -->
<aside id="sidebar">
    <div class="logo-area">
        <h1>Alliance Builders</h1>
        <p>Content Management System</p>
    </div>

    <nav style="padding: 16px 0; flex: 1;">
        <div class="nav-section-label">Management</div>

        <!-- Carousel Banner -->
        <div class="nav-item">
            <div class="nav-link" onclick="navigate('carousel')" id="nav-carousel">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M17 12H7M12 7l5 5-5 5"/></svg>
                Carousel Banner
            </div>
        </div>

        <!-- Gallery -->
        <div class="nav-item">
            <div class="nav-link" onclick="toggleMenu('gallery-menu', this)" id="nav-gallery">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                Gallery Image Management
                <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </div>
            <div class="submenu" id="gallery-menu">
                <div class="submenu-link" onclick="navigate('gallery-add')" id="nav-gallery-add">Add Image</div>
                <div class="submenu-link" onclick="navigate('gallery-remove')" id="nav-gallery-remove">Remove Image</div>
            </div>
        </div>

        <!-- Media Coverage -->
        <div class="nav-item">
            <div class="nav-link" onclick="toggleMenu('media-menu', this)" id="nav-media">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 10h16M4 14h10"/><circle cx="18" cy="17" r="3"/><path d="M20.2 19.2L22 21"/></svg>
                Media Coverage Management
                <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </div>
            <div class="submenu" id="media-menu">
                <div class="submenu-link" onclick="navigate('media-add')" id="nav-media-add">Add Image</div>
                <div class="submenu-link" onclick="navigate('media-remove')" id="nav-media-remove">Remove Image</div>
            </div>
        </div>

        <!-- Project Info -->
        <div class="nav-item">
            <div class="nav-link" onclick="toggleMenu('project-menu', this)" id="nav-project">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21h18M9 21V9l3-6 3 6v12M5 21V12l-2-2M19 21V12l2-2"/><path d="M9 12h6"/></svg>
                Project Info Management
                <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </div>
            <div class="submenu" id="project-menu">
                <div class="submenu-link" onclick="navigate('project-add')" id="nav-project-add">Add Project</div>
                <div class="submenu-link" onclick="navigate('project-update')" id="nav-project-update">Update Project</div>
                <div class="submenu-link" onclick="navigate('project-remove')" id="nav-project-remove">Remove Project</div>
            </div>
        </div>
    </nav>

    <div class="logout-btn">
        <button onclick="confirmLogout()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
        </button>
    </div>
</aside>

<!-- Main Content -->
<div id="main">
    <!-- Topbar -->
    <header id="topbar">
        <button id="menu-toggle" onclick="toggleSidebar()">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div style="flex:1;">
            <div class="breadcrumb" id="breadcrumb">Dashboard / <span>Carousel Banner</span></div>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--gold),#8A5A00);display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;color:#0F1117;">AB</div>
        </div>
    </header>

    <!-- ==================== PAGE: CAROUSEL BANNER ==================== -->
    <div class="page-content active" id="page-carousel">
        <div class="page-header">
            <h2>Carousel Banner Management</h2>
            <p>Manage the 5 homepage carousel banner images</p>
            <div class="gold-line"></div>
        </div>

        <script>
            const carouselNums = ['1st','2nd','3rd','4th','5th'];
        </script>

        <!-- Banner Cards -->
        <div id="carousel-banners"></div>
    </div>

    <!-- ==================== PAGE: GALLERY ADD ==================== -->
    <div class="page-content" id="page-gallery-add">
        <div class="page-header">
            <h2>Add Gallery Image</h2>
            <p>Upload a new image to the gallery</p>
            <div class="gold-line"></div>
        </div>
        <div class="section-card">
            <div class="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg>
                Image Details
            </div>
            <form onsubmit="return false;">
                <div class="form-row cols-2">
                    <div class="form-group">
                        <label>Gallery Type</label>
                        <select>
                            <option value="">Select Gallery Type</option>
                            <option>Residential</option>
                            <option>Commercial</option>
                            <option>Interior</option>
                            <option>Exterior</option>
                            <option>Construction</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Media Type</label>
                        <select>
                            <option value="">Select Media Type</option>
                            <option>Image</option>
                            <option>Render</option>
                            <option>Architectural Drawing</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" placeholder="Enter image title...">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea placeholder="Enter image description..."></textarea>
                </div>
                <div class="form-row cols-2" style="align-items:start;">
                    <div class="form-group">
                        <label>Upload Image</label>
                        <div class="img-uploader">
                            <input type="file" accept="image/*" onchange="previewImage(this, 'gallery-preview')">
                            <div class="icon">🖼️</div>
                            <p>Drag & drop or <span>browse</span></p>
                            <p style="margin-top:4px;font-size:0.72rem;">JPG, PNG, WEBP up to 10MB</p>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Preview</label>
                        <div class="preview-box" style="height:155px;" id="gallery-preview">
                            <div class="placeholder">📷<br>No image selected</div>
                        </div>
                    </div>
                </div>
                <div style="display:flex;gap:12px;margin-top:8px;">
                    <button class="btn-primary" type="submit">Upload Image</button>
                    <button class="btn-secondary" type="reset">Reset</button>
                </div>
            </form>
        </div>
    </div>

    <!-- ==================== PAGE: GALLERY REMOVE ==================== -->
    <div class="page-content" id="page-gallery-remove">
        <div class="page-header">
            <h2>Remove Gallery Images</h2>
            <p>Select and delete images from the gallery</p>
            <div class="gold-line"></div>
        </div>
        <div class="section-card">
            <div class="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                Existing Gallery Images
                <span class="badge" style="margin-left:auto;">8 Images</span>
            </div>
            <div class="img-grid" id="gallery-remove-grid"></div>
        </div>
    </div>

    <!-- ==================== PAGE: MEDIA ADD ==================== -->
    <div class="page-content" id="page-media-add">
        <div class="page-header">
            <h2>Add Media Coverage</h2>
            <p>Upload a new media coverage entry</p>
            <div class="gold-line"></div>
        </div>
        <div class="section-card">
            <div class="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 10h16M4 14h10"/></svg>
                Media Details
            </div>
            <form onsubmit="return false;">
                <div class="form-row cols-2">
                    <div class="form-group">
                        <label>Media Title</label>
                        <input type="text" placeholder="Enter media title...">
                    </div>
                    <div class="form-group">
                        <label>Media Type</label>
                        <select>
                            <option value="">Select Media Type</option>
                            <option>Newspaper</option>
                            <option>Online Portal</option>
                            <option>Television</option>
                            <option>Magazine</option>
                            <option>Blog</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Hyperlink</label>
                    <input type="url" placeholder="https://example.com/article...">
                </div>
                <div class="form-group">
                    <label class="featured-check">
                        <input type="checkbox">
                        <span>Mark as Featured Media</span>
                    </label>
                </div>
                <div class="form-row cols-2" style="align-items:start;">
                    <div class="form-group">
                        <label>Upload Image</label>
                        <div class="img-uploader">
                            <input type="file" accept="image/*" onchange="previewImage(this, 'media-preview')">
                            <div class="icon">📰</div>
                            <p>Drag & drop or <span>browse</span></p>
                            <p style="margin-top:4px;font-size:0.72rem;">JPG, PNG, WEBP up to 10MB</p>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Preview</label>
                        <div class="preview-box" style="height:155px;" id="media-preview">
                            <div class="placeholder">📷<br>No image selected</div>
                        </div>
                    </div>
                </div>
                <div style="display:flex;gap:12px;margin-top:8px;">
                    <button class="btn-primary" type="submit">Add Media Coverage</button>
                    <button class="btn-secondary" type="reset">Reset</button>
                </div>
            </form>
        </div>
    </div>

    <!-- ==================== PAGE: MEDIA REMOVE ==================== -->
    <div class="page-content" id="page-media-remove">
        <div class="page-header">
            <h2>Remove Media Coverage</h2>
            <p>Delete existing media coverage entries</p>
            <div class="gold-line"></div>
        </div>
        <div class="section-card">
            <div class="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 10h16M4 14h10"/></svg>
                Existing Media Entries
                <span class="badge" style="margin-left:auto;">6 Entries</span>
            </div>
            <div class="img-grid" id="media-remove-grid"></div>
        </div>
    </div>

    <!-- ==================== PAGE: PROJECT ADD ==================== -->
    <div class="page-content" id="page-project-add">
        <div class="page-header">
            <h2>Add New Project</h2>
            <p>Fill in project details to add a new listing</p>
            <div class="gold-line"></div>
        </div>
        <form onsubmit="return false;">

            <!-- Project Info -->
            <div class="section-card">
                <div class="section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21h18M9 21V9l3-6 3 6v12"/></svg>
                    Project Info
                </div>
                <div class="form-row cols-2">
                    <div class="form-group">
                        <label>Project Type</label>
                        <select>
                            <option value="">Select Project Type</option>
                            <option>Residential</option>
                            <option>Commercial</option>
                            <option>Mixed Use</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Project Location</label>
                        <select>
                            <option value="">Select Location</option>
                            <option>Gulshan</option>
                            <option>Banani</option>
                            <option>Bashundhara</option>
                            <option>Dhanmondi</option>
                            <option>Uttara</option>
                            <option>Mirpur</option>
                            <option>Mohakhali</option>
                        </select>
                    </div>
                </div>
                <div class="form-row cols-3">
                    <div class="form-group">
                        <label>Project ID</label>
                        <input type="text" placeholder="e.g. ABL-2024-001">
                    </div>
                    <div class="form-group">
                        <label>Project Name</label>
                        <input type="text" placeholder="Enter project name...">
                    </div>
                    <div class="form-group">
                        <label>Full Address</label>
                        <input type="text" placeholder="Full address...">
                    </div>
                </div>
                <div class="form-row cols-2">
                    <div class="form-group">
                        <label>Google Map URL</label>
                        <input type="url" placeholder="https://maps.google.com/...">
                    </div>
                    <div class="form-group">
                        <label>YouTube Video ID</label>
                        <input type="text" placeholder="e.g. dQw4w9WgXcQ">
                    </div>
                </div>
                <div class="form-row cols-3">
                    <div class="form-group">
                        <label>Price (BDT)</label>
                        <input type="text" placeholder="e.g. 1,20,00,000">
                    </div>
                    <div class="form-group">
                        <label>Size (sqft)</label>
                        <input type="text" placeholder="e.g. 1450">
                    </div>
                    <div class="form-group">
                        <label>Number of Floors</label>
                        <input type="number" placeholder="e.g. 12">
                    </div>
                </div>
                <div class="form-row cols-2">
                    <div class="form-group">
                        <label>Construction Start Date</label>
                        <input type="date">
                    </div>
                    <div class="form-group">
                        <label>Handover Date</label>
                        <input type="date">
                    </div>
                </div>
                <div class="form-group">
                    <label class="featured-check">
                        <input type="checkbox">
                        <span>Mark as Feature Project</span>
                    </label>
                </div>
                <div class="form-row cols-2">
                    <div class="form-group">
                        <label>Description</label>
                        <textarea placeholder="Enter project description..." style="min-height:110px;"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Surroundings</label>
                        <textarea placeholder="Describe surroundings and nearby amenities..." style="min-height:110px;"></textarea>
                    </div>
                </div>
            </div>

            <!-- Apartment/Unit Details -->
            <div class="section-card">
                <div class="section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    Apartment / Unit Details
                </div>
                <div class="form-row cols-4">
                    <div class="form-group">
                        <label>Apartment Size (sqft)</label>
                        <input type="text" placeholder="e.g. 1250">
                    </div>
                    <div class="form-group">
                        <label>Bedroom</label>
                        <input type="number" placeholder="e.g. 3">
                    </div>
                    <div class="form-group">
                        <label>Bathroom</label>
                        <input type="number" placeholder="e.g. 2">
                    </div>
                    <div class="form-group">
                        <label>Balcony</label>
                        <input type="number" placeholder="e.g. 1">
                    </div>
                </div>
                <div class="form-row cols-4">
                    <div class="form-group">
                        <label>Kitchen</label>
                        <input type="number" placeholder="e.g. 1">
                    </div>
                    <div class="form-group">
                        <label>Living / Dining</label>
                        <input type="text" placeholder="e.g. Combined">
                    </div>
                    <div class="form-group">
                        <label>Parking</label>
                        <input type="number" placeholder="e.g. 1">
                    </div>
                    <div class="form-group">
                        <label>Garage No.</label>
                        <input type="text" placeholder="e.g. G-12">
                    </div>
                </div>
                <div class="form-row cols-2">
                    <div class="form-group">
                        <label>Garage Size (sqft)</label>
                        <input type="text" placeholder="e.g. 200">
                    </div>
                    <div class="form-group">
                        <label>Apartment Direction</label>
                        <input type="text" placeholder="e.g. South-East facing">
                    </div>
                </div>
            </div>

            <!-- Project Facilities -->
            <div class="section-card">
                <div class="section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    Project Facilities
                </div>
                <div class="checkbox-group" id="facilities-group"></div>
            </div>

            <!-- Project Tags -->
            <div class="section-card">
                <div class="section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                    Project Tags
                </div>
                <div class="checkbox-group" id="tags-group"></div>
            </div>

            <!-- Images -->
            <div class="section-card">
                <div class="section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    Project Images
                </div>
                <!-- Thumbnail -->
                <div style="margin-bottom:24px;">
                    <p style="font-size:0.85rem;font-weight:600;color:var(--text);margin-bottom:14px;">Thumbnail Image <span class="badge">Single</span></p>
                    <div class="form-row cols-2" style="align-items:start;">
                        <div class="form-group">
                            <div class="img-uploader">
                                <input type="file" accept="image/*" onchange="previewImage(this, 'proj-thumb-preview')">
                                <div class="icon">🏗️</div>
                                <p>Upload thumbnail or <span>browse</span></p>
                                <p style="margin-top:4px;font-size:0.72rem;">Recommended: 800×600px</p>
                            </div>
                        </div>
                        <div>
                            <label>Preview</label>
                            <div class="preview-box" style="height:155px;" id="proj-thumb-preview">
                                <div class="placeholder">📷<br>No thumbnail selected</div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr class="divider">
                <!-- Multiple images -->
                <div>
                    <p style="font-size:0.85rem;font-weight:600;color:var(--text);margin-bottom:14px;">Project Gallery Images <span class="badge">Multiple</span></p>
                    <div class="img-uploader" style="padding:40px;">
                        <input type="file" accept="image/*" multiple onchange="previewMultiple(this)">
                        <div class="icon">🗂️</div>
                        <p>Drag & drop or <span>browse multiple images</span></p>
                        <p style="margin-top:4px;font-size:0.72rem;">JPG, PNG, WEBP — select multiple files</p>
                    </div>
                    <div id="multi-preview" style="display:flex;flex-wrap:wrap;gap:10px;margin-top:16px;"></div>
                </div>
            </div>

            <div style="display:flex;gap:12px;padding-bottom:24px;">
                <button class="btn-primary" type="submit">Save Project</button>
                <button class="btn-secondary" type="reset" onclick="clearMultiPreview()">Reset All</button>
            </div>
        </form>
    </div>

    <!-- ==================== PAGE: PROJECT UPDATE ==================== -->
    <div class="page-content" id="page-project-update">
        <div class="page-header">
            <h2>Update Project</h2>
            <p>Select a project to update its information</p>
            <div class="gold-line"></div>
        </div>
        <div class="section-card">
            <div class="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Select Project to Update
            </div>
            <div class="form-row cols-2" style="margin-bottom:24px;">
                <div class="form-group">
                    <label>Project Type</label>
                    <select onchange="onUpdateTypeChange(this)">
                        <option value="">Select Project Type</option>
                        <option>Residential</option>
                        <option>Commercial</option>
                        <option>Mixed Use</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Project Name</label>
                    <select id="update-project-name" onchange="showUpdateFields()">
                        <option value="">Select Project Name</option>
                    </select>
                </div>
            </div>
            <div id="update-fields" style="display:none;">
                <hr class="divider">
                <p style="font-size:0.82rem;color:var(--muted);margin-bottom:20px;padding:10px 14px;background:rgba(201,168,76,0.05);border-left:3px solid var(--gold);border-radius:4px;">
                    Update the fields below and click Save Changes.
                </p>
                <!-- Reuse same structure as Add — collapsed for brevity, expanded here -->
                <div class="section-title" style="font-size:0.9rem;margin-top:0;">Project Info</div>
                <div class="form-row cols-3">
                    <div class="form-group"><label>Project ID</label><input type="text" placeholder="ABL-..."></div>
                    <div class="form-group"><label>Project Name</label><input type="text" placeholder="Project name"></div>
                    <div class="form-group"><label>Full Address</label><input type="text" placeholder="Address..."></div>
                </div>
                <div class="form-row cols-2">
                    <div class="form-group"><label>Price (BDT)</label><input type="text" placeholder="Price..."></div>
                    <div class="form-group"><label>Size (sqft)</label><input type="text" placeholder="Size..."></div>
                </div>
                <div class="form-row cols-3">
                    <div class="form-group"><label>Floors</label><input type="number" placeholder="Floors"></div>
                    <div class="form-group"><label>Construction Start Date</label><input type="date"></div>
                    <div class="form-group"><label>Handover Date</label><input type="date"></div>
                </div>
                <div class="form-row cols-2">
                    <div class="form-group"><label>Google Map URL</label><input type="url" placeholder="Map URL..."></div>
                    <div class="form-group"><label>YouTube Video ID</label><input type="text" placeholder="Video ID..."></div>
                </div>
                <div class="form-group"><label class="featured-check"><input type="checkbox"><span>Mark as Feature Project</span></label></div>
                <div class="form-row cols-2">
                    <div class="form-group"><label>Description</label><textarea placeholder="Description..."></textarea></div>
                    <div class="form-group"><label>Surroundings</label><textarea placeholder="Surroundings..."></textarea></div>
                </div>
                <hr class="divider">
                <div class="section-title" style="font-size:0.9rem;">Apartment / Unit Details</div>
                <div class="form-row cols-4">
                    <div class="form-group"><label>Apartment Size</label><input type="text" placeholder="sqft"></div>
                    <div class="form-group"><label>Bedroom</label><input type="number" placeholder="0"></div>
                    <div class="form-group"><label>Bathroom</label><input type="number" placeholder="0"></div>
                    <div class="form-group"><label>Balcony</label><input type="number" placeholder="0"></div>
                </div>
                <div class="form-row cols-4">
                    <div class="form-group"><label>Kitchen</label><input type="number" placeholder="0"></div>
                    <div class="form-group"><label>Living/Dining</label><input type="text" placeholder="..."></div>
                    <div class="form-group"><label>Parking</label><input type="number" placeholder="0"></div>
                    <div class="form-group"><label>Garage No.</label><input type="text" placeholder="G-..."></div>
                </div>
                <div class="form-row cols-2">
                    <div class="form-group"><label>Garage Size</label><input type="text" placeholder="sqft"></div>
                    <div class="form-group"><label>Apartment Direction</label><input type="text" placeholder="e.g. South-East"></div>
                </div>
                <hr class="divider">
                <div class="section-title" style="font-size:0.9rem;">Project Facilities</div>
                <div class="checkbox-group" id="update-facilities-group"></div>
                <hr class="divider" style="margin-top:20px;">
                <div class="section-title" style="font-size:0.9rem;">Project Tags</div>
                <div class="checkbox-group" id="update-tags-group"></div>
                <hr class="divider" style="margin-top:20px;">
                <div class="section-title" style="font-size:0.9rem;">Project Images</div>
                <div class="form-row cols-2" style="align-items:start;margin-bottom:16px;">
                    <div class="form-group">
                        <label>Update Thumbnail</label>
                        <div class="img-uploader">
                            <input type="file" accept="image/*" onchange="previewImage(this,'upd-thumb-preview')">
                            <div class="icon">🏗️</div>
                            <p>Replace thumbnail or <span>browse</span></p>
                        </div>
                    </div>
                    <div>
                        <label>Preview</label>
                        <div class="preview-box" style="height:155px;" id="upd-thumb-preview">
                            <div class="placeholder">📷<br>Current thumbnail</div>
                        </div>
                    </div>
                </div>
                <label style="margin-bottom:10px;display:block;">Update Project Gallery</label>
                <div class="img-uploader" style="padding:32px;">
                    <input type="file" accept="image/*" multiple onchange="previewMultiple2(this)">
                    <div class="icon">🗂️</div>
                    <p>Add more images or <span>browse</span></p>
                </div>
                <div id="multi-preview-2" style="display:flex;flex-wrap:wrap;gap:10px;margin-top:16px;"></div>
                <div style="display:flex;gap:12px;margin-top:24px;">
                    <button class="btn-primary">Save Changes</button>
                    <button class="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ==================== PAGE: PROJECT REMOVE ==================== -->
    <div class="page-content" id="page-project-remove">
        <div class="page-header">
            <h2>Remove Project</h2>
            <p>Select a project to permanently delete it</p>
            <div class="gold-line"></div>
        </div>
        <div class="section-card">
            <div class="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                Select Project to Delete
            </div>
            <div class="form-row cols-2" style="margin-bottom:24px;">
                <div class="form-group">
                    <label>Project Type</label>
                    <select onchange="onDeleteTypeChange(this)">
                        <option value="">Select Project Type</option>
                        <option>Residential</option>
                        <option>Commercial</option>
                        <option>Mixed Use</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Project Name</label>
                    <select id="delete-project-name" onchange="onDeleteNameChange(this)">
                        <option value="">Select Project Name</option>
                    </select>
                </div>
            </div>
            <div id="delete-warning" style="display:none;padding:16px;background:rgba(255,80,80,0.06);border:1px solid rgba(255,80,80,0.2);border-radius:10px;margin-bottom:20px;">
                <p style="font-size:0.82rem;color:#FF8080;">⚠️ <strong>Warning:</strong> This action is irreversible. All data associated with this project will be permanently deleted.</p>
            </div>
            <button class="btn-danger" id="delete-btn" disabled style="padding:11px 28px;font-size:0.83rem;opacity:0.4;cursor:not-allowed;">
                <span style="margin-right:6px;">🗑️</span> Delete Project
            </button>
        </div>
    </div>

</div><!-- /main -->

<script>
    // ============================
    // Data
    // ============================
    const facilitiesList = [
        'Swimming Pool','Gymnasium','Community Hall','Children Play Area','Rooftop Garden',
        'Generator Backup','Solar Panel','CCTV Security','Intercom System','Fire Safety System',
        'Earthquake Resistant','Passenger Lift','Car Parking','Visitor Parking','Guard House',
        'Water Reservoir','Sewage Treatment','Waste Management','Landscaped Garden','Jogging Track'
    ];
    const tagsList = [
        'Luxury','Affordable','Ready to Move','Under Construction','Pre-Launch',
        'Sea View','Lake View','City View','Eco-Friendly','Smart Home',
        'Pet Friendly','Gated Community','Corner Plot','South Facing','North Facing'
    ];
    const sampleProjects = {
        Residential: ['Emerald Heights','Sapphire Residences','Golden Palace','Royal Garden'],
        Commercial: ['Business Hub Tower','Trade Center One','Commerce Square'],
        'Mixed Use': ['Urban Pulse','City Gateway Complex']
    };
    const galleryItems = [
        {title:'Emerald Heights Lobby',type:'Interior',id:1},
        {title:'Rooftop Pool View',type:'Exterior',id:2},
        {title:'Master Bedroom',type:'Interior',id:3},
        {title:'Building Facade',type:'Exterior',id:4},
        {title:'Gym & Fitness',type:'Interior',id:5},
        {title:'Landscape Garden',type:'Exterior',id:6},
        {title:'Living Room',type:'Render',id:7},
        {title:'Kitchen Design',type:'Render',id:8},
    ];
    const mediaItems = [
        {title:'Daily Star Feature',type:'Newspaper',featured:true,id:1},
        {title:'BD News 24 Report',type:'Online Portal',featured:false,id:2},
        {title:'Channel i Coverage',type:'Television',featured:true,id:3},
        {title:'Property Magazine',type:'Magazine',featured:false,id:4},
        {title:'Real Estate Blog',type:'Blog',featured:false,id:5},
        {title:'Prothom Alo',type:'Newspaper',featured:true,id:6},
    ];

    // ============================
    // Sidebar Navigation
    // ============================
    let currentPage = 'carousel';

    function navigate(page) {
        document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
        document.getElementById('page-'+page).classList.add('active');
        document.querySelectorAll('.nav-link, .submenu-link').forEach(l => l.classList.remove('active'));
        const navEl = document.getElementById('nav-'+page) || document.getElementById('nav-'+page.replace('-','-'));
        if(navEl) navEl.classList.add('active');
        // breadcrumb
        const breadMap = {
            'carousel':'Carousel Banner Management','gallery-add':'Gallery / Add Image','gallery-remove':'Gallery / Remove Image',
            'media-add':'Media Coverage / Add Image','media-remove':'Media Coverage / Remove Image',
            'project-add':'Project Info / Add Project','project-update':'Project Info / Update Project','project-remove':'Project Info / Remove Project'
        };
        document.getElementById('breadcrumb').innerHTML = 'Dashboard / <span>'+breadMap[page]+'</span>';
        currentPage = page;
        closeSidebar();
    }

    function toggleMenu(menuId, el) {
        const menu = document.getElementById(menuId);
        const isOpen = menu.classList.contains('open');
        document.querySelectorAll('.submenu').forEach(m => m.classList.remove('open'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('open'));
        if(!isOpen) { menu.classList.add('open'); el.classList.add('open'); }
    }

    function toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
        document.getElementById('overlay').classList.toggle('active');
    }
    function closeSidebar() {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('active');
    }

    function confirmLogout() {
        if(confirm('Are you sure you want to logout?')) alert('Logged out successfully.');
    }

    // ============================
    // Carousel Banners
    // ============================
    function buildCarouselBanners() {
        const container = document.getElementById('carousel-banners');
        ['1st','2nd','3rd','4th','5th'].forEach((n,i) => {
            const id = 'cb-prev-'+i;
            container.innerHTML += `

    <div class="banner-card">
    <form method="POST" action="" id="form-" enctype="multipart/form-data"
                          class="space-y-6" >
      <span class="banner-num">${n} Banner</span>
      <div class="form-row cols-2" style="align-items:start;margin-top:14px;">
        <div class="form-group">
          <label>Upload Banner Image</label>
          <div class="img-uploader">
            <input type="file" accept="image/*" onchange="previewImage(this,'${id}')">
            <div class="icon">🖼️</div>
            <p>Drag & drop or <span>browse</span></p>
            <p style="margin-top:4px;font-size:0.72rem;">Recommended: 1920×600px</p>
          </div>
        </div>
        <div>
          <label>Preview</label>
          <div class="preview-box" style="height:155px;" id="${id}">
            <div class="placeholder">🖼️<br>No banner selected</div>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:10px;margin-top:12px;">
        <button class="btn-primary" style="padding:9px 22px;font-size:0.8rem;">Save Banner</button>
        <button class="btn-secondary" style="padding:9px 18px;font-size:0.8rem;">Clear</button>
      </div>
      </form>
    </div>`;
        });
    }

    // ============================
    // Image Preview
    // ============================
    function previewImage(input, previewId) {
        const file = input.files[0];
        if(!file) return;
        const preview = document.getElementById(previewId);
        preview.innerHTML = `<img src="${URL.createObjectURL(file)}" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:9px;">`;
    }
    function previewMultiple(input) {
        const container = document.getElementById('multi-preview');
        container.innerHTML = '';
        Array.from(input.files).forEach(file => {
            const url = URL.createObjectURL(file);
            container.innerHTML += `<div style="width:90px;height:70px;border-radius:8px;overflow:hidden;border:1px solid var(--border);flex-shrink:0;">
      <img src="${url}" style="width:100%;height:100%;object-fit:cover;">
    </div>`;
        });
    }
    function previewMultiple2(input) {
        const container = document.getElementById('multi-preview-2');
        container.innerHTML = '';
        Array.from(input.files).forEach(file => {
            const url = URL.createObjectURL(file);
            container.innerHTML += `<div style="width:90px;height:70px;border-radius:8px;overflow:hidden;border:1px solid var(--border);flex-shrink:0;">
      <img src="${url}" style="width:100%;height:100%;object-fit:cover;">
    </div>`;
        });
    }
    function clearMultiPreview() { document.getElementById('multi-preview').innerHTML = ''; }

    // ============================
    // Gallery Remove Grid
    // ============================
    function buildGalleryGrid() {
        const grid = document.getElementById('gallery-remove-grid');
        const colors = ['#1a2a1a','#1a1a2a','#2a1a1a','#1a2a2a','#2a2a1a','#1a1a1a','#2a1a2a','#1a2a1a'];
        galleryItems.forEach((item,i) => {
            grid.innerHTML += `
    <div class="img-grid-card" id="gallery-card-${item.id}">
      <div class="thumb-placeholder" style="background:linear-gradient(135deg,${colors[i]},var(--darker));">
        <span style="font-size:1.6rem;">🖼️</span>
      </div>
      <div class="card-body">
        <div class="card-title">${item.title}</div>
        <div class="card-meta"><span class="badge">${item.type}</span></div>
        <div class="card-actions">
          <button class="btn-danger" onclick="deleteGalleryItem(${item.id})">🗑️ Delete</button>
        </div>
      </div>
    </div>`;
        });
    }
    function deleteGalleryItem(id) {
        if(confirm('Delete this gallery image? This cannot be undone.')) {
            const card = document.getElementById('gallery-card-'+id);
            card.style.transform = 'scale(0.8)'; card.style.opacity = '0'; card.style.transition = '0.3s';
            setTimeout(()=>card.remove(), 300);
        }
    }

    // ============================
    // Media Remove Grid
    // ============================
    function buildMediaGrid() {
        const grid = document.getElementById('media-remove-grid');
        const types = { Newspaper:'📰', 'Online Portal':'🌐', Television:'📺', Magazine:'📖', Blog:'✍️' };
        mediaItems.forEach(item => {
            grid.innerHTML += `
    <div class="img-grid-card" id="media-card-${item.id}">
      <div class="thumb-placeholder" style="background:linear-gradient(135deg,#1a1e2a,#0f1117);font-size:2.5rem;">
        ${types[item.type]||'📄'}
      </div>
      <div class="card-body">
        <div class="card-title">${item.title}</div>
        <div class="card-meta" style="display:flex;gap:6px;flex-wrap:wrap;">
          <span class="badge">${item.type}</span>
          ${item.featured?'<span class="badge" style="background:rgba(201,168,76,0.25);border-color:var(--gold);">⭐ Featured</span>':''}
        </div>
        <div class="card-actions" style="margin-top:8px;">
          <button class="btn-danger" onclick="deleteMediaItem(${item.id})">🗑️ Delete</button>
        </div>
      </div>
    </div>`;
        });
    }
    function deleteMediaItem(id) {
        if(confirm('Delete this media entry? This cannot be undone.')) {
            const card = document.getElementById('media-card-'+id);
            card.style.transform='scale(0.8)';card.style.opacity='0';card.style.transition='0.3s';
            setTimeout(()=>card.remove(),300);
        }
    }

    // ============================
    // Checkboxes
    // ============================
    function buildCheckboxes(containerId, items) {
        const container = document.getElementById(containerId);
        items.forEach(item => {
            const div = document.createElement('label');
            div.className = 'checkbox-item';
            div.innerHTML = `<input type="checkbox" onchange="toggleChecked(this)"> ${item}`;
            container.appendChild(div);
        });
    }
    function toggleChecked(input) {
        input.parentElement.classList.toggle('checked', input.checked);
    }

    // ============================
    // Project Update/Delete Logic
    // ============================
    function onUpdateTypeChange(sel) {
        const nameSelect = document.getElementById('update-project-name');
        nameSelect.innerHTML = '<option value="">Select Project Name</option>';
        document.getElementById('update-fields').style.display = 'none';
        const projects = sampleProjects[sel.value] || [];
        projects.forEach(p => nameSelect.innerHTML += `<option>${p}</option>`);
    }
    function showUpdateFields() {
        const sel = document.getElementById('update-project-name');
        document.getElementById('update-fields').style.display = sel.value ? 'block' : 'none';
    }

    function onDeleteTypeChange(sel) {
        const nameSelect = document.getElementById('delete-project-name');
        nameSelect.innerHTML = '<option value="">Select Project Name</option>';
        document.getElementById('delete-warning').style.display = 'none';
        const btn = document.getElementById('delete-btn');
        btn.disabled = true; btn.style.opacity='0.4'; btn.style.cursor='not-allowed';
        const projects = sampleProjects[sel.value] || [];
        projects.forEach(p => nameSelect.innerHTML += `<option>${p}</option>`);
    }
    function onDeleteNameChange(sel) {
        const hasValue = !!sel.value;
        document.getElementById('delete-warning').style.display = hasValue ? 'block' : 'none';
        const btn = document.getElementById('delete-btn');
        btn.disabled = !hasValue;
        btn.style.opacity = hasValue ? '1' : '0.4';
        btn.style.cursor = hasValue ? 'pointer' : 'not-allowed';
        if(hasValue) {
            btn.onclick = () => {
                if(confirm(`Permanently delete "${sel.value}"?`)) {
                    alert('Project deleted successfully.');
                    document.getElementById('delete-warning').style.display='none';
                    sel.innerHTML='<option value="">Select Project Name</option>';
                    btn.disabled=true;btn.style.opacity='0.4';btn.style.cursor='not-allowed';
                }
            };
        }
    }

    // ============================
    // Init
    // ============================
    buildCarouselBanners();
    buildGalleryGrid();
    buildMediaGrid();
    buildCheckboxes('facilities-group', facilitiesList);
    buildCheckboxes('tags-group', tagsList);
    buildCheckboxes('update-facilities-group', facilitiesList);
    buildCheckboxes('update-tags-group', tagsList);
    navigate('carousel');
</script>
</body>
</html>