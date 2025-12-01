"use client";
import React from 'react';
import { motion } from '@/lib/motion';

const WeeklyScheduleStrip: React.FC = () => {
  // TODO: replace with real schedule from backend
  const days = [
    { day: 'Mon', planned: true },
    { day: 'Tue', planned: true },
    { day: 'Wed', planned: false },
    { day: 'Thu', planned: true },
    { day: 'Fri', planned: false },
    { day: 'Sat', planned: true },
    { day: 'Sun', planned: false }
  ];

  return (
    <section aria-label="Weekly schedule" className="ios-glass p-4 lg:p-6 rounded-3xl">
      <h3 className="text-sm lg:text-base font-semibold mb-3 lg:mb-4">Weekly Schedule</h3>
      <div className="flex gap-2 lg:gap-4 overflow-x-auto lg:overflow-visible">
        {days.map((d, i) => (
          <div
            key={d.day}
            className={`flex-1 min-w-[60px] lg:min-w-[80px] p-2 lg:p-3 text-center rounded-2xl text-xs lg:text-sm font-medium transition-all ${d.planned ? 'bg-iosBlue/20 text-iosBlue' : 'bg-white/40 text-slate-400'}`}
          >
            {d.day}
          </div>
        ))}
      </div>
    </section>
  );
};

export default WeeklyScheduleStrip;
