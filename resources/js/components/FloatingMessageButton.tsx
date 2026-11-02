import { usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import type { SiteSetting } from '@/types/SiteSetting';

const DEFAULT_WHATSAPP_NUMBER = '+8801928568853';
const DEFAULT_MESSENGER_LINK = 'alliancebuilderslimited';

const FloatingMessageButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { siteSettings } = usePage<{ siteSettings?: SiteSetting }>().props;
    // WhatsApp: include country code (e.g., +234 for Nigeria, +1 for USA).
    // Messenger: Facebook page username/ID, or a full link. Both are
    // controlled from CMS → Settings; these are just the fallback values.
    const whatsappNumber = siteSettings?.whatsapp_number || DEFAULT_WHATSAPP_NUMBER;
    const messengerPageId = siteSettings?.messenger_link || DEFAULT_MESSENGER_LINK;
    const whatsappMessage = 'Hello! I would like to inquire about your properties.';

    const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}` : '#';
    const messengerLink = messengerPageId ? (messengerPageId.startsWith('http') ? messengerPageId : `https://m.me/${messengerPageId}`) : '#';

    return (
        <>
            {/* Floating Button Drawer */}
            <div className="fixed bottom-6 left-4 z-40">
                {/* Drawer Container */}
                <div className={`flex flex-col items-center gap-2 sm:gap-3 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    {/* Messenger Button */}
                    <a
                        href={messengerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                            if (!messengerPageId) {
                                e.preventDefault();
                                alert('Please configure your Messenger Page ID in the component settings');
                            }
                        }}
                        className="transform transition-all duration-300 origin-bottom flex items-center justify-center h-10 w-10 sm:h-14 sm:w-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 cursor-pointer"
                        title={messengerPageId ? "Chat with us on Messenger" : "Messenger not configured"}
                        style={{
                            transform: isOpen ? 'scale(1)' : 'scale(0)',
                            transition: 'transform 0.3s ease-out'
                        }}
                    >
                        <svg className='w-5 sm:w-7' xmlns="http://www.w3.org/2000/svg" viewBox="252.418 161.864 24 24.001"><path d="M264.418 161.864c-6.76 0-12 4.952-12 11.64 0 3.499 1.434 6.521 3.769 8.61a.96.96 0 0 1 .323.683l.065 2.135a.96.96 0 0 0 1.347.85l2.381-1.053a.97.97 0 0 1 .641-.046c1.132.31 2.301.465 3.474.461 6.76 0 12-4.952 12-11.64s-5.24-11.64-12-11.64m6.806 7.44c.522-.03.971.567.63 1.094l-4.178 6.457a.707.707 0 0 1-.977.208l-3.87-2.504a.44.44 0 0 0-.49.007l-4.363 3.01c-.637.438-1.415-.317-.995-.966l4.179-6.457a.706.706 0 0 1 .977-.21l3.87 2.505c.15.097.344.094.491-.007l4.362-3.008a.7.7 0 0 1 .364-.13" style={{strokeWidth: 1, fill: '#fff'}}/></svg>
                    </a>

                    {/* WhatsApp Button */}
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                            if (!whatsappNumber) {
                                e.preventDefault();
                                alert('Please configure your WhatsApp number in the component settings');
                            }
                        }}
                        className="transform transition-all duration-300 origin-bottom flex items-center justify-center h-10 w-10 sm:h-14 sm:w-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 cursor-pointer"
                        title={whatsappNumber ? "Chat with us on WhatsApp" : "WhatsApp not configured"}
                        style={{
                            transform: isOpen ? 'scale(1)' : 'scale(0)',
                            transition: 'transform 0.3s ease-out'
                        }}
                    >
                        <svg className="w-5 sm:w-7" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>WhatsApp</title><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    </a>
                </div>

                {/* Main Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center h-10 w-10 sm:h-14 sm:w-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 mt-2 sm:mt-3"
                    title="Open chat options"
                    aria-label="Toggle chat menu"
                >
                    <div className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
                        <svg className="h-6 sm:h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" data-name="Layer 1" viewBox="0 0 512 512"><path d="M503.765 274.64a71.44 71.44 0 0 1-68.23 74.36q-1.658.077-3.31.077a70 70 0 0 1-14.935-1.621 192.4 192.4 0 0 1-130.067 85.23 41.593 41.593 0 1 1-1.328-30.209A161.53 161.53 0 0 0 418.05 243.188c0-89.355-72.695-162.05-162.05-162.05S93.95 153.833 93.95 243.188a162 162 0 0 0 20.513 78.934 9.8 9.8 0 0 1 1.017 2.544 14.96 14.96 0 0 1-8.321 18.873 70.6 70.6 0 0 1-27.412 5.531q-1.662 0-3.331-.077a71.434 71.434 0 0 1-68.181-74.36c.319-7.535.141-14.258-.033-20.759-.162-6.121-.331-12.451-.053-19.056a71.5 71.5 0 0 1 71.782-68.287C109.587 98.679 177.34 51.138 256 51.138s146.414 47.541 176.07 115.394a71.443 71.443 0 0 1 71.78 68.275c.279 6.615.111 12.944-.053 19.065-.172 6.502-.351 13.228-.032 20.768m-121.96-31.452a125.854 125.854 0 0 1-158.119 121.6l-50.921 29.407a15 15 0 0 1-21.99-16.873l13.014-48.548a126.3 126.3 0 0 1-33.589-85.586c0-69.388 56.431-125.834 125.8-125.834S381.805 173.8 381.805 243.188m-160.78 0a15 15 0 0 0-15-15H206a15 15 0 1 0 15.028 15Zm49.978 0a14 14 0 0 0-.08-1.47 14 14 0 0 0-.219-1.46 11 11 0 0 0-.361-1.42c-.139-.47-.309-.93-.489-1.39s-.4-.89-.63-1.32a14 14 0 0 0-.75-1.26 15 15 0 0 0-.881-1.19 13 13 0 0 0-.989-1.09c-.34-.35-.71-.68-1.09-1-.381-.3-.781-.6-1.191-.87a14 14 0 0 0-1.259-.75c-.431-.23-.88-.44-1.331-.63a13 13 0 0 0-1.379-.49 13 13 0 0 0-2.88-.58 15.4 15.4 0 0 0-4.4.21 14 14 0 0 0-1.429.37 13 13 0 0 0-1.38.49c-.45.19-.9.4-1.33.63s-.85.48-1.261.75a14.6 14.6 0 0 0-2.279 1.87 13 13 0 0 0-.991 1.09 15 15 0 0 0-.869 1.19 14 14 0 0 0-.76 1.26 13 13 0 0 0-.621 1.32 15 15 0 0 0-.5 1.39c-.139.46-.259.94-.359 1.42a14 14 0 0 0-.221 1.46q-.072.735-.07 1.47c.002.735.021.99.07 1.48a15 15 0 0 0 .221 1.45c.1.48.22.96.359 1.43a15 15 0 0 0 .5 1.38 14 14 0 0 0 .621 1.33c.229.43.49.85.76 1.26a14 14 0 0 0 .869 1.18 15 15 0 0 0 .991 1.1c.35.34.71.68 1.1.99a13 13 0 0 0 1.179.87c.411.27.83.53 1.261.76a16.6 16.6 0 0 0 2.71 1.12c.469.14.949.26 1.429.36a14.3 14.3 0 0 0 2.93.29 15.1 15.1 0 0 0 10.6-4.39 16 16 0 0 0 1.87-2.28q.405-.615.75-1.26c.23-.43.44-.88.63-1.33s.35-.92.489-1.38a12 12 0 0 0 .361-1.43 14 14 0 0 0 .219-1.45 14 14 0 0 0 .077-1.482Zm50 0a15 15 0 0 0-15-15h-.029a15 15 0 1 0 15.029 15"/></svg>
                    </div>
                </button>
            </div>

            <style>{`
                @keyframes fade-in {
                    0% {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
};

export default FloatingMessageButton;
