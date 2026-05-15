# 🚀 VetApp - Quick Reference

Hızlı API ve route kullanım referansı.

## 📍 Routes

### Authentication
```
GET    /login              - Login sayfası
POST   /api/auth/login     - Login submit
POST   /api/auth/logout    - Logout
```

### Super Admin
```
GET    /super-admin/clinics              - Klinikleri listele
GET    /super-admin/clinics/:id          - Klinik detayı
POST   /super-admin/clinics              - Yeni klinik
PATCH  /super-admin/clinics/:id          - Klinik güncelle
DELETE /super-admin/clinics/:id          - Klinik sil

GET    /super-admin/clinics/:id/members  - Clinic admin'leri
POST   /super-admin/clinics/:id/members  - Clinic admin ekle
```

### Clinic Admin
```
GET    /clinic/dashboard                 - Dashboard
GET    /clinic/owners                    - Müşterileri listele
POST   /clinic/owners                    - Müşteri ekle
PATCH  /clinic/owners/:id                - Müşteri güncelle

GET    /clinic/pets                      - Hayvanları listele
POST   /clinic/pets                      - Hayvan ekle
PATCH  /clinic/pets/:id                  - Hayvan güncelle

GET    /clinic/appointments              - Randevuları listele
POST   /clinic/appointments              - Randevu oluştur
PATCH  /clinic/appointments/:id/approve  - Randevu onayla
PATCH  /clinic/appointments/:id/reject   - Randevu reddet

GET    /clinic/price-requests            - Fiyat taleplerini listele
PATCH  /clinic/price-requests/:id        - Fiyat talebi cevapla

GET    /clinic/reminders                 - Hatırlatmaları listele
POST   /clinic/reminders                 - Hatırlatma oluştur

GET    /clinic/settings                  - Ayarlar
PATCH  /clinic/settings                  - Ayarları güncelle
```

### Pet Owner (Henüz yapılmadı)
```
GET    /pet-owner/dashboard              - Dashboard
GET    /pet-owner/pets                   - Hayvanları listele
GET    /pet-owner/appointments           - Randevuları listele
POST   /pet-owner/appointments           - Randevu talep et
GET    /pet-owner/reminders              - Hatırlatmaları listele
POST   /pet-owner/price-requests         - Fiyat talep et
```

---

## 🔌 Supabase REST API

Base URL: `https://<project-id>.supabase.co/rest/v1`

### Profiles
```
GET    /profiles?id=eq.<user-id>
POST   /profiles
       { email, role, full_name, phone_number }

PATCH  /profiles?id=eq.<user-id>
       { full_name, phone_number }
```

### Clinics
```
GET    /clinics?is_active=eq.true
GET    /clinics?id=eq.<clinic-id>
POST   /clinics
       { name, description, address, phone_number, email, owner_name, created_by }

PATCH  /clinics?id=eq.<clinic-id>
       { name, description, is_active }
```

### Owners
```
GET    /owners?clinic_id=eq.<clinic-id>
GET    /owners?id=eq.<owner-id>
POST   /owners
       { clinic_id, full_name, phone_number, email, address, profile_id }

PATCH  /owners?id=eq.<owner-id>
       { full_name, phone_number, email, address }
```

### Pets
```
GET    /pets?owner_id=eq.<owner-id>
GET    /pets?clinic_id=eq.<clinic-id>&owner_id=eq.<owner-id>
POST   /pets
       { clinic_id, owner_id, name, species, breed, birth_date, weight, microchip_id }

PATCH  /pets?id=eq.<pet-id>
       { name, species, breed, weight }
```

### Appointments
```
GET    /appointments?clinic_id=eq.<clinic-id>&status=eq.pending
GET    /appointments?owner_id=eq.<owner-id>
POST   /appointments
       { clinic_id, pet_id, owner_id, appointment_date, status, reason_for_visit, created_by }

PATCH  /appointments?id=eq.<appointment-id>
       { status, notes }
```

### Price Requests
```
GET    /price_requests?clinic_id=eq.<clinic-id>&status=eq.pending
POST   /price_requests
       { clinic_id, owner_id, pet_id, service_description, status }

PATCH  /price_requests?id=eq.<price-request-id>
       { status, quote_price, quote_notes }
```

### Health Records
```
GET    /health_records?pet_id=eq.<pet-id>
POST   /health_records
       { clinic_id, pet_id, record_type, description, administered_date, next_due_date, created_by }

PATCH  /health_records?id=eq.<record-id>
       { description, next_due_date }
```

### Reminders
```
GET    /reminders?owner_id=eq.<owner-id>&is_completed=eq.false
POST   /reminders
       { clinic_id, owner_id, pet_id, reminder_type, title, description, reminder_date, created_by }

PATCH  /reminders?id=eq.<reminder-id>
       { is_completed }
```

---

## 🔑 Headers

Tüm requests için:

```
Authorization: Bearer <JWT-TOKEN>
Content-Type: application/json
Prefer: return=representation
```

---

## 📊 Common Queries

### Clinic Dashboard Stats
```typescript
// Appointments by status
const { data: appointments } = await supabase
  .from('appointments')
  .select('status, count(*)')
  .eq('clinic_id', clinicId)
  .group_by('status');

// Recent appointments
const { data } = await supabase
  .from('appointments')
  .select(`
    id, appointment_date, status,
    pets(name),
    owners(full_name)
  `)
  .eq('clinic_id', clinicId)
  .order('appointment_date', { ascending: false })
  .limit(10);

// Owner count
const { count } = await supabase
  .from('owners')
  .select('*', { count: 'exact', head: true })
  .eq('clinic_id', clinicId);

// Pet count
const { count: petCount } = await supabase
  .from('pets')
  .select('*', { count: 'exact', head: true })
  .eq('clinic_id', clinicId);
```

### Pet Health History
```typescript
const { data: healthRecords } = await supabase
  .from('health_records')
  .select('*')
  .eq('pet_id', petId)
  .order('administered_date', { ascending: false });

// Vaccinations only
const { data: vaccinations } = await supabase
  .from('health_records')
  .select('*')
  .eq('pet_id', petId)
  .eq('record_type', 'vaccination')
  .filter('next_due_date', 'gte', new Date().toISOString());
```

### Pending Appointments
```typescript
const { data: pending } = await supabase
  .from('appointments')
  .select(`
    *,
    pets(name),
    owners(full_name, phone_number),
    created_by(full_name)
  `)
  .eq('clinic_id', clinicId)
  .eq('status', 'pending')
  .order('appointment_date', { ascending: true });
```

---

## 🔐 Auth Flow

### Login
```typescript
import { supabaseClient } from '@/lib/supabase/client';

const { data, error } = await supabaseClient.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

if (!error) {
  // Redirect by role
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();
  
  // Navigate to role dashboard
}
```

### Server-side Auth Check
```typescript
// app/clinic/layout.tsx
import { getServerUserProfile } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth/redirect';
import { ROLES } from '@/lib/constants/roles';

export default async function ClinicLayout({ children }) {
  await requireRole([ROLES.CLINIC_ADMIN]);
  const profile = await getServerUserProfile();
  
  return <>{children}</>;
}
```

### Logout
```typescript
const { error } = await supabaseClient.auth.signOut();
// Redirect to /login
```

---

## ⏱️ Filtering & Pagination

### Filters
```typescript
// Equals
.eq('status', 'pending')

// Not equals
.neq('is_active', false)

// Greater than
.gt('created_at', '2026-05-01')

// Less than
.lt('appointment_date', '2026-06-01')

// In list
.in('status', ['pending', 'approved'])

// Text search (full-text)
.textSearch('description', 'aşı')
```

### Pagination
```typescript
// Limit to 10
.limit(10)

// Offset (page 2: skip 10, take 10)
.range(10, 19)

// Count total
.select('*', { count: 'exact' })
```

### Ordering
```typescript
// Ascending
.order('created_at', { ascending: true })

// Descending
.order('name', { ascending: false })

// Multiple columns
.order('clinic_id', { ascending: true })
.order('created_at', { ascending: false })
```

---

## 🎯 TypeScript Types

```typescript
import type {
  Profile,
  Clinic,
  Owner,
  Pet,
  Appointment,
  PriceRequest,
  HealthRecord,
  Reminder,
} from '@/lib/supabase/types';

import type {
  UserRole,
  AppointmentStatus,
  PriceRequestStatus,
  HealthRecordType,
} from '@/lib/supabase/types';
```

---

## 🚨 Error Handling

```typescript
try {
  const { data, error } = await supabaseClient
    .from('owners')
    .select('*');

  if (error) {
    console.error('Database error:', error.message);
    // Handle: RLS denied, invalid query, etc.
    throw error;
  }

  return data;
} catch (err) {
  console.error('Failed to fetch owners:', err);
  // Show user-friendly message
}
```

---

## 🧪 Testing

### Login Test
```bash
curl -X POST https://<project-id>.supabase.co/auth/v1/token?grant_type=password \
  -H "apikey: <anon-key>" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

### Query Test
```bash
curl https://<project-id>.supabase.co/rest/v1/clinics \
  -H "apikey: <anon-key>" \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 💡 Tips

- Always specify which columns with `.select()`
- Use `.single()` for expecting one row
- Use `.maybeSingle()` if row might not exist
- Filter as much as possible (better performance)
- Check RLS policies if getting "access denied"
- Use `count: 'exact'` only when needed (slower)
- Order before limit for consistent pagination
- Use `not` for negation: `.not('is_active', 'is', null)`

---

**Need help?** Check [ARCHITECTURE.md](ARCHITECTURE.md) ve [SETUP_GUIDE.md](SETUP_GUIDE.md)
