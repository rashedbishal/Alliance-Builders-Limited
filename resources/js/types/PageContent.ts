export interface StatItem {
    value: string;
    label: string;
}

export interface TitledItem {
    title: string;
    description: string;
}

export interface CompanyStats {
    stats: StatItem[];
    group_stats: StatItem[];
}

export interface AboutPageContent {
    hero_title: string;
    hero_subtitle: string;
    hero_credentials: string;
    story_heading: string;
    story_paragraphs: string[];
    years_value: string;
    years_label: string;
    values_heading: string;
    values_intro: string;
    values: TitledItem[];
    md_title: string;
    md_name: string;
    md_summary: string;
    md_image: string | null;
    md_image_url: string | null;
    cta_heading: string;
    cta_text: string;
}

export interface HomeAboutContent {
    heading: string;
    intro: string;
    services: TitledItem[];
    why_heading: string;
    why_text: string;
    features: (TitledItem & { stat: string })[];
    cta_heading: string;
    cta_text: string;
}
