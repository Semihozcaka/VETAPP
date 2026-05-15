# 🔐 Login Test Guide

**Status**: ✅ Dev Server running (port 3000)

---

## 🧪 Test Steps

### 1. Browser'ı Aç

```
http://localhost:3000/login
```

**Expected**: Login page açılmalı, "✅ Supabase bağlantısı başarılı" gösterilmeli

---

### 2. Test Credentials Bul

**Problem**: Seed data'daki test hesapları password'leriyle nerede?

**Çözüm**: Supabase Dashboard'ta kontrol et

1. Login: https://app.supabase.com
2. Project: `vmsuvhmxqvqzjvmvaryr`
3. Authentication → Users
4. Aşağıdaki users'i bul:
   - `superadmin@vetapp.com`
   - `admin1@clinic1.com`
   - `owner1@example.com`

**Password**: Seed data'da tanımlı ama test için kendi password belirlebilir:
- Supabase → Users → User seç → Edit user → Password değiştir

---

### 3. Login Testi

**Email**: `superadmin@vetapp.com`  
**Password**: [Supabase'de ayarla]

Giriş Yap butonuna bas.

---

### 4. Browser Console'da Logs Kontrol Et

**Açış**: F12 → Console tab

**Expected logs**:

```
📝 [Login] Form submitted: { email: 'superadmin@vetapp.com' }
🔐 [Login] Supabase auth.signInWithPassword çağrılıyor...
✅ [Login] Auth başarılı. User ID: [UUID]
🔍 [Login] profiles tablosundan role çekiliyor...
✅ [Login] Profile bulundu. Role: super_admin
🚀 [Login] Redirect yapılıyor: /super-admin/clinics
✅ [Login] window.location.href set edildi
```

---

### 5. Redirect Doğrula

**Expected**:
- `superadmin@vetapp.com` → `/super-admin/clinics` gider
- `admin1@clinic1.com` → `/clinic/dashboard` gider
- `owner1@example.com` → `/pet-owner/dashboard` gider (ileride implementasyon)

---

## 🐛 Debug - Hata Mesajları

### "Env değişkenleri eksik"

**Çözüm**:
```bash
# Check .env.local
cat web/nextjs/.env.local

# Should have:
# NEXT_PUBLIC_SUPABASE_URL=https://vmsuvhmxqvqzjvmvaryr.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

### "Auth hatası: Invalid login credentials"

**Çözüm**:
- Email/password doğru mu?
- Supabase'de user'ı doğru oluştur
- Veya test password belirle

### "Profil bulunamadı"

**Sebep**: Supabase Auth user oluştu ama profiles tablosunda eşleşen kayıt yok

**Çözüm**:
```sql
-- Supabase SQL Editor'da
SELECT * FROM profiles 
WHERE id = '[USER_ID]'  -- Supabase'deki User ID
```

Kayıt yoksa:
```sql
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  '[USER_ID]',
  'superadmin@vetapp.com',
  'Super Admin',
  'super_admin'
);
```

---

## 📊 Test Workflow

```
1. Login page açılır
   ↓
2. Email/password gir
   ↓
3. "Giriş Yap" tıkla
   ↓
4. Console logs gözle
   ↓
5. Sayfaya yönlendir (3-5 saniye)
   ↓
6. Role dashboard'unda olmalı
```

---

## ✅ Success Criteria

- [ ] Login page açılıyor
- [ ] Supabase connection ✅ gösteriyor
- [ ] Form submit çalışıyor
- [ ] Console logs görünüyor
- [ ] 3 saniye sonra redirect oluyor
- [ ] `/super-admin/clinics` sayfası açılıyor
- [ ] Hiçbir hata yok

---

## 🚀 Next Steps

- [ ] Database migration çalıştır (SQL)
- [ ] Seed data çalıştır (SQL)
- [ ] Auth users oluştur
- [ ] Profiles tablosunu doldur
- [ ] Login test et
- [ ] UI components başla

---

## 📞 Troubleshooting Checklist

- [ ] .env.local var mı ve doğru mu?
- [ ] Supabase credentials doğru mu?
- [ ] Auth users Dashboard'ta oluştu mu?
- [ ] Profiles table auth user id'lerle dolu mu?
- [ ] RLS policies doğru mu?
- [ ] Dev server 3000 port'unda çalışıyor mu?
- [ ] Browser console hata gösteriyor mu?

---

**Last Updated**: 15 Mayıs 2026  
**Status**: Ready for Login Test
