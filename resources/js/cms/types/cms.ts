export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Carousel {
  id: number;
  property_name: string;
  description: string;
  image: string;
}

export interface GalleryType {
  id: number;
  type: string;
  images: GalleryImage[];
  videos: GalleryVideo[];
}

export interface GalleryImage {
  id: number;
  path: string;
  title: string;
  description: string;
  imageable_id: number;
}

export interface GalleryVideo {
  id: number;
  path: string;
  title: string;
  description: string;
  videoable_id: number;
}

export interface MediaCoverage {
  id: number;
  media_title: string;
  media_type: string;
  news_hyperlink: string;
  isFeatured: boolean;
  image?: { path: string };
}

export interface Popup {
  id: number;
  isEnabled: boolean;
  imagePath?: string;
}

export interface ProjectType {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
}

export interface Facility {
  id: number;
  name: string;
}

export interface Tag {
    id: number;
    name: string;
    slug?: string;
    description?: string;
}
export interface ProjectDetails {
  apartment_size?: string;
  bedroom?: string;
  bathroom?: string;
  balcony?: string;
  kitchen?: string;
  living_dining?: string;
  parking?: string;
  garage_no?: string;
  garage_size?: string;
  apartment_direction?: string;
  youtube_video_id?: string;
}

export interface ProjectImage {
    id: number;
    image: string; // full path e.g. "storage/properties/handoverProject/file.jpg"
}

export interface Project {
    id: number;
    name: string;
    address?: string;
    google_map_url?: string;
    floors?: string;
    size?: string;
    description?: string;
    surroundings?: string;
    price?: number;
    construction_start_date?: string;
    handover_date?: string;
    isFeatured?: boolean;
    project_id: string;
    project_type_id: number;
    location_id: number;
    slug: string;
    details?: ProjectDetails;
    tags?: Tag[];
    facilities?: Facility[];
    location?: Location;
    projectType?: ProjectType;
    image?: { path: string };
    project_images?: ProjectImage[];
}
