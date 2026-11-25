import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';
import type {
    AboutPageContent,
    CompanyStats,
    HomeAboutContent,
} from '@/types/PageContent';

interface Props {
    sections: {
        about_page: AboutPageContent;
        home_about: HomeAboutContent;
        company_stats: CompanyStats;
    };
}

type Path = (string | number)[];

const errorStyle: React.CSSProperties = {
    marginTop: 4,
    display: 'block',
    color: '#FF8080',
    fontSize: '0.78rem',
};

const hintStyle: React.CSSProperties = {
    marginTop: 6,
    fontSize: '0.72rem',
    color: 'var(--muted)',
};

/** Returns a copy of `obj` with the value at `path` replaced. */
function setIn<T>(obj: T, path: Path, value: unknown): T {
    const copy = structuredClone(obj) as Record<string | number, unknown>;
    let cursor = copy;
    path.slice(0, -1).forEach((key) => {
        cursor = cursor[key] as Record<string | number, unknown>;
    });
    cursor[path[path.length - 1]] = value;

    return copy as T;
}

function FieldError({ message }: { message?: string }) {
    return message ? <span style={errorStyle}>{message}</span> : null;
}

function Field({
    label,
    value,
    onChange,
    error,
    multiline = false,
    hint,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    multiline?: boolean;
    hint?: string;
}) {
    return (
        <div className="form-group">
            <label>{label}</label>
            {multiline ? (
                <textarea
                    rows={3}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
            <FieldError message={error} />
            {hint && <p style={hintStyle}>{hint}</p>}
        </div>
    );
}

function SectionCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="section-card">
            <div className="section-title">{title}</div>
            {children}
        </div>
    );
}

function SaveButton({ processing }: { processing: boolean }) {
    return (
        <button type="submit" className="btn-primary" disabled={processing}>
            {processing ? 'Saving...' : 'Save Changes'}
        </button>
    );
}

function StatsForm({ initial }: { initial: CompanyStats }) {
    const { data, setData, post, processing, errors } = useForm<CompanyStats>({
        stats: initial.stats,
        group_stats: initial.group_stats,
    });
    const err = errors as Record<string, string>;
    const update = (path: Path, value: string) =>
        setData((prev) => setIn(prev, path, value));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('page-content-update', { key: 'company_stats' }), {
            preserveScroll: true,
        });
    };

    const renderList = (field: 'stats' | 'group_stats') =>
        data[field].map((stat, i) => (
            <div className="form-row cols-2" key={i}>
                <Field
                    label={`Stat ${i + 1}: Value`}
                    value={stat.value}
                    onChange={(v) => update([field, i, 'value'], v)}
                    error={err[`${field}.${i}.value`]}
                />
                <Field
                    label={`Stat ${i + 1}: Label`}
                    value={stat.label}
                    onChange={(v) => update([field, i, 'label'], v)}
                    error={err[`${field}.${i}.label`]}
                />
            </div>
        ));

    return (
        <form onSubmit={submit}>
            <SectionCard title="Company Stats (About page & Home About section)">
                {renderList('stats')}
            </SectionCard>
            <SectionCard title="Sister Companies Stats (Home page)">
                {renderList('group_stats')}
            </SectionCard>
            <SaveButton processing={processing} />
        </form>
    );
}

type AboutForm = Omit<AboutPageContent, 'md_image' | 'md_image_url'> & {
    md_image_file: File | null;
};

function AboutForm({ initial }: { initial: AboutPageContent }) {
    const { data, setData, post, processing, errors } = useForm<AboutForm>({
        hero_title: initial.hero_title,
        hero_subtitle: initial.hero_subtitle,
        hero_credentials: initial.hero_credentials,
        story_heading: initial.story_heading,
        story_paragraphs: initial.story_paragraphs,
        years_value: initial.years_value,
        years_label: initial.years_label,
        values_heading: initial.values_heading,
        values_intro: initial.values_intro,
        values: initial.values,
        md_title: initial.md_title,
        md_name: initial.md_name ?? '',
        md_summary: initial.md_summary,
        md_image_file: null,
        cta_heading: initial.cta_heading,
        cta_text: initial.cta_text,
    });
    const err = errors as Record<string, string>;
    const update = (path: Path, value: unknown) =>
        setData((prev) => setIn(prev, path, value));
    const text = (
        key: keyof AboutForm,
        label: string,
        multiline = false,
        hint?: string,
    ) => (
        <Field
            label={label}
            value={data[key] as string}
            onChange={(v) => update([key], v)}
            error={err[key]}
            multiline={multiline}
            hint={hint}
        />
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('page-content-update', { key: 'about_page' }), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <form onSubmit={submit}>
            <SectionCard title="Hero">
                {text('hero_title', 'Headline')}
                {text('hero_subtitle', 'Sub-line', true)}
                {text(
                    'hero_credentials',
                    'Credentials',
                    false,
                    'Separate items with " · ", e.g. Since 2013 · REHAB Member. Leave empty to hide.',
                )}
            </SectionCard>

            <SectionCard title="Our Story">
                {text('story_heading', 'Heading')}
                {data.story_paragraphs.map((paragraph, i) => (
                    <Field
                        key={i}
                        label={`Paragraph ${i + 1}`}
                        value={paragraph}
                        onChange={(v) => update(['story_paragraphs', i], v)}
                        error={err[`story_paragraphs.${i}`]}
                        multiline
                    />
                ))}
                <div className="form-row cols-2">
                    {text('years_value', 'Badge Value (e.g. 13+)')}
                    {text('years_label', 'Badge Label')}
                </div>
            </SectionCard>

            <SectionCard title="Management (Managing Director)">
                <div className="form-row cols-2">
                    {text('md_title', 'Designation')}
                    {text(
                        'md_name',
                        'Name',
                        false,
                        'Leave empty to show the designation only.',
                    )}
                </div>
                {text('md_summary', 'Summary', true)}
                <div className="form-group">
                    <label>Photo</label>
                    {initial.md_image_url && (
                        <img
                            src={initial.md_image_url}
                            alt="Current MD"
                            style={{
                                width: 120,
                                borderRadius: 8,
                                marginBottom: 8,
                            }}
                        />
                    )}
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) =>
                            update(
                                ['md_image_file'],
                                e.target.files?.[0] ?? null,
                            )
                        }
                    />
                    <FieldError message={err.md_image_file} />
                    <p style={hintStyle}>
                        Optional. JPG, PNG or WebP, up to 4 MB. If none is
                        uploaded, the photo from the MD&apos;s Message page is
                        used.
                    </p>
                </div>
            </SectionCard>

            <SectionCard title="Our Values">
                {text('values_heading', 'Heading')}
                {text('values_intro', 'Intro', true)}
                {data.values.map((value, i) => (
                    <div className="form-row cols-2" key={i}>
                        <Field
                            label={`Value ${i + 1}: Title`}
                            value={value.title}
                            onChange={(v) => update(['values', i, 'title'], v)}
                            error={err[`values.${i}.title`]}
                        />
                        <Field
                            label={`Value ${i + 1}: Description`}
                            value={value.description}
                            onChange={(v) =>
                                update(['values', i, 'description'], v)
                            }
                            error={err[`values.${i}.description`]}
                        />
                    </div>
                ))}
            </SectionCard>

            <SectionCard title="Call to Action">
                {text('cta_heading', 'Heading')}
                {text('cta_text', 'Text', true)}
            </SectionCard>

            <SaveButton processing={processing} />
        </form>
    );
}

function HomeForm({ initial }: { initial: HomeAboutContent }) {
    const { data, setData, post, processing, errors } =
        useForm<HomeAboutContent>({ ...initial });
    const err = errors as Record<string, string>;
    const update = (path: Path, value: string) =>
        setData((prev) => setIn(prev, path, value));
    const text = (
        key: keyof HomeAboutContent,
        label: string,
        multiline = false,
    ) => (
        <Field
            label={label}
            value={data[key] as string}
            onChange={(v) => update([key], v)}
            error={err[key]}
            multiline={multiline}
        />
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('page-content-update', { key: 'home_about' }), {
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={submit}>
            <SectionCard title="About Section Header">
                {text('heading', 'Heading')}
                {text('intro', 'Intro', true)}
            </SectionCard>

            <SectionCard title="Service Cards">
                {data.services.map((service, i) => (
                    <div className="form-row cols-2" key={i}>
                        <Field
                            label={`Service ${i + 1}: Title`}
                            value={service.title}
                            onChange={(v) =>
                                update(['services', i, 'title'], v)
                            }
                            error={err[`services.${i}.title`]}
                        />
                        <Field
                            label={`Service ${i + 1}: Description`}
                            value={service.description}
                            onChange={(v) =>
                                update(['services', i, 'description'], v)
                            }
                            error={err[`services.${i}.description`]}
                        />
                    </div>
                ))}
            </SectionCard>

            <SectionCard title="Why Choose Us">
                {text('why_heading', 'Heading')}
                {text('why_text', 'Text', true)}
                {data.features.map((feature, i) => (
                    <div className="form-row cols-2" key={i}>
                        <Field
                            label={`Card ${i + 1}: Highlight (e.g. 13+ Years)`}
                            value={feature.stat}
                            onChange={(v) => update(['features', i, 'stat'], v)}
                            error={err[`features.${i}.stat`]}
                        />
                        <Field
                            label={`Card ${i + 1}: Title`}
                            value={feature.title}
                            onChange={(v) =>
                                update(['features', i, 'title'], v)
                            }
                            error={err[`features.${i}.title`]}
                        />
                        <Field
                            label={`Card ${i + 1}: Description`}
                            value={feature.description}
                            onChange={(v) =>
                                update(['features', i, 'description'], v)
                            }
                            error={err[`features.${i}.description`]}
                        />
                    </div>
                ))}
            </SectionCard>

            <SectionCard title="Call to Action">
                {text('cta_heading', 'Heading')}
                {text('cta_text', 'Text', true)}
            </SectionCard>

            <SaveButton processing={processing} />
        </form>
    );
}

const TABS = [
    { key: 'about_page', label: 'About Page' },
    { key: 'home_about', label: 'Home Page' },
    { key: 'company_stats', label: 'Stats' },
] as const;

export default function PageContentIndex({ sections }: Props) {
    const [active, setActive] =
        useState<(typeof TABS)[number]['key']>('about_page');

    return (
        <CMSLayout title="Page Content" breadcrumb="Page Content">
            <div className="page-header">
                <h2>Page Content</h2>
                <p>
                    Edit the text and stats shown on the About page and the Home
                    page
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
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        className={
                            active === tab.key ? 'btn-primary' : 'btn-secondary'
                        }
                        onClick={() => setActive(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {active === 'about_page' && (
                <AboutForm initial={sections.about_page} />
            )}
            {active === 'home_about' && (
                <HomeForm initial={sections.home_about} />
            )}
            {active === 'company_stats' && (
                <StatsForm initial={sections.company_stats} />
            )}
        </CMSLayout>
    );
}
