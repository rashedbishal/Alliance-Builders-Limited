import { Award, Users, Building, TrendingUp, Target, Eye, Heart } from 'lucide-react';
import bg3 from "@/assets/images/backgrounds/bg3.png";
import collage6 from "@/assets/images/collage/collage-6.jpg";
import property3 from "@/assets/images/properties/property-3.jpg";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { SplittingText } from '@/components/ui/shadcn-io/splitting-text';
import { WritingText } from '@/components/ui/shadcn-io/writing-text';
import AppLayout from '@/layouts/AppLayout';
import ScrollAnimation from '../components/ScrollAnimation';


const About = () => {
    const stats = [
        { icon: Building, value: "500+", label: "Properties Sold" },
        { icon: Users, value: "10,000+", label: "Happy Clients" },
        { icon: Award, value: "50+", label: "Awards Won" },
        { icon: TrendingUp, value: "98%", label: "Client Satisfaction" }
    ];

    const values = [
        {
            icon: Target,
            title: "Excellence",
            description: "We strive for excellence in every transaction, ensuring the highest standards of service and professionalism."
        },
        {
            icon: Eye,
            title: "Transparency",
            description: "Complete honesty and openness in all our dealings, building trust through transparent communication."
        },
        {
            icon: Heart,
            title: "Integrity",
            description: "We uphold the highest ethical standards, putting our clients' interests first in every decision."
        }
    ];

    const team = [
        {
            name: "Sarah Johnson",
            role: "CEO & Founder",
            image: bg3
        },
        {
            name: "Michael Chen",
            role: "Chief Property Officer",
            image: bg3
        },
        {
            name: "Emily Rodriguez",
            role: "Head of Sales",
            image: bg3
        },
        {
            name: "David Thompson",
            role: "Marketing Director",
            image: bg3
        }
    ];

    return (
        <AppLayout>
            <div className="min-h-screen bg-black">
                {/* Hero Section */}
                <section
                    style={{
                        backgroundImage: `url(${property3})`,
                        backgroundAttachment: 'fixed',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                    className="relative h-screen overflow-hidden pt-32 pb-20"
                >
                    <div className="bg-gradient-hero absolute inset-0 opacity-20"></div>
                    <div className="relative z-10 container mx-auto px-4">
                        <ScrollAnimation>
                            <Badge className="text-lg bg-gradient-accent mb-6 text-accent-foreground">About Us</Badge>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.1} className="md:w-[80%] lg:w-[75%]">
                            <SplittingText
                                className="lg:9xl mb-6 text-5xl font-semibold text-white md:text-7xl"
                                text="Building Dreams,"
                                type="words"
                            />
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.2} className="mb-6 md:w-[75%] lg:w-[55%]">
                            <SplittingText
                                className="lg:9xl mb-6 text-5xl font-semibold text-white md:text-7xl"
                                text="One Home At A Time"
                                type="words"
                            />
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.2} className="md:w-[80%] lg:w-[60%]">
                            <p>
                                <WritingText
                                    className="max-w-3xl text-xl text-white"
                                    text="Founded in 2003, EstateElite began with a simple mission: to revolutionize the real estate experience by putting people first. What started as a small team of passionate realtors has grown into one of the most trusted names in luxury real estate."
                                    spacing={4}
                                />
                            </p>
                        </ScrollAnimation>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="mx-auto w-full bg-gradient-navy py-20">
                    <div
                        className="container mx-auto
                                  rounded-3xl
                                  bg-gradient-to-br from-slate-950/80 via-black/90 to-slate-950/80
                                  p-10 px-5
                                  backdrop-blur-xl
                                  border border-white/5
                                  shadow-2xl shadow-black/70"
                    >
                        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
                            {stats.map((stat, index) => (
                                <ScrollAnimation key={index} delay={index * 0.12}>
                                    <div
                                        className="group relative
                                                  rounded-2xl
                                                  bg-gradient-to-br from-slate-800/40 via-slate-900/40 to-black/50
                                                  p-1.5
                                                  transition-all duration-500
                                                  hover:scale-[1.06] hover:-translate-y-1.5"
                                    >
                                        {/* Main card with inset + outer shadow combo */}
                                        <Card
                                            className="
                relative overflow-hidden
                h-full
                bg-gradient-to-b from-slate-800/70 to-slate-950/80
                backdrop-blur-lg
                border border-white/6
                shadow-[0_8px_32px_-12px_rgba(0,0,0,0.9),inset_0_2px_1px_rgba(255,255,255,0.07),inset_0_-2px_1px_rgba(0,0,0,0.6)]
                transition-all duration-500
                group-hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,1),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-3px_2px_rgba(0,0,0,0.7)]
              "
                                        >
                                            <CardContent className="relative z-10 flex flex-col items-center justify-center p-8 text-center">
                                                {/* Icon container with subtle glow */}
                                                <div
                                                    className="
                    relative mb-5
                    rounded-full
                    bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-violet-600/20
                    p-4
                    shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]
                    group-hover:shadow-[0_0_30px_-4px_rgba(99,102,241,0.7)]
                    transition-shadow duration-700
                  "
                                                >
                                                    <div
                                                        className="
                      absolute inset-0 rounded-full
                      bg-gradient-to-br from-indigo-400/10 to-purple-500/10
                      blur-xl opacity-60
                      group-hover:opacity-80
                      transition-opacity
                    "
                                                    />
                                                    <stat.icon className="h-9 w-9 text-indigo-300/90" />
                                                </div>

                                                {/* Value with subtle gradient text */}
                                                <div
                                                    className="
                    mb-3 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200
                    bg-clip-text text-4xl md:text-5xl font-extrabold
                    text-transparent
                  "
                                                >
                                                    {stat.value}
                                                </div>

                                                <div className="text-sm md:text-base text-slate-400/90 font-medium tracking-wide">
                                                    {stat.label}
                                                </div>
                                            </CardContent>

                                            {/* Very subtle shine overlay on hover */}
                                            <div
                                                className="
                  pointer-events-none absolute inset-0
                  rounded-2xl
                  bg-gradient-to-tr from-white/5 via-transparent to-transparent
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-700
                "
                                            />
                                        </Card>
                                    </div>
                                </ScrollAnimation>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Our Story */}
                <section className="bg-black py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                            <ScrollAnimation>
                                <div>
                                    <Badge className="text-lg bg-gradient-accent mb-6 text-accent-foreground">Our Story</Badge>
                                    <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">Two Decades of Excellence in Real Estate</h2>
                                    <p className="mb-6 leading-relaxed text-white">
                                        <WritingText
                                            text="Founded in 2003, EstateElite began with a simple mission: to revolutionize the real estate experience by putting people first. What started as a small team of passionate realtors has grown into one of the most trusted names in luxury real estate."
                                            spacing={5}
                                        />
                                    </p>
                                    <p className="leading-relaxed text-white">
                                        <WritingText
                                            text="Our success is built on understanding that buying or selling a property is more than a transaction—it's a life-changing decision. That's why we take the time to understand your unique needs, aspirations, and dreams, ensuring every step of your journey is smooth and rewarding."
                                            spacing={5}
                                        />
                                    </p>
                                </div>
                            </ScrollAnimation>
                            <ScrollAnimation delay={0.2}>
                                <div className="relative">
                                    <img src={collage6} alt="Our Office" className="shadow-elegant-xl h-[500px] w-full rounded-2xl object-cover" />
                                    <div className="bg-gradient-elegant shadow-elegant-lg absolute -bottom-6 -left-6 rounded-2xl p-8 text-primary-foreground">
                                        <div className="mb-2 text-5xl font-bold">20+</div>
                                        <div className="text-lg">Years of Excellence</div>
                                    </div>
                                </div>
                            </ScrollAnimation>
                        </div>
                    </div>
                </section>

                {/* Our Values */}
                <section className="bg-gradient-hero py-20">
                    <div className="container mx-auto px-4">
                        <ScrollAnimation className="mb-16 text-center">
                            <div>
                                <Badge className="text-lg bg-gradient-accent mb-6 text-accent-foreground">Our Values</Badge>
                                <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">What Drives Us Forward</h2>
                                <p className="mx-auto max-w-3xl text-xl text-white">
                                    Our core values shape everything we do and guide us in serving our clients better every day.
                                </p>
                            </div>
                        </ScrollAnimation>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {values.map((value, index) => (
                                <ScrollAnimation key={index} delay={index * 0.15}>
                                    <Card className="shadow-elegant hover:shadow-elegant-lg group bg-white/80 text-center transition-all duration-500">
                                        <CardContent className="p-8">
                                            <div className="bg-gradient-elegant mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110">
                                                <value.icon className="h-10 w-10 text-primary-foreground" />
                                            </div>
                                            <h3 className="mb-4 text-2xl font-bold text-black transition-colors group-hover:text-primary">
                                                {value.title}
                                            </h3>
                                            <p className="leading-relaxed text-muted-foreground">{value.description}</p>
                                        </CardContent>
                                    </Card>
                                </ScrollAnimation>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                {/*<section className="py-20">*/}
                {/*    <div className="container mx-auto px-4">*/}
                {/*        <ScrollAnimation className="mb-16 text-center">*/}
                {/*            <div>*/}
                {/*                <Badge className="bg-gradient-accent mb-6 text-accent-foreground">Our Team</Badge>*/}
                {/*                <h2 className="mb-6 text-4xl font-bold text-primary md:text-5xl">Meet Our Leadership</h2>*/}
                {/*                <p className="mx-auto max-w-3xl text-xl text-muted-foreground">*/}
                {/*                    Our experienced team of professionals is dedicated to making your real estate dreams a reality.*/}
                {/*                </p>*/}
                {/*            </div>*/}
                {/*        </ScrollAnimation>*/}

                {/*        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">*/}
                {/*            {team.map((member, index) => (*/}
                {/*                <ScrollAnimation key={index} delay={index * 0.1}>*/}
                {/*                    <Card className="shadow-elegant hover:shadow-elegant-lg group overflow-hidden transition-all duration-500">*/}
                {/*                        <div className="relative overflow-hidden">*/}
                {/*                            <img*/}
                {/*                                src={member.image}*/}
                {/*                                alt={member.name}*/}
                {/*                                className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-110"*/}
                {/*                            />*/}
                {/*                            <div className="bg-gradient-hero absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-60"></div>*/}
                {/*                        </div>*/}
                {/*                        <CardContent className="p-6 text-center">*/}
                {/*                            <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-primary">{member.name}</h3>*/}
                {/*                            <p className="text-muted-foreground">{member.role}</p>*/}
                {/*                        </CardContent>*/}
                {/*                    </Card>*/}
                {/*                </ScrollAnimation>*/}
                {/*            ))}*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</section>*/}

                {/* CTA Section */}
                <section className="bg-black py-20 text-primary-foreground">
                    <div className="container mx-auto px-4 text-center">
                        <ScrollAnimation>
                            <h2 className="mb-6 text-4xl font-bold md:text-5xl">Ready to Start Your Journey?</h2>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.1}>
                            <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
                                Let's find your dream property together. Our team is ready to help you every step of the way.
                            </p>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.2}>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <a href="/contact">
                                    <button className="shadow-elegant rounded-lg bg-background px-8 py-4 font-semibold text-foreground transition-transform duration-300 hover:scale-105">
                                        Contact Us Today
                                    </button>
                                </a>
                                <a href="/properties">
                                    <button className="rounded-lg border-2 border-primary-foreground bg-transparent px-8 py-4 font-semibold text-primary-foreground transition-all duration-300 hover:bg-blue-400 hover:border-blue-400 hover:text-black">
                                        Browse Properties
                                    </button>
                                </a>
                            </div>
                        </ScrollAnimation>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default About;
