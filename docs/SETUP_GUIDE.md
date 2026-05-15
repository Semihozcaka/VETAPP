# VetApp - Adım Adım Kurulum Kılavuzu

## 🚀 Başlangıç Kontrolü

### Gereksinimler
- [x] Supabase hesabı (https://supabase.com)
- [x] Node.js 18+ (https://nodejs.org)
- [x] npm veya yarn
- [x] Git
- [x] VS Code (önerilen)

---

## 📦 Step 1: Supabase Projesi Oluşturma

### 1.1 Supabase'de Login
```
https://supabase.com → Sign In → Create New Project
```

### 1.2 Project Detayları
```
Project Name: vetapp-dev (veya kendi adınız)
Database Password: [Güçlü şifre, kaydet!]
Region: Türkiye'ye en yakın (Europe - Frankfurt)
```

### 1.3 Projeyi Bekle
Project oluşturması ~5-10 dakika alır. ☕

### 1.4 Credentials Al
Dashboard'da:
- Settings → API
- **NEXT_PUBLIC_SUPABASE_URL** (şu şekildedir: `https://xxxxx.supabase.co`)
- **NEXT_PUBLIC_SUPABASE_ANON_KEY** (43 karakterli anahtar)

📝 Bunları not et!

---

## 🗄️ Step 2: Database Migrate

### 2.1 SQL Editor Aç
```
Supabase Dashboard → SQL Editor → New Query
```

### 2.2 Migration Dosyasını Çalıştır

Aşağıdaki dosyanın içeriğini kopyala:
```
VETAPP/backend/supabase/migrations/001_initial_schema.sql
```

SQL Editor'a yapıştır ve **RUN** tıkla.

✅ Başarılı olunca: Tüm tablolar, enum'lar, indexler, RLS politikaları oluşturulmuştur.

### 2.3 Seed Data (Test İçin)

SQL Editor → New Query → Aşağıdaki dosyayı kopyala:
```
VETAPP/backend/supabase/seed.sql
```

RUN tıkla.

✅ Başarılı olunca: Test verisi eklenir (klinikleri, hayvanları, randevuları vb.)

---

## 👥 Step 3: Supabase Auth Users Oluşturma

### 3.1 Auth Dashboard'a Git
```
Supabase Dashboard → Authentication → Users → Add User
```

### 3.2 Super Admin User Ekle
```
Email: superadmin@vetapp.com
Password: [Güçlü şifre]
Auto confirm email: ✓
```

**Add User** tıkla.

### 3.3 Profil Kaydını Güncelle

SQL Editor → New Query:
```sql
UPDATE profiles 
SET role = 'super_admin' 
WHERE email = 'superadmin@vetapp.com';
```

### 3.4 Clinic Admin Users Ekle

Aynı adımları takip et:
```
admin1@clinic1.com → role: clinic_admin
admin2@clinic2.com → clinic_admin
```

### 3.5 Pet Owner Users Ekle
```
owner1@example.com → pet_owner
owner2@example.com → pet_owner
```

---

## 🖥️ Step 4: Next.js Geliştirme Ortamı

### 4.1 Dependencies Yükle
```bash
cd VETAPP/web/nextjs
npm install
```

⏱️ ~3-5 dakika alır.

### 4.2 Environment Variables
```bash
cp .env.example .env.local
```

`.env.local` dosyasını aç ve ekle:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4.3 TypeScript Types Oluştur

```bash
# Supabase CLI aracılığıyla types oluştur
# (Bu komut database'i okur ve types generate eder)
npx supabase gen types typescript --project-id your-project-id > src/lib/supabase/database.types.ts
```

❗ **Alternatif**: `src/lib/supabase/database.types.ts` dosyasında placeholder'ı kutular kalır. İlerleyen aşamalarda Supabase CLI kurulunca bunu çalıştır.

### 4.4 Development Server Başlat
```bash
npm run dev
```

✅ Başarılı olunca:
```
▲ Next.js 14.0.0
  - Local:        http://localhost:3000
```

---

## 🧪 Step 5: Testing Giriş

### 5.1 http://localhost:3000 Açıyorsun

Otomatik `/login` sayfasına yönlendir.

### 5.2 Test Hesabı ile Giriş

```
Email: superadmin@vetapp.com
Password: [Step 3'te belirlediğin şifre]
```

**Giriş Yap** tıkla.

### 5.3 Auto Redirect

Role göre otomatik yönlendirme:
```
Super Admin → /super-admin/clinics
Clinic Admin → /clinic/dashboard
Pet Owner → /pet-owner/dashboard (henüz yapılmadı)
```

### 5.4 Klinikleri Görüntüle

Super Admin hesabında `/super-admin/clinics`:
- Seed data'dan eklenen 2 kliniği görmelisin
- **Yeni Klinik Ekle** butonuyla yeni klinik oluşturabilirsin

---

## 🔐 Step 6: RLS Policies Kontrol

Tüm politikalar migration'da oluşturulmuş. Kontrol etmek için:

```
Supabase → SQL Editor → New Query
```

Çalıştır:
```sql
SELECT policyname, tablename, permissive
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

✅ Aşağıdaki policies olmalı:
- `super_admin_view_all_*` (9 adet)
- `clinic_admin_view_*` (9 adet)
- `pet_owner_view_*` (4 adet)
- vb.

---

## 📱 Step 7: Flutter Mobil Uygulaması (İlerleyen Aşama)

Şu an gerekli değil, ancak hazırlık:
- [ ] Flutter 3.0+ kur
- [ ] Firebase Console projesi oluştur
- [ ] FCM setup
- [ ] Deep linking configuration

---

## ✅ Final Checklist

- [x] Supabase projesi oluşturdu
- [x] Database migration çalıştırıldı
- [x] Seed data eklendi
- [x] Auth users oluşturuldu
- [x] .env.local configured
- [x] npm dependencies yüklendi
- [x] Development server çalıştı
- [x] Login test başarılı
- [x] Role-based redirect çalıştı

---

## 🐛 Sorun Giderme

### `NEXT_PUBLIC_SUPABASE_URL tanımlanmamış`
**Çözüm**: `.env.local` dosyasını kontrol et ve doğru credentials gir.

### `RLS policy denies everything`
**Çözüm**: Auth token'ında role bilgisinin doğru olduğunu kontrol et:
```sql
SELECT email, role FROM profiles WHERE email = 'your-email@example.com';
```

### `Port 3000 already in use`
**Çözüm**: 
```bash
# Farklı port kullan
npm run dev -- -p 3001
```

### Database connection timeout
**Çözüm**: Supabase Dashboard → Project Settings → Database → Connection pooling aktif mi?

---

## 🎯 Sonraki Adımlar

1. **UI Components** geliştir (Tailwind CSS, Material-UI, vb.)
2. **Clinic Admin features** tamamla (owners, pets, appointments)
3. **Pet Owner dashboard** oluştur
4. **WhatsApp deep link** entegre et
5. **Firebase Cloud Messaging** kur (push notifications)
6. **Flutter mobile app** başlat

---

## 📚 Docs & Resources

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- PostgreSQL RLS: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security

---

**🎉 Tebrikler! Temel kurulum tamamlandı. Başarılı geliştirmeler dilerim!**
