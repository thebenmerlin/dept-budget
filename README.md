
# Smart Department Budget Management System

A production-grade Next.js 14 application for managing college department budgets, expenses, and analytics.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Neon) via Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: TailwindCSS
- **Storage**: Cloudinary
- **Charts**: Recharts

## Setup

1. **Environment Variables**
   Copy `.env.example` to `.env` and fill in:
   ```bash
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   CLOUDINARY_CLOUD_NAME="..."
   CLOUDINARY_API_KEY="..."
   CLOUDINARY_API_SECRET="..."
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Migration**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Seed Data**
   ```bash
   node scripts/seed.ts
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## Credentials (Seed Data)
- **Admin**: `admin@college.edu` / `password123`
- **HOD**: `hod@college.edu` / `password123`
- **Staff**: `staff@college.edu` / `password123`

## Features
- Role-based Access Control (Admin/HOD/Staff)
- Receipt Uploads (PDF/Image)
- Real-time Budget Analytics
- Expense Approval Workflow
