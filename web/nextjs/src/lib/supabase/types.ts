-- ============================================================================
-- VETAPP - Database Type Definitions (Supabase Auto Generated)
-- Bu dosya Supabase'de "SQL Editor" → "Database Types" kısmından otomatik 
-- üretilir. Aşağıda TypeScript için gerekli türler bulunmaktadır.
-- ============================================================================

import { Database } from './database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Clinic = Database['public']['Tables']['clinics']['Row'];
export type ClinicInsert = Database['public']['Tables']['clinics']['Insert'];
export type ClinicUpdate = Database['public']['Tables']['clinics']['Update'];

export type ClinicMember = Database['public']['Tables']['clinic_members']['Row'];
export type ClinicMemberInsert = Database['public']['Tables']['clinic_members']['Insert'];
export type ClinicMemberUpdate = Database['public']['Tables']['clinic_members']['Update'];

export type Owner = Database['public']['Tables']['owners']['Row'];
export type OwnerInsert = Database['public']['Tables']['owners']['Insert'];
export type OwnerUpdate = Database['public']['Tables']['owners']['Update'];

export type Pet = Database['public']['Tables']['pets']['Row'];
export type PetInsert = Database['public']['Tables']['pets']['Insert'];
export type PetUpdate = Database['public']['Tables']['pets']['Update'];

export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
export type AppointmentUpdate = Database['public']['Tables']['appointments']['Update'];

export type PriceRequest = Database['public']['Tables']['price_requests']['Row'];
export type PriceRequestInsert = Database['public']['Tables']['price_requests']['Insert'];
export type PriceRequestUpdate = Database['public']['Tables']['price_requests']['Update'];

export type HealthRecord = Database['public']['Tables']['health_records']['Row'];
export type HealthRecordInsert = Database['public']['Tables']['health_records']['Insert'];
export type HealthRecordUpdate = Database['public']['Tables']['health_records']['Update'];

export type Reminder = Database['public']['Tables']['reminders']['Row'];
export type ReminderInsert = Database['public']['Tables']['reminders']['Insert'];
export type ReminderUpdate = Database['public']['Tables']['reminders']['Update'];

export type Service = Database['public']['Tables']['services']['Row'];
export type ServiceInsert = Database['public']['Tables']['services']['Insert'];
export type ServiceUpdate = Database['public']['Tables']['services']['Update'];

export type InviteLink = Database['public']['Tables']['invite_links']['Row'];
export type InviteLinkInsert = Database['public']['Tables']['invite_links']['Insert'];
export type InviteLinkUpdate = Database['public']['Tables']['invite_links']['Update'];

// Enums
export type UserRole = 'super_admin' | 'clinic_admin' | 'pet_owner';
export type AppointmentStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
export type PriceRequestStatus = 'pending' | 'answered' | 'cancelled';
export type HealthRecordType = 'vaccination' | 'medication' | 'checkup';
