import { redirect } from 'next/navigation';
import { getServerUserProfile } from '@/lib/supabase/server';
import { ROLE_ROUTES } from '@/lib/constants/roles';
import { UserRole } from '@/lib/supabase/types';

/**
 * Home page - Auto redirect to role dashboard
 */
export default async function Home() {
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
