"use client";
import React, { useState, useEffect } from 'react';
import { motion } from '@/lib/motion';
import AnimatedGlassCard from '@/components/ui/AnimatedGlassCard';
import MotionButton from '@/components/ui/MotionButton';

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  logged: boolean;
}

const mockMeals: Meal[] = [
  { id: '1', name: 'Oatmeal & Berries', time: '08:00 AM', calories: 350, protein: 12, carbs: 55, fats: 8, logged: true },
  { id: '2', name: 'Greek Yogurt', time: '10:30 AM', calories: 150, protein: 15, carbs: 12, fats: 5, logged: true },
  { id: '3', name: 'Grilled Chicken Salad', time: '12:30 PM', calories: 420, protein: 35, carbs: 25, fats: 18, logged: false },
  { id: '4', name: 'Protein Shake', time: '03:00 PM', calories: 200, protein: 25, carbs: 15, fats: 4, logged: false },
  { id: '5', name: 'Salmon & Veggies', time: '07:00 PM', calories: 480, protein: 40, carbs: 30, fats: 22, logged: false },
];

export default function NutritionPage() {
  const [meals, setMeals] = useState<Meal[]>(mockMeals);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDietPlan();
    fetchLoggedMeals();
  }, []);

  const fetchLoggedMeals = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/diet/log-meal', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      
      if (data.success && data.meals && data.meals.length > 0) {
        // Mark meals as logged based on API response
        const loggedMealIds = data.meals.map((m: any) => m.mealId);
        setMeals(prev => prev.map(meal => ({
          ...meal,
          logged: loggedMealIds.includes(meal.id)
        })));
      }
    } catch (error) {
      console.error('Failed to fetch logged meals:', error);
    }
  };

  const logMeal = async (mealId: string) => {
    const meal = meals.find(m => m.id === mealId);
    if (!meal) return;

    // Optimistically update UI
    setMeals(meals.map(m => m.id === mealId ? { ...m, logged: true } : m));

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/diet/log-meal', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meal }),
      });

      const data = await response.json();
      if (!data.success) {
        // Revert on failure
        setMeals(meals.map(m => m.id === mealId ? { ...m, logged: false } : m));
      }
    } catch (error) {
      console.error('Failed to log meal:', error);
      setMeals(meals.map(m => m.id === mealId ? { ...m, logged: false } : m));
    }
  };

  const addNewMeal = async () => {
    const mealName = prompt('Enter meal name:');
    if (!mealName) return;
    const calories = prompt('Calories (kcal):');
    if (!calories || isNaN(Number(calories))) return;
    const protein = prompt('Protein (g):') || '0';
    const carbs = prompt('Carbs (g):') || '0';
    const fats = prompt('Fats (g):') || '0';

    const newMeal: Meal = {
      id: `meal-${Date.now()}`,
      name: mealName,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fats: Number(fats),
      logged: true,
    };

    setMeals([...meals, newMeal]);

    // Save to backend
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (token) {
        await fetch('/api/diet/log-meal', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ meal: newMeal }),
        });
      }
    } catch (error) {
      console.error('Failed to save meal:', error);
    }

    alert(`✅ Meal Added!\n\n🍴 ${mealName}\n🔥 ${calories} kcal`);
  };

  const fetchDietPlan = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/diet/my-plan', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.dietPlan && data.dietPlan.weeklyPlan) {
        // Get today's meals from weekly plan
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const todayPlan = data.dietPlan.weeklyPlan[today];
        
        if (todayPlan && todayPlan.length > 0) {
          const formattedMeals = todayPlan.map((meal: any, index: number) => ({
            id: meal._id || `meal-${index}`,
            name: meal.name,
            time: meal.time || `${8 + index * 2}:00 AM`,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fats: meal.fats,
            logged: false,
          }));
          setMeals(formattedMeals);
        }
      }
    } catch (error) {
      console.error('Failed to fetch diet plan:', error);
    } finally {
      setLoading(false);
    }
  };
  const totalCalories = meals.filter((m) => m.logged).reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = meals.filter((m) => m.logged).reduce((acc, m) => acc + m.protein, 0);
  const totalCarbs = meals.filter((m) => m.logged).reduce((acc, m) => acc + m.carbs, 0);
  const totalFats = meals.filter((m) => m.logged).reduce((acc, m) => acc + m.fats, 0);
  const targetCalories = 1800;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(240, 244, 255, 0.4) 0%, rgba(232, 236, 255, 0.3) 50%, rgba(221, 226, 255, 0.4) 100%)' }}>
      {/* iOS 26 Ambient Glow Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-8%] left-[-4%] w-[500px] h-[500px] rounded-full opacity-30 animate-float" style={{ background: 'radial-gradient(circle, rgba(185, 215, 255, 0.6) 0%, rgba(216, 199, 255, 0.3) 60%, transparent 100%)', filter: 'blur(48px)' }} />
        <div className="absolute bottom-[-10%] right-[-4%] w-[600px] h-[600px] rounded-full opacity-25 animate-float" style={{ background: 'radial-gradient(circle, rgba(166, 241, 255, 0.5) 0%, rgba(229, 225, 255, 0.25) 60%, transparent 100%)', filter: 'blur(48px)', animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/3 w-[450px] h-[450px] rounded-full opacity-20 animate-float" style={{ background: 'radial-gradient(circle, rgba(216, 199, 255, 0.4) 0%, rgba(185, 215, 255, 0.2) 60%, transparent 100%)', filter: 'blur(48px)', animationDelay: '4s' }} />
      </div>

      <section aria-label="Nutrition tracking" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8 space-y-5">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <h2 className="text-[32px] lg:text-[40px] font-[800] text-[#1C1C1E]" style={{ fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
            🍎 Nutrition
          </h2>
          <p className="text-[15px] lg:text-[17px] font-[600] text-[#1C1C1E]/70 mt-1.5" style={{ fontFamily: 'SF Pro, -apple-system, sans-serif' }}>Track your daily meals and macros</p>
        </motion.header>

      {/* Daily Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <AnimatedGlassCard delay={0.1} depth="medium">
          <div className="text-center">
            <div className="text-3xl mb-2">🔥</div>
            <h3 className="text-xs font-medium text-gray-600 mb-1.5">Calories</h3>
            <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-1.5">
              {totalCalories}
            </div>
            <div className="text-xs text-gray-500">/ {targetCalories} kcal</div>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((totalCalories / targetCalories) * 100, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
            </div>
          </div>
        </AnimatedGlassCard>

        <AnimatedGlassCard delay={0.2} depth="medium">
          <div className="text-center">
            <div className="text-4xl mb-3">🥩</div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Protein</h3>
            <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-1">
              {totalProtein}g
            </div>
            <div className="text-xs text-gray-500">Target: 135g</div>
          </div>
        </AnimatedGlassCard>

        <AnimatedGlassCard delay={0.3} depth="medium">
          <div className="text-center">
            <div className="text-4xl mb-3">🍞</div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Carbs</h3>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-1">
              {totalCarbs}g
            </div>
            <div className="text-xs text-gray-500">Target: 180g</div>
          </div>
        </AnimatedGlassCard>

        <AnimatedGlassCard delay={0.4} depth="medium">
          <div className="text-center">
            <div className="text-4xl mb-3">🧈</div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Fats</h3>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent mb-1">
              {totalFats}g
            </div>
            <div className="text-xs text-gray-500">Target: 60g</div>
          </div>
        </AnimatedGlassCard>
      </div>

      {/* Today's Meals */}
      <AnimatedGlassCard delay={0.5}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>🍽️</span>
            Today's Meals
          </h3>
          <MotionButton
            variant="primary"
            onClick={addNewMeal}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Log Meal
          </MotionButton>
        </div>

        <div className="space-y-4">
          {meals.map((meal, index) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              whileHover={{ x: 5, scale: 1.01 }}
              style={{
                background: meal.logged ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.25)',
                backdropFilter: 'blur(40px) saturate(180%)',
                border: meal.logged ? '1px solid rgba(255,255,255,0.5)' : '2px dashed rgba(255,255,255,0.6)',
                boxShadow: meal.logged ? 'inset 0 1px 0 rgba(255,255,255,0.7), 0 8px 32px rgba(0,0,0,0.06)' : 'none'
              }}
              className="p-4 lg:p-5 rounded-2xl transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-slate-800">{meal.name}</h4>
                    {meal.logged && (
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        ✓ Logged
                      </span>
                    )}
                  </div>
                  <p className="text-xs lg:text-sm text-slate-500">{meal.time}</p>
                </div>

                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="text-center">
                    <div className="text-lg lg:text-xl font-bold text-iosBlue">{meal.calories}</div>
                    <div className="text-xs text-slate-500">kcal</div>
                  </div>

                  <div className="hidden lg:flex items-center gap-3 text-sm">
                    <div className="px-3 py-1 rounded-lg bg-iosRed/10 text-iosRed font-medium">
                      P: {meal.protein}g
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-iosBlue/10 text-iosBlue font-medium">
                      C: {meal.carbs}g
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-iosPurple/10 text-iosPurple font-medium">
                      F: {meal.fats}g
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!meal.logged) {
                        logMeal(meal.id);
                        alert(`✅ Meal Logged!\n\n🍴 ${meal.name}\n🔥 ${meal.calories} kcal`);
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      meal.logged
                        ? 'bg-slate-100 text-slate-600 cursor-not-allowed'
                        : 'bg-iosBlue text-white hover:shadow-md'
                    }`}
                    disabled={meal.logged}
                  >
                    {meal.logged ? '✓ Logged' : 'Log'}
                  </button>
                </div>
              </div>

              {/* Mobile Macros */}
              <div className="lg:hidden flex gap-2 mt-3 text-xs">
                <span className="px-2 py-1 rounded bg-iosRed/10 text-iosRed font-medium">P: {meal.protein}g</span>
                <span className="px-2 py-1 rounded bg-iosBlue/10 text-iosBlue font-medium">C: {meal.carbs}g</span>
                <span className="px-2 py-1 rounded bg-iosPurple/10 text-iosPurple font-medium">F: {meal.fats}g</span>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedGlassCard>

      {/* Weekly Progress - Desktop */}
      <AnimatedGlassCard delay={0.9} className="hidden lg:block">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>📊</span>
          Weekly Progress
        </h3>
        <div className="grid grid-cols-7 gap-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const percentage = Math.floor(Math.random() * 40) + 60;
            return (
              <motion.div 
                key={day} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.0 + i * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center">
                <div className="text-sm font-medium text-gray-700 mb-3">{day}</div>
                <div 
                  style={{
                    background: 'rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(20px) saturate(150%)',
                    border: '1px solid rgba(255,255,255,0.4)'
                  }}
                  className="h-32 rounded-2xl overflow-hidden flex items-end shadow-lg">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 1.1 + i * 0.1, ease: 'easeOut' }}
                    className="w-full bg-gradient-to-t from-green-500 to-emerald-400"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-2 font-medium">{percentage}%</div>
              </motion.div>
            );
          })}
        </div>
      </AnimatedGlassCard>
    </section>
    </div>
  );
}
