"use client";
import React, { useState, useEffect } from 'react';
import { BottomNav } from '@/components/navigation/BottomNav';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  time?: string;
}

interface DayPlan {
  day: string;
  meals: Meal[];
}

// Meal library data
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const mealLibrary: Meal[] = [
  { id: '1', name: 'Oatmeal & Berries', calories: 350, protein: 12, carbs: 55, fats: 8, type: 'Breakfast', time: '08:00 AM' },
  { id: '2', name: 'Grilled Chicken Salad', calories: 420, protein: 35, carbs: 25, fats: 18, type: 'Lunch', time: '12:30 PM' },
  { id: '3', name: 'Salmon & Veggies', calories: 480, protein: 40, carbs: 30, fats: 22, type: 'Dinner', time: '07:00 PM' },
  { id: '4', name: 'Greek Yogurt', calories: 150, protein: 15, carbs: 12, fats: 5, type: 'Snack', time: '10:00 AM' },
  { id: '5', name: 'Protein Shake', calories: 200, protein: 25, carbs: 15, fats: 4, type: 'Snack', time: '04:00 PM' },
  { id: '6', name: 'Scrambled Eggs & Toast', calories: 400, protein: 20, carbs: 30, fats: 22, type: 'Breakfast', time: '08:00 AM' },
  { id: '7', name: 'Quinoa Bowl', calories: 380, protein: 18, carbs: 50, fats: 12, type: 'Lunch', time: '12:30 PM' },
  { id: '8', name: 'Chicken Stir Fry', calories: 450, protein: 38, carbs: 35, fats: 16, type: 'Dinner', time: '07:00 PM' },
  { id: '9', name: 'Almonds & Fruits', calories: 180, protein: 6, carbs: 20, fats: 10, type: 'Snack', time: '03:00 PM' },
  { id: '10', name: 'Cottage Cheese', calories: 120, protein: 14, carbs: 5, fats: 5, type: 'Snack', time: '10:00 AM' },
];

export default function AdminDietPage() {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [weeklyPlan, setWeeklyPlan] = useState<Record<string, Meal[]>>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [modalDay, setModalDay] = useState<string>('Monday');
  const [modalMealType, setModalMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');
  const [existingPlans, setExistingPlans] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchExistingPlans();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchExistingPlans = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('/api/admin/diet?isTemplate=true', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setExistingPlans(data.dietPlans || []);
      }
    } catch (error) {
      console.error('Failed to fetch existing plans:', error);
    }
  };

  const getTotalNutrition = (meals: Meal[]) => {
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fats: acc.fats + meal.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const addMealToDay = (day: string, meal: Meal) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: [...prev[day].filter(m => m.type !== meal.type), { ...meal, id: `${day}-${meal.type}-${Date.now()}` }]
    }));
    setShowMealModal(false);
  };

  const removeMealFromDay = (day: string, mealId: string) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: prev[day].filter(m => m.id !== mealId)
    }));
  };

  const openMealModal = (day: string, mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => {
    setModalDay(day);
    setModalMealType(mealType);
    setShowMealModal(true);
  };

  const createAndAssignPlan = async () => {
    if (!selectedUser) {
      alert('⚠️ Please select a member from the dropdown first!');
      return;
    }
    
    // Check if any day has meals
    const hasMeals = Object.values(weeklyPlan).some(meals => meals.length > 0);
    if (!hasMeals) {
      alert('⚠️ Please add at least one meal to the plan before creating it.');
      return;
    }
    
    const goal = prompt('Diet goal? (Enter: Weight Loss / Muscle Gain / Maintenance / High-Protein / Low-Carb / Balanced)');
    if (!goal) return;
    
    const calories = prompt('Target daily calories? (e.g., 2000)');
    if (!calories) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const user = users.find((u: any) => u.id === selectedUser);
      
      // Get admin's user ID from localStorage
      let adminId = localStorage.getItem('userId');
      if (!adminId) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          adminId = parsedUser.id;
        }
      }
      
      if (!adminId) {
        alert('❌ Error: Could not get admin ID. Please log out and log back in.');
        setLoading(false);
        return;
      }
      
      // Convert weeklyPlan object to array format expected by API
      const weeklyPlanArray = daysOfWeek.map(day => {
        const dayMeals = weeklyPlan[day] || [];
        // Remove the 'id' field from meals as API doesn't expect it
        const apiMeals = dayMeals.map(({ id, ...meal }) => meal);
        // Calculate totals
        const totals = getTotalNutrition(dayMeals);
        return {
          day,
          meals: apiMeals,
          totalCalories: totals.calories,
          totalProtein: totals.protein,
          totalCarbs: totals.carbs,
          totalFats: totals.fats,
        };
      });
      
      const response = await fetch('/api/admin/diet', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${goal} Plan for ${user?.name}`,
          description: `Custom ${goal} diet plan - ${parseInt(calories)} kcal/day`,
          targetCalories: parseInt(calories),
          dietType: goal,
          weeklyPlan: weeklyPlanArray,
          createdBy: adminId,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Assign to user
        const assignResponse = await fetch('/api/admin/diet/assign', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dietPlanId: data.dietPlan.id,
            userIds: [selectedUser],
          }),
        });
        
        const assignData = await assignResponse.json();
        
        if (assignData.success) {
          alert(`✅ Diet Plan Created & Assigned!\n\n👤 Member: ${user?.name}\n🎯 Goal: ${goal}\n🔥 Calories: ${calories}/day\n\nThe member now has access to their personalized diet plan!`);
          fetchExistingPlans(); // Refresh the list
        } else {
          alert(`⚠️ Plan created but assignment failed: ${assignData.message}`);
        }
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Create diet plan error:', error);
      alert(`❌ Failed to create diet plan: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-label="Admin diet plan management" className="space-y-5 lg:space-y-8 min-h-screen p-4 lg:p-8" style={{ background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)' }}>
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-4xl font-bold text-gray-100">Diet Plans</h2>
          <p className="text-sm lg:text-base text-gray-400 mt-1">Manage weekly meal schedules</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              if (!selectedUser) {
                alert('⚠️ Please select a member first!');
                return;
              }
              alert('📄 Exporting Diet Plan\n\nGenerating PDF with:\n- Weekly meal schedule\n- Macro breakdown per day\n- Shopping list\n- Meal prep instructions\n\nAPI: GET /api/admin/diet/export coming soon!');
            }}
            className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 lg:px-6 lg:py-3 rounded-2xl bg-white/60 hover:bg-white/80 text-sm lg:text-base font-medium transition-all cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Export Plan
          </button>
          <button 
            onClick={async () => {
              if (!selectedUser) {
                alert('⚠️ Please select a member from the dropdown first!');
                return;
              }
              
              const goal = prompt('Diet goal? (Enter: Weight Loss / Muscle Gain / Maintenance)');
              if (!goal) return;
              
              const calories = prompt('Target daily calories? (e.g., 2000)');
              if (!calories) return;
              
              setLoading(true);
              try {
                const token = localStorage.getItem('authToken');
                const user = users.find((u: any) => u.id === selectedUser);
                
                // Create diet plan
                // Get admin's user ID from localStorage - try userId first, then parse from user object
                let adminId = localStorage.getItem('userId');
                if (!adminId) {
                  const storedUser = localStorage.getItem('user');
                  if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    adminId = parsedUser.id;
                  }
                }
                
                if (!adminId) {
                  alert('❌ Error: Could not get admin ID. Please log out and log back in.');
                  setLoading(false);
                  return;
                }
                
                // Convert weeklyPlan object to array format expected by API
                const weeklyPlanArray = daysOfWeek.map(day => {
                  const dayMeals = weeklyPlan[day] || [];
                  // Remove the 'id' field from meals as API doesn't expect it
                  const apiMeals = dayMeals.map(({ id, ...meal }) => meal);
                  // Calculate totals
                  const totals = getTotalNutrition(dayMeals);
                  return {
                    day,
                    meals: apiMeals,
                    totalCalories: totals.calories,
                    totalProtein: totals.protein,
                    totalCarbs: totals.carbs,
                    totalFats: totals.fats,
                  };
                });
                
                const response = await fetch('/api/admin/diet', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    name: `${goal} Plan for ${user?.name}`,
                    description: `Custom ${goal} diet plan`,
                    targetCalories: parseInt(calories),
                    dietType: goal,
                    weeklyPlan: weeklyPlanArray,
                    createdBy: adminId,
                  }),
                });

                const data = await response.json();
                
                if (data.success) {
                  // Assign to user
                  await fetch('/api/admin/diet/assign', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      dietPlanId: data.dietPlan.id,
                      userIds: [selectedUser],
                    }),
                  });
                  
                  alert(`✅ Diet Plan Created & Assigned!\n\n👤 Member: ${user?.name}\n🎯 Goal: ${goal}\n🔥 Calories: ${calories}\n\nThe member now has access to their personalized diet plan!`);
                } else {
                  alert(`❌ Error: ${data.message}`);
                }
              } catch (error) {
                alert(`❌ Failed to create diet plan: ${error}`);
              } finally {
                setLoading(false);
              }
            }}
            className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 lg:px-6 lg:py-3 rounded-2xl bg-iosBlue text-white text-sm lg:text-base font-medium hover:shadow-xl transition-all cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Plan
          </button>
        </div>
      </header>

      {/* User Selection */}
      <div className="ios-glass p-4 lg:p-6 rounded-3xl">
        <label htmlFor="user-select" className="block text-sm font-medium text-gray-300 mb-2">
          Select Member
        </label>
        <select
          id="user-select"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full lg:w-96 px-4 py-3 rounded-2xl bg-white/60 border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-iosBlue/50 text-sm lg:text-base"
        >
          <option value="">Choose a member...</option>
          {users.map((user: any) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      {/* Mobile Day Selector */}
      <div className="lg:hidden glass-card p-4">
        <label htmlFor="day-select" className="block text-sm font-medium text-gray-300 mb-2">
          Select Day
        </label>
        <select
          id="day-select"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-iosBlue/50 text-sm"
        >
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile: Single Day View */}
      <div className="lg:hidden space-y-3">
        {weeklyPlan[selectedDay]?.map((meal) => (
          <div key={meal.id} className="glass-card-strong p-4 shadow-depth">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-200">{meal.name}</h4>
                <p className="text-xs text-slate-500">{meal.type}</p>
              </div>
              <span className="px-2 py-1 rounded-lg bg-iosBlue/10 text-iosBlue text-xs font-medium">
                {meal.calories} kcal
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="font-medium text-gray-300">{meal.protein}g</div>
                <div className="text-slate-500">Protein</div>
              </div>
              <div>
                <div className="font-medium text-gray-300">{meal.carbs}g</div>
                <div className="text-slate-500">Carbs</div>
              </div>
              <div>
                <div className="font-medium text-gray-300">{meal.fats}g</div>
                <div className="text-slate-500">Fats</div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button 
                onClick={() => {
                  alert(`✏️ Edit Meal: ${meal.name}\n\nCurrent:\n🔥 ${meal.calories} kcal\n🥩 Protein: ${meal.protein}g\n🍞 Carbs: ${meal.carbs}g\n🧈 Fats: ${meal.fats}g\n\nYou can modify:\n- Portion sizes\n- Ingredients\n- Macros\n\nAPI: PUT /api/admin/diet/meals/${meal.id} coming soon!`);
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-iosBlue/10 text-iosBlue text-xs font-medium cursor-pointer"
              >
                Edit
              </button>
              <button 
                onClick={() => {
                  if (confirm(`🗑️ Remove ${meal.name} from ${selectedDay}?\n\nThis will remove the meal from the plan.`)) {
                    alert('❌ Meal removed!\n\nAPI: DELETE /api/admin/diet/meals/${meal.id} coming soon!');
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-100 text-gray-400 text-xs font-medium cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button 
          onClick={() => {
            alert(`➕ Add Meal to ${selectedDay}\n\nOptions:\n- Choose from Meal Library\n- Create custom meal\n- Import recipe\n- Quick add\n\nAPI: POST /api/admin/diet/meals coming soon!`);
          }}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 text-gray-400 text-sm font-medium hover:border-iosBlue hover:text-iosBlue transition-all cursor-pointer"
        >
          + Add Meal
        </button>
      </div>

      {/* Desktop: Weekly Grid View */}
      <div className="hidden lg:block ios-glass rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="bg-white/40 border-b border-slate-200/50">
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300 w-32">Meal Type</th>
                {daysOfWeek.map((day) => (
                  <th key={day} className="px-4 py-4 text-center text-sm font-semibold text-gray-300">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((mealType) => (
                <tr key={mealType} className="border-b border-slate-200/30">
                  <td className="px-4 py-3 font-medium text-gray-300 text-sm">{mealType}</td>
                  {daysOfWeek.map((day) => {
                    const dayMeals = weeklyPlan[day] || [];
                    const meal = dayMeals.find((m) => m.type === mealType);
                    return (
                      <td key={day} className="px-2 py-3">
                        {meal ? (
                          <div className="glass-chip p-3 hover:shadow-depth transition-all cursor-pointer">
                            <div className="font-medium text-gray-200 text-sm mb-1">{meal.name}</div>
                            <div className="text-xs text-gray-400 mb-2">{meal.calories} kcal</div>
                            <div className="flex gap-1 text-xs">
                              <span className="px-2 py-0.5 rounded bg-iosRed/10 text-iosRed">P: {meal.protein}g</span>
                              <span className="px-2 py-0.5 rounded bg-iosBlue/10 text-iosBlue">C: {meal.carbs}g</span>
                              <span className="px-2 py-0.5 rounded bg-iosPurple/10 text-iosPurple">F: {meal.fats}g</span>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => {
                              alert(`➕ Add ${mealType} for ${day}\n\nSelect from:\n- Meal Library below\n- Create new recipe\n- Import from database\n\nAPI: POST /api/admin/diet/meals coming soon!`);
                            }}
                            className="w-full h-20 rounded-xl border-2 border-dashed border-slate-200 hover:border-iosBlue hover:bg-iosBlue/5 transition-all text-slate-400 hover:text-iosBlue text-xs cursor-pointer"
                          >
                            + Add
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Daily Totals */}
        <div className="bg-white/20 border-t border-slate-200/50 p-4">
          <div className="grid grid-cols-8 gap-4">
            <div className="font-semibold text-gray-300 text-sm">Daily Totals</div>
            {daysOfWeek.map((day) => {
              const totals = getTotalNutrition(weeklyPlan[day] || []);
              return (
                <div key={day} className="text-center">
                  <div className="text-lg font-bold text-iosBlue">{totals.calories}</div>
                  <div className="text-xs text-gray-400">
                    {totals.protein}P / {totals.carbs}C / {totals.fats}F
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Meal Library */}
      <div className="glass-card-strong p-5 lg:p-8">
        <h3 className="text-lg lg:text-xl font-semibold mb-2">Meal Library</h3>
        <p className="text-sm text-slate-500 mb-5">Click on a meal to add it to the selected day&apos;s plan</p>
        
        {/* Group by meal type */}
        {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map(mealType => (
          <div key={mealType} className="mb-6 last:mb-0">
            <h4 className="text-sm font-medium text-gray-400 mb-3">{mealType} Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {mealLibrary.filter(m => m.type === mealType).map((meal) => (
                <button
                  key={meal.id}
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      // Mobile: add to selected day
                      addMealToDay(selectedDay, meal);
                    } else {
                      // Desktop: show day picker
                      const day = prompt(`Add "${meal.name}" to which day?\n\n${daysOfWeek.join('\n')}`);
                      if (day && daysOfWeek.includes(day as any)) {
                        addMealToDay(day, meal);
                      }
                    }
                  }}
                  className="text-left bg-white/60 p-4 rounded-2xl hover:bg-white/80 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-200 text-sm">{meal.name}</h4>
                      <p className="text-xs text-slate-500">{meal.time}</p>
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-iosBlue/10 text-iosBlue text-xs font-medium">
                      {meal.calories} kcal
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <div className="text-center">
                      <div className="font-medium text-iosRed">{meal.protein}g</div>
                      <div className="text-slate-500">Protein</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-iosBlue">{meal.carbs}g</div>
                      <div className="text-slate-500">Carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-iosPurple">{meal.fats}g</div>
                      <div className="text-slate-500">Fats</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="ios-glass p-5 lg:p-8 rounded-3xl bg-iosBlue/5">
        <h3 className="text-lg font-semibold mb-3">📋 How to Create a Diet Plan</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
          <li>Select a member from the dropdown above</li>
          <li>Click on meals from the Meal Library to add them to the weekly plan</li>
          <li>For desktop: Enter the day name when prompted. For mobile: Meals are added to the selected day</li>
          <li>Review the weekly grid to ensure all days have appropriate meals</li>
          <li>Click &quot;Create & Assign Plan&quot; to save and assign the diet plan to the member</li>
        </ol>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </section>
  );
}
