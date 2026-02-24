import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, ImageIcon, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/AppLayout';

// Import media assets
import heroVideo from '@/assets/videos/PixVerse_V5_Image_Text_360P_Hero_section_video.mp4';

import collage1 from '@/assets/images/collage/collage-1.jpg';
import collage2 from '@/assets/images/collage/collage-2.jpg';
import collage3 from '@/assets/images/collage/collage-3.jpg';
import collage4 from '@/assets/images/collage/collage-4.jpg';
import collage5 from '@/assets/images/collage/collage-5.jpg';
import collage6 from '@/assets/images/collage/collage-6.jpg';
import collage7 from '@/assets/images/collage/collage-7.jpg';
import collage8 from '@/assets/images/collage/collage-8.jpg';
import {Images} from "@/types/Images";
import {usePage} from "@inertiajs/react";

type GalleryType = 'handover' | 'inauguration' | 'construction' | 'events';

interface GalleryCategory {
    id: GalleryType;
    title: string;
    description: string;
}

interface Videos
{
    id: number;
    path: string;
    title: string;
    description: string;
    created_at: string;
}

interface Galleries
{
    id: number;
    type: string;
    images: Images[];
    videos: Videos[];
}

const Gallery = () => {
    const [selectedMedia, setSelectedMedia] = useState<{ type: 'video' | 'image'; src: string; title: string } | null>(null);
    const [activeGallery, setActiveGallery] = useState<GalleryType>('handover');
    const {galleries} = usePage<{ galleries: Galleries[] }>().props;
    console.log(galleries);

    // mapping backend data to frontend type
    const typeMap: Record<string, GalleryType> = {
        "Project Handover": "handover",
        "Project Inauguration": "inauguration",
        "Construction Images": "construction",
        "Events & Activities": "events",
    };

    const galleryContent: Record<GalleryType, { images: any[]; videos: any[] }> =
        galleries.reduce((acc, gallery) => {
            const key = typeMap[gallery.type];

            if (!key) return acc;

            acc[key] = {
                videos: gallery.videos.map((vid) => ({
                    src: `/${vid.path}`, // IMPORTANT: prepend slash
                    title: vid.title ?? gallery.type,
                    date: new Date(vid.created_at).toLocaleDateString(),
                    description: vid.description,
                })),
                images: gallery.images.map((img) => ({
                    src: `/${img.path}`, // IMPORTANT: prepend slash
                    title: img.title ?? gallery.type,
                    date: new Date(img.created_at).toLocaleDateString(),
                    description: img.description,
                })),
            };

            return acc;
        }, {} as Record<GalleryType, { images: any[]; videos: any[] }>);

    const galleryCategories: GalleryCategory[] = [
        {
            id: 'handover',
            title: 'Project Handover',
            description: 'Completed projects handed over to residents and clients',
        },
        {
            id: 'inauguration',
            title: 'Project Inauguration',
            description: 'Official opening and inauguration ceremonies',
        },
        {
            id: 'construction',
            title: 'Construction Images',
            description: 'Behind-the-scenes construction progress',
        },
        {
            id: 'events',
            title: 'Events & Activity',
            description: 'Company events and corporate activities',
        },
    ];

    const currentContent = galleryContent[activeGallery] || { images: [], videos: [] };

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="relative flex h-[60vh] items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        <video autoPlay loop muted playsInline className="h-full w-full object-cover opacity-30">
                            <source src={heroVideo} type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background" />
                    </div>

                    <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <h1 className="mb-6 bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
                                Gallery
                            </h1>
                            <p className="mb-8 text-xl text-muted-foreground">
                                Explore our visual collection organized by project and event type
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Gallery Content with Sidebar */}
                <section className="container mx-auto px-4 py-20">
                    <div className="grid gap-8 lg:grid-cols-4">
                        {/* Sidebar Navigation */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-2">
                                <h3 className="mb-6 text-lg font-bold text-foreground">Gallery Types</h3>
                                {galleryCategories.map((category) => (
                                    <motion.button
                                        key={category.id}
                                        onClick={() => setActiveGallery(category.id)}
                                        className={`group relative w-full overflow-hidden rounded-lg px-4 py-3 text-left transition-all duration-300 ${
                                            activeGallery === category.id
                                                ? 'bg-primary text-primary-foreground shadow-lg'
                                                : 'bg-card/50 text-foreground hover:bg-card/80'
                                        }`}
                                        whileHover={{ x: 5 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{category.title}</span>
                                            {activeGallery === category.id && (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </div>
                                        <p className={`text-xs mt-1 ${
                                            activeGallery === category.id
                                                ? 'text-primary-foreground/80'
                                                : 'text-muted-foreground'
                                        }`}>
                                            {category.description}
                                        </p>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Main Gallery Content */}
                        <div className="lg:col-span-3">
                            <motion.div
                                key={activeGallery}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-12"
                            >
                                <Tabs defaultValue="images" className="w-full">
                                    <div className="mb-8 flex justify-start">
                                        <TabsList className="border border-border bg-background/50 p-2 backdrop-blur-lg">
                                            <TabsTrigger value="images" className="data-[state=active]:bg-primary/20">
                                                <ImageIcon className="mr-2 h-4 w-4" />
                                                Images
                                            </TabsTrigger>
                                            <TabsTrigger value="videos" className="data-[state=active]:bg-primary/20">
                                                <Video className="mr-2 h-4 w-4" />
                                                Videos
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    {/* Images Tab */}
                                    <TabsContent value="images">
                                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                            {currentContent.images.map((image, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                                >
                                                    <Card
                                                        className="group hover:shadow-elegant cursor-pointer overflow-hidden border-border bg-card/50 backdrop-blur-sm transition-all duration-300"
                                                        onClick={() => setSelectedMedia({ type: 'image', src: image.src, title: image.title })}
                                                    >
                                                        <div className="relative aspect-square overflow-hidden">
                                                            <img
                                                                src={image.src}
                                                                alt={image.title}
                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                            />
                                                            <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                                                    <h4 className="text-sm font-semibold text-white">{image.title}</h4>
                                                                    <p className="text-xs text-white/70">{image.date}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    {/* Videos Tab */}
                                    <TabsContent value="videos">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            {currentContent.videos.map((video, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                                >
                                                    <Card className="group hover:shadow-elegant overflow-hidden border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]">
                                                        <div
                                                            className="relative aspect-video cursor-pointer overflow-hidden"
                                                            onClick={() => setSelectedMedia({ type: 'video', src: video.src, title: video.title })}
                                                        >
                                                            <video
                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                muted
                                                            >
                                                                <source src={video.src} type="video/mp4" />
                                                            </video>
                                                            <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                                                                        <Video className="h-8 w-8 text-white" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="p-4">
                                                            <h3 className="mb-2 text-lg font-semibold">{video.title}</h3>
                                                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                                <span>{video.date}</span>
                                                                <span>{video.views} views</span>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Media Viewer Modal */}
                {selectedMedia && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur-xl"
                        onClick={() => setSelectedMedia(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-full max-w-6xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button
                                variant="ghost"
                                className="absolute -top-12 right-0 text-white hover:text-primary"
                                onClick={() => setSelectedMedia(null)}
                            >
                                ✕ Close
                            </Button>

                            {selectedMedia.type === 'video' ? (
                                <video controls autoPlay className="shadow-elegant w-full rounded-lg">
                                    <source src={selectedMedia.src} type="video/mp4" />
                                </video>
                            ) : (
                                <img src={selectedMedia.src} alt={selectedMedia.title} className="shadow-elegant w-full rounded-lg" />
                            )}

                            <div className="mt-4 text-center">
                                <h3 className="text-2xl font-bold">{selectedMedia.title}</h3>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default Gallery;
