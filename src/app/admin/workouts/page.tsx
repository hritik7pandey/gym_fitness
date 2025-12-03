"use client";
import React, { useState, useEffect } from 'react';
import FluentButton from '../../../components/ui/FluentButton';
import { BottomNav } from '@/components/navigation/BottomNav';

interface Workout {
  id: string;
  name: string;
  type: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

// Mock data
const mockWorkouts: Workout[] = [
  { id: '1', name: 'Full Body HIIT', type: 'Cardio', duration: 30, difficulty: 'Intermediate', description: 'High-intensity interval training' },
  { id: '2', name: 'Strength Training', type: 'Strength', duration: 45, difficulty: 'Advanced', description: 'Focus on compound movements' },
  { id: '3', name: 'Yoga Flow', type: 'Flexibility', duration: 60, difficulty: 'Beginner', description: 'Gentle stretching and balance' },
  { id: '4', name: 'Core Blast', type: 'Core', duration: 20, difficulty: 'Intermediate', description: 'Targeted ab workout' },
];

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
];

export default function AdminWorkoutsPage() {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedWorkout, setSelectedWorkout] = useState<string>('');
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [scheduleTime, setScheduleTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [workouts, setWorkouts] = useState<Workout[]>(mockWorkouts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      // Fetch users
      const usersResponse = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const usersData = await usersResponse.json();
      if (usersData.success) {
        setUsers(usersData.users.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
        })));
      }

      // Fetch workouts
      const workoutsResponse = await fetch('/api/admin/workouts', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const workoutsData = await workoutsResponse.json();
      if (workoutsData.success) {
        setWorkouts(workoutsData.workoutPlans.map((w: any) => ({
          id: w.id,
          name: w.name,
          type: w.type || 'Custom',
          duration: w.duration,
          difficulty: w.difficulty,
          description: w.description,
        })));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleAssign = async () => {
    if (!selectedUser || !selectedWorkout || !scheduleDate || !scheduleTime) {
      alert('⚠️ Please fill in all required fields:\n- Select a member\n- Select a workout\n- Choose date\n- Choose time');
      return;
    }

    const user = users.find(u => u.id === selectedUser);
    const workout = workouts.find(w => w.id === selectedWorkout);
    
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/workouts/assign', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workoutPlanId: selectedWorkout,
          userIds: [selectedUser],
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ Workout Assigned!\n\n👤 Member: ${user?.name}\n💪 Workout: ${workout?.name}\n📅 Date: ${scheduleDate}\n⏰ Time: ${scheduleTime}${notes ? `\n📝 Notes: ${notes}` : ''}\n\nThe member will receive:\n- Email notification\n- Workout added to their plan`);
        
        // Reset form
        setSelectedUser('');
        setSelectedWorkout('');
        setScheduleDate('');
        setScheduleTime('');
        setNotes('');
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      alert(`❌ Failed to assign workout: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-iosBlue/20 text-iosBlue';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100';
    }
  };

  return (
    <section aria-label="Admin workout assignment" className="space-y-5 lg:space-y-8">
      {/* Header */}
      <header>
        <h2 className="text-2xl lg:text-4xl font-bold">Assign Workouts</h2>
        <p className="text-sm lg:text-base text-slate-500 mt-1">Schedule workouts for members</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
        {/* Assignment Form */}
        <div className="glass-card-strong p-5 lg:p-8 space-y-5">
          <h3 className="text-lg lg:text-xl font-semibold text-[#1C1C1E]">New Assignment</h3>

          {/* Select User */}
          <div>
            <label htmlFor="user-select" className="block text-sm font-medium text-[#1C1C1E]/80 mb-2">
              Select Member
            </label>
            <select
              id="user-select"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="glass-input w-full px-4 py-3 text-sm lg:text-base text-[#1C1C1E]"
            >
              <option value="">Choose a member...</option>
              {mockUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Select Workout */}
          <div>
            <label htmlFor="workout-select" className="block text-sm font-medium text-[#1C1C1E]/80 mb-2">
              Select Workout
            </label>
            <select
              id="workout-select"
              value={selectedWorkout}
              onChange={(e) => setSelectedWorkout(e.target.value)}
              className="glass-input w-full px-4 py-3 text-sm lg:text-base text-[#1C1C1E]"
            >
              <option value="">Choose a workout...</option>
              {mockWorkouts.map((workout) => (
                <option key={workout.id} value={workout.id}>
                  {workout.name} - {workout.duration}min ({workout.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* Schedule Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="schedule-date" className="block text-sm font-medium text-slate-700 mb-2">
                Date
              </label>
              <input
                type="date"
                id="schedule-date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-iosBlue/50 text-sm lg:text-base"
              />
            </div>
            <div>
              <label htmlFor="schedule-time" className="block text-sm font-medium text-slate-700 mb-2">
                Time
              </label>
              <input
                type="time"
                id="schedule-time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-iosBlue/50 text-sm lg:text-base"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add any special instructions..."
              className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-iosBlue/50 text-sm lg:text-base resize-none"
            />
          </div>

          {/* Submit */}
          <FluentButton
            ariaLabel="Assign workout"
            onClick={handleAssign}
            className="w-full justify-center"
          >
            Assign Workout
          </FluentButton>
        </div>

        {/* Workout Library */}
        <div className="glass-card-strong p-5 lg:p-8 border-white/20 shadow-depth">
          <h3 className="text-lg lg:text-xl font-semibold mb-5">Workout Library</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {mockWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-white/60 p-4 rounded-2xl hover:bg-white/80 transition-all cursor-pointer"
                onClick={() => setSelectedWorkout(workout.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-slate-800">{workout.name}</h4>
                    <p className="text-xs text-slate-500">{workout.type}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(workout.difficulty)}`}>
                    {workout.difficulty}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{workout.description}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>{workout.duration} minutes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="glass-card-strong p-5 lg:p-8 border-white/20 shadow-depth">
        <h3 className="text-lg lg:text-xl font-semibold mb-5">Recent Assignments</h3>
        <div className="space-y-3">
          {[
            { user: 'John Doe', workout: 'Full Body HIIT', date: '2024-11-30', time: '10:00 AM' },
            { user: 'Jane Smith', workout: 'Yoga Flow', date: '2024-11-29', time: '6:00 PM' },
            { user: 'Mike Johnson', workout: 'Core Blast', date: '2024-11-29', time: '8:00 AM' },
          ].map((assignment, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 bg-white/40 rounded-2xl gap-2"
            >
              <div className="flex-1">
                <p className="font-medium text-slate-800">{assignment.user}</p>
                <p className="text-sm text-slate-600">{assignment.workout}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>{assignment.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>{assignment.time}</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (confirm(`⚠️ Cancel Assignment?\n\nMember: ${assignment.user}\nWorkout: ${assignment.workout}\nScheduled: ${assignment.date} at ${assignment.time}\n\nThis will:\n- Remove from calendar\n- Notify the member\n- Free up the time slot\n\nProceed with cancellation?`)) {
                    alert(`❌ Assignment Cancelled\n\nAPI: DELETE /api/admin/workouts/assign/${index} coming soon!`);
                  }
                }}
                className="text-iosRed text-sm hover:underline cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </section>
  );
}
