import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Building2,
  ArrowUpRight,
  Clock
} from "lucide-react";
import React from 'react';
import abstractBg2 from "@/assets/images/backgrounds/abstract-bg-2.jpg";
import logo from "@/assets/images/logo/alliance logo.webp";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "About Us", href: "#about" },
    { label: "Properties", href: "#properties" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" }
  ];

  const properties = [
    { label: "Residential Properties", href: "#residential" },
    { label: "Commercial Spaces", href: "#commercial" },
    { label: "Luxury Estates", href: "#luxury" },
    { label: "Investment Opportunities", href: "#investment" },
    { label: "Pre-Launch Projects", href: "#prelaunch" }
  ];

  const services = [
    { label: "Property Development", href: "#development" },
    { label: "Real Estate Consulting", href: "#consulting" },
    { label: "Property Management", href: "#management" },
    { label: "Investment Advisory", href: "#advisory" },
    { label: "Legal Documentation", href: "#legal" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#facebook", label: "Facebook" },
    { icon: Twitter, href: "#twitter", label: "Twitter" },
    { icon: Instagram, href: "#instagram", label: "Instagram" },
    { icon: Linkedin, href: "#linkedin", label: "LinkedIn" },
    { icon: Youtube, href: "#youtube", label: "YouTube" }
  ];

  return (
    <footer
      className="text-primary-foreground relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${abstractBg2})`, backgroundAttachment: 'fixed', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center space-x-3">
                <img src={logo} alt="EstateElite Logo" className="h-12 w-12" />
                <span className="text-xl font-bold text-white">Alliance Builders Ltd.</span>
              </div>
              <p className="text-white/90 leading-relaxed drop-shadow-md">
                Premier real estate company delivering exceptional properties and unmatched service.
                Your trusted partner in finding the perfect property investment.
              </p>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">24/7 Hotline</div>
                    <div className="text-white/80 drop-shadow-sm">+1 (555) 123-4567</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Email Us</div>
                    <div className="text-white/80 drop-shadow-sm">info@estateeelite.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Visit Our Office</div>
                    <div className="text-white/80 drop-shadow-sm">123 Business Ave, Suite 100<br />Downtown District, NY 10001</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/80 hover:text-accent transition-colors duration-300 flex items-center group drop-shadow-sm"
                    >
                      <ArrowUpRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Office Hours */}
              <div className="mt-8">
                <h4 className="font-semibold text-white mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-white" />
                  Office Hours
                </h4>
                <div className="text-sm text-white/80 space-y-1 drop-shadow-sm">
                  <div>Monday - Friday: 9:00 AM - 7:00 PM</div>
                  <div>Saturday: 9:00 AM - 5:00 PM</div>
                  <div>Sunday: 10:00 AM - 4:00 PM</div>
                </div>
              </div>
            </div>

            {/* Properties */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Properties</h3>
              <ul className="space-y-3">
                {properties.map((property) => (
                  <li key={property.label}>
                    <a
                      href={property.href}
                      className="text-white/80 hover:text-accent transition-colors duration-300 flex items-center group drop-shadow-sm"
                    >
                      <Building2 className="h-4 w-4 mr-2 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                      {property.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services & Newsletter */}
            <div className="space-y-6 lg:col-span-1">
              <h3 className="text-xl font-bold text-white">Services</h3>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.label}>
                    <a
                      href={service.href}
                      className="text-white/80 hover:text-accent transition-colors duration-300 flex items-center group drop-shadow-sm"
                    >
                      <ArrowUpRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {service.label}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Newsletter */}
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hidden md:hidden lg:block h-fit">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-white mb-3 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-accent" />
                    Newsletter
                  </h4>
                  <p className="text-sm text-white/80 mb-4 drop-shadow-sm">
                    Get the latest property updates and market insights delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                    />
                    <Button className="w-full bg-accent hover:bg-accent-dark text-accent-foreground">
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>

          <Card className="mt-8 bg-white/10 border-white/20 backdrop-blur-sm lg:hidden">
            <CardContent className="p-6">
              <h4 className="font-semibold text-white mb-3 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-accent" />
                Newsletter
              </h4>
              <p className="text-sm text-white/80 mb-4 drop-shadow-sm">
                Get the latest property updates and market insights delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                />
                <Button className="w-full bg-accent hover:bg-accent-dark text-accent-foreground">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="bg-white/20" />

        {/* Bottom Footer */}
        <div className="py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-white/90 drop-shadow-sm">
                © 2024 Alliance Builders Ltd. All rights reserved. |
                <a href="#privacy" className="text-white hover:text-accent-light ml-1">Privacy Policy</a> |
                <a href="#terms" className="text-white hover:text-accent-light ml-1">Terms of Service</a>
              </p>
              <p className="text-sm text-white/70 mt-1 drop-shadow-sm">
                A proud member of REHAB | ISO 9001 : 2015 QMS Certified
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-white/80 text-sm mr-2 drop-shadow-sm">Follow Us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-3 bg-white/10 hover:bg-accent/20 border border-white/20 hover:border-accent/50 rounded-lg transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 text-white/80 group-hover:text-accent transition-colors duration-300" />
                </a>
              ))}
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
