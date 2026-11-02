import { Link, router, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { route } from 'ziggy-js';

interface Props {
    children: ReactNode;
    title?: string;
    breadcrumb?: string;
}

interface AuthUser {
    name: string;
}

interface PageProps {
    auth: { user: AuthUser };
    flash?: { success?: string; error?: string };
}

function NavIcon({ children }: { children: ReactNode }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            style={{ width: 16, height: 16, flexShrink: 0 }}
        >
            {children}
        </svg>
    );
}

export default function CMSLayout({
    children,
    title = 'CMS',
    breadcrumb = 'Dashboard',
}: Props) {
    // @ts-ignore
    const { auth, flash } = usePage<PageProps>().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);

    const currentRoute = (name: string) => {
        try {
            return route().current(name);
        } catch {
            return false;
        }
    };

    // Auto-open active submenu
    useEffect(() => {
        const menus: Record<string, boolean> = {};
        if (currentRoute('gallery-*')) menus['gallery'] = true;
        if (currentRoute('media-*')) menus['media'] = true;
        if (currentRoute('property-*')) menus['property'] = true;
        if (currentRoute('facility-*') || currentRoute('tag-*'))
            menus['config'] = true;
        setOpenMenus(menus);
    }, []);

    // Flash toast
    useEffect(() => {
        if (flash?.success) {
            setToast({ message: flash.success, type: 'success' });
        } else if (flash?.error) {
            setToast({ message: flash.error, type: 'error' });
        }
    }, [flash]);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(t);
    }, [toast]);

    const toggleMenu = (key: string) => {
        setOpenMenus((prev) => {
            const isOpen = prev[key];
            const next: Record<string, boolean> = {};
            if (!isOpen) next[key] = true;
            return next;
        });
    };

    const userInitials = (auth?.user?.name ?? 'AB').slice(0, 2).toUpperCase();

    return (
        <>
            <style>{`
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
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--dark); }
        ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }

        .cms-sidebar {
          width: 280px; background: var(--dark);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          transition: transform 0.3s ease;
          position: fixed; top: 0; left: 0; z-index: 50;
          height: 100vh; overflow-y: auto;
        }
        .cms-sidebar.open { transform: translateX(0) !important; }

        .nav-link-base {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 24px; font-size: 0.82rem; font-weight: 500;
          color: var(--muted); cursor: pointer; transition: all 0.2s;
          border-left: 3px solid transparent; text-decoration: none;
          user-select: none; background: none; border-top: none; border-right: none; border-bottom: none;
          width: 100%; font-family: 'DM Sans', sans-serif;
        }
        .nav-link-base:hover { color: var(--text); background: rgba(201,168,76,0.05); }
        .nav-link-active { color: var(--gold) !important; border-left-color: var(--gold) !important; background: rgba(201,168,76,0.08) !important; }

        .submenu { overflow: hidden; max-height: 0; transition: max-height 0.3s ease; }
        .submenu.open { max-height: 400px; }

        .submenu-link {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 24px 9px 52px; font-size: 0.78rem;
          color: var(--muted); cursor: pointer; transition: all 0.2s;
          text-decoration: none;
        }
        .submenu-link:hover { color: var(--text); background: rgba(201,168,76,0.04); }
        .submenu-link-active { color: var(--gold-light) !important; }
        .submenu-link::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

        .cms-main { margin-left: 280px; min-height: 100vh; transition: margin 0.3s; }
        .cms-topbar {
          height: 60px; background: var(--dark); border-bottom: 1px solid var(--border);
          display: flex; align-items: center; padding: 0 28px; gap: 16px;
          position: sticky; top: 0; z-index: 40;
        }
        .page-content { padding: 32px 28px; }

        .section-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 28px; margin-bottom: 24px; }
        .section-title { font-size: 1.05rem; color: var(--gold); margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
        .section-title svg { width: 18px; height: 18px; }

        label { font-size: 0.78rem; color: var(--muted); display: block; margin-bottom: 6px; font-weight: 500; letter-spacing: 0.02em; }
        input[type="text"], input[type="url"], input[type="date"], input[type="number"],
        textarea, select {
          width: 100%; background: var(--darker); border: 1px solid rgba(201,168,76,0.2);
          border-radius: 8px; padding: 10px 14px; color: var(--text);
          font-size: 0.83rem; font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s; outline: none;
        }
        input:focus, textarea:focus, select:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,0.1); }
        select option { background: var(--surface); }
        textarea { resize: vertical; min-height: 90px; }

        .form-group { margin-bottom: 18px; }
        .form-row { display: grid; gap: 16px; }
        .cols-2 { grid-template-columns: 1fr 1fr; }
        .cols-3 { grid-template-columns: 1fr 1fr 1fr; }
        .cols-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }

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

        .img-uploader {
          border: 2px dashed rgba(201,168,76,0.25); border-radius: 10px; padding: 28px;
          text-align: center; transition: all 0.2s; position: relative;
          background: var(--darker); cursor: pointer;
        }
        .img-uploader:hover { border-color: var(--gold); background: rgba(201,168,76,0.03); }
        .uploader-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; z-index: 2; }

        .preview-box {
          border-radius: 10px; overflow: hidden; border: 1px solid var(--border);
          background: var(--darker); min-height: 140px;
          display: flex; align-items: center; justify-content: center;
        }

        .img-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .img-grid-card {
          background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
          overflow: hidden; transition: all 0.25s;
        }
        .img-grid-card:hover { border-color: rgba(255,80,80,0.4); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }

        .checkbox-group { display: flex; flex-wrap: wrap; gap: 10px; }
        .checkbox-item {
          display: flex; align-items: center; gap: 7px;
          background: var(--darker); border: 1px solid rgba(201,168,76,0.15);
          border-radius: 7px; padding: 7px 12px; cursor: pointer;
          transition: all 0.2s; font-size: 0.78rem; color: var(--muted); user-select: none;
        }
        .checkbox-item:hover { border-color: var(--gold); color: var(--text); }
        .checkbox-item.checked { border-color: var(--gold); background: rgba(201,168,76,0.08); color: var(--gold-light); }
        .checkbox-item input { accent-color: var(--gold); width: 14px; height: 14px; }

        .featured-check { display: inline-flex; align-items: center; gap: 10px; cursor: pointer; }
        .featured-check input { accent-color: var(--gold); width: 16px; height: 16px; }
        .featured-check span { font-size: 0.83rem; color: var(--text); }

        .page-header { margin-bottom: 28px; }
        .page-header h2 { font-size: 1.5rem; color: var(--text); }
        .page-header p { font-size: 0.83rem; color: var(--muted); margin-top: 5px; }
        .gold-line { width: 40px; height: 3px; background: linear-gradient(90deg, var(--gold), transparent); border-radius: 2px; margin-top: 10px; }

        .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 0.68rem; font-weight: 600; background: rgba(201,168,76,0.15); color: var(--gold); border: 1px solid rgba(201,168,76,0.25); }

        .banner-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 22px; margin-bottom: 20px; position: relative; transition: border-color 0.2s; }
        .banner-card:hover { border-color: rgba(201,168,76,0.35); }
        .banner-num { position: absolute; top: -12px; left: 20px; background: linear-gradient(135deg, var(--gold), #A8782A); color: #0F1117; font-size: 0.7rem; font-weight: 700; padding: 3px 14px; border-radius: 20px; letter-spacing: 0.08em; }

        .h-10 { height: 40px; }

        .toggle-switch { display: flex; align-items: center; gap: 14px; cursor: pointer; user-select: none; }
        .toggle-slider { position: relative; width: 52px; height: 28px; background: var(--surface2); border: 1px solid rgba(201,168,76,0.2); border-radius: 34px; transition: all 0.3s ease; flex-shrink: 0; }
        .toggle-slider::after { content: ''; position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; background: var(--muted); border-radius: 50%; transition: all 0.3s ease; }
        .toggle-slider.on { background: rgba(201,168,76,0.2); border-color: var(--gold); }
        .toggle-slider.on::after { left: 27px; background: var(--gold); }
        .toggle-label { font-size: 0.85rem; font-weight: 600; color: var(--muted); transition: color 0.3s; min-width: 60px; }
        .toggle-label.on { color: var(--gold); }

        .flash-toast {
          position: fixed; bottom: 24px; right: 24px;
          padding: 12px 20px; border-radius: 10px;
          font-size: 0.82rem; z-index: 999;
          animation: slideUp 0.3s ease;
        }
        .flash-success { background: rgba(50,180,100,0.15); border: 1px solid rgba(50,180,100,0.4); color: #80FFB0; }
        .flash-error { background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.3); color: #FF8080; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        .cms-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 49; }
        .cms-overlay.active { display: block; }

        @media (max-width: 900px) {
          .cms-sidebar { transform: translateX(-100%); }
          .cms-main { margin-left: 0 !important; }
          .menu-toggle-btn { display: block !important; }
          .cols-4 { grid-template-columns: 1fr 1fr !important; }
          .cols-3 { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .cols-2, .cols-3, .cols-4 { grid-template-columns: 1fr !important; }
          .page-content { padding: 20px 16px; }
          .cms-topbar { padding: 0 16px; }
          .img-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
        }
      `}</style>

            <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            {/* Mobile Overlay */}
            <div
                className={`cms-overlay ${sidebarOpen ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`cms-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div
                    style={{
                        padding: '28px 24px 20px',
                        borderBottom: '1px solid var(--border)',
                        flexShrink: 0,
                    }}
                >
                    <h1
                        style={{
                            fontSize: '1.1rem',
                            color: 'var(--gold)',
                            lineHeight: 1.2,
                        }}
                    >
                        Alliance Builders
                    </h1>
                    <p
                        style={{
                            fontSize: '0.7rem',
                            color: 'var(--muted)',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            marginTop: 4,
                        }}
                    >
                        Content Management System
                    </p>
                </div>

                <nav style={{ padding: '16px 0', flex: 1 }}>
                    <div
                        style={{
                            padding: '16px 24px 6px',
                            fontSize: '0.65rem',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: 'var(--muted)',
                            opacity: 0.6,
                        }}
                    >
                        Management
                    </div>

                    {/* Carousel Banner */}
                    <div>
                        <Link
                            href={route('dashboard')}
                            className={`nav-link-base ${currentRoute('dashboard') ? 'nav-link-active' : ''}`}
                        >
                            <NavIcon>
                                <rect
                                    x="2"
                                    y="6"
                                    width="20"
                                    height="12"
                                    rx="2"
                                />
                                <path d="M17 12H7M12 7l5 5-5 5" />
                            </NavIcon>
                            Carousel Banner
                        </Link>
                    </div>

                    {/* Gallery */}
                    <div>
                        <button
                            className={`nav-link-base ${currentRoute('gallery-*') ? 'nav-link-active' : ''}`}
                            onClick={() => toggleMenu('gallery')}
                        >
                            <NavIcon>
                                <rect
                                    x="3"
                                    y="3"
                                    width="18"
                                    height="18"
                                    rx="2"
                                />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="M21 15l-5-5L5 21" />
                            </NavIcon>
                            Gallery Image
                            <svg
                                style={{
                                    marginLeft: 'auto',
                                    width: 14,
                                    height: 14,
                                    transition: 'transform 0.25s',
                                    transform: openMenus['gallery']
                                        ? 'rotate(90deg)'
                                        : 'none',
                                }}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                        <div
                            className={`submenu ${openMenus['gallery'] ? 'open' : ''}`}
                        >
                            <Link
                                href={route('gallery-add')}
                                className={`submenu-link ${currentRoute('gallery-add') ? 'submenu-link-active' : ''}`}
                            >
                                Add Image
                            </Link>
                            <Link
                                href={route('gallery-remove')}
                                className={`submenu-link ${currentRoute('gallery-remove') ? 'submenu-link-active' : ''}`}
                            >
                                Remove Image
                            </Link>
                        </div>
                    </div>

                    {/* Media Coverage */}
                    <div>
                        <button
                            className={`nav-link-base ${currentRoute('media-*') ? 'nav-link-active' : ''}`}
                            onClick={() => toggleMenu('media')}
                        >
                            <NavIcon>
                                <path d="M4 6h16M4 10h16M4 14h10" />
                                <circle cx="18" cy="17" r="3" />
                                <path d="M20.2 19.2L22 21" />
                            </NavIcon>
                            Media Coverage
                            <svg
                                style={{
                                    marginLeft: 'auto',
                                    width: 14,
                                    height: 14,
                                    transition: 'transform 0.25s',
                                    transform: openMenus['media']
                                        ? 'rotate(90deg)'
                                        : 'none',
                                }}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                        <div
                            className={`submenu ${openMenus['media'] ? 'open' : ''}`}
                        >
                            <Link
                                href={route('media-add')}
                                className={`submenu-link ${currentRoute('media-add') ? 'submenu-link-active' : ''}`}
                            >
                                Add Media
                            </Link>
                            <Link
                                href={route('media-edit')}
                                className={`submenu-link ${currentRoute('media-edit') ? 'submenu-link-active' : ''}`}
                            >
                                Edit Media
                            </Link>
                            <Link
                                href={route('media-remove')}
                                className={`submenu-link ${currentRoute('media-remove') ? 'submenu-link-active' : ''}`}
                            >
                                Remove Media
                            </Link>
                        </div>
                    </div>

                    {/* Properties */}
                    <div>
                        <button
                            className={`nav-link-base ${currentRoute('property-*') ? 'nav-link-active' : ''}`}
                            onClick={() => toggleMenu('property')}
                        >
                            <NavIcon>
                                <path d="M3 21h18M9 21V9l3-6 3 6v12M5 21V12l-2-2M19 21V12l2-2" />
                                <path d="M9 12h6" />
                            </NavIcon>
                            Properties
                            <svg
                                style={{
                                    marginLeft: 'auto',
                                    width: 14,
                                    height: 14,
                                    transition: 'transform 0.25s',
                                    transform: openMenus['property']
                                        ? 'rotate(90deg)'
                                        : 'none',
                                }}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                        <div
                            className={`submenu ${openMenus['property'] ? 'open' : ''}`}
                        >
                            <Link
                                href={route('property-add')}
                                className={`submenu-link ${currentRoute('property-add') ? 'submenu-link-active' : ''}`}
                            >
                                Add Property
                            </Link>
                            <Link
                                href={route('property-update')}
                                className={`submenu-link ${currentRoute('property-update') ? 'submenu-link-active' : ''}`}
                            >
                                Update Property
                            </Link>
                            <Link
                                href={route('property-remove')}
                                className={`submenu-link ${currentRoute('property-remove') ? 'submenu-link-active' : ''}`}
                            >
                                Remove Property
                            </Link>
                        </div>
                    </div>

                    {/* Pop-up Settings */}
                    <div>
                        <Link
                            href={route('popup-add')}
                            className={`nav-link-base ${currentRoute('popup-add') ? 'nav-link-active' : ''}`}
                        >
                            <NavIcon>
                                <rect
                                    x="2"
                                    y="6"
                                    width="20"
                                    height="12"
                                    rx="2"
                                />
                                <path d="M17 12H7M12 7l5 5-5 5" />
                            </NavIcon>
                            Pop-up Settings
                        </Link>
                    </div>

                    {/* Site Settings */}
                    <div>
                        <Link
                            href={route('settings-index')}
                            className={`nav-link-base ${currentRoute('settings-index') ? 'nav-link-active' : ''}`}
                        >
                            <NavIcon>
                                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
                                <path d="M12 8v4l3 3" />
                            </NavIcon>
                            Settings
                        </Link>
                    </div>

                    {/* Testimonial Settings */}
                    <div>
                        <Link
                            href={route('testimonial-index')}
                            className={`nav-link-base ${currentRoute('testimonial-index') ? 'nav-link-active' : ''}`}
                        >
                            <NavIcon>
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </NavIcon>
                            Testimonial Settings
                        </Link>
                    </div>
                    <div>
                        <button
                            className={`nav-link-base ${currentRoute('facility-*') || currentRoute('tag-*') ? 'nav-link-active' : ''}`}
                            onClick={() => toggleMenu('config')}
                        >
                            <NavIcon>
                                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
                                <path d="M12 8v4l3 3" />
                            </NavIcon>
                            Project Configuration
                            <svg
                                style={{
                                    marginLeft: 'auto',
                                    width: 14,
                                    height: 14,
                                    transition: 'transform 0.25s',
                                    transform: openMenus['config']
                                        ? 'rotate(90deg)'
                                        : 'none',
                                }}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                        <div
                            className={`submenu ${openMenus['config'] ? 'open' : ''}`}
                        >
                            {/* Facility Config sub-group label */}
                            <div
                                style={{
                                    padding: '8px 24px 4px 52px',
                                    fontSize: '0.65rem',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    color: 'var(--muted)',
                                    opacity: 0.5,
                                }}
                            >
                                Facility Config
                            </div>
                            <Link
                                href={route('facility-add')}
                                className={`submenu-link ${currentRoute('facility-add') ? 'submenu-link-active' : ''}`}
                            >
                                Add Facility
                            </Link>
                            <Link
                                href={route('facility-update')}
                                className={`submenu-link ${currentRoute('facility-update') ? 'submenu-link-active' : ''}`}
                            >
                                Update Facility
                            </Link>
                            <Link
                                href={route('facility-delete')}
                                className={`submenu-link ${currentRoute('facility-delete') ? 'submenu-link-active' : ''}`}
                            >
                                Delete Facility
                            </Link>

                            {/* Tag Config sub-group label */}
                            <div
                                style={{
                                    padding: '8px 24px 4px 52px',
                                    fontSize: '0.65rem',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    color: 'var(--muted)',
                                    opacity: 0.5,
                                    marginTop: 4,
                                }}
                            >
                                Tag Config
                            </div>
                            <Link
                                href={route('tag-add')}
                                className={`submenu-link ${currentRoute('tag-add') ? 'submenu-link-active' : ''}`}
                            >
                                Add Tag
                            </Link>
                            <Link
                                href={route('tag-update')}
                                className={`submenu-link ${currentRoute('tag-update') ? 'submenu-link-active' : ''}`}
                            >
                                Update Tag
                            </Link>
                            <Link
                                href={route('tag-delete')}
                                className={`submenu-link ${currentRoute('tag-delete') ? 'submenu-link-active' : ''}`}
                            >
                                Delete Tag
                            </Link>
                        </div>
                    </div>
                    <div>
                        <Link
                            href={route('feedback-index')}
                            className={`nav-link-base ${currentRoute('feedback-index') ? 'nav-link-active' : ''}`}
                        >
                            <NavIcon>
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </NavIcon>
                            Incoming Feedback
                        </Link>
                    </div>
                </nav>

                {/* Logout */}
                <div
                    style={{
                        marginTop: 'auto',
                        padding: '20px 24px',
                        borderTop: '1px solid var(--border)',
                        flexShrink: 0,
                    }}
                >
                    <button
                        onClick={() => router.post(route('logout'))}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            width: '100%',
                            padding: '10px 16px',
                            borderRadius: 8,
                            background: 'rgba(255,80,80,0.08)',
                            border: '1px solid rgba(255,80,80,0.2)',
                            color: '#FF8080',
                            fontSize: '0.82rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="cms-main" style={{ marginLeft: 280 }}>
                {/* Topbar */}
                <header className="cms-topbar">
                    <button
                        className="menu-toggle-btn"
                        style={{
                            display: 'none',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text)',
                            cursor: 'pointer',
                        }}
                        onClick={() => setSidebarOpen((v) => !v)}
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <div
                        style={{
                            fontSize: '0.8rem',
                            color: 'var(--muted)',
                            flex: 1,
                        }}
                    >
                        Dashboard /{' '}
                        <span style={{ color: 'var(--gold)' }}>
                            {breadcrumb}
                        </span>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        <div
                            style={{
                                width: 34,
                                height: 34,
                                borderRadius: '50%',
                                background:
                                    'linear-gradient(135deg,var(--gold),#8A5A00)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: '#0F1117',
                            }}
                        >
                            {userInitials}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="page-content">{children}</div>
            </div>

            {/* Flash Toast */}
            {toast && (
                <div
                    className={`flash-toast ${toast.type === 'success' ? 'flash-success' : 'flash-error'}`}
                >
                    {toast.type === 'success' ? '✅' : '❌'} {toast.message}
                </div>
            )}

            <title>{title} — Alliance Builders Limited</title>
        </>
    );
}
