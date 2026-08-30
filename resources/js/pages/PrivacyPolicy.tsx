import React from 'react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import AppLayout from '@/layouts/AppLayout';

const PrivacyPolicy = () => {
    return (
        <AppLayout>
            <div className="min-h-screen bg-black py-20">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <PageBreadcrumb
                            items={[{ label: 'Privacy Policy' }]}
                            className="mb-6"
                        />
                        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
                        
                        <div className="prose prose-invert max-w-none">
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    Alliance Builders Ltd. ("we", "us", "our", or "Company") is committed to protecting your privacy. 
                                    This Privacy Policy explains how we collect, use, disclose, and otherwise process your personal information 
                                    in connection with our websites, mobile applications, and other online services that link to this Privacy Policy 
                                    (collectively, the "Services").
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    We may collect personal information in various ways, including:
                                </p>
                                <ul className="list-disc list-inside text-white/80 space-y-2 mb-4">
                                    <li>Information you provide directly to us through forms, inquiries, and communications</li>
                                    <li>Information collected automatically when you visit our Services</li>
                                    <li>Information from third-party sources</li>
                                    <li>Contact information (name, email, phone number)</li>
                                    <li>Property inquiry details and preferences</li>
                                    <li>Usage data and browsing history</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-white mb-4">Use of Information</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    We use the information we collect for various purposes, including:
                                </p>
                                <ul className="list-disc list-inside text-white/80 space-y-2 mb-4">
                                    <li>Responding to your inquiries and requests</li>
                                    <li>Providing and improving our Services</li>
                                    <li>Sending promotional materials and updates</li>
                                    <li>Analyzing usage patterns and preferences</li>
                                    <li>Complying with legal obligations</li>
                                    <li>Protecting our rights and the rights of our users</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    We employ industry-standard security measures to protect your personal information against unauthorized access, 
                                    alteration, and destruction. However, no method of transmission over the Internet or electronic storage is completely secure, 
                                    and we cannot guarantee absolute security.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    Depending on your location, you may have the right to:
                                </p>
                                <ul className="list-disc list-inside text-white/80 space-y-2 mb-4">
                                    <li>Access your personal information</li>
                                    <li>Correct inaccurate information</li>
                                    <li>Request deletion of your information</li>
                                    <li>Opt-out of marketing communications</li>
                                    <li>Request data portability</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
                                </p>
                                <div className="text-white/80 space-y-2">
                                    <p>Email: asad@alliancebuildersltd.org</p>
                                    <p>Phone: +88-01928568853</p>
                                    <p>Address: House# 640 (1st Floor), West Kazipara Mirpur, Dhaka-1216</p>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-white mb-4">Updates to This Policy</h2>
                                <p className="text-white/80 leading-relaxed">
                                    We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, 
                                    legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our Services 
                                    and updating the "Last Updated" date.
                                </p>
                            </section>

                            <div className="mt-12 pt-8 border-t border-white/20">
                                <p className="text-white/60 text-sm">
                                    Last Updated: April 2026
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default PrivacyPolicy;
