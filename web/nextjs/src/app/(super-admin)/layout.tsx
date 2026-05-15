import { requireRole } from '@/lib/auth/redirect';
import { ROLES } from '@/lib/constants/roles';

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only super_admin role allowed
  await requireRole([ROLES.SUPER_ADMIN]);

  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h1>Sistem Yönetimi</h1>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <a href="/super-admin/clinics">Klinikleri Yönet</a>
          </li>
        </ul>
      </nav>
      <main>{children}</main>
    </div>
  );
}
