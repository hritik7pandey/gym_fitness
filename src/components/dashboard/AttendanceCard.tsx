"use client";
import React from 'react';
import GlassCard from '../ui/GlassCard';

const AttendanceCard: React.FC = () => {
  // TODO: fetch attendance records from API
  const attendance = { attended: 18, total: 21 };
  const percentage = Math.round((attendance.attended / attendance.total) * 100);

  return (
    <GlassCard title="Attendance" subtitle={`Attended ${attendance.attended} / ${attendance.total}`}>
      <div className="space-y-2 lg:space-y-3">
        <div className="text-sm lg:text-base text-gray-400">Keep your streak going! 🎉</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 lg:h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-iosBlue to-iosCyan" style={{ width: `${percentage}%` }} />
          </div>
          <span className="text-xs lg:text-sm font-medium text-iosBlue">{percentage}%</span>
        </div>
      </div>
    </GlassCard>
  );
};

export default AttendanceCard;
