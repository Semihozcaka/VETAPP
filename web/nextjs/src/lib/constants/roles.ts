import { UserRole } from './types';

export const ROLES = {
  SUPER_ADMIN: 'super_admin' as UserRole,
  CLINIC_ADMIN: 'clinic_admin' as UserRole,
  PET_OWNER: 'pet_owner' as UserRole,
};

export const ROLE_NAMES: Record<UserRole, string> = {
  super_admin: 'Sistem Yöneticisi',
  clinic_admin: 'Klinik Yöneticisi',
  pet_owner: 'Hayvan Sahibi',
};

// Role tabanlı routes tanımı
export const ROLE_ROUTES: Record<UserRole, string> = {
  super_admin: '/super-admin/clinics',
  clinic_admin: '/clinic/dashboard',
  pet_owner: '/pet-owner/dashboard',
};

// Public routes (authentication olmadan erişilebilir)
export const PUBLIC_ROUTES = ['/login', '/register', '/join'];

// Protected routes
export const PROTECTED_ROUTES = ['/super-admin', '/clinic', '/pet-owner'];
