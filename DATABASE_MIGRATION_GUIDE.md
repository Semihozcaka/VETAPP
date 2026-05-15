# 🗄️ Database Migration Guide

**Status**: Ready to execute  
**Migration File**: `backend/supabase/migrations/001_initial_schema.sql`  
**Tables**: 11 (with indexes, triggers, RLS policies)

---

## 📋 Pre-Migration Checklist

- [ ] Supabase Project ID: `vmsuvhmxqvqzjvmvaryr`
- [ ] You are logged into Supabase Dashboard
- [ ] You have SQL Editor access
- [ ] Backup: Know how to drop/recreate if needed

---

## 🔧 Migration Steps

### Step 1: Open Supabase SQL Editor

1. Go: https://app.supabase.com
2. Select project: `vmsuvhmxqvqzjvmvaryr`
3. Sidebar → SQL Editor
4. Click: New Query

---

### Step 2: Copy Migration SQL

**File**: `backend/supabase/migrations/001_initial_schema.sql`

Content includes:
- 11 table definitions (clinics, members, owners, pets, appointments, etc.)
- Foreign key relationships
- Indexes for performance
- Row-Level Security (RLS) policies (30+)
- Triggers for auto-updating timestamps (11)

---

### Step 3: Paste & Execute

1. Copy entire SQL file content
2. Paste into Supabase SQL Editor
3. Click: "Run" button (or Cmd+Enter)
4. Wait: 5-10 seconds for execution

---

### Step 4: Verify Tables Created

**Method 1: Table Editor**
- Sidebar → Table Editor
- Should show 11 new tables:
  - ✅ clinics
  - ✅ clinic_members
  - ✅ clinic_member_invites
  - ✅ pet_owners
  - ✅ pets
  - ✅ pet_health_records
  - ✅ appointments
  - ✅ appointment_slots
  - ✅ veterinarians
  - ✅ appointment_reminders
  - ✅ audit_logs
  - ✅ profiles

**Method 2: SQL Query**
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

---

## 🚨 Troubleshooting

### Error: "relation already exists"

**Meaning**: Table already created  
**Solution**: Drop tables first
```sql
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.appointment_reminders CASCADE;
-- ... (drop all 11)
DROP TABLE IF EXISTS public.profiles CASCADE;
```

Then run migration again.

### Error: "permission denied"

**Meaning**: RLS policy blocking insert  
**Solution**: Temporarily disable RLS, run migration, re-enable
```sql
ALTER TABLE public.clinics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
-- ... (disable all)

-- After migration:
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ... (enable all)
```

### Error: "function update_updated_at_column() already exists"

**Solution**: Drop and recreate
```sql
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
```

Then run migration again.

---

## 📊 Post-Migration Validation

### Check Tables Exist

```sql
SELECT COUNT(*) as table_count FROM information_schema.tables
WHERE table_schema = 'public' AND table_name NOT IN ('pg_catalog', 'information_schema');
```

Expected: **12** (11 app tables + system tables)

### Check Triggers

```sql
SELECT trigger_name, table_name FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY table_name;
```

Expected: **11 triggers** (one per table for updated_at)

### Check RLS Policies

```sql
SELECT schemaname, tablename, policyname FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

Expected: **30+ policies** across tables

### Check Indexes

```sql
SELECT schemaname, tablename, indexname FROM pg_indexes
WHERE schemaname = 'public' AND tablename NOT LIKE 'pg_%'
ORDER BY tablename;
```

Expected: **Multiple indexes** for foreign keys and search optimization

---

## 🌱 Next: Seed Data

**File**: `backend/supabase/seed.sql`

After migration completes, optionally load test data:

1. New Query in SQL Editor
2. Copy `backend/supabase/seed.sql`
3. Paste & Run
4. Verify data:
   ```sql
   SELECT * FROM public.clinics;
   SELECT * FROM public.profiles;
   -- etc.
   ```

---

## 🔄 Rollback (if needed)

```sql
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.appointment_reminders CASCADE;
DROP TABLE IF EXISTS public.appointment_slots CASCADE;
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.veterinarians CASCADE;
DROP TABLE IF EXISTS public.pet_health_records CASCADE;
DROP TABLE IF EXISTS public.pets CASCADE;
DROP TABLE IF EXISTS public.pet_owners CASCADE;
DROP TABLE IF EXISTS public.clinic_member_invites CASCADE;
DROP TABLE IF EXISTS public.clinic_members CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.clinics CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
```

---

## ✅ Success Criteria

- [ ] All 11 tables created (check Table Editor)
- [ ] 11 updated_at triggers working
- [ ] 30+ RLS policies active
- [ ] Indexes created for performance
- [ ] No errors in SQL execution
- [ ] Can query tables from Next.js app

---

## 📝 Notes

**RLS Policies**: Tables have RLS enabled so:
- Need authenticated user
- Clinic_admin only sees own clinic
- Pet_owner only sees own pets/appointments
- Super_admin sees everything

**Triggers**: Auto-update `updated_at` timestamp on every row change (no manual updates needed)

**Foreign Keys**: Enforce referential integrity (can't delete clinic while members exist)

---

**Last Updated**: 15 Mayıs 2026  
**Ready**: Yes ✅
