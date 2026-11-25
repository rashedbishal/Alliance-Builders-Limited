import { usePage } from '@inertiajs/react';
import { BadgeCheck } from 'lucide-react';
import type { SiteSetting } from '@/types/SiteSetting';

/** Credential card showing the trade license number set in CMS Settings. */
const TradeLicenseBadge = ({ className = '' }: { className?: string }) => {
    const { siteSettings } = usePage<{ siteSettings?: SiteSetting }>().props;
    const licenseNumber = siteSettings?.trade_license_number;

    if (!licenseNumber) {
        return null;
    }

    return (
        <div
            className={`shadow-elegant-xl mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-2xl border border-white/15 bg-black/90 p-6 text-center text-white sm:flex-row sm:text-left ${className}`}
        >
            <div className="rounded-full bg-accent/15 p-4">
                <BadgeCheck className="h-8 w-8 text-accent" />
            </div>
            <div>
                <div className="text-sm font-semibold tracking-wider text-white/70 uppercase">
                    E-Trade License &middot; Dhaka North City Corporation
                </div>
                <div className="mt-1 text-xl font-bold tracking-wide sm:text-2xl">
                    Trade License No:{' '}
                    <span className="font-mono text-accent">
                        {licenseNumber}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TradeLicenseBadge;
