import { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Message {
    role: "user" | "bot";
    text: string;
}

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", text: "Hi! I'm the Alliance Builders assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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
                { role: "bot", text: "Sorry, something went wrong. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {open && (
                <div className="mb-3 w-80 rounded-2xl shadow-2xl border border-gray-200 bg-white flex flex-col overflow-hidden"
                     style={{ height: "420px" }}>
                    {/* Header */}
                    <div className="bg-blue-700 text-white px-4 py-3 flex justify-between items-center">
                        <span className="font-semibold text-sm">Alliance Builders Assistant</span>
                        <button onClick={() => setOpen(false)} className="text-white text-lg leading-none">&times;</button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`px-3 py-2 rounded-xl text-sm max-w-[85%] ${
                                    msg.role === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-800 border border-gray-200"
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="px-3 py-2 rounded-xl text-sm bg-white border border-gray-200 text-gray-400">
                                    Typing...
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="p-2 border-t border-gray-200 bg-white flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Ask a question..."
                            className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            className="bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-blue-800 transition"
                title="Chat with us"
            >
                {open ? "✕" : "💬"}
            </button>
        </div>
    );
}