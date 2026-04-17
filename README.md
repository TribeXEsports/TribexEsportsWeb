# ⚔️ Tribex eSports: Official Platform Repository

Welcome to the core codebase of **Tribex eSports** — a high-performance tournament management and community platform designed for the next generation of competitive gaming.

---

## 🚀 Key Features

### 🏆 Tournament Powerhouse
- **Dynamic Bracketing**: Automated generation of tournament brackets and lobbies.
- **Real-time Slotting**: Intelligent participant slotting with auto-verification logic.
- **Universal Registration**: One-click registration flow with support for BGMI, Free Fire, and Valorant logic.
- **Unified Hubs**: Live match hubs with real-time room credentials and observer integration.

### 🛡️ Secure Administration
- **Global Settings Control**: Manage branding, Hero visuals, and infrastructure (Cloudinary/Gateways) on the fly.
- **System Snapshot (Backup)**: Instant data exports in JSON format for auditing and disaster recovery.
- **News Dispatch**: Full-featured CMS for publishing announcements and community alerts.
- **Stress Testing Hub**: Integrated simulator to validate platform stability under heavy concurrency.

### 👥 Community & Professionalism
- **Pro Roster**: Dedicated showcase for professional athletes and team statistics.
- **Campus Ambassadors**: Managed network of student representatives.
- **Player Dashboard**: Comprehensive analytics, match history, and account customization.

---

## 🛠️ Technology Stack

| Layer | Component |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Logic** | [React 19](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/) |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Prisma ORM](https://www.prisma.io/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/) |
| **Auth** | [NextAuth.js](https://next-auth.js.org/) |
| **Media** | [Cloudinary](https://cloudinary.com/) |
| **Payments** | [Razorpay](https://razorpay.com/) & [Cashfree](https://www.cashfree.com/) |

---

## 📥 Getting Started

### 1. Prerequisites
- Node.js 20+ installed
- A running MongoDB instance

### 2. Environment Configuration
Create a `.env` file in the root directory and populate it:
```env
DATABASE_URL="your_mongodb_url"
NEXTAUTH_SECRET="your_secret"
NEXTAUTH_URL="http://localhost:3000"

# Media Management (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="..."

# Payments
RAZORPAY_KEY_ID="..."
CASHFREE_APP_ID="..."
```

### 3. Installation
```bash
# Install dependencies
npm install

# Push database schema
npx prisma db push

# Launch development server
npm run dev
```

### 4. Admin Setup
To promote yourself to an administrator, use the provided tool:
```bash
npx tsx scripts/promote-admin.ts
```

---

## ⚖️ License
This project is private and proprietary. All rights reserved.

---
*Built with precision for the digital arena.*
