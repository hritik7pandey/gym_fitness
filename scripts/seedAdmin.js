/**
 * Seed Script for Admin User
 * Creates an admin user with highest level membership
 * 
 * Run this script to create the admin user:
 * node scripts/seedAdmin.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema (matching src/models/User.ts)
const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        phone: { type: String },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        membershipType: { type: String, enum: ['None', 'Basic', 'Premium', 'Elite', '3 Month Package', '6 Month Package', '12 Month Package'], default: 'None' },
        membershipStartDate: { type: Date },
        membershipEndDate: { type: Date },
        isEmailVerified: { type: Boolean, default: false },
        hasPremiumHubAccess: { type: Boolean, default: false },
        premiumHubAccessStartDate: { type: Date },
        premiumHubAccessEndDate: { type: Date },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedAdmin() {
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

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@fitsense.com' });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            console.log(`   Email: ${existingAdmin.email}`);
            console.log(`   Name: ${existingAdmin.name}`);
            await mongoose.connection.close();
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Calculate membership dates (12 months from now)
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 12);

        // Calculate premium hub access dates (12 months from now)
        const hubAccessEndDate = new Date();
        hubAccessEndDate.setMonth(hubAccessEndDate.getMonth() + 12);

        // Create admin user
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@fitsense.com',
            password: hashedPassword,
            phone: '+919876543210',
            role: 'admin',
            membershipType: '12 Month Package', // Highest level membership
            membershipStartDate: startDate,
            membershipEndDate: endDate,
            isEmailVerified: true, // Admin is pre-verified
            hasPremiumHubAccess: true, // Admin has full app access
            premiumHubAccessStartDate: startDate,
            premiumHubAccessEndDate: hubAccessEndDate,
        });

        console.log('\n✅ Admin user created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email: admin@fitsense.com');
        console.log('🔑 Password: admin123');
        console.log('👤 Name: Admin User');
        console.log('📱 Phone: +919876543210');
        console.log('🎖️  Role: admin');
        console.log('💳 Membership: 12 Month Package');
        console.log(`📅 Valid Until: ${endDate.toLocaleDateString()}`);
        console.log('🌟 Premium Hub Access: Enabled');
        console.log(`📅 Hub Access Until: ${hubAccessEndDate.toLocaleDateString()}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🔐 IMPORTANT: Change the password after first login!');
        console.log('\n✨ Admin Capabilities:');
        console.log('   - Can upgrade any user\'s membership');
        console.log('   - Full access to all dashboard features');
        console.log('   - Can manage plans, users, and announcements');
        console.log('   - Highest level membership (12 months)');
        console.log('   - Premium Hub Access enabled');

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        console.log('🎉 Seed completed successfully!\n');
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
}

// Run the seed function
seedAdmin();
