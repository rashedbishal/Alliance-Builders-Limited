import { Link, usePage } from '@inertiajs/react';
import {ChevronDown, Menu, X, Phone, Heart} from 'lucide-react';
import React, {useState, useRef, useEffect} from 'react';
import logo from '@/assets/images/logo/alliance logo.webp'
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {useFavorites} from '@/hooks/useFavorites';
import {about, directors, home, services, managingDirector, contact, media, gallery, properties} from "@/routes";

const Navbar = () => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
    const [rotation, setRotation] = useState({x: 0, y: 0});
    const navRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const { favorites } = useFavorites();
    const { navHotels } = usePage<{
        navHotels?: { id: number; name: string; slug: string }[];
    }>().props;

    const buttonRef = useRef<HTMLButtonElement>(null);

    // 3D tilt effect on mouse move
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!navRef.current) return;

            const rect = navRef.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);

            setRotation({
                x: dy * -.5,
                y: dx * .5
            });
        };

        const handleMouseLeave = () => {
            setRotation({x: 0, y: 0});
        };

        const wrapper = navRef.current?.parentElement;
        wrapper?.addEventListener('mousemove', handleMouseMove);
        wrapper?.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            wrapper?.removeEventListener('mousemove', handleMouseMove);
            wrapper?.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!isMobileMenuOpen) return;

            const mobileMenu = mobileMenuRef.current;
            const navContainer = navRef.current;
            const buttonElement = buttonRef.current; // Get the button ref
            const target = e.target as Node;

            if (
                mobileMenu &&
                !mobileMenu.contains(target) &&
                navContainer &&
                !navContainer.contains(target) &&
                buttonElement && !buttonElement.contains(target) // Ignore the button itself
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const hoverZoneRef = useRef<HTMLDivElement>(null);

    // Scroll hide/show logic
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 10) {
                // Always show at top of page
                setIsVisible(true);
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up → show
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
                // Scrolling down past 80px → hide
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const handleDropdownChange = (menuName: string, isOpen: boolean) => {
        if (isOpen) {
            setOpenMenu(menuName);
        } else {
            setOpenMenu(null);
        }
    };

    const projectItems = [
        {label: 'All Properties', href: '/properties', icon: <svg className="h-full w-full" id="Layer_1" enable-background="new 0 0 4000 4000" viewBox="0 0 4000 4000" xmlns="http://www.w3.org/2000/svg"><g><g><g><path d="m1888 2448v336c0 184.789-151.211 336-336 336h-336c-184.789 0-336-151.211-336-336v-336c0-184.789 151.211-336 336-336h336c184.789 0 336 151.211 336 336z" fill="currentColor"/></g><g><path d="m1888 1216v336c0 184.789-151.211 336-336 336h-336c-184.789 0-336-151.211-336-336v-336c0-184.789 151.211-336 336-336h336c184.789 0 336 151.211 336 336z" fill="currentColor"/></g></g><g><g><path d="m3120 2448v336c0 184.789-151.211 336-336 336h-336c-184.789 0-336-151.211-336-336v-336c0-184.789 151.211-336 336-336h336c184.789 0 336 151.211 336 336z" fill="currentColor"/></g><g><path d="m3120 1216v336c0 184.789-151.211 336-336 336h-336c-184.789 0-336-151.211-336-336v-336c0-184.789 151.211-336 336-336h336c184.789 0 336 151.211 336 336z" fill="currentColor"/></g></g></g></svg>},
        {label: 'Upcoming', href: '/upcoming', icon: <svg className="h-full w-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 9l4-4 4 4m0 6v4m-4-4v4m-4-4v4"/><path d="M3 20h18"/></svg>},
        {label: 'Ongoing', href: '/ongoing', icon: <svg className="h-full w-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>},
        {label: 'Handover', href: '/handover', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-4" fill="currentColor" aria-hidden="true"> <path d="M497.36 69.995c-7.532-7.545-19.753-7.558-27.285-.032L238.582 300.845l-83.522-90.713c-7.217-7.834-19.419-8.342-27.266-1.126-7.841 7.217-8.343 19.425-1.126 27.266l97.126 105.481c3.557 3.866 8.535 6.111 13.784 6.22.141.006.277.006.412.006 5.101 0 10.008-2.026 13.623-5.628L497.322 97.286c7.551-7.525 7.564-19.746.038-27.291z"/> <path d="M492.703 236.703c-10.658 0-19.296 8.638-19.296 19.297 0 119.883-97.524 217.407-217.407 217.407-119.876 0-217.407-97.524-217.407-217.407 0-119.876 97.531-217.407 217.407-217.407 10.658 0 19.297-8.638 19.297-19.296C275.297 8.638 266.658 0 256 0 114.84 0 0 114.84 0 256c0 141.154 114.84 256 256 256 141.154 0 256-114.846 256-256 0-10.658-8.638-19.297-19.297-19.297z"/> </svg>},
        {label: 'Favorites', href: '/properties?tab=favorites', icon: <svg className="h-full w-full" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>},
    ];

    const hotelsResortsItems: MobileSubmenuItem[] = (navHotels ?? []).map(
        (hotel) => ({
            label: hotel.name,
            href: `/hotels-resorts/${hotel.slug}`,
        }),
    );

    const contactItems = [
        {label: 'Customer Inquiry', href: contact.url(), icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" className="h-4" fill="currentColor" aria-hidden="true"><path d="m32.991 24.801h46.908l-25.624 20.122c-.543.426-1.189.634-1.775.691-.59-.058-1.238-.266-1.787-.691l-18.312-14.385c-.194-.156-.413-.275-.654-.349.862-1.216 1.354-2.687 1.328-4.272-.005-.363-.037-.737-.084-1.116zm-11.929-12.941c.059.01.156.047.367.145.417.198 1.08.708 1.729 1.419 1.307 1.424 2.613 3.581 3.291 5.005.021.042.043.088.063.135 1.924 3.301 2.754 5.826 2.779 7.41.027 1.591-.4 2.276-1.749 3.051l-3.48 2.006c-2.267 1.305-3.338 3.644-3.604 5.826-.267 2.183.126 4.304 1.097 5.981l8.59 14.805c.973 1.676 2.634 3.078 4.665 3.939 2.033.863 4.604 1.107 6.871-.195l3.48-2.002c1.348-.773 2.163-.789 3.532.025 1.373.816 3.156 2.787 5.072 6.09.027.049.053.09.084.137.898 1.295 2.121 3.492 2.711 5.332.293.914.408 1.74.371 2.197-.041.459-.051.412-.172.484l-2.648 1.518c-6.652 2.885-12.749 2.234-18.198-.592-5.459-2.838-10.204-7.963-13.512-13.98-.011-.012-.016-.027-.025-.035l-7.246-12.488c-.012-.012-.017-.023-.027-.039-3.585-5.86-5.674-12.513-5.412-18.634.262-6.112 2.742-11.684 8.584-15.971l2.649-1.513c.061-.035.081-.062.138-.056zm.027-3.721c-.701-.011-1.416.136-2.059.509l-2.801 1.611c-.063.036-.121.073-.178.109-6.739 4.932-9.842 11.798-10.145 18.875-.303 7.074 2.059 14.375 5.961 20.758l7.222 12.445-.017-.037c3.605 6.551 8.771 12.234 15.084 15.508 6.316 3.279 13.84 4.039 21.504.697.063-.027.127-.057.184-.092l2.805-1.611c1.297-.738 1.949-2.174 2.055-3.428.109-1.25-.146-2.467-.533-3.666-.758-2.371-2.08-4.674-3.172-6.254-2.063-3.549-4.055-6.012-6.357-7.389-2.32-1.383-5.105-1.363-7.377-.057l-3.48 2.006c-1.028.592-2.23.523-3.495-.012-1.259-.535-2.425-1.605-2.858-2.355l-8.59-14.804c-.434-.754-.789-2.292-.621-3.648.162-1.352.711-2.411 1.74-3.004l3.381-1.944c.088.453.344.864.715 1.14l18.313 14.388c1.191.936 2.602 1.457 4.023 1.539.072.004.146.004.219 0 1.422-.082 2.826-.604 4.018-1.539l25.222-19.814v32.734c0 .498-.568 1.154-1.682 1.154h-17.461c-1.051-.006-1.902.842-1.902 1.887 0 1.043.852 1.891 1.902 1.885h17.461c2.854 0 5.477-2.063 5.477-4.926v-34.849c0-2.865-2.623-4.927-5.477-4.927h-48.218c-.534-1.335-1.239-2.75-2.127-4.288-.831-1.73-2.179-4.017-3.866-5.856-.852-.932-1.771-1.758-2.92-2.292v.005c-.571-.27-1.25-.443-1.95-.458z"/></svg>},
    ];

    // Mobile submenu component
    type MobileSubmenuItem = {
        label: string;
        href: string;
        icon?: React.ReactNode;
    };

    const MobileSubmenu = ({title, icon, items, delay}: {
        title: string;
        icon: React.ReactNode;
        items: MobileSubmenuItem[];
        delay: number
    }) => {
        const isOpen = openMobileSubmenu === title;

        return (
            <div className="border-b border-white/10 bg-blue-300/30 mx-2 rounded-md shadow-md/30">
                <button
                    onClick={() => setOpenMobileSubmenu(isOpen ? null : title)}
                    className="w-full text-left text-blue-900 hover:text-blue-600 transition-colors py-3 flex justify-between items-center px-4"
                >
                    <div className="flex items-center gap-2">
                        {icon}
                        <span className="text-sm font-medium">{title}</span>
                    </div>
                    <ChevronDown
                        className={`h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    />
                </button>
                {isOpen && (
                    <div className="bg-blue-400/30 ml-4 mr-2 my-2 space-y-1 rounded-xl shadow-lg/30">
                        {items.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="m-1 border-b border-gray-700/20 flex items-center justify-between text-blue-900 hover:text-blue-600 transition-colors p-2 text-sm"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="flex items-center gap-2">
                                    {item.icon && (
                                        <span className="h-4 w-4 flex-shrink-0">
                                            {item.icon}
                                        </span>
                                    )}
                                    {item.label}
                                </span>
                                {item.label === 'Favorites' && favorites.length > 0 && (
                                    <span
                                        className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 ml-2">
                                        {favorites.length > 9 ? '9+' : favorites.length}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Invisible hover trigger zone at top of screen (desktop only) */}
            <div
                className="fixed top-0 right-0 left-0 z-[60] hidden h-4 lg:block"
                onMouseEnter={() => setIsVisible(true)}
            />

            <div
                className="fixed top-0 right-0 left-0 z-50 px-4 py-4 transition-transform duration-300 ease-in-out"
                style={{
                    perspective: '1200px',
                    transform: isVisible
                        ? 'translateY(0)'
                        : 'translateY(-120%)',
                }}
            >
                {/* Add top padding wrapper – especially helpful for iOS notch */}
                <div className="pt-3 pb-4 xl:pt-0 xl:pb-0">
                    {/* ─── DESKTOP ─── */}
                    <div className="relative mx-auto max-w-7xl">
                        {/* Logo - always visible, left aligned */}
                        <div className="absolute top-4 left-4 z-30 -translate-y-1/2 rounded-full bg-white/70 p-1 lg:left-6 xl:top-8 xl:left-8">
                            <Link href={home.url()}>
                                <img
                                    className="h-14 w-auto object-contain md:h-16 lg:h-18"
                                    src={logo}
                                    alt="Alliance Logo"
                                />
                            </Link>
                        </div>

                        {/* Central nav bar — only nav items — wider on large screens */}
                        <div className="hidden xl:flex xl:justify-center">
                            <nav
                                ref={navRef}
                                className={`navbar-container {/* ← strongest built-in = 64px */} {/* slightly more transparent = stronger glass feel */} {/* softer edge */} shadow-[0_8px_32px_rgba(31,38,135,0.18), inset_0_2px_1px_rgba(255,255,255,0.45)] relative flex h-12 items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/25 bg-white/60 backdrop-blur-5xl transition-all duration-400 before:pointer-events-none before:absolute before:inset-0 before:z-[-1] before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-white/8 before:content-['']`}
                                style={{
                                    transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                                    // Remove conflicting background from style — keep it in className
                                }}
                            >
                                {/* Desktop Navigation */}
                                <div className="hidden items-center gap-1 lg:flex">
                                    {/* About Us */}
                                    <Link
                                        href={about.url()}
                                        className="nav-link group"
                                    >
                                        <span className="inline-flex items-center gap-1 transition-transform duration-300">
                                            <svg
                                                className="h-3"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 330 330"
                                            >
                                                <path d="M165 0C74.019 0 0 74.02 0 165.001S74.019 330 165 330s165-74.018 165-164.999S255.981 0 165 0m0 300c-74.44 0-135-60.56-135-134.999S90.56 30 165 30s135 60.562 135 135.001S239.439 300 165 300" />
                                                <path d="M164.998 70c-11.026 0-19.996 8.976-19.996 20.009 0 11.023 8.97 19.991 19.996 19.991s19.996-8.968 19.996-19.991c0-11.033-8.97-20.009-19.996-20.009m.002 70c-8.284 0-15 6.716-15 15v90c0 8.284 6.716 15 15 15s15-6.716 15-15v-90c0-8.284-6.716-15-15-15" />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                            </svg>
                                            About Us
                                        </span>
                                    </Link>

                                    {/* Projects Dropdown */}
                                    <div
                                        className="relative"
                                        onMouseEnter={() =>
                                            setOpenMenu('projects')
                                        }
                                        onMouseLeave={() => setOpenMenu(null)}
                                    >
                                        <DropdownMenu
                                            open={openMenu === 'projects'}
                                            onOpenChange={(open) =>
                                                handleDropdownChange(
                                                    'projects',
                                                    open,
                                                )
                                            }
                                        >
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="nav-link group"
                                                >
                                                    <span className="inline-flex items-center gap-1 transition-transform duration-300">
                                                        <svg
                                                            className="h-3"
                                                            id="Layer_1"
                                                            viewBox="0 0 512 512"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            data-name="Layer 1"
                                                        >
                                                            <path d="m293.97 118.205c1.019.707 2.215 1.071 3.423 1.071.705 0 1.415-.125 2.095-.378l24.296-9.058c2.348-.875 3.904-3.117 3.904-5.622v-42.831c0-2.018-1.014-3.899-2.698-5.01-1.686-1.11-3.816-1.301-5.667-.504l-24.303 10.427c-2.206.946-3.635 3.115-3.635 5.515l.007 41.463c0 1.966.964 3.807 2.578 4.928zm21.718-47.715v29.562l-12.297 4.585-.005-28.869 12.302-5.277zm9.495 55.124c-1.57-1.125-3.587-1.429-5.422-.805l-24.296 8.239c-2.436.825-4.073 3.11-4.073 5.682v44.271c0 1.878.879 3.647 2.375 4.781 1.056.8 2.331 1.219 3.625 1.219.542 0 1.087-.073 1.62-.223l24.296-6.815c2.59-.727 4.38-3.088 4.38-5.777v-45.695c0-1.935-.933-3.75-2.505-4.877zm-9.495 46.023-12.296 3.449v-32.056l12.296-4.17v32.776zm9.905 98.271c-1.329-1.141-3.087-1.638-4.821-1.375l-24.296 3.753c-2.925.452-5.084 2.97-5.084 5.93v44.271c0 1.69.714 3.304 1.965 4.44 1.109 1.008 2.55 1.56 4.035 1.56.19 0 .382-.009.572-.027l24.296-2.329c3.078-.295 5.428-2.881 5.428-5.973v-45.695c0-1.751-.766-3.415-2.095-4.555zm-9.905 44.798-12.296 1.179v-32.524l12.296-1.899v33.245zm9.699-116.935c-1.452-1.138-3.345-1.544-5.137-1.102l-24.296 5.995c-2.68.661-4.562 3.065-4.562 5.825v44.236c0 1.785.795 3.479 2.17 4.618 1.085.9 2.442 1.382 3.83 1.382.369 0 .741-.034 1.109-.104l24.296-4.572c2.836-.534 4.891-3.011 4.891-5.896v-45.659c0-1.845-.849-3.586-2.301-4.724zm-9.699 45.406-12.296 2.314v-32.303l12.296-3.034v33.022zm-65.527 22.369c1.086.901 2.443 1.383 3.831 1.383.368 0 .739-.034 1.107-.104l21.568-4.052c2.837-.532 4.893-3.01 4.893-5.896v-43.026c0-1.844-.848-3.586-2.3-4.723-1.451-1.138-3.346-1.545-5.136-1.103l-21.568 5.316c-2.681.66-4.564 3.064-4.564 5.825v41.762c0 1.785.795 3.478 2.169 4.617zm9.831-41.679 9.568-2.358v30.391l-9.568 1.797v-29.829zm-6 108.749c.189 0 .381-.009.572-.027l21.562-2.064c3.078-.295 5.428-2.881 5.428-5.973v-42.923c0-1.751-.765-3.415-2.094-4.555-1.329-1.139-3.087-1.641-4.82-1.375l-21.562 3.325c-2.927.451-5.086 2.969-5.086 5.93v41.662c0 1.69.714 3.303 1.965 4.44 1.109 1.008 2.55 1.56 4.035 1.56zm6-42.517 9.562-1.475v30.474l-9.562.916zm-9.626-90.11c1.056.801 2.331 1.22 3.626 1.22.541 0 1.086-.073 1.618-.223l21.568-6.042c2.591-.726 4.382-3.087 4.382-5.777v-43.025c0-1.934-.932-3.749-2.504-4.876-1.57-1.126-3.588-1.429-5.421-.807l-21.568 7.305c-2.436.825-4.075 3.11-4.075 5.683v41.763c0 1.877.879 3.646 2.374 4.78zm9.626-42.24 9.568-3.24v30.108l-9.568 2.68zm-9.427-23.402c1.02.71 2.218 1.075 3.428 1.075.702 0 1.408-.123 2.085-.374l21.568-7.998c2.353-.873 3.914-3.116 3.914-5.625l.007-40.265c0-2.017-1.013-3.899-2.697-5.01-1.684-1.11-3.812-1.3-5.667-.506l-21.575 9.248c-2.205.945-3.636 3.114-3.636 5.515v39.015c0 1.964.961 3.804 2.573 4.925zm9.427-39.983 9.573-4.104-.004 26.989-9.569 3.549v-26.435zm-185.024 143.24c1.026.726 2.239 1.101 3.464 1.101.673 0 1.35-.113 2-.344l17.555-6.208c2.397-.848 4-3.113 4-5.655l.005-32.739c0-2.011-1.006-3.888-2.682-4.999-1.675-1.113-3.796-1.312-5.647-.531l-17.56 7.396c-2.225.937-3.671 3.115-3.671 5.529v31.551c0 1.948.945 3.774 2.536 4.899zm9.464-32.467 5.559-2.342-.003 19.459-5.556 1.964zm26.033 19.88c1.025.724 2.236 1.098 3.459 1.098.677 0 1.357-.114 2.012-.348l20.218-7.196c2.392-.851 3.988-3.114 3.988-5.652v-35.271c0-2.013-1.009-3.891-2.687-5.002-1.68-1.112-3.803-1.307-5.654-.522l-20.218 8.567c-2.219.939-3.659 3.115-3.659 5.524v33.9c0 1.95.948 3.778 2.541 4.902zm9.459-34.829 8.218-3.482v21.979l-8.218 2.926zm18.008 98.968c-1.399-1.14-3.239-1.589-5.003-1.225l-20.211 4.171c-2.787.575-4.787 3.029-4.787 5.876v36.178c0 1.734.75 3.384 2.058 4.523 1.1.958 2.502 1.477 3.942 1.477.272 0 .546-.019.819-.057l20.211-2.785c2.969-.409 5.181-2.946 5.181-5.943v-37.563c0-1.804-.812-3.512-2.21-4.651zm-9.79 36.985-8.211 1.131v-24.406l8.211-1.694v24.97zm-48.896 18.846 17.549-2.403c2.971-.407 5.186-2.945 5.186-5.944v-34.981c0-1.803-.811-3.511-2.208-4.649-1.397-1.142-3.237-1.594-4.999-1.228l-17.549 3.604c-2.79.573-4.793 3.028-4.793 5.877v33.78c0 1.733.75 3.382 2.056 4.521 1.1.959 2.503 1.479 3.944 1.479.271 0 .543-.019.814-.056zm5.186-34.832 5.549-1.14v22.39l-5.549.76zm-9.701-19.538c1.066.837 2.373 1.278 3.701 1.278.479 0 .959-.058 1.433-.174l17.549-4.316c2.683-.659 4.567-3.064 4.567-5.826v-34.981c0-1.91-.91-3.707-2.45-4.837-1.54-1.131-3.527-1.462-5.35-.887l-17.549 5.518c-2.5.786-4.2 3.104-4.2 5.724v33.78c0 1.844.848 3.585 2.299 4.722zm9.701-34.099 5.549-1.745v22.103l-5.549 1.365zm53.256-26.81c-1.543-1.13-3.53-1.458-5.354-.881l-20.211 6.388c-2.495.788-4.191 3.104-4.191 5.721v36.199c0 1.844.848 3.586 2.3 4.723 1.066.836 2.372 1.277 3.7 1.277.479 0 .961-.058 1.436-.174l20.211-4.979c2.681-.661 4.564-3.065 4.564-5.826v-37.607c0-1.912-.911-3.71-2.454-4.84zm-9.546 37.746-8.211 2.023v-24.146l8.211-2.596v24.718zm372.304 202.535h-35.498v-410.226c0-2.402-1.433-4.573-3.642-5.517l-114.071-48.763c-1.506-.645-3.211-.645-4.717 0l-114.072 48.763c-2.209.943-3.642 3.114-3.642 5.517v85.121l-50.608-21.634c-1.506-.645-3.211-.645-4.717 0l-118.785 50.777c-2.209.943-3.642 3.114-3.642 5.517v290.445h-35.498c-3.313 0-6 2.687-6 6v25.011c0 3.313 2.687 6 6 6h488.892c3.313 0 6-2.687 6-6v-25.011c0-3.313-2.687-6-6-6zm-47.498 0h-102.071v-449.899l102.071 43.632zm-114.072-449.899v449.899h-22.729v-95.769l3.167-.301c3.299-.313 5.719-3.242 5.404-6.541-.313-3.299-3.231-5.718-6.541-5.404l-61.812 5.883c-3.299.313-5.719 3.242-5.404 6.541.295 3.105 2.908 5.432 5.966 5.432.189 0 .382-.009.575-.027l2.031-.193v90.381h-22.729v-406.268l102.072-43.632zm-34.729 355.272v94.627h-32.613v-91.523zm-79.343 94.627h-46.967v-332.132l46.967 20.077zm-165.752-286.485 106.785-45.647v332.132h-25.086v-76.769l3.168-.302c3.299-.313 5.719-3.242 5.404-6.541-.313-3.299-3.246-5.727-6.541-5.404l-61.812 5.884c-3.299.313-5.719 3.242-5.404 6.541.295 3.105 2.908 5.432 5.966 5.432.19 0 .382-.009.575-.027l2.031-.193v71.38h-25.086zm69.699 210.859v75.626h-32.613v-72.522zm365.694 100.637h-476.891v-13.011h476.892v13.011zm-98.534-49.997v-369.405c0-3.313 2.687-6 6-6s6 2.687 6 6v369.405c0 3.313-2.687 6-6 6s-6-2.687-6-6zm28.519 0v-357.214c0-3.313 2.687-6 6-6s6 2.687 6 6v357.214c0 3.313-2.687 6-6 6s-6-2.687-6-6zm-57.036 0v-381.595c0-3.313 2.687-6 6-6s6 2.687 6 6v381.595c0 3.313-2.687 6-6 6s-6-2.687-6-6z" />
                                                        </svg>
                                                        Projects
                                                        <ChevronDown
                                                            className={`h-4 transition-transform duration-300 ${
                                                                openMenu ===
                                                                'projects'
                                                                    ? 'rotate-180'
                                                                    : 'rotate-0'
                                                            }`}
                                                        />
                                                    </span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="dropdown-content">
                                                {projectItems.map((item) => (
                                                    <DropdownMenuItem
                                                        key={item.label}
                                                        className="dropdown-item"
                                                    >
                                                        <Link
                                                            href={item.href}
                                                            preserveState={
                                                                false
                                                            } // ← force no preservation → fresh state
                                                            preserveScroll
                                                            replace={true} // replace history entry (cleaner back button)
                                                            className="flex w-full items-center justify-between gap-2"
                                                            // preserveState={item.label !== 'All Projects'} // optional: preserve filters except maybe "All"
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                {item.icon && (
                                                                    <span className="h-4 w-4 flex-shrink-0">
                                                                        {
                                                                            item.icon
                                                                        }
                                                                    </span>
                                                                )}
                                                                {item.label}
                                                            </span>
                                                            {item.label ===
                                                                'Favorites' &&
                                                                favorites.length >
                                                                    0 && (
                                                                    <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                                                                        {favorites.length >
                                                                        9
                                                                            ? '9+'
                                                                            : favorites.length}
                                                                    </span>
                                                                )}
                                                        </Link>
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Media & Gallery Dropdown */}
                                    <div
                                        className="relative"
                                        onMouseEnter={() =>
                                            setOpenMenu('mediaGallery')
                                        }
                                        onMouseLeave={() => setOpenMenu(null)}
                                    >
                                        <DropdownMenu
                                            open={openMenu === 'mediaGallery'}
                                            onOpenChange={(open) =>
                                                handleDropdownChange(
                                                    'mediaGallery',
                                                    open,
                                                )
                                            }
                                        >
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="nav-link group"
                                                >
                                                    <span className="inline-flex items-center gap-1 transition-transform duration-300">
                                                        <svg
                                                            className="h-3"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                d="M4 5h16v14H4z"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                            />
                                                            <circle
                                                                cx="8"
                                                                cy="9"
                                                                r="1.5"
                                                            />
                                                            <path d="M21 15l-5-5L5 21" />
                                                        </svg>
                                                        Media & Gallery
                                                        <ChevronDown
                                                            className={`h-4 transition-transform duration-300 ${
                                                                openMenu ===
                                                                'mediaGallery'
                                                                    ? 'rotate-180'
                                                                    : 'rotate-0'
                                                            }`}
                                                        />
                                                    </span>
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent className="dropdown-content">
                                                <DropdownMenuItem className="dropdown-item">
                                                    <Link
                                                        href={media.url()}
                                                        className="flex w-full items-center gap-2"
                                                    >
                                                        Media Coverage
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem className="dropdown-item">
                                                    <Link
                                                        href={gallery.url()}
                                                        className="flex w-full items-center gap-2"
                                                    >
                                                        Photos & Videos
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Hotels & Resorts Dropdown (hardcoded URLs for now) */}
                                    <div
                                        className="relative"
                                        onMouseEnter={() =>
                                            setOpenMenu('hotelsResorts')
                                        }
                                        onMouseLeave={() => setOpenMenu(null)}
                                    >
                                        <DropdownMenu
                                            open={openMenu === 'hotelsResorts'}
                                            onOpenChange={(open) =>
                                                handleDropdownChange(
                                                    'hotelsResorts',
                                                    open,
                                                )
                                            }
                                        >
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="nav-link group"
                                                >
                                                    <span className="inline-flex items-center gap-1 transition-transform duration-300">
                                                        <svg
                                                            className="h-3"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M7 22V10h10v12" />
                                                            <path d="M5 10l7-7 7 7" />
                                                            <path d="M4 22h16" />
                                                        </svg>
                                                        Hotels &amp; Resorts
                                                        <ChevronDown
                                                            className={`h-4 transition-transform duration-300 ${
                                                                openMenu ===
                                                                'hotelsResorts'
                                                                    ? 'rotate-180'
                                                                    : 'rotate-0'
                                                            }`}
                                                        />
                                                    </span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="dropdown-content">
                                                {hotelsResortsItems.map(
                                                    (item) => (
                                                        <DropdownMenuItem
                                                            key={item.label}
                                                            className="dropdown-item"
                                                        >
                                                            <Link
                                                                href={item.href}
                                                                className="flex w-full items-center justify-between gap-2"
                                                            >
                                                                <span className="flex items-center gap-2">
                                                                    {item.icon && (
                                                                        <span className="h-4 w-4 flex-shrink-0">
                                                                            {
                                                                                item.icon
                                                                            }
                                                                        </span>
                                                                    )}
                                                                    {item.label}
                                                                </span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    ),
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Contact Us Dropdown */}
                                    <div
                                        className="relative"
                                        onMouseEnter={() =>
                                            setOpenMenu('contact')
                                        }
                                        onMouseLeave={() => setOpenMenu(null)}
                                    >
                                        <DropdownMenu
                                            open={openMenu === 'contact'}
                                            onOpenChange={(open) =>
                                                handleDropdownChange(
                                                    'contact',
                                                    open,
                                                )
                                            }
                                        >
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="nav-link group"
                                                >
                                                    <span className="inline-flex items-center gap-1 transition-transform duration-300">
                                                        <svg
                                                            className="h-3"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                        </svg>
                                                        Contact Us
                                                        <ChevronDown
                                                            className={`h-4 w-4 transition-transform duration-300 ${
                                                                openMenu ===
                                                                'contact'
                                                                    ? 'rotate-180'
                                                                    : 'rotate-0'
                                                            }`}
                                                        />
                                                    </span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="dropdown-content">
                                                {contactItems.map((item) => (
                                                    <DropdownMenuItem
                                                        key={item.label}
                                                        className="dropdown-item"
                                                    >
                                                        <Link
                                                            href={item.href}
                                                            className="flex w-full items-center gap-2"
                                                        >
                                                            {item.icon && (
                                                                <span className="h-4 w-4 flex-shrink-0">
                                                                    {item.icon}
                                                                </span>
                                                            )}
                                                            {item.label}
                                                        </Link>
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* MD Message */}
                                    <Link
                                        href={managingDirector.url()}
                                        className="nav-link group"
                                    >
                                        <span className="inline-flex items-center gap-1 transition-transform duration-300">
                                            <svg
                                                className="h-4"
                                                viewBox="0 0 512 512"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M424.323 435.887c43.934 0 79.677-35.743 79.677-79.677s-35.743-79.677-79.677-79.677c-6.837 0-13.475.867-19.812 2.495V153.521c0-37.767-30.726-68.493-68.493-68.493h-15.459c-15.377-31.107-47.442-52.553-84.426-52.553s-69.05 21.446-84.427 52.553h-15.46c-37.768 0-68.494 30.726-68.494 68.493v156.387H31.893c-8.653 0-15.692 7.04-15.692 15.692v37.812c0 8.653 7.04 15.693 15.692 15.693h26.242v84.42H16a8 8 0 0 0 0 16h440.778a8 8 0 0 0 0-16h-42.074v-28.24a80 80 0 0 0 9.619.602M488 356.21c0 35.111-28.565 63.677-63.677 63.677s-63.677-28.565-63.677-63.677 28.565-63.677 63.677-63.677S488 321.099 488 356.21m-300.073-46.303h-96.76c23.924-47.508 69.207-79.899 121.331-87.485l-25.61 80.524a8 8 0 0 0 1.039 6.961m21.288 0-5.703-6.44 26.28-82.633q3.137-.12 6.296-.123h.078c2.109 0 4.212.055 6.31.138l26.275 82.617-5.704 6.44zm76.16-6.96-25.591-80.463c46.055 6.848 87.599 33.402 113.035 73.004a80.3 80.3 0 0 0-13.277 14.42h-75.207a8 8 0 0 0 1.04-6.961m50.643-201.919c28.945 0 52.493 23.548 52.493 52.493v131.548c-.849.429-1.695.862-2.526 1.32-15.128-23.405-35.615-43.095-59.688-57.232-14.62-8.585-30.383-14.974-46.754-19.073 30.107-15.718 50.708-47.241 50.708-83.49a94 94 0 0 0-3.53-25.566zm-99.885-52.554c43.075 0 78.119 35.044 78.119 78.119 0 43.068-35.032 78.106-78.096 78.119h-.051c-43.062-.016-78.091-35.053-78.091-78.118 0-43.076 35.044-78.12 78.119-78.12m-99.887 52.554h9.298a94 94 0 0 0-3.53 25.566c0 36.223 20.573 67.728 50.644 83.457-20.164 5.048-39.344 13.62-56.775 25.49-21.262 14.479-38.948 33.158-52.131 54.835V153.521c0-28.945 23.549-52.493 52.494-52.493M32.201 325.907h318.447a79.2 79.2 0 0 0-6.002 30.303c0 2.325.121 4.621.318 6.896H32.201zm366.503 137.619H74.135v-84.42h273.879c7.406 24.635 26.434 44.27 50.69 52.531zm-21.66-121.728c-8.048 8.049-8.048 21.146 0 29.196l19.668 19.668c4.124 4.124 9.198 6.825 14.286 7.605q1.58.241 3.126.241c5.259 0 10.185-2.077 14.117-6.009l43.361-43.36c8.049-8.05 8.048-21.147 0-29.197-8.05-8.049-21.146-8.047-29.196 0l-29.009 29.01-7.155-7.155c-8.051-8.049-21.148-8.05-29.198.001q0-.002 0 0m11.314 11.313c1.78-1.779 4.789-1.78 6.569.001l12.812 12.812a8 8 0 0 0 11.313 0l34.666-34.666c1.78-1.78 4.789-1.782 6.57 0 1.78 1.78 1.78 4.789 0 6.569l-43.361 43.36c-1.111 1.11-2.128 1.478-3.504 1.266-1.696-.26-3.714-1.42-5.397-3.104l-19.668-19.667c-1.781-1.782-1.781-4.79 0-6.571" />
                                            </svg>
                                            MD's Message
                                        </span>
                                    </Link>
                                </div>
                            </nav>
                        </div>

                        {/* Right side CTA + mobile hamburger */}
                        <div className="absolute top-2 right-2 z-30 flex -translate-y-1/2 items-center gap-3 lg:right-4 xl:top-6 xl:right-6">
                            {/* Call Now - always visible */}
                            <Link
                                href="tel:+1234567890"
                                className={`btn-primary flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 md:rounded-xl md:px-4 md:text-base`}
                            >
                                <Phone className="h-4 w-4" />
                                Call Now
                            </Link>

                            {/* Mobile menu button - only < lg */}
                            <div className="rounded-full bg-white/70">
                                <Button
                                    ref={buttonRef} // Add this ref
                                    variant="ghost"
                                    className="p-2 hover:bg-white/10 xl:hidden"
                                    onClick={() =>
                                        setIsMobileMenuOpen(!isMobileMenuOpen)
                                    }
                                >
                                    {isMobileMenuOpen ? (
                                        <X className="h-6 w-6" />
                                    ) : (
                                        <Menu className="h-6 w-6" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="mt-4 flex justify-end py-1">
                        <div
                            ref={mobileMenuRef}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-navbar-gradient shadow-navbar animate-fade-in mt-0 inline-block max-h-[calc(100vh-100px)] w-auto min-w-60 overflow-y-auto rounded-2xl border-2 border-blue-300/60 backdrop-blur-xl sm:w-sm md:w-md xl:hidden"
                        >
                            <div className="space-y-0">
                                <Link
                                    href={about.url()}
                                    className="mobile-menu-item"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className="flex w-full items-center gap-2">
                                        <svg
                                            className="h-3"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 330 330"
                                        >
                                            <path d="M165 0C74.019 0 0 74.02 0 165.001S74.019 330 165 330s165-74.018 165-164.999S255.981 0 165 0m0 300c-74.44 0-135-60.56-135-134.999S90.56 30 165 30s135 60.562 135 135.001S239.439 300 165 300" />
                                            <path d="M164.998 70c-11.026 0-19.996 8.976-19.996 20.009 0 11.023 8.97 19.991 19.996 19.991s19.996-8.968 19.996-19.991c0-11.033-8.97-20.009-19.996-20.009m.002 70c-8.284 0-15 6.716-15 15v90c0 8.284 6.716 15 15 15s15-6.716 15-15v-90c0-8.284-6.716-15-15-15" />
                                            <g />
                                            <g />
                                            <g />
                                            <g />
                                            <g />
                                            <g />
                                            <g />
                                            <g />
                                            <g />
                                            <g />
                                            <g />
                                            <g />
                                            <g />
                                            <g />
                                            <g />
                                        </svg>
                                        About Us
                                    </div>
                                </Link>

                                <MobileSubmenu
                                    title="Projects"
                                    items={projectItems}
                                    icon={
                                        <svg
                                            className="h-3"
                                            id="Layer_1"
                                            viewBox="0 0 512 512"
                                            xmlns="http://www.w3.org/2000/svg"
                                            data-name="Layer 1"
                                        >
                                            <path d="m293.97 118.205c1.019.707 2.215 1.071 3.423 1.071.705 0 1.415-.125 2.095-.378l24.296-9.058c2.348-.875 3.904-3.117 3.904-5.622v-42.831c0-2.018-1.014-3.899-2.698-5.01-1.686-1.11-3.816-1.301-5.667-.504l-24.303 10.427c-2.206.946-3.635 3.115-3.635 5.515l.007 41.463c0 1.966.964 3.807 2.578 4.928zm21.718-47.715v29.562l-12.297 4.585-.005-28.869 12.302-5.277zm9.495 55.124c-1.57-1.125-3.587-1.429-5.422-.805l-24.296 8.239c-2.436.825-4.073 3.11-4.073 5.682v44.271c0 1.878.879 3.647 2.375 4.781 1.056.8 2.331 1.219 3.625 1.219.542 0 1.087-.073 1.62-.223l24.296-6.815c2.59-.727 4.38-3.088 4.38-5.777v-45.695c0-1.935-.933-3.75-2.505-4.877zm-9.495 46.023-12.296 3.449v-32.056l12.296-4.17v32.776zm9.905 98.271c-1.329-1.141-3.087-1.638-4.821-1.375l-24.296 3.753c-2.925.452-5.084 2.97-5.084 5.93v44.271c0 1.69.714 3.304 1.965 4.44 1.109 1.008 2.55 1.56 4.035 1.56.19 0 .382-.009.572-.027l24.296-2.329c3.078-.295 5.428-2.881 5.428-5.973v-45.695c0-1.751-.766-3.415-2.095-4.555zm-9.905 44.798-12.296 1.179v-32.524l12.296-1.899v33.245zm9.699-116.935c-1.452-1.138-3.345-1.544-5.137-1.102l-24.296 5.995c-2.68.661-4.562 3.065-4.562 5.825v44.236c0 1.785.795 3.479 2.17 4.618 1.085.9 2.442 1.382 3.83 1.382.369 0 .741-.034 1.109-.104l24.296-4.572c2.836-.534 4.891-3.011 4.891-5.896v-45.659c0-1.845-.849-3.586-2.301-4.724zm-9.699 45.406-12.296 2.314v-32.303l12.296-3.034v33.022zm-65.527 22.369c1.086.901 2.443 1.383 3.831 1.383.368 0 .739-.034 1.107-.104l21.568-4.052c2.837-.532 4.893-3.01 4.893-5.896v-43.026c0-1.844-.848-3.586-2.3-4.723-1.451-1.138-3.346-1.545-5.136-1.103l-21.568 5.316c-2.681.66-4.564 3.064-4.564 5.825v41.762c0 1.785.795 3.478 2.169 4.617zm9.831-41.679 9.568-2.358v30.391l-9.568 1.797v-29.829zm-6 108.749c.189 0 .381-.009.572-.027l21.562-2.064c3.078-.295 5.428-2.881 5.428-5.973v-42.923c0-1.751-.765-3.415-2.094-4.555-1.329-1.139-3.087-1.641-4.82-1.375l-21.562 3.325c-2.927.451-5.086 2.969-5.086 5.93v41.662c0 1.69.714 3.303 1.965 4.44 1.109 1.008 2.55 1.56 4.035 1.56zm6-42.517 9.562-1.475v30.474l-9.562.916zm-9.626-90.11c1.056.801 2.331 1.22 3.626 1.22.541 0 1.086-.073 1.618-.223l21.568-6.042c2.591-.726 4.382-3.087 4.382-5.777v-43.025c0-1.934-.932-3.749-2.504-4.876-1.57-1.126-3.588-1.429-5.421-.807l-21.568 7.305c-2.436.825-4.075 3.11-4.075 5.683v41.763c0 1.877.879 3.646 2.374 4.78zm9.626-42.24 9.568-3.24v30.108l-9.568 2.68zm-9.427-23.402c1.02.71 2.218 1.075 3.428 1.075.702 0 1.408-.123 2.085-.374l21.568-7.998c2.353-.873 3.914-3.116 3.914-5.625l.007-40.265c0-2.017-1.013-3.899-2.697-5.01-1.684-1.11-3.812-1.3-5.667-.506l-21.575 9.248c-2.205.945-3.636 3.114-3.636 5.515v39.015c0 1.964.961 3.804 2.573 4.925zm9.427-39.983 9.573-4.104-.004 26.989-9.569 3.549v-26.435zm-185.024 143.24c1.026.726 2.239 1.101 3.464 1.101.673 0 1.35-.113 2-.344l17.555-6.208c2.397-.848 4-3.113 4-5.655l.005-32.739c0-2.011-1.006-3.888-2.682-4.999-1.675-1.113-3.796-1.312-5.647-.531l-17.56 7.396c-2.225.937-3.671 3.115-3.671 5.529v31.551c0 1.948.945 3.774 2.536 4.899zm9.464-32.467 5.559-2.342-.003 19.459-5.556 1.964zm26.033 19.88c1.025.724 2.236 1.098 3.459 1.098.677 0 1.357-.114 2.012-.348l20.218-7.196c2.392-.851 3.988-3.114 3.988-5.652v-35.271c0-2.013-1.009-3.891-2.687-5.002-1.68-1.112-3.803-1.307-5.654-.522l-20.218 8.567c-2.219.939-3.659 3.115-3.659 5.524v33.9c0 1.95.948 3.778 2.541 4.902zm9.459-34.829 8.218-3.482v21.979l-8.218 2.926zm18.008 98.968c-1.399-1.14-3.239-1.589-5.003-1.225l-20.211 4.171c-2.787.575-4.787 3.029-4.787 5.876v36.178c0 1.734.75 3.384 2.058 4.523 1.1.958 2.502 1.477 3.942 1.477.272 0 .546-.019.819-.057l20.211-2.785c2.969-.409 5.181-2.946 5.181-5.943v-37.563c0-1.804-.812-3.512-2.21-4.651zm-9.79 36.985-8.211 1.131v-24.406l8.211-1.694v24.97zm-48.896 18.846 17.549-2.403c2.971-.407 5.186-2.945 5.186-5.944v-34.981c0-1.803-.811-3.511-2.208-4.649-1.397-1.142-3.237-1.594-4.999-1.228l-17.549 3.604c-2.79.573-4.793 3.028-4.793 5.877v33.78c0 1.733.75 3.382 2.056 4.521 1.1.959 2.503 1.479 3.944 1.479.271 0 .543-.019.814-.056zm5.186-34.832 5.549-1.14v22.39l-5.549.76zm-9.701-19.538c1.066.837 2.373 1.278 3.701 1.278.479 0 .959-.058 1.433-.174l17.549-4.316c2.683-.659 4.567-3.064 4.567-5.826v-34.981c0-1.91-.91-3.707-2.45-4.837-1.54-1.131-3.527-1.462-5.35-.887l-17.549 5.518c-2.5.786-4.2 3.104-4.2 5.724v33.78c0 1.844.848 3.585 2.299 4.722zm9.701-34.099 5.549-1.745v22.103l-5.549 1.365zm53.256-26.81c-1.543-1.13-3.53-1.458-5.354-.881l-20.211 6.388c-2.495.788-4.191 3.104-4.191 5.721v36.199c0 1.844.848 3.586 2.3 4.723 1.066.836 2.372 1.277 3.7 1.277.479 0 .961-.058 1.436-.174l20.211-4.979c2.681-.661 4.564-3.065 4.564-5.826v-37.607c0-1.912-.911-3.71-2.454-4.84zm-9.546 37.746-8.211 2.023v-24.146l8.211-2.596v24.718zm372.304 202.535h-35.498v-410.226c0-2.402-1.433-4.573-3.642-5.517l-114.071-48.763c-1.506-.645-3.211-.645-4.717 0l-114.072 48.763c-2.209.943-3.642 3.114-3.642 5.517v85.121l-50.608-21.634c-1.506-.645-3.211-.645-4.717 0l-118.785 50.777c-2.209.943-3.642 3.114-3.642 5.517v290.445h-35.498c-3.313 0-6 2.687-6 6v25.011c0 3.313 2.687 6 6 6h488.892c3.313 0 6-2.687 6-6v-25.011c0-3.313-2.687-6-6-6zm-47.498 0h-102.071v-449.899l102.071 43.632zm-114.072-449.899v449.899h-22.729v-95.769l3.167-.301c3.299-.313 5.719-3.242 5.404-6.541-.313-3.299-3.231-5.718-6.541-5.404l-61.812 5.883c-3.299.313-5.719 3.242-5.404 6.541.295 3.105 2.908 5.432 5.966 5.432.189 0 .382-.009.575-.027l2.031-.193v90.381h-22.729v-406.268l102.072-43.632zm-34.729 355.272v94.627h-32.613v-91.523zm-79.343 94.627h-46.967v-332.132l46.967 20.077zm-165.752-286.485 106.785-45.647v332.132h-25.086v-76.769l3.168-.302c3.299-.313 5.719-3.242 5.404-6.541-.313-3.299-3.246-5.727-6.541-5.404l-61.812 5.884c-3.299.313-5.719 3.242-5.404 6.541.295 3.105 2.908 5.432 5.966 5.432.19 0 .382-.009.575-.027l2.031-.193v71.38h-25.086zm69.699 210.859v75.626h-32.613v-72.522zm365.694 100.637h-476.891v-13.011h476.892v13.011zm-98.534-49.997v-369.405c0-3.313 2.687-6 6-6s6 2.687 6 6v369.405c0 3.313-2.687 6-6 6s-6-2.687-6-6zm28.519 0v-357.214c0-3.313 2.687-6 6-6s6 2.687 6 6v357.214c0 3.313-2.687 6-6 6s-6-2.687-6-6zm-57.036 0v-381.595c0-3.313 2.687-6 6-6s6 2.687 6 6v381.595c0 3.313-2.687 6-6 6s-6-2.687-6-6z" />
                                        </svg>
                                    }
                                    delay={800}
                                />

                                <MobileSubmenu
                                    title="Media & Gallery"
                                    icon={
                                        <svg
                                            className="h-3"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            />
                                            <circle cx="9" cy="9" r="1.5" />
                                            <path d="M21 15l-5-5L5 21" />
                                        </svg>
                                    }
                                    items={[
                                        {
                                            label: 'Media Coverage',
                                            href: media.url(),
                                        },
                                        {
                                            label: 'Photos & Videos',
                                            href: gallery.url(),
                                        },
                                    ]}
                                    delay={500}
                                />

                                <MobileSubmenu
                                    title="Hotels & Resorts"
                                    icon={
                                        <svg
                                            className="h-3"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M7 22V10h10v12" />
                                            <path d="M5 10l7-7 7 7" />
                                            <path d="M4 22h16" />
                                        </svg>
                                    }
                                    items={hotelsResortsItems}
                                    delay={450}
                                />

                                <MobileSubmenu
                                    title="Contact Us"
                                    icon={
                                        <svg
                                            className="h-3"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                        </svg>
                                    }
                                    items={contactItems}
                                    delay={400}
                                />

                                <Link
                                    href={managingDirector.url()}
                                    className="mobile-menu-item"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className="inline-flex items-center gap-2">
                                        <svg
                                            className="h-4"
                                            viewBox="0 0 512 512"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M424.323 435.887c43.934 0 79.677-35.743 79.677-79.677s-35.743-79.677-79.677-79.677c-6.837 0-13.475.867-19.812 2.495V153.521c0-37.767-30.726-68.493-68.493-68.493h-15.459c-15.377-31.107-47.442-52.553-84.426-52.553s-69.05 21.446-84.427 52.553h-15.46c-37.768 0-68.494 30.726-68.494 68.493v156.387H31.893c-8.653 0-15.692 7.04-15.692 15.692v37.812c0 8.653 7.04 15.693 15.692 15.693h26.242v84.42H16a8 8 0 0 0 0 16h440.778a8 8 0 0 0 0-16h-42.074v-28.24a80 80 0 0 0 9.619.602M488 356.21c0 35.111-28.565 63.677-63.677 63.677s-63.677-28.565-63.677-63.677 28.565-63.677 63.677-63.677S488 321.099 488 356.21m-300.073-46.303h-96.76c23.924-47.508 69.207-79.899 121.331-87.485l-25.61 80.524a8 8 0 0 0 1.039 6.961m21.288 0-5.703-6.44 26.28-82.633q3.137-.12 6.296-.123h.078c2.109 0 4.212.055 6.31.138l26.275 82.617-5.704 6.44zm76.16-6.96-25.591-80.463c46.055 6.848 87.599 33.402 113.035 73.004a80.3 80.3 0 0 0-13.277 14.42h-75.207a8 8 0 0 0 1.04-6.961m50.643-201.919c28.945 0 52.493 23.548 52.493 52.493v131.548c-.849.429-1.695.862-2.526 1.32-15.128-23.405-35.615-43.095-59.688-57.232-14.62-8.585-30.383-14.974-46.754-19.073 30.107-15.718 50.708-47.241 50.708-83.49a94 94 0 0 0-3.53-25.566zm-99.885-52.554c43.075 0 78.119 35.044 78.119 78.119 0 43.068-35.032 78.106-78.096 78.119h-.051c-43.062-.016-78.091-35.053-78.091-78.118 0-43.076 35.044-78.12 78.119-78.12m-99.887 52.554h9.298a94 94 0 0 0-3.53 25.566c0 36.223 20.573 67.728 50.644 83.457-20.164 5.048-39.344 13.62-56.775 25.49-21.262 14.479-38.948 33.158-52.131 54.835V153.521c0-28.945 23.549-52.493 52.494-52.493M32.201 325.907h318.447a79.2 79.2 0 0 0-6.002 30.303c0 2.325.121 4.621.318 6.896H32.201zm366.503 137.619H74.135v-84.42h273.879c7.406 24.635 26.434 44.27 50.69 52.531zm-21.66-121.728c-8.048 8.049-8.048 21.146 0 29.196l19.668 19.668c4.124 4.124 9.198 6.825 14.286 7.605q1.58.241 3.126.241c5.259 0 10.185-2.077 14.117-6.009l43.361-43.36c8.049-8.05 8.048-21.147 0-29.197-8.05-8.049-21.146-8.047-29.196 0l-29.009 29.01-7.155-7.155c-8.051-8.049-21.148-8.05-29.198.001q0-.002 0 0m11.314 11.313c1.78-1.779 4.789-1.78 6.569.001l12.812 12.812a8 8 0 0 0 11.313 0l34.666-34.666c1.78-1.78 4.789-1.782 6.57 0 1.78 1.78 1.78 4.789 0 6.569l-43.361 43.36c-1.111 1.11-2.128 1.478-3.504 1.266-1.696-.26-3.714-1.42-5.397-3.104l-19.668-19.667c-1.781-1.782-1.781-4.79 0-6.571" />
                                        </svg>
                                        MD's Message
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                <style>{`
        /* ─── Navbar Background Gradient ─── */
        .navbar-container::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, transparent 50%, rgba(59, 130, 246, 0.01) 100%);
            pointer-events: none;
            z-index: 1;
        }

        /* ─── Shimmer line on navbar ─── */
        .navbar-container::after {
            content: '';
            position: absolute;
            top: 0;
            left: 10%;
            right: 10%;
            height: 1px;
            background: linear-gradient(90deg,
                transparent,
                rgba(59, 130, 246, 0.6) 30%,
                rgba(255, 255, 255, 0.8) 50%,
                rgba(59, 130, 246, 0.6) 70%,
                transparent);
            border-radius: 2px;
            animation: shimmer-nav 3s ease-in-out infinite;
            z-index: 2;
        }

        /* ─── Keyframe Animations ─── */
        @keyframes nav-in {
            0% {
                opacity: 0;
                transform: translateY(-30px) rotateX(-15deg);
            }
            100% {
                opacity: 1;
                transform: translateY(0) rotateX(0deg);
            }
        }

        @keyframes shimmer-nav {
            0%, 100% {
                opacity: 0.4;
                transform: scaleX(0.6);
            }
            50% {
                opacity: 1;
                transform: scaleX(1);
            }
        }

        @keyframes link-in {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fade-in {
            0% {
                opacity: 0;
                transform: translateY(-10px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes pulse-dot {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.3);
                opacity: 0.7;
            }
        }

        /* ─── Animation Utility Classes ─── */
        .animate-nav-in {
            animation: nav-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .animate-link-in {
            animation: link-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }

        /* ─── Nav Links Styling ─── */
        .nav-link {
            display: block;
            padding: 6px 12px;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.3px;
            color: rgba(20, 30, 60, 0.8);
            text-decoration: none;
            border-radius: 10px;
            position: relative;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            background: transparent;
            border: none;
            cursor: pointer;
        }

        .nav-link::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 10px;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
            border: 1px solid rgba(59, 130, 246, 0.2);
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15), 0 1px 0 rgba(255, 255, 255, 0.08) inset;
            z-index: -1;
        }

        .nav-link:hover {
            color: #1e3a8a;
            transform: translateY(-1px);
        }

        .nav-link:hover::before {
            opacity: 1;
            transform: scale(1);
        }

        /* ─── Primary Button Styling ─── */
        .btn-primary {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
            font-weight: 600;
            letter-spacing: 0.5px;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(59, 130, 246, 0.5);
            box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4),
                        0 1px 0 rgba(255, 255, 255, 0.2) inset,
                        0 -2px 0 rgba(0, 0, 0, 0.2) inset;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .btn-primary::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 60%);
            pointer-events: none;
        }

        .btn-primary::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -60%;
            width: 40%;
            height: 200%;
            background: rgba(255, 255, 255, 0.15);
            transform: skewX(-20deg);
            transition: left 0.5s ease;
        }

        .btn-primary:hover {
            color: white;
            transform: translateY(-2px) scale(1.03);
            box-shadow: 0 8px 28px rgba(59, 130, 246, 0.55),
                        0 1px 0 rgba(255, 255, 255, 0.2) inset,
                        0 -2px 0 rgba(0, 0, 0, 0.3) inset;
        }

        .btn-primary:hover::after {
            left: 130%;
        }

        .btn-primary:active {
            transform: translateY(0) scale(0.98);
        }

        /* ─── Dropdown Content ─── */
        .dropdown-content {
            background: rgba(245, 247, 250, 0.95) !important;
            backdrop-filter: blur(12px);
            border: 1px solid rgba(59, 130, 246, 0.2) !important;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
                        0 0 0 1px rgba(59, 130, 246, 0.1) inset;
        }

        .dropdown-item {
            color: rgba(20, 30, 60, 0.8) !important;
            transition: all 0.3s ease;
            padding: 8px 12px !important;
            font-size: 14px;
        }

        .dropdown-item:hover {
            color: #3b82f6 !important;
            background: rgba(59, 130, 246, 0.08) !important;
        }

        /* ─── Mobile Menu Item ─── */
        .mobile-menu-item {
            display: block;
            color: rgba(20, 30, 60, 0.8);
            transition: all 0.3s ease;
            padding: 12px 16px;
            text-decoration: none;
            font-size: 15px;
            font-weight: 500;
        }

        .mobile-menu-item:hover {
            color: #3b82f6;
            background: rgba(59, 130, 246, 0.08);
        }

        /* ─── Shadow styling for navbar ─── */
        .shadow-navbar {
            box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.15),
                        0 8px 32px rgba(0, 0, 0, 0.08),
                        0 2px 0 rgba(255, 255, 255, 0.08) inset,
                        0 -1px 0 rgba(59, 130, 246, 0.1) inset !important;
        }

        /* ─── Background gradient for navbar ─── */
        .bg-navbar-gradient {
            background: linear-gradient(135deg, rgba(245, 247, 250, 0.95) 0%, rgba(203, 224, 255, 0.98) 100%);
        }

        /* Add to your style block */
        .navbar-hidden {
            transform: translateY(-120%);
        }

        /* ─── Preserve 3D for transforms ─── */
        .navbar-container {
            transform-style: preserve-3d;
        }


      `}</style>
            </div>
        </>
    );
};

export default Navbar;
