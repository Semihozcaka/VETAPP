# VetApp Backend & Database Setup

## Supabase Migration

SQL migration dosyası: `supabase/migrations/001_initial_schema.sql`

Bu dosya aşağıdakileri içerir:
- 11 tane tablo (profiles, clinics, clinic_members, owners, pets, appointments, vb.)
- Enum türleri (user_role, appointment_status, vb.)
- Indexler (performans optimizasyonu)
- Row Level Security (RLS) politikaları

### Migration Adımları

1. Supabase Dashboard'a gidin
2. SQL Editor'a gidin
3. "New Query" tıklayın
4. `supabase/migrations/001_initial_schema.sql` dosyasının içeriğini kopyala-yapıştır
5. Çalıştır

Alternatif: Supabase CLI kullanıyorsanız:
```bash
supabase db push
```

## Seed Data

Test verisi eklemek için:
1. SQL Editor'da yeni query açın
2. `supabase/seed.sql` dosyasının içeriğini kopyala-yapıştır
3. Çalıştır

## Database Schema Overview

### Roles (Roller)
- **super_admin**: Sistem yöneticisi, klinik oluşturur
- **clinic_admin**: Klinik yöneticisi, klinikteki verileri yönetir
- **pet_owner**: Hayvan sahibi, randevu talep eder

### Main Tables

#### profiles
Supabase Auth users ile bağlantılı kullanıcı profil bilgileri

#### clinics
Veteriner klinikleri

#### clinic_members
Clinic admin kullanıcılar

#### owners
Pet owners (müşteriler) - profile_id nullable olabilir

#### pets
Hayvanlar - owner_id ve clinic_id ile bağlantılı

#### appointments
Randevular

#### price_requests
Fiyat talepleri

#### health_records
Sağlık kayıtları (aşı, ilaç, kontrol)

#### reminders
Hatırlatmalar

#### services
Klinik tarafından sunulan hizmetler

#### invite_links
QR ve davet kodları

## RLS (Row Level Security) Kuralları

Tüm tablolar RLS ile korunmaktadır:

- **Super Admin**: Tüm verilere erişebilir
- **Clinic Admin**: Yalnız kendi kliniğinin verilerine erişebilir
- **Pet Owner**: Yalnız kendisine ait verilere erişebilir

Her tablo için SELECT, INSERT, UPDATE politikaları var.

## İlk Kurulum Checklist

- [ ] SQL migration çalıştırıldı
- [ ] Seed data eklendi (test için)
- [ ] Supabase Auth users oluşturuldu
- [ ] .env.local dosyasında Supabase credentials var
- [ ] NextJS types oluşturuldu (`npm run supabase:gen-types`)

## Test Accounts (Seed Datadan)

### Super Admin
- Email: superadmin@vetapp.com
- Role: super_admin

### Clinic Admin 1
- Email: admin1@clinic1.com
- Role: clinic_admin
- Clinic: Ankara Veteriner Klinikleri

### Clinic Admin 2
- Email: admin2@clinic2.com
- Role: clinic_admin
- Clinic: İstanbul Pet Care Center

### Pet Owner 1
- Email: owner1@example.com
- Role: pet_owner

### Pet Owner 2
- Email: owner2@example.com
- Role: pet_owner

### Pet Owner 3 (Profile olmadan)
- Email: owner3@example.com
- Role: pet_owner (ama profile_id NULL - henüz sign up yapmamış)
