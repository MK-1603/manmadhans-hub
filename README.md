# Manmadhan’s Hub — Futuristic AI Discovery Platform

A sleek, high-performance, and futuristic AI ecosystem engineered for creators, developers, and intelligent teams to discover, automate, organize, and orchestrate next-generation AI workflows. Built as a monorepo, it pairs a high-density, cyberpunk-styled dashboard portal with a robust Express-based API backend and localized AI search services.

---

## 🔒 Usage & Licensing Restriction

> [!IMPORTANT]
> **STRICT CLONING RESTRICTION**  
> Cloning, duplicating, replicating, mirroring, or redistribution of this website's source code, layout, assets, stylesheets, or proprietary RAG algorithms is strictly prohibited. This platform is proprietary intellectual property. No authorization is granted to create public clones or copies of this repository.

> [!NOTE]
> This documentation contains no user details, personal credentials, email addresses, database passwords, or private hostnames. All environment settings and configurations are generalized.

---

## 🚀 Key Features

Manmadhan's Hub is packed with high-fidelity, real-time panels and features:

### 1. Mission Control & Telemetry Dashboard
*   **Real-Time Stat Trackers**: Displays telemetry metrics including Total Registered Users/Active Nodes, AI Index Tools Count, Mapped Sectors, and Security Protocols/Firewall Risks.
*   **Neural Growth Matrix**: Interactive, animated SVG charts visualizing real-time query load and telemetry updates.
*   **Live Console Log Stream**: Chronological system logs powered by WebSockets (`Socket.io`) which push updates instantly across active operator dashboards without browser reloads.
*   **Node System Telemetry**: Monitors current server cluster load, database connection pool levels, and connection speeds.

### 2. High-Performance RAG AI Discovery
*   **Localized Vector Space Model**: An offline-resilient, localized vector indexing system for high-performance searches, completely free of third-party cloud API dependencies.
*   **Stop-Words Filtering & Tokenization**: Sanitizes natural language inputs by filtering out common stop-words (`the`, `is`, `a`) to focus on key semantic terms.
*   **Double-Weight Relevance Rule**: Specifically weights terms matching titles twice as highly to ensure exact matches bubble to the top of search rankings.
*   **Cosine Similarity Spatial Projection**: Computes relevance scores by measuring the angle between query and document vectors. The search engine resolves queries across 1,031+ documents in under **12 milliseconds**.

### 3. Tool Analysis & Comparisons
*   **Side-by-Side Comparison Matrix**: Allows operators to select multiple AI tools using checkboxes to render a feature comparison table details such as pricing structures, target sectors, official URLs, ratings, and active integrations.
*   **Collections Registry**: Save custom tool configurations directly to folder registries inside the personal user workspace.

### 4. Enterprise-Grade Security & Governance
*   **Audit Logging**: Detailed chronological logs tracking all operations, modifications, and updates made to the platform.
*   **Security Console**: Multi-factor authentication checks, firewall configuration states, and authorization audits.
*   **Backup & Recovery**: Allows admins to trigger instant database snapshots, backup states, and recovery protocols.

### 5. Multi-Tier Identity & Workspace Management
*   **Role-Based Access Control**: Handles granular permissions for Super-Admins, Operators, and standard Workspace Users.
*   **Node Invitation Center**: Generates secure invite keys to onboard new operators.

### 6. ClaudeCode-Inspired Operations Console
*   **Interactive Shell Simulator**: An interactive terminal UI component inside the platform to simulate commands like RAG database retraining and seeding.
*   **Developer CLI Clipboard**: Quick access commands for administrators to run and manage monorepo nodes.

---

## 💻 Tech Stack

### Frontend Architecture
*   **Core**: Next.js (TypeScript) & React (React 19)
*   **Styling**: TailwindCSS (v4) & CSS Variables
*   **Animations**: Framer Motion for high-fidelity micro-interactions
*   **Real-Time Data**: Socket.io client integration
*   **Icons**: Lucide React

### Backend Infrastructure
*   **Framework**: Node.js & Express (TypeScript execution via `tsx`)
*   **Database Client**: `pg` (PostgreSQL Client Pool)
*   **Real-Time Sync**: Socket.io Server
*   **Security & Encryption**: JSON Web Tokens (JWT) & Bcrypt hashing

---

## 🛠️ How to Use Properly

This section covers general guidelines on how to navigate the platform features effectively.

### Navigating the Workspace
1.  **Sign In**: Authenticate using your security credentials to unlock the dashboard. The application will route you based on your access tier (Super-Admin dashboard, Operator view, or User workspace).
2.  **Dashboard Overview**: View live stats. The activity feed on the right updates instantly when actions occur across the network.

### Searching & Filtering AI Tools
1.  Go to the **Search AI Tools** section.
2.  Input queries in natural language (e.g., *"best developer tools"* or *"image generation"*).
3.  The local semantic search engine projects your query and sorts tools based on relevance scores.
4.  Optionally filter results by selecting specific intelligence sectors or pricing tiers.

### Comparing Tools Side-by-Side
1.  On the search results grid, check the checkbox located on the upper-right corner of the tools you want to evaluate.
2.  Click the floating comparison badge or the **Compare Selected** button.
3.  Review the compiled matrix detailing features, pricing, and ratings side-by-side.

### Organizing Custom Collections
1.  Click **Add to Collection** on any tool card.
2.  Select an existing workspace folder or create a new collection category (e.g., *"Design Assets"*, *"Code Assistants"*).
3.  Manage these collections anytime under the **My Registry** or **Saved Tools** sections on your dashboard.

### Admin & Security Protocols (For Authorized Operators)
*   **Inviting Operators**: Authorized admins can visit the **Invitation Center** to generate workspace onboarding tokens.
*   **Audit Trail**: Check the **Audit Log** or **Security Log** sections to verify operations history and review system logins.
*   **System Status**: View the **Analytics** panel to verify system health telemetry (database pool logs, active websocket counts, and API response rates).
