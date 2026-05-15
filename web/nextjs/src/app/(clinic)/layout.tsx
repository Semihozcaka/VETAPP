import { requireRole } from '@/lib/auth/redirect';
import { ROLES } from '@/lib/constants/roles';

export default async function ClinicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only clinic_admin role allowed
  await requireRole([ROLES.CLINIC_ADMIN]);

  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h1>Klinik Yönetim Paneli</h1>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '2rem' }}>
          <li>
            <a href="/clinic/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/clinic/owners">Müşteriler</a>
          </li>
          <li>
            <a href="/clinic/pets">Hayvanlar</a>
          </li>
          <li>
            <a href="/clinic/appointments">Randevular</a>
          </li>
          <li>
            <a href="/clinic/price-requests">Fiyat Talepleri</a>
          </li>
          <li>
            <a href="/clinic/reminders">Hatırlatmalar</a>
          </li>
        </ul>
      </nav>
      <main>{children}</main>
    </div>
  );
}
