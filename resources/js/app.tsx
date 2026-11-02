import { createInertiaApp } from '@inertiajs/react';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';

// Expose React on window so tech-detection tools (e.g. Wappalyzer) can
// identify it — Vite's bundled, minified output has no other detectable
// signature (no data-reactroot, no react*.js script filename).
(window as unknown as { React: typeof React }).React = React;

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob(
            [
                './pages/**/*.tsx',
                './cms/pages/**/*.tsx', // ← add this
            ],
            { eager: true },
        );
        return (pages[`./pages/${name}.tsx`] ??
            pages[`./cms/pages/${name}.tsx`]) as any;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
