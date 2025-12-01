'use client';

import { useState, useEffect } from 'react';
import DynamicNavBar from '@/components/navigation/DynamicNavBar';
import ParallaxHero from '@/components/landing/ParallaxHero';
import AnimatedFeatures from '@/components/landing/AnimatedFeatures';
import AnimatedPricingCards from '@/components/landing/AnimatedPricingCards';
import TestimonialCarousel from '@/components/landing/TestimonialCarousel';
import MotionButton from '@/components/ui/MotionButton';
import { motion } from '@/lib/motion';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Features data
  const features = [
    {
      icon: '💪',
      title: 'AI-Powered Workouts',
      description: 'Personalized training plans that adapt to your progress and goals. Smart recommendations based on your performance.',
    },
    {
      icon: '🥗',
      title: 'Indian Nutrition Plans',
      description: 'Authentic Indian diet plans with dal, paneer, roti, and more. Designed by nutrition experts for Indian lifestyle.',
    },
    {
      icon: '📊',
      title: 'Real-Time Tracking',
      description: 'Monitor your progress with detailed analytics. Track workouts, calories, water intake, and body metrics.',
    },
    {
      icon: '👨‍🏫',
      title: 'Expert Trainers',
      description: 'Access to certified personal trainers. Get form corrections and personalized guidance.',
    },
    {
      icon: '🎯',
      title: 'Goal-Based Programs',
      description: 'Whether it\'s weight loss, muscle gain, or endurance - we have programs tailored for your goals.',
    },
    {
      icon: '📱',
      title: 'Mobile-First Design',
      description: 'Beautiful iOS-inspired interface. Seamless experience across all your devices.',
    },
  ];

  // Pricing tiers
  const pricingTiers = [
    {
      name: 'Starter',
      price: '₹999',
      period: '/month',
      description: 'Perfect for beginners starting their fitness journey',
      icon: '🚀',
      features: [
        'Basic workout plans',
        'Indian diet suggestions',
        'Progress tracking',
        'Mobile app access',
        'Email support',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Pro',
      price: '₹1,999',
      period: '/month',
      description: 'Most popular choice for serious fitness enthusiasts',
      icon: '⭐',
      features: [
        'Everything in Starter',
        'AI-powered personalization',
        'Expert trainer consultations',
        'Custom meal plans',
        'Priority support',
        'Advanced analytics',
      ],
      cta: 'Get Started',
      popular: true,
    },
    {
      name: 'Elite',
      price: '₹3,999',
      period: '/month',
      description: 'Ultimate fitness experience with premium features',
      icon: '👑',
      features: [
        'Everything in Pro',
        'Dedicated personal trainer',
        'Weekly video consultations',
        'Supplement recommendations',
        'Injury prevention program',
        '24/7 WhatsApp support',
      ],
      cta: 'Go Elite',
      popular: false,
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Software Engineer, Bangalore',
      image: 'https://i.pravatar.cc/150?img=12',
      content: 'Lost 15kg in 4 months! The Indian diet plans are amazing - I eat dal, roti, and sabzi every day. The app makes tracking so easy.',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      role: 'Marketing Manager, Mumbai',
      image: 'https://i.pravatar.cc/150?img=5',
      content: 'Best fitness app I\'ve used! The trainers are knowledgeable and the workout plans are perfect for my busy schedule. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Arjun Patel',
      role: 'Business Owner, Delhi',
      image: 'https://i.pravatar.cc/150?img=33',
      content: 'Gained 8kg muscle mass with their strength training program. The AI recommendations are spot-on. Worth every rupee!',
      rating: 5,
    },
    {
      name: 'Sneha Reddy',
      role: 'Teacher, Hyderabad',
      image: 'https://i.pravatar.cc/150?img=9',
      content: 'The nutrition plans are culturally relevant and delicious. I don\'t feel like I\'m on a diet at all. Amazing results in 3 months!',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <DynamicNavBar transparent />

      {/* Hero Section */}
      <ParallaxHero />

      {/* Features Section */}
      <AnimatedFeatures 
        features={features}
        title="Built for Results"
        subtitle="Everything you need to achieve your fitness goals"
      />

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Members', value: '50K+' },
              { label: 'Workouts Completed', value: '2M+' },
              { label: 'Kg Lost', value: '100K+' },
              { label: 'Success Rate', value: '95%' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                style={{ textAlign: 'center' }}
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <AnimatedPricingCards 
        tiers={pricingTiers}
        title="Simple, Transparent Pricing"
        subtitle="Choose the plan that fits your fitness journey"
      />

      {/* Testimonials Section */}
      <TestimonialCarousel 
        testimonials={testimonials}
        autoPlay
        interval={5000}
      />

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />
        
        {/* Animated orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Transform Your Life?
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Join 50,000+ Indians who are already achieving their fitness goals with Fitsense
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <MotionButton
                variant="secondary"
                size="lg"
                className="shadow-2xl"
              >
                Start Free Trial →
              </MotionButton>
              <MotionButton
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10"
              >
                Watch Demo
              </MotionButton>
            </div>

            <p className="text-blue-200 mt-8">
              No credit card required • 7-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-lg mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Licenses</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xl">
                F
              </div>
              <span className="text-xl font-bold">Fitsense</span>
            </div>
            
            <p className="text-gray-400">
              © 2024 Fitsense. All rights reserved.
            </p>

            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
