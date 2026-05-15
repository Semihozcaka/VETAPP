# 🚀 Supabase Deployment Guide

**Status**: ✅ **READY FOR LOCAL DEVELOPMENT**

---

## ✅ Completion Checklist

- [x] Supabase project created (`vmsuvhmxqvqzjvmvaryr`)
- [x] Project credentials configured
- [x] `.env.example` updated with real credentials
- [x] `.env.local` created (gitignored)
- [x] Connection test component added
- [x] Next.js 14 compatibility fixed
- [x] TypeScript types generated
- [x] Dev server starts successfully
- [x] npm dependencies installed
- [x] Code pushed to GitHub

---

## 🔧 Supabase Credentials

```
Project ID:         vmsuvhmxqvqzjvmvaryr
URL:                https://vmsuvhmxqvqzjvmvaryr.supabase.co
Publishable Key:    sb_publishable_5wpBfskIDpMAzI7r_no_Ow_IPH9O65q
```

**⚠️ IMPORTANT**: Only the publishable anon key is in `.env.local`. Service role key must be kept secure and never committed.

---

## 📋 Next Steps (Database Setup)

### 1. Apply Database Migration

```bash
# Navigate to Supabase project dashboard
# Go to: https://app.supabase.com/project/vmsuvhmxqvqzjvmvaryr/sql/new

# Copy & paste entire SQL from: backend/supabase/migrations/001_initial_schema.sql
# This includes:
# - 11 database tables
# - Enum types
# - Indexes
# - RLS policies
# - Trigger functions for updated_at
```

### 2. Load Seed Data (Optional)

```bash
# Run seed data for testing
# Copy & paste from: backend/supabase/seed.sql
# This creates test users and data

# Test Credentials:
# Email: super_admin@test.com | Password: (check seed.sql)
# Email: clinic_admin@test.com | Password: (check seed.sql)
# Email: pet_owner@test.com | Password: (check seed.sql)
```

### 3. Verify RLS Policies

```bash
# In Supabase Dashboard → Authentication → Policies
# You should see 30+ RLS policies across tables
# Each table should have:
# - SELECT policies for role-based access
# - INSERT policies with clinic_id validation
# - UPDATE/DELETE policies for ownership verification
```

---

## 🌐 Local Development

### Start Development Server

```bash
cd web/nextjs
npm run dev
```

**Output:**
```
✓ Ready in 260ms
- Local: http://localhost:3000
- Network: http://192.168.1.197:3000
```

### Test Login Page

```bash
# Visit: http://localhost:3000/login
# Should see:
# - VetApp Giriş (Login header)
# - Supabase connection status indicator
# - Email/Password form
# - Role-based redirect after login
```

### Type Checking

```bash
npm run type-check
# TypeScript compilation check (strict mode)
```

---

## 📁 Project Structure

```
web/nextjs/
├── .env.example          ← Template with real credentials
├── .env.local            ← Local secrets (gitignored)
├── src/
│   ├── app/
│   │   ├── layout.tsx    ✅ Server component with metadata
│   │   ├── page.tsx      ← Home redirect by role
│   │   ├── (auth)/login/page.tsx ✅ Connection test integrated
│   │   ├── (clinic)/clinic/dashboard
│   │   ├── (super-admin)/super-admin/clinics
│   │   └── middleware.ts ← Auth routing
│   └── lib/
│       ├── supabase/
│       │   ├── client.ts ← Client-side setup
│       │   ├── server.ts ← SSR setup
│       │   ├── database.types.ts ← Auto-generated types
│       │   ├── types.ts ← Re-exports & enums
│       │   └── connection-test.ts ← Connectivity check
│       ├── auth/redirect.ts ← Role guards
│       └── constants/roles.ts ← ROLE_ROUTES
```

---

## 🔒 Security Checklist

- [x] `.env.local` in `.gitignore`
- [x] Publishable key only in frontend
- [x] Service role key never committed
- [x] Database passwords protected
- [x] RLS policies enforcing access control
- [ ] HTTPS enabled (production only)
- [ ] Rate limiting configured (coming soon)
- [ ] API authentication (coming soon)

---

## 🐛 Troubleshooting

### "Supabase connection failed"

**Solution**: 
```bash
# Check .env.local exists and has correct values
cat web/nextjs/.env.local

# Expected output:
# NEXT_PUBLIC_SUPABASE_URL=https://vmsuvhmxqvqzjvmvaryr.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

### "Migration failed"

**Solution**:
1. Go to Supabase Dashboard SQL Editor
2. Check for syntax errors in migration file
3. Verify all tables created: `SELECT * FROM profiles;`
4. Check RLS policies: Check "Policies" tab

### "TypeScript errors"

**Solution**:
```bash
# Run with fresh modules
rm -rf node_modules package-lock.json
npm install
npm run type-check
```

---

## 📝 Environment Variables

### `.env.local` (Local Development)

```env
# Frontend - Public keys (safe to expose)
NEXT_PUBLIC_SUPABASE_URL=https://vmsuvhmxqvqzjvmvaryr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_5wpBfskIDpMAzI7r_no_Ow_IPH9O65q

# Note: Never add SUPABASE_SERVICE_ROLE_KEY here
```

### `.env.production` (Future - Vercel)

```env
NEXT_PUBLIC_SUPABASE_URL=https://vmsuvhmxqvqzjvmvaryr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_5wpBfskIDpMAzI7r_no_Ow_IPH9O65q
```

---

## 🚢 Deployment (Vercel)

### Coming Soon

```bash
# 1. Connect GitHub repository to Vercel
# 2. Vercel automatically detects Next.js
# 3. Set environment variables in Vercel dashboard
# 4. Deploy: vercel deploy
```

---

## 📊 Connection Status

### Real-Time Test

```bash
# Open login page console (browser DevTools)
# Should log:
# ✅ Supabase bağlantısı başarılı!
# ✅ Database bağlantısı başarılı!
```

---

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Project Repo**: https://github.com/Semihozcaka/VETAPP

---

**Last Updated**: 15 Mayıs 2026
**Status**: ✅ Ready for Next Phase (UI Components)
