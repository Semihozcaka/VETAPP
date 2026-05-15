import { getCurrentUserWithAuth } from '@/lib/auth/redirect';
import { getServerUser } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ClinicDashboardPage() {
  const profile = await getCurrentUserWithAuth();
  const supabase = createClient();
  const user = await getServerUser();

  if (!user?.id) {
    redirect('/login');
  }

  // Get clinic info
  const { data: clinicMember, error: memberError } = await supabase
    .from('clinic_members')
    .select('clinic_id')
    .eq('profile_id', user.id)
    .single();

  if (memberError || !clinicMember?.clinic_id) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#d32f2f' }}>
        <h2>Hata</h2>
        <p>Klinik bilgisi bulunamadı. Lütfen sistem yöneticisine başvurun.</p>
      </div>
    );
  }

  const clinicId = clinicMember.clinic_id;

  const { data: clinic, error: clinicError } = await supabase
    .from('clinics')
    .select('*')
    .eq('id', clinicId)
    .single();

  if (clinicError || !clinic) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#d32f2f' }}>
        <h2>Hata</h2>
        <p>Klinik verisi alınamadı. Lütfen tekrar deneyiniz.</p>
      </div>
    );
  }

  // Get stats
  const { count: appointmentCount, error: appointmentError } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('clinic_id', clinicId);

  const { count: ownerCount, error: ownerError } = await supabase
    .from('owners')
    .select('*', { count: 'exact', head: true })
    .eq('clinic_id', clinicId);

  const { count: petCount, error: petError } = await supabase
    .from('pets')
    .select('*', { count: 'exact', head: true })
    .eq('clinic_id', clinicId);

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
