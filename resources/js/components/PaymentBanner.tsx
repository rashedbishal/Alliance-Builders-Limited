import { Maximize2, ShieldCheck } from 'lucide-react';
import payWithWide from '@/assets/images/sslcommerz/pay-with-desktop-single-row.webp';
import payWithDesktop from '@/assets/images/sslcommerz/pay-with-desktop.webp';
import payWithMobile from '@/assets/images/sslcommerz/pay-with-mobile.webp';
import payWithTablet from '@/assets/images/sslcommerz/pay-with-tablet.webp';
import paymentChannels from '@/assets/images/sslcommerz/payment-channels.webp';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

/**
 * SSLCOMMERZ "Pay With" banner (required by SSLCOMMERZ). Each breakpoint
 * loads only its own image; clicking opens the full categorized list.
 * On very wide screens the single-row image is shown at its native
 * 1600px (never scaled down) in a card sized to the image, which extends
 * past the footer container; the breakpoint leaves room for the
 * 1632px card plus the scrollbar.
 */
const PaymentBanner = () => {
    return (
        <Dialog>
            <div className="min-[1680px]:relative min-[1680px]:left-1/2 min-[1680px]:w-[1632px] min-[1680px]:-translate-x-1/2">
                <DialogTrigger asChild>
                    <button
                        type="button"
                        className="group shadow-elegant-xl mx-auto block w-full max-w-5xl cursor-zoom-in rounded-2xl bg-white p-3 transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent min-[1680px]:max-w-none sm:p-4"
                        aria-label="View all payment channels"
                    >
                        <span className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold text-slate-800 sm:text-base">
                            <ShieldCheck className="h-5 w-5 text-green-600" />
                            Secure payment by SSLCommerz
                        </span>
                        <picture>
                            <source
                                media="(min-width: 1680px)"
                                srcSet={payWithWide}
                                width={1600}
                                height={52}
                            />
                            <source
                                media="(min-width: 1024px)"
                                srcSet={payWithDesktop}
                                width={1600}
                                height={179}
                            />
                            <source
                                media="(min-width: 640px)"
                                srcSet={payWithTablet}
                                width={1600}
                                height={339}
                            />
                            <img
                                src={payWithMobile}
                                alt="Pay with Visa, Mastercard, Amex, bKash, Nagad, Rocket and other payment methods. Verified by SSLCOMMERZ"
                                width={626}
                                height={1600}
                                loading="lazy"
                                decoding="async"
                                className="mx-auto h-auto w-full max-w-xs min-[1680px]:w-[1600px] sm:max-w-none"
                            />
                        </picture>
                        <span className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 transition-colors group-hover:text-slate-800">
                            <Maximize2 className="h-3.5 w-3.5" />
                            View all payment channels
                        </span>
                    </button>
                </DialogTrigger>
            </div>
            <DialogContent className="max-h-[90vh] w-[95vw] max-w-5xl overflow-y-auto bg-white p-4 text-slate-900 sm:p-6">
                <DialogTitle className="sr-only">Payment Channels</DialogTitle>
                <DialogDescription className="sr-only">
                    All cards, mobile banking, internet banking and e-wallets
                    accepted through SSLCOMMERZ.
                </DialogDescription>
                <img
                    src={paymentChannels}
                    alt="Payment channels: accepted cards, mobile banking, internet banking and e-wallets. Verified by SSLCOMMERZ"
                    width={1600}
                    height={776}
                    className="h-auto w-full"
                />
            </DialogContent>
        </Dialog>
    );
};

export default PaymentBanner;
