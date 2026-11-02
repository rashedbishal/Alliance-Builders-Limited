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
