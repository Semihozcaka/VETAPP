import { supabaseClient } from '@/lib/supabase/client';

/**
 * Supabase bağlantısını test et
 * Development'da debug amacıyla kullanılır
 */
export async function testSupabaseConnection() {
  try {
    // Test: Sadece auth check et
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    console.log('✅ Supabase bağlantısı başarılı!');
    console.log(`📊 Session: ${session ? 'Active' : 'No session'}`);
    
    // Test: Database bağlantısını kontrol et (profiles tablo'ya basit sorgu)
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('count(*)', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.error('❌ Database sorgusu başarısız:', error.message);
      return false;
    }
    
    console.log('✅ Database bağlantısı başarılı!');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return false;
  }
}
