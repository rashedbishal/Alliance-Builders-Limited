interface Tag {
    id: number;
    name: string;
    slug: string;
    description?: string;
}

interface Details {
    id: number;
    apartment_size: string | null;
    bedroom: string | null;
    bathroom: string | null;
    balcony: string | null;
    kitchen: string | null;
    living_dining: string | null;
    parking: string | null;
    garage_no: string | null;
    garage_size: string | null;
    apartment_direction: string | null;
    youtube_video_id: string | null;
}

interface Facilities
{
    id: number;
    name: string;
}

interface ProjectImages
{
    id: number;
    image: string;
}

export interface Project
{
    id: number;
    name: string;
    location: string | null;
    google_map_url: string | null;
    floors: string | null;
    size: string | null;
    description: string | null;
    surroundings: string | null;
    price: number | null;
    construction_start_date: string | null;
    handover_date: string | null;
    isFeatured: boolean;
    project_id: string;
    tag?: Tag[] | null;
    details?: Details | null;
    facilities?: Facilities[] | null;
    project_images?: ProjectImages[] | null;
}