import React from 'react';
import AppLayout from '@/layouts/AppLayout';

const TermsOfService = () => {
    return (
        <AppLayout>
            <div className="min-h-screen bg-black py-20">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
                        
                        <div className="prose prose-invert max-w-none">
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    By accessing and using the Alliance Builders Ltd. website and services, you accept and agree to be bound by 
                                    the terms and provision of this agreement. If you do not agree to abide by the above, 
                                    please do not use this service.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-white mb-4">2. Use License</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    Permission is granted to temporarily download one copy of the materials (information or software) on 
                                    Alliance Builders Ltd.'s website for personal, non-commercial transitory viewing only. 
                                    This is the grant of a license, not a transfer of title, and under this license you may not:
                                </p>
                                <ul className="list-disc list-inside text-white/80 space-y-2 mb-4">
                                    <li>Modifying or copying the materials</li>
                                    <li>Using the materials for any commercial purpose or for any public display</li>
                                    <li>Attempting to decompile or reverse engineer any software contained on the site</li>
                                    <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                                    <li>Removing any copyright or other proprietary notations from the materials</li>
                                    <li>Transmitting the materials over a network</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-white mb-4">3. Disclaimer</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    The materials on Alliance Builders Ltd.'s website are provided "as is". Alliance Builders Ltd. makes no warranties, 
                                    expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, 
                                    implied warranties or conditions of merchantability, fitness for a particular purpose, 
                                    or non-infringement of intellectual property or other violation of rights.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-white mb-4">4. Limitations</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    In no event shall Alliance Builders Ltd. or its suppliers be liable for any damages 
                                    (including, without limitation, damages for loss of data or profit, or due to business interruption) 
                                    arising out of the use or inability to use the materials on Alliance Builders Ltd.'s website, 
                                    even if Alliance Builders Ltd. or a representative has been notified orally or in writing of the possibility of such damage.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-white mb-4">5. Accuracy of Materials</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    The materials appearing on Alliance Builders Ltd.'s website could include technical, typographical, 
                                    or photographic errors. Alliance Builders Ltd. does not warrant that any of the materials on the website are accurate, complete, or current. 
                                    Alliance Builders Ltd. may make changes to the materials contained on the website at any time without notice.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-white mb-4">6. Links</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    Alliance Builders Ltd. has not reviewed all of the sites linked to from the website and is not responsible 
                                    for the contents of any such linked site. The inclusion of any link does not imply endorsement by Alliance Builders Ltd. 
                                    of the site. Use of any such linked website is at the user's own risk.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-white mb-4">7. Modifications</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    Alliance Builders Ltd. may revise these terms of service at any time without notice. 
                                    By using this website, you are agreeing to be bound by the then current version of these terms of service.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-white mb-4">8. Governing Law</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    These terms and conditions are governed by and construed in accordance with the laws of Bangladesh, 
                                    and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-white mb-4">9. User Content and Conduct</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    You agree not to transmit any unlawful, threatening, abusive, defamatory, obscene, or otherwise objectionable material 
                                    to the website. You agree not to disrupt the normal flow of dialogue within the website. 
                                    You agree not to post or transmit any unsolicited advertising or promotional materials.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Information</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    If you have any questions about these Terms of Service, please contact us at:
                                </p>
                                <div className="text-white/80 space-y-2">
                                    <p>Email: asad@alliancebuildersltd.org</p>
                                    <p>Phone: +88-01928568853</p>
                                    <p>Address: House# 640 (1st Floor), West Kazipara Mirpur, Dhaka-1216</p>
                                </div>
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

export default TermsOfService;
