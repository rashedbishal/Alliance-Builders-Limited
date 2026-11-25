import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbCrumb {
    label: string;
    href?: string;
}

interface PageBreadcrumbProps {
    items: BreadcrumbCrumb[];
    className?: string;
    // The site mixes hardcoded-dark pages (Gallery, PropertyDetails, ...)
    // with pages left on the light `bg-background` theme (Services,
    // Properties, ...) — pick the variant matching the page's own bg.
    variant?: 'dark' | 'light';
}

// `pill` is a translucent backdrop so the trail stays readable over
// photo heroes.
const VARIANT_STYLES = {
    dark: {
        base: 'text-white/70',
        link: 'hover:text-white',
        current: 'text-white font-medium',
        chevron: 'text-white/40',
        pill: 'border border-white/15 bg-black/40 backdrop-blur-sm',
    },
    light: {
        base: 'text-muted-foreground',
        link: 'hover:text-primary',
        current: 'text-foreground font-medium',
        chevron: 'text-muted-foreground/50',
        pill: 'border border-black/10 bg-white/70 backdrop-blur-sm',
    },
} as const;

// Trailing crumb (current page) should omit href — it renders as plain text.
const PageBreadcrumb = ({
    items,
    className = '',
    variant = 'dark',
}: PageBreadcrumbProps) => {
    const styles = VARIANT_STYLES[variant];

    return (
        <nav
            aria-label="Breadcrumb"
            className={`flex w-fit max-w-full flex-wrap items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm ${styles.pill} ${styles.base} ${className}`}
        >
            <Link
                href="/"
                className={`flex items-center gap-1 transition-colors ${styles.link}`}
            >
                <Home className="h-3.5 w-3.5" />
                <span className="sr-only">Home</span>
            </Link>
            {items.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                    <ChevronRight
                        className={`h-3.5 w-3.5 flex-shrink-0 ${styles.chevron}`}
                    />
                    {item.href ? (
                        <Link
                            href={item.href}
                            className={`truncate transition-colors ${styles.link}`}
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span
                            className={`truncate ${styles.current}`}
                            aria-current="page"
                        >
                            {item.label}
                        </span>
                    )}
                </span>
            ))}
        </nav>
    );
};

export default PageBreadcrumb;
