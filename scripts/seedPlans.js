/**
 * Seed Script for Gym Membership Plans
 * Based on FITSENSE FITNESS HUB PACKAGE pricing
 * 
 * Run this script to populate the database with initial plan data:
 * node scripts/seedPlans.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');

// Plan Schema (matching src/models/Plan.ts)
const PlanSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        durationMonths: { type: Number, required: true, default: 1, min: 1 },
        features: { type: [String], default: [] },
        isActive: { type: Boolean, default: true },
        displayOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Plan = mongoose.models.Plan || mongoose.model('Plan', PlanSchema);

// Membership Plans Data
const plans = [
    {
        name: '3 Month Package',
        price: 2999, // Discounted price (from 3499)
        durationMonths: 3,
        features: [
            'Access to gym equipment during regular hours',
            'Monthly progress report',
            'Valid for 90 days from start date',
        ],
        isActive: true,
        displayOrder: 1,
    },
    {
        name: '6 Month Package',
        price: 4999, // Discounted price (from 5499)
        durationMonths: 6,
        features: [
            'Access to gym equipment during extended hours',
            'Monthly progress report',
            'Priority equipment access',
            'Valid for 180 days from start date',
        ],
        isActive: true,
        displayOrder: 2,
    },
    {
        name: '12 Month Package',
        price: 6499, // Discounted price (from 7999)
        durationMonths: 12,
        features: [
            'Access to gym equipment during regular hours',
            'Monthly progress report',
            'Priority equipment access',
            'Free guest pass (1 per month)',
            'Valid for 365 days from start date',
        ],
        isActive: true,
        displayOrder: 3,
    },
    {
        name: 'Premium Hub Access',
        price: 199, // Monthly add-on for full app access
        durationMonths: 1,
        features: [
            'Full dashboard access',
            'Workout tracking & planning',
            'Nutrition management',
            'Attendance tracking',
            'Progress analytics',
            'Announcement notifications',
            'Required for app features beyond profile',
        ],
        isActive: true,
        displayOrder: 0, // Show first as it's required for app access
    },
];

async function seedPlans() {
    try {
        // Connect to MongoDB using environment variable
        const MONGODB_URI = process.env.MONGODB_URI;

        if (!MONGODB_URI) {
            console.error('❌ MONGODB_URI not found in environment variables');
            console.log('💡 Make sure .env.local file exists with MONGODB_URI');
            process.exit(1);
        }

        console.log('🔌 Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        // Clear existing plans
        await Plan.deleteMany({});
        console.log('🗑️  Cleared existing plans');

        // Insert new plans
        const insertedPlans = await Plan.insertMany(plans);
        console.log(`✅ Inserted ${insertedPlans.length} plans:`);

        insertedPlans.forEach((plan) => {
            console.log(`   - ${plan.name}: ₹${plan.price} (${plan.durationMonths} month${plan.durationMonths > 1 ? 's' : ''})`);
        });

        console.log('\n📋 Plan Details:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Premium Hub Access (₹199/month):');
        console.log('  - Required for full app access (dashboard, workouts, nutrition)');
        console.log('  - Without this, users can only access profile settings');
        console.log('\nGym Membership Packages:');
        console.log('  - 3 Month: ₹2999 (₹3499 original)');
        console.log('  - 6 Month: ₹4999 (₹5499 original)');
        console.log('  - 12 Month: ₹6499 (₹7999 original)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        await mongoose.connection.close();
        console.log('✅ Database connection closed');
        console.log('\n🎉 Seed completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding plans:', error);
        process.exit(1);
    }
}

// Run the seed function
seedPlans();
