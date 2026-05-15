import { redirect } from 'next/navigation';
import { getServerUserProfile } from '@/lib/supabase/server';
import { UserRole } from '@/lib/supabase/types';
import { ROLE_ROUTES } from '@/lib/constants/roles';

/**
 * Role göre redirect yönlendir
 * User'ı kendi role'ü için doğru sayfaya yönlendir
 */
export async function redirectByRole() {
  const profile = await getServerUserProfile();

  if (!profile) {
    redirect('/login');
  }

  const redirectUrl = ROLE_ROUTES[profile.role as UserRole];
  if (redirectUrl) {
    redirect(redirectUrl);
  }

  redirect('/login');
}

/**
 * Kullanıcıyı belirtilen role'e yönelik olarak kontrol et
 * Eğer role uyuşmazsa, ilgili sayfaya redirect et
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<void> {
  const profile = await getServerUserProfile();

  if (!profile) {
    redirect('/login');
  }

  if (!allowedRoles.includes(profile.role as UserRole)) {
    // Role'e uygun sayfaya redirect et
    const redirectUrl = ROLE_ROUTES[profile.role as UserRole];
    redirect(redirectUrl || '/login');
  }
}

/**
 * Layout veya page'de kullan: geçerli user bilgisini getir
 */
export async function getCurrentUserWithAuth() {
  const profile = await getServerUserProfile();

  if (!profile) {
    redirect('/login');
  }

  return profile;
}
