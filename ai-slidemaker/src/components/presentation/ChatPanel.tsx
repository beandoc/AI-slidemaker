'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface ChatPanelProps {
    onSendMessage: (text: string) => void;
    isGenerating: boolean;
}

export default function ChatPanel({ onSendMessage, isGenerating }: ChatPanelProps) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "I've successfully created your Studio Edition presentation. What would be a good next step?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || isGenerating) return;

        const userMsg: Message = {
            role: 'user',
            content: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        onSendMessage(input);
        setInput('');
    };

    return (
        <div className="w-[400px] flex flex-col bg-slate-50 border-r border-slate-200 h-full relative z-50">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Logic Active</span>
                </div>
                <button className="text-slate-400 hover:text-slate-900 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                </button>
            </div>

            {/* Message History */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                        >
                            <span className="text-[9px] font-bold text-slate-300 uppercase mb-2">
                                {msg.timestamp}
                            </span>
                            <div className={`max-w-[85%] p-4 rounded-2xl text-[14px] font-medium leading-relaxed ${msg.role === 'user'
                                    ? 'bg-slate-900 text-white rounded-tr-none'
                                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                                }`}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                    {isGenerating && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-start"
                        >
                            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200 space-y-4">
                <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1.5 text-[10px] font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 transition-all">Edit intro slide</button>
                    <button className="px-3 py-1.5 text-[10px] font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 transition-all">Add more slides</button>
                </div>

                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Ask Lovable..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 pb-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all resize-none min-h-[100px]"
                    />
                    <div className="absolute bottom-3 left-4 flex gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                        </button>
                    </div>
                    <button
                        onClick={handleSend}
                        className="absolute bottom-3 right-3 p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
