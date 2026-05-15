# 🔐 Creating Auth Users Guide

**Status**: Ready to create test users  
**Platform**: Supabase Authentication

---

## 📋 Pre-Steps

1. Database migration completed? (Check DATABASE_MIGRATION_GUIDE.md)
2. Profiles table exists? (Run: `SELECT * FROM profiles LIMIT 1`)
3. Supabase Dashboard open? (https://app.supabase.com)

---

## 🧑 Test User Accounts

Create 3 test accounts for role-based testing:

| Email | Password | Role | Expected Redirect |
|-------|----------|------|-------------------|
| `superadmin@vetapp.com` | any123! | super_admin | `/super-admin/clinics` |
| `admin1@clinic1.com` | any123! | clinic_admin | `/clinic/dashboard` |
| `owner1@example.com` | any123! | pet_owner | `/pet-owner/dashboard` |

---

## ⚙️ Create Users in Supabase

### Method 1: Supabase Dashboard (Recommended)

**Step 1**: Open Authentication → Users

```
https://app.supabase.com → Project: vmsuvhmxqvqzjvmvaryr → Authentication → Users
```

**Step 2**: Click "Add user"

**Step 3**: Fill form
- Email: `superadmin@vetapp.com`
- Password: `any123!`
- Auto confirm: ✅ (check this)

**Step 4**: Click "Create user"

**Step 5**: Repeat for other 2 users

---

### Method 2: SQL (Auto create profiles too)

```sql
-- First, create in auth via SQL
-- Note: Need to use supabase_admin role

INSERT INTO auth.users (
  instance_id, 
  id, 
  aud, 
  role, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  created_at, 
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'superadmin@vetapp.com',
  crypt('any123!', gen_salt('bf')),
  now(),
  now(),
  now()
);

-- Then create in profiles table
INSERT INTO public.profiles (
  id, 
  email, 
  full_name, 
  role
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'superadmin@vetapp.com'),
  'superadmin@vetapp.com',
  'Super Admin',
  'super_admin'
);
```

⚠️ **SQL Method Limitation**: Need pgcrypto extension + supabase_admin role. Dashboard method is easier.

---

## ✅ Verify Users Created

### Check Auth Users

```sql
SELECT id, email, created_at FROM auth.users;
```

Expected: 3 rows

### Check Profiles Linked

```sql
SELECT id, email, role FROM public.profiles;
```

Expected: 3 rows matching auth users

### Test Login

1. Go: http://localhost:3000/login
2. Email: `superadmin@vetapp.com`
3. Password: `any123!`
4. Click: "Giriş Yap"
5. Expected: Redirect to `/super-admin/clinics`

---

## 🐛 Troubleshooting

### "Invalid login credentials"

**Causes**:
- Email/password typo
- User not created
- Email not auto-confirmed

**Solution**:
1. Check Supabase Users list
2. Verify email spelling
3. Ensure password set correctly
4. Re-create user if needed

### "Email not confirmed"

**Solution**: 
- In Dashboard → Users → Select user → Edit → Set "email_confirmed_at" to now

Or in SQL:
```sql
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email = 'superadmin@vetapp.com';
```

### Login works but redirect fails

**Cause**: Profile not found (profile.role lookup failed)

**Solution**:
```sql
-- Check if profile exists
SELECT * FROM public.profiles 
WHERE id = '[USER_ID_FROM_AUTH]';

-- If missing, create it
INSERT INTO public.profiles (id, email, full_name, role)
VALUES ('[USER_ID]', 'superadmin@vetapp.com', 'Super Admin', 'super_admin');
```

---

## 📝 Optional: Create Clinic Admin User

For testing clinic isolation:

```sql
-- Auth user
INSERT INTO auth.users (
  instance_id, id, aud, role, email, 
  encrypted_password, email_confirmed_at, 
  created_at, updated_at
) 
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin1@clinic1.com',
  crypt('any123!', gen_salt('bf')),
  now(), now(), now()
);

-- Profile with clinic reference
INSERT INTO public.profiles (
  id, email, full_name, role, clinic_id
) 
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin1@clinic1.com'),
  'admin1@clinic1.com',
  'Clinic Admin 1',
  'clinic_admin',
  (SELECT id FROM clinics LIMIT 1)  -- Link to first clinic
);
```

---

## 🧪 Test All 3 Roles

| Role | Email | Password | Test | Expected |
|------|-------|----------|------|----------|
| Super Admin | superadmin@vetapp.com | any123! | Login + Redirect | `/super-admin/clinics` page |
| Clinic Admin | admin1@clinic1.com | any123! | Login + Redirect | `/clinic/dashboard` page |
| Pet Owner | owner1@example.com | any123! | Login + Redirect | `/pet-owner/dashboard` page |

---

## 🎯 Next Steps

1. ✅ Create 3 auth users (superadmin, admin, owner)
2. ✅ Verify profiles linked to auth users
3. ✅ Test login with each user
4. ✅ Verify role-based redirects work
5. → Next: Build role-specific dashboards

---

**Last Updated**: 15 Mayıs 2026  
**Ready to Create Users**: Yes ✅
