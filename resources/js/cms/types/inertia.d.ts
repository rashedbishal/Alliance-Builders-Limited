// resources/js/types/inertia.d.ts
import '@inertiajs/core';

declare module '@inertiajs/core' {
    interface PageProps {
        flash?: {
            success?: string;
            error?: string;
        };
    }
}
