"use client";

import React from 'react';
import { motion } from '@/lib/motion';
import Link from 'next/link';

interface PlanCardProps {
    name: string;
    price: number;
    duration: number;
    benefits: string[];
    isPopular?: boolean;
    onSubscribe?: () => void;
    isAuthenticated?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
    name,
    price,
    duration,
    benefits,
    isPopular = false,
    onSubscribe,
    isAuthenticated = false,
}) => {
    const handleSubscribeClick = () => {
        if (onSubscribe) {
            onSubscribe();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative h-full"
        >
            {/* Popular Badge */}
            {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div
                        className="px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg, #2D6EF8 0%, #8A5CF6 100%)',
                        }}
                    >
                        ⭐ MOST POPULAR
                    </div>
                </div>
            )}

            {/* Card Container */}
            <div
                className={`relative h-full rounded-3xl overflow-hidden transition-all duration-300 ${isPopular ? 'ring-2 ring-blue-400/50' : ''
                    }`}
                style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: isPopular
                        ? '2px solid rgba(122, 167, 255, 0.3)'
                        : '1px solid rgba(255, 255, 255, 0.14)',
                    boxShadow: isPopular
                        ? '0 12px 40px rgba(122, 167, 255, 0.25)'
                        : '0 8px 32px rgba(0, 0, 0, 0.18)',
                }}
            >
                <div className="p-6 md:p-8">
                    {/* Plan Name */}
                    <h3
                        className="text-2xl md:text-3xl font-bold mb-2"
                        style={{
                            background: 'linear-gradient(135deg, #7AA7FF 0%, #8A5CF6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        {name}
                    </h3>

                    {/* Price */}
                    <div className="mb-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl md:text-5xl font-bold text-white">
                                ₹{price}
                            </span>
                            <span className="text-gray-300 text-sm">
                                / {duration} {duration === 1 ? 'month' : 'months'}
                            </span>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3"
                            >
                                <div
                                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                                    style={{
                                        background: 'rgba(122, 167, 255, 0.2)',
                                    }}
                                >
                                    <svg
                                        className="w-3 h-3 text-blue-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <span className="text-gray-200 text-sm md:text-base">
                                    {benefit}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Subscribe Button */}
                    {isAuthenticated ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubscribeClick}
                            className="w-full py-3.5 rounded-2xl font-semibold text-white transition-all duration-300"
                            style={{
                                background: isPopular
                                    ? 'linear-gradient(135deg, #2D6EF8 0%, #8A5CF6 100%)'
                                    : 'rgba(122, 167, 255, 0.3)',
                                boxShadow: isPopular
                                    ? '0 8px 24px rgba(122, 167, 255, 0.4)'
                                    : '0 4px 16px rgba(0, 0, 0, 0.2)',
                            }}
                        >
                            Subscribe Now
                        </motion.button>
                    ) : (
                        <Link href="/auth/signup">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3.5 rounded-2xl font-semibold text-white transition-all duration-300"
                                style={{
                                    background: isPopular
                                        ? 'linear-gradient(135deg, #2D6EF8 0%, #8A5CF6 100%)'
                                        : 'rgba(122, 167, 255, 0.3)',
                                    boxShadow: isPopular
                                        ? '0 8px 24px rgba(122, 167, 255, 0.4)'
                                        : '0 4px 16px rgba(0, 0, 0, 0.2)',
                                }}
                            >
                                Get Started
                            </motion.button>
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default PlanCard;
