# VetApp Web Panel - Next.js

## Kurulum

```bash
# Dependencies yükle
npm install

# Environment variables ayarla
cp .env.example .env.local
# Ardından NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY değerlerini .env.local dosyasına ekle
```

## Development

```bash
npm run dev
```

Açın: http://localhost:3000

## Supabase Types Oluşturma

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/database.types.ts
```

## Build

```bash
npm run build
npm start
```

## Yapısı

- `/src/app` - Next.js App Router (route groups ile organize)
- `/src/lib/supabase` - Supabase client, server, ve types
- `/src/lib/auth` - Auth redirect ve role kontrol
- `/src/lib/constants` - Rol tanımları ve sabitler
- `/src/components` - Reusable React components

## Route Yapısı

- `/login` - Giriş sayfası
- `/super-admin/clinics` - Super admin: Klinikleri yönet
- `/super-admin/clinics/new` - Yeni klinik oluştur
- `/clinic/dashboard` - Clinic admin dashboard
- `/clinic/owners` - Müşteri yönetimi
- `/clinic/pets` - Hayvan yönetimi
- `/clinic/appointments` - Randevu yönetimi
- `/clinic/price-requests` - Fiyat taleberi
- `/clinic/reminders` - Hatırlatmalar
