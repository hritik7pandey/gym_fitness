# Plan: Align Existing Gym Platform with Planning Document

Your current implementation is a sophisticated gym management platform that significantly exceeds the original MVP scope. You've built workout tracking, nutrition management, attendance systems, and announcements—far beyond the simple membership website planned. However, you're missing 3 core features from the spec: dedicated Plans management, Contact form system, and formal Subscription tracking. This plan bridges those gaps while preserving your advanced features.

## Steps

### 1. Create Plan model and CRUD system

- Create `src/models/Plan.ts` with schema:
  - `name: string` (e.g., "Basic", "Premium", "Elite")
  - `price: number` (monthly price in INR)
  - `durationMonths: number` (default 1 for monthly, or 3/6/12 for packages)
  - `features: string[]` (e.g., ["Gym Access", "Personal Trainer", "Diet Plan"])
  - `isActive: boolean` (for soft-delete/archiving plans)
  - `displayOrder: number` (for sorting on plans page)
  - `createdAt, updatedAt: Date`

- Implement admin APIs at `src/app/api/admin/plans/route.ts`:
  - `POST /api/admin/plans` - Create new plan (admin only)
  - `GET /api/admin/plans` - List all plans including inactive (admin only)

- Implement admin update/delete at `src/app/api/admin/plans/[id]/route.ts`:
  - `GET /api/admin/plans/:id` - Get single plan details
  - `PUT /api/admin/plans/:id` - Update plan
  - `DELETE /api/admin/plans/:id` - Soft delete (set isActive=false)

- Implement public API at `src/app/api/plans/route.ts`:
  - `GET /api/plans` - List all active plans (public, sorted by displayOrder)

- Implement public detail API at `src/app/api/plans/[id]/route.ts`:
  - `GET /api/plans/:id` - Get single plan details (public)

### 2. Build dedicated Plans browsing page

- Create `src/app/plans/page.tsx` with:
  - Fetch all active plans from `/api/plans`
  - Display pricing cards in grid layout (mobile-responsive)
  - Show plan name, price, duration, features list
  - Highlight recommended/popular plan (e.g., Premium)
  - "Subscribe" or "Choose Plan" button linking to `/dashboard?upgrade=true` or membership upgrade flow
  - Use existing GlassCard/AnimatedGlassCard components for consistency
  - Mobile-first responsive design (1 column mobile, 2-3 columns tablet/desktop)

- Add navigation link to Plans page in:
  - `src/components/navigation/TopNav.tsx` (for logged-out users)
  - `src/components/navigation/Sidebar.tsx` (for logged-in users)
  - `src/app/landing/page.tsx` pricing section (link to full plans page)

### 3. Implement Contact Request system

- Create `src/models/ContactRequest.ts` with schema:
  - `name: string`
  - `email: string`
  - `phone?: string` (optional)
  - `subject?: string` (optional, e.g., "Membership Inquiry", "General Question")
  - `message: string`
  - `status: 'new' | 'replied' | 'resolved'` (default: 'new')
  - `submittedAt: Date`
  - `repliedAt?: Date`
  - `adminNotes?: string`

- Create `src/app/api/contact/route.ts`:
  - `POST /api/contact` - Submit contact form (public)
    - Validate required fields (name, email, message)
    - Save to database
    - Optional: Send email notification to gym admin
    - Return success message

- Create `src/app/contact/page.tsx`:
  - Contact form with fields: name, email, phone (optional), subject (optional), message
  - Form validation (email format, required fields)
  - Success/error message display
  - Include gym address, phone, email, hours in sidebar or below form
  - Keep FloatingContactButton for WhatsApp quick access
  - Use existing Input/Button components with glass morphism styling

- Create admin view `src/app/admin/contact-requests/page.tsx`:
  - List all contact requests in table format
  - Show name, email, subject, status, submitted date
  - Filter by status (new/replied/resolved)
  - Click to view full message and add admin notes
  - Update status button (mark as replied/resolved)
  - Export to CSV functionality (reuse existing exportCSV utility)

- Create detail/update API `src/app/api/admin/contact-requests/[id]/route.ts`:
  - `GET /api/admin/contact-requests/:id` - Get single request
  - `PUT /api/admin/contact-requests/:id` - Update status/notes (admin only)

### 4. Add Subscription history model

- Create `src/models/Subscription.ts` with schema:
  - `userId: ObjectId` (reference to User)
  - `planId: ObjectId` (reference to Plan)
  - `startDate: Date`
  - `endDate: Date`
  - `active: boolean`
  - `paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'`
  - `paymentMethod?: string` (e.g., "Cash", "UPI", "Card", "Online")
  - `paymentTransactionId?: string`
  - `amount: number` (price at time of purchase)
  - `createdAt, updatedAt: Date`
  - `cancelledAt?: Date`
  - `cancellationReason?: string`

- Update `src/app/api/user/upgrade-membership/route.ts`:
  - When user upgrades membership:
    1. Create new Subscription record with planId reference
    2. Update User model fields (membershipType, membershipStartDate, membershipEndDate)
    3. Set paymentStatus based on payment completion
    4. Return subscription details in response

- Create `src/app/api/user/subscriptions/route.ts`:
  - `GET /api/user/subscriptions` - Get logged-in user's subscription history (auth required)
    - Return all subscriptions for current user, sorted by createdAt desc
    - Include plan details (name, features) via populate

- Update `src/app/dashboard/page.tsx`:
  - Add "Subscription History" section or link
  - Show current active subscription with plan details
  - Link to view full history

- Create `src/app/profile/subscriptions/page.tsx` (optional):
  - Full subscription history page
  - Show timeline of past/current subscriptions
  - Renewal reminders if nearing endDate

### 5. Integrate Plans into existing flows

- Update `src/app/landing/page.tsx` pricing section:
  - Remove hardcoded pricing cards
  - Fetch plans from `/api/plans` on page load
  - Dynamically render pricing cards based on Plan model data
  - Keep existing design/styling (glass morphism cards)
  - Add "View All Plans" button linking to `/plans` page

- Update `src/app/api/user/upgrade-membership/route.ts`:
  - Accept `planId` parameter instead of hardcoded membership type string
  - Look up Plan by ID to get price, duration, features
  - Calculate endDate based on plan.durationMonths
  - Update User.membershipType to plan.name
  - Create Subscription record as described in step 4

- Update `src/app/dashboard/page.tsx` membership card:
  - Link "Upgrade Membership" button to `/plans` page
  - Show current plan details fetched from Subscription model
  - Display features included in current plan

- Update admin user management `src/app/admin/users/page.tsx`:
  - When assigning/updating membership, show dropdown of available Plans
  - Use planId instead of hardcoded types
  - Create Subscription record when admin updates user membership

### 6. Update planning.md documentation

- Add new section "Database Architecture - Current Implementation":
  - Document MongoDB choice and reasoning (flexibility, rapid development)
  - List all 9 models with field descriptions:
    - User, Plan, Subscription, ContactRequest (from planning doc)
    - WorkoutPlan, WorkoutSession, WorkoutHistory, DietPlan, Attendance, Announcement, UserAnnouncementStatus, Equipment (additional features)

- Add section "API Endpoints - Complete Reference":
  - Organize by category (Auth, User, Plans, Subscriptions, Workouts, Diet, Attendance, Announcements, Admin, Contact)
  - Document all 47+ endpoints with method, path, auth requirements, description
  - Mark which endpoints are from original plan vs additional features

- Update "Project Overview" section:
  - Note: "Project has evolved into full-featured gym management platform"
  - Original scope: Simple membership website
  - Current scope: Comprehensive gym operations platform with member engagement tools

- Update "Scope (MVP)" section:
  - Mark completed features with ✅
  - Add new section "Implemented Beyond MVP" listing workout tracking, nutrition management, attendance, announcements, biometric integration

- Add "Migration from Planning Document" section:
  - Explain why MongoDB was chosen over PostgreSQL/MySQL
  - Explain why Next.js API routes were used instead of separate Express backend
  - Document hardcoded membership types → dynamic Plans migration strategy
  - Note FloatingContactButton (WhatsApp) as supplement to Contact form, not replacement

## Further Considerations

### 1. Database migration strategy

**Current State:**
- User model has hardcoded `membershipType: 'Basic' | 'Premium' | 'Elite'`
- Landing page has hardcoded pricing (₹999, ₹1999, ₹2999)

**Migration Options:**

**Option A: Backward Compatible (Recommended)**
- Add new `currentPlanId?: ObjectId` field to User model
- Keep existing `membershipType` field for legacy data
- New subscriptions use `currentPlanId`, old subscriptions use `membershipType`
- Create seed script to create Plans matching old types (Basic/Premium/Elite)
- Gradually migrate users: when they renew/upgrade, link to Plan model

**Option B: Full Migration**
- Create Plans for Basic/Premium/Elite with exact current prices
- Run migration script to create Subscription records for all existing users
- Link User.currentPlanId to appropriate Plan
- Keep `membershipType` as computed field (from currentPlan.name) for compatibility

**Option C: Maintain Parallel Systems**
- Keep hardcoded types for legacy users
- New Plans system only for new signups after launch
- Eventually deprecate hardcoded system

**Recommendation:** Option A - allows gradual rollout, no breaking changes, easy rollback

### 2. Payment gateway integration priority

**Current State:**
- Subscription model includes `paymentStatus` and `paymentTransactionId` fields
- No actual payment processing implemented
- Planning doc lists payments as "nice-to-have"

**Options:**

**Option A: Implement Now**
- Integrate Razorpay or Stripe (Razorpay recommended for India)
- Add payment flow to upgrade membership process
- User selects plan → redirected to payment gateway → webhook confirms → creates Subscription
- Benefits: Professional, automated, reduces admin work
- Timeline: +2-3 days development

**Option B: Manual Payment First**
- Admin manually marks payment as completed after offline payment (cash/UPI/bank transfer)
- Add admin endpoint: `POST /api/admin/subscriptions/:id/confirm-payment`
- User selects plan → "pending" subscription created → admin confirms → activates
- Benefits: Faster launch, works for gym with existing offline payment process
- Timeline: +few hours

**Option C: Defer Completely**
- Remove payment-related fields from Subscription model
- Keep subscription tracking purely for membership management
- Handle payments outside system

**Recommendation:** Option B for MVP, Option A as next priority (within 1-2 weeks of launch)

### 3. Testing and deployment

**Current State:**
- No test files found in project
- Planning doc Milestone 7 includes testing requirement
- Unknown deployment configuration

**Testing Strategy:**

**Unit Tests (High Priority):**
- API endpoint tests (Jest + Supertest)
- Model validation tests
- Auth middleware tests
- Key functions (JWT, email, exportCSV)

**Integration Tests (Medium Priority):**
- Auth flow (signup → verify email → login)
- Subscription flow (select plan → payment → activation)
- Workout session flow (start → track → complete)

**E2E Tests (Low Priority - Optional):**
- Playwright/Cypress for critical user journeys
- Can defer until after launch

**Implementation Plan:**
1. Add test dependencies: `npm install --save-dev jest @testing-library/react @testing-library/jest-dom supertest @types/jest`
2. Create `jest.config.js` and `jest.setup.js`
3. Write tests for new features (Plans, Contact, Subscriptions) first
4. Gradually add tests for existing features
5. Set up GitHub Actions for CI/CD

**Deployment Considerations:**

**Environment Variables Needed:**
- `MONGODB_URI` (production database)
- `JWT_SECRET` (secure random string)
- `NEXT_PUBLIC_API_URL` (production domain)
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (email service)
- `ADMIN_EMAIL` (for contact form notifications)
- Payment gateway keys (if implementing)

**Hosting Options:**
- **Vercel** (recommended for Next.js) - Easy deployment, good free tier
- **Railway/Render** - Good for apps with MongoDB
- **DigitalOcean/AWS** - VPS option for more control

**Pre-Deployment Checklist:**
- [ ] Environment variables configured
- [ ] MongoDB Atlas production cluster set up (or equivalent)
- [ ] HTTPS/SSL enabled (automatic with Vercel/Netlify)
- [ ] Email service configured (SendGrid, Mailgun, or SMTP)
- [ ] Admin user seeded in production DB
- [ ] Error logging configured (Sentry recommended)
- [ ] Basic monitoring set up (Vercel Analytics or Google Analytics)

**Recommendation:** 
1. Start with basic unit tests for new features (Plans/Contact/Subscriptions)
2. Deploy to Vercel for easy Next.js hosting
3. Use MongoDB Atlas for managed database
4. Add comprehensive testing post-launch as separate effort
