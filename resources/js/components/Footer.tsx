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
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import abstractBg2 from "@/assets/images/backgrounds/city-7.webp";
import logo from "@/assets/images/logo/alliance logo.webp";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" }
  ];

  const projectStatus = [
    { label: "Handover", href: "/handover" },
    { label: "Ongoing", href: "/ongoing" },
    { label: "Upcoming", href: "/upcoming" },
    { label: "All Projects", href: "/projects" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/alliancebuilderslimited/", label: "Facebook" },
    { icon: Twitter, href: "https://x.com/alliancedhaka", label: "Twitter" },
    { icon: Instagram, href: "https://www.instagram.com/allianceconstructionbd/", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/alliance-builders-ltd/?originalSubdomain=bd", label: "LinkedIn" },
    { icon: Youtube, href: "https://www.youtube.com/@shahid549", label: "YouTube" }
  ];

  return (
    <footer
      className="text-primary-foreground relative overflow-hidden bg-cover bg-center bg-no-repeat pb-24"
      style={{ backgroundImage: `url(${abstractBg2})`, backgroundAttachment: 'fixed', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
                    <div className="text-white/80 drop-shadow-sm">+88-01928568853</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Email Us</div>
                    <div className="text-white/80 drop-shadow-sm">asad@alliancebuildersltd.org</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Visit Our Office</div>
                    <div className="text-white/80 drop-shadow-sm">House# 640 (1st Floor)<br />West Kazipara Mirpur, Dhaka-1216</div>
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
                    <Link
                      href={link.href}
                      className="text-white/80 hover:text-accent transition-colors duration-300 inline-flex items-center group drop-shadow-sm"
                    >
                      <ArrowUpRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {link.label}
                    </Link>
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
                  <div>Wed - Mon: 11:00 AM - 7:00 PM</div>
                  <div>Tuesday: Closed</div>
                </div>
              </div>
            </div>

            {/* Properties */}
            <div className="space-y-6 lg:col-span-1">
              <h3 className="text-xl font-bold text-white">Our Properties</h3>
              <ul className="space-y-3">
                {projectStatus.map((project) => (
                  <li key={project.label}>
                    <Link
                      href={project.href}
                      className="text-white/80 hover:text-accent transition-colors duration-300 inline-flex items-center group drop-shadow-sm"
                    >
                      <Building2 className="h-4 w-4 mr-2 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                      {project.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="bg-white/20" />

        {/* Bottom Footer */}
        <div className="pt-8 pb-12">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-white/90 drop-shadow-sm">
                © 2024 Alliance Builders Ltd. All rights reserved. |
                <Link href="/privacy-policy" className="text-white hover:text-accent-light ml-1">Privacy Policy</Link> |
                <Link href="/terms-of-service" className="text-white hover:text-accent-light ml-1">Terms of Service</Link>
              </p>
              <p className="text-sm text-white/70 mt-1 drop-shadow-sm">
                A proud member of REHAB | ISO 9001 : 2015 QMS Certified
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-white/80 text-sm mr-2 drop-shadow-sm">Follow Us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 sm:p-3 bg-white/10 hover:bg-accent/20 border border-white/20 hover:border-accent/50 rounded-lg transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white/80 group-hover:text-accent transition-colors duration-300" />
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
