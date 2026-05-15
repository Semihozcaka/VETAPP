import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL ve Anon Key tanımlanmamış. .env.local dosyasını kontrol edin.'
  );
}

export const supabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// Client-side session yönetimi için helper
export async function getSession() {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  return session;
}

// Client-side user profile bilgilerini getir
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  return user;
}

// Client-side role bilgisini getir
export async function getCurrentUserRole() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data: profile, error } = await supabaseClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user role:', error);
    return null;
  }

  return profile?.role;
}
