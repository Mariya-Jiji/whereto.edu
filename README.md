# Whereto.edu — College Discovery Platform

A full-stack MVP for discovering, comparing, and shortlisting premier Indian colleges. Built as part of the Full Stack Engineer Track B assignment.

**Live Demo**: [Deploy to Vercel — see instructions below]

---

## Features

| Feature | Description |
|---|---|
| **College Listing + Search** | Browse 35+ colleges with filters (location, type, fee range, min rating) and pagination |
| **College Detail** | Overview, courses table, placement stats (year-wise), and user reviews |
| **Compare Colleges** | Side-by-side comparison of 2–3 colleges with best-value highlighting |
| **Auth + Saved Items** | Signup/login, save colleges, save comparisons |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS with custom design tokens |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 5 |
| Auth | NextAuth.js v4 (credentials + JWT) |
| Data Fetching | TanStack Query v5 |
| Validation | Zod |
| Deployment | Vercel |

---

## Architecture

```
src/
├── app/
│   ├── (auth)/              # Login + Signup pages (minimal layout)
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/              # Main app pages (Navbar + CompareTray)
│   │   ├── page.tsx         # Home / College Listing
│   │   ├── colleges/[id]/   # College Detail
│   │   ├── compare/         # Side-by-side comparison
│   │   └── saved/           # Saved colleges + comparisons
│   ├── api/
│   │   ├── auth/            # NextAuth + Register endpoint
│   │   ├── colleges/        # List (search/filter/paginate) + Detail + Reviews
│   │   ├── compare/         # Comparison endpoint
│   │   └── saved/           # Saved colleges + comparisons (auth-protected)
│   ├── layout.tsx           # Root layout (fonts, providers)
│   └── globals.css          # Global styles + Tailwind layers
├── components/              # Reusable components
├── context/                 # CompareTrayContext (global compare state)
├── lib/                     # Prisma client, auth config, auth helpers
├── middleware.ts            # Route protection (/saved → requires login)
└── types/                   # NextAuth session type extensions
prisma/
├── schema.prisma            # Full data model (7 models)
└── seed.ts                  # 35 realistic Indian colleges
```

---

## Data Model

```prisma
User          — id, name, email, passwordHash, createdAt
College       — id, name, location, feesPerYear, rating, type, description, establishedYear
Course        — id, collegeId (FK), name, durationYears, feesPerYear
Placement     — id, collegeId (FK), year, avgPackage, highestPackage, placementRate
Review        — id, collegeId (FK), userId (FK), rating, comment, createdAt
SavedCollege  — id, userId (FK), collegeId (FK), createdAt
SavedComparison — id, userId (FK), collegeIds (JSON array), label, createdAt
```

### Schema Decisions

- **`SavedComparison.collegeIds` as JSON array**: Avoids the complexity of a three-way join table for MVP. The values are validated (2–3 IDs) on write. Easily queried for display.
- **`Review` unique on `(collegeId, userId)`**: Enforces one review per user per college at the DB level — prevents duplicates without application-level checks.
- **`Placement` unique on `(collegeId, year)`**: Prevents duplicate placement records for the same year, idempotent via upsert in seed.
- **`College.type` field**: Added beyond spec to support type-based filtering (IIT/NIT/Private/Deemed/Government) — a common real-world filter.

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/colleges` | No | List with `q`, `location`, `type`, `minFees`, `maxFees`, `minRating`, `page`, `pageSize` |
| `GET` | `/api/colleges/:id` | Optional | College + courses + placements + reviews |
| `POST` | `/api/colleges/:id/reviews` | Required | Submit/update a review |
| `GET` | `/api/compare?ids=1,2,3` | No | Compare 2–3 colleges |
| `POST` | `/api/auth/register` | No | Create account |
| `GET/POST/DELETE` | `/api/saved/colleges` | Required | Manage saved colleges |
| `GET/POST/DELETE` | `/api/saved/comparisons` | Required | Manage saved comparisons |

---

## Edge Cases Handled

| Scenario | Handling |
|---|---|
| Empty search results | Distinct `EmptyState` component — never blank |
| Invalid filter values | `clampInt`/`clampFloat` — clamped to valid range, not 500 |
| Pagination beyond data | Returns empty array + correct `totalCount` — no error |
| Duplicate save attempt | `upsert` with unique constraint — idempotent 200 |
| Unauthenticated save | Client: redirects to `/login`. Server: 401. Middleware: blocks `/saved` |
| Comparing <2 or >3 colleges | 400 with descriptive message; UI validates before navigating |
| Duplicate `collegeIds` in compare | Server deduplicates before querying |
| Review update | Upserts — editing replaces the existing review, no duplicate |
| Auth required for API | `requireUserId()` throws `NextResponse(401)` — handled cleanly |

---

## Design System

| Token | Value | Usage |
|---|---|---|
| `indigo-primary` | `#1E2A4A` | Primary UI, headings |
| `amber-accent` | `#E8A33D` | CTAs, ratings, highlights |
| `background` | `#FAF8F4` | Page background |
| `slate-body` | `#4A5268` | Body text |
| `green-placement` | `#5B8C6E` | Placement rate figures only |
| Font: Lora | Serif | Page/section headlines (restrained use) |
| Font: Inter | Sans-serif | All body copy |
| Font: IBM Plex Mono | Monospace | All numeric data (fees, packages, ratings) |

**Signature element**: The **Compare Tray** — a persistent bottom-docked pill that fills as colleges are added from anywhere in the app, making compare feel live rather than a separate feature.

---

## Local Development

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database (free tier works)

### Setup

```bash
# 1. Clone and install
git clone <your-repo>
cd college-discovery-platform
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local and fill in:
#   DATABASE_URL  — from Neon console
#   NEXTAUTH_SECRET — run: openssl rand -base64 32
#   NEXTAUTH_URL  — http://localhost:3000

# 3. Push schema + seed database
npx prisma db push
npx prisma db seed

# 4. Start dev server
npm run dev
# Open http://localhost:3000
```

**Demo login**: `demo@collegedisc.in` / `Demo@1234`

---

## Deployment (Vercel + Neon)

1. Push to GitHub
2. Import repo in [Vercel dashboard](https://vercel.com/new)
3. Add environment variables in Vercel project settings:
   - `DATABASE_URL` — from Neon console
   - `NEXTAUTH_SECRET` — `openssl rand -base64 32`
   - `NEXTAUTH_URL` — `https://your-app.vercel.app`
4. Deploy — Vercel auto-detects Next.js
5. After first deploy, run seed: `npx prisma db seed` (with your `DATABASE_URL` set locally)

---

## Tradeoffs

| Decision | Rationale |
|---|---|
| JWT sessions (not DB sessions) | Stateless — works well on Vercel Edge; no extra DB table needed |
| TanStack Query for client fetching | Built-in caching, stale-time, loading/error states — avoids boilerplate |
| URL params for filter state | Filters are shareable/bookmarkable links |
| JSON for `SavedComparison.collegeIds` | MVP simplicity over a join table; Prisma handles JSON well |
| One review per user per college | Realistic constraint; upsert means users can update their review |

---

## What I'd Add With More Time

- **Predictor Tool**: JEE rank → eligible colleges based on cutoffs (scope-aware next step)
- **Q&A / Discussion**: College-specific forum threads (the other excluded feature)
- **Admin Panel**: Manage colleges, approve reviews, update placement data
- **Advanced Analytics**: Year-over-year placement trend charts
- **College Images**: Real campus photography
- **Email Verification**: Confirm accounts via SendGrid/Resend
- **Real-time Search**: Algolia or Postgres full-text search for instant results

---

## Seed Data

35 premier Indian institutions including:
- **IITs**: Bombay, Delhi, Madras, Kharagpur, Kanpur, Hyderabad
- **NITs**: Trichy, Warangal, Surathkal, Calicut, Jaipur (MNIT)
- **Deemed**: BITS Pilani, VIT Vellore, Manipal, IIIT Hyderabad, DA-IICT
- **Government**: DTU, NSUT, VJTI, Anna University, Jadavpur, COEP
- **Private**: RVCE, PES, SRM, Amity, Thapar, Chandigarh, KIIT

Each college has 2–3 courses and 1–2 years of placement data.
#   w h e r e t o . e d u 
 
 
