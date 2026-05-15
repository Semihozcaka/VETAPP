# VetApp - Coding Standards & Best Practices

## 📋 İçindekiler
1. [TypeScript Standards](#typescript-standards)
2. [React/Next.js Conventions](#reactnextjs-conventions)
3. [Database Best Practices](#database-best-practices)
4. [Security Guidelines](#security-guidelines)
5. [Performance Tips](#performance-tips)

---

## TypeScript Standards

### File Organization
```typescript
// 1. Imports (üstte)
import { ReactNode } from 'react';
import { getUserProfile } from '@/lib/supabase/server';
import { Card } from '@/components/Card';

// 2. Types/Interfaces
interface UserDashboardProps {
  userId: string;
  theme?: 'light' | 'dark';
}

// 3. Constants
const DASHBOARD_REFRESH_INTERVAL = 30000;

// 4. Main component/function
export default function Dashboard({ userId }: UserDashboardProps) {
  return <div>...</div>;
}
```

### Naming Conventions
```typescript
// Components: PascalCase
export default function UserProfile() {}

// Functions: camelCase
export async function fetchUserData() {}

// Constants: SCREAMING_SNAKE_CASE
export const API_BASE_URL = 'https://api.example.com';

// Private functions: _camelCase
const _formatDate = (date: Date) => date.toISOString();

// Database types: ImportedAsIs from Supabase
import type { Profile, Pet } from '@/lib/supabase/types';
```

### Type Annotations
```typescript
// Always annotate public functions
export async function getUserRole(userId: string): Promise<string | null> {
  // ...
}

// Use union types for enums
type UserRole = 'super_admin' | 'clinic_admin' | 'pet_owner';

// Use interfaces for objects
interface CreateOwnerInput {
  clinicId: string;
  fullName: string;
  phoneNumber: string;
}

// Optional fields with ?
interface UpdatePetInput {
  name?: string;
  breed?: string;
  weight?: number;
}
```

---

## React/Next.js Conventions

### Server vs Client Components
```typescript
// Server Component (default in App Router)
// ✅ Direktement database query yapabilir
// ✅ Sensitive credentials içerebilir
// ✅ Async components
export default async function ClinicDashboard() {
  const clinic = await getClinicData();
  return <div>{clinic.name}</div>;
}

// Client Component
// ✅ Interactive (useState, onClick, vb.)
// ❌ Database erişimi yok
// ❌ Auth tokens içeremez
'use client';
export default function InteractiveForm() {
  const [loading, setLoading] = useState(false);
  return <form>...</form>;
}
```

### Component Structure
```typescript
'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import type { Pet } from '@/lib/supabase/types';

interface PetListProps {
  ownerId: string;
  onSelect?: (pet: Pet) => void;
}

export default function PetList({ ownerId, onSelect }: PetListProps) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('pets')
          .select('*')
          .eq('owner_id', ownerId);

        if (error) throw error;
        setPets(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [ownerId]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <ul>
      {pets.map((pet) => (
        <li key={pet.id} onClick={() => onSelect?.(pet)}>
          {pet.name}
        </li>
      ))}
    </ul>
  );
}
```

### Layout Hierarchy
```typescript
// ✅ Do: Role-based layout
export default async function ClinicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check auth & role
  await requireRole(['clinic_admin']);

  return (
    <div>
      <nav>Navigation</nav>
      <main>{children}</main>
    </div>
  );
}

// ❌ Don't: Mixed layouts
// Server-side auth check ✓
// Client-side auth redirect ✓ (but less reliable)
```

---

## Database Best Practices

### Query Performance
```typescript
// ❌ N+1 Problem
const pets = await supabaseClient.from('pets').select('*');
for (const pet of pets.data || []) {
  const owner = await supabaseClient
    .from('owners')
    .select('*')
    .eq('id', pet.owner_id)
    .single();
}

// ✅ Join Query
const { data: petsWithOwners } = await supabaseClient
  .from('pets')
  .select(`
    *,
    owners(id, full_name, phone_number)
  `);
```

### Filtering & Pagination
```typescript
// ❌ Tüm verileri getir (expensive)
const allAppointments = await supabaseClient
  .from('appointments')
  .select('*');

// ✅ Filtrele ve paginate et
const { data: appointments } = await supabaseClient
  .from('appointments')
  .select('*')
  .eq('clinic_id', clinicId)
  .eq('status', 'pending')
  .order('appointment_date', { ascending: true })
  .range(0, 9); // İlk 10 kayıt

// ✅ Count ile pagination
const { count } = await supabaseClient
  .from('appointments')
  .select('*', { count: 'exact', head: true })
  .eq('clinic_id', clinicId);
```

### Error Handling
```typescript
interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

async function safeQuery<T>(
  query: Promise<{ data: T | null; error: any }>
): Promise<ApiResponse<T>> {
  try {
    const { data, error } = await query;
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

// Usage
const { data: clinic, error } = await safeQuery(
  supabaseClient
    .from('clinics')
    .select('*')
    .eq('id', clinicId)
    .single()
);

if (error) {
  console.error('Failed to fetch clinic:', error);
  return <div>Klinik yüklenemedi</div>;
}
```

### RLS Policy Testing
```typescript
// Before deploying, test RLS policies:
// 1. Test with different roles
// 2. Ensure data isolation
// 3. Verify CRUD permissions

// SQL: Check if user can access data
SELECT * FROM pets WHERE clinic_id = 'clinic-uuid';
-- Runs with RLS_user_id context
```

---

## Security Guidelines

### Authentication
```typescript
// ✅ Server-side auth check
export default async function AdminPage() {
  const user = await getServerUser();
  if (!user) redirect('/login');

  const profile = await getServerUserProfile();
  if (profile?.role !== 'super_admin') {
    redirect('/');
  }

  return <AdminContent />;
}

// ❌ Client-side only (not secure)
export default function AdminPage() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Vulnerable to tampering
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(user);
  }, []);
}
```

### Environment Variables
```typescript
// ✅ Public keys only in .env.local
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

// ✅ Sensitive keys in .env.local (server-only)
SUPABASE_SERVICE_ROLE_KEY=... // NEVER expose

// ❌ Never commit .env.local to git
// .gitignore'da: .env.local

// ✅ Use .env.example template
// .env.example in repo, keys not in repo
```

### API Route Security
```typescript
// ✅ Validate & sanitize inputs
export async function POST(request: Request) {
  const body = await request.json();

  // Validate
  if (!body.email || !body.clinicId) {
    return Response.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Sanitize
  const email = body.email.trim().toLowerCase();

  // Authorize
  const user = await getServerUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Check role
  const profile = await getServerUserProfile();
  if (profile?.role !== 'clinic_admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Process
  // ...
}
```

### Secrets Management
```typescript
// ✅ Use Vercel Environment Variables
// Vercel Dashboard → Settings → Environment Variables

// ✅ For local dev
// Create .env.local (don't commit)
// SUPABASE_SERVICE_ROLE_KEY=...

// ❌ Never in code
const apiKey = 'sk-1234...'; // ❌ NEVER
const apiKey = process.env.API_KEY; // ✅ OK
```

---

## Performance Tips

### Code Splitting
```typescript
// ✅ Lazy load heavy components
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/Chart'), {
  loading: () => <div>Yükleniyor...</div>,
});

export default function Dashboard() {
  return <HeavyChart />;
}
```

### Query Optimization
```typescript
// ✅ Use count with head: true for pagination
const { count } = await supabaseClient
  .from('appointments')
  .select('*', { count: 'exact', head: true });

// ✅ Select only needed columns
const { data } = await supabaseClient
  .from('pets')
  .select('id, name, species'); // Not: *

// ✅ Index frequently queried columns
// Migration file includes indexes
```

### Caching Strategy
```typescript
// ✅ Use Next.js caching
export const revalidate = 60; // ISR - revalidate every 60s

// ✅ Or on-demand revalidation
import { revalidatePath } from 'next/cache';

export async function updateClinic(clinicId: string) {
  // Update database
  await updateClinicInDb(clinicId);

  // Revalidate cache
  revalidatePath(`/clinic/${clinicId}`);
}
```

### Bundle Size
```typescript
// ✅ Use small libraries
import { format } from 'date-fns'; // 13KB
// vs
import moment from 'moment'; // 67KB

// ✅ Tree-shake unused code
export const util1 = () => {};
export const util2 = () => {}; // Only imported util1? util2 removed

// ✅ Dynamic imports
const [open, setOpen] = useState(false);
if (open) {
  const Modal = await import('@/components/Modal');
  // Load only when needed
}
```

---

## Testing

### Unit Test Example
```typescript
// __tests__/lib/auth/redirect.test.ts
import { requireRole } from '@/lib/auth/redirect';
import { ROLES } from '@/lib/constants/roles';

jest.mock('@/lib/supabase/server');

describe('requireRole', () => {
  it('allows super_admin', async () => {
    // Mock getServerUserProfile to return super_admin
    // Call requireRole([ROLES.SUPER_ADMIN])
    // Assert no redirect
  });

  it('redirects non-admin', async () => {
    // Mock getServerUserProfile to return clinic_admin
    // Call requireRole([ROLES.SUPER_ADMIN])
    // Assert redirect called
  });
});
```

### E2E Test Example
```typescript
// e2e/login.spec.ts (Playwright)
import { test, expect } from '@playwright/test';

test('clinic admin can login', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  await page.fill('input[type="email"]', 'admin1@clinic1.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button:has-text("Giriş Yap")');

  await expect(page).toHaveURL('**/clinic/dashboard');
});
```

---

## Code Review Checklist

Before pushing:
- [ ] TypeScript strict mode passed
- [ ] No `any` types (except necessary cases)
- [ ] All imports used
- [ ] No console.logs in production code
- [ ] Error handling implemented
- [ ] Sensitive data not logged
- [ ] RLS policies considered
- [ ] Performance checked (no N+1)
- [ ] Mobile responsive (if UI)
- [ ] Tests written/updated

---

## Resources

- TypeScript: https://www.typescriptlang.org/docs/
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Supabase: https://supabase.com/docs
- ESLint: https://eslint.org
