export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'super_admin' | 'clinic_admin' | 'pet_owner';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          role: 'super_admin' | 'clinic_admin' | 'pet_owner';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      clinics: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          address: string | null;
          phone_number: string | null;
          email: string | null;
          owner_name: string | null;
          is_active: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          address?: string | null;
          phone_number?: string | null;
          email?: string | null;
          owner_name?: string | null;
          is_active?: boolean;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['clinics']['Insert']>;
      };
      clinic_members: {
        Row: {
          id: string;
          clinic_id: string;
          profile_id: string;
          role: 'super_admin' | 'clinic_admin' | 'pet_owner';
          is_active: boolean;
          joined_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          profile_id: string;
          role?: 'super_admin' | 'clinic_admin' | 'pet_owner';
          is_active?: boolean;
          joined_at?: string;
        };
        Update: Partial<Database['public']['Tables']['clinic_members']['Insert']>;
      };
      owners: {
        Row: {
          id: string;
          clinic_id: string;
          profile_id: string | null;
          full_name: string;
          phone_number: string | null;
          email: string | null;
          address: string | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          profile_id?: string | null;
          full_name: string;
          phone_number?: string | null;
          email?: string | null;
          address?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['owners']['Insert']>;
      };
      pets: {
        Row: {
          id: string;
          clinic_id: string;
          owner_id: string;
          name: string;
          species: string;
          breed: string | null;
          birth_date: string | null;
          weight: number | null;
          microchip_id: string | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          owner_id: string;
          name: string;
          species: string;
          breed?: string | null;
          birth_date?: string | null;
          weight?: number | null;
          microchip_id?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['pets']['Insert']>;
      };
      appointments: {
        Row: {
          id: string;
          clinic_id: string;
          pet_id: string;
          owner_id: string;
          appointment_date: string;
          status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
          reason_for_visit: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          pet_id: string;
          owner_id: string;
          appointment_date: string;
          status?: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
          reason_for_visit?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['appointments']['Insert']>;
      };
      price_requests: {
        Row: {
          id: string;
          clinic_id: string;
          owner_id: string;
          pet_id: string | null;
          service_description: string;
          status: 'pending' | 'quoted' | 'accepted' | 'rejected';
          quote_price: number | null;
          quote_notes: string | null;
          created_at: string;
          answered_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          owner_id: string;
          pet_id?: string | null;
          service_description: string;
          status?: 'pending' | 'quoted' | 'accepted' | 'rejected';
          quote_price?: number | null;
          quote_notes?: string | null;
          created_at?: string;
          answered_at?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['price_requests']['Insert']>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      user_role: 'super_admin' | 'clinic_admin' | 'pet_owner';
      appointment_status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
      price_request_status: 'pending' | 'quoted' | 'accepted' | 'rejected';
      health_record_type: 'vaccination' | 'medication' | 'check_up' | 'surgery' | 'lab_work' | 'other';
    };
    CompositeTypes: {};
  };
}
