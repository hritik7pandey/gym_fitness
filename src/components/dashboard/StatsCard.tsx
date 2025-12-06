"use client";
import React from 'react';
import GlassCard from '../ui/GlassCard';

const StatsCard: React.FC = () => {
  // TODO: fetch real stats from backend (example: /api/stats)
  const stats = [
    { label: 'Workouts', value: '12' },
    { label: 'Calories', value: '3.2k' },
    { label: 'Consistency', value: '86%' }
  ];

  return (
    <GlassCard title="Summary" subtitle="This week">
      <div className="grid grid-cols-3 gap-4 lg:gap-8">
        {stats.map((s, i) => (
          <div key={s.label} className="text-center group">
            <div className="gradient-title text-2xl lg:text-3xl xl:text-4xl font-bold mb-2">{s.value}</div>
            <div className="text-xs lg:text-sm text-gray-400 font-semibold">{s.label}</div>
            <div className="h-1 glass-chip-active rounded-full mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default StatsCard;
