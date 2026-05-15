import { getCurrentUserWithAuth } from '@/lib/auth/redirect';
import { getServerUser } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';

export default async function ClinicDashboardPage() {
  const profile = await getCurrentUserWithAuth();
  const supabase = createClient();
  const user = await getServerUser();

  // Get clinic info
  const { data: clinicMember } = await supabase
    .from('clinic_members')
    .select('clinic_id')
    .eq('profile_id', user?.id)
    .single();

  const { data: clinic } = await supabase
    .from('clinics')
    .select('*')
    .eq('id', clinicMember?.clinic_id)
    .single();

  // Get stats
  const { count: appointmentCount } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('clinic_id', clinicMember?.clinic_id);

  const { count: ownerCount } = await supabase
    .from('owners')
    .select('*', { count: 'exact', head: true })
    .eq('clinic_id', clinicMember?.clinic_id);

  const { count: petCount } = await supabase
    .from('pets')
    .select('*', { count: 'exact', head: true })
    .eq('clinic_id', clinicMember?.clinic_id);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Klinik Dashboard</h2>
      
      {clinic && (
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <h3>{clinic.name}</h3>
          <p>Telefon: {clinic.phone_number}</p>
          <p>Email: {clinic.email}</p>
          <p>Adres: {clinic.address}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <h3>{appointmentCount || 0}</h3>
          <p>Randevular</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f3e5f5', borderRadius: '4px' }}>
          <h3>{ownerCount || 0}</h3>
          <p>Müşteriler</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
          <h3>{petCount || 0}</h3>
          <p>Hayvanlar</p>
        </div>
      </div>
    </div>
  );
}
