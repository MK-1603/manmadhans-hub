# 🌌 Manmadhan's Hub — Ultimate Final Architecture Documentation
## The Complete V1.0 → V5.0 Platform Blueprint

```
╔══════════════════════════════════════════════════════════════════════════╗
║         🌌  M A N M A D H A N ' S   H U B  —  U L T I M A T E         ║
║          The Definitive V1–V5 Production Architecture Blueprint          ║
║                                                                          ║
║   Private · Invitation-Only · AI-Native · Cinematic · Scalable          ║
║   Offline-Ready · Multilingual · Game Universe · 3D Experience          ║
║                                                                          ║
║   Platform        : Manmadhan's Hub                                     ║
║   Founder         : Hemanth  ·  hemanthmm1107@gmail.com                 ║
║   Co-Founders     : SS0778  ·  MK1603  ·  TN813                        ║
║   Role System     : 2-Tier — Admin  ·  User                             ║
║   Hub Key Format  : MM-XXXX-XXXX-XXXX                                   ║
║   Versions        : V1.0 → V5.0                                         ║
╚══════════════════════════════════════════════════════════════════════════╝
```

> **Repository:** `manmadhans-hub`
> **Classification:** Private — Invitation-Only AI Universe
> **Status:** Ultimate Final — All Versions Defined
> **Default Password:** `welcome@123` — Forced change on first login
> **Hub Key Format:** `MM-XXXX-XXXX-XXXX` — Generated once at seed/invite, one-time display only

---

## Table of Contents

- [Platform Identity & Founders](#platform-identity--founders)
- [Seeded Accounts — Full Details](#seeded-accounts--full-details)
- [Role System](#role-system)
- [Seeded User First Login Flow](#seeded-user-first-login-flow)
- [Regular User First Login Flow](#regular-user-first-login-flow)
- [Version Overview](#version-overview)
- [V1.0 — Foundation Universe](#v10--foundation-universe)
- [V2.0 — AI Intelligence Layer](#v20--ai-intelligence-layer)
- [V3.0 — Game Universe & Movie Expansion](#v30--game-universe--movie-expansion)
- [V4.0 — Platform as a Business](#v40--platform-as-a-business)
- [V5.0 — 3D Universe & AI Operating System](#v50--3d-universe--ai-operating-system)
- [Complete Tech Stack](#complete-tech-stack)
- [UI Design System](#ui-design-system)
- [Landing Page — Full Blueprint](#landing-page--full-blueprint)
- [Database Architecture](#database-architecture-cumulative)
- [API Architecture](#api-architecture)
- [DevOps & Infrastructure](#devops--infrastructure)
- [Testing Architecture](#testing-architecture)
- [Build Order — All Phases](#build-order--all-phases)
- [Final Platform Numbers](#final-platform-numbers)

---

## Platform Identity & Founders

| Identity Layer | Details |
|---|---|
| 🌌 Platform Name | **Manmadhan's Hub** — changeable by Founder Admin from Platform Settings |
| 👤 Founder | **Hemanth** — Permanent Founder Admin, all privileges, seed-protected |
| 👥 Co-Founders | **SS0778 · MK1603 · TN813** — Permanent Co-Founder Admins, reserved Hub IDs |
| 🔐 Access Model | Private · Invitation-only · Zero public access |
| ⚡ Environment | Futuristic cinematic production-grade experience |
| 🚀 Core Purpose | Centralized AI tool discovery, organization, comparison, and intelligence |
| 🎮 Game Layer | Hub-exclusive offline-first games with live leaderboards |
| 📖 Self-Guided | 18-section built-in user manual — no external docs needed |
| 🌐 Languages | English · Tamil · Hindi (expandable via Admin) |
| 🎨 Color System | 6 neural color modes — Blue · Green · Orange · Purple · Arctic · Carbon |
| 🔑 Hub Key Format | `MM-XXXX-XXXX-XXXX` — generated once per user, displayed only once |
| 🏠 Hub ID Format | Initials (2–3 letters) + manual 4-digit code — e.g. MM1107, SS0778, MK1603 |

---

## Seeded Accounts — Full Details

All four accounts are auto-created by the seed script `npm run seed:founderadmin`.
They are permanent, undeletable, and role-locked at the database level.

| Role | Name | Email | Username | Hub ID | Hub Key Format |
|---|---|---|---|---|---|
| **Founder Admin** | Hemanth | hemanthmm1107@gmail.com | MM1107 | MM1107 | MM-XXXX-XXXX-XXXX |
| **Co-Founder Admin** | — | shriramss0778@gmail.com | SS0778 | SS0778 | MM-XXXX-XXXX-XXXX |
| **Co-Founder Admin** | — | saikrishnanmk1603@gmail.com | MK1603 | MK1603 | MM-XXXX-XXXX-XXXX |
| **Co-Founder Admin** | — | TN813@gmail.com | TN813 | TN813 | MM-XXXX-XXXX-XXXX |

### Seed Script Behaviour

- Script: `npm run seed:founderadmin` (idempotent — safe to run multiple times, never duplicates)
- Each account is seeded with:
  - Email, username, Hub ID (all pre-set, as above)
  - Default password: `welcome@123` (forced change on first login)
  - Auto-generated Hub Key: `MM-XXXX-XXXX-XXXX` (generated at seed time, shown **once** in seed console output — never retrievable again without Admin reset)
  - Role: Admin
  - `is_founder` guard: TRUE for Hemanth (MM1107) — cannot be demoted, suspended, or deleted
  - `is_cofounder` guard: TRUE for SS0778, MK1603, TN813 — cannot be demoted, suspended, or deleted
- Hub IDs MM1107, SS0778, MK1603, TN813 are permanently reserved — no other user can claim them

### Hub Key — MM-XXXX-XXXX-XXXX

- Format: `MM-` prefix (Manmadhan's Hub platform code) + three groups of 4 alphanumeric characters
- Example: `MM-A3F9-K2X1-7BPQ`
- Generated using cryptographically secure random (Node.js `crypto.randomBytes`)
- Stored as bcrypt hash in database — the plain text is never stored after generation
- One-time display: shown once at seed (console output) or once at invitation creation (UI)
- Required at Step 3 of every login — even after Google OAuth
- Lockout: 3 incorrect attempts → 15-minute cooldown
- Reset: Admin-only action — revokes old key, generates new one, displays once in Admin panel

---

## Role System

Manmadhan's Hub uses a clean **2-Tier Role System** across all versions.

| Role | Description | Capabilities |
|---|---|---|
| **Admin** | Full platform control — Founder, Co-Founders, and all promoted Admins share identical privileges | Manage all tools, users, settings, invitations, categories, announcements, audit logs, maintenance, game data, movie hub, billing (V4+), AI config (V2+), and all system settings |
| **User** | Standard platform member — invitation-only | Discover, search, compare, collect, workflow, rate, review, flag tools, play games, watch movie hub, access guide, export data, use AI assistant (V2+), offline access |

> **Admin = Super Admin.** Every Admin has the same full privileges. There is no sub-tier within Admin. The Founder Admin and Co-Founder Admins are Admins who are seed-protected — they cannot be demoted, suspended, or deleted through any Admin panel action or API call.

### Admin Capabilities (Complete List)

- Full user management (invite, promote to Admin, suspend, warn, delete)
- Full tool management (add, edit, approve, reject, rollback, delete)
- JSON bulk tool import with validation and preview
- Category & sector management
- Announcement publishing
- Maintenance mode control (schedule, force, countdown banner)
- Audit log viewer (all platform events)
- Platform settings & system settings
- Feature flags control
- AI configuration panel (V2+)
- Billing & subscription management (V4+)
- Game leaderboard management
- Movie Hub management
- Invitation generation and revocation
- Admin promotion/demotion (cannot demote Founder or Co-Founders)
- Special User Registry management
- Observability dashboard access
- Backup & restore controls
- Export all platform data

### User Capabilities (Complete List)

- Browse AI tool directory (by sector, category, featured)
- Semantic + keyword search
- View full tool details, screenshots, changelog, pricing history, version history
- Compare up to 4 tools side-by-side
- Rate and review tools
- Flag/report tool errors or outdated info
- Save tools to personal collections
- Build personal workflows (chain up to 10 tools, share)
- Customisable dashboard with widgets
- Notification centre (9 notification types)
- Command palette (CMD+K)
- Full keyboard shortcuts (customisable)
- Personal usage analytics
- Export collections/workflows (PDF, CSV, JSON, Markdown)
- Play Neural Snake + Void Runner (V3+) + Arcade games (V3+)
- Watch Manmadhan Movie Hub
- Interact with Manmadhan's AI ⚡ (V2+)
- AI-powered recommendations (V2+)
- Natural language search (V2+)
- Profile page (/profile/[hubId])
- Multi-language toggle (EN · TA · HI)
- Offline access (tools, collections, guide, game, movie info)
- PWA install

---

## Seeded User First Login Flow

> Applies to: MM1107 (Hemanth), SS0778, MK1603, TN813 — all seeded accounts.
> Their Hub ID, username, and email are **pre-set at seed**. They do NOT go through Hub Identity selection.

**3-Step Seeded User Onboarding:**

| Step | Action | Notes |
|---|---|---|
| Step 1 | **Change Password** | Forced. Cannot skip. Must meet strength requirements. |
| Step 2 | **Accept Terms & Conditions** | Full T&C with slide-to-confirm component. |
| Step 3 | **Welcome Screen** | Cinematic reveal — "Welcome back, [name]. The Hub is yours." |

- After Step 3: direct to `/dashboard`
- Language, color mode, Hub ID steps are skipped — Hub ID is already set
- Language and color mode can be changed anytime in `/settings`

---

## Regular User First Login Flow

> Applies to: all invited Users (non-seeded accounts).

**6-Step Regular User Onboarding:**

| Step | Action | Notes |
|---|---|---|
| Step 1 | **Change Password** | Forced. Cannot skip. |
| Step 2 | **Accept Terms & Conditions** | Slide-to-confirm. |
| Step 3 | **Choose Hub ID** | Initials (2 letters) + 4-digit manual code. Unique check. Cannot change after. |
| Step 4 | **Select Language** | EN · TA · HI. Default: English. |
| Step 5 | **Choose Neural Color Mode** | 6 options with live preview. |
| Step 6 | **Welcome Screen** | Cinematic reveal — "You are now part of the Hub." Particle burst animation. |

- Steps are linear, cannot be skipped
- Mid-onboarding exit: user is returned to current step on next login (server-side step tracking)

---

## Version Overview

| Version | Theme | New Capability | Systems | Tables | Endpoints |
|---|---|---|---|---|---|
| V1.0 | Foundation Universe | Core platform — tool directory, auth, games, movie | 85 | 62 | 115+ |
| V2.0 | AI Intelligence Layer | Manmadhan's AI ⚡ — RAG, semantic search, memory | 98 | 72 | 145+ |
| V3.0 | Game Universe & Movie Expansion | Void Runner, Arcade, self-hosted movie, Curator tools | 108 | 78 | 160+ |
| V4.0 | Platform as a Business | Billing, Public API, Native apps, Blog, Affiliate | 118 | 85 | 180+ |
| V5.0 | 3D Universe & AI OS | WebGPU 3D universe, AI agents, spatial interface | 130+ | 90+ | 200+ |

---

# V1.0 — Foundation Universe

> The complete production-ready base. Every future version builds on this foundation.
> Build time: ~10 weeks · 5 phases

## V1 — Platform Stats

| Metric | Count |
|---|---|
| Core Systems | 85 |
| Database Tables | 62 |
| API Endpoints | 115+ |
| BullMQ Queues / Workers | 7 |
| Design Token Files | 12 |
| Neural Color Modes | 6 |
| Style Variants | 4 |
| Languages | 3 (English · Tamil · Hindi) |
| User Manual Sections | 18 |
| Hub Games | 1 (Neural Snake) |
| Build Phases | 5 |
| Next.js App Routes | 73 |
| Express.js Route Files | 28 |
| BullMQ Worker Files | 7 |
| Custom UI Components | 10 |
| Notification Types | 9 |
| Regular Onboarding Steps | 6 |
| Seeded User Onboarding Steps | 3 |
| Login Steps | 3 |
| E2E Test Flows | 16 |
| Test Suites | 3 (Unit · Integration · E2E) |
| DB Indexes | 34+ |
| Migration Files | 7 |
| Role Tiers | 2 (Admin · User) |

---

## V1 — Part I: Authentication & Identity

### 1. Founder Admin Seed System

- Script: `npm run seed:founderadmin`
- Seeds 4 accounts: Hemanth (MM1107), SS0778, MK1603, TN813
- All accounts: role = Admin, `is_founder` or `is_cofounder` = TRUE, undeletable
- Default password `welcome@123` on all 4 — forced change on first login
- Hub Key `MM-XXXX-XXXX-XXXX` auto-generated for each — shown once in console, stored hashed
- Script is idempotent — running twice does not create duplicates or overwrite passwords
- Hub IDs MM1107, SS0778, MK1603, TN813 permanently reserved — cannot be claimed by any other user

### 2. Authentication System — 3-Step Login

| Step | Action |
|---|---|
| Step 1 | Enter email address — system validates invitation status and account existence |
| Step 2 | Enter password — bcrypt comparison, brute force lockout after 5 attempts (15-min cooldown) |
| Step 3 | Enter Hub Key `MM-XXXX-XXXX-XXXX` — 2FA gate, lockout after 3 wrong attempts (15-min cooldown) |

- JWT access token (15-min expiry) + refresh token (7-day, rotating)
- Refresh token rotation on every use — old tokens invalidated immediately
- Session stored in Upstash Redis
- Silent redirect on session expiry (no error page — just returns to login modal)
- Auth.js (NextAuth v5) with credentials + Google provider

### 3. Hub Key 2FA System

- Format: `MM-XXXX-XXXX-XXXX`
- Required after every login — including after Google OAuth
- Stored bcrypt-hashed in database — plain text never stored after creation
- 3 wrong attempts → 15-minute lockout
- Admin reset path: Admin revokes + reissues new Hub Key (displayed once in Admin panel)
- User cannot self-reset Hub Key — Admin action only
- One-time display: at seed (console) or at invitation creation (UI) — never shown again

### 4. Login — Pop-up Modal

- Login is a **pop-up modal overlay** — not a separate page
- Triggered by: "Login" button in Navbar on landing page
- Modal behaviour:
  - Slides up / fades in from bottom-center (Framer Motion spring)
  - Dark glassmorphism card, backdrop blur on landing behind it
  - 3 steps rendered inline — Step 1 → Step 2 → Step 3 animate forward within the same modal
  - Each step slides right-to-left on advance
  - ESC key or click-outside: closes modal (returns to landing)
  - After successful login + onboarding: modal closes, redirect to `/dashboard`
- No separate `/login` route — login lives entirely inside the modal

### 5. Google OAuth Login

- Google login button available in Login Modal (Step 1)
- Links to existing Hub account by matching email
- Hub Key 2FA still required after Google auth (Step 3 of modal)
- First-time Google login: triggers onboarding flow after Hub Key verified
- Google accounts without an invitation cannot access the platform

### 6. Invitation System

- Only Admins can generate invitations
- Each invitation contains: invitation token (UUID), Hub Key `MM-XXXX-XXXX-XXXX`, expiry (7 days default)
- Invitation message auto-formatted for WhatsApp + Telegram (copy-paste ready template)
- One invitation = one account (single-use token)
- Admin can revoke unused invitations
- Invitation status: pending · accepted · expired · revoked
- Invitation dashboard: `/admin/invitations`

### 7. Role Management System — 2-Tier

- Admin · User (see Role System section)
- `is_founder` guard: Hemanth (MM1107) — cannot be demoted, suspended, or deleted by any action
- `is_cofounder` guard: SS0778, MK1603, TN813 — same protection
- All role changes logged to Audit Log with actor, target, timestamp
- Admin promotion creates permanent audit entry

### 8. Identity System — Hub ID

- Format: `[Initials][4-digit code]` — e.g. MM1107, SS0778, MK1603, TN813
- Set by regular Users during onboarding Step 3
- Pre-set for seeded accounts (no choice prompt during onboarding)
- Unique platform-wide (enforced server-side)
- Cannot be changed after onboarding is complete
- Displayed on: profile page, notifications, game leaderboard, Audit Log

### 9. Password Management System

- Default `welcome@123` forced change on first login (Step 1 of onboarding)
- bcrypt hashing (salt rounds: 12)
- Forgot password: email OTP → verify → set new password
- Password history: last 3 passwords blocked from reuse
- Strength requirement: min 8 chars, 1 uppercase, 1 number, 1 special character

### 10. Active Session Manager

- View all active sessions: device, browser, IP, last active timestamp
- Users can terminate individual sessions or all sessions
- Admin can terminate any user's sessions from user management panel
- Max concurrent sessions: configurable in Platform Settings (default: 3)
- Exceeding limit: oldest session auto-expired

---

## V1 — Part II: Core Tool Systems

### 11. AI Tool Directory System

- Central catalogue of all AI tools curated by Admins
- Tool fields: name, slug, description, logo, website URL, category, sector, tags, pricing model, status (active/inactive/beta/archived), featured flag
- Display: grid/list view (user-selectable), sorting (newest/most-rated/alphabetical/most-viewed), filtering (sector/category/pricing/status/tags)
- Tool card: logo, name, short description, sector badge, star rating, save button, compare toggle

### 12. Tool Management — Manual Add

- Admin panel form with full Zod validation
- Logo upload via Cloudinary (drag & drop, auto-resize to 200×200)
- Slug auto-generated from name (editable before publish)
- Preview before publishing
- Status: Draft · Published · Archived · Beta
- Mandatory fields: name, website URL, category, sector, description, pricing model

### 13. Tool Management — JSON Bulk Import

- Upload JSON array of tools via Admin panel
- System validates each entry against schema
- Preview table: valid (green) · invalid (red) · duplicate (yellow)
- Commits only valid entries — skips invalids with error report
- Import log saved to Audit Log
- Schema documentation accessible inline in bulk import UI

### 14. Duplicate Detection Engine

- Runs on every manual add and bulk import
- Detection methods: fuzzy name matching (Levenshtein distance), URL fingerprint matching, slug collision check
- Duplicate warnings shown with match details — Admin can override and proceed
- False positive feedback stored to improve future detection thresholds

### 15. Tool Details Page

- Route: `/tools/[slug]` — SSR + ISR (revalidate: 3600s)
- Sections: Overview · Screenshots · Changelog · Pricing History · Version History · Similar Tools · Reviews · Embed Widget
- OpenGraph meta tags auto-generated per tool
- Share button (copy link), Save to collection, Compare button, Flag/report button
- Health status badge (active/degraded/down with animated pulse)
- Last updated timestamp

### 16. Tool Screenshot Gallery

- Up to 10 screenshots per tool (Admin upload via Cloudinary)
- Lightbox viewer with keyboard navigation (← →) and mobile swipe
- Screenshot captions (Admin-set), lazy loading with blur placeholder
- Admin reorder via drag-and-drop in Admin panel

### 17. Tool Comparison System

- Compare up to 4 tools side-by-side
- Route: `/compare` — tools added via "Compare" button on any tool card or detail page
- Comparison table: pricing, features, rating, health status, last updated, sector, tags
- Shareable comparison link (`/compare/[comparisonId]`) — stored 30 days
- Export comparison as PDF
- AI Verdict panel at bottom (V2+)

### 18. Tool Rating & Review System

- 5-star rating per tool per User (one rating, editable)
- Written review (optional, 20–1000 chars)
- Admin can delete any review
- Aggregate rating on tool card and detail page
- Rating distribution chart (1–5 star breakdown)
- Sort reviews: newest · highest rated · lowest rated · most helpful
- Helpful vote (thumbs up, once per User per review)
- Review author: Hub ID + initials avatar

### 19. Tool Health Monitor

- BullMQ worker: HTTP HEAD check every 6 hours
- Statuses: active (200) · degraded (>3s response) · down (error/timeout)
- Health badge on tool card and detail page
- 30-day health history chart on tool detail page
- Admin can manually trigger health check
- Status change creates TOOL_HEALTH_CHANGE platform notification

### 20. Tool Version History & Rollback

- Every Admin edit creates a version snapshot (full JSON diff stored)
- Admin can view diff between any two versions
- Admin can rollback to any previous version (creates new version entry, no history deletion)
- Version history stored indefinitely

### 21. Tool Changelog Tracker

- Admin publishes changelog entries: version number, date, summary, type (feature/fix/breaking/deprecation)
- Public changelog tab on tool detail page
- Admin-only internal notes field per entry
- `/changelog` — platform-wide feed of all tool changelogs
- BullMQ: notify Users who saved a tool when its changelog updates
- Export changelog per tool as Markdown

### 22. Tool Pricing History Tracker

- Admin records pricing changes: date, old price, new price, plan name, notes
- Pricing history line chart on tool detail page (date vs. price)
- Pricing model types: Free · Freemium · Paid · Enterprise · API-based · Credits
- Export pricing history as CSV

### 23. Tool Flag & Report System

- Any User can flag: wrong information · broken link · outdated pricing · duplicate · inappropriate content · other
- Flag form: type selection + optional notes (max 500 chars)
- Flags go to Admin review queue: `/admin/flags`
- Admin actions: resolve · dismiss · escalate
- User notified when their flag is resolved
- Multiple flags on same tool = "needs attention" highlight in Admin panel

### 24. Similar Tools System

- Tag-based SQL similarity scoring (V1) → vector-based (V2)
- Top 6 similar tools at bottom of tool detail page
- Similarity score = overlapping tags / total unique tags × 100
- Admin can manually override/pin specific similar tools
- Excludes inactive/archived tools

### 25. Tool Embed Widget Generator

- Route: `/tools/[slug]/embed` and `/admin/tools/[id]/embed`
- Generates iframe embed code in 3 variants: compact · full · badge
- Customisable: width, theme (dark/light), show/hide rating
- Preview before copying embed code

### 26. Category & Sector Management

- Sector: top-level grouping (Writing · Image · Video · Code · Audio · Productivity · etc.)
- Category: sub-grouping within a sector
- Admin CRUD for both, with icon upload (SVG) and colour tags
- Drag-and-drop order in Admin panel
- Tool count displayed per sector/category on explore page

### 27. Advanced Search Engine

- Powered by Meilisearch Cloud
- Real-time results as user types (300ms debounce)
- Keyword search across: name, description, tags, sector, category
- Filter panel: sector · category · pricing model · status · rating (≥X stars)
- Sort: relevance · newest · most rated · alphabetical
- Typo tolerance: 1 typo per 6 characters
- Synonym management in Admin panel
- Search analytics (Admin): top queries, zero-result queries

### 28. Collection System

- Users create named collections (e.g. "My Design Stack")
- Add tools from: tool card (quick-save) · tool detail · comparison page
- Drag-and-drop reorder within collections
- Public or private toggle
- Share public collections via link
- Bulk actions: remove selected tools, export collection
- Max 20 collections per user, 50 tools per collection (configurable)

### 29. Personal Workflow Builder

- Chain up to 10 AI tools into a named workflow
- Each step: tool selection + usage note (max 200 chars)
- Drag-and-drop step reorder
- Share workflow via public link — receiver can clone it
- Export as PDF or Markdown
- Max 10 workflows per user (configurable)

### 30. Advanced Export Centre

- Route: `/settings/export`
- Exportable: collections (PDF/CSV/JSON/Markdown), workflows (PDF/Markdown/JSON), saved tools (CSV/JSON), comparison (PDF), usage stats (CSV/JSON), activity feed (CSV)
- Export jobs run via BullMQ — download link delivered via notification when ready
- Admin export: all tools, all users, full audit log

---

## V1 — Part III: User Systems

### 31. User Management System (Admin)

- Route: `/admin/users`
- List all users with: Hub ID, username, email, role, status, join date, last active
- Promote to Admin · Demote to User (cannot demote Founder/Co-Founders)
- Suspend user (immediate session termination)
- 3-stage warning system: Warning 1 (notification only) → Warning 2 (review restricted) → Suspend (full block → /suspended)
- Delete user (soft delete, data preserved 30 days)
- Reset Hub Key (new MM-XXXX-XXXX-XXXX generated, displayed once)
- Impersonate user (Admin views as that user — flagged in Audit Log)

### 32. User Dashboard

- Route: `/dashboard`
- Customisable widgets: recent tools viewed, my collections, announcements, daily digest, recently added tools, top rated this week, my activity, quick compare, platform health status
- Widget drag-to-reorder, show/hide — layout saved per user in database

### 33. Personal Usage Analytics

- Route: `/settings/stats`
- Charts: tools viewed daily/weekly/monthly, most visited sectors, top search queries, collections created over time, workflows created, reviews written, flags submitted
- Data retention: 12 months
- Export as CSV

### 34. Platform Activity Feed

- Route: `/activity`
- Real-time feed: new tool added, tool updated/changelog published, health status changes, new announcements, leaderboard changes, new reviews on saved tools
- Filter by event type, mute specific types
- Events older than 30 days auto-archived

### 35. Platform Announcements System

- Admin creates: title, body (rich text), type (info/warning/critical/celebration), expiry date
- Delivery: dashboard widget · notification drawer · optional full-width banner
- Critical: persistent banner across all pages
- Announcement history: `/announcements`
- Admin analytics: read rate per announcement

### 36. Public User Profile

- Route: `/profile/[hubId]`
- Displays: Hub ID, initials avatar, join date, public collections, public workflows, role badge
- Special badges: Founder badge (MM1107) · Co-Founder badge (SS0778, MK1603, TN813) · Admin badge

---

## V1 — Part IV: Infrastructure & Realtime

### 37. Realtime Notification System — 9 Types

| Type | Trigger |
|---|---|
| TOOL_ADDED | New tool published |
| TOOL_UPDATED | Tool you saved has been updated |
| TOOL_HEALTH_CHANGE | Health status of a saved tool changes |
| ANNOUNCEMENT | New platform announcement |
| REVIEW_REPLY | Someone replies to your review |
| FLAG_RESOLVED | Your flag was resolved by Admin |
| INVITATION_ACCEPTED | Someone you invited joined |
| LEADERBOARD_CHANGE | Weekly leaderboard updated (game) |
| PLATFORM_MAINTENANCE | Maintenance scheduled or imminent |

- Notification drawer: bell icon → last 10 unread with type icons and time-ago
- Full page: `/notifications` — all history, mark as read, delete, mark all as read
- Preferences per notification type (toggle on/off) in user settings
- BullMQ `NotificationWorker` handles delivery
- Socket.IO pushes real-time badge count updates

### 38. Realtime Architecture — Socket.IO & SSE

- Socket.IO server: room-based (user rooms + admin room)
- Events: notification count update, leaderboard update, maintenance warning, health status change
- SSE fallback: `/api/sse/notifications` for WebSocket-blocked environments
- Reconnect with exponential backoff
- Admin presence: live online user count in Admin dashboard

### 39. Queue & Worker System — BullMQ (7 Queues)

| Queue | Worker | Purpose |
|---|---|---|
| notification-queue | NotificationWorker | Deliver all 9 notification types |
| health-queue | HealthMonitorWorker | Tool health checks every 6 hours |
| export-queue | ExportWorker | Generate PDF/CSV/JSON export files |
| digest-queue | DigestWorker | Daily update digest at 08:00 UTC |
| email-queue | EmailWorker | Transactional emails (invitations, alerts) |
| backup-queue | BackupWorker | Scheduled database + storage backups |
| indexing-queue | IndexingWorker | Sync tool changes to Meilisearch |

- Bull Board UI: `/admin/queues` (Admin only) — job status, retry failed, clear queues
- All workers run on Railway background process
- Dead-letter queue: failed jobs retry 3×, then alert Admin

### 40. Offline Access System — PWA

- Service Worker (Workbox) strategies: cache-first (assets/fonts), network-first with fallback (tool directory), cache-only (Neural Snake, User Guide, Movie Hub metadata)
- Background sync: flag/rating submissions while offline queue until reconnect
- Offline page: `/offline` — shows cached tool list
- PWA manifest: standalone display, platform icons, theme colour
- Custom Hub-styled install prompt (not browser default)
- iOS: Add to Home Screen prompt during onboarding Step 6 (regular users) or post-login (seeded users)

### 41. Full Storage Backup System

- Daily automated: Neon PostgreSQL PITR + Cloudinary export + Redis snapshot
- Storage: Neon PITR + Cloudflare R2 (S3-compatible)
- Schedule: 02:00 UTC daily
- Retention: 30 daily + 12 monthly backups
- Admin manual trigger: `/admin/settings/backup`
- Backup success/failure notification to all Admins

---

## V1 — Part V: Frontend & Design

### 42. Design System & Color Palette

**Design Token Files (12):**
`colors.ts` · `typography.ts` · `spacing.ts` · `radius.ts` · `shadows.ts` · `animation.ts` · `zIndex.ts` · `breakpoints.ts` · `icons.ts` · `gradients.ts` · `blur.ts` · `transitions.ts`

**6 Neural Color Modes:**

| Mode | Primary | Accent | Background |
|---|---|---|---|
| Cosmic Blue | #2563EB | #38BDF8 | #080B14 |
| Neural Green | #16A34A | #4ADE80 | #060F0A |
| Solar Orange | #EA580C | #FB923C | #0F0905 |
| Void Purple | #7C3AED | #A78BFA | #0A0610 |
| Arctic White | #0F172A | #38BDF8 | #F8FAFC |
| Carbon Dark | #374151 | #9CA3AF | #111827 |

**4 Style Variants:** Cinematic (glassmorphism + glow) · Minimal (flat, no effects) · Compact (dense layout) · Focus (content-first, no decoration)

**Light & Dark Theme:**
- Dark: default — near-black backgrounds, neon accents
- Light: full CSS variable swap — white/light-grey backgrounds, deep navy text, same accent colours
- Toggled via Sun/Moon button in Navbar — always visible across all viewports
- Persists to `localStorage`, syncs across tabs

### 43. Custom UI Components (10)

| Component | Description |
|---|---|
| `HubCard` | Glassmorphism tool card with hover glow, save button, compare toggle |
| `SlideToConfirm` | Physical slide gesture to confirm critical actions (T&C, deletion) |
| `CommandPalette` | CMD+K spotlight — full Hub command set with fuzzy search |
| `HubKeyInput` | Segmented input: `MM-[____]-[____]-[____]` format, auto-advance, paste support |
| `NeuralModeSelector` | Color mode picker with live preview |
| `StatusBadge` | Tool health indicator with animated pulse dot |
| `HubNotificationDrawer` | Bell-triggered slide-out notification panel (Framer Motion spring) |
| `HubAvatar` | Initials-based avatar with neural mode colour ring + role badges |
| `OfflineBanner` | Slim banner for offline mode with cached data notice |
| `MaintenanceCountdown` | Live countdown timer for scheduled maintenance |

### 44. Custom Cursor System

- Custom SVG crosshair cursor (replaces OS default)
- Colour matches active neural mode
- Hover: cursor expands + ring appears on interactive elements
- Click: brief particle burst at click point
- Fast movement: subtle motion trail that decays in 0.3s
- Disabled on mobile (touch devices)
- Can be disabled in user settings (Accessibility)

### 45. Mobile — iOS Layout

- Bottom tab bar: Home · Explore · Compare · Collections · Profile
- Sheet modals (slide-up from bottom): tool details, filters, notifications
- Safe area insets: notch, Dynamic Island, home indicator
- Haptic feedback: save, compare add, slide-to-confirm
- Pull-to-refresh on tool grids
- Long-press tool card: quick action sheet (Save · Compare · Share · Flag)

### 46. Mobile — Android Layout

- Bottom navigation bar: Home · Explore · Compare · Collections · Profile
- FAB (Floating Action Button): context-aware actions
- Material ripple on all interactive elements
- Bottom sheet for filters and quick actions
- Android back button handled throughout
- Snackbar notifications

### 47. Command Palette — CMD+K

- Trigger: CMD+K (desktop) / dedicated button (mobile)
- Commands: search tools, navigate any page, toggle neural mode, toggle language, Admin commands (Admin only), view collections, compare tools
- Recent commands (last 5), keyboard navigation (↑↓ Enter Esc), fuzzy search

### 48. Full Keyboard Shortcut System

| Shortcut | Action |
|---|---|
| CMD+K | Open Command Palette |
| CMD+/ | Open keyboard shortcut reference |
| CMD+S | Save current tool to default collection |
| CMD+F | Focus search bar |
| CMD+E | Open export centre |
| CMD+, | Open settings |
| G → H | Go to dashboard |
| G → E | Go to explore |
| G → C | Go to collections |
| G → N | Go to notifications |
| G → A | Go to Admin panel (Admin only) |

- All shortcuts customisable in `/settings/shortcuts` · Reset to defaults button

### 49. Multi-language Support — i18n

- Supported: English · Tamil · Hindi
- Library: next-intl
- Translation files: `/packages/i18n/[locale].json`
- All UI strings, error messages, notifications translated
- Date/time formatting per locale
- Admin panel: English only
- Admin can add new languages from Platform Settings (file upload)

### 50. Daily Update Digest

- DigestWorker runs at 08:00 UTC daily
- Compiles: new tools (last 24h), updated tools, health changes, new changelogs, platform stats
- Delivered as: dashboard widget + optional notification
- User can disable in notification preferences
- Admin can disable system-wide from Platform Settings

---

## V1 — Part VI: Platform Systems

### 51. Security Hardening

- Helmet.js (CSP, HSTS, X-Frame-Options)
- Rate limiting: 100 req/min per IP global, 5 req/min on auth endpoints
- CSRF: double-submit cookie on all state-mutating endpoints
- SQL injection: Drizzle ORM parameterised queries only
- XSS: CSP headers + DOMPurify on all rich text input
- Brute force: 5 failed logins → 15-min lockout; 3 wrong Hub Keys → 15-min lockout
- All secrets in Railway environment variables (never in code)
- HTTPS enforced on all routes
- JWT validation middleware on all protected API routes
- Admin route guard middleware

### 52. Maintenance System

- Toggle: instant or scheduled (date/time picker)
- Pre-maintenance banner: appears X hours before (default 2h, configurable)
- Maintenance page `/maintenance`: message + live countdown
- Admin and seeded accounts (MM1107, SS0778, MK1603, TN813) can access during maintenance
- PLATFORM_MAINTENANCE notification sent to all Users when maintenance starts
- Auto-restore after maintenance window

### 53. Audit Log System

- Logs: create, update, delete, login, logout, role change, impersonation, flag action, export, backup, maintenance toggle
- Log entry: actor (Hub ID), action type, target entity, timestamp, IP, user agent, before/after snapshot
- Viewer: `/admin/audit` — searchable, filterable by actor/action/date
- Retention: 12 months (configurable) · Export as CSV
- Security events (failed logins, lockouts) flagged with red badge

### 54. Game System — Neural Snake

- Canvas API full implementation (`/packages/games/neural-snake`)
- Fully offline — service worker cached
- Controls: arrow keys (desktop) + swipe (mobile)
- Wrap-around or hard walls (configurable), speed increases with score
- Online score submission with server-side anti-cheat validation
- Live leaderboard via Socket.IO
- Weekly leaderboard reset: Monday 00:00 UTC
- Dedicated page: `/games/neural-snake/leaderboard`
- Offline score queue: scores synced on reconnect

### 55. User Guide System

- Route: `/guide` · 18 sections · All content offline cached via service worker
- Sections: Welcome · Your Hub ID · Navigation · Discovering Tools · Search & Filters · Comparing Tools · Collections · Workflows · Tool Details · Ratings & Reviews · Flagging Issues · Notifications · Dashboard Customisation · Exporting Data · Offline Mode · Neural Snake · Movie Hub · Settings
- Progress tracking (section completion checkboxes)
- Search within guide
- Admin can update guide content: `/admin/guide`

### 56. System & Platform Settings

**System Settings** (`/admin/settings/system`): environment info, feature flags, rate limit config, session config, backup controls, queue status

**Platform Settings** (`/admin/settings/platform`): platform name, logo, maintenance toggle/schedule, default language, max collections/tools/workflows per user, T&C rich text editor, invitation expiry, export retention, digest schedule, language file management

### 57. PWA Install Prompt

- Custom Hub-styled banner (not browser default)
- Triggered: after 3rd session or during onboarding Step 6 (regular users)
- iOS: illustrated "Tap Share → Add to Home Screen" steps
- Android: native Web App Install via manifest
- Install tracked per user

---

## V1 — Part VII: Manmadhan Movie Hub

### 58. Manmadhan Movie Hub

- Route: `/movie`
- YouTube embed player (responsive 16:9) — self-hosted HLS upgrade in V3
- Movie metadata: title, director, cast, year, synopsis, genre, runtime
- Admin movie management: `/admin/movie` — set YouTube ID, edit metadata, upload poster (Cloudinary), enable/disable
- Offline metadata cache: poster, synopsis, cast all cached via service worker
- Watch status: User marks as watched (stored in database)
- Platform-wide watch count displayed

---

## V1 — Part VIII: Database Architecture (62 Tables)

**Core Identity (5):** `users` · `user_sessions` · `refresh_tokens` · `invitations` · `hub_keys`

**Role & Auth (2):** `role_assignments` · `privilege_overrides`

**Tool (10):** `tools` · `tool_screenshots` · `tool_changelogs` · `tool_versions` · `tool_health_logs` · `tool_pricing_history` · `tool_flags` · `tool_ratings` · `tool_reviews` · `tool_review_votes`

**Category (2):** `sectors` · `categories`

**Search & Tags (3):** `tags` · `tool_tags` · `search_analytics`

**Collection & Workflow (4):** `collections` · `collection_tools` · `workflows` · `workflow_steps`

**User Data (6):** `user_tool_saves` · `user_activity` · `user_stats` · `user_guide_progress` · `user_preferences` · `user_shortcuts`

**Comparison (2):** `comparisons` · `comparison_tools`

**Notifications (2):** `notifications` · `notification_preferences`

**Announcements (1):** `announcements`

**Games (3):** `game_scores` · `game_leaderboard` · `offline_score_queue`

**Movie (1):** `movie_config`

**Platform (8):** `audit_log` · `maintenance_schedule` · `platform_settings` · `feature_flags` · `export_jobs` · `backup_log` · `tool_import_logs` · `special_user_registry`

**Digest & i18n (4):** `daily_digests` · `digest_items` · `i18n_strings` · `i18n_languages`

**Analytics (2):** `tool_view_logs` · `platform_stats_daily`

**Billing ready (2):** `subscriptions` (schema only) · `invoices` (schema only)

**Total: 62 tables · 34+ indexes · 7 migration files**

---

## V1 — Part IX: DevOps & Infrastructure

### Tech Stack — V1

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Frontend | Next.js | 15 (App Router) | Full-stack React — SSR, ISR, Edge |
| Styling | Tailwind CSS | 3.x | Utility-first |
| Components | shadcn/ui | Latest | Accessible component library |
| Animation | Framer Motion | 11.x | Cinematic transitions |
| State (server) | React Query | 5.x | Caching + background refetch |
| State (client) | Zustand | 4.x | Lightweight client state |
| Forms | React Hook Form + Zod | 7.x / 3.x | Form + validation |
| Backend | Node.js + Express.js | 20 LTS / 4.x | REST API |
| Language | TypeScript | 5.x | Type safety throughout |
| ORM | Drizzle | Latest | Type-safe SQL + migrations |
| Auth | Auth.js (NextAuth v5) | 5.x | Authentication framework |
| Database | Neon PostgreSQL | Latest | Primary database |
| Cache | Upstash Redis | Latest | Sessions, cache, queues |
| Search | Meilisearch Cloud | Latest | Full-text search |
| Queue | BullMQ + Bull Board | Latest | Background jobs + UI |
| Media | Cloudinary | Latest | Logos, screenshots |
| Monorepo | Turborepo | Latest | Build orchestration |
| Deploy FE | Vercel | — | Next.js hosting |
| Deploy BE | Railway | — | Express.js + BullMQ |
| Errors | Sentry | Latest | Error monitoring (FE + BE) |
| Observability | OpenTelemetry + Grafana | — | Metrics, traces, logs |
| CI/CD | GitHub Actions | — | Test + build + deploy |
| Dev | Docker Compose | — | Local environment |
| Unit tests | Vitest | Latest | 70%+ coverage |
| Integration | Supertest | Latest | All API endpoints |
| E2E | Playwright | Latest | 16 critical flows |
| Load | k6 | Latest | Performance testing |

### Monorepo Folder Architecture

```
manmadhans-hub/
├── apps/
│   ├── web/                        ← Next.js 15 (73 routes)
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── onboarding/
│   │   │   │   └── suspended/
│   │   │   ├── (hub)/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── explore/
│   │   │   │   ├── tools/[slug]/
│   │   │   │   ├── compare/
│   │   │   │   ├── collections/
│   │   │   │   ├── workflows/
│   │   │   │   ├── search/
│   │   │   │   ├── notifications/
│   │   │   │   ├── activity/
│   │   │   │   ├── announcements/
│   │   │   │   ├── profile/[hubId]/
│   │   │   │   ├── settings/
│   │   │   │   ├── guide/
│   │   │   │   ├── games/
│   │   │   │   │   └── neural-snake/
│   │   │   │   └── movie/
│   │   │   ├── (admin)/
│   │   │   │   └── admin/
│   │   │   │       ├── dashboard/
│   │   │   │       ├── tools/
│   │   │   │       ├── users/
│   │   │   │       ├── invitations/
│   │   │   │       ├── categories/
│   │   │   │       ├── flags/
│   │   │   │       ├── announcements/
│   │   │   │       ├── audit/
│   │   │   │       ├── settings/
│   │   │   │       ├── queues/
│   │   │   │       ├── movie/
│   │   │   │       └── guide/
│   │   │   ├── maintenance/
│   │   │   ├── offline/
│   │   │   └── api/                ← SSE endpoints
│   │   └── components/
│   │       ├── hub/                ← 10 custom components
│   │       ├── ui/                 ← shadcn/ui
│   │       └── layouts/
│   └── api/                        ← Express.js backend
│       ├── src/
│       │   ├── routes/             ← 28 route files
│       │   ├── middleware/
│       │   ├── workers/            ← 7 BullMQ workers
│       │   ├── services/
│       │   ├── db/
│       │   └── utils/
│       └── seed/
│           └── founderadmin.ts     ← Seeds MM1107, SS0778, MK1603, TN813
├── packages/
│   ├── db/                         ← Drizzle schema + migrations
│   ├── i18n/                       ← Translation files (en, ta, hi)
│   ├── design-tokens/              ← 12 token files
│   ├── games/
│   │   └── neural-snake/
│   └── shared/                     ← Shared types, schemas, utilities
├── turbo.json
├── docker-compose.yml
└── .github/workflows/
    ├── ci.yml
    └── cd.yml
```

### V1 Build Order — 5 Phases

**Phase 1 — Foundation (Weeks 1–2):** Turborepo setup, Neon PostgreSQL (62 tables via Drizzle Kit), Express.js scaffold, Auth.js (Google + credentials), JWT + refresh token rotation, invitation token system, role middleware, seed script (`seed/founderadmin.ts` — seeds MM1107, SS0778, MK1603, TN813), Next.js 15 scaffold, Tailwind + shadcn/ui, 12 design tokens, 6 neural color modes + light/dark theme, Docker Compose, GitHub Actions CI

**Phase 2 — Core Product (Weeks 3–4):** Sectors + Categories CRUD, AI Tools CRUD, JSON bulk import + duplicate detection, tool detail page (SSR+ISR), screenshot gallery, health monitor (BullMQ), version history + rollback, changelog tracker, pricing history tracker, flag system, similar tools, embed widget generator, category explore, Meilisearch + indexing, search page, comparison + shareable links, ratings + reviews

**Phase 3 — User Layer (Weeks 5–6):** Collections (CRUD + drag reorder), save tool, workflow builder, user dashboard (widget system), activity feed, announcements system, Movie Hub (YouTube + offline cache), Socket.IO + room management, realtime notifications (9 types), notification drawer + page, command palette, user settings, keyboard shortcuts, i18n (EN/TA/HI), invitation system, user suspension + warning, public profile, active session manager

**Phase 4 — Platform Systems (Weeks 7–8):** Export centre, storage backup, daily digest, privilege management, feature flags, system settings + platform settings, maintenance system, security hardening (Helmet, rate limiting, CSRF), audit log, offline PWA + service worker + install prompt, personal usage analytics

**Phase 5 — Games, Guide & Production (Weeks 9–10):** Neural Snake (Canvas API, full implementation), offline score queue + leaderboard, weekly cron reset, user guide (18 sections, offline cached), Admin analytics dashboard, Admin audit log viewer, iOS mobile layout, Android mobile layout, mobile responsive QA, performance optimisation (ISR, Redis caching, lazy loading), custom cursor, Sentry integration, Vitest unit tests (70%+), Supertest integration tests, Playwright E2E (16 flows), k6 load tests, GitHub Actions CD, production deployment (Vercel + Railway + Neon + Meilisearch + Upstash), staging + smoke tests

---

# V2.0 — AI Intelligence Layer

> Manmadhan's AI ⚡ transforms the platform from a tool directory into a living intelligence workspace.
> Builds on V1. Additional build time: ~6 weeks.

## V2 — New Systems

### 1. Manmadhan's AI ⚡

- Floating AI assistant button — persistent on every Hub page (bottom-right)
- Full AI chat page: `/ai`
- Powered by OpenAI GPT-4o (primary) with Claude API fallback
- RAG pipeline: entire tool directory embedded as knowledge base → on query, retrieve top-K relevant tool chunks from Qdrant → inject into GPT context → grounded answers
- SSE streaming: answer tokens streamed word-by-word to UI
- Suggested prompts on empty state: "What's the best free AI image tool?" · "Compare ChatGPT vs Claude for writing" · "What changed in AI tools this week?"
- Inline tool cards rendered when AI mentions a specific tool in its response
- Copy answer to clipboard, export conversation as Markdown
- Admin: AI usage analytics (query count, token usage, cost estimate, feedback scores, top query topics) at `/admin/ai`

### 2. AI Memory Architecture

**Session Memory:** Full conversation stored in Redis (TTL: 1 hour). System prompt includes user's Hub ID, role, saved tools, recent activity (last 10 actions). Rolling window of last 20 messages for context.

**Long-Term Memory:** User can enable in settings. Memory items extracted from conversations by BullMQ MemorySummarisationWorker. Stored as vector embeddings (Qdrant) + text (PostgreSQL). Injected into system prompt on each new conversation. User can view/edit/delete: `/settings/ai-memory`

### 3. Semantic Search Upgrade

- Qdrant Cloud added
- All tool data embedded with OpenAI `text-embedding-3-small` via BullMQ ToolEmbeddingWorker
- Hybrid search: Meilisearch (keyword) + Qdrant (semantic) run in parallel → merged via Reciprocal Rank Fusion (RRF)
- Natural language queries work: "free tools for podcast editing" → semantically relevant results without keyword match
- "Semantic mode" toggle in search UI

### 4. AI Comparison Verdict

- "Get AI Verdict" button on comparison page
- AI analyses all compared tools' data → returns: recommended for use case, best value, best features, 2–3 sentence summary
- Grounded in tool directory (no hallucination)
- Verdict cached in Redis (TTL: 24h), included in comparison PDF export

### 5. AI Recommendations Engine

- "Recommended for you" dashboard widget
- Based on: saved tools, collections, viewed tools (last 30 days), AI memory, positive reviews written
- BullMQ RecommendationWorker runs daily per user
- "Why recommended?" tooltip per card
- New user fallback: top-rated platform tools

### 6. AI Tool Auto-Enrichment Pipeline

- BullMQ ToolEnrichmentWorker on every new tool added
- Fetches tool website metadata, uses AI to suggest missing tags, sector/category, enhanced description
- Admin enrichment review queue: `/admin/tools/enrichment` — accept / reject per suggestion

### 7. AI Changelog Summariser

- AI generates one-sentence human-friendly summary for each changelog entry Admin publishes
- Admin can edit before publishing
- Summary shown as tooltip on tool card ("Updated: Added batch processing support")

### 8. AI Duplicate Detection Upgrade

- Semantic duplicate check added alongside fuzzy name + URL check
- Embeds new tool description → queries Qdrant → similarity > 0.92 = probable duplicate flag
- Admin sees semantic duplicate warning with similarity score

### 9. Redis Semantic Caching

- Before OpenAI call: hash query → check Redis for cached response to semantically similar query (cosine > 0.95) → return in <100ms
- Cache miss: call OpenAI, store with embedding, TTL: 6 hours
- Admin can clear AI response cache: `/admin/settings/ai`

## V2 — New Tables (10)

`ai_conversations` · `ai_messages` · `ai_feedback` · `ai_memory_items` · `tool_embeddings` · `tool_enrichment_queue` · `tool_enrichment_decisions` · `semantic_cache` · `recommendation_cache` · `ai_usage_log`

## V2 — New BullMQ Workers (4)

`ToolEmbeddingWorker` · `RecommendationWorker` · `MemorySummarisationWorker` · `EnrichmentWorker`

## V2 — New Infrastructure

- Qdrant Cloud (vector database)
- OpenAI API (GPT-4o + text-embedding-3-small)
- LangChain (RAG pipeline orchestration)

---

# V3.0 — Game Universe & Movie Expansion

> Entertainment layer deepens. Self-hosted movie, multiple games, community tools.
> Builds on V2. Additional build time: ~4 weeks.

## V3 — New Systems

### 1. Void Runner Game

- WebGL endless runner (Three.js / React Three Fiber)
- 3-lane runner, glowing neural entity protagonist
- Obstacles: data blocks, firewall barriers, corrupted nodes
- Collectibles: AI tokens (score multiplier), speed boosts, shields
- Progressive speed increase, online leaderboard, mobile swipe controls
- Unlockable character skins (score-threshold rewards)
- Weekly tournament with Top 3 badge awards on profile

### 2. Game Arcade Hub

- Route: `/games` — unified lobby for all games
- Game cards: name, description, personal best, global rank, play button
- Featured game of the week (Admin-set), All-time Hall of Fame per game
- Cross-game total score on User profile, tournament schedule shown

### 3. Seasonal Tournaments

- Admin creates tournaments: game, duration, prize description
- Special tournament leaderboard page with countdown
- Top 3 auto-awarded tournament badge — displayed permanently on profile
- Tournament history: `/games/tournaments`

### 4. Movie Hub — Self-Hosted Upgrade

- Self-hosted HLS via Mux or Cloudflare Stream (zero YouTube dependency)
- Adaptive bitrate: 360p / 720p / 1080p auto-switching
- Resume playback (position saved per user)
- Movie chapters (Admin-defined with timestamps)
- Subtitles (SRT/VTT upload in Admin)
- DRM-protected offline download
- Watch party mode: invite Hub members, Socket.IO position sync

### 5. Manmadhan Mini-Series

- Multi-content library: behind-the-scenes, trailers, exclusives, interviews
- Content types: video · audio · image gallery
- Library page: `/movie/library`
- Series playlists (Admin-defined), continue watching section

### 6. Tool Request & Voting

- Users submit tool requests: name, URL, reason (max 300 chars)
- All users upvote requests (one vote per request)
- Listing: `/tools/requests` sorted by votes
- Admin: accept (creates tool entry) · decline (notify requester with reason) · merge duplicates
- Top 5 requests shown on explore page

## V3 — New Tables (6)

`void_runner_scores` · `void_runner_leaderboard` · `game_tournaments` · `game_tournament_badges` · `tool_requests` · `tool_request_votes`

---

# V4.0 — Platform as a Business

> Monetisation, public reach, and native mobile experiences.
> Builds on V3. Additional build time: ~6 weeks.

## V4 — New Systems

### 1. Affiliate Revenue Engine

- Admin registers affiliate links per tool (UTM-tracked)
- "Visit Tool" uses affiliate URL — click tracked (tool, timestamp, anonymised user)
- Admin dashboard: clicks, estimated revenue per tool
- User opt-out in settings (uses direct URL instead)

### 2. Hub Blog / Knowledge Base

- Route: `/blog` — Admin publishes articles with rich text editor
- Types: Tool Review · Comparison · How-to · News · Opinion
- Related tools auto-linked inline (tool cards rendered)
- SEO: `sitemap.xml`, OpenGraph per article
- RSS feed: `/blog/rss.xml`
- User comments (Admin moderated)

### 3. Discord & Telegram Bot

- Commands: `!hub search [query]` · `!hub tool [slug]` · `!hub compare [slug1] [slug2]` · `!hub top` · `!hub new`
- Returns rich embed with tool card data
- Telegram: inline query support (`@ManmadhanHubBot [query]`)
- Setup: Admin generates bot token in `/admin/settings/integrations`

### 4. Browser Extension (Chrome)

- Auto-detects AI tools on websites you visit (matches against Hub domain list)
- Popup: "This tool is in Manmadhan's Hub" → quick-save or view details
- "Submit this tool" → pre-fills add tool form
- Requires Hub account (OAuth login in extension)

### . Native iOS & Android Apps (React Native / Expo)

- Full feature parity with web (Admin panel: web only)
- Native push notifications (Expo Notifications / FCM)
- iOS: Face ID / Touch ID + Dynamic Island integration (tool health alerts)
- Android: biometric auth, Material You theming
- App Store + Play Store listings

### . Hub Ambassador Program

- Admin nominates Ambassadors (badge on profile, `/ambassadors` page)
- Free Pro access for Ambassadors
- Unique referral invite link — tracked conversions credited to Ambassador
- Ambassador dashboard: invitations sent, joined, conversion rate

## V4 — New Tables (7)

 `invoices` · `affiliate_clicks` · `blog_posts` · `blog_comments`

---

# V5.0 — 3D Universe & AI Operating System

> The final form. A living, spatial AI universe.
> Builds on V4. Additional build time: ~8 weeks.

## V5 — New Systems

### 1. 3D WebGPU Tool Universe

- Route: `/universe` — full 3D space environment (Three.js + WebGPU renderer)
- Sectors = planets (unique visual per sector), Tools = stars orbiting their sector planet
- Collections = personal asteroid belts (user-defined constellations)
- Navigation: mouse drag to rotate, scroll to zoom, WASD to fly, gyroscope on mobile
- Click a star → tool detail card appears in 3D space
- LOD (Level of Detail) for performance — fewer polygons at distance
- Fallback: 2D grid for non-WebGPU devices

### 2. Physics-Based Cursor

- Custom cursor with mass, velocity, spring attraction physics
- Magnetic pull toward interactive elements, shockwave ripple on click
- Particle trail on fast movement (decays 0.3s)
- Auto-disabled on low-performance devices

### 3. Procedurally Generated Cinematic Gate

- Landing background: unique every visit (seeded by timestamp + visitor fingerprint)
- GLSL shader nebula — no two visitors see the exact same visual
- Canvas rendered, never blocks page load

### 4. Generative User Themes

- AI analyses user's saved tools, activity, color mode → generates a unique custom neural theme
- Primary hue from most-used sector, accent from AI interaction patterns
- "Generate my theme" in color mode settings — save or discard

### 5. AI Agent Workflow Builder

- Upgrade of Personal Workflow Builder to full agent orchestration
- Define: trigger → steps → output
- Steps: manual tool · AI action (summarise/translate/classify/extract/generate) · condition (if/else)
- Workflow runner, scheduled workflows, per-run execution logs
- Share runnable workflow (receiver can clone + run)

### 6. Tool API Marketplace

- Users access tools directly via Hub — one MM-Hub API key → all registered tools
- Admin registers tool API keys (platform-wide agreements)
- Credits system — usage metered via subscription
- Tool API catalogue: `/marketplace`

### 7. Additional Games

- **Neural Tetris** — Tetris with AI-themed blocks and neural glow
- **Hub Chess** — Async chess vs other Hub members (WebSocket)
- **Code Breaker** — Decrypt the node puzzle game
- Cross-game achievement system: badges for milestones across all games

### 8. Spatial / AR API Preparation

- REST + WebXR API layer for Vision Pro (visionOS) integration
- Spatial views: tool cards as floating 3D panels
- Groundwork for visionOS app (V5.1 scope)

## V5 — New Infrastructure

- WebGPU renderer (Three.js WebGPU backend)
- GLSL shaders (procedural generation)
- Stripe metered billing (credits)
- WebXR API layer

---

# Complete Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Frontend | Next.js | 15 | SSR, ISR, App Router |
| Styling | Tailwind CSS | 3.x | Utility-first |
| Components | shadcn/ui | Latest | Accessible components |
| Animation | Framer Motion | 11.x | Cinematic transitions |
| State (server) | React Query | 5.x | Caching + refetch |
| State (client) | Zustand | 4.x | Lightweight state |
| Forms | React Hook Form + Zod | 7.x / 3.x | Forms + validation |
| 3D | Three.js / R3F | Latest | 3D universe (V5) |
| i18n | next-intl | Latest | Multi-language |
| Backend | Node.js + Express.js | 20 LTS / 4.x | REST API |
| Language | TypeScript | 5.x | Type safety |
| ORM | Drizzle | Latest | SQL + migrations |
| Auth | Auth.js v5 | 5.x | Authentication |
| Database | Neon PostgreSQL | Latest | Primary DB |
| Cache | Upstash Redis | Latest | Sessions, cache |
| Search FT | Meilisearch Cloud | Latest | Keyword search |
| Search Vector | Qdrant Cloud | Latest | Semantic search (V2+) |
| Queue | BullMQ + Bull Board | Latest | Background jobs |
| Media | Cloudinary | Latest | Logos, screenshots |
| Video | Mux / Cloudflare Stream | Latest | Self-hosted video (V3+) |
| AI Chat | OpenAI GPT-4o | Latest | AI assistant (V2+) |
| Embeddings | OpenAI text-embedding-3-small | Latest | Embeddings (V2+) |
| RAG | LangChain | Latest | Pipeline (V2+) |
| Payments | Stripe | Latest | Billing (V4+) |
| Mobile | Expo (React Native) | Latest | iOS + Android (V4+) |
| Extension | Chrome Extension Manifest V3 | — | Browser extension (V4+) |
| Deploy FE | Vercel | — | Frontend |
| Deploy BE | Railway | — | Backend + workers |
| Monorepo | Turborepo | Latest | Build system |
| CI/CD | GitHub Actions | — | Pipeline |
| Dev | Docker Compose | — | Local dev |
| Errors | Sentry | Latest | Error monitoring |
| Observability | OpenTelemetry + Grafana | — | Metrics + traces |
| Testing | Vitest + Supertest + Playwright + k6 | Latest | Full test suite |

---

# UI Design System

## Visual Identity

| Layer | Spec |
|---|---|
| Base Theme | Deep space dark — near-black `#020408` / `#0A0F1A` base |
| Light Theme | White/light-grey backgrounds, deep navy text, same accent colours |
| Theme Toggle | Sun/Moon icon — always visible in Navbar across all viewports. Persists to `localStorage`. |
| Primary Font | Space Grotesk — all UI text, buttons, labels |
| Cinematic Font | Clash Display — hero headings, cinematic titles, game screens, major numbers |
| Code Font | DM Mono — Hub IDs, code blocks, terminal elements, section labels |
| Motion | Framer Motion 11 — page transitions, hover states, modal springs, particle systems |
| Icons | Lucide Icons (stroke-based, consistent set) |
| Illustration | Flat geometric + neon glow — no stock photos, no stock images |
| Accent Colors | Green `#8DFB5B` · Blue `#2979FF` · Orange `#FF6D00` |


# Final Platform Numbers

## By Version

| Metric | V1 | V2 | V3 | V4 | V5 |
|---|---|---|---|---|---|
| Core Systems | 85 | 98 | 108 | 118 | 130+ |
| Database Tables | 62 | 72 | 78 | 85 | 90+ |
| API Endpoints | 115+ | 145+ | 160+ | 180+ | 200+ |
| BullMQ Workers | 7 | 11 | 12 | 14 | 15 |
| AI Modules | 0 | 13 | 13 | 13 | 16 |
| Hub Games | 1 | 1 | 3 | 3 | 5 |
| App Routes | 73 | 85 | 95 | 110 | 120+ |
| Languages | 3 | 3 | 3 | 3 | 5+ |
| E2E Test Flows | 16 | 22 | 28 | 36 | 44 |
| Build Phases | 5 | 8 | 11 | 14 | 17 |
| Build Weeks | 10 | 16 | 20 | 26 | 34 |

## Total Platform (V5 Complete)

| Metric | Count |
|---|---|
| Total Core Systems | 130+ |
| Total Database Tables | 90+ |
| Total API Endpoints | 200+ |
| Total Hub Games | 5 |
| Total Languages | 5+ |
| Total BullMQ Workers | 15 |
| Total AI Modules | 16 |
| Total App Routes | 120+ |
| Total Build Phases | 17 |
| Total E2E Flows | 44+ |
| Seeded Admin Accounts | 4 (MM1107, SS0778, MK1603, TN813) |
| Role Tiers | 2 (Admin · User) |

---

# Build Order Summary

| Version | Focus | Duration |
|---|---|---|
| V1.0 | Foundation — complete production base | 10 weeks (5 phases) |
| V2.0 | AI intelligence layer + semantic search | 6 weeks (3 phases) |
| V3.0 | Games expansion + self-hosted movie | 4 weeks |
| V4.0 | Business layer — billing, API, native apps | 6 weeks |
| V5.0 | 3D universe + AI agents + marketplace | 8 weeks |
| **Total** | **Full V5 completion from scratch** | **~34 weeks** |

---

```
╔══════════════════════════════════════════════════════════════════════════╗
║              MANMADHAN'S HUB — ULTIMATE FINAL BLUEPRINT                 ║
║                                                                          ║
║   🌌  A private AI universe                                              ║
║   ⚡  Manmadhan's AI ⚡ — the platform intelligence engine               ║
║   🚀  Centralized AI tool discovery ecosystem                            ║
║   🎭  Cinematic invitation-only experience                               ║
║   🔐  Premium security — MM-XXXX-XXXX-XXXX Hub Key 2FA                  ║
║   🎮  Game universe — Neural Snake · Void Runner · Arcade               ║
║   🎬  Manmadhan Movie Hub — self-hosted cinematic streaming             ║
║   📖  18-section self-contained user guide — fully offline              ║
║   📶  Offline-first resilient PWA                                        ║
║   🌐  Multilingual — English · Tamil · Hindi                            ║
║   🌍  V5: 3D WebGPU universe — tools as stars in a living galaxy        ║
║   🤖  V5: AI agent workflows — autonomous tool pipelines                ║
║                                                                          ║
║   Platform       : Manmadhan's Hub                                       ║
║   Founder        : Hemanth                                               ║
║   Founder Email  : hemanthmm1107@gmail.com                               ║
║   Founder User   : MM1107  ·  Hub ID: MM1107                            ║
║   Co-Founder     : shriramss0778@gmail.com  ·  SS0778                   ║
║   Co-Founder     : saikrishnanmk1603@gmail.com  ·  MK1603               ║
║   Co-Founder     : TN813@gmail.com  ·  TN813                            ║
║   Role System    : 2-Tier — Admin  ·  User                              ║
║   Repository     : manmadhans-hub                                        ║
║   Seed command   : npm run seed:founderadmin                             ║
║   Default pwd    : welcome@123 (forced change on first login)            ║
║   Hub Key format : MM-XXXX-XXXX-XXXX (one-time, generated at seed)       ║
║   Hub ID format  : [Initials][4-digit] — MM1107 · SS0778 · MK1603       ║
║   Login style    : Pop-up modal (not a separate page)                    ║
║                                                                          ║
║   V1 → 85 systems · 62 tables · 115+ endpoints                         ║
║   V2 → 98 systems · 72 tables · 145+ endpoints · 13 AI modules         ║
║   V3 → 108 systems · 78 tables · 160+ endpoints · 3 games              ║
║   V4 → 118 systems · 85 tables · 180+ endpoints · native apps          ║
║   V5 → 130+ systems · 90+ tables · 200+ endpoints · 3D universe        ║
║                                                                          ║
║   All 5 Versions Defined · Build-Ready · 100% Complete                  ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

*Manmadhan's Hub — Ultimate Final Architecture Documentation*
*V1.0 → V5.0 · Complete Platform Blueprint · All Systems Defined*
*Founder: Hemanth (MM1107) · Co-Founders: SS0778 · MK1603 · TN813*
*Document: manmadhans-hub-ULTIMATE-FINAL · Classification: Private*
