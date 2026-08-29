<aside id="sidebar">
    <div class="logo-area">
        <h1>Alliance Builders</h1>
        <p>Content Management System</p>
    </div>

    <nav style="padding: 16px 0; flex: 1;">
        <div class="nav-section-label">Management</div>

        {{-- Carousel Banner --}}
        <div class="nav-item">
            <a href="{{route('dashboard')}}" {{-- replace # with route('carousel.index') --}}
            class="nav-link {{ Request::routeIs('dashboard') ? 'active' : '' }}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="2" y="6" width="20" height="12" rx="2"/>
                    <path d="M17 12H7M12 7l5 5-5 5"/>
                </svg>
                Carousel Banner
            </a>
        </div>

        {{-- Gallery Image Management --}}
        <div class="nav-item">
            <div class="nav-link {{ Request::routeIs('gallery-*') ? 'active open' : '' }}"
                 onclick="toggleMenu('gallery-menu', this)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                </svg>
                Gallery Image Management
                <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </div>
            <div class="submenu {{ Request::routeIs('gallery-*') ? 'open' : '' }}" id="gallery-menu">
                <a href="{{route('gallery-add')}}" {{-- replace # with route('gallery.add') --}}
                class="submenu-link {{ Request::routeIs('gallery-add') ? 'active' : '' }}">
                    Add Image
                </a>
                <a href="{{route('gallery-remove')}}" {{-- replace # with route('gallery.remove') --}}
                class="submenu-link {{ Request::routeIs('gallery-remove') ? 'active' : '' }}">
                    Remove Image
                </a>
            </div>
        </div>

        {{-- Media Coverage Management --}}
        <div class="nav-item">
            <div class="nav-link {{ Request::routeIs('media-*') ? 'active open' : '' }}"
                 onclick="toggleMenu('media-menu', this)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M4 6h16M4 10h16M4 14h10"/>
                    <circle cx="18" cy="17" r="3"/>
                    <path d="M20.2 19.2L22 21"/>
                </svg>
                Media Coverage Management
                <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </div>
            <div class="submenu {{ Request::routeIs('media-*') ? 'open' : '' }}" id="media-menu">
                <a href="{{route('media-add')}}" {{-- replace # with route('media.add') --}}
                class="submenu-link {{ Request::routeIs('media-add') ? 'active' : '' }}">
                    Add Image
                </a>
                <a href="{{route('media-remove')}}" {{-- replace # with route('media.remove') --}}
                class="submenu-link {{ Request::routeIs('media-remove') ? 'active' : '' }}">
                    Remove Image
                </a>
            </div>
        </div>

        {{-- Project Info Management --}}
        <div class="nav-item">
            <div class="nav-link {{ Request::routeIs('project-*') ? 'active open' : '' }}"
                 onclick="toggleMenu('project-menu', this)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M3 21h18M9 21V9l3-6 3 6v12M5 21V12l-2-2M19 21V12l2-2"/>
                    <path d="M9 12h6"/>
                </svg>
                Project Info Management
                <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </div>
            <div class="submenu {{ Request::routeIs('project-*') ? 'open' : '' }}" id="project-menu">
                <a href="{{route('project-add')}}" {{-- replace # with route('project.add') --}}
                class="submenu-link {{ Request::routeIs('project-add') ? 'active' : '' }}">
                    Add Project
                </a>
                <a href="{{route('project-update')}}" {{-- replace # with route('project.update') --}}
                class="submenu-link {{ Request::routeIs('project-update') ? 'active' : '' }}">
                    Update Project
                </a>
                <a href="{{route('project-remove')}}" {{-- replace # with route('project.remove') --}}
                class="submenu-link {{ Request::routeIs('project-remove') ? 'active' : '' }}">
                    Remove Project
                </a>
            </div>
        </div>

        <div class="nav-item">
            <a href="{{route('popup-add')}}" {{-- replace # with route('carousel.index') --}}
            class="nav-link {{ Request::routeIs('popup-add') ? 'active' : '' }}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="2" y="6" width="20" height="12" rx="2"/>
                    <path d="M17 12H7M12 7l5 5-5 5"/>
                </svg>
                Pop-up Settings
            </a>
        </div>

    </nav>

    {{-- Logout --}}
    <div class="logout-btn">
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
            </button>
        </form>
    </div>
</aside>

<script>
    function toggleMenu(menuId, el) {
        const menu = document.getElementById(menuId);
        const isOpen = menu.classList.contains('open');
        document.querySelectorAll('.submenu').forEach(m => m.classList.remove('open'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('open'));
        if (!isOpen) {
            menu.classList.add('open');
            el.classList.add('open');
        }
    }

    // Auto-open active submenu on page load
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.submenu').forEach(menu => {
            if (menu.classList.contains('open')) {
                const parentLink = menu.previousElementSibling;
                if (parentLink) parentLink.classList.add('open');
            }
        });
    });
</script>
