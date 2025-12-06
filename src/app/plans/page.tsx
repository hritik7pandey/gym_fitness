'use client';

import { useState, useEffect } from 'react';
import { motion } from '@/lib/motion';
import PlanCard from '@/components/plans/PlanCard';
import { useRouter } from 'next/navigation';

interface Plan {
    _id: string;
    name: string;
    price: number;
    durationMonths: number;
    features: string[];
    displayOrder: number;
}

export default function PlansPage() {
    const router = useRouter();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check authentication status
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        setIsAuthenticated(!!token);

        // Fetch plans from API
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await fetch('/api/plans');
            const data = await response.json();

            if (data.success) {
                setPlans(data.plans);
            }
        } catch (error) {
            console.error('Failed to fetch plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = (planId: string) => {
        // TODO: Implement subscription flow
        // For now, redirect to dashboard with upgrade parameter
        router.push(`/dashboard?upgrade=true&planId=${planId}`);
    };

    return (
        <div
            className="min-h-screen relative overflow-hidden"
            style={{
                background:
                    'linear-gradient(135deg, #2d3748 0%, #1a202c 30%, #2d3748 60%, #1a202c 100%)',
            }}
        >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating Particles */}
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: `${4 + Math.random() * 8}px`,
                            height: `${4 + Math.random() * 8}px`,
                            background: `rgba(122, 167, 255, ${0.3 + Math.random() * 0.4})`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -40, 0],
                            x: [0, Math.random() * 20 - 10, 0],
                            opacity: [0.2, 0.6, 0.2],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: 'easeInOut',
                        }}
                    />
                ))}

                {/* Gradient Orbs */}
                <motion.div
                    className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full blur-3xl"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(122, 167, 255, 0.2) 0%, rgba(139, 92, 246, 0.12) 50%, transparent 70%)',
                    }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.7, 0.5],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-[600px] h-[600px] rounded-full blur-3xl"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 70%)',
                    }}
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.4, 0.6, 0.4],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1,
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                        style={{
                            background: 'linear-gradient(135deg, #7AA7FF 0%, #8A5CF6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            filter: 'drop-shadow(0 0 20px rgba(122, 167, 255, 0.4))',
                        }}
                    >
                        Choose Your Plan
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                        Select the perfect membership plan to achieve your fitness goals
                    </p>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
                    </div>
                )}

                {/* Plans Grid */}
                {!loading && plans.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {plans.map((plan, index) => (
                            <PlanCard
                                key={plan._id}
                                name={plan.name}
                                price={plan.price}
                                duration={plan.durationMonths}
                                benefits={plan.features}
                                isPopular={index === 1} // Mark middle plan as popular
                                isAuthenticated={isAuthenticated}
                                onSubscribe={() => handleSubscribe(plan._id)}
                            />
                        ))}
                    </div>
                )}

                {/* Premium Hub Access Card */}
                {!loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-16 max-w-4xl mx-auto"
                    >
                        <div className="glass-card p-8 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-2xl font-bold text-white mb-2">Premium Hub Access</h3>
                                    <p className="text-gray-300 mb-4">
                                        Unlock the full potential of your fitness journey with our digital companion.
                                    </p>
                                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                        {['Advanced Analytics', 'Workout Tracking', 'Diet Plans', 'Progress Photos'].map((feature) => (
                                            <span key={feature} className="px-3 py-1 rounded-full bg-white/10 text-sm text-blue-300 border border-blue-500/30">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-4 min-w-[200px]">
                                    <div className="text-center">
                                        <span className="text-3xl font-bold text-white">₹199</span>
                                        <span className="text-gray-400">/month</span>
                                    </div>
                                    <button
                                        onClick={() => router.push('/dashboard?upgrade=true&type=hub_access')}
                                        className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-105"
                                    >
                                        Get Hub Access
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Empty State */}
                {!loading && plans.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            No Plans Available
                        </h3>
                        <p className="text-gray-400">
                            Check back soon for membership options
                        </p>
                    </motion.div>
                )}

                {/* Back to Home Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-12"
                    className="text-center mt-12"
                >
                    <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-gray-300 hover:text-white transition-all duration-300"
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back to Home
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
