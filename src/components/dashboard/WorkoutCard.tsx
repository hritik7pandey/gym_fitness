"use client";
import React from 'react';
import GlassCard from '../ui/GlassCard';
import ProgressCircle from '../ui/ProgressCircle';

const WorkoutCard: React.FC = () => {
  // TODO: replace with dynamic workout data from backend
  const current = { name: 'Full Body HIIT', progress: 42 };

  return (
    <GlassCard title="Workout" subtitle={current.name}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
        <div className="flex-1">
          <div className="text-base lg:text-lg text-gray-700 font-semibold">Next: 10 mins</div>
          <div className="text-sm lg:text-base text-gray-500 mt-1.5 font-medium">Cardio & Strength</div>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-chip">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-glow-pulse" />
            <span className="text-xs font-bold text-gray-700">Active Session</span>
          </div>
        </div>
        <ProgressCircle value={current.progress} label="Progress" />
      </div>
    </GlassCard>
  );
};

export default WorkoutCard;
