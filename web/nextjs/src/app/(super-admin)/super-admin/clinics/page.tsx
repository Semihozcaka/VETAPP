'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { Clinic } from '@/lib/supabase/types';

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('clinics')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setClinics(data || []);
      } catch (err) {
        console.error('Error fetching clinics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Veteriner Klinikleri</h2>
      <a href="/super-admin/clinics/new">
        <button>Yeni Klinik Ekle</button>
      </a>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Adı</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Telefon</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Durum</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {clinics.map((clinic) => (
              <tr key={clinic.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '0.5rem' }}>{clinic.name}</td>
                <td style={{ padding: '0.5rem' }}>{clinic.phone_number}</td>
                <td style={{ padding: '0.5rem' }}>
                  {clinic.is_active ? '✓ Aktif' : '✗ Pasif'}
                </td>
                <td style={{ padding: '0.5rem' }}>
                  <button>Düzenle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
