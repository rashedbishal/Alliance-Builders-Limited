import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Clock, Shield } from "lucide-react";
import ImmersiveChatTrigger from "./ImmersiveChatTrigger";

interface Message {
    role: "user" | "bot";
    text: string;
}

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "bot",
            text: "Hi! I'm your Alliance Builders AI assistant. I can help you with property inquiries, project details, or any questions about our services. How can I assist you today?"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when chat opens
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [open]);

    // Scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMsg: Message = { role: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content") || "";

            const { data } = await axios.post(
                "/chatbot",
                { message: input },
                { headers: { "X-CSRF-TOKEN": csrfToken } }
            );
            setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment or contact us directly." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const suggestedQuestions = [
        "What properties are available?",
        "Tell me about your projects",
        "How can I schedule a visit?",
    ];

    return (
        <div className="fixed bottom-0 right-0 z-50">
            {/* Immersive Trigger Button */}
            <div className="absolute bottom-6 right-6">
                <ImmersiveChatTrigger onClick={() => setOpen(!open)} isOpen={open} />
            </div>

            {/* Chat Window */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute bottom-24 right-6 w-[380px] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1320]/95 shadow-2xl backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 px-5 py-4">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent" />

                            <div className="relative flex items-center gap-3">
                                {/* Avatar */}
                                <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white/30 bg-white/10">
                                    <div className="flex h-full w-full items-center justify-center">
                                        <Bot size={20} className="text-white" />
                                    </div>
                                    {/* Status indicator */}
                                    <div className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border border-white/30 bg-green-400" />
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-semibold text-white">
                                        Alliance AI
                                    </h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                                        <span className="text-[10px] text-white/70">Online now</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2 py-1">
                                    <Sparkles size={10} className="text-yellow-300" />
                                    <span className="text-[9px] font-medium text-white/80">AI Powered</span>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="h-[350px] overflow-y-auto bg-[#0a0e15] p-4">
                            {messages.length === 1 && (
                                <div className="mb-4 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                                    <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/40">
                                        Quick questions
                                    </p>
                                    <div className="space-y-2">
                                        {suggestedQuestions.map((q, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setInput(q);
                                                    setTimeout(() => sendMessage(), 100);
                                                }}
                                                className="w-full rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-left text-xs text-white/70 transition-all hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-white"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i === messages.length - 1 ? 0.1 : 0 }}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        {msg.role === "bot" && (
                                            <div className="mr-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                                                <Bot size={14} className="text-blue-400" />
                                            </div>
                                        )}

                                        <div
                                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                                                msg.role === "user"
                                                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                                                    : "border border-white/10 bg-white/[0.05] text-white/90"
                                            }`}
                                        >
                                            {msg.text}
                                        </div>

                                        {msg.role === "user" && (
                                            <div className="ml-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                                                <User size={14} className="text-white/60" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}

                                {loading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-start"
                                    >
                                        <div className="mr-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                                            <Bot size={14} className="text-blue-400" />
                                        </div>
                                        <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                                            <motion.div
                                                className="h-1.5 w-1.5 rounded-full bg-blue-400"
                                                animate={{ y: [0, -4, 0] }}
                                                transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                                            />
                                            <motion.div
                                                className="h-1.5 w-1.5 rounded-full bg-blue-400"
                                                animate={{ y: [0, -4, 0] }}
                                                transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
                                            />
                                            <motion.div
                                                className="h-1.5 w-1.5 rounded-full bg-blue-400"
                                                animate={{ y: [0, -4, 0] }}
                                                transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={bottomRef} />
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-white/10 bg-[#0d1320] p-3">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                        placeholder="Type your message..."
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-blue-500/50 focus:bg-white/[0.08]"
                                    />
                                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/20">
                                        Press Enter
                                    </div>
                                </div>
                                <motion.button
                                    onClick={sendMessage}
                                    disabled={loading || !input.trim()}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={18} />
                                </motion.button>
                            </div>

                            {/* Trust indicators */}
                            <div className="mt-3 flex items-center justify-center gap-4">
                                <div className="flex items-center gap-1 text-[9px] text-white/30">
                                    <Shield size={10} />
                                    <span>Secure chat</span>
                                </div>
                                <div className="flex items-center gap-1 text-[9px] text-white/30">
                                    <Clock size={10} />
                                    <span>Typically replies instantly</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
