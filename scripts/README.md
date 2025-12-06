# Database Seeding Guide

This guide explains how to populate your database with initial data for the gym fitness application.

## Prerequisites

- MongoDB installed and running
- Node.js installed
- Environment variables configured in `.env.local`

## Seed Scripts

### 1. Seed Membership Plans

Populates the database with 4 membership plans based on FITSENSE FITNESS HUB pricing:

**Plans:**
- **Premium Hub Access**: ₹199/month
  - Required for full app access (dashboard, workouts, nutrition, etc.)
  - Without this, users can only access profile settings
  
- **3 Month Package**: ₹2999 (discounted from ₹3499)
  - Access to gym equipment during regular hours
  - Monthly progress report
  - Valid for 90 days
  
- **6 Month Package**: ₹4999 (discounted from ₹5499)
  - Access to gym equipment during extended hours
  - Monthly progress report
  - Priority equipment access
  - Valid for 180 days
  
- **12 Month Package**: ₹6499 (discounted from ₹7999)
  - Access to gym equipment during regular hours
  - Monthly progress report
  - Priority equipment access
  - Free guest pass (1 per month)
  - Valid for 365 days

**Run:**
```bash
node scripts/seedPlans.js
```

### 2. Seed Admin User

Creates an admin user with the highest level membership (12 months):

**Credentials:**
- Email: `admin@fitsense.com`
- Password: `admin123`
- Role: admin
- Membership: 12 Month Package
- Phone: +919876543210

**Admin Capabilities:**
- Can upgrade any user's membership
- Full access to all dashboard features
- Can manage plans, users, and announcements
- Highest level membership (12 months)

**Run:**
```bash
node scripts/seedAdmin.js
```

**⚠️ IMPORTANT:** Change the admin password after first login!

## Running All Seeds

To seed both plans and admin user:

```bash
# Seed plans first
node scripts/seedPlans.js

# Then seed admin user
node scripts/seedAdmin.js
```

## Membership System Overview

### Access Control

1. **Gym Membership Packages** (3/6/12 months)
   - Provides physical gym access
   - Duration is calendar-based (includes all days, including Sundays)
   - Counted by days from start date, not by attendance

2. **Premium Hub Access** (₹199/month)
   - Required for full app/website features
   - Enables: Dashboard, Workouts, Nutrition, Attendance tracking, Analytics
   - Without this: Users can only access Profile settings and view/change membership

### User Flow

**Without Premium Hub Access:**
- User can register and login
- Access limited to:
  - Profile page (view/edit profile)
  - Membership management (view/upgrade plans)
  - Settings page

**With Premium Hub Access:**
- Full access to all features:
  - Dashboard with stats and progress
  - Workout tracking and planning
  - Nutrition management
  - Attendance tracking
  - Progress analytics
  - Announcements and notifications

### Admin Capabilities

Admins can:
- Upgrade any user's membership to any package
- Grant/revoke Premium Hub Access
- Manage all plans
- View all users and their memberships
- Full access to all features regardless of membership

## Database Schema Updates

The User model now includes:

```typescript
membershipType?: 'None' | 'Basic' | 'Premium' | 'Elite' | 
                 '3 Month Package' | '6 Month Package' | '12 Month Package';
membershipStartDate?: Date;
membershipEndDate?: Date;

// Premium Hub Access
hasPremiumHubAccess?: boolean;
premiumHubAccessStartDate?: Date;
premiumHubAccessEndDate?: Date;
```

## Troubleshooting

### Connection Issues

If you get a MongoDB connection error:
1. Ensure MongoDB is running: `mongod` or check your MongoDB service
2. Check your `MONGODB_URI` in `.env.local`
3. Default connection: `mongodb://localhost:27017/gym-fitness`

### Duplicate Key Errors

If you get duplicate key errors:
- Plans: The script clears existing plans before seeding
- Admin: Check if admin user already exists (email: admin@fitsense.com)

### Module Not Found

If you get "Cannot find module" errors:
```bash
npm install mongoose bcryptjs
```

## Next Steps

After seeding:

1. **Test Admin Login:**
   - Go to `/login`
   - Use: admin@fitsense.com / admin123
   - Change password in profile settings

2. **View Plans:**
   - Go to `/plans`
   - Should see all 4 plans displayed

3. **Test User Registration:**
   - Register a new user
   - Check that they have no membership by default
   - Try accessing dashboard (should be restricted without Premium Hub Access)

4. **Test Membership Upgrade:**
   - As admin, upgrade a user's membership
   - Test that they can access features based on their membership level

## Support

For issues or questions, refer to the main project README or contact the development team.
