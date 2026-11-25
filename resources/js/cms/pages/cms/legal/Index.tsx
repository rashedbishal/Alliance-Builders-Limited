import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import RichTextEditor from '@/cms/components/RichTextEditor';
import CMSLayout from '@/cms/layouts/CMSLayout';
import type { LegalPage } from '@/cms/types/cms';

interface Props {
    pages: LegalPage[];
}

const errorStyle: React.CSSProperties = {
    marginTop: 4,
    display: 'block',
    color: '#FF8080',
    fontSize: '0.78rem',
};

function LegalPageForm({ page }: { page: LegalPage }) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        title: page.title,
        content: page.content,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('legal-pages-update', { slug: page.slug }), {
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="section-card">
                <div className="form-group">
                    <label>Page Title</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => {
                            clearErrors('title');
                            setData('title', e.target.value);
                        }}
                    />
                    {errors.title && (
                        <span style={errorStyle}>{errors.title}</span>
                    )}
                </div>

                <div className="form-group">
                    <label>Content</label>
                    <RichTextEditor
                        value={data.content}
                        onChange={(html) => {
                            clearErrors('content');
                            setData('content', html);
                        }}
                        placeholder="Page content..."
                    />
                    {errors.content && (
                        <span style={errorStyle}>{errors.content}</span>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={processing}
                >
                    {processing ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}

export default function LegalPagesIndex({ pages }: Props) {
    const [activeSlug, setActiveSlug] = useState(pages[0]?.slug);
    const activePage = pages.find((p) => p.slug === activeSlug);

    return (
        <CMSLayout title="Legal Pages" breadcrumb="Legal Pages">
            <div className="page-header">
                <h2>Legal Pages</h2>
                <p>
                    Edit the Privacy Policy, Terms of Service and Refund Policy
                    pages linked from the website footer
                </p>
                <div className="gold-line" />
            </div>

            <div
                style={{
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                    marginBottom: 16,
                }}
            >
                {pages.map((page) => (
                    <button
                        key={page.slug}
                        type="button"
                        className={
                            page.slug === activeSlug
                                ? 'btn-primary'
                                : 'btn-secondary'
                        }
                        onClick={() => setActiveSlug(page.slug)}
                    >
                        {page.title}
                    </button>
                ))}
            </div>

            {activePage && (
                <LegalPageForm key={activePage.slug} page={activePage} />
            )}
        </CMSLayout>
    );
}
