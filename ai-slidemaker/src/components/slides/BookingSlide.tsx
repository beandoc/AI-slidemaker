'use client';

import React, { useState } from 'react';
import { Slide } from '@/store/editor-types';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingSlideProps {
    slide: Slide;
}

export default function BookingSlide({ slide }: BookingSlideProps) {
    const { title, subtitle, buttonText } = slide.content;
    const [selectedDate, setSelectedDate] = useState<number | null>(27);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const days = Array.from({ length: 28 }, (_, i) => i + 1);
    const times = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

    return (
        <div className="w-full h-full bg-white flex flex-col p-20 font-sans overflow-hidden">
            <div className="mb-12 px-10">
                <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 block">
                    {subtitle || 'SCHEDULE A DEMO'}
                </span>
                <h2 className="text-5xl font-black font-display tracking-tight text-slate-900 mb-4">
                    {title || 'Forms and booking flows'}
                </h2>
                <p className="text-slate-400 font-medium">Interactive calendar component — try selecting a date and time</p>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-10 px-10 overflow-hidden">
                {/* Calendar Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="col-span-8 bg-white rounded-[2.5rem] slide-shadow border border-slate-100 p-12 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-10">
                        <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <h3 className="text-lg font-black font-display text-slate-800">February 2026</h3>
                        <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6 6-6" transform="rotate(180 12 12)" /></svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {days.map(day => (
                            <button
                                key={day}
                                onClick={() => setSelectedDate(day)}
                                className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all
                                    ${selectedDate === day
                                        ? 'bg-white border-2 border-blue-500 text-blue-600 shadow-lg shadow-blue-500/10 scale-110 z-10'
                                        : 'text-slate-400 hover:bg-slate-50'}`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Times List */}
                <div className="col-span-4 flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">Available Times</span>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
                        {times.map((time, i) => (
                            <motion.button
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 + i * 0.05 }}
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`w-full py-4 rounded-xl text-xs font-bold transition-all
                                    ${selectedTime === time
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20'
                                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-transparent hover:border-slate-200'}`}
                            >
                                {time}
                            </motion.button>
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`mt-auto py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                            ${selectedDate && selectedTime
                                ? 'bg-slate-900 text-white shadow-2xl'
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                            {buttonText || 'Confirm Booking'}
                        </div>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
