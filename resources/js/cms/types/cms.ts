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
  project_id?: number | null;
  project?: {
    id: number;
    name: string;
    slug: string;
  };
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

export interface LegalPage {
  id: number;
  slug: string;
  title: string;
  content: string;
}

export interface SiteSetting {
  id: number;
  header_phone?: string | null;
  footer_phone?: string | null;
  footer_email?: string | null;
  whatsapp_number?: string | null;
  messenger_link?: string | null;
  trade_license_number?: string | null;
}

export interface Testimonial {
  id: number;
  name: string;
  role?: string | null;
  company?: string | null;
  rating: number;
  quote: string;
  property_type?: string | null;
  image?: string | null;
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

export interface CareerSettings {
  id: number;
  hero_image: string | null;
  heading: string | null;
  subtitle: string | null;
  no_openings_message: string | null;
  default_email: string | null;
}

export interface JobPost {
  id: number;
  title: string;
  department: string | null;
  location: string | null;
  job_type: string | null;
  vacancies: number | null;
  experience: string | null;
  salary: string | null;
  deadline: string | null;
  description: string;
  notification_email: string | null;
  is_active: boolean;
  applications_count?: number;
  created_at: string;
}

export interface JobApplication {
  id: number;
  job_post_id: number | null;
  job_title: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  cv_original_name: string;
  created_at: string;
}
