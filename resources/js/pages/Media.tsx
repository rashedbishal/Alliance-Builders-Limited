import { motion } from 'framer-motion';
import { Calendar, Newspaper, ArrowRight, Clock } from 'lucide-react';
import React, { useState } from 'react';

// Import media assets
import heroVideo from '@/assets/videos/PixVerse_V5_Image_Text_360P_Hero_section_video.mp4';

// import ui
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {Image} from "@/types/Image";

// import layout
import AppLayout from '@/layouts/AppLayout';
import {Link, usePage} from "@inertiajs/react";

interface Media
{
    media_title: string;
    media_type: string;
    news_hyperlink: string;
    isFeatured: boolean;
    created_date: string;
    image: Image;
}

const Media = () => {
    const { contents } = usePage<{contents: Media[]}>().props;
    const featuredContent = contents.find((content) => content.isFeatured) || contents[0];
    // const featuredContent = featuredContentArray[0];

    console.log("Contents", contents);
    console.log("featured content", featuredContent);

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="relative flex h-screen items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        <video autoPlay loop muted playsInline className="h-full w-full object-cover opacity-30">
                            <source src={heroVideo} type="video/mp4" />
                        </video>
                    </div>

                    <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <h1 className="mb-6 bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
                                Media Coverage
                            </h1>
                            <p className="mb-8 text-xl text-muted-foreground">
                                Latest news, press releases, and media coverage about Alliance Properties
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Media Content */}
                <section className="bg-gradient-soft w-full flex justify-center px-4 md:px-16 py-20">
                    <div className="space-y-8">
                        {/* Featured News */}
                        <div className="mb-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <Card className="group relative h-[500px] overflow-hidden border border-border/50 transition-all duration-500 hover:border-primary/50 hover:shadow-2xl">
                                    <img
                                        src={featuredContent.image.path}
                                        alt={featuredContent.image.title}
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent  transition-opacity duration-300" />

                                    {/* Content */}
                                    <div className="relative z-10 flex h-full flex-col justify-between p-8 lg:p-12">
                                        <div>
                                            <Badge className="mb-4 w-fit bg-gradient-navy px-4 py-1.5 text-sm backdrop-blur-sm">
                                                Featured
                                            </Badge>
                                        </div>
                                        <div>
                                            <Badge className="mb-4 w-fit bg-accent/80 text-black">{featuredContent.media_type}</Badge>
                                            <h2 className="mb-4 text-2xl font-bold text-white transition-colors lg:text-3xl">
                                                {featuredContent.media_title}
                                            </h2>
                                            <div className="mb-4 flex items-center gap-2 text-sm text-gray-200">
                                                <Calendar className="h-4 w-4" />
                                                {featuredContent.created_date}
                                            </div>
                                            <Link href={featuredContent.news_hyperlink} className="inline-flex max-w-fit items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:gap-3 hover:bg-primary/90">
                                                View Content
                                                <ArrowRight className="h-4 w-4 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        </div>

                        {/* All News Articles */}
                        <div>
                            <h2 className="mb-8 flex items-center gap-3 text-3xl font-bold">
                                <Newspaper className="h-8 w-8 text-primary" />
                                All News
                            </h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {contents.map((article, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <Card className="group relative h-80 overflow-hidden border border-border/50 transition-all duration-500 hover:border-primary/50 hover:shadow-2xl">
                                            <img
                                                src={article.image.path}
                                                alt={article.media_title}
                                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent  transition-opacity duration-300 " />

                                            {/* Badge */}
                                            <div className="absolute top-4 left-4 z-20">
                                                <Badge className="bg-accent/80 text-xs">{article.media_type}</Badge>
                                            </div>

                                            {/* Content */}
                                            <div className="relative z-10 flex h-full flex-col justify-end p-6">
                                                <div className="mb-3 flex items-center gap-2 text-xs text-gray-200">
                                                    <Calendar className="h-3 w-3" />
                                                    {article.created_date}
                                                </div>
                                                <h3 className="mb-4 line-clamp-2 text-lg font-bold text-white transition-colors">
                                                    {article.media_title}
                                                </h3>
                                                <Link href={article.news_hyperlink} className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition-all duration-300 hover:text-primary/80 hover:gap-3">
                                                    Read More
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default Media;
