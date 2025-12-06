# Fitsense UI Kit

**A mobile-first, iOS26-inspired fitness web app built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.**

---

## Features

- **Next.js 14 (App Router):** Server components, layouts, and client components with `"use client"`.
- **TypeScript:** Fully typed components and utilities.
- **Tailwind CSS v4:** Custom iOS-inspired colors (`iosRed`, `iosBlue`, `iosCyan`, `iosPurple`), glassmorphism helpers, and mobile-first styling.
- **Framer Motion:** Subtle hover, tap, and reveal animations on interactive components.
- **Accessible:** All components include proper ARIA labels and semantic HTML.
- **Mobile-first (320px+):** Bottom navigation that doesn't overlap content; glassmorphic cards; large typography.
- **Export-ready:** CSV export utility with comments for backend integration.

---

## Project Structure

```
fitsense-uikit/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx          # Root layout with global CSS imports and BottomNav
│  │  ├─ page.tsx            # Landing page (Home)
│  │  └─ dashboard/
│  │     └─ page.tsx         # Dashboard page skeleton
│  ├─ components/
│  │  ├─ ui/
│  │  │  ├─ GlassCard.tsx
│  │  │  ├─ FluentButton.tsx
│  │  │  ├─ NotificationBanner.tsx
│  │  │  ├─ ThemeToggle.tsx
│  │  │  ├─ UserAvatar.tsx
│  │  │  ├─ BottomNav.tsx
│  │  │  └─ ProgressCircle.tsx
│  │  └─ dashboard/
│  │     ├─ StatsCard.tsx
│  │     ├─ WorkoutCard.tsx
│  │     ├─ AttendanceCard.tsx
│  │     ├─ DietPlanCard.tsx
│  │     └─ WeeklyScheduleStrip.tsx
│  ├─ styles/
│  │  ├─ globals.css         # Tailwind directives and base styles
│  │  └─ ios-utilities.css   # Reusable .ios-glass class
│  └─ utils/
│     └─ exportCSV.ts        # CSV export utility with admin route comments
├─ tailwind.config.cjs       # Custom colors, radius, shadows, and ios-glass-backdrop plugin
├─ tsconfig.json
├─ next.config.mjs
├─ postcss.config.cjs
├─ package.json
└─ README.md
```

---

## Installation

1. **Clone or copy files** into your project directory.

2. **Install dependencies:**

   ```powershell
   npm install
   ```

3. **Verify global CSS imports** in `src/app/layout.tsx`:

   ```tsx
   import '../styles/globals.css';
   import '../styles/ios-utilities.css';
   ```

   (Already included in the provided `layout.tsx`.)

---

## Running the Development Server

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser (use mobile viewport or DevTools mobile mode for best experience).

---

## Building for Production

```powershell
npm run build
npm start
```

---

## Component Overview

### UI Components (`src/components/ui/`)

- **GlassCard:** iOS-style glassmorphic card with optional link, hover/tap animation, and `aria-label`.
- **FluentButton:** Accessible button with press/hover motion; iOS-blue default styling.
- **NotificationBanner:** Small animated banner for status messages.
- **ThemeToggle:** Toggle between light/dark (basic implementation; extend as needed).
- **UserAvatar:** Displays user image or initials fallback; comments for Next/Image integration.
- **BottomNav:** Fixed bottom navigation with safe area padding; three tabs (Home, Dashboard, Profile).
- **ProgressCircle:** SVG circular progress indicator with Framer Motion animation.

### Dashboard Components (`src/components/dashboard/`)

- **StatsCard:** Summary of weekly stats (workouts, calories, consistency).
- **WorkoutCard:** Current workout with progress circle.
- **AttendanceCard:** Attendance count and streak.
- **DietPlanCard:** Diet plan summary placeholder.
- **WeeklyScheduleStrip:** 7-day schedule strip with planned/unplanned days.

All components include `TODO` comments where backend data fetching or handlers should be integrated.

---

## Tailwind Configuration

**Custom colors** (defined in `tailwind.config.cjs`):

- `iosRed`: `#FF3B30`
- `iosBlue`: `#0A84FF`
- `iosCyan`: `#64D2FF`
- `iosPurple`: `#BF5AF2`

**Border radius:** `rounded-3xl` → `1.5rem`

**Shadow:** `shadow-ios-soft` → `0 8px 30px rgba(15, 15, 20, 0.12)`

**Plugin:** `.ios-glass-backdrop` → `backdrop-filter: blur(10px) saturate(120%);`

**Reusable class** in `ios-utilities.css`: `.ios-glass` applies glassmorphic background, border, blur, and shadow.

---

## CSV Export

Located at `src/utils/exportCSV.ts`. Includes:

- **Client-side `exportToCSV()`** function to download data as CSV.
- **Comments** with example server-side admin export route (`src/app/api/admin/export/route.ts`) for backend integration.

---

## Accessibility

All interactive components have:

- Proper `aria-label` or `aria-pressed` attributes.
- Semantic HTML (`<nav>`, `<button>`, `<article>`, etc.).
- Keyboard navigability via native elements.

---

## Mobile-First Layout

- Bottom navigation has a fixed position with `bottom-3` and safe area padding to avoid notch/home indicator overlap.
- Main content has `pb-28` (bottom padding) to prevent content from being hidden behind the nav.
- Max width of `420px` ensures optimal mobile viewing on larger screens.

---

## Next Steps

1. **Integrate backend APIs:** Replace `TODO` comments with `fetch()` calls or server actions.
2. **Add authentication:** Hook up user login/logout and protect routes.
3. **Expand dashboard:** Add charts (e.g., Chart.js or Recharts), more detailed views.
4. **Admin export route:** Implement server-side CSV generation as outlined in `exportCSV.ts`.
5. **Dark mode:** Extend `ThemeToggle` with Tailwind dark mode classes and persist user preference.
6. **Testing:** Add Jest + React Testing Library for component tests.

---

## License

MIT

---

**Enjoy building Fitsense! 🏋️‍♀️**
