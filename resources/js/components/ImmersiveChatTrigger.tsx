import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { MessageCircle, X, Sparkles, Bot, Zap } from 'lucide-react';

interface ImmersiveChatTriggerProps {
    onClick: () => void;
    isOpen: boolean;
}

export default function ImmersiveChatTrigger({ onClick, isOpen }: ImmersiveChatTriggerProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const controls = useAnimation();
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-show tooltip after 3 seconds on first load
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!hasInteracted) {
                setShowTooltip(true);
                // Hide tooltip after 5 seconds
                setTimeout(() => setShowTooltip(false), 5000);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [hasInteracted]);

    // Idle animation - subtle breathing
    useEffect(() => {
        if (!isOpen && !isHovered) {
            const breathe = async () => {
                await controls.start({
                    scale: [1, 1.02, 1],
                    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                });
            };
            breathe();
        }
    }, [controls, isOpen, isHovered]);

    const handleClick = () => {
        setHasInteracted(true);
        setShowTooltip(false);
        onClick();
    };

    return (
        <div
            ref={containerRef}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Floating Message Preview */}
            <AnimatePresence>
                {showTooltip && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="mb-4 mr-2"
                    >
                        <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1f2e] to-[#0d1320] p-4 shadow-2xl backdrop-blur-xl">
                            {/* Decorative elements */}
                            <div className="absolute -top-1 -right-1">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                >
                                    <Sparkles size={14} className="text-amber-400" />
                                </motion.div>
                            </div>

                            <div className="flex items-start gap-3">
                                {/* Mini avatar */}
                                <div className="relative h-8 w-8 flex-shrink-0">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                                    <div className="absolute inset-[2px] rounded-full bg-[#1a1f2e] flex items-center justify-center">
                                        <Bot size={14} className="text-blue-400" />
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-white/90">
                                        Hi there! 👋
                                    </p>
                                    <p className="mt-0.5 max-w-[180px] text-xs leading-relaxed text-white/50">
                                        I can answer questions about our properties. Ask me anything!
                                    </p>
                                </div>
                            </div>

                            {/* Triangle pointer */}
                            <div className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 bg-gradient-to-br from-[#0d1320] to-[#151a27] border-r border-b border-white/10" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Button Container */}
            <div className="relative">
                {/* Outer glow rings - pulsing when not hovered */}
                {!isOpen && (
                    <>
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            animate={{
                                boxShadow: [
                                    "0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)",
                                    "0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.2)",
                                    "0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)"
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute -inset-3 rounded-full border border-blue-500/20"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.1, 0.3]
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute -inset-6 rounded-full border border-blue-500/10"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.2, 0.05, 0.2]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        />
                    </>
                )}

                {/* Main Button */}
                <motion.button
                    layout
                    onClick={handleClick}
                    animate={controls}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{
                        layout: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
                    }}
                    className={`relative flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 p-1.5 shadow-2xl transition-shadow duration-700 hover:shadow-blue-500/25 ${
                        isOpen ? 'sm:p-2' : 'sm:pr-5'
                    }`}
                >
                    {/* Avatar Container */}
                    <div className="relative h-8 w-8 sm:h-12 sm:w-12 flex-shrink-0 overflow-hidden rounded-full bg-white">
                        {/* Animated gradient background */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"
                            animate={{
                                rotate: isOpen ? 180 : [0, 180, 360],
                            }}
                            transition={{
                                duration: isOpen ? 0.7 : 8,
                                repeat: isOpen ? 0 : Infinity,
                                ease: "easeInOut"
                            }}
                            style={{ borderRadius: '50%' }}
                        />

                        {/* Inner circle with bot icon */}
                        <div className="absolute inset-[2px] flex items-center justify-center rounded-full bg-gradient-to-br from-[#1a1f2e] to-[#0d1320]">
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -180, scale: 0.3, opacity: 0 }}
                                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                                        exit={{ rotate: 180, scale: 0.3, opacity: 0 }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <X size={22} className="text-white" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="open"
                                        initial={{ rotate: 180, scale: 0.3, opacity: 0 }}
                                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                                        exit={{ rotate: -180, scale: 0.3, opacity: 0 }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        className="relative"
                                    >
                                        <Bot size={24} className="text-blue-400" />
                                        {/* Status dot */}
                                        <motion.div
                                            className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-400"
                                            animate={{
                                                scale: [1, 1.2, 1],
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Label */}
                    <AnimatePresence>
                        {!isOpen && (
                            <motion.div
                                key="label"
                                initial={{ opacity: 0, width: 0, filter: "blur(4px)" }}
                                animate={{ opacity: 1, width: "auto", filter: "blur(0px)" }}
                                exit={{ opacity: 0, width: 0, filter: "blur(4px)" }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="hidden sm:flex items-center gap-2 overflow-hidden whitespace-nowrap pl-2"
                            >
                                <span className="text-sm font-semibold text-white">
                                    AI Assistant
                                </span>
                                <motion.div
                                    animate={{ x: [0, 3, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <Zap size={14} className="text-yellow-300" fill="currentColor" />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Ripple effect on hover */}
                    {isHovered && !isOpen && (
                        <motion.div
                            initial={{ scale: 1, opacity: 0.5 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0 rounded-full bg-white/20"
                        />
                    )}
                </motion.button>

                {/* Small indicator badge */}
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-[9px] font-bold text-white shadow-lg"
                    >
                        AI
                    </motion.div>
                )}
            </div>

            {/* Bottom label */}
            <AnimatePresence>
                {isHovered && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="hidden sm:block mt-2 text-[10px] font-medium tracking-wide text-white/40"
                    >
                        Click to chat
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
