<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('legal_pages', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->longText('content');
            $table->timestamps();
        });

        // Seed with the text that was previously hardcoded in the
        // PrivacyPolicy/TermsOfService React pages, so the live site shows
        // the same content until an admin edits it from the CMS.
        $privacy = <<<'HTML'
<h2>Introduction</h2>
<p>Alliance Builders Ltd. ("we", "us", "our", or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and otherwise process your personal information in connection with our websites, mobile applications, and other online services that link to this Privacy Policy (collectively, the "Services").</p>
<h2>Information We Collect</h2>
<p>We may collect personal information in various ways, including:</p>
<ul>
<li>Information you provide directly to us through forms, inquiries, and communications</li>
<li>Information collected automatically when you visit our Services</li>
<li>Information from third-party sources</li>
<li>Contact information (name, email, phone number)</li>
<li>Property inquiry details and preferences</li>
<li>Usage data and browsing history</li>
</ul>
<h2>Use of Information</h2>
<p>We use the information we collect for various purposes, including:</p>
<ul>
<li>Responding to your inquiries and requests</li>
<li>Providing and improving our Services</li>
<li>Sending promotional materials and updates</li>
<li>Analyzing usage patterns and preferences</li>
<li>Complying with legal obligations</li>
<li>Protecting our rights and the rights of our users</li>
</ul>
<h2>Data Security</h2>
<p>We employ industry-standard security measures to protect your personal information against unauthorized access, alteration, and destruction. However, no method of transmission over the Internet or electronic storage is completely secure, and we cannot guarantee absolute security.</p>
<h2>Your Rights</h2>
<p>Depending on your location, you may have the right to:</p>
<ul>
<li>Access your personal information</li>
<li>Correct inaccurate information</li>
<li>Request deletion of your information</li>
<li>Opt-out of marketing communications</li>
<li>Request data portability</li>
</ul>
<h2>Contact Us</h2>
<p>If you have any questions about this Privacy Policy or our privacy practices, please contact us at:</p>
<p>Email: asad@alliancebuildersltd.org</p>
<p>Phone: +88-01928568853</p>
<p>Address: House# 640 (1st Floor), West Kazipara Mirpur, Dhaka-1216</p>
<h2>Updates to This Policy</h2>
<p>We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our Services and updating the "Last Updated" date.</p>
<hr>
<p>Last Updated: April 2026</p>
HTML;

        $terms = <<<'HTML'
<h2>1. Acceptance of Terms</h2>
<p>By accessing and using the Alliance Builders Ltd. website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
<h2>2. Use License</h2>
<p>Permission is granted to temporarily download one copy of the materials (information or software) on Alliance Builders Ltd.'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
<ul>
<li>Modifying or copying the materials</li>
<li>Using the materials for any commercial purpose or for any public display</li>
<li>Attempting to decompile or reverse engineer any software contained on the site</li>
<li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
<li>Removing any copyright or other proprietary notations from the materials</li>
<li>Transmitting the materials over a network</li>
</ul>
<h2>3. Disclaimer</h2>
<p>The materials on Alliance Builders Ltd.'s website are provided "as is". Alliance Builders Ltd. makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
<h2>4. Limitations</h2>
<p>In no event shall Alliance Builders Ltd. or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Alliance Builders Ltd.'s website, even if Alliance Builders Ltd. or a representative has been notified orally or in writing of the possibility of such damage.</p>
<h2>5. Accuracy of Materials</h2>
<p>The materials appearing on Alliance Builders Ltd.'s website could include technical, typographical, or photographic errors. Alliance Builders Ltd. does not warrant that any of the materials on the website are accurate, complete, or current. Alliance Builders Ltd. may make changes to the materials contained on the website at any time without notice.</p>
<h2>6. Links</h2>
<p>Alliance Builders Ltd. has not reviewed all of the sites linked to from the website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Alliance Builders Ltd. of the site. Use of any such linked website is at the user's own risk.</p>
<h2>7. Modifications</h2>
<p>Alliance Builders Ltd. may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
<h2>8. Governing Law</h2>
<p>These terms and conditions are governed by and construed in accordance with the laws of Bangladesh, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
<h2>9. User Content and Conduct</h2>
<p>You agree not to transmit any unlawful, threatening, abusive, defamatory, obscene, or otherwise objectionable material to the website. You agree not to disrupt the normal flow of dialogue within the website. You agree not to post or transmit any unsolicited advertising or promotional materials.</p>
<h2>10. Contact Information</h2>
<p>If you have any questions about these Terms of Service, please contact us at:</p>
<p>Email: asad@alliancebuildersltd.org</p>
<p>Phone: +88-01928568853</p>
<p>Address: House# 640 (1st Floor), West Kazipara Mirpur, Dhaka-1216</p>
<hr>
<p>Last Updated: April 2026</p>
HTML;

        $refund = <<<'HTML'
<h2>Overview</h2>
<p>This Refund Policy explains how booking amounts and payments made to Alliance Builders Ltd. ("we", "us", "our") for apartments, commercial spaces and other properties are treated when a booking is cancelled or a refund is requested.</p>
<p>The terms of your signed booking or allotment agreement take priority. If anything in this policy conflicts with that agreement, the agreement applies.</p>
<h2>Booking Money</h2>
<p>Booking money is paid to reserve a unit and to take it off the market while the sale process is completed. Whether it is refundable, and how much of it, depends on the stage of the booking and the terms of your agreement.</p>
<h2>Cancellation by the Customer</h2>
<p>If you wish to cancel a booking, you must send a written cancellation request to us. Verbal requests are not accepted. Once we receive your request and verify your details, the applicable refund, if any, is calculated according to your booking agreement. Administrative charges and any costs already incurred on your behalf may be deducted.</p>
<h2>Cancellation by Alliance Builders Ltd.</h2>
<p>If we are unable to deliver the booked unit, or we cancel a booking for reasons within our control, you will be refunded the amounts you have paid towards that unit, as set out in your booking agreement.</p>
<h2>How to Request a Refund</h2>
<ul>
<li>Send a written request to the contact details below, quoting your name, the project and unit booked, and your payment details</li>
<li>Provide your payment receipts and any identification we reasonably ask for</li>
<li>We will confirm receipt of your request and tell you the outcome in writing</li>
</ul>
<h2>Refund Method and Timing</h2>
<p>Approved refunds are paid by the same method used for the original payment, or by another method agreed with you in writing. Processing time depends on the payment method and the banks involved. We will keep you informed of the status of your refund.</p>
<h2>Non-Refundable Items</h2>
<ul>
<li>Fees or charges paid to third parties, such as government registration or utility connection charges, unless they are refunded to us</li>
<li>Charges for customization or special work requested by you that has already been carried out</li>
<li>Any amount that your booking agreement states is non-refundable</li>
</ul>
<h2>Contact Us</h2>
<p>If you have any questions about this Refund Policy or wish to request a refund, please contact us at:</p>
<p>Email: asad@alliancebuildersltd.org</p>
<p>Phone: +88-01928568853</p>
<p>Address: House# 640 (1st Floor), West Kazipara Mirpur, Dhaka-1216</p>
<hr>
<p>Last Updated: November 2026</p>
HTML;

        $now = now();

        DB::table('legal_pages')->insert([
            ['slug' => 'privacy-policy', 'title' => 'Privacy Policy', 'content' => $privacy, 'created_at' => $now, 'updated_at' => $now],
            ['slug' => 'terms-of-service', 'title' => 'Terms of Service', 'content' => $terms, 'created_at' => $now, 'updated_at' => $now],
            ['slug' => 'refund-policy', 'title' => 'Refund Policy', 'content' => $refund, 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('legal_pages');
    }
};
