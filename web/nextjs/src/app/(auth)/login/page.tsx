'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { testSupabaseConnection } from '@/lib/supabase/connection-test';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
  const [connectionMessage, setConnectionMessage] = useState<string>('');

  // Test Supabase connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const result = await testSupabaseConnection();
      if (result.success) {
        setConnectionStatus('connected');
        setConnectionMessage(result.message);
      } else {
        setConnectionStatus('failed');
        setConnectionMessage(result.message);
      }
    };
    checkConnection();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('📝 [Login] Form submitted:', { email });
      
      // Step 1: Auth login
      console.log('🔐 [Login] Supabase auth.signInWithPassword çağrılıyor...');
      const { data, error: signInError } =
        await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        console.error('❌ [Login] Auth error:', signInError.message);
        setError(`Auth hatası: ${signInError.message}`);
        setLoading(false);
        return;
      }

      if (!data.user) {
        console.error('❌ [Login] data.user undefined');
        setError('Kullanıcı verisi alınamadı');
        setLoading(false);
        return;
      }

      console.log('✅ [Login] Auth başarılı. User ID:', data.user.id);

      // Step 2: Get user profile and role
      console.log('🔍 [Login] profiles tablosundan role çekiliyor...');
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('❌ [Login] Profile sorgusu hatası:', profileError.message);
        setError(`Profil sorgusu hatası: ${profileError.message}`);
        setLoading(false);
        return;
      }

      if (!profile) {
        console.error('❌ [Login] Profile bulunamadı');
        setError('Profil bulunamadı. Lütfen sistem yöneticisine başvurun.');
        setLoading(false);
        return;
      }

      console.log('✅ [Login] Profile bulundu. Role:', profile.role);

      // Step 3: Redirect based on role
      const roleRoutes: Record<string, string> = {
        super_admin: '/super-admin/clinics',
        clinic_admin: '/clinic/dashboard',
        pet_owner: '/pet-owner/dashboard',
      };

      const redirectUrl = roleRoutes[profile.role] || '/';
      console.log('🚀 [Login] Redirect yapılıyor:', redirectUrl);
      
      // Use window.location for redirect (more reliable than router.push)
      // This ensures cookies are properly set before redirect
      window.location.href = redirectUrl;
      console.log('✅ [Login] window.location.href set edildi');
    } catch (err: unknown) {
      console.error('❌ [Login] Catch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError(`Login başarısız: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h1>VetApp Giriş</h1>
      
      {/* Connection Status */}
      <div style={{
        marginBottom: '1rem',
        padding: '0.75rem',
        borderRadius: '4px',
        backgroundColor: connectionStatus === 'connected' ? '#e8f5e9' : connectionStatus === 'failed' ? '#ffebee' : '#e3f2fd',
        color: connectionStatus === 'connected' ? '#2e7d32' : connectionStatus === 'failed' ? '#c62828' : '#1565c0',
        fontSize: '0.875rem',
        textAlign: 'center'
      }}>
        {connectionStatus === 'checking' && '🔄 Supabase bağlantısı kontrol ediliyor...'}
        {connectionStatus === 'connected' && `✅ ${connectionMessage}`}
        {connectionStatus === 'failed' && `❌ ${connectionMessage}`}
      </div>

      {error && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.75rem',
          borderRadius: '4px',
          backgroundColor: '#ffebee',
          color: '#c62828'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Şifre:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>

      <div style={{ marginTop: '2rem', fontSize: '0.875rem' }}>
        <h3>Test Hesapları:</h3>
        <p>
          <strong>Super Admin:</strong>
          <br />
          Email: superadmin@vetapp.com
          <br />
          Password: [auth.users tablosundan]
        </p>
        <p>
          <strong>Clinic Admin:</strong>
          <br />
          Email: admin1@clinic1.com
          <br />
          Password: [auth.users tablosundan]
        </p>
      </div>
    </div>
  );
}
