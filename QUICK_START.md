# Quick Start Guide - Gym Fitness Platform

## 🚀 Getting Started in 5 Minutes

### Step 1: Start MongoDB

**Windows:**
```powershell
# Option 1: Start as service
net start MongoDB

# Option 2: Start manually
mongod
```

**Verify MongoDB is running:**
```powershell
# Should connect without errors
mongosh
```

### Step 2: Seed the Database

```powershell
# Navigate to project directory
cd "e:\New folder\gym_fitness-dark-theme-transparent-glass"

# Seed membership plans
node scripts/seedPlans.js

# Seed admin user
node scripts/seedAdmin.js
```

**Expected Output:**
```
✅ Connected to MongoDB
🗑️  Cleared existing plans
✅ Inserted 4 plans:
   - Premium Hub Access: ₹199 (1 month)
   - 3 Month Package: ₹2999 (3 months)
   - 6 Month Package: ₹4999 (6 months)
   - 12 Month Package: ₹6499 (12 months)
```

### Step 3: Start Development Server

```powershell
npm run dev
```

### Step 4: Test the Application

#### **Login as Admin:**
1. Open: `http://localhost:3000/login`
2. Use:
   - Email: `admin@fitsense.com`
   - Password: `admin123`
3. ✅ You should see the dashboard with membership status card

#### **View Plans:**
1. Open: `http://localhost:3000/plans`
2. ✅ Should see 4 plans in a beautiful liquid glass design

#### **Test User Flow:**
1. Register a new user at `/auth/signup`
2. Login with new user credentials
3. ❌ Dashboard should be restricted (no Premium Hub Access)
4. ✅ Can access profile settings
5. ✅ Can view and upgrade membership at `/plans`

## 📊 Membership System Overview

### Plans Available:

| Plan | Price | Duration | Access |
|------|-------|----------|--------|
| **Premium Hub Access** | ₹199/month | 1 month | Full app features |
| **3 Month Package** | ₹2999 | 3 months | Gym equipment (regular hours) |
| **6 Month Package** | ₹4999 | 6 months | Gym equipment (extended hours) |
| **12 Month Package** | ₹6499 | 12 months | Gym + guest pass |

### Access Control:

**Without Premium Hub Access (₹199/month):**
- ❌ Dashboard, Workouts, Nutrition, Analytics
- ✅ Profile settings, Membership management

**With Premium Hub Access:**
- ✅ Full access to ALL features

**Admin:**
- ✅ Full access always
- ✅ Can upgrade any user's membership

## 🎯 Key Features Implemented

### 1. **Dashboard with Membership Card** ✓
- Shows current membership status
- Displays start/end dates
- Upgrade membership button
- "No active membership" state

### 2. **Plans Page** ✓
- Responsive grid layout (1/2/3 columns)
- Liquid glass theme
- Animated cards
- Subscribe/Get Started buttons

### 3. **User Authentication** ✓
- Signup with validation
- Login with JWT tokens
- Email verification support
- Password reset flow

### 4. **API Endpoints** ✓
- `GET /api/plans` - Fetch all plans
- `GET /api/users/me` - Get user data
- `POST /api/auth/register` - User signup
- `POST /api/auth/login` - User login

## 🔧 Admin Capabilities

As admin (`admin@fitsense.com`), you can:

1. **View All Users**
   - Go to `/admin/users`
   - See all registered users

2. **Upgrade Memberships**
   - Select any user
   - Assign membership package
   - Set start/end dates
   - Grant Premium Hub Access

3. **Manage Plans**
   - View all plans
   - Create new plans
   - Edit existing plans
   - Activate/deactivate plans

## 📱 Testing on Different Devices

### Mobile (< 768px):
- Plans: 1 column
- Dashboard: Stacked layout
- Navigation: Hamburger menu

### Tablet (768px - 1024px):
- Plans: 2 columns
- Dashboard: 2 column grid
- Navigation: Sidebar

### Desktop (> 1024px):
- Plans: 3 columns
- Dashboard: 4 column grid
- Navigation: Full sidebar

## ⚡ Common Commands

```powershell
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed database
node scripts/seedPlans.js
node scripts/seedAdmin.js

# Check MongoDB status
mongosh
```

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
```powershell
# Start MongoDB service
net start MongoDB

# Or check if it's running
Get-Service MongoDB
```

### "Port 3000 already in use"
```powershell
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### "Module not found"
```powershell
# Reinstall dependencies
npm install

# Or clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation

- **Full Implementation**: See `IMPLEMENTATION_SUMMARY.md`
- **Seeding Guide**: See `scripts/README.md`
- **Project Planning**: See `startproject.md`

## ✅ Checklist

Before going live:

- [ ] MongoDB is running
- [ ] Database is seeded with plans
- [ ] Admin user is created
- [ ] Admin password is changed
- [ ] Environment variables are set
- [ ] Email service is configured
- [ ] SSL/HTTPS is enabled
- [ ] Error logging is set up

## 🎉 You're Ready!

Your gym fitness platform is now set up with:
- ✅ 4 membership plans
- ✅ Admin user with full access
- ✅ Beautiful liquid glass UI
- ✅ Responsive design
- ✅ Access control system
- ✅ Dashboard with membership status

**Next**: Start MongoDB → Run seeds → Test the app!

---

**Need Help?** Check `IMPLEMENTATION_SUMMARY.md` for detailed information.
