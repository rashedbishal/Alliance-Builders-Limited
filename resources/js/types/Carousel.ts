export interface Carousel {
    id: number;
    property_name: string;
    description?: string;
    image: string;
    project_id?: number | null;
    project?: {
        id: number;
        name: string;
        slug: string;
    };
}
