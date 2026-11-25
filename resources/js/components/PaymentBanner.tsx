import { ShieldCheck } from 'lucide-react';
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
 * SSLCOMMERZ "Pay With" banner (required by SSLCOMMERZ): a footer-style
 * heading plus the bare image, with no card around it. Each breakpoint
 * loads only its own image; clicking it opens the full categorized list.
 * On very wide screens the single-row image is shown at its native
 * 1600px (never scaled down), centred and extending past the footer
 * container; the breakpoint leaves room for it plus the scrollbar.
 */
const PaymentBanner = () => {
    return (
        <Dialog>
            <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
                <ShieldCheck className="h-6 w-6 text-green-400" />
                Secure payment by SSLCommerz
            </h3>
            <div className="min-[1680px]:relative min-[1680px]:left-1/2 min-[1680px]:w-[1600px] min-[1680px]:-translate-x-1/2">
                <DialogTrigger asChild>
                    <button
                        type="button"
                        className="block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        aria-label="View all payment channels"
                    >
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
                                className="block h-auto w-full max-w-xs sm:max-w-none"
                            />
                        </picture>
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
