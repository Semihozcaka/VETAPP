// ============================================================================
// VETAPP - TypeScript Type Definitions & Re-exports
// Database types from database.types.ts
// ============================================================================

import { Database } from './database.types';

// Re-export database types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Clinic = Database['public']['Tables']['clinics']['Row'];
export type ClinicMember = Database['public']['Tables']['clinic_members']['Row'];
export type Owner = Database['public']['Tables']['owners']['Row'];
export type Pet = Database['public']['Tables']['pets']['Row'];
export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type PriceRequest = Database['public']['Tables']['price_requests']['Row'];

// Enums
export type UserRole = 'super_admin' | 'clinic_admin' | 'pet_owner';
export type AppointmentStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
export type PriceRequestStatus = 'pending' | 'quoted' | 'accepted' | 'rejected';
export type HealthRecordType = 'vaccination' | 'medication' | 'check_up' | 'surgery' | 'lab_work' | 'other';
