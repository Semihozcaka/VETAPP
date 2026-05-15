# 🐾 VetApp - Veteriner Klinik Yönetim Sistemi

> Modern, güvenli ve ölçeklenebilir veteriner klinik yönetim platformu

## ✨ Özellikler

- ✅ **Randevu Yönetimi** - Pet owner talepleri, clinic admin onayı
- ✅ **Müşteri & Hayvan Takibi** - Profil ve sağlık geçmişi
- ✅ **Sağlık Kaydı Sistemi** - Aşı, ilaç, kontrol izleme
- ✅ **Fiyat Talepleri** - Dinamik fiyat vermeler
- ✅ **Hatırlatma Sistemi** - Otomatik bilgilendirmeler
- ✅ **Davet Sistemi** - QR kod ve davet linkileri
- ✅ **WhatsApp Entegrasyonu** - Deep link ile kolay iletişim
- ✅ **Rol Tabanlı Erişim** - Super Admin, Clinic Admin, Pet Owner
- ✅ **Row Level Security** - Database seviyesi güvenlik

## 🏗️ Mimari

```
Next.js 14 (Frontend)
    ↓
Supabase (Backend)
    ├─ PostgreSQL (Database)
    ├─ Auth (Supabase Auth)
    ├─ RLS (Row Level Security)
    └─ Real-time (WebSocket)
```

## 🚀 Hızlı Başlangıç

### 1. Gereksinimler
```bash
- Node.js 18+
- npm / yarn
- Supabase hesabı (free tier ok)
```

### 2. Kurulum (5 dakika)

```bash
# 1. Repo klonla
git clone <repo-url>
cd VETAPP

# 2. Supabase projesi oluştur
# https://supabase.com → New Project

# 3. Database migrate et
# backend/supabase/migrations/001_initial_schema.sql → Supabase SQL Editor

# 4. Credentials ekle
cd web/nextjs
cp .env.example .env.local
# NEXT_PUBLIC_SUPABASE_URL ve KEY'i ekle

# 5. Dependencies
npm install

# 6. Dev server
npm run dev
```

**Açın**: http://localhost:3000

### 3. Test Hesapları (Seed Datadan)

```
Super Admin:    superadmin@vetapp.com
Clinic Admin:   admin1@clinic1.com
Pet Owner:      owner1@example.com
```

Tüm şifreler: Seed data'da belirtildiği gibi

---

## 📂 Proje Yapısı

```
VETAPP/
├── backend/
│   ├── supabase/
│   │   ├── migrations/
│   │   │   └── 001_initial_schema.sql        # Database schema
│   │   └── seed.sql                          # Test data
│   └── README.md
│
├── web/
│   ├── nextjs/
│   │   ├── src/
│   │   │   ├── app/                          # App Router
│   │   │   │   ├── (auth)/login              # Login
│   │   │   │   ├── (super-admin)/            # Super admin routes
│   │   │   │   ├── (clinic)/                 # Clinic routes
│   │   │   │   └── middleware.ts             # Auth middleware
│   │   │   ├── lib/
│   │   │   │   ├── supabase/                 # Client, server, types
│   │   │   │   ├── auth/                     # Auth helpers
│   │   │   │   └── constants/                # Roles, config
│   │   │   └── components/                   # Reusable components
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env.example
│   └── README.md
│
└── docs/
    ├── ARCHITECTURE.md                       # Mimarı detayları
    ├── SETUP_GUIDE.md                        # Step-by-step kurulum
    ├── BEST_PRACTICES.md                     # Coding standards
    └── QUICK_REFERENCE.md                    # API/Route reference
```

---

## 🔐 Güvenlik

### Row Level Security (RLS)
Tüm tablolar RLS politikalarıyla korunmaktadır:
- **Super Admin**: Tüm veriler
- **Clinic Admin**: Sadece kendi kliniğinin verileri
- **Pet Owner**: Sadece kendi verilerine erişim

### Authentication
- Supabase Auth ile JWT token tabanlı
- Secure session management
- Server-side auth checks

Detaylı bilgi: [ARCHITECTURE.md](docs/ARCHITECTURE.md#güvenlik--rls)

---

## 📚 Database

### 11 Main Tables
```
profiles          clinic_members      services
clinics           owners              invite_links
├─ health_records
├─ appointments
├─ price_requests
├─ reminders
└─ pets
```

### Key Relationships
- Clinics → Owners → Pets
- Pets → Health Records, Appointments, Reminders
- Owners → Price Requests
- Clinics → Clinic Members, Services, Invite Links

Migration: [001_initial_schema.sql](backend/supabase/migrations/001_initial_schema.sql)

---

## 🛣️ Routes

### Super Admin (`/super-admin/*`)
- `GET /super-admin/clinics` - Klinikleri listele
- `POST /super-admin/clinics` - Yeni klinik oluştur
- `PATCH /super-admin/clinics/:id` - Klinik düzenle

### Clinic Admin (`/clinic/*`)
- `GET /clinic/dashboard` - Dashboard
- `GET /clinic/owners` - Müşteriler
- `GET /clinic/pets` - Hayvanlar
- `GET /clinic/appointments` - Randevular
- `GET /clinic/price-requests` - Fiyat talepleri
- `GET /clinic/reminders` - Hatırlatmalar

### Pet Owner (`/pet-owner/*`)
- Henüz yapılacak (Fase 2)

---

## 🧑‍💻 Kullanıcı Rolleri

### Super Admin
- Klinik oluşturur
- Klinik admin atama/çıkarma
- Sistem metrikleri
- Tüm veriye erişim

### Clinic Admin
- Klinik yönetimi
- Müşteri/hayvan yönetimi
- Randevu onaylama
- Fiyat talepleri yanıtlama
- Sağlık kaydı giriş

### Pet Owner
- Kliniğe bağlanma (QR/davet kodu)
- Hayvanlarını görme
- Randevu talep etme
- Fiyat bilgisi isteme
- Hatırlatmaları takip etme

---

## 📖 Dokümantasyon

| Döküman | Amaç |
|---------|------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Sistem mimarı, database şeması, RLS detayları |
| [SETUP_GUIDE.md](docs/SETUP_GUIDE.md) | Adım adım kurulum kılavuzu |
| [BEST_PRACTICES.md](docs/BEST_PRACTICES.md) | Coding standards, security, performance |
| [QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md) | API/Route quick reference |

---

## 🔄 Development Workflow

### 1. Database Değişiklik
```bash
# Migration dosyası oluştur
# Edit: backend/supabase/migrations/002_*.sql

# Supabase'e deploy et
supabase db push
```

### 2. Next.js Types Güncelle
```bash
npx supabase gen types typescript --project-id PROJECT_ID \
  > web/nextjs/src/lib/supabase/database.types.ts
```

### 3. Development
```bash
cd web/nextjs
npm run dev
```

### 4. Deployment

**Frontend (Vercel)**:
```bash
vercel deploy
```

**Database (Supabase)**:
- Auto-managed
- Backups: Automatic
- Scaling: Supabase Pro/Business plans

---

## 🐛 Troubleshooting

### Login hatası
```
❌ "Wrong email or password"
→ Supabase Dashboard → Authentication → Users → Passwords doğru mu?
```

### RLS policy hatası
```
❌ "new row violates row-level security policy"
→ User'ın role'ü doğru mu? clinic_id/owner_id uyuşuyor mu?
```

### Database bağlantısı
```
❌ "Cannot connect to database"
→ .env.local dosyasında credentials doğru mu?
→ Supabase projesi aktif mi?
```

Detaylı troubleshooting: [SETUP_GUIDE.md#-sorun-giderme](docs/SETUP_GUIDE.md#-sorun-giderme)

---

## 🚀 Gelecek Aşamalar

### Fase 2 (Q2 2026)
- [ ] Flutter mobile app
- [ ] Firebase Cloud Messaging (push)
- [ ] PDF belgeleri export

### Fase 3 (Q3 2026)
- [ ] Ödeme entegrasyonu
- [ ] WhatsApp API
- [ ] Advanced analytics

### Fase 4 (Q4 2026)
- [ ] Staff/veteriner rolleri
- [ ] Clinic chains
- [ ] Appointment calendar

---

## 🤝 Katkı Sağlama

1. Branch oluştur (`git checkout -b feature/amazing-feature`)
2. Değişiklikler yap
3. Commit et (`git commit -m 'Add amazing feature'`)
4. Push et (`git push origin feature/amazing-feature`)
5. Pull Request aç

**Code Review Checklist**:
- [ ] TypeScript strict mode
- [ ] Testler yazıldı
- [ ] Docs güncellediyse güncelle
- [ ] No console.logs
- [ ] RLS policies kontrol edil

---

## 📊 Project Stats

| Metrik | Değer |
|--------|-------|
| Tablolar | 11 |
| Enum Tipleri | 4 |
| RLS Politikaları | 30+ |
| Routes | 7 |
| Roles | 3 |
| Micro-services | 1 (Supabase) |

---

## 📞 İletişim

- **Issues**: GitHub Issues (bug reports)
- **Discussions**: GitHub Discussions (feature ideas)
- **Email**: [Your email]

---

## 📄 Lisans

MIT License - bkz. [LICENSE](LICENSE)

---

## 🙏 Teşekkürler

- [Supabase](https://supabase.com) - Backend
- [Next.js](https://nextjs.org) - Frontend framework
- [PostgreSQL](https://postgresql.org) - Database
- [Vercel](https://vercel.com) - Hosting

---

<p align="center">
  Yapılmış ❤️ ile veteriner klinikleri için
</p>

**🚀 Başlamaya hazır?** [SETUP_GUIDE.md](docs/SETUP_GUIDE.md) adresine git!
