import { supabaseClient } from '@/lib/supabase/client';

/**
 * Supabase bağlantısını test et
 * Login öncesi env değişkenlerinin doğru olup olmadığını kontrol
 * 
 * Note: Login olmadan table query yapma (RLS policy nedeniyle fail olur)
 * Sadece client initialization ve auth session check'i yap
 */
export interface ConnectionTestResult {
  success: boolean;
  message: string;
}

export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  try {
    // Step 1: Env değişkenleri var mı?
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return {
        success: false,
        message: 'Env değişkenleri eksik: NEXT_PUBLIC_SUPABASE_URL veya NEXT_PUBLIC_SUPABASE_ANON_KEY',
      };
    }

    // Step 2: Auth session kontrol
    // Bu işlem auth tablosuna sorgu yapmaz, sadece cookie'den session okur
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

    if (sessionError) {
      console.warn('⚠️ Auth session check warning:', sessionError.message);
      // Session error normal - kullanıcı henüz login yapmamış
    }

    console.log('✅ Supabase bağlantısı başarılı');
    console.log(`📊 Session: ${session ? 'Active' : 'None (not logged in)'}`);

    return {
      success: true,
      message: 'Supabase bağlantısı başarılı',
    };
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return {
      success: false,
      message: 'Supabase bağlantısı başarısız. Lütfen env değişkenlerini kontrol edin.',
    };
  }
}
