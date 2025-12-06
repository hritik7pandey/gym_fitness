'use client';

import { motion } from '@/lib/motion';
import { useWorkoutStats } from '@/hooks/useWorkoutSession';

export default function WorkoutStatsPage() {
  const { weeklyStats, monthlyStats, isLoading } = useWorkoutStats();

  return (
    <div
      className="min-h-screen pb-24"
      style={{
        background: 'linear-gradient(135deg, #B9D7FF 0%, #D8C7FF 35%, #A6F1FF 70%, #E5E1FF 100%)',
      }}
    >
      <div className="px-6 py-8">
        <h1
          style={{
            fontFamily: 'SF Pro Display, -apple-system, sans-serif',
            fontWeight: 800,
            fontSize: '40px',
            color: '#1C1C1E',
            marginBottom: '8px',
          }}
        >
          Workout Stats
        </h1>
        <p
          style={{
            fontFamily: 'SF Pro, -apple-system, sans-serif',
            fontWeight: 600,
            fontSize: '17px',
            color: '#1C1C1E',
            opacity: 0.7,
            marginBottom: '32px',
          }}
        >
          Track your fitness journey
        </p>

        {/* Weekly Overview */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'rgba(255,255,255,0.35)',
              backdropFilter: 'blur(40px) saturate(180%)',
              borderRadius: '28px',
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 8px 32px rgba(0,0,0,0.06)',
              padding: '48px 24px',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            <div className="text-4xl mb-3">📊</div>
            <div style={{ fontFamily: 'SF Pro, -apple-system, sans-serif', fontWeight: 600, fontSize: '17px', color: '#1C1C1E', opacity: 0.7 }}>
              Loading your stats...
            </div>
          </motion.div>
        ) : weeklyStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(24px) saturate(180%)',
              borderRadius: '28px',
              border: '1px solid rgba(255,255,255,0.25)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.35)',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <h2
              style={{
                fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                fontWeight: 800,
                fontSize: '24px',
                color: '#1C1C1E',
                marginBottom: '16px',
              }}
            >
              This Week
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <StatBox label="Workouts" value={weeklyStats.totalWorkouts} />
              <StatBox label="Minutes" value={weeklyStats.totalMinutes} />
              <StatBox label="Calories" value={weeklyStats.totalCalories} />
              <StatBox label="Volume (kg)" value={Math.round(weeklyStats.totalVolume / 1000)} />
            </div>

            {/* Daily Bar Chart */}
            <div className="space-y-3">
              {weeklyStats.dailyStats.map((day: any) => (
                <div key={day.date}>
                  <div className="flex justify-between mb-1">
                    <span style={{ fontWeight: 600, fontSize: '14px', color: '#1C1C1E' }}>
                      {day.dayName}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#7AA7FF' }}>
                      {day.minutes}min
                    </span>
                  </div>
                  <div
                    style={{
                      height: '8px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.35)',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((day.minutes / 60) * 100, 100)}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      style={{
                        height: '100%',
                        background: day.workouts > 0 ? '#7AA7FF' : 'rgba(255,255,255,0.25)',
                        borderRadius: '10px',
                        boxShadow: day.workouts > 0 ? '0 0 12px rgba(122,167,255,0.6)' : 'none',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Streak */}
            <div className="mt-6 flex items-center justify-between">
              <div>
                <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '4px' }}>
                  Current Streak
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#7AA7FF' }}>
                  {weeklyStats.currentStreak} 🔥
                </div>
              </div>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '4px' }}>
                  Longest Streak
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFE9A3' }}>
                  {weeklyStats.longestStreak} 🏆
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Monthly Heatmap */}
        {monthlyStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(24px) saturate(180%)',
              borderRadius: '28px',
              border: '1px solid rgba(255,255,255,0.25)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.35)',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <h2
              style={{
                fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                fontWeight: 800,
                fontSize: '24px',
                color: '#1C1C1E',
                marginBottom: '16px',
              }}
            >
              Last 30 Days
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <StatBox label="Total Workouts" value={monthlyStats.totalWorkouts} />
              <StatBox label="Avg/Week" value={Math.round(monthlyStats.totalWorkouts / 4)} />
            </div>

            {/* Heatmap Grid */}
            <div className="grid grid-cols-7 gap-2">
              {Object.entries(monthlyStats.heatmap || {}).slice(-30).map(([date, data]: any) => {
                const intensity = Math.min(data.workouts / 2, 1);
                return (
                  <div
                    key={date}
                    title={`${date}: ${data.workouts} workouts`}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '8px',
                      background: data.workouts > 0
                        ? `rgba(122,167,255,${0.3 + intensity * 0.7})`
                        : 'rgba(255,255,255,0.25)',
                      border: '1px solid rgba(255,255,255,0.35)',
                      transform: 'scale(1)',
                      transition: 'transform 0.2s',
                    }}
                  />
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Recovery Score */}
        {monthlyStats?.recovery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'rgba(255,255,255,0.35)',
              backdropFilter: 'blur(40px) saturate(180%)',
              borderRadius: '28px',
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 8px 32px rgba(0,0,0,0.06)',
              padding: '24px',
            }}
          >
            <h2
              style={{
                fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                fontWeight: 800,
                fontSize: '24px',
                color: '#1C1C1E',
                marginBottom: '8px',
              }}
            >
              Recovery Status
            </h2>
            <p
              style={{
                fontFamily: 'SF Pro, -apple-system, sans-serif',
                fontWeight: 600,
                fontSize: '17px',
                color: '#1C1C1E',
                opacity: 0.7,
                marginBottom: '16px',
              }}
            >
              {monthlyStats.recovery.message}
            </p>

            <div className="grid grid-cols-3 gap-4">
              <RecoveryMetric
                label="Days Since"
                value={monthlyStats.recovery.daysSinceLastWorkout}
              />
              <RecoveryMetric
                label="Intensity"
                value={`${monthlyStats.recovery.averageIntensity}/10`}
              />
              <RecoveryMetric
                label="This Week"
                value={monthlyStats.recovery.workoutsThisWeek}
              />
            </div>

            <div
              className="mt-4 text-center py-4"
              style={{
                background:
                  monthlyStats.recovery.score === 'excellent'
                    ? 'rgba(158,245,194,0.25)'
                    : monthlyStats.recovery.score === 'good'
                    ? 'rgba(122,167,255,0.25)'
                    : 'rgba(255,233,163,0.25)',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.35)',
              }}
            >
              <div style={{ fontSize: '32px', fontWeight: 800 }}>
                {monthlyStats.recovery.score.toUpperCase()}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(40px) saturate(180%)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.5)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 8px 32px rgba(0,0,0,0.06)',
        padding: '16px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'SF Pro Display, -apple-system, sans-serif',
          fontWeight: 800,
          fontSize: '32px',
          color: '#1C1C1E',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: 'SF Pro, -apple-system, sans-serif',
          fontWeight: 600,
          fontSize: '13px',
          color: '#1C1C1E',
          opacity: 0.7,
          marginTop: '6px',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function RecoveryMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="text-center">
      <div style={{ fontSize: '24px', fontWeight: 800, color: '#1C1C1E' }}>{value}</div>
      <div style={{ fontSize: '12px', fontWeight: 600, opacity: 0.7, marginTop: '4px' }}>
        {label}
      </div>
    </div>
  );
}
