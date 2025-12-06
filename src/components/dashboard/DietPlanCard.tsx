"use client";
import React from 'react';
import GlassCard from '../ui/GlassCard';

const DietPlanCard: React.FC = () => {
  // TODO: integrate diet plan fetch and edit endpoints
  const planSummary = 'Protein rich 1800 kcal';
  const macros = [
    { name: 'Protein', value: '135g', color: 'bg-iosRed' },
    { name: 'Carbs', value: '180g', color: 'bg-iosBlue' },
    { name: 'Fats', value: '60g', color: 'bg-iosPurple' },
  ];

  const gradientColors = [
    'bg-gradient-to-r from-neon-orange to-neon-yellow',
    'glass-chip-active',
    'bg-gradient-to-r from-neon-purple to-neon-blue',
  ];

  return (
    <GlassCard title="Diet Plan" subtitle={planSummary}>
      <div className="space-y-4 lg:space-y-5">
        <div className="text-sm lg:text-base text-gray-400 font-medium">Tap to view meals and swap items.</div>
        <div className="grid grid-cols-3 gap-3 lg:gap-6">
          {macros.map((macro, i) => (
            <div key={macro.name} className="text-center group">
              <div className={`h-2 lg:h-3 ${gradientColors[i]} rounded-full mb-2 shadow-neon transform group-hover:scale-105 transition-transform duration-300`} />
              <div className="text-sm lg:text-base font-bold text-white">{macro.value}</div>
              <div className="text-xs lg:text-sm text-gray-400 font-semibold mt-0.5">{macro.name}</div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

export default DietPlanCard;
