# 🔒 Access Control System - Premium Hub Access

## Overview

The gym fitness platform now has a **two-tier access control system**:

1. **Gym Membership** (3/6/12 month packages) - Physical gym access
2. **Premium Hub Access** (₹199/month) - Full app/website features

## 🎯 Access Levels

### **Without Premium Hub Access** (Free/Basic)
Users can ONLY access:
- ✅ Landing page (`/`)
- ✅ Login/Signup pages (`/login`, `/auth/signup`)
- ✅ Plans page (`/plans`) - View and purchase plans
- ✅ Profile page (`/profile`) - View/edit profile
- ✅ Settings page (`/settings`) - Account settings
- ✅ Contact page (`/contact`)

### **With Premium Hub Access** (₹199/month)
Users get access to ALL features:
- ✅ **Dashboard** (`/dashboard`) - Stats, progress, overview
- ✅ **Workouts** (`/workouts`) - Workout tracking & planning
- ✅ **Nutrition** (`/nutrition`) - Diet plans & tracking
- ✅ **Diet** (`/diet`) - Meal planning
- ✅ **Attendance** (`/attendance`) - Check-in tracking
- ✅ **Progress** (`/progress`) - Progress analytics
- ✅ **Analytics** (`/analytics`) - Detailed insights
- ✅ All public routes above

### **Admin Access**
Admins have:
- ✅ Full access to all features (regardless of membership)
- ✅ Admin panel (`/admin/*`)
- ✅ User management
- ✅ Can upgrade any user's membership

## 🛠️ Implementation

### **Files Created:**

1. **`src/lib/access-control.ts`**
   - Defines which routes require Premium Hub Access
   - Utility functions to check access
   - Route categorization (public, premium, admin)

2. **`src/hooks/useAccessControl.ts`**
   - React hook for client-side access control
   - Fetches user data from `/api/users/me`
   - Checks Premium Hub Access status
   - Redirects to profile if access denied

### **How It Works:**

```typescript
// 1. User tries to access /dashboard
// 2. useAccessControl hook runs
// 3. Checks if route requires Premium Hub Access
// 4. Fetches user data from API
// 5. Checks user.hasPremiumHubAccess
// 6. If false, redirects to /profile?upgrade=true
// 7. If true, allows access
```

### **Dashboard Protection:**

```typescript
export default function UserDashboard() {
  // Access control check
  const { isChecking, hasAccess } = useAccessControl();
  
  // Show loading while checking
  if (isChecking) {
    return <LoadingScreen />;
  }
  
  // Show restricted message if no access
  if (!hasAccess) {
    return <RestrictedMessage />;
  }
  
  // Show dashboard if has access
  return <DashboardContent />;
}
```

## 📋 Route Configuration

### **Premium Routes** (Require ₹199/month Hub Access):
```typescript
const PREMIUM_ROUTES = [
  '/dashboard',
  '/workouts',
  '/nutrition',
  '/diet',
  '/attendance',
  '/progress',
  '/analytics',
];
```

### **Public Routes** (No Hub Access Required):
```typescript
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/auth/signin',
  '/auth/signup',
  '/plans',
  '/contact',
  '/profile',
  '/settings',
];
```

### **Admin Routes** (Admin Role Required):
```typescript
const ADMIN_ROUTES = [
  '/admin',
];
```

## 🔄 User Flow

### **New User (No Membership)**
```
1. Register → Login
2. Redirected to Dashboard
3. Access denied (no Premium Hub Access)
4. Redirected to /profile?upgrade=true
5. See upgrade message
6. Click "View Plans"
7. Purchase Premium Hub Access (₹199/month)
8. Now can access Dashboard & all features
```

### **User with Gym Membership Only**
```
1. Has 3/6/12 month gym package
2. Can access gym physically
3. Tries to access Dashboard
4. Access denied (no Premium Hub Access)
5. Must purchase ₹199/month Hub Access
6. Then gets full app access
```

### **User with Premium Hub Access**
```
1. Has ₹199/month Hub Access
2. Can access all app features
3. Dashboard, Workouts, Nutrition, etc.
4. Full functionality unlocked
```

## 💡 Key Points

### **Separation of Concerns:**
- **Gym Membership** = Physical gym access
- **Premium Hub Access** = Digital app access
- Both are independent subscriptions

### **Why This System?**
1. **Monetization**: ₹199/month recurring revenue
2. **Flexibility**: Users can choose gym-only or app-only
3. **Value**: Full app features for affordable price
4. **Scalability**: Easy to add more premium features

### **Access Check Flow:**
```
User Request
    ↓
Is route premium?
    ↓ Yes
Check authentication
    ↓ Authenticated
Fetch user data
    ↓
Check hasPremiumHubAccess
    ↓ True
Allow access ✅
    ↓ False
Redirect to /profile ❌
```

## 🎨 User Experience

### **Restricted Access Message:**
When users without Hub Access try to access premium features:

```
🔒
Premium Hub Access Required

This feature requires Premium Hub Access 
(₹199/month) for full app functionality.

[View Plans]
```

### **Profile Page Upgrade Prompt:**
```
💳 Upgrade to Premium Hub Access

Get full access to:
✓ Dashboard & Analytics
✓ Workout Tracking
✓ Nutrition Planning
✓ Progress Reports
✓ And more!

Only ₹199/month

[Upgrade Now]
```

## 🔧 Admin Controls

Admins can:
- ✅ Grant Premium Hub Access to any user
- ✅ Set access start/end dates
- ✅ View who has access
- ✅ Revoke access if needed

**In Admin Panel:**
```
Edit User → Premium Hub Access checkbox
✓ Enable Premium Hub Access
Start Date: [date picker]
End Date: [date picker]
[Save]
```

## 📊 Database Schema

```typescript
User {
  // ... other fields
  
  // Premium Hub Access
  hasPremiumHubAccess: boolean;
  premiumHubAccessStartDate: Date;
  premiumHubAccessEndDate: Date;
}
```

## ✅ Testing

### **Test Scenarios:**

1. **User without Hub Access:**
   ```
   - Login
   - Try to access /dashboard
   - Should redirect to /profile
   - See upgrade message
   ```

2. **User with Hub Access:**
   ```
   - Login
   - Access /dashboard
   - Should see dashboard
   - All features work
   ```

3. **Admin:**
   ```
   - Login as admin
   - Access any route
   - Should always work
   - Can manage users
   ```

## 🚀 Next Steps

To apply this to other pages:

1. **Import the hook:**
   ```typescript
   import { useAccessControl } from '@/hooks/useAccessControl';
   ```

2. **Use in component:**
   ```typescript
   const { isChecking, hasAccess } = useAccessControl();
   
   if (isChecking) return <Loading />;
   if (!hasAccess) return <Restricted />;
   ```

3. **That's it!** The hook handles everything.

## 📝 Summary

- ✅ Access control system implemented
- ✅ Dashboard protected with Premium Hub Access check
- ✅ Users without access redirected to profile
- ✅ Clear upgrade messaging
- ✅ Admin can grant/revoke access
- ✅ Two-tier system (Gym + Hub Access)

**Users without ₹199/month Premium Hub Access can ONLY access:**
- Profile, Settings, Plans, Landing page

**All other features require Premium Hub Access!** 🔒

---

**Last Updated**: 2025-12-06
**Status**: ✅ Implemented
