import type { Location } from './Location';
import type { ProjectTypes } from "./ProjectTypes";

interface Tag {
    id: number;
    name: string;
    slug: string;
    description?: string;
}

interface Details
{
    id: number;
    bedroom: string;
    bathroom: string;
    apartment_size: string;
    apartment_direction: string;
}

interface Image
{
    id: number;
    path: string;
}

interface Location
{
    id: number;
    name: string;
}

export interface ProjectThumb
{
    id: number;
    name: string;
    address: string | null;
    floors: string | null;
    size: string | null;
    slug: string;
    tags?: Tag[] | null;
    details?: Details | null;
    image?: Image | null;
    locations?: Location;
    projectType: ProjectTypes;
    location: Location;
}
