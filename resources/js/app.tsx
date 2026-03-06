import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob([
            './pages/**/*.tsx',
            './cms/pages/**/*.tsx',   // ← add this
        ], { eager: true });
        return (pages[`./pages/${name}.tsx`] ??
            pages[`./cms/pages/${name}.tsx`]) as any;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
