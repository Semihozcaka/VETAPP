# Database Types for Supabase
# Bu dosya Supabase CLI aracılığıyla otomatik olarak oluşturulur
# Komut: supabase gen types typescript --project-id YOUR_PROJECT_ID > database.types.ts
# 
# Henüz oluşturulmadıysa, aşağıdaki komut çalıştırın:
# npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/database.types.ts

export type Database = {
  public: {
    Tables: {
      profiles: { Row: any; Insert: any; Update: any };
      clinics: { Row: any; Insert: any; Update: any };
      clinic_members: { Row: any; Insert: any; Update: any };
      owners: { Row: any; Insert: any; Update: any };
      pets: { Row: any; Insert: any; Update: any };
      appointments: { Row: any; Insert: any; Update: any };
      price_requests: { Row: any; Insert: any; Update: any };
      health_records: { Row: any; Insert: any; Update: any };
      reminders: { Row: any; Insert: any; Update: any };
      services: { Row: any; Insert: any; Update: any };
      invite_links: { Row: any; Insert: any; Update: any };
    };
  };
};
