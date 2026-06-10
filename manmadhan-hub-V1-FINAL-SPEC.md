# 🌌 Manmadhan's Hub — V1.0
## Complete Final Production Architecture & Specification Document

```
╔══════════════════════════════════════════════════════════════════════╗
║          🌌  M A N M A D H A N ' S   H U B  —  V 1 . 0            ║
║        Complete Final Production Architecture & Specification        ║
║                                                                      ║
║   Private · Invitation-Only · AI Tool Discovery Universe            ║
║   Cinematic · Scalable · Offline-Ready · PWA                        ║
╚══════════════════════════════════════════════════════════════════════╝
```

> **Repository:** `manmadhan-hub`
> **Classification:** Private — Invitation-Only AI Universe
> **Status:** V1.0 Final — All Systems Defined
> **Founder:** Hemanth Manmadhan · MM1107
> **Default Password:** `Welcome@123` — Forced change on first login
> **Seed Command:** `npm run seed:founderadmin`

---

## Table of Contents

**Part I — Platform Identity**
1. Platform Overview
2. Platform Identity & Founders
3. Seeded Accounts
4. Role System — 2-Tier
5. Core Platform Structure

**Part II — Authentication & Onboarding**
6. Authentication System
7. Admin First Login — 3-Step Flow
8. User First Login — 4-Step Flow
9. Subsequent Login Flow
10. Google OAuth Login
11. Password Management System
12. Active Session Manager
13. Invitation System

**Part III — Tool Directory**
14. Tool Directory System
15. Tool JSON Schema — Full Definition
16. Tool Status & Trust Layers
17. Tool Management — Admin Manual Add
18. Tool Management — User Submission
19. JSON Bulk Import with Built-in Editor
20. Duplicate Detection Engine
21. GPT Auto-Tag Agent
22. Tool Detail Page — Full Structure
23. Tool Health Monitor
24. Tool Version History & Rollback
25. Tool Changelog Tracker
26. Tool Pricing History Tracker
27. Tool Flag & Report System
28. Tool Rating & Review System
29. Community Prompts Per Tool
30. Tool Screenshot Gallery
31. Similar Tools System
32. Tool Request & Voting
33. Tool Graveyard
34. Tool of the Week

**Part IV — MCP Servers Section**
35. MCP Servers — Full System

**Part V — Deals Section**
36. Deals — Full System

**Part VI — Discovery & Search**
37. Smart Search System
38. Compare Tools System
39. Sectors & Categories System
40. Recommendation Engine

**Part VII — User Workspace**
41. Bookmarks System
42. Collections System
43. Personal Workflow Builder
44. Daily AI Digest
45. Daily AI Agent — Tools Curation & Suggestions
46. Platform Activity Feed
47. Personal Usage Analytics
48. Export System

**Part VIII — Platform Systems**
49. Realtime Notification System
50. Announcement System
51. Maintenance System
52. User Warning System
53. Audit Log System
54. Security Log System
55. Manmadhan Movie Section
56. Games System
57. User Guide System
58. Admin Impersonation

**Part IX — Frontend & Design**
59. Design System — Cyber Dark Theme
60. Typography System — Poppins
61. Spacing & Shape Tokens
62. Component Styling Rules
63. Light & Dark Mode
64. PWA — Progressive Web App

**Part X — UI Pages & Components**
65. All UI Pages — Complete List (73 Routes)
66. Custom UI Components — Complete List

**Part XI — Tech Stack**
67. Complete Technology Stack

**Part XII — Database Architecture**
68. Database Architecture — 55 Tables

**Part XIII — API Architecture**
69. Complete API Architecture — 110+ Endpoints
70. BullMQ Queues & Workers
71. Middleware Flow

**Part XIV — DevOps & Infrastructure**
72. Monorepo Folder Architecture
73. DevOps & CI/CD
74. Observability Stack
75. Security Hardening
76. Performance System

**Part XV — Testing**
77. Testing Architecture

**Part XVI — Build Order**
78. Build Order — 5 Phases (10 Weeks)
79. V1.0 Final Status & Platform Numbers

---

# PART I — PLATFORM IDENTITY

---

## 1. Platform Overview

**Manmadhan's Hub** is a **private, invitation-only AI tool discovery universe** — a futuristic, cinematic platform serving as the definitive centralized intelligence layer for discovering, organizing, comparing, and managing the world's AI tools.

It is not a public platform. Every user must be invited. Every tool is curated. Every system is enterprise-grade.

### Core User Capabilities

| Capability | Description |
|---|---|
| Discover | Browse AI tools across categorized sectors and explore pages |
| Search | Smart full-text search with filters, synonyms, and typo tolerance |
| Compare | Side-by-side tool comparison with up to 4 tools |
| Organize | Save tools into personal bookmarks and named collections |
| Workflow | Chain tools into named personal workflows |
| Monitor | Track health, changelogs, pricing history, and version history per tool |
| Screenshots | View tool screenshot galleries on detail pages |
| Flag | Report wrong or outdated tool information to Admins |
| Prompts | View and submit community prompts for any tool |
| Deals | Browse live deals and discounts for AI tools |
| MCP | Discover and submit MCP Servers with cross-links to tools |
| Stats | View personal usage analytics |
| Movie | Watch the Manmadhan movie |
| Play | 6 fun hub-exclusive games — just for time pass, no serious scoring |
| Guide | Access an 18-section built-in user manual |
| Export | Export collections, bookmarks, comparisons as PDF, CSV, JSON, Markdown |
| Offline | Access cached tools, bookmarks, guide, and games without internet |

> **Note:** No AI chatbot is included in V1.0. AI is used only for the GPT Auto-Tag Agent and the Daily AI Curation Agent.

### Platform Stats — V1.0 Final

| Metric | Count |
|---|---|
| Core Systems | 80 |
| Database Tables | 55 |
| API Endpoints | 110+ |
| BullMQ Queues / Workers | 7 |
| Express Route Files | 22 |
| Next.js App Routes | 73 |
| Custom UI Components | 40+ |
| Games | 6 |
| User Manual Sections | 18 |
| Notification Types | 9 |
| Onboarding Steps (Admin) | 3 |
| Onboarding Steps (User) | 4 |
| Build Phases | 5 |
| Build Weeks | 10 |
| E2E Test Flows | 18 |
| Seeded Admin Accounts | 4 |
| Role Tiers | 2 (Admin · User) |

---

## 2. Platform Identity & Founders

| Identity Layer | Details |
|---|---|
| 🌌 Platform Name | **Manmadhan's Hub** — changeable by Founder from Platform Settings |
| 🔐 Access Model | Private · Invitation-only · Zero public access |
| ⚡ Environment | Futuristic cinematic production-grade experience |
| 🚀 Core Purpose | Centralized AI tool discovery, organization, comparison, and management |
| 🎮 Game Layer | 6 hub-exclusive games — casual, offline-first, just for fun |
| 📖 Self-Guided | 18-section built-in user manual — no external docs needed |
| 🎨 Color System | Cyber Dark — #8DFB5B neon green accent on near-black backgrounds |
| 📝 Typography | Poppins — all weights 300 through 800 |
| 🌐 Language | English (i18n-ready for future expansion) |
| 🤖 AI Usage | GPT Auto-Tag Agent + Daily AI Curation Agent (no chatbot) |

---

## 3. Seeded Accounts — Full Details

All 4 accounts are auto-created by the seed script `npm run seed:founderadmin`.
They are **permanent**, **undeletable**, and **role-locked** at the database level.

| Role | Username | Email | Guard |
|---|---|---|---|
| Founder Admin | MM1107 | hemanthmm1107@gmail.com | `is_founder = TRUE` |
| Co-Founder Admin | SS0778 | shriramss0778@gmail.com | `is_cofounder = TRUE` |
| Co-Founder Admin | MK1603 | saikrishnanmk1603@gmail.com | `is_cofounder = TRUE` |
| Co-Founder Admin | TN813 | TN813@gmail.com | `is_cofounder = TRUE` |

### Seed Script Behaviour

- Script: `npm run seed:founderadmin`
- Located: `apps/api/seed/founderadmin.ts`
- **Idempotent** — safe to run multiple times; never duplicates or overwrites changed passwords
- Each account seeded with:
  - Username and email as above (pre-set, permanent)
  - Default password: `Welcome@123` (forced change on first login)
  - Role: Admin
  - `is_founder = TRUE` for MM1107 — cannot be demoted, suspended, or deleted by **any** Admin action or API call
  - `is_cofounder = TRUE` for SS0778, MK1603, TN813 — same permanent protection
- Usernames MM1107, SS0778, MK1603, TN813 are permanently reserved — no other user can claim them

---

## 4. Role System — 2-Tier

Manmadhan's Hub uses a clean **2-tier role system** with no sub-tiers.

| Role | Description |
|---|---|
| **Admin** | Full platform control. Every Admin has identical privileges — Founder, Co-Founders, and promoted Admins all share the same complete access. |
| **User** | Standard invited member. Cannot access any Admin panel route. |

> Admin = Super Admin. There is no distinction within the Admin role. The Founder (MM1107) and Co-Founders (SS0778, MK1603, TN813) are Admins who are permanently seed-protected — they cannot be demoted, suspended, or deleted through any Admin panel action or direct API call.

### Complete Admin Capabilities

- Full tool management: add, edit, approve, reject, archive, restore, delete
- Review GPT Auto-Tag Agent suggestions before publishing any tool
- Manage bulk JSON tool import via built-in editor
- Manage sectors and categories
- Manage MCP Servers listing
- Manage Deals section
- Review and approve community-submitted prompts per tool
- Review and approve community-submitted tool requests
- Generate and revoke user invitations
- Promote users to Admin or demote Admins back to User (cannot demote Founder/Co-Founders)
- Suspend, warn (3-stage system), delete users
- Admin impersonation (view Hub as any user)
- View full Audit Log
- View full Security Log
- Manage platform announcements
- Toggle maintenance mode (instant or scheduled)
- Manage Manmadhan Movie section
- Manage all 6 games
- Manage Daily AI Digest settings
- Manage Daily AI Curation Agent settings
- Manage recommendation engine settings
- Monitor all active sessions
- Manage feature flags
- View platform analytics dashboard
- Access Bull Board queue monitor
- Export any platform data
- Manage user guide content
- Manage tool registry
- Block/unblock IP addresses
- Manage search synonyms

### Complete User Capabilities

- Browse AI tool directory (sector → category → tool)
- Browse MCP Servers section
- Browse Deals section
- Submit tools to the registry (goes to Admin approval queue)
- Submit MCP servers (goes to Admin approval)
- Submit prompts for any tool (goes to Admin review)
- Vote on tool requests
- Rate and review tools
- Flag/report tool issues
- Smart search (tools, MCP servers, categories, sectors)
- Compare tools side-by-side (up to 4)
- Save tools to personal bookmarks
- Create and manage personal collections
- Build personal workflows (chain tools)
- View Daily AI Digest
- Receive realtime notifications
- Play all 6 games
- Watch Manmadhan Movie
- Access 18-section user guide (offline cached)
- View personal activity feed
- View personal usage analytics
- Export collections, bookmarks, comparisons
- Manage own settings (profile, appearance, notifications, sessions, security)

---

## 5. Core Platform Structure

```
Developer Seeds 4 Admin Accounts (once)
                    ↓
      ┌─────────────────────────┐
      │   Authentication Layer   │  ← Invitation-only · JWT + Auth.js
      └─────────────────────────┘
                    ↓
      ┌─────────────────────────┐
      │   2-Tier Role System     │  ← Admin (all equal) · User
      └─────────────────────────┘
                    ↓
      ┌─────────────────────────┐
      │   AI Tool Directory      │  ← Manual + JSON Import + Duplicate Check
      └─────────────────────────┘
                    ↓
      ┌─────────────────────────┐
      │   GPT Auto-Tag Agent     │  ← Admin reviews & confirms before publish
      └─────────────────────────┘
                    ↓
      ┌─────────────────────────┐
      │  Daily AI Curation Agent │  ← Reviews tools, suggests daily additions
      └─────────────────────────┘
                    ↓
      ┌─────────────────────────┐
      │   Discovery Engine       │  ← Meilisearch Smart Search
      └─────────────────────────┘
                    ↓
      ┌─────────────────────────┐
      │   MCP Servers Section    │  ← Separate first-class section
      └─────────────────────────┘
                    ↓
      ┌─────────────────────────┐
      │   Deals Section          │  ← Live deals with countdown timers
      └─────────────────────────┘
                    ↓
      ┌─────────────────────────┐
      │   Realtime Infrastructure│  ← Socket.IO + SSE + BullMQ
      └─────────────────────────┘
                    ↓
      ┌─────────────────────────┐
      │   Personalized Workspace │  ← Bookmarks, Collections, Recommendations
      └─────────────────────────┘
                    ↓
      ┌─────────────────────────┐
      │   Game Universe          │  ← 6 casual games for fun
      └─────────────────────────┘
                    ↓
      ┌─────────────────────────┐
      │   Cinematic UI Layer     │  ← Framer Motion · Cyber Dark · Poppins
      └─────────────────────────┘
```

---

# PART II — AUTHENTICATION & ONBOARDING

---

## 6. Authentication System

### Login UI — Pop-up Modal

- Login is a **modal overlay** — no separate `/login` route exists
- Triggered by: "Login" button in the landing page navbar
- **Dark glassmorphism card** with backdrop blur
- Steps animate forward inside the same modal (slide right-to-left per step)
- ESC key or click-outside: closes modal, returns to landing page
- After successful login + onboarding complete: modal closes, redirect to `/dashboard`

### Token Architecture

- **JWT access token:** 15-minute expiry — signed with HS256
- **Refresh token:** 7-day expiry — rotating (old token invalidated on every refresh)
- Sessions stored in **Upstash Redis** with user ID + device fingerprint
- Silent redirect on session expiry — no error page, seamlessly returns to login modal
- Auth framework: **Auth.js (NextAuth v5)** — credentials provider + Google OAuth provider

---

## 7. Admin First Login — 3-Step Flow

> Applies to: MM1107, SS0778, MK1603, TN813 — and any user promoted to Admin.

**Step 1 — Email + Password Verification**
- Enter email + default password (`Welcome@123`)
- System validates: account exists, invitation accepted, bcrypt hash comparison
- Brute force protection: 5 failed attempts → 15-minute lockout
- After lockout: Admin is notified via security log

**Step 2 — Forced Password Change**
- Old password (Welcome@123) must be changed immediately
- Strength requirements: min 8 characters, 1 uppercase, 1 number, 1 special character
- Last 3 passwords blocked from reuse (enforced server-side)
- Real-time strength indicator shown (PasswordStrengthBar component)
- Cannot skip or dismiss

**Step 3 — Welcome Screen**
- Cinematic reveal animation: "Welcome back, [username]. The Hub is yours."
- Framer Motion spring entrance
- Platform stats shown (tool count, user count, last updated)
- "Enter the Hub" button → redirect to `/dashboard`

---

## 8. User First Login — 4-Step Flow

> Applies to: all invited Users (non-seeded accounts).

**Step 1 — Email + Password Verification**
- Enter email + default password (`Welcome@123`)
- Same validation and brute force protection as Admin

**Step 2 — Forced Password Change**
- Same requirements as Admin
- Cannot skip

**Step 3 — Terms & Conditions**
- Full platform T&C displayed (rich text, scrollable)
- **SlideToConfirm** component — physical slide gesture required to accept
- Cannot proceed without completing the slide
- Acceptance timestamp recorded in database

**Step 4 — Welcome Screen**
- Cinematic reveal: "You are now part of the Hub."
- Particle burst animation (Framer Motion)
- "Explore the Hub" button → redirect to `/dashboard`

---

## 9. Subsequent Login Flow (All Users After Onboarding)

```
Enter Email → Enter Password → Session Created → Redirect to /dashboard
```

- No re-onboarding after first login completion
- JWT + refresh token issued
- New device: triggers "New login from [device/IP]" security notification to user
- Concurrent session limit enforced (default: 3 — configurable in Platform Settings)
- Exceeding limit: oldest session auto-terminated

---

## 10. Google OAuth Login

- Google login button visible in Login Modal (Step 1)
- Links to existing Hub account by **matching email address**
- Google accounts without a valid invitation **cannot access the platform**
- First-time Google login: triggers same onboarding flow (Admin 3-step / User 4-step)
- Subsequent Google logins: same as normal login — no re-onboarding
- Step 2 (Password Change) is skipped for Google accounts (no password set)
- Terms acceptance (Step 3 for users) still required even via Google

---

## 11. Password Management System

- Default password `Welcome@123` forced change on first login (Step 2 of onboarding)
- Hashing: bcrypt with salt rounds = 12
- **Forgot Password flow:**
  - User clicks "Forgot password?" in Login Modal
  - Email OTP sent (6-digit, 10-minute expiry)
  - User enters OTP → verified → set new password
  - New password must meet strength requirements
  - Cannot reuse last 3 passwords
- Password change available anytime: `/settings/security`
- Admin can force-reset any user's password (sends new Welcome@123 + triggers Step 2 on next login)

---

## 12. Active Session Manager

- Route: `/settings/sessions`
- Users view all active sessions: device name, browser, OS, IP address, approximate location, last active timestamp
- Users can:
  - Terminate any individual session
  - "Log out everywhere else" (terminate all sessions except current)
- Admin can view and terminate any user's sessions from `/admin/users/[username]`
- Max concurrent sessions: 3 (configurable in Platform Settings, default 3)
- Exceeding limit: oldest session auto-expired silently
- New device login notification delivered to user via notification system

---

## 13. Invitation System

- **Only Admins** can generate invitations
- Each invitation contains: UUID token, assigned email, expiry date (7 days default, configurable), inviting Admin username
- Invitation message auto-formatted for **WhatsApp + Telegram** — copy-paste ready template
- One invitation = one account (single-use token)
- Admin can revoke any unused invitation before expiry
- Invitation statuses: `pending` · `accepted` · `expired` · `revoked`
- Route: `/admin/invitations`
- **Bulk invite:** Admin can generate multiple invitations at once (CSV email upload)
- `INVITATION_ACCEPTED` notification sent to the Admin who generated the invitation
- Invitation history retained permanently in database

---

# PART III — TOOL DIRECTORY

---

## 14. Tool Directory System

- Central catalogue of all AI tools, curated and managed by Admins
- Tool sources: Admin manual add · User submission (with Admin approval) · JSON bulk import
- Display modes: Grid view · List view (user-selectable, persisted to preferences)
- Sorting: Newest · Most Rated · Alphabetical · Most Viewed · Recently Updated
- Filtering: sector · category · pricing type · tool status · rating (≥X stars) · job role · verified/community · API available
- Tool card: logo, name, short description, sector badge, rating stars, bookmark button, compare toggle, Verified or Community badge

---

## 15. Tool JSON Schema — Full Definition

Every tool in the platform — whether added manually, via user submission, or via JSON bulk import — follows this complete schema:

```json
{
  "id": "",
  "name": "",
  "slug": "",
  "short_description": "",
  "description": "",
  "use_case": "",
  "key_features": [],
  "search_keywords": [],
  "website_url": "",
  "logo_url": "",
  "category_id": "",
  "category_name": "",
  "category_icon": "",
  "sector_id": "",
  "sector_name": "",
  "sector_icon": "",
  "pricing_type": "",
  "pricing_details": "",
  "developer_name": "",
  "developer_details": {
    "company_name": "",
    "founders": [],
    "headquarters": "",
    "founded_year": 0,
    "official_website": "",
    "support_email": "",
    "developer_type": ""
  },
  "author": {
    "author_name": "",
    "author_type": "",
    "author_role": "",
    "author_website": "",
    "author_contact": "",
    "author_verified": false
  },
  "ai_model_used": "",
  "platform_support": [],
  "launch_date": "",
  "tool_status": "",
  "is_featured": false,
  "integrations": [],
  "api_available": false,
  "rating": 0.0,
  "tags": [],
  "last_verified": "",
  "created_at": "",
  "updated_at": "",

  "EXTENDED_FIELDS": {
    "youtube_tutorial_url": "",
    "ai_tutorial_url": "",
    "ai_guide": "",
    "job_roles": [],
    "is_verified": false,
    "submission_status": "",
    "mcp_related": [],
    "deal_id": "",
    "screenshot_urls": [],
    "changelog_entries": [],
    "health_status": "",
    "pricing_history": [],
    "similar_tool_ids": [],
    "is_graveyard": false,
    "graveyard_date": "",
    "graveyard_reason": ""
  }
}
```

### Field Descriptions

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Auto-generated unique identifier |
| `name` | string | Tool display name |
| `slug` | string | URL-safe identifier — auto-generated from name, editable before publish |
| `short_description` | string | Max 160 chars — used in tool cards |
| `description` | string | Full rich text description |
| `use_case` | string | Primary use case paragraph |
| `key_features` | string[] | Bullet list of main features |
| `search_keywords` | string[] | Extra keywords for search indexing |
| `website_url` | string | Official tool website |
| `logo_url` | string | Cloudinary CDN URL |
| `pricing_type` | enum | Free · Freemium · Paid · Enterprise · API-based · Credits |
| `ai_model_used` | string | Underlying AI model (e.g. GPT-4o, Claude, Gemini) |
| `platform_support` | string[] | Web · iOS · Android · Desktop · API |
| `tool_status` | enum | Active · Beta · Archived · Deprecated · Shutdown · Discontinued |
| `is_verified` | boolean | true = Admin-published. false = Community submitted |
| `submission_status` | enum | draft · pending · approved · rejected · needs-info |
| `job_roles` | string[] | Affected job roles (GPT-suggested, Admin-confirmed) |
| `youtube_tutorial_url` | string | Optional. Only shown on detail page if set |
| `health_status` | enum | active · degraded · down |
| `is_graveyard` | boolean | true = tool is dead/discontinued |
| `graveyard_date` | date | Date the tool was shut down |
| `graveyard_reason` | string | Why it was discontinued |

---

## 16. Tool Status & Trust Layers

### Layer 1 — Active Tools (Main Directory)

| Status | Badge | Description |
|---|---|---|
| Active | Green pulse dot | Tool is live and maintained |
| Beta | Yellow badge | Tool is in public beta |
| Archived | Grey badge | Admin archived — visible but not promoted |

### Trust Badges

| Badge | Meaning |
|---|---|
| ✅ Verified | Admin-published or Admin-verified tool |
| 🌱 Community | User-submitted, approved by Admin but not re-verified by Admin |

### Layer 2 — Tool Graveyard (Dead Tools)

- Discontinued, shutdown, or deprecated tools are **never deleted** from the database
- They move to the `/graveyard` section with:
  - Death date (`graveyard_date`)
  - Reason (`graveyard_reason`)
  - A prominent "This tool is no longer active as of [date]" banner
  - Historical data preserved: reviews, ratings, changelogs, pricing history
- Graveyard page: `/graveyard` — searchable, filterable by sector and death year
- **Purpose:** Solves the trust problem — users know which tools are dead, which are alive, which are maintained. No ghost tools.

---

## 17. Tool Management — Admin Manual Add

- Route: `/admin/tools/add`
- Full form with **Zod validation** on all fields
- Logo upload via **Cloudinary** (drag & drop, auto-resize to 200×200px, formats: PNG, JPG, SVG, WEBP)
- Screenshot upload: up to 10 images via Cloudinary (drag & drop, reorderable)
- Slug auto-generated from name — editable before publish
- Status selection: Draft · Published · Archived · Beta · Deprecated
- Mandatory fields: name, website URL, category, sector, description, pricing type
- On save: **GPT Auto-Tag Agent** runs → generates tag suggestions, use-case labels, category suggestion, job role tags
- **Admin reviews all GPT suggestions in a confirmation panel before the tool is published** — can accept, edit, or reject each suggestion individually
- Duplicate check runs automatically before save — Admin must acknowledge or override any warnings
- Preview mode: Admin can preview exactly how the tool detail page will look before publishing

---

## 18. Tool Management — User Submission

- Route: `/submit-tool`
- Simplified form: name, website URL, description, category, sector, pricing type, developer name, author info
- On submission: **GPT Auto-Tag Agent** runs immediately — suggestions stored but not shown to user
- Submission enters Admin approval queue: `/admin/submissions`
- Status flow: `pending` → `in-review` → `approved` / `rejected` / `needs-info`
- Admin sees GPT suggestions in the review panel and confirms or edits before approving
- Admin can leave internal notes on each submission
- User receives `SUBMISSION_STATUS` notification when status changes
- Approved community tools show **Community badge** unless Admin manually re-verifies (then shows Verified badge)

---

## 19. JSON Bulk Import with Built-in Editor

- Route: `/admin/tools/import`
- **Two input methods:**
  1. Upload a JSON file (drag & drop or file picker)
  2. **Built-in JSON editor** inside the platform — Admin can write or paste JSON directly without leaving the Hub, with syntax highlighting and error markers
- Schema documentation shown inline in the import UI (collapsible reference panel)
- System validates each entry against the full tool schema on submit
- **Preview table:** valid entries (green) · invalid entries (red, with error reason) · duplicate entries (yellow, with matched tool)
- Commits only valid, non-duplicate entries — skips invalids with a detailed error report
- GPT Auto-Tag Agent runs on each valid entry — Admin sees a bulk suggestion review panel before final commit
- Import log saved to Audit Log (entries count, skipped count, errors, Admin who imported)

---

## 20. Duplicate Detection Engine

Runs automatically on every manual add, user submission, and bulk import entry.

**Detection Methods:**
1. **Fuzzy name matching** — Levenshtein distance algorithm, flags if similarity > 85%
2. **URL fingerprint matching** — normalises URLs (strips www, trailing slash, query params) and checks for exact domain match
3. **Slug collision check** — prevents identical slugs
4. **Description similarity scoring** — cosine similarity on TF-IDF vectors of description text, flags if similarity > 80%

**Behaviour:**
- Duplicate warning shown with match percentage and the matched tool's name and URL
- Admin can override and proceed if it is genuinely a different tool
- False positive feedback stored (Admin clicks "Not a duplicate") to improve future thresholds
- Confirmed duplicates logged in tool_import_logs table

---

## 21. GPT Auto-Tag Agent

A dedicated AI agent that runs automatically whenever a tool is added or submitted. It never publishes anything — it only generates suggestions that an Admin must review and confirm before the tool is published.

### Trigger Points
- Admin manual add → on "Save Draft" or "Preview"
- User submission → immediately on submission
- JSON bulk import → on each valid entry during import preview
- Daily AI Curation Agent suggestions → before Admin review

### What It Sends to GPT API
```
Tool Name: [name]
Description: [description]
Use Case: [use_case]
Key Features: [key_features array]
Website URL: [website_url]
Pricing Type: [pricing_type]
```

### What GPT Returns
```json
{
  "suggested_tags": [],
  "use_case_labels": [],
  "category_suggestion": "",
  "sector_suggestion": "",
  "job_roles": [],
  "short_description": "",
  "search_keywords": []
}
```

### Admin Review Panel
- After GPT returns suggestions, Admin sees a **side-by-side review panel**
- Each suggestion shown individually: accept (green tick) · edit (pencil) · reject (red X)
- Admin can bulk accept all suggestions or handle each one individually
- Only after Admin confirms does the tool proceed to publish
- If GPT API call fails: tool saves as draft with a "GPT suggestions pending" flag — Admin can re-trigger manually

---

## 22. Tool Detail Page — Full Structure

- Route: `/tools/[slug]`
- Rendering: **SSR + ISR** (revalidate every 3600 seconds)
- OpenGraph meta tags auto-generated per tool
- Canonical URL set correctly

### Page Sections (in order)

1. **Tool Header** — logo, name, sector badge, pricing badge, Verified/Community badge, health status badge, action buttons (Bookmark, Add to Collection, Compare, Share, Flag)
2. **Overview** — short description, use_case paragraph, platform support icons, API available badge, developer name
3. **Key Features** — bullet list
4. **Screenshot Gallery** — up to 10 images, lightbox viewer with keyboard nav (← →) and mobile swipe
5. **Tutorials & Guides** — embedded YouTube player (only shown if `youtube_tutorial_url` is set), and an AI-generated/admin-curated text guide (shown if `ai_guide` is set)
6. **Pricing Details** — pricing type badge, pricing_details text, Pricing History Chart (line chart — date vs price)
7. **Developer Info** — company_name, founders[], headquarters, founded_year, official_website, support_email, developer_type
8. **Author Info** — who submitted it to the Hub, author_type, author_verified badge
9. **Integrations** — list of integration chips with external links
10. **Job Roles** — chips showing affected job roles
11. **Active Deal** — deal card (shown only if a live deal exists for this tool) — price, discount, expiry countdown, "Get Deal" button
12. **Prompts for this Tool** — community-submitted prompts with upvote counts, sorted by most upvoted. "Submit a Prompt" button.
13. **Similar Tools** — 6 tool cards (tag-overlap scoring)
14. **Related MCP Servers** — MCP server cards cross-linked to this tool
15. **Changelog** — version history entries: version number, date, summary, type badge (feature/fix/breaking/deprecation)
16. **Reviews** — aggregate star rating with distribution chart, written reviews with helpful votes, sort controls (newest · highest rated · lowest rated · most helpful)
17. **Health History** — 30-day health status timeline chart
18. **Share & Embed** — copy link, embed code generator

---

## 23. Tool Health Monitor

- **BullMQ HealthMonitorWorker** runs HTTP HEAD requests every 6 hours against each tool's `website_url`
- **Statuses:**
  - `active` — 200–299 response within 3 seconds
  - `degraded` — 200–299 response but >3 seconds response time
  - `down` — error, timeout, or 4xx/5xx response
- Health badge displayed on tool card (animated pulse dot) and tool detail page header
- 30-day health history stored in `tool_health_logs` table — displayed as chart on detail page
- Admin can manually trigger a health check for any tool from the tool edit panel
- `TOOL_HEALTH_CHANGE` notification sent to users who bookmarked the tool when status changes

---

## 24. Tool Version History & Rollback

- Every Admin edit to a published tool creates a **full version snapshot** — stores complete JSON diff (before state + after state)
- Admin can view diff between any two versions — changes highlighted in a before/after panel
- Admin can **rollback** to any previous version — creates a new version entry (nothing is deleted from history)
- Version history stored indefinitely
- Route: `/admin/tools/[id]/versions`
- Each version entry: version number, changed by (Admin username), timestamp, summary of changes

---

## 25. Tool Changelog Tracker

- Admin publishes changelog entries from tool edit panel
- Each entry: version number, date, summary, type badge (Feature · Fix · Breaking · Deprecation), optional internal Admin note (not shown to users)
- Public changelog tab on tool detail page
- Platform-wide changelog feed: `/changelog` — all tools, sorted by date, filterable by sector/type
- BullMQ IndexingWorker notifies users who bookmarked a tool when its changelog is updated (`TOOL_UPDATED` notification)
- Export changelog per tool as Markdown — available from tool detail page

---

## 26. Tool Pricing History Tracker

- Admin records pricing changes from tool edit panel
- Each entry: date, old price/plan, new price/plan, pricing model, notes
- Pricing model types: Free · Freemium · Paid · Enterprise · API-based · Credits
- Pricing history shown as **line chart** (date vs price) on tool detail page
- Export pricing history per tool as CSV

---

## 27. Tool Flag & Report System

- Any User can flag a tool
- Flag types: Wrong information · Broken link · Outdated pricing · Duplicate · Inappropriate content · Other
- Flag form: type selection + optional notes (max 500 chars)
- Flags go to Admin review queue: `/admin/flags`
- Admin actions: Resolve · Dismiss · Escalate (marks tool as "needs attention" in tool list)
- `FLAG_RESOLVED` notification sent to the user who submitted the flag
- Multiple unresolved flags on the same tool = "Needs Attention" highlight in Admin tool list

---

## 28. Tool Rating & Review System

- **Rating:** 5-star per tool per user — one rating, editable anytime
- **Review:** optional written text, 20–1000 characters
- **Helpful vote:** thumbs up once per user per review (cannot vote on own review)
- Admin can delete any review from the tool detail page or review management panel
- Aggregate rating shown on tool card and detail page header
- Rating distribution chart (1–5 star breakdown bar chart)
- Sort reviews: Newest · Highest rated · Lowest rated · Most helpful
- Review author shown as: username + role badge (Admin badge if reviewer is Admin)
- Reviews persist even if a tool moves to Graveyard (historical record)

---

## 29. Community Prompts Per Tool

Each tool detail page has a dedicated "Prompts for this Tool" section.

### User Submission
- Route: button on tool detail page → modal form
- Fields: Prompt title (max 100 chars), Prompt text (max 2000 chars), Use case description (max 300 chars)
- Submission goes to Admin review queue: `/admin/prompts`

### Admin Review
- Admin sees: prompt text, submitter username, tool name, submission date
- Actions: Approve · Reject (with reason sent to submitter)
- `PROMPT_STATUS` notification sent to submitter

### Approved Prompts Display
- Shown on tool detail page sorted by: Most Upvoted · Newest
- Each prompt card: title, prompt text, use case, upvote count, submitter username, submission date
- Users upvote prompts (one upvote per prompt per user)
- Admin can pin a "Featured Prompt" per tool (shown at top regardless of votes)

---

## 30. Tool Screenshot Gallery

- Up to **10 screenshots** per tool uploaded by Admin via Cloudinary
- Drag-and-drop reorder in Admin panel
- Screenshot captions set by Admin (optional)
- **Lightbox viewer:** full-screen overlay, keyboard navigation (← →), mobile swipe gestures
- Lazy loading with blur placeholder (next/image)
- Screenshots shown in a horizontal scroll gallery on tool detail page

---

## 31. Similar Tools System

- **Algorithm:** Tag-overlap scoring — `overlapping_tags / total_unique_tags × 100`
- Top 6 similar tools shown at bottom of tool detail page
- Excludes tools in Graveyard or with Archived status
- Admin can manually override and pin specific similar tools per tool
- "You might also like" section on tool detail page — blends similar tools with personalised recommendations for logged-in users

---

## 32. Tool Request & Voting (Community-Driven)

- **Route:** `/tools/requests`
- Users submit tool requests: name, website URL (optional), reason why it should be added (max 300 chars)
- All users can upvote requests — one vote per request per user
- Requests listed sorted by vote count (highest first)
- Admin actions per request: Accept (creates tool entry in submission registry) · Decline (notify requester with reason) · Merge (mark as duplicate of another request)
- Top 5 most-voted requests shown on the explore page as "Most Requested"
- `SUBMISSION_STATUS` notification when Admin acts on a request

---

## 33. Tool Graveyard

- Route: `/graveyard`
- Contains all tools with status: `Deprecated` · `Shutdown` · `Discontinued`
- Tools are **never deleted** — they live here permanently
- Each graveyard entry shows:
  - Tool name, logo, sector, category
  - Original launch date
  - Graveyard date (when it died)
  - Graveyard reason (e.g. "Company shut down", "Acquired and discontinued", "Pivoted to different product")
  - Historical data: reviews, ratings, pricing history, changelogs all preserved and visible
  - "This tool is no longer active as of [date]" banner prominently shown
- Graveyard is searchable and filterable by: sector · year of death · reason type
- **Trust signal:** Users can verify which tools are confirmed dead and since when — no ghost tools in the main directory

---

## 34. Tool of the Week

- Admin sets `is_featured = true` and selects one tool as "Tool of the Week" from `/admin/tools`
- Featured tool gets:
  - Highlighted card on `/dashboard` (prominent widget)
  - Special featured section on `/explore` (hero placement)
  - "Tool of the Week" badge on its tool card globally
- Historical archive: Admin can view all previous "Tool of the Week" picks
- Only one tool can hold "Tool of the Week" status at a time

---

# PART IV — MCP SERVERS SECTION

---

## 35. MCP Servers — Full System

MCP Servers is a **top-level navigation item** — its own dedicated section, not buried in tool tags.

### MCP Server Listing Fields

| Field | Type | Description |
|---|---|---|
| `name` | string | MCP server display name |
| `slug` | string | URL-safe identifier |
| `short_description` | string | Max 160 chars — shown in listing cards |
| `description` | string | Full description |
| `connects_to` | string | What it connects — e.g. "Connects to Notion databases, pages, and blocks" |
| `compatible_models` | string[] | Claude · GPT-4o · Gemini · Llama · etc. |
| `auth_type` | enum | OAuth · API Key · Token · None |
| `pricing` | enum | Free · Paid · Freemium |
| `github_url` | string | GitHub repository link |
| `docs_url` | string | Official documentation URL |
| `developer_name` | string | Developer or organisation name |
| `developer_contact` | string | Contact email or URL |
| `use_case_tags` | string[] | databases · file systems · APIs · productivity · communication · search · code · media · finance · etc. |
| `status` | enum | Active · Deprecated · Experimental |
| `is_verified` | boolean | Admin-verified vs community submitted |
| `related_tool_ids` | UUID[] | Cross-linked AI tools from main directory |
| `github_stars` | integer | Fetched from GitHub API on schedule |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

### MCP Listing Page
- Route: `/mcp`
- Grid of MCP server cards: name, connects_to, compatible models chips, auth type badge, pricing badge, GitHub stars count, Verified/Community badge
- Filter by: use case tag · compatible model · auth type · pricing · status
- Sort: newest · most stars · alphabetical

### MCP Detail Page
- Route: `/mcp/[slug]`
- Full listing details
- **Related AI Tools section** — cross-linked tool cards from main directory (e.g. the Notion MCP server shows the Notion tool card)
- Community reviews and ratings (same system as tools)
- GitHub stars displayed (fetched from GitHub API via BullMQ scheduled job)
- "How to Use" section (Admin or developer-written, rich text)
- Flag/report button

### MCP Developer Submission
- Route: `/submit-mcp`
- Developers submit their own MCP servers via simplified form
- GPT Auto-Tag Agent generates use_case_tags and description suggestions on submission
- Submission enters Admin approval queue: `/admin/mcp`
- `SUBMISSION_STATUS` notification when approved or rejected

### MCP Admin Management
- Route: `/admin/mcp`
- Full CRUD for MCP servers
- Approve/reject community submissions
- Manage related tool cross-links
- Schedule GitHub stars refresh (BullMQ job)

---

# PART V — DEALS SECTION

---

## 36. Deals — Full System

- Route: `/deals`
- Shows all live deals for AI tools in the directory

### Deal Card Fields
| Field | Description |
|---|---|
| Tool name + logo | Linked to tool detail page |
| Normal price | Original pricing |
| Deal price | Discounted price |
| Discount amount | Percentage or flat amount |
| Deal type | Percentage Discount · Lifetime Deal · Free Trial Extended · Credits Bonus |
| Expiry date | With live countdown timer |
| "Get Deal" button | Links to affiliate URL or direct tool URL |

### Deal Statuses
- `active` — live and not yet expired
- `expired` — past expiry date (auto-archived, not deleted — shown in deal history)
- `paused` — Admin temporarily paused

### Admin Deal Management
- Route: `/admin/deals`
- Full CRUD: create, edit, pause, delete deals
- Fields: tool_id (linked to tools table), normal_price, deal_price, deal_type, expiry_date, deal_url, notes, is_active
- Expired deals auto-archived hourly via BullMQ

### Deal Notifications
- Users who bookmarked a tool receive a notification (`TOOL_DEAL_LIVE`) when a deal goes live for that tool
- Active deals shown on tool detail pages as a deal card (only if deal exists and is not expired)

### Dashboard Widget
- "Active Deals" widget on dashboard: shows top 3 live deals with countdown timers
- Links to `/deals` for full listing

---

# PART VI — DISCOVERY & SEARCH

---

## 37. Smart Search System

- Search engine: **Meilisearch Cloud**
- Route: `/search`
- Real-time results as user types — **300ms debounce**
- Unified search covers: AI tools, MCP servers, sectors, categories, prompts

### Searchable Fields (Tools)
`name · short_description · description · tags · sector_name · category_name · search_keywords · use_case · key_features · job_roles · developer_name`

### Search Features
| Feature | Detail |
|---|---|
| Typo tolerance | 1 typo per 6 characters — configurable in Admin |
| Synonym management | Admin adds synonym groups: `/admin/search/synonyms` |
| "Did you mean?" | Shown on zero-result queries |
| Recent searches | Last 10 searches saved per user (localStorage + database) |
| Search analytics | Top queries, zero-result queries — Admin dashboard |

### Filter Panel
- Sector
- Category
- Pricing type (Free / Freemium / Paid / Enterprise / API-based / Credits)
- Tool status (Active / Beta / Archived)
- Rating: minimum star threshold (≥ 3 stars, ≥ 4 stars, ≥ 4.5 stars)
- Job role
- Verified / Community (trust filter)
- API available toggle

### Sort Options
- Relevance (Meilisearch default)
- Newest
- Most rated
- Alphabetical
- Most viewed

### Keyboard Shortcut
- `CMD+F` — focuses search bar from any page
- `CMD+K` — opens Command Palette which includes search

---

## 38. Compare Tools System

- Compare up to **4 tools** side-by-side
- Route: `/compare`
- Tools added via "Compare" toggle on tool card or "Add to Compare" button on tool detail page
- Compare panel persists across page navigation (Zustand state)

### Comparison Table Rows
`pricing · pricing_type · api_available · platform_support · integrations · rating · review_count · health_status · launch_date · last_verified · sector · category · tags · key_features · job_roles · active_deal · developer_name · is_verified`

### Shareable Comparison
- "Share Comparison" button generates a unique link: `/compare/[comparisonId]`
- Comparison link active for **30 days** (stored in `comparisons` table)
- Anyone with the link (who is logged in) can view the saved comparison

### Export
- Export full comparison as PDF — includes all table data + tool logos

### Comparison History
- Last **5 comparisons** saved per user
- Accessible from dashboard widget and `/compare`
- Users can reload a previous comparison into the compare panel

---

## 39. Sectors & Categories System

- **Sector:** Top-level grouping
  - Examples: Writing · Image Generation · Video · Code · Audio · Productivity · Research · Design · Marketing · Data & Analytics · Education · Automation · 3D & AR · Gaming AI · Healthcare AI · Finance AI
- **Category:** Sub-grouping within a sector
  - Example: Writing → Content Writing · Copywriting · Email Writing · Summarisation · Translation

### Admin Management
- Route: `/admin/sectors` and `/admin/categories`
- Full CRUD for both — icon upload (SVG), colour tag, description
- Drag-and-drop reorder in Admin panel (affects display order everywhere)
- Tool count displayed per sector/category on all listing pages

### Explore Pages
- `/explore` — all sectors as a grid of sector cards with tool counts
- `/explore/[sector-slug]` — sector detail page with categories and tool grid
- `/explore/[sector-slug]/[category-slug]` — category detail page with filtered tool grid

---

## 40. Recommendation Engine

- **Algorithm:** Collaborative + content-based hybrid
  - Content signals: bookmarked tools, collections, viewed tools (last 30 days), sectors browsed, positive reviews written
  - Collaborative signals: what similar users (same sector preferences) have saved and rated
- **BullMQ RecommendationWorker** recalculates recommendations for each user daily at 06:00 UTC
- Results cached in `recommendation_cache` table (TTL: 24 hours)
- "Why recommended?" tooltip per card (e.g. "Because you bookmarked Notion tools")
- **New user fallback:** top-rated platform tools this week (no personal data yet)
- Admin can tune engine weights from `/admin/recommendations`

### Surfaces
- Dashboard widget: "Recommended for You" — top 6 personalised tool cards
- Explore page: "Recommended for You" section
- Tool detail page: "You Might Also Like" — blends similar tools + personalised recommendations

---

# PART VII — USER WORKSPACE

---

## 41. Bookmarks System

- Quick-save any tool or MCP server via bookmark icon
- Route: `/bookmarks`
- Filter bookmarks by: sector · category · pricing type
- Sort: newest saved · alphabetical · most recently updated
- Bulk remove: select multiple + remove
- Bookmarks trigger notifications (tool health changes, deals, updates) for bookmarked tools
- Export bookmarks as CSV or JSON from `/settings/export`

---

## 42. Collections System

- Users create named collections — e.g. "My Design Stack", "Productivity Arsenal"
- Route: `/collections` and `/collections/[id]`
- Add tools from: tool card · tool detail · compare page · bookmark page
- Drag-and-drop reorder within collections
- **Public or Private toggle** per collection
- Public collections: accessible via shareable link
- **Collection cover:** auto-generated mosaic from tool logos inside the collection
- Bulk actions within a collection: remove selected tools, export collection
- Max: 20 collections per user, 50 tools per collection (both configurable in Platform Settings)
- Export a collection as: PDF · CSV · JSON · Markdown

---

## 43. Personal Workflow Builder

- Chain up to 10 AI tools into a named workflow — e.g. "My Content Creation Pipeline"
- Route: `/workflows` and `/workflows/[id]`
- Each step: tool selection + usage note (max 200 chars)
- Drag-and-drop step reorder
- Share workflow via public link — receiver can view and clone it
- Export workflow as PDF or Markdown
- Max: 10 workflows per user (configurable)

---

## 44. Daily AI Digest

- **BullMQ DigestWorker** compiles and delivers digest daily at **08:00 UTC**
- Content:
  - New tools added in the last 24 hours
  - Tools updated (changelog published) in the last 24 hours
  - Tool health status changes in the last 24 hours
  - New live deals
  - Platform announcements from the last 24 hours
  - Leaderboard summary (top game scores)
  - Daily AI Curation Agent's suggested tools for Admin review (Admin only)
- Delivered as: dashboard widget (always visible) + optional notification (user-controlled)
- User can disable digest notification in `/settings/notifications`
- Admin can disable digest system-wide from Platform Settings
- Historical digest archive: `/digest` — last 30 days, each day accessible

---

## 45. Daily AI Curation Agent — Tools & Suggestions

A dedicated background AI agent that runs automatically every 24 hours. It is separate from the GPT Auto-Tag Agent and serves a different purpose: **finding, reviewing, and suggesting new AI tools** that should be added to the Hub.

### How It Works

```
Step 1: Research Phase
  → Agent searches the web for newly announced or trending AI tools
  → Sources: Product Hunt (new products), AI newsletters, GitHub trending, Twitter/X AI mentions
  → Collects: tool name, URL, description snippet, source link

Step 2: Validation Phase
  → Checks each found tool against the Hub database (is it already added?)
  → Runs Duplicate Detection Engine on each candidate
  → Filters out: dead links, tools with no clear AI component, tools already in Graveyard

Step 3: Enrichment Phase
  → GPT API enriches each new candidate: fills description, suggests tags, use-case, category, sector, job_roles
  → Generates a confidence score (0–100) for how relevant the tool is

Step 4: Admin Review Queue
  → Sends curated list to Admin review panel: /admin/daily-suggestions
  → Each suggestion shows: tool name, URL, AI-generated description, suggested category/sector, confidence score, source link
  → Admin actions per suggestion: Add to Hub (creates tool draft for final review) · Dismiss · Mark as Already Exists

Step 5: Digest Delivery
  → Summary of suggestions sent to all Admins in their daily digest
  → Admin notification: "Daily AI Agent found [X] new tools to review"
```

### Admin Review Panel
- Route: `/admin/daily-suggestions`
- Full list of today's suggestions with confidence scores
- Batch actions: Accept All · Dismiss All · Review Individually
- Accepted suggestions become Tool Drafts in the tool management system
- Full history: which suggestions were accepted, dismissed, or already existed

### Schedule
- Runs daily at **02:00 UTC** (before the digest at 08:00 UTC — so findings are included in the morning digest)
- Admin can manually trigger a run from `/admin/daily-suggestions`

### BullMQ Worker
- Queue: `curation-queue`
- Worker: `DailyAIcurationWorker`
- Retries: 2 attempts on failure, then alerts all Admins

---

## 46. Platform Activity Feed

- Route: `/activity`
- Real-time feed of platform events relevant to the logged-in user
- Feed events:
  - New tool published to directory
  - Tool you bookmarked was updated or has a new changelog
  - Health status changed on a bookmarked tool
  - New platform announcement
  - New deal live for a bookmarked tool
  - New review on a tool you reviewed (reply context)
  - Tool request you voted on — status changed
  - Your prompt submission was approved
- Filter by event type (multiselect)
- Mute specific event types (preference saved to database)
- Events older than 30 days auto-archived
- Infinite scroll

---

## 47. Personal Usage Analytics

- Route: `/settings/stats`
- Data retention: 12 months rolling

### Charts & Metrics
- Tools viewed: daily / weekly / monthly line chart
- Most visited sectors: bar chart
- Top search queries used: table (last 30 days)
- Bookmarks created over time: line chart
- Collections created: count over time
- Reviews written: count and tools reviewed
- Prompts submitted: count and approval rate
- Flags submitted: count and resolution rate
- Games played: count per game, total sessions
- Export all stats as CSV

---

## 48. Export System

- Route: `/settings/export`
- Export jobs are processed by **BullMQ ExportWorker**
- Download link delivered via `EXPORT_READY` notification when job completes (for large exports)
- Small exports (<1000 rows): synchronous, instant download

### User Exportable Items
| Item | Formats |
|---|---|
| Collections | PDF · CSV · JSON · Markdown |
| Bookmarks | CSV · JSON |
| Comparisons | PDF |
| Workflows | PDF · Markdown · JSON |
| Usage stats | CSV · JSON |
| Activity feed | CSV |

### Admin Exportable Items
| Item | Formats |
|---|---|
| All tools | CSV · JSON |
| All users | CSV |
| Full audit log | CSV |
| Full security log | CSV |
| Tool submissions | CSV |
| Search analytics | CSV |

---

# PART VIII — PLATFORM SYSTEMS

---

## 49. Realtime Notification System

### 9 Notification Types

| Type | Trigger |
|---|---|
| `TOOL_ADDED` | New tool published to directory |
| `TOOL_UPDATED` | Tool you bookmarked has updated changelog or details |
| `TOOL_HEALTH_CHANGE` | Health status changed on a tool you bookmarked |
| `TOOL_DEAL_LIVE` | A deal went live for a tool you bookmarked |
| `SUBMISSION_STATUS` | Your submitted tool or MCP server was approved or rejected |
| `PROMPT_STATUS` | Your submitted prompt was approved or rejected |
| `FLAG_RESOLVED` | Admin resolved a flag you submitted |
| `INVITATION_ACCEPTED` | Someone you invited has joined the Hub |
| `PLATFORM_ANNOUNCEMENT` | New platform-wide announcement from Admin |

### Delivery Architecture
- **BullMQ NotificationWorker:** processes all notifications from `notification-queue`
- **Socket.IO:** pushes real-time badge count updates to all connected clients
- **SSE fallback:** `/api/sse/notifications` — for environments that block WebSocket connections

### Notification UI
- **Notification Drawer:** bell icon in navbar → side panel slides out → last 10 unread with type icon, message, time-ago, and "mark as read" per item
- **Full Notification Page:** `/notifications` — complete history, mark all as read, delete individual, filter by type
- **Unread badge:** count on bell icon, updates in real-time via Socket.IO

### User Preferences
- Per notification type toggle (on/off) in `/settings/notifications`
- User can disable all non-critical notifications globally

---

## 50. Announcement System

- Admin creates announcements from `/admin/announcements`
- Fields: title, body (rich text editor), type (Info · Warning · Critical · Celebration), expiry date
- **Delivery:**
  - Dashboard widget — "Announcements" section
  - Notification drawer — triggers `PLATFORM_ANNOUNCEMENT` notification
  - Optional: full-width banner across all pages
- **Critical type:** persistent banner across all pages until Admin manually dismisses it (even after expiry)
- Announcement history visible to all users at `/announcements`
- Admin analytics: read rate per announcement (how many users opened it)

---

## 51. Maintenance Mode

- Admin toggle: instant or scheduled (date/time picker)
- Route to manage: `/admin/settings`
- **Pre-maintenance banner:** appears X hours before scheduled maintenance (default 2h, configurable in Platform Settings) with countdown timer
- During maintenance: all users redirected to `/maintenance` page — shows message + live countdown to expected restoration
- Admins (all 4 seeded + any promoted Admin) can access the Hub during maintenance
- `PLATFORM_ANNOUNCEMENT` notification sent to all users when maintenance begins
- **Auto-restore:** maintenance mode auto-disables after the scheduled maintenance window ends

---

## 52. User Warning System

- Admin issues warnings from `/admin/users/[username]`
- **3-stage progressive warning:**

| Stage | Action | Effect |
|---|---|---|
| Warning 1 | Notification only | User receives warning notification — no restrictions |
| Warning 2 | Notification + restrictions | Tool submission, review submission, and prompt submission privileges suspended |
| Stage 3 | Account suspended | User cannot log in — redirected to `/suspended` on any access attempt |

- Admin can reverse any warning stage at any time
- All warning actions logged to Audit Log with actor, target, timestamp, and reason
- Users are notified at each stage with the reason

---

## 53. Audit Log System

- Logs every Admin action and significant user action on the platform
- Route: `/admin/audit`

### Logged Events
`tool_create · tool_update · tool_delete · tool_approve · tool_reject · tool_archive · tool_restore · tool_bulk_import · user_invite · user_promote · user_demote · user_suspend · user_delete · user_warning · user_impersonate · role_change · session_terminate · announcement_create · announcement_delete · maintenance_toggle · deal_create · deal_delete · mcp_approve · mcp_reject · prompt_approve · prompt_reject · flag_resolve · backup_trigger · settings_change · feature_flag_toggle · login_success · logout · password_change · invitation_revoke`

### Log Entry Fields
| Field | Description |
|---|---|
| `actor` | Username of the user who performed the action |
| `action_type` | Event type from the list above |
| `target_entity` | What was acted upon (tool name, user username, etc.) |
| `target_entity_type` | `tool` · `user` · `mcp` · `deal` · `setting` · `session` |
| `timestamp` | Full UTC datetime |
| `ip_address` | Actor's IP |
| `user_agent` | Actor's browser/device |
| `before_state` | JSON snapshot of entity before the action |
| `after_state` | JSON snapshot of entity after the action |

### Search & Filter
- Search by: actor username, action type, target entity name, date range
- Filter by: action type group, actor, entity type
- Retention: 12 months (configurable in Platform Settings)
- Export full audit log as CSV from `/admin/audit/export`

---

## 54. Security Log System

A dedicated log focused exclusively on security events — separate from the general Audit Log.

- Route: `/admin/security`

### Logged Security Events
`failed_login · account_lockout · password_change · new_device_login · suspicious_ip_activity · concurrent_session_exceeded · admin_privilege_use · invitation_token_misuse · ip_block_action · forced_logout · brute_force_detected`

### Features
- Real-time alerts: critical security events (lockouts, brute force) push notification to all Admins immediately
- **IP Blocking:** Admin can block specific IPs from the security log panel — blocked IPs receive 403 on all requests
- **IP Unblocking:** Admin can remove blocks from the same panel
- Retention: 24 months
- Export security log as CSV

---

## 55. Manmadhan Movie Section

A simple, dedicated section for the Manmadhan movie.

- Route: `/movie`
- YouTube embed player (responsive 16:9) — centered on page
- Movie info displayed below player: title, synopsis, cast list, director, year, genre, runtime
- Poster image displayed alongside info (Cloudinary)
- "Mark as Watched" button — stored per user in database
- Platform-wide watch count shown (e.g. "Watched by 47 Hub members")
- Offline: poster + synopsis + cast cached via service worker for offline viewing (not the video itself)

### Admin Movie Management
- Route: `/admin/movie`
- Set YouTube video ID
- Edit all metadata (title, synopsis, cast, director, year, genre, runtime)
- Upload poster image (Cloudinary)
- Enable / Disable the movie section platform-wide

---

## 56. Games System — 6 Games

All 6 games are **casual, offline-first, just for fun — no competitive scoring or pressure.**
Games are for time pass. No anti-cheat. No strict leaderboard competition. Simple high-score display only.

### Game 1 — Neural Snake
- Classic snake with AI/neural visual theme
- Canvas API implementation
- Controls: arrow keys (desktop) · swipe (mobile)
- Wrap-around or hard walls (user-selectable per session)
- Speed increases as snake grows
- Fully offline (service worker cached)
- Simple personal best score shown — no leaderboard pressure

### Game 2 — Void Runner
- Endless side-scrolling runner
- 3-lane obstacle dodging with a glowing neural entity as protagonist
- Obstacles: data blocks, firewall barriers, corrupted nodes
- Collectibles: AI tokens (score +), shields
- Speed increases over time
- Fully offline

### Game 3 — Memory Match
- Card matching using AI tool logos and names from the Hub
- Difficulty levels: 8 cards · 16 cards · 24 cards
- Timer shown (no pressure — just context)
- Fun way to learn the tools

### Game 4 — Code Breaker
- Cipher/puzzle game with AI theme
- Decode the scrambled tech messages
- Difficulty levels: Easy · Medium · Hard
- New puzzle generated daily

### Game 5 — Word Scramble
- Unscramble AI and tech terminology from the Hub's own tag/keyword library
- 60-second rounds — just for fun
- Hint system (shows one letter)

### Game 6 — Tool Trivia
- Quiz game based on actual tools in the Hub
- Questions auto-generated from tool data (pricing, key features, developer info)
- 10 multiple-choice questions per round
- Daily challenge question

### Games Hub
- Route: `/games`
- Unified lobby: 6 game cards with personal best and "Play" button
- Admin manages games from `/admin/games` (enable/disable each game, update daily content for Code Breaker and Trivia)
- All games fully offline-capable via service worker
- Offline score queue: scores recorded offline sync to database on reconnect (personal best only)

---

## 57. User Guide System

- Route: `/guide`
- **18 sections** — all content fully offline cached via service worker
- Progress tracking per section — completion checkboxes saved to user database
- Search within guide (client-side, indexed on page load)
- Admin can update all guide content from `/admin/guide` (rich text editor per section)

### 18 Guide Sections
1. Welcome to Manmadhan's Hub
2. Your Account & Password
3. Terms & Conditions
4. Navigating the Hub
5. Discovering AI Tools
6. Understanding Sectors & Categories
7. Smart Search & Filters
8. Comparing Tools
9. Bookmarks & Collections
10. MCP Servers Section
11. Tool Ratings & Reviews
12. Submitting a Tool
13. Submitting Prompts
14. Deals Section
15. Notifications & Preferences
16. Games
17. Manmadhan Movie
18. Settings & Account Management

---

## 58. Admin Impersonation

- Admin can view the Hub **as any specific user** from `/admin/users/[username]`
- "Impersonate" button creates a temporary session scoped to that user's role and data
- Exit impersonation: persistent "Exit Impersonation" banner shown at top of every page
- **Every impersonation action is logged** to Audit Log with:
  - Actor (Admin username)
  - Target (impersonated user username)
  - Session start timestamp
  - Session end timestamp
  - Pages visited during impersonation
- Used to debug user experience issues and verify reported problems

---

# PART IX — FRONTEND & DESIGN

---

## 59. Design System — Cyber Dark Theme

### Primary Color Palette

| Token Name | Hex Value | Usage |
|---|---|---|
| `--color-bg-primary` | `#0A0A0F` | Main page background |
| `--color-bg-secondary` | `#12121A` | Cards, panels, sidebars |
| `--color-bg-tertiary` | `#1E1E2E` | Hover states, elevated surfaces |
| `--color-bg-overlay` | `#0D0D15CC` | Modals, drawers (80% opacity) |
| `--color-accent` | `#8DFB5B` | Primary CTA, highlights, active indicators |
| `--color-accent-dim` | `#8DFB5B22` | Accent backgrounds, subtle tints |
| `--color-accent-hover` | `#A8FC7E` | Accent hover state |
| `--color-text-primary` | `#F0F0F0` | Headings, primary body text |
| `--color-text-secondary` | `#A0A0B0` | Subtext, descriptions, labels |
| `--color-text-muted` | `#55556A` | Placeholders, disabled states |
| `--color-text-inverse` | `#0A0A0F` | Text on accent/green backgrounds |
| `--color-border-default` | `#8DFB5B18` | Default card and container borders |
| `--color-border-strong` | `#8DFB5B40` | Hover borders, focused inputs |
| `--color-border-subtle` | `#FFFFFF0A` | Dividers, faint separators |

### Semantic / Status Colors

| Token Name | Hex Value | Usage |
|---|---|---|
| `--color-success` | `#22C55E` | Success states, badges |
| `--color-success-bg` | `#22C55E15` | Success backgrounds |
| `--color-warning` | `#F59E0B` | Warnings, alerts |
| `--color-warning-bg` | `#F59E0B15` | Warning backgrounds |
| `--color-error` | `#EF4444` | Errors, destructive actions |
| `--color-error-bg` | `#EF444415` | Error backgrounds |
| `--color-info` | `#38BDF8` | Informational |
| `--color-info-bg` | `#38BDF815` | Info backgrounds |

### Glassmorphism Tokens

| Token Name | Value |
|---|---|
| `--glass-bg` | `rgba(18, 18, 26, 0.70)` |
| `--glass-border` | `1px solid rgba(141, 251, 91, 0.12)` |
| `--glass-backdrop` | `blur(12px) saturate(180%)` |
| `--glass-shadow` | `0 8px 32px rgba(0, 0, 0, 0.40)` |

---

## 60. Typography System — Poppins

### Font Import (Next.js)

```js
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})
```

### Font Scale

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `--text-display` | `56px` | `800` | `1.1` | Hero headline, splash title |
| `--text-h1` | `40px` | `700` | `1.15` | Page titles |
| `--text-h2` | `32px` | `700` | `1.2` | Section headings |
| `--text-h3` | `24px` | `600` | `1.3` | Card titles, modal headers |
| `--text-h4` | `20px` | `600` | `1.4` | Sub-section, list headers |
| `--text-lg` | `18px` | `400` | `1.6` | Lead paragraphs |
| `--text-base` | `16px` | `400` | `1.7` | Body text, descriptions |
| `--text-sm` | `14px` | `400` | `1.6` | Labels, captions, helper text |
| `--text-xs` | `12px` | `500` | `1.5` | Badges, tags, timestamps |
| `--text-xxs` | `10px` | `600` | `1.4` | Chip labels, overlines |

### Typography Rules
- Only use weights: `300`, `400`, `500`, `600`, `700`, `800`
- Letter spacing for headings: `-0.02em` on h1 and h2, `-0.01em` on h3
- Letter spacing for overlines/labels: `+0.08em` to `+0.12em` (ALL CAPS small labels)
- Always declare `'Poppins', sans-serif` — no system font fallbacks
- Apply to root: `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`

---

## 61. Spacing & Shape Tokens

```css
--radius-sm:    6px;    /* Chips, tags, small buttons */
--radius-md:    10px;   /* Inputs, standard buttons   */
--radius-lg:    14px;   /* Cards, panels, modals      */
--radius-xl:    20px;   /* Large hero cards           */
--radius-full:  9999px; /* Pills, avatar circles      */

--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-5:   20px;
--space-6:   24px;
--space-8:   32px;
--space-10:  40px;
--space-12:  48px;
--space-16:  64px;
```

---

## 62. Component Styling Rules

### Primary Button
```css
background: var(--color-accent);
color: var(--color-text-inverse);
font-family: 'Poppins', sans-serif;
font-weight: 600;
font-size: 14px;
letter-spacing: 0.01em;
border-radius: var(--radius-md);
padding: 10px 22px;
border: none;
transition: background 0.2s, transform 0.15s;

/* Hover */
background: var(--color-accent-hover);
transform: translateY(-1px);
```

### Outline Button
```css
background: transparent;
border: 1px solid var(--color-border-strong);
color: var(--color-accent);
font-family: 'Poppins', sans-serif;
font-weight: 600;
font-size: 14px;
border-radius: var(--radius-md);
padding: 10px 22px;
```

### Standard Card
```css
background: var(--color-bg-secondary);
border: 0.5px solid var(--color-border-default);
border-radius: var(--radius-lg);
padding: var(--space-6);
transition: border-color 0.2s, transform 0.2s;

/* Hover */
border-color: var(--color-border-strong);
transform: translateY(-2px);
```

### Glass Card
```css
background: var(--glass-bg);
border: var(--glass-border);
border-radius: var(--radius-lg);
backdrop-filter: var(--glass-backdrop);
box-shadow: var(--glass-shadow);
```

### Input / Form Field
```css
background: var(--color-bg-tertiary);
border: 1px solid var(--color-border-subtle);
border-radius: var(--radius-md);
color: var(--color-text-primary);
font-family: 'Poppins', sans-serif;
font-size: 14px;
padding: 10px 14px;

/* Focus */
border-color: var(--color-accent);
outline: none;
box-shadow: 0 0 0 3px var(--color-accent-dim);
```

### Badge / Tag
```css
font-family: 'Poppins', sans-serif;
font-size: 11px;
font-weight: 600;
letter-spacing: 0.06em;
padding: 3px 10px;
border-radius: var(--radius-full);
background: var(--color-accent-dim);
color: var(--color-accent);
border: 1px solid var(--color-border-default);
```

### Navigation
```css
background: rgba(10, 10, 15, 0.85);
backdrop-filter: blur(16px);
border-bottom: 0.5px solid var(--color-border-subtle);

/* Logo */
font-weight: 700;
font-size: 20px;
color: var(--color-accent);
letter-spacing: -0.03em;

/* Nav links */
font-size: 14px;
font-weight: 400;
color: var(--color-text-secondary);
transition: color 0.2s;

/* Active / hover */
color: var(--color-text-primary);
```

---

## 63. Tailwind Config Extension

```js
// tailwind.config.ts
theme: {
  extend: {
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
      sans:    ['Poppins', 'sans-serif'],
    },
    colors: {
      bg: {
        primary:   '#0A0A0F',
        secondary: '#12121A',
        tertiary:  '#1E1E2E',
      },
      accent: {
        DEFAULT: '#8DFB5B',
        hover:   '#A8FC7E',
        dim:     'rgba(141,251,91,0.13)',
      },
      text: {
        primary:   '#F0F0F0',
        secondary: '#A0A0B0',
        muted:     '#55556A',
        inverse:   '#0A0A0F',
      },
      border: {
        default: 'rgba(141,251,91,0.09)',
        strong:  'rgba(141,251,91,0.25)',
        subtle:  'rgba(255,255,255,0.04)',
      },
    },
    borderRadius: {
      sm:   '6px',
      md:   '10px',
      lg:   '14px',
      xl:   '20px',
      full: '9999px',
    },
    fontSize: {
      'display': ['56px', { lineHeight: '1.1',  fontWeight: '800' }],
      'h1':      ['40px', { lineHeight: '1.15', fontWeight: '700' }],
      'h2':      ['32px', { lineHeight: '1.2',  fontWeight: '700' }],
      'h3':      ['24px', { lineHeight: '1.3',  fontWeight: '600' }],
      'h4':      ['20px', { lineHeight: '1.4',  fontWeight: '600' }],
    },
  },
}
```

---

## 64. Light & Dark Mode

- **Default:** Dark mode (Cyber Dark theme as defined above)
- **Light mode:** Full CSS variable swap — white/light-grey backgrounds, deep navy text, same #8DFB5B accent
- Toggle: Sun/Moon icon — always visible in navbar on all viewports
- Persists to `localStorage`, syncs across browser tabs
- System preference detection on first visit (respects `prefers-color-scheme`)
- Smooth transition on toggle: `transition: background 0.3s, color 0.3s` on root

---

## 65. PWA — Progressive Web App

- Service Worker: **Workbox**
- Cache strategy by content type:
  - **Cache-first:** fonts, icons, static assets, game files
  - **Network-first with fallback:** tool directory, search, MCP listing
  - **Cache-only:** games (Neural Snake, Memory Match, Word Scramble), user guide (all 18 sections), movie metadata (poster, synopsis, cast)
- **Background sync:** bookmark and rating submissions while offline are queued and synced on reconnect
- Offline page: `/offline` — shows cached tool list with "You're offline" indicator
- PWA manifest: standalone display, theme colour `#0A0A0F`, platform-specific icons
- Custom Hub-styled install prompt (not browser default popup)
- iOS: illustrated "Tap Share → Add to Home Screen" prompt shown after first successful login
- Android: native Web App Install via manifest
- Install event tracked per user in database

---

# PART X — UI PAGES & COMPONENTS

---

## 65. All UI Pages — Complete List (73 Routes)

### Landing & Public (3)
| Route | Description |
|---|---|
| `/` | Landing page — hero, features, login trigger |
| `/maintenance` | Maintenance page — message + live countdown |
| `/offline` | Offline fallback — cached tool list |

### Error Pages (2)
| Route | Description |
|---|---|
| `/404` | Not found page |
| `/suspended` | Account suspended page |

### Auth & Onboarding (1)
| Route | Description |
|---|---|
| `/onboarding` | Multi-step onboarding (flows inline in modal, then full page post-login) |

### Hub — Tool Directory (7)
| Route | Description |
|---|---|
| `/dashboard` | Main user dashboard — widgets, digest, recommendations |
| `/tools` | Full AI tool directory with grid/list view |
| `/tools/[slug]` | Tool detail page — SSR + ISR |
| `/tools/requests` | Community tool request board |
| `/explore` | Sector grid — all sectors with tool counts |
| `/explore/[sector-slug]` | Sector page — categories + tool grid |
| `/explore/[sector-slug]/[category-slug]` | Category page — filtered tool grid |

### Search & Compare (2)
| Route | Description |
|---|---|
| `/search` | Smart search page — results, filters, sort |
| `/compare` | Compare tools side-by-side (up to 4) |

### MCP Servers (2)
| Route | Description |
|---|---|
| `/mcp` | MCP server directory — listing with filters |
| `/mcp/[slug]` | MCP server detail page |

### Deals (1)
| Route | Description |
|---|---|
| `/deals` | All active deals with countdown timers |

### Collections & Bookmarks (3)
| Route | Description |
|---|---|
| `/bookmarks` | All bookmarked tools and MCP servers |
| `/collections` | All personal collections |
| `/collections/[id]` | Individual collection detail |

### Workflows (1)
| Route | Description |
|---|---|
| `/workflows` | Personal workflow builder |

### Changelog & Graveyard (2)
| Route | Description |
|---|---|
| `/changelog` | Platform-wide tool changelog feed |
| `/graveyard` | Discontinued/dead tools archive |

### Digest & Activity (3)
| Route | Description |
|---|---|
| `/digest` | Daily digest archive — last 30 days |
| `/digest/[date]` | Specific day's digest |
| `/activity` | Personal activity feed |

### Notifications & Announcements (2)
| Route | Description |
|---|---|
| `/notifications` | Full notification history |
| `/announcements` | Platform announcements archive |

### Games (8)
| Route | Description |
|---|---|
| `/games` | Games lobby — all 6 game cards |
| `/games/neural-snake` | Neural Snake game |
| `/games/void-runner` | Void Runner game |
| `/games/memory-match` | Memory Match game |
| `/games/code-breaker` | Code Breaker game |
| `/games/word-scramble` | Word Scramble game |
| `/games/tool-trivia` | Tool Trivia game |
| `/games/[slug]/scores` | Simple personal best scores per game |

### Movie (1)
| Route | Description |
|---|---|
| `/movie` | Manmadhan movie — simple YouTube embed + info |

### Guide (1)
| Route | Description |
|---|---|
| `/guide` | 18-section user guide (offline cached) |

### Submit (2)
| Route | Description |
|---|---|
| `/submit-tool` | User tool submission form |
| `/submit-mcp` | Developer MCP server submission form |

### Profile & Settings (8)
| Route | Description |
|---|---|
| `/profile` | Own public profile |
| `/settings` | Settings hub |
| `/settings/profile` | Profile info edit |
| `/settings/appearance` | Theme, dark/light mode |
| `/settings/notifications` | Notification preferences per type |
| `/settings/sessions` | Active session manager |
| `/settings/security` | Password change, security log |
| `/settings/stats` | Personal usage analytics |
| `/settings/export` | Export all personal data |

### Admin Panel (26)
| Route | Description |
|---|---|
| `/admin` | Admin dashboard — platform overview, stats |
| `/admin/tools` | All tools — list, search, filter |
| `/admin/tools/add` | Manual tool add form |
| `/admin/tools/[id]/edit` | Edit existing tool |
| `/admin/tools/[id]/versions` | Tool version history |
| `/admin/tools/import` | JSON bulk import + built-in editor |
| `/admin/submissions` | User tool submission review queue |
| `/admin/daily-suggestions` | Daily AI Curation Agent suggestions |
| `/admin/flags` | Tool flag/report review queue |
| `/admin/prompts` | Community prompt review queue |
| `/admin/mcp` | MCP server management + submissions |
| `/admin/sectors` | Sector CRUD + reorder |
| `/admin/categories` | Category CRUD + reorder |
| `/admin/deals` | Deals CRUD |
| `/admin/users` | User list — all users |
| `/admin/users/[username]` | Individual user detail + actions |
| `/admin/invitations` | Invitation management + generate |
| `/admin/recommendations` | Recommendation engine settings |
| `/admin/announcements` | Announcement creation + management |
| `/admin/audit` | Audit log viewer |
| `/admin/security` | Security log + IP blocking |
| `/admin/movie` | Movie section management |
| `/admin/games` | Games management |
| `/admin/guide` | User guide content editor |
| `/admin/analytics` | Platform analytics dashboard |
| `/admin/queues` | Bull Board — BullMQ queue monitor |
| `/admin/settings` | Platform settings + system settings + maintenance |

**Total Routes: 73**

---

## 66. Custom UI Components — Complete List

### Navigation Components
| Component | Description |
|---|---|
| `Navbar` | Glassmorphism top nav — logo, nav links, search, bell, avatar dropdown, theme toggle |
| `AdminSidebar` | Left sidebar navigation for all Admin panel routes |
| `CommandPalette` | CMD+K spotlight modal — search tools, navigate pages, admin actions |
| `MobileNavBar` | Bottom tab bar for mobile web (Home · Tools · MCP · Games · Profile) |

### Tool Display Components
| Component | Description |
|---|---|
| `ToolCard` | Logo, name, short desc, sector badge, rating, bookmark btn, compare toggle, Verified/Community badge |
| `ToolGrid` | Responsive grid layout with grid/list toggle |
| `ToolDetailHeader` | Logo, name, badges, action button row |
| `ToolCompareTable` | Side-by-side comparison table — up to 4 columns |
| `ToolHealthBadge` | Animated pulse dot — green/yellow/red |
| `ToolScreenshotGallery` | Horizontal scroll + lightbox (keyboard + swipe) |
| `ToolPricingChart` | Line chart — pricing history over time |
| `ToolChangelogList` | Timeline-style changelog entries |
| `ToolPromptCard` | Prompt text, use case, upvote button, author |
| `ToolDealCard` | Price, discount badge, countdown timer, CTA |
| `ToolSimilarRow` | Horizontal scroll of 6 similar tool cards |
| `GraveyardBanner` | Red banner: "This tool is no longer active as of [date]" |
| `YouTubeTutorialEmbed` | Responsive 16:9 iframe — only renders if URL is set |

### MCP Components
| Component | Description |
|---|---|
| `MCPServerCard` | Name, connects_to, compatible models chips, auth badge, pricing, GitHub stars |
| `MCPRelatedTools` | Cross-linked tool cards on MCP detail page |

### Auth & Onboarding Components
| Component | Description |
|---|---|
| `LoginModal` | Glass modal — Admin 3-step / User 4-step inline flow |
| `PasswordStrengthBar` | Real-time password strength indicator |
| `SlideToConfirm` | Physical slide gesture component for T&C and critical actions |
| `WelcomeScreen` | Cinematic reveal with Framer Motion — particle burst animation |

### Dashboard Components
| Component | Description |
|---|---|
| `DashboardWidget` | Draggable, show/hide-able widget container |
| `DailyDigestWidget` | Today's tool additions and updates |
| `RecommendedWidget` | Personalised "Recommended for You" tool cards |
| `ActiveDealsWidget` | Top 3 live deals with countdown timers |
| `AnnouncementBanner` | Info/warning/critical/celebration variants |
| `MaintenanceBanner` | Pre-maintenance countdown — shown across all pages |
| `CriticalAnnouncementBanner` | Full-width persistent critical announcement bar |

### Collection & Bookmark Components
| Component | Description |
|---|---|
| `CollectionCard` | Cover mosaic from tool logos, name, tool count, public/private badge |
| `CollectionToolGrid` | Tools inside a collection |
| `BookmarkList` | List/grid of bookmarked tools |

### Notification Components
| Component | Description |
|---|---|
| `NotificationDrawer` | Bell-triggered slide-out panel — last 10 unread |
| `NotificationItem` | Type icon, message text, time-ago, read/unread state |

### Form Components
| Component | Description |
|---|---|
| `ToolSubmitForm` | User tool submission — simplified fields |
| `ToolAdminForm` | Full Admin tool add/edit — all fields, logo upload, screenshots |
| `JSONEditorPanel` | Built-in JSON editor with syntax highlighting and error markers |
| `InviteUserModal` | Admin invite — WhatsApp + Telegram template preview |
| `DealCreateForm` | Admin deal creation form |
| `GPTSuggestionReview` | Side-by-side panel — accept/edit/reject each GPT suggestion |

### Game Components
| Component | Description |
|---|---|
| `GameCard` | Name, description, personal best, Play button |
| `GameCanvas` | Shared Canvas API wrapper used by all canvas-based games |
| `PersonalBestDisplay` | Simple "Your best: [score]" display — no competitive pressure |

### Analytics & Chart Components
| Component | Description |
|---|---|
| `ToolHealthHistoryChart` | 30-day health status timeline |
| `UsageStatsCharts` | Personal usage: views, bookmarks, reviews over time |
| `AdminAnalyticsCharts` | Platform-wide: tool count, user count, search volume |
| `SearchAnalyticsTable` | Top queries, zero-result queries |
| `RatingDistributionChart` | 1–5 star bar chart per tool |
| `PricingHistoryChart` | Line chart — date vs pricing |

### General / Shared Components
| Component | Description |
|---|---|
| `StatusBadge` | active/degraded/down/beta/deprecated — coloured dot + label |
| `PricingBadge` | Free/Freemium/Paid/Enterprise/API — coloured pill |
| `JobRoleTags` | Row of job role chips |
| `SectorBadge` | Sector name with sector icon |
| `VerifiedBadge` | Green checkmark — Admin-verified |
| `CommunityBadge` | Outline badge — community submitted |
| `FeaturedBadge` | Star badge — Tool of the Week |
| `ExportButton` | Format selector dropdown + trigger |
| `EmptyState` | Consistent empty state — icon + message + optional CTA |
| `SkeletonCard` | Loading placeholder matching ToolCard dimensions |
| `CountdownTimer` | Live countdown for deals and maintenance |
| `CompareToggle` | Toggle button on tool cards — adds/removes from compare panel |
| `BookmarkButton` | Toggle button — bookmark/unbookmark with animation |
| `ShareButton` | Copy link to clipboard with success feedback |
| `InfiniteScrollWrapper` | Reusable infinite scroll container |

---

# PART XI — TECH STACK

---

## 67. Complete Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15 (App Router) | Full-stack React — SSR, ISR, Edge functions |
| Tailwind CSS | 3.x | Utility-first styling with custom design tokens |
| shadcn/ui | Latest | Accessible, composable base component library |
| Framer Motion | 11.x | Cinematic animations and page transitions |
| React Query | 5.x | Server state management, caching, background refetch |
| Zustand | 4.x | Lightweight global client state |
| React Hook Form | 7.x | Performant form state management |
| Zod | 3.x | Schema validation — shared frontend + backend |
| next-intl | Latest | i18n infrastructure (English at launch, expandable) |
| Recharts | Latest | Charts — health history, pricing, analytics |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20 LTS | Runtime environment |
| Express.js | 4.x | REST API framework |
| TypeScript | 5.x | Type-safe development throughout |
| Zod | 3.x | Request validation middleware |
| Helmet | 7.x | Secure HTTP headers |
| express-rate-limit | Latest | API rate limiting |

### Database & Storage

| Technology | Version | Purpose |
|---|---|---|
| Neon PostgreSQL | Latest | Primary relational database |
| Drizzle ORM | Latest | Type-safe SQL queries + migrations |
| Upstash Redis | Latest | Sessions, caching, rate limiting, queue state |
| Cloudinary | Latest | Logo, screenshot, movie poster upload + CDN |

### Search & Queue

| Technology | Version | Purpose |
|---|---|---|
| Meilisearch Cloud | Latest | Smart search — tools, MCP, categories |
| BullMQ | Latest | Background job queue — 7 workers + 1 curation worker |
| Bull Board | Latest | BullMQ admin UI at `/admin/queues` |

### Realtime

| Technology | Version | Purpose |
|---|---|---|
| Socket.IO | 4.x | Realtime notifications, game score sync |

### AI

| Technology | Version | Purpose |
|---|---|---|
| OpenAI GPT-4o API | Latest | GPT Auto-Tag Agent + Daily AI Curation Agent |

### Auth

| Technology | Version | Purpose |
|---|---|---|
| Auth.js (NextAuth v5) | 5.x | Authentication — credentials + Google OAuth |
| bcrypt | Latest | Password hashing (salt rounds: 12) |
| jsonwebtoken | Latest | JWT signing and verification |

### DevOps & Infrastructure

| Technology | Purpose |
|---|---|
| Turborepo | Monorepo build orchestration |
| Docker Compose | Local development environment |
| Vercel | Next.js frontend hosting |
| Railway | Express.js backend + BullMQ workers |
| GitHub Actions | CI/CD pipeline |

### Observability & Testing

| Technology | Purpose |
|---|---|
| Sentry | Error monitoring — frontend + backend |
| OpenTelemetry | Distributed tracing |
| Grafana | Metrics dashboard |
| Vitest | Unit tests |
| Supertest | API integration tests |
| Playwright | E2E tests |
| k6 | Load and performance tests |
| Workbox | PWA service worker |

---

# PART XII — DATABASE ARCHITECTURE

---

## 68. Database Architecture — 55 Tables

### Core Identity (5)

```sql
-- users
CREATE TABLE users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username          VARCHAR(50) UNIQUE NOT NULL,
  email             VARCHAR(255) UNIQUE NOT NULL,
  password_hash     VARCHAR(255),
  role              VARCHAR(20) NOT NULL DEFAULT 'user', -- 'admin' | 'user'
  is_founder        BOOLEAN DEFAULT FALSE,
  is_cofounder      BOOLEAN DEFAULT FALSE,
  onboarding_step   INTEGER DEFAULT 0,
  onboarding_done   BOOLEAN DEFAULT FALSE,
  terms_accepted_at TIMESTAMP,
  is_suspended      BOOLEAN DEFAULT FALSE,
  warning_level     INTEGER DEFAULT 0, -- 0, 1, 2, 3
  google_id         VARCHAR(255),
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

-- user_sessions
CREATE TABLE user_sessions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash     VARCHAR(255) NOT NULL,
  device_name    VARCHAR(255),
  browser        VARCHAR(100),
  os             VARCHAR(100),
  ip_address     VARCHAR(45),
  location       VARCHAR(255),
  last_active_at TIMESTAMP DEFAULT NOW(),
  created_at     TIMESTAMP DEFAULT NOW()
);

-- refresh_tokens
CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash  VARCHAR(255) NOT NULL,
  expires_at  TIMESTAMP NOT NULL,
  is_revoked  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- invitations
CREATE TABLE invitations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token          UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  invited_email  VARCHAR(255) NOT NULL,
  invited_by     UUID REFERENCES users(id),
  status         VARCHAR(20) DEFAULT 'pending', -- pending | accepted | expired | revoked
  expires_at     TIMESTAMP NOT NULL,
  accepted_at    TIMESTAMP,
  created_at     TIMESTAMP DEFAULT NOW()
);

-- password_history
CREATE TABLE password_history (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);
```

### Tool Core (12)

```sql
-- tools
CREATE TABLE tools (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name               VARCHAR(255) NOT NULL,
  slug               VARCHAR(255) UNIQUE NOT NULL,
  short_description  VARCHAR(200),
  description        TEXT,
  use_case           TEXT,
  key_features       JSONB DEFAULT '[]',
  search_keywords    JSONB DEFAULT '[]',
  website_url        VARCHAR(500),
  logo_url           VARCHAR(500),
  category_id        UUID REFERENCES categories(id),
  sector_id          UUID REFERENCES sectors(id),
  pricing_type       VARCHAR(50),
  pricing_details    TEXT,
  developer_name     VARCHAR(255),
  developer_details  JSONB,
  author             JSONB,
  ai_model_used      VARCHAR(255),
  platform_support   JSONB DEFAULT '[]',
  launch_date        DATE,
  tool_status        VARCHAR(50) DEFAULT 'active',
  is_featured        BOOLEAN DEFAULT FALSE,
  integrations       JSONB DEFAULT '[]',
  api_available      BOOLEAN DEFAULT FALSE,
  rating             DECIMAL(3,2) DEFAULT 0.0,
  tags               JSONB DEFAULT '[]',
  job_roles          JSONB DEFAULT '[]',
  youtube_tutorial_url VARCHAR(500),
  is_verified        BOOLEAN DEFAULT FALSE,
  submission_status  VARCHAR(50) DEFAULT 'approved',
  health_status      VARCHAR(20) DEFAULT 'active',
  is_graveyard       BOOLEAN DEFAULT FALSE,
  graveyard_date     DATE,
  graveyard_reason   TEXT,
  submitted_by       UUID REFERENCES users(id),
  last_verified      TIMESTAMP,
  created_at         TIMESTAMP DEFAULT NOW(),
  updated_at         TIMESTAMP DEFAULT NOW()
);

-- tool_screenshots
-- tool_changelogs
-- tool_versions
-- tool_health_logs
-- tool_pricing_history
-- tool_flags
-- tool_ratings
-- tool_reviews
-- tool_review_votes
-- tool_prompts
-- tool_job_roles (junction)
```

### MCP Servers (3)
`mcp_servers · mcp_server_tags · mcp_tool_links`

### Category (2)
`sectors · categories`

### Search & Tags (3)
`tags · tool_tags · search_analytics`

### Collections & Bookmarks (4)
`collections · collection_tools · bookmarks · comparison_history`

### Tool Requests & Submissions (3)
`tool_requests · tool_request_votes · tool_submissions`

### Tool Import (1)
`tool_import_logs`

### Deals (1)
`tool_deals`

### User Data (7)
`user_activity · user_stats · user_guide_progress · user_preferences · user_shortcuts · user_tool_views · user_workflows`

### Workflow (2)
`workflows · workflow_steps`

### Comparison (2)
`comparisons · comparison_tools`

### Recommendations (1)
`recommendation_cache`

### Notifications (2)
`notifications · notification_preferences`

### Announcements (1)
`announcements`

### Games (2)
`game_sessions · offline_score_queue`

### Movie (1)
`movie_config`

### Platform (7)
`audit_log · security_log · maintenance_schedule · platform_settings · feature_flags · export_jobs · backup_log`

### Digest & Curation (3)
`daily_digests · digest_items · ai_curation_suggestions`

### Blocked IPs (1)
`blocked_ips`

### Billing Ready (2)
`subscriptions (schema only) · invoices (schema only)`

**Total: 55 tables · 35+ indexes · 8 migration files**

### Database Indexing Strategy

```sql
-- Most critical indexes
CREATE INDEX idx_tools_slug ON tools(slug);
CREATE INDEX idx_tools_sector_id ON tools(sector_id);
CREATE INDEX idx_tools_category_id ON tools(category_id);
CREATE INDEX idx_tools_status ON tools(tool_status);
CREATE INDEX idx_tools_is_graveyard ON tools(is_graveyard);
CREATE INDEX idx_tools_is_featured ON tools(is_featured);
CREATE INDEX idx_tools_submission_status ON tools(submission_status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_email ON invitations(invited_email);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_audit_log_actor ON audit_log(actor_id);
CREATE INDEX idx_audit_log_timestamp ON audit_log(created_at);
CREATE INDEX idx_security_log_timestamp ON security_log(created_at);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_collection_tools_collection_id ON collection_tools(collection_id);
CREATE INDEX idx_tool_health_logs_tool_id ON tool_health_logs(tool_id);
CREATE INDEX idx_tool_ratings_tool_id ON tool_ratings(tool_id);
CREATE INDEX idx_tool_reviews_tool_id ON tool_reviews(tool_id);
CREATE INDEX idx_mcp_servers_slug ON mcp_servers(slug);
CREATE INDEX idx_deals_status ON tool_deals(status);
CREATE INDEX idx_deals_expires_at ON tool_deals(expires_at);
```

---

# PART XIII — API ARCHITECTURE

---

## 69. Complete API Architecture — 110+ Endpoints

All routes prefixed with `/api/v1/`

### Auth Routes
```
POST /auth/login
POST /auth/logout
POST /auth/refresh
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/change-password
GET  /auth/session
POST /auth/google
POST /auth/google/callback
```

### User Routes
```
GET    /users
GET    /users/:username
PUT    /users/:username
DELETE /users/:username
POST   /users/:username/suspend
POST   /users/:username/unsuspend
POST   /users/:username/warn
POST   /users/:username/promote
POST   /users/:username/demote
POST   /users/:username/impersonate
DELETE /users/:username/impersonate
GET    /users/:username/sessions
DELETE /users/:username/sessions
DELETE /users/:username/sessions/:sessionId
GET    /users/:username/stats
GET    /users/:username/activity
GET    /users/:username/password-reset
```

### Invitation Routes
```
POST   /invitations
GET    /invitations
DELETE /invitations/:token
POST   /invitations/bulk
POST   /invitations/validate
```

### Tool Routes
```
GET    /tools
POST   /tools
GET    /tools/:slug
PUT    /tools/:id
DELETE /tools/:id
POST   /tools/:id/archive
POST   /tools/:id/restore
POST   /tools/:id/graveyard
POST   /tools/:id/restore-from-graveyard
POST   /tools/:id/health-check
GET    /tools/:id/versions
POST   /tools/:id/rollback
GET    /tools/:id/changelog
POST   /tools/:id/changelog
DELETE /tools/:id/changelog/:entryId
GET    /tools/:id/pricing-history
POST   /tools/:id/pricing-history
GET    /tools/:id/prompts
POST   /tools/:id/prompts
POST   /tools/:id/prompts/:promptId/upvote
GET    /tools/:id/reviews
POST   /tools/:id/reviews
PUT    /tools/:id/reviews/:reviewId
DELETE /tools/:id/reviews/:reviewId
POST   /tools/:id/reviews/:reviewId/helpful
POST   /tools/:id/flag
GET    /tools/:id/similar
GET    /tools/:id/deals
GET    /tools/:id/screenshots
POST   /tools/:id/screenshots
DELETE /tools/:id/screenshots/:screenshotId
PATCH  /tools/:id/screenshots/reorder
POST   /tools/:id/feature
GET    /tools/featured/week
GET    /tools/graveyard
```

### Tool Submission Routes
```
POST /submissions
GET  /submissions
GET  /submissions/:id
PUT  /submissions/:id/approve
PUT  /submissions/:id/reject
PUT  /submissions/:id/needs-info
PUT  /submissions/:id/notes
```

### Tool Import Routes
```
POST /tools/import/validate
POST /tools/import/commit
GET  /tools/import/logs
```

### AI Agent Routes
```
POST /ai/generate-tags
POST /ai/generate-labels
POST /ai/suggest-category
GET  /ai/daily-suggestions
POST /ai/daily-suggestions/:id/accept
POST /ai/daily-suggestions/:id/dismiss
POST /ai/daily-suggestions/run
```

### Sector Routes
```
GET    /sectors
POST   /sectors
GET    /sectors/:id
PUT    /sectors/:id
DELETE /sectors/:id
PATCH  /sectors/reorder
```

### Category Routes
```
GET    /categories
POST   /categories
GET    /categories/:id
PUT    /categories/:id
DELETE /categories/:id
PATCH  /categories/reorder
```

### MCP Routes
```
GET    /mcp
POST   /mcp
GET    /mcp/:slug
PUT    /mcp/:id
DELETE /mcp/:id
POST   /mcp/submit
PUT    /mcp/:id/approve
PUT    /mcp/:id/reject
POST   /mcp/:id/flag
GET    /mcp/:id/reviews
POST   /mcp/:id/reviews
```

### Search Routes
```
GET    /search
GET    /search/suggestions
GET    /search/analytics
POST   /search/synonyms
DELETE /search/synonyms/:id
```

### Compare Routes
```
POST /compare
GET  /compare/:comparisonId
DELETE /compare/:comparisonId
GET  /compare/history
```

### Collection Routes
```
GET    /collections
POST   /collections
GET    /collections/:id
PUT    /collections/:id
DELETE /collections/:id
POST   /collections/:id/tools
DELETE /collections/:id/tools/:toolId
PATCH  /collections/:id/reorder
```

### Bookmark Routes
```
GET    /bookmarks
POST   /bookmarks
DELETE /bookmarks/:toolId
```

### Workflow Routes
```
GET    /workflows
POST   /workflows
GET    /workflows/:id
PUT    /workflows/:id
DELETE /workflows/:id
POST   /workflows/:id/share
PATCH  /workflows/:id/reorder
```

### Deal Routes
```
GET    /deals
POST   /deals
GET    /deals/:id
PUT    /deals/:id
DELETE /deals/:id
POST   /deals/:id/pause
POST   /deals/:id/activate
```

### Prompt Routes
```
GET    /prompts
GET    /prompts/pending
PUT    /prompts/:id/approve
PUT    /prompts/:id/reject
DELETE /prompts/:id
POST   /prompts/:id/upvote
POST   /prompts/:id/pin
```

### Tool Request Routes
```
GET    /tool-requests
POST   /tool-requests
POST   /tool-requests/:id/vote
PUT    /tool-requests/:id/accept
PUT    /tool-requests/:id/decline
PUT    /tool-requests/:id/merge
```

### Notification Routes
```
GET    /notifications
PUT    /notifications/:id/read
DELETE /notifications/:id
PUT    /notifications/read-all
GET    /notifications/preferences
PUT    /notifications/preferences
```

### Audit Routes
```
GET  /audit
GET  /audit/export
```

### Security Routes
```
GET    /security
POST   /security/block-ip
DELETE /security/block-ip/:ip
GET    /security/blocked-ips
```

### Game Routes
```
POST /games/scores
GET  /games/scores/personal/:gameId
POST /games/offline-scores/sync
```

### Movie Routes
```
GET  /movie
PUT  /movie
POST /movie/watched
GET  /movie/watch-count
```

### Digest Routes
```
GET /digest
GET /digest/:date
```

### Recommendation Routes
```
GET  /recommendations
POST /recommendations/refresh
PUT  /recommendations/settings
```

### Analytics Routes
```
GET /analytics/platform
GET /analytics/tools
GET /analytics/users
GET /analytics/search
GET /analytics/games
```

### Settings Routes
```
GET  /settings
PUT  /settings
PUT  /settings/platform
PUT  /settings/maintenance
GET  /settings/queues
POST /settings/backup
GET  /settings/feature-flags
PUT  /settings/feature-flags/:flag
```

### Announcement Routes
```
GET    /announcements
POST   /announcements
PUT    /announcements/:id
DELETE /announcements/:id
POST   /announcements/:id/read
```

### SSE (Server-Sent Events)
```
GET /sse/notifications
```

**Total: 110+ endpoints across 22 route files**

---

## 70. BullMQ Queues & Workers — 8

| Queue | Worker | Schedule | Purpose |
|---|---|---|---|
| `notification-queue` | `NotificationWorker` | On event | Deliver all 9 notification types via Socket.IO |
| `health-queue` | `HealthMonitorWorker` | Every 6 hours | HTTP HEAD check on all active tools |
| `export-queue` | `ExportWorker` | On request | Generate PDF/CSV/JSON/Markdown exports |
| `digest-queue` | `DigestWorker` | Daily 08:00 UTC | Compile and deliver daily digest |
| `email-queue` | `EmailWorker` | On event | Transactional emails (invitations, alerts) |
| `indexing-queue` | `IndexingWorker` | On tool change | Sync tool/MCP changes to Meilisearch |
| `recommendation-queue` | `RecommendationWorker` | Daily 06:00 UTC | Recalculate recommendations per user |
| `curation-queue` | `DailyAICurationWorker` | Daily 02:00 UTC | AI tool research, enrichment, Admin suggestion delivery |

**Bull Board UI:** `/admin/queues` — job status, retry failed jobs, clear queues, view job history
**All workers run on Railway** as a separate background service (not the main Express.js server)
**Dead-letter queue:** failed jobs retry 3× with exponential backoff, then alert all Admins via notification

---

## 71. Middleware Flow

Every incoming API request passes through this middleware chain:

```
Request
  → IP Block Check (reject immediately if IP is in blocked_ips)
  → Helmet (security headers)
  → CORS (whitelist: Vercel frontend domain only)
  → Rate Limiter (100 req/min global, 5 req/min auth routes)
  → Request Logger (OpenTelemetry trace)
  → Body Parser (JSON, max 10mb for import routes)
  → JWT Verification (requireAuth middleware)
  → Role Check (requireAdmin middleware on /admin/* routes)
  → Founder Guard (rejects demotion/suspension of is_founder/is_cofounder)
  → Zod Schema Validation (per-route request body/params validation)
  → Route Handler
  → Response Logger
  → Error Handler (Sentry capture + standardised JSON error response)
```

---

# PART XIV — DEVOPS & INFRASTRUCTURE

---

## 72. Monorepo Folder Architecture

```
manmadhan-hub/
├── apps/
│   ├── web/                              ← Next.js 15 (73 routes)
│   │   ├── app/
│   │   │   ├── (public)/
│   │   │   │   ├── page.tsx              ← / Landing
│   │   │   │   ├── maintenance/
│   │   │   │   └── offline/
│   │   │   ├── (auth)/
│   │   │   │   ├── onboarding/
│   │   │   │   └── suspended/
│   │   │   ├── (hub)/                    ← All logged-in user routes
│   │   │   │   ├── dashboard/
│   │   │   │   ├── tools/
│   │   │   │   │   ├── [slug]/
│   │   │   │   │   └── requests/
│   │   │   │   ├── explore/
│   │   │   │   │   └── [sector-slug]/
│   │   │   │   │       └── [category-slug]/
│   │   │   │   ├── search/
│   │   │   │   ├── compare/
│   │   │   │   ├── mcp/
│   │   │   │   │   └── [slug]/
│   │   │   │   ├── deals/
│   │   │   │   ├── bookmarks/
│   │   │   │   ├── collections/
│   │   │   │   │   └── [id]/
│   │   │   │   ├── workflows/
│   │   │   │   ├── changelog/
│   │   │   │   ├── graveyard/
│   │   │   │   ├── digest/
│   │   │   │   │   └── [date]/
│   │   │   │   ├── activity/
│   │   │   │   ├── notifications/
│   │   │   │   ├── announcements/
│   │   │   │   ├── games/
│   │   │   │   │   ├── neural-snake/
│   │   │   │   │   ├── void-runner/
│   │   │   │   │   ├── memory-match/
│   │   │   │   │   ├── code-breaker/
│   │   │   │   │   ├── word-scramble/
│   │   │   │   │   ├── tool-trivia/
│   │   │   │   │   └── [slug]/scores/
│   │   │   │   ├── movie/
│   │   │   │   ├── guide/
│   │   │   │   ├── submit-tool/
│   │   │   │   ├── submit-mcp/
│   │   │   │   └── profile/
│   │   │   ├── (settings)/
│   │   │   │   └── settings/
│   │   │   │       ├── profile/
│   │   │   │       ├── appearance/
│   │   │   │       ├── notifications/
│   │   │   │       ├── sessions/
│   │   │   │       ├── security/
│   │   │   │       ├── stats/
│   │   │   │       └── export/
│   │   │   ├── (admin)/
│   │   │   │   └── admin/
│   │   │   │       ├── page.tsx          ← Admin dashboard
│   │   │   │       ├── tools/
│   │   │   │       │   ├── add/
│   │   │   │       │   ├── [id]/edit/
│   │   │   │       │   ├── [id]/versions/
│   │   │   │       │   └── import/
│   │   │   │       ├── submissions/
│   │   │   │       ├── daily-suggestions/
│   │   │   │       ├── flags/
│   │   │   │       ├── prompts/
│   │   │   │       ├── mcp/
│   │   │   │       ├── sectors/
│   │   │   │       ├── categories/
│   │   │   │       ├── deals/
│   │   │   │       ├── users/
│   │   │   │       │   └── [username]/
│   │   │   │       ├── invitations/
│   │   │   │       ├── recommendations/
│   │   │   │       ├── announcements/
│   │   │   │       ├── audit/
│   │   │   │       ├── security/
│   │   │   │       ├── movie/
│   │   │   │       ├── games/
│   │   │   │       ├── guide/
│   │   │   │       ├── analytics/
│   │   │   │       ├── queues/
│   │   │   │       └── settings/
│   │   │   └── api/                      ← Next.js API (SSE only)
│   │   │       └── sse/
│   │   │           └── notifications/
│   │   ├── components/
│   │   │   ├── hub/                      ← 40+ custom components
│   │   │   ├── ui/                       ← shadcn/ui components
│   │   │   ├── layouts/
│   │   │   └── games/
│   │   ├── lib/
│   │   ├── hooks/
│   │   └── public/
│   │       ├── manifest.json
│   │       └── sw.js                     ← Workbox service worker
│   │
│   └── api/                              ← Express.js backend
│       ├── src/
│       │   ├── routes/                   ← 22 route files
│       │   │   ├── auth.ts
│       │   │   ├── users.ts
│       │   │   ├── invitations.ts
│       │   │   ├── tools.ts
│       │   │   ├── submissions.ts
│       │   │   ├── import.ts
│       │   │   ├── ai.ts
│       │   │   ├── sectors.ts
│       │   │   ├── categories.ts
│       │   │   ├── mcp.ts
│       │   │   ├── search.ts
│       │   │   ├── compare.ts
│       │   │   ├── collections.ts
│       │   │   ├── bookmarks.ts
│       │   │   ├── workflows.ts
│       │   │   ├── deals.ts
│       │   │   ├── notifications.ts
│       │   │   ├── audit.ts
│       │   │   ├── security.ts
│       │   │   ├── games.ts
│       │   │   ├── movie.ts
│       │   │   ├── digest.ts
│       │   │   ├── recommendations.ts
│       │   │   ├── analytics.ts
│       │   │   ├── announcements.ts
│       │   │   └── settings.ts
│       │   ├── middleware/
│       │   │   ├── requireAuth.ts
│       │   │   ├── requireAdmin.ts
│       │   │   ├── founderGuard.ts
│       │   │   ├── ipBlock.ts
│       │   │   ├── rateLimiter.ts
│       │   │   └── errorHandler.ts
│       │   ├── workers/                  ← 8 BullMQ workers
│       │   │   ├── NotificationWorker.ts
│       │   │   ├── HealthMonitorWorker.ts
│       │   │   ├── ExportWorker.ts
│       │   │   ├── DigestWorker.ts
│       │   │   ├── EmailWorker.ts
│       │   │   ├── IndexingWorker.ts
│       │   │   ├── RecommendationWorker.ts
│       │   │   └── DailyAICurationWorker.ts
│       │   ├── services/
│       │   │   ├── auth.service.ts
│       │   │   ├── tool.service.ts
│       │   │   ├── search.service.ts
│       │   │   ├── meilisearch.service.ts
│       │   │   ├── cloudinary.service.ts
│       │   │   ├── openai.service.ts
│       │   │   ├── duplicate.service.ts
│       │   │   ├── recommendation.service.ts
│       │   │   └── notification.service.ts
│       │   ├── db/
│       │   │   └── schema/               ← Drizzle schema files
│       │   ├── socket/
│       │   │   └── index.ts              ← Socket.IO server setup
│       │   └── utils/
│       ├── seed/
│       │   └── founderadmin.ts           ← Seeds MM1107, SS0778, MK1603, TN813
│       └── tests/
│
├── packages/
│   ├── db/                               ← Drizzle schema + migrations
│   │   ├── schema/
│   │   └── migrations/
│   ├── design-tokens/                    ← All CSS variables + Tailwind config
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── radius.ts
│   │   ├── shadows.ts
│   │   ├── animation.ts
│   │   ├── zIndex.ts
│   │   ├── breakpoints.ts
│   │   ├── icons.ts
│   │   ├── gradients.ts
│   │   ├── blur.ts
│   │   └── transitions.ts
│   ├── games/                            ← Offline-first game implementations
│   │   ├── neural-snake/
│   │   ├── void-runner/
│   │   ├── memory-match/
│   │   ├── code-breaker/
│   │   ├── word-scramble/
│   │   └── tool-trivia/
│   └── shared/                           ← Shared types, Zod schemas, utilities
│       ├── types/
│       ├── schemas/
│       └── utils/
│
├── turbo.json
├── package.json
├── docker-compose.yml
└── .github/
    └── workflows/
        ├── ci.yml
        └── cd.yml
```

---

## 73. DevOps & CI/CD

### Local Development
- Docker Compose spins up all services locally:
  - PostgreSQL (Neon-compatible)
  - Redis
  - Meilisearch
  - Next.js dev server
  - Express.js API dev server
  - BullMQ workers

### CI Pipeline (GitHub Actions — `ci.yml`)
Triggered on every Pull Request:
```
1. Type check (tsc --noEmit)
2. Lint (ESLint)
3. Unit tests (Vitest — all packages)
4. Integration tests (Supertest — all API routes)
5. Build check (turbo build)
6. PR must pass all checks before merge
```

### CD Pipeline (GitHub Actions — `cd.yml`)
Triggered on merge to `main`:
```
1. Run CI checks
2. Run Playwright E2E tests against staging
3. Deploy to Vercel (Next.js frontend)
4. Deploy to Railway (Express.js + BullMQ)
5. Run Drizzle migrations on Neon (production)
6. Smoke tests against production
7. Notify Admin Slack/email on success or failure
```

### Staging Environment
- Separate Vercel deployment (preview branch)
- Separate Railway instance
- Separate Neon database (seeded with mock data)
- Staging URL protected by basic auth (not invitation system)

### Secrets & Environment Variables
All secrets managed via Railway environment variables and Vercel environment variables. Never in code or version control.

Required environment variables:
```
DATABASE_URL
REDIS_URL
MEILISEARCH_URL
MEILISEARCH_API_KEY
OPENAI_API_KEY
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
NEXTAUTH_SECRET
NEXTAUTH_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
JWT_SECRET
SENTRY_DSN
```

---

## 74. Observability Stack

| Tool | Purpose |
|---|---|
| **Sentry** | Error capture and alerting — frontend (Next.js) + backend (Express.js) |
| **OpenTelemetry** | Distributed tracing — all API routes, BullMQ jobs, database queries |
| **Grafana** | Metrics dashboards — request rates, error rates, queue depths, DB query times, cache hit rates |
| **Bull Board** | BullMQ job monitoring at `/admin/queues` |

---

## 75. Security Hardening

| Measure | Implementation |
|---|---|
| HTTP Security Headers | Helmet.js — CSP, HSTS, X-Frame-Options, Referrer-Policy |
| Rate Limiting | express-rate-limit — 100 req/min global, 5 req/min auth, 3 req/min invite |
| CSRF Protection | Double-submit cookie on all state-mutating (POST/PUT/DELETE) endpoints |
| SQL Injection | Drizzle ORM — parameterised queries only, never raw SQL with user input |
| XSS | CSP headers + DOMPurify on all rich text input fields |
| Brute Force | 5 failed logins → 15-min lockout, logged in security log |
| Password Security | bcrypt, salt rounds 12, last 3 passwords blocked from reuse |
| HTTPS | Enforced on all routes — HTTP redirects to HTTPS |
| JWT Security | Short-lived access tokens (15 min) + rotating refresh tokens (7 days) |
| Admin Guard | Middleware rejects non-Admin JWT on all `/admin/*` routes |
| Founder Guard | Database-level + middleware — cannot demote/suspend/delete is_founder or is_cofounder |
| IP Blocking | Admin-managed IP blocklist — checked on every request before auth |
| Session Limit | Max 3 concurrent sessions per user (configurable) |
| Secrets | All secrets in Railway/Vercel environment variables — never in code |

---

## 76. Performance System

| Optimisation | Detail |
|---|---|
| ISR | Tool detail pages: revalidate every 3600s |
| React Query | Stale-while-revalidate for tool lists, 5-min cache TTL |
| Redis Cache | Tool data (30 min TTL), user sessions, recommendations, leaderboards |
| Meilisearch | <50ms search response target |
| Image Optimization | Next.js `<Image>` component, Cloudinary CDN, lazy loading, blur placeholders |
| Code Splitting | Dynamic imports for Admin panel, games, JSON editor, charts |
| Database Indexes | 35+ strategic indexes on all frequently-queried columns |
| Compression | gzip on all Express.js responses |
| Font Loading | `display: swap` — no layout shift on font load |

---

# PART XV — TESTING

---

## 77. Testing Architecture

### Unit Tests — Vitest
- Target: **70%+ coverage** across all packages
- What is tested: services (tool.service, auth.service, duplicate.service, recommendation.service), utilities (slug generator, bcrypt helpers, duplicate detection algorithm, export formatters), Zod schemas (all request validation schemas), BullMQ worker logic (isolated, mocked dependencies)

### Integration Tests — Supertest
- Tests all **110+ API endpoints**
- Uses an in-memory test database (seeded fresh per test suite)
- Tests: auth flows, CRUD operations, validation errors, role-gating (Admin vs User routes), middleware behaviour (rate limiting, IP blocking), pagination, filters

### E2E Tests — Playwright
18 Critical Flows:
1. Admin login (3-step flow)
2. User login (4-step flow including T&C)
3. Forgot password → OTP → reset
4. Admin add tool manually (with GPT suggestion review)
5. Admin JSON bulk import (upload + preview + commit)
6. User submit tool → Admin approve → notification delivered
7. Smart search (keyword + filter + sort)
8. Compare tools (add 4 → table view → export PDF → share link)
9. Bookmark tool → notification on deal live
10. Create collection → add tools → share
11. Submit prompt → Admin approve → shown on tool detail
12. Flag tool → Admin resolve → notification
13. Invite user → user joins → invitation accepted notification
14. Session manager → terminate session
15. Game: play Neural Snake → personal best recorded
16. Admin: graveyard a tool → tool removed from main directory → visible in /graveyard
17. Admin: issue 3-stage warning → user suspended → /suspended page
18. Daily AI Curation Agent: run manually → suggestions appear in /admin/daily-suggestions

### Load Tests — k6
- Target endpoints: `/api/v1/tools` (list), `/api/v1/search`, `/api/v1/notifications`, `/api/v1/compare`
- Target load: 500 concurrent users
- Success criteria: P95 response time < 500ms, error rate < 0.1%

---

# PART XVI — BUILD ORDER

---

## 78. Build Order — 5 Phases (10 Weeks)

### Phase 1 — Foundation (Weeks 1–2)

```
→ Turborepo monorepo setup (npm workspaces)
→ Neon PostgreSQL setup + all 55 tables via Drizzle Kit migrations
→ Express.js backend scaffold + all 22 route files (stubbed)
→ Auth.js (NextAuth v5) — Google OAuth + credentials provider
→ JWT middleware (requireAuth, requireAdmin)
→ Founder guard middleware
→ IP block middleware
→ Rate limiting setup
→ Invitation token system (generate + validate + revoke)
→ Refresh token rotation
→ Seed script: apps/api/seed/founderadmin.ts
    → Seeds MM1107, SS0778, MK1603, TN813
    → Sets is_founder and is_cofounder flags
    → Sets Welcome@123 default password
→ Next.js 15 App Router scaffold (all 73 routes — pages stubbed)
→ Tailwind CSS + shadcn/ui configuration
→ Design tokens package (all 12 token files)
→ Poppins font integration via next/font
→ CSS variables: full Cyber Dark palette
→ Dark/Light mode system with system preference detection
→ LoginModal component (3-step Admin / 4-step User)
→ SlideToConfirm component (T&C)
→ WelcomeScreen component (cinematic reveal)
→ Docker Compose local dev environment
→ GitHub Actions CI pipeline
→ Sentry setup (frontend + backend)
```

### Phase 2 — Core Product (Weeks 3–4)

```
→ Sectors CRUD (Admin panel) + reorder
→ Categories CRUD (Admin panel) + reorder + sector linkage
→ Tool CRUD — Admin manual add form (full schema)
→ Duplicate Detection Engine (fuzzy + URL + slug + description similarity)
→ GPT Auto-Tag Agent service (OpenAI GPT-4o API)
→ GPT Suggestion Review panel (Admin confirm before publish)
→ Cloudinary integration (logo upload + screenshot upload)
→ JSON Bulk Import + Built-in JSON editor (Monaco/CodeMirror)
→ Tool detail page — SSR + ISR + all 18 sections
→ Tool screenshot gallery (lightbox + keyboard + swipe)
→ Tool health monitor (BullMQ HealthMonitorWorker — 6h schedule)
→ Tool version history + rollback
→ Tool changelog tracker
→ Tool pricing history tracker
→ Tool flag & report system
→ Tool rating & review system (with helpful votes)
→ Similar tools engine (tag-overlap scoring)
→ Tool Graveyard section (/graveyard + graveyard banner on detail page)
→ Tool of the Week system
→ Tool embed widget generator
→ Meilisearch integration + tool + MCP indexing
→ BullMQ IndexingWorker (sync changes to Meilisearch)
→ Search page — keyword + filter + sort (all filter options)
→ Explore pages (sector + category hierarchy)
→ MCP Servers section — full CRUD + submission + detail page
→ MCP cross-linking to AI tools
→ Tool card + tool grid components
→ All tool-related UI components
```

### Phase 3 — User Layer (Weeks 5–6)

```
→ Bookmarks system (full CRUD + notifications link)
→ Collections (CRUD + drag reorder + share + export)
→ Workflows (builder + drag reorder + share + export)
→ Tool comparison (up to 4 + table + share link + export PDF)
→ Comparison history per user (last 5)
→ Community prompts per tool (submit + Admin approve + upvote)
→ Tool Request & Voting (/tools/requests)
→ Deals section (Admin CRUD + user view + countdown + notifications)
→ User dashboard (widget system — drag, show/hide, persist to DB)
→ Platform activity feed
→ Announcement system (Admin create + user view + critical banner)
→ Socket.IO server — room management (user rooms, admin room)
→ BullMQ NotificationWorker + all 9 notification types
→ Notification drawer + full notifications page + preferences
→ Command Palette (CMD+K — search, navigate, admin actions)
→ User settings — all 7 tabs (profile, appearance, notifications, sessions, security, stats, export)
→ Active session manager
→ Invitation system (generate + WhatsApp/Telegram template + bulk)
→ User suspension + 3-stage warning system
→ User warning system (3 stages with restriction enforcement)
→ Recommendation engine (BullMQ RecommendationWorker — daily)
→ Daily AI Digest (BullMQ DigestWorker — 08:00 UTC)
→ Personal usage analytics
→ Export system (BullMQ ExportWorker + all formats)
→ Admin impersonation
→ Admin analytics dashboard
→ Admin user management (full CRUD + impersonation)
```

### Phase 4 — Platform Systems (Weeks 7–8)

```
→ Daily AI Curation Agent (BullMQ DailyAICurationWorker — 02:00 UTC)
    → Web research phase
    → Duplicate check integration
    → GPT enrichment phase
    → Admin suggestion review panel (/admin/daily-suggestions)
    → Digest integration (agent summary in morning digest)
→ Manmadhan Movie section (simple YouTube embed + Admin management)
→ Security hardening (Helmet, CSRF, rate limits, DOMPurify)
→ Audit log system — all events, viewer, export
→ Security log system — all security events, IP blocking, export
→ Maintenance mode (instant + scheduled + pre-maintenance banner)
→ Feature flags system
→ Platform settings + system settings
→ Full storage backup system (BullMQ BackupWorker)
→ Bull Board queue monitor at /admin/queues
→ PWA manifest + Workbox service worker
    → Cache strategies per content type
    → Offline page (/offline)
    → Background sync (bookmarks, ratings)
    → iOS install prompt
→ OpenTelemetry + Grafana observability
→ Staging environment setup
```

### Phase 5 — Games, Guide & Production (Weeks 9–10)

```
→ Neural Snake (Canvas API — full implementation, offline cached)
→ Void Runner (Canvas API — full implementation, offline cached)
→ Memory Match (Canvas API — tool logos, offline cached)
→ Code Breaker (daily puzzle — Admin updates content)
→ Word Scramble (Hub terminology — offline cached)
→ Tool Trivia (auto-generated from tool data — Admin updates)
→ Games hub (/games — lobby)
→ Offline score queue (sync on reconnect)
→ User guide (18 sections — rich text — offline cached)
→ Guide progress tracking
→ Admin guide content editor
→ Performance optimisation pass:
    → ISR configuration on all tool pages
    → Redis caching on hot endpoints
    → Lazy loading + blur placeholders everywhere
    → Code splitting for Admin, games, JSON editor
    → Database query optimisation + index verification
→ Full mobile responsive QA — all 73 pages
→ Vitest unit tests (70%+ coverage)
→ Supertest integration tests (all 110+ endpoints)
→ Playwright E2E tests (all 18 critical flows)
→ k6 load tests (500 concurrent users)
→ GitHub Actions CD pipeline
→ Staging deployment + smoke tests
→ Production deployment:
    → Vercel (Next.js frontend)
    → Railway (Express.js API + BullMQ workers — 8 workers)
    → Neon (PostgreSQL — production database)
    → Meilisearch Cloud
    → Upstash Redis
    → Cloudinary
→ Production smoke tests
→ Seed script run on production: npm run seed:founderadmin
→ Platform launch
```

---

## 79. V1.0 Final Status & Platform Numbers

### All Included Systems

| System | Status |
|---|---|
| Founder Admin Seed System (4 accounts) | ✅ Production |
| 2-Tier Role System (Admin · User) | ✅ Production |
| Hybrid Authentication (Credentials + Google OAuth) | ✅ Production |
| Admin 3-Step First Login Flow | ✅ Production |
| User 4-Step First Login Flow (with T&C) | ✅ Production |
| Login Pop-up Modal | ✅ Production |
| JWT + Refresh Token Rotation | ✅ Production |
| Password Management + Forgot Password OTP | ✅ Production |
| Invitation System (WhatsApp + Telegram format) | ✅ Production |
| Active Session Manager | ✅ Production |
| AI Tool Directory System | ✅ Production |
| Tool Management — Admin Manual Add | ✅ Production |
| Tool Management — User Submission + Admin Approval | ✅ Production |
| JSON Bulk Import + Built-in JSON Editor | ✅ Production |
| Duplicate Detection Engine | ✅ Production |
| GPT Auto-Tag Agent (Admin confirms before publish) | ✅ Production |
| Full Tool JSON Schema | ✅ Production |
| Tool Detail Page — 18 sections | ✅ Production |
| Tool Screenshot Gallery | ✅ Production |
| Tool Health Monitor (6-hour BullMQ check) | ✅ Production |
| Tool Version History & Rollback | ✅ Production |
| Tool Changelog Tracker | ✅ Production |
| Tool Pricing History Tracker | ✅ Production |
| Tool Flag & Report System | ✅ Production |
| Tool Rating & Review System | ✅ Production |
| Community Prompts Per Tool | ✅ Production |
| Similar Tools System | ✅ Production |
| Tool Request & Voting | ✅ Production |
| Tool Graveyard (Layer 2 Trust) | ✅ Production |
| Tool of the Week | ✅ Production |
| Job Role Tags Per Tool | ✅ Production |
| YouTube Tutorial Embed (optional per tool) | ✅ Production |
| Verified vs Community Badge System | ✅ Production |
| Sectors & Categories Management | ✅ Production |
| Category Explore System | ✅ Production |
| Smart Search System (Meilisearch) | ✅ Production |
| Compare Tools (up to 4, shareable, export PDF) | ✅ Production |
| MCP Servers Section (first-class) | ✅ Production |
| MCP Developer Submission | ✅ Production |
| Deals Section (countdown, bookmarker notifications) | ✅ Production |
| Bookmarks System | ✅ Production |
| Collections System | ✅ Production |
| Personal Workflow Builder | ✅ Production |
| Recommendation Engine (BullMQ daily) | ✅ Production |
| Daily AI Digest (BullMQ 08:00 UTC) | ✅ Production |
| Daily AI Curation Agent (BullMQ 02:00 UTC) | ✅ Production |
| Platform Activity Feed | ✅ Production |
| Personal Usage Analytics | ✅ Production |
| Export System (PDF/CSV/JSON/Markdown) | ✅ Production |
| Realtime Notification System (9 types) | ✅ Production |
| Socket.IO + SSE Fallback | ✅ Production |
| Announcement System | ✅ Production |
| Maintenance Mode (scheduled + banner) | ✅ Production |
| User Warning System (3-stage) | ✅ Production |
| Audit Log System | ✅ Production |
| Security Log System + IP Blocking | ✅ Production |
| Admin Impersonation | ✅ Production |
| Manmadhan Movie Section (simple) | ✅ Production |
| Game System — 6 Games (casual, fun, offline) | ✅ Production |
| User Guide System (18 sections, offline) | ✅ Production |
| Cyber Dark Design System | ✅ Production |
| Poppins Typography System | ✅ Production |
| Light & Dark Mode | ✅ Production |
| Command Palette (CMD+K) | ✅ Production |
| PWA + Service Worker (Workbox) | ✅ Production |
| Offline Access (tools, guide, games cached) | ✅ Production |
| Security Hardening (Helmet, CSRF, rate limit) | ✅ Production |
| Performance Optimisation (ISR, Redis, lazy loading) | ✅ Production |
| BullMQ 8 Workers | ✅ Production |
| Complete API Architecture (110+ endpoints) | ✅ Production |
| Monorepo Architecture (Turborepo) | ✅ Production |
| CI/CD Pipeline (GitHub Actions) | ✅ Production |
| Observability (Sentry + OpenTelemetry + Grafana) | ✅ Production |
| Testing Architecture (Vitest + Supertest + Playwright + k6) | ✅ Production |
| Scalability Architecture | ✅ Production |
| Billing System (schema-only, V2-ready) | ✅ Architected |

### Final Platform Numbers

| Metric | Count |
|---|---|
| Core Systems | 80 |
| Database Tables | 55 |
| Database Indexes | 35+ |
| Database Migration Files | 8 |
| API Endpoints | 110+ |
| Express.js Route Files | 22 |
| BullMQ Queues / Workers | 8 |
| Next.js App Routes | 73 |
| Custom UI Components | 40+ |
| Games | 6 |
| User Manual Sections | 18 |
| Notification Types | 9 |
| Admin Onboarding Steps | 3 |
| User Onboarding Steps | 4 |
| Build Phases | 5 |
| Build Weeks | 10 |
| E2E Test Flows | 18 |
| Seeded Admin Accounts | 4 |
| Role Tiers | 2 (Admin · User) |
| Design Token Files | 12 |
| Tool Schema Fields | 35+ |
| Sectors (default) | 16+ |
| MCP Server Fields | 14 |
| Chatbot | ❌ None |
| Mobile App | ❌ None (PWA covers mobile) |
| AI in V1 | GPT Auto-Tag Agent + Daily AI Curation Agent only |

---

## Final Platform Identity

```
╔══════════════════════════════════════════════════════════════════════╗
║                   MANMADHAN'S HUB — V1.0                            ║
║                                                                      ║
║   🌌  A private AI tool discovery universe                           ║
║   🔐  Invitation-only — zero public access                           ║
║   🚀  Centralized AI tool directory — verified & community           ║
║   🧠  Smart search · Compare · Recommend · Curate                   ║
║   🤖  GPT Auto-Tag Agent + Daily AI Curation Agent                  ║
║   🪦  Tool Graveyard — no ghost tools, full trust                    ║
║   🔌  MCP Servers — first-class, cross-linked                       ║
║   💸  Deals — live countdowns, bookmarker alerts                     ║
║   🎮  6 casual games — just for fun                                  ║
║   🎬  Manmadhan Movie — simple, clean                                ║
║   📖  18-section self-contained user guide — offline cached          ║
║   📶  PWA — offline-first, installable                               ║
║                                                                      ║
║   Repository    : manmadhan-hub                                      ║
║   Seed command  : npm run seed:founderadmin                          ║
║   Founder       : MM1107  ·  hemanthmm1107@gmail.com                ║
║   Co-Founder    : SS0778  ·  shriramss0778@gmail.com                ║
║   Co-Founder    : MK1603  ·  saikrishnanmk1603@gmail.com            ║
║   Co-Founder    : TN813   ·  TN813@gmail.com                        ║
║   Default pwd   : Welcome@123 (forced change on first login)         ║
║   Role system   : 2-Tier — Admin · User                             ║
║   Chatbot       : None                                               ║
║   Mobile App    : None (PWA covers mobile web)                       ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

*Manmadhan's Hub V1.0 — Complete Final Production Architecture & Specification*
*All Systems Defined — Build-Ready — Zero Details Missing*
*Founder: Hemanth Manmadhan (MM1107) · Co-Founders: SS0778 · MK1603 · TN813*
*Repository: manmadhan-hub · Classification: Private*
