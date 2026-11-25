import PageBreadcrumb from '@/components/PageBreadcrumb';
import AppLayout from '@/layouts/AppLayout';

interface Props {
    title: string;
    content: string;
}

export default function LegalPageContent({ title, content }: Props) {
    return (
        <AppLayout>
            <style>{`
                .legal-content { color: rgba(255,255,255,0.8); line-height: 1.625; }
                .legal-content > * + * { margin-top: 1rem; }
                .legal-content h2, .legal-content h3, .legal-content h4 { color: #fff; font-weight: 600; margin-top: 2rem; }
                .legal-content h2 { font-size: 1.5rem; }
                .legal-content h3 { font-size: 1.25rem; }
                .legal-content h4 { font-size: 1.1rem; }
                .legal-content ul, .legal-content ol { padding-left: 1.4rem; }
                .legal-content ul { list-style: disc; }
                .legal-content ol { list-style: decimal; }
                .legal-content li + li { margin-top: 0.5rem; }
                .legal-content a { text-decoration: underline; }
                .legal-content blockquote { border-left: 3px solid rgba(255,255,255,0.3); padding-left: 1rem; font-style: italic; }
                .legal-content strong, .legal-content b { color: #fff; }
                .legal-content hr { border-color: rgba(255,255,255,0.2); margin-top: 3rem; }
            `}</style>
            <div className="min-h-screen bg-black py-20">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        <PageBreadcrumb
                            items={[{ label: title }]}
                            className="mb-6"
                        />
                        <h1 className="mb-8 text-4xl font-bold text-white">
                            {title}
                        </h1>
                        <div
                            className="legal-content"
                            // Sanitized server-side by App\Services\RichTextSanitizer.
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
