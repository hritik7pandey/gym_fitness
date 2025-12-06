# Gym Website Project — Spec & Roadmap

## 1. Project Overview

**Project Name:** Fitsense Gym Website  
**Purpose / Goal:** Provide a modern, clean, mobile-first web presence for a small gym (≤ ~500 members), enabling users to view membership plans, sign up, manage membership, contact gym, and for admin to manage plans and view users.  

**Target Audience:** Gym visitors / potential members in your area — mostly using mobile or tablet, but also accessible on desktop.  

**Success Metrics:**  
- Fast page load (especially on mobile), good responsiveness across devices.  
- Secure user signup/login & membership management.  
- Simple and clear user flow (view plans → subscribe → dashboard → contact).  
- Easy admin management of plans and users.  
- Low maintenance overhead; stable even with up to ~500 users.  

## 2. Scope (MVP) — What the app will do (initially)

### ✅ Must-Have Features / Pages  
- Landing / Home Page (marketing, hero banner, gym info)  
- Membership Plans Page (list and describe plans/packages)  
- User Authentication: Sign Up, Login, Logout  
- Membership Subscription / Plan Purchase (select plan → subscribe)  
- User Dashboard / Profile Page (view membership status, plan info)  
- Contact / Enquiry Page (contact form for users)  
- Admin API (and optionally simple admin UI) to manage plans and users  
- Static content pages: About, FAQ, Testimonials (optional)  

### 🔜 Nice-to-Have (later) / Extensions  
- Payment gateway integration (for online payment)  
- Membership renewal or cancellation flow  
- Notifications / Email confirmations  
- Simple analytics (member counts, plan popularity)  
- Dark mode / Theme toggle  
- Static content management (e.g. testimonials, gym info) via admin  

## 3. Tech Stack & Architecture

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS + optional Framer Motion for subtle UI effects  
- **Backend:** Node.js + Express (or similar) + TypeScript + ORM (e.g. Prisma / TypeORM / Sequelize)  
- **Database:** Relational — PostgreSQL or MySQL (enough for small scale)  
- **Hosting / Deployment:** Simple VPS / Container / Server or serverless; serve static assets via CDN or via Next.js optimizations  
- **API Style:** RESTful APIs (stateless, JSON) :contentReference[oaicite:0]{index=0}  
- **Security & Performance:** HTTPS/TLS, token-based auth (JWT or sessions), input validation, caching where needed, compression, efficient DB queries, connection pooling :contentReference[oaicite:1]{index=1}  

## 4. Data Model (Core Entities)

| Entity | Fields / Key Attributes |
|--------|-------------------------|
| **User** | id (UUID), name, email (unique), passwordHash, role (`user` / `admin`), createdAt, updatedAt |
| **Plan** | id, name, price, durationMonths (or durationDays), benefits (array or JSON/text), createdAt, updatedAt |
| **Subscription** | id, userId (FK → User), planId (FK → Plan), startDate, endDate, active (boolean), createdAt, updatedAt |
| **ContactRequest** | id, name, email, message, submittedAt |

*(Extendable later for payments, logs, etc.)*

## 5. API Design (REST Endpoints)

### Public / User APIs  
- `POST /api/auth/register` — Create new user  
- `POST /api/auth/login` — Login user, return auth token/session  
- `GET /api/plans` — List all plans  
- `GET /api/plans/:id` — Get details of a specific plan  
- `POST /api/subscribe` — Subscribe logged-in user to a plan  
- `GET /api/users/me` — Get profile + membership info (requires auth)  
- `POST /api/contact` — Submit contact / enquiry  

### Admin APIs (protected by auth + admin role)  
- `POST /api/admin/plans` — Create new plan  
- `PUT /api/admin/plans/:id` — Update existing plan  
- `DELETE /api/admin/plans/:id` — Delete plan  
- `GET /api/admin/users` — (Optional) List users + subscription info  

### API Best Practices  
- Use HTTPS/TLS  
- Stateless design, JSON responses, standard HTTP status codes :contentReference[oaicite:2]{index=2}  
- Proper input validation & error handling on all endpoints :contentReference[oaicite:3]{index=3}  
- Optional: versioning (e.g. `/api/v1/...`) if you anticipate future changes. :contentReference[oaicite:4]{index=4}  

## 6. Frontend Pages & Routing Structure (Next.js)

# Gym Website Project — Spec & Roadmap

## 1. Project Overview

**Project Name:** Fitsense Gym Website  
**Purpose / Goal:** Provide a modern, clean, mobile-first web presence for a small gym (≤ ~500 members), enabling users to view membership plans, sign up, manage membership, contact gym, and for admin to manage plans and view users.  

**Target Audience:** Gym visitors / potential members in your area — mostly using mobile or tablet, but also accessible on desktop.  

**Success Metrics:**  
- Fast page load (especially on mobile), good responsiveness across devices.  
- Secure user signup/login & membership management.  
- Simple and clear user flow (view plans → subscribe → dashboard → contact).  
- Easy admin management of plans and users.  
- Low maintenance overhead; stable even with up to ~500 users.  

## 2. Scope (MVP) — What the app will do (initially)

### ✅ Must-Have Features / Pages  
- Landing / Home Page (marketing, hero banner, gym info)  
- Membership Plans Page (list and describe plans/packages)  
- User Authentication: Sign Up, Login, Logout  
- Membership Subscription / Plan Purchase (select plan → subscribe)  
- User Dashboard / Profile Page (view membership status, plan info)  
- Contact / Enquiry Page (contact form for users)  
- Admin API (and optionally simple admin UI) to manage plans and users  
- Static content pages: About, FAQ, Testimonials (optional)  

### 🔜 Nice-to-Have (later) / Extensions  
- Payment gateway integration (for online payment)  
- Membership renewal or cancellation flow  
- Notifications / Email confirmations  
- Simple analytics (member counts, plan popularity)  
- Dark mode / Theme toggle  
- Static content management (e.g. testimonials, gym info) via admin  

## 3. Tech Stack & Architecture

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS + optional Framer Motion for subtle UI effects  
- **Backend:** Node.js + Express (or similar) + TypeScript + ORM (e.g. Prisma / TypeORM / Sequelize)  
- **Database:** Relational — PostgreSQL or MySQL (enough for small scale)  
- **Hosting / Deployment:** Simple VPS / Container / Server or serverless; serve static assets via CDN or via Next.js optimizations  
- **API Style:** RESTful APIs (stateless, JSON) :contentReference[oaicite:0]{index=0}  
- **Security & Performance:** HTTPS/TLS, token-based auth (JWT or sessions), input validation, caching where needed, compression, efficient DB queries, connection pooling :contentReference[oaicite:1]{index=1}  

## 4. Data Model (Core Entities)

| Entity | Fields / Key Attributes |
|--------|-------------------------|
| **User** | id (UUID), name, email (unique), passwordHash, role (`user` / `admin`), createdAt, updatedAt |
| **Plan** | id, name, price, durationMonths (or durationDays), benefits (array or JSON/text), createdAt, updatedAt |
| **Subscription** | id, userId (FK → User), planId (FK → Plan), startDate, endDate, active (boolean), createdAt, updatedAt |
| **ContactRequest** | id, name, email, message, submittedAt |

*(Extendable later for payments, logs, etc.)*

## 5. API Design (REST Endpoints)

### Public / User APIs  
- `POST /api/auth/register` — Create new user  
- `POST /api/auth/login` — Login user, return auth token/session  
- `GET /api/plans` — List all plans  
- `GET /api/plans/:id` — Get details of a specific plan  
- `POST /api/subscribe` — Subscribe logged-in user to a plan  
- `GET /api/users/me` — Get profile + membership info (requires auth)  
- `POST /api/contact` — Submit contact / enquiry  

### Admin APIs (protected by auth + admin role)  
- `POST /api/admin/plans` — Create new plan  
- `PUT /api/admin/plans/:id` — Update existing plan  
- `DELETE /api/admin/plans/:id` — Delete plan  
- `GET /api/admin/users` — (Optional) List users + subscription info  

### API Best Practices  
- Use HTTPS/TLS  
- Stateless design, JSON responses, standard HTTP status codes :contentReference[oaicite:2]{index=2}  
- Proper input validation & error handling on all endpoints :contentReference[oaicite:3]{index=3}  
- Optional: versioning (e.g. `/api/v1/...`) if you anticipate future changes. :contentReference[oaicite:4]{index=4}  

## 6. Frontend Pages & Routing Structure (Next.js)

# Gym Website Project — Spec & Roadmap

## 1. Project Overview

**Project Name:** Fitsense Gym Website  
**Purpose / Goal:** Provide a modern, clean, mobile-first web presence for a small gym (≤ ~500 members), enabling users to view membership plans, sign up, manage membership, contact gym, and for admin to manage plans and view users.  

**Target Audience:** Gym visitors / potential members in your area — mostly using mobile or tablet, but also accessible on desktop.  

**Success Metrics:**  
- Fast page load (especially on mobile), good responsiveness across devices.  
- Secure user signup/login & membership management.  
- Simple and clear user flow (view plans → subscribe → dashboard → contact).  
- Easy admin management of plans and users.  
- Low maintenance overhead; stable even with up to ~500 users.  

## 2. Scope (MVP) — What the app will do (initially)

### ✅ Must-Have Features / Pages  
- Landing / Home Page (marketing, hero banner, gym info)  
- Membership Plans Page (list and describe plans/packages)  
- User Authentication: Sign Up, Login, Logout  
- Membership Subscription / Plan Purchase (select plan → subscribe)  
- User Dashboard / Profile Page (view membership status, plan info)  
- Contact / Enquiry Page (contact form for users)  
- Admin API (and optionally simple admin UI) to manage plans and users  
- Static content pages: About, FAQ, Testimonials (optional)  

### 🔜 Nice-to-Have (later) / Extensions  
- Payment gateway integration (for online payment)  
- Membership renewal or cancellation flow  
- Notifications / Email confirmations  
- Simple analytics (member counts, plan popularity)  
- Dark mode / Theme toggle  
- Static content management (e.g. testimonials, gym info) via admin  

## 3. Tech Stack & Architecture

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS + optional Framer Motion for subtle UI effects  
- **Backend:** Node.js + Express (or similar) + TypeScript + ORM (e.g. Prisma / TypeORM / Sequelize)  
- **Database:** Relational — PostgreSQL or MySQL (enough for small scale)  
- **Hosting / Deployment:** Simple VPS / Container / Server or serverless; serve static assets via CDN or via Next.js optimizations  
- **API Style:** RESTful APIs (stateless, JSON) :contentReference[oaicite:0]{index=0}  
- **Security & Performance:** HTTPS/TLS, token-based auth (JWT or sessions), input validation, caching where needed, compression, efficient DB queries, connection pooling :contentReference[oaicite:1]{index=1}  

## 4. Data Model (Core Entities)

| Entity | Fields / Key Attributes |
|--------|-------------------------|
| **User** | id (UUID), name, email (unique), passwordHash, role (`user` / `admin`), createdAt, updatedAt |
| **Plan** | id, name, price, durationMonths (or durationDays), benefits (array or JSON/text), createdAt, updatedAt |
| **Subscription** | id, userId (FK → User), planId (FK → Plan), startDate, endDate, active (boolean), createdAt, updatedAt |
| **ContactRequest** | id, name, email, message, submittedAt |

*(Extendable later for payments, logs, etc.)*

## 5. API Design (REST Endpoints)

### Public / User APIs  
- `POST /api/auth/register` — Create new user  
- `POST /api/auth/login` — Login user, return auth token/session  
- `GET /api/plans` — List all plans  
- `GET /api/plans/:id` — Get details of a specific plan  
- `POST /api/subscribe` — Subscribe logged-in user to a plan  
- `GET /api/users/me` — Get profile + membership info (requires auth)  
- `POST /api/contact` — Submit contact / enquiry  

### Admin APIs (protected by auth + admin role)  
- `POST /api/admin/plans` — Create new plan  
- `PUT /api/admin/plans/:id` — Update existing plan  
- `DELETE /api/admin/plans/:id` — Delete plan  
- `GET /api/admin/users` — (Optional) List users + subscription info  

### API Best Practices  
- Use HTTPS/TLS  
- Stateless design, JSON responses, standard HTTP status codes :contentReference[oaicite:2]{index=2}  
- Proper input validation & error handling on all endpoints :contentReference[oaicite:3]{index=3}  
- Optional: versioning (e.g. `/api/v1/...`) if you anticipate future changes. :contentReference[oaicite:4]{index=4}  

## 6. Frontend Pages & Routing Structure (Next.js)

/ → Landing / Home Page
/plans → Membership Plans Page
/auth/signup → Signup Page
/auth/login → Login Page
/dashboard → User Dashboard / Profile (auth-protected)
/contact → Contact / Enquiry Page


- Public pages: home, plans, contact  
- Auth pages: signup / login  
- Protected pages: dashboard, subscribe  
- Admin stuff: via separate admin panel or direct DB (optional)  

## 7. Milestones & Roadmap (Work-Breakdown Structure)

Using a “work-breakdown structure” approach: break project into phases and tasks. :contentReference[oaicite:5]{index=5}

### Milestone 0 — Setup & Infrastructure  
- Initialize repo (frontend + backend)  
- Setup DB & ORM; define schema & migrations  
- Setup backend skeleton (Express + middleware: bodyParser, CORS, security headers, JSON parsing)  
- Setup environment variable management (for DB credentials, JWT secrets, etc.)  

### Milestone 1 — User Auth & Basic Models  
- Implement registration endpoint + password hashing + validation  
- Implement login endpoint + token/session issuing  
- Write middleware for auth & protecting routes (for future)  
- Frontend: Signup & Login pages + validation + forms + error handling  

### Milestone 2 — Plans & Subscription Flow  
- Backend: CRUD for plans (admin), list plans, subscribe endpoint, create subscription record  
- Frontend: Plans listing page (fetch plans), plan selection UI, subscription flow for logged-in user  

### Milestone 3 — User Dashboard & Profile  
- Backend: endpoint to fetch user + membership info  
- Frontend: Dashboard page — show membership status, plan details, allow maybe unsubscribe or renew (if implemented later)  

### Milestone 4 — Contact / Enquiry Page  
- Backend: contact endpoint to save or email enquiry  
- Frontend: Contact page with form, validation  

### Milestone 5 — Admin APIs & (Optional) Admin Panel  
- Backend: admin-protected endpoints for plan management & user listing  
- (Optional) Admin UI — basic form/views to manage plans/users  

### Milestone 6 — Styling & UI / UX Polish + Performance & Responsive Design  
- Build home / landing page — hero banner, gym info, call to action, responsive layout, good images, performance optimization  
- Ensure all pages are mobile-first, responsive (phone, tablet, desktop)  
- Optimize assets: images, CSS, JS; use caching, minification, bundle splitting  
- Accessibility & SEO: semantic HTML, meta tags, alt-text for images, proper ARIA labels  

### Milestone 7 — Testing, Deployment & Launch  
- Basic testing (unit / integration) on backend & frontend  
- Deploy to production server / hosting; configure env vars, DB, static assets serving, SSL/TLS  
- Monitor performance & usage; ensure server handles up to ~500 users without hiccups  

## 8. Risks & Mitigations

| Risk / Challenge | Mitigation / Plan |
|------------------|------------------|
| User auth & security vulnerabilities | Use standard practices: password hashing, HTTPS, input validation, secure token storage |
| Server performance issues under load | Use efficient DB queries, connection pooling, caching/static assets, avoid heavy computation in request cycles |
| Poor mobile performance / slow load | Use responsive design, optimize images/assets, lazy-load non-critical resources, minimize JS/CSS bundles |
| Scope creep / overengineering | Keep MVP small; postpone optional features (payments, admin UI, extras) until core works |
| Future maintenance complexity | Keep code modular, well-documented; use simple, maintainable stack; write API spec & docs |

## 9. Use with AI-Agent / LLM Workflow

This document acts as **master spec + roadmap**.  
You can feed parts (e.g. “Milestone 1: Auth endpoints & frontend login/signup”) to your LLM-agent, ask it to **generate code / boilerplate / endpoints / React pages** — then review, test, integrate, and move to next milestone.  

---

