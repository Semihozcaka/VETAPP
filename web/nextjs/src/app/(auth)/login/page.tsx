'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase/client';
import { testSupabaseConnection } from '@/lib/supabase/connection-test';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
  const router = useRouter();

  // Test Supabase connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await testSupabaseConnection();
      setConnectionStatus(isConnected ? 'connected' : 'failed');
    };
    checkConnection();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } =
        await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (data.user) {
        // User profil bilgisini getir ve role'e göre yönlendir
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          const roleRoutes: Record<string, string> = {
            super_admin: '/super-admin/clinics',
            clinic_admin: '/clinic/dashboard',
            pet_owner: '/pet-owner/dashboard',
          };

          const redirectUrl = roleRoutes[profile.role] || '/';
          router.push(redirectUrl);
        }
      }
    } catch (err) {
      setError('Login başarısız. Lütfen tekrar deneyin.');
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
        {connectionStatus === 'connected' && '✅ Supabase bağlantısı başarılı'}
        {connectionStatus === 'failed' && '❌ Supabase bağlantısı başarısız. Env değişkenlerini kontrol edin.'}
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
