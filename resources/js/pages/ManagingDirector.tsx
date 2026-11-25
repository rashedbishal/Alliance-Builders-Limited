import manager from "@/assets/images/people/manager.webp";
import PageBreadcrumb from '@/components/PageBreadcrumb';
import AppLayout from '@/layouts/AppLayout';

export default function ManagingDirector({ mdName }: { mdName?: string }) {
    return (
        <AppLayout>
            <div className="min-h-screen bg-black">
                {/* Header */}
                <div className="bg-black pt-30 shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-6 text-center sm:px-6 lg:px-8">
                        <PageBreadcrumb
                            items={[{ label: 'Managing Director' }]}
                            className="mb-4"
                        />
                        <h1 className="text-3xl font-bold text-white">Message from MD</h1>
                    </div>
                </div>

                {/* Main Content */}
                <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-gray-800 p-8 shadow-md lg:w-[85%]">
                        <div className="grid grid-cols-1 items-center gap-8 lg:w-[125%] lg:grid-cols-3">
                            {/* Text Content - Left Side (2/3 width) */}
                            <div className="order-2 space-y-4 text-white lg:col-span-2">
                                <p className="leading-relaxed">Dear Team Members and Stakeholders,</p>
                                <p className="leading-relaxed">
                                    It is with great pleasure that I address you today. As we continue to navigate through an ever-evolving business
                                    landscape, I am consistently impressed by the dedication, innovation, and resilience demonstrated by each member
                                    of our organization.
                                </p>
                                <p className="leading-relaxed">
                                    Our commitment to excellence remains unwavering, and together we have achieved remarkable milestones. Looking
                                    ahead, I am confident that our collaborative spirit and shared vision will propel us to even greater heights.
                                </p>
                                <p className="leading-relaxed">Thank you for your continued trust and contribution to our collective success.</p>
                                <p className="mt-6 leading-relaxed">
                                    Best regards,
                                    <br />
                                    {mdName && (
                                        <>
                                            <span className="font-semibold">{mdName}</span>
                                            <br />
                                        </>
                                    )}
                                    <span className="font-semibold">Managing Director</span>
                                </p>
                            </div>

                            {/* Image - Right Side (1/3 width) */}
                            <div className="lg:order-2 lg:col-span-1">
                                <img
                                    src={manager} // Replace with actual image path
                                    alt={mdName ? `${mdName}, Managing Director` : 'Managing Director'}
                                    className="h-auto w-full rounded-lg shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </AppLayout>
    );
}
