'use client';

import { useState, useEffect } from 'react';
import DynamicNavBar from '@/components/navigation/DynamicNavBar';
import MotionButton from '@/components/ui/MotionButton';

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
    <div className="min-h-screen ios-aurora-bg">
      {/* Navigation */}
      <DynamicNavBar transparent />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(122,167,255,0.15) 0%, rgba(158,245,194,0.1) 50%, rgba(185,215,255,0.12) 100%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-[#1C1C1E] mb-6">
            Transform Your Body,<br />Elevate Your Life
          </h1>
          <p className="text-xl md:text-2xl text-[#1C1C1E]/70 mb-8 max-w-3xl mx-auto">
            India's #1 AI-powered fitness platform with personalized workouts and nutrition plans
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MotionButton variant="primary" size="lg">Start Free Trial →</MotionButton>
            <MotionButton variant="secondary" size="lg">Watch Demo</MotionButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1C1C1E] mb-4">Built for Results</h2>
            <p className="text-xl text-[#1C1C1E]/70">Everything you need to achieve your fitness goals</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-3xl" style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.5)' }}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-[#1C1C1E] mb-2">{feature.title}</h3>
                <p className="text-[#1C1C1E]/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="workouts" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Active Members', value: '50K+' },
              { label: 'Workouts Completed', value: '2M+' },
              { label: 'Kg Lost', value: '100K+' },
              { label: 'Success Rate', value: '95%' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-3xl" style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.5)' }}>
                <div className="text-4xl md:text-5xl font-bold text-[#1C1C1E] mb-2">{stat.value}</div>
                <div className="text-[#1C1C1E]/60 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1C1C1E] mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-[#1C1C1E]/70">Choose the plan that fits your fitness journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <div key={tier.name} className="p-8 rounded-3xl relative" style={{ background: tier.popular ? 'rgba(122,167,255,0.2)' : 'rgba(255,255,255,0.4)', backdropFilter: 'blur(20px)', border: tier.popular ? '2px solid rgba(122,167,255,0.4)' : '1px solid rgba(255,255,255,0.5)' }}>
                {tier.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold">Most Popular</div>}
                <div className="text-5xl mb-4">{tier.icon}</div>
                <h3 className="text-2xl font-bold text-[#1C1C1E] mb-2">{tier.name}</h3>
                <p className="text-[#1C1C1E]/70 mb-4">{tier.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#1C1C1E]">{tier.price}</span>
                  <span className="text-[#1C1C1E]/60">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[#1C1C1E]/80">
                      <span className="text-green-500">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <MotionButton variant={tier.popular ? 'primary' : 'secondary'} className="w-full">{tier.cta}</MotionButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1C1C1E] mb-4">Loved by Thousands</h2>
            <p className="text-xl text-[#1C1C1E]/70">See what our members have to say</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.slice(0, 4).map((testimonial, index) => (
              <div key={index} className="p-6 rounded-3xl" style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.5)' }}>
                <div className="flex items-center gap-4 mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h4 className="font-bold text-[#1C1C1E]">{testimonial.name}</h4>
                    <p className="text-sm text-[#1C1C1E]/60">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-[#1C1C1E]/80 mb-3">{testimonial.content}</p>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => <span key={i} className="text-yellow-500">★</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(122,167,255,0.15) 0%, rgba(158,245,194,0.1) 50%, rgba(185,215,255,0.12) 100%)' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-[#1C1C1E] mb-6">Ready to Transform Your Life?</h2>
          <p className="text-xl md:text-2xl text-[#1C1C1E]/70 mb-12 max-w-2xl mx-auto">Join 50,000+ Indians who are already achieving their fitness goals with Fitsense</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <MotionButton variant="primary" size="lg">Start Free Trial →</MotionButton>
            <MotionButton variant="secondary" size="lg">Watch Demo</MotionButton>
          </div>
          <p className="text-[#1C1C1E]/50 mt-8">No credit card required • 7-day free trial • Cancel anytime</p>
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

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919876543210?text=Hi%20Fitsense%2C%20I%20want%20to%20know%20more%20about%20membership"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 lg:bottom-8 right-6 z-50"
      >
        <div className="relative">
          <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white shadow-lg">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
        </div>
      </a>
    </div>
  );
}
