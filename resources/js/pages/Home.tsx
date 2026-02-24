import AboutSection from '@/components/home/AboutSection';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import HeroImageCollage from '@/components/home/HeroImageCollage';
import SearchSection from '@/components/home/SearchSection';
import SisterCompanies from '@/components/home/SisterCompanies';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import AppLayout from '@/layouts/AppLayout';
import FavoriteProperties from "@/components/home/FavoriteProperties";

const Home = () => {
    return (
        <AppLayout>
            <div className="bg-background min-h-screen">
                {/* Hero Image Collage */}
                <HeroImageCollage />

                {/* Interactive Search Section */}
                <SearchSection />

                {/* About Us with Services */}
                <AboutSection />

                {/* Featured Properties Carousel */}
                <FeaturedProperties />

                {/* Favorite Properties Section */}
                <FavoriteProperties />

                {/* Client Testimonials */}
                <TestimonialsSection />

                {/* Sister Companies Showcase */}
                <SisterCompanies />
            </div>
        </AppLayout>
    );
};

export default Home;
