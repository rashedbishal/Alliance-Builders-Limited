import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface SavedAnimationProps {
    show?: boolean;
}

const SavedAnimation = ({ show = false }: SavedAnimationProps) => {
    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [show]);

    if (!isVisible) return null;

    return (
        <>
            <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[9999]">
                <div style={{animation: 'bounce-fade 2s ease-out'}}>
                    <div className="flex items-center justify-center gap-3 bg-green-500/90 text-white px-6 py-3 rounded-full shadow-2xl backdrop-blur-md">
                        <CheckCircle className="h-6 w-6" />
                        <span className="font-semibold text-lg">Saved to Favorites ❤️</span>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes bounce-fade {
                    0% {
                        transform: scale(0.3) translateY(-100px);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.05);
                        opacity: 1;
                    }
                    85% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1) translateY(0);
                        opacity: 0;
                    }
                }
            `}</style>
        </>
    );
};

export default SavedAnimation;
