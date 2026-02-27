'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slide } from '@/store/editor-types';

const TIME_SLOTS = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

export default function BookingSlide({ slide }: { slide: Slide }) {
    const [selectedDate, setSelectedDate] = useState<number | null>(27);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const days = Array.from({ length: 28 }, (_, i) => i + 1);
    const startOffset = 0; // February 2026 starts on Sunday (offset 0)

    return (
        <div className="w-full h-full bg-white p-12 flex flex-col font-sans">
            {/* Header */}
            <div className="mb-10 pl-4 border-l-4 border-blue-500">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 block mb-2">Schedule a Demo</span>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{slide.title}</h1>
                <p className="text-slate-500 font-medium">{slide.subtitle || 'Interactive calendar component — try selecting a date and time'}</p>
            </div>

            <div className="flex-1 flex gap-12 min-h-0">
                {/* Left: Calendar */}
                <div className="flex-[2] bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <button className="text-slate-400 hover:text-slate-900"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg></button>
                        <h2 className="text-sm font-black text-slate-800">February 2026</h2>
                        <button className="text-slate-400 hover:text-slate-900"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg></button>
                    </div>

                    <div className="grid grid-cols-7 gap-y-4 text-center">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day}</div>
                        ))}

                        {Array.from({ length: startOffset }).map((_, i) => <div key={`empty-${i}`} />)}

                        {days.map(day => (
                            <motion.button
                                key={day}
                                onClick={() => {
                                    setSelectedDate(day);
                                    setSelectedTime(null);
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`h-12 w-12 mx-auto flex items-center justify-center rounded-xl text-sm font-bold transition-all relative
                                    ${selectedDate === day
                                        ? 'bg-blue-50 text-blue-600 border-2 border-blue-500 shadow-lg shadow-blue-500/10'
                                        : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                {day}
                                {day === 27 && !selectedDate && (
                                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Right: Time Selection */}
                <div className="flex-1 flex flex-col gap-6">
                    <div className="flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Times</span>
                        </div>

                        <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {selectedDate ? (
                                TIME_SLOTS.map(time => (
                                    <motion.button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        whileHover={{ x: 4 }}
                                        className={`w-full py-4 px-6 rounded-xl text-xs font-bold transition-all text-center
                                            ${selectedTime === time
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 order-first'
                                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                                    >
                                        {time}
                                    </motion.button>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">Please select a date to view available windows</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <AnimatePresence>
                        {selectedDate && selectedTime && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                Confirm Booking
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
