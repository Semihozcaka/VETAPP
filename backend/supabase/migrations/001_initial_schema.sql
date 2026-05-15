-- ============================================================================
-- VETAPP - Veteriner Klinik Yönetim Sistemi
-- Initial Database Schema with RLS
-- ============================================================================

-- ============================================================================
-- 1. ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('super_admin', 'clinic_admin', 'pet_owner');

CREATE TYPE appointment_status AS ENUM (
  'pending',      -- Pet owner tarafından talep edilen
  'approved',     -- Clinic admin tarafından onaylanan
  'rejected',     -- Clinic admin tarafından reddedilen
  'completed',    -- Randevu gerçekleşen
  'cancelled'     -- İptal edilen
);

CREATE TYPE price_request_status AS ENUM (
  'pending',      -- Pet owner tarafından talep edilen
  'answered',     -- Clinic admin tarafından cevaplanan
  'cancelled'     -- İptal edilen
);

CREATE TYPE health_record_type AS ENUM (
  'vaccination',  -- Aşı
  'medication',   -- İlaç
  'checkup'       -- Kontrol/Muayene
);

-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- Auth profiles (Supabase Auth'ten)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'pet_owner',
  full_name TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Veteriner Klinikleri
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone_number TEXT,
  email TEXT,
  owner_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Klinik Üyeleri (Clinic Admin)
CREATE TABLE clinic_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'clinic_admin',
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clinic_id, profile_id)
);

-- Pet Owners (Müşteriler)
CREATE TABLE owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hayvanlar
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL, -- Köpek, Kedi, vb.
  breed TEXT,
  birth_date DATE,
  weight DECIMAL(5, 2), -- kg cinsinden
  microchip_id TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Randevular
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status appointment_status DEFAULT 'pending',
  reason_for_visit TEXT,
  notes TEXT,
  created_by UUID, -- Pet owner veya clinic admin
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fiyat Talepleri
CREATE TABLE price_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE SET NULL,
  service_description TEXT NOT NULL,
  status price_request_status DEFAULT 'pending',
  quote_price DECIMAL(10, 2),
  quote_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answered_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sağlık Kayıtları (Aşı, İlaç, Kontrol)
CREATE TABLE health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  record_type health_record_type NOT NULL,
  description TEXT NOT NULL,
  administered_date DATE NOT NULL,
  next_due_date DATE, -- Aşılar için takvim hatırlatması
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hatırlatmalar
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL, -- 'vaccination', 'medication', 'appointment'
  title TEXT NOT NULL,
  description TEXT,
  reminder_date DATE NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hizmetler (Clinic tarafından sunulan)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Davet Linkleri (QR, Davet Kodu)
CREATE TABLE invite_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  link_type TEXT NOT NULL DEFAULT 'invite', -- 'qr', 'invite'
  is_active BOOLEAN DEFAULT true,
  max_uses INTEGER, -- NULL = sınırsız
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. INDEXES
-- ============================================================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

CREATE INDEX idx_clinics_created_by ON clinics(created_by);
CREATE INDEX idx_clinics_is_active ON clinics(is_active);

CREATE INDEX idx_clinic_members_clinic_id ON clinic_members(clinic_id);
CREATE INDEX idx_clinic_members_profile_id ON clinic_members(profile_id);
CREATE INDEX idx_clinic_members_is_active ON clinic_members(is_active);

CREATE INDEX idx_owners_clinic_id ON owners(clinic_id);
CREATE INDEX idx_owners_profile_id ON owners(profile_id);
CREATE INDEX idx_owners_is_active ON owners(is_active);

CREATE INDEX idx_pets_clinic_id ON pets(clinic_id);
CREATE INDEX idx_pets_owner_id ON pets(owner_id);
CREATE INDEX idx_pets_is_active ON pets(is_active);

CREATE INDEX idx_appointments_clinic_id ON appointments(clinic_id);
CREATE INDEX idx_appointments_pet_id ON appointments(pet_id);
CREATE INDEX idx_appointments_owner_id ON appointments(owner_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);

CREATE INDEX idx_price_requests_clinic_id ON price_requests(clinic_id);
CREATE INDEX idx_price_requests_owner_id ON price_requests(owner_id);
CREATE INDEX idx_price_requests_status ON price_requests(status);

CREATE INDEX idx_health_records_clinic_id ON health_records(clinic_id);
CREATE INDEX idx_health_records_pet_id ON health_records(pet_id);
CREATE INDEX idx_health_records_type ON health_records(record_type);

CREATE INDEX idx_reminders_clinic_id ON reminders(clinic_id);
CREATE INDEX idx_reminders_owner_id ON reminders(owner_id);
CREATE INDEX idx_reminders_pet_id ON reminders(pet_id);
CREATE INDEX idx_reminders_date ON reminders(reminder_date);
CREATE INDEX idx_reminders_is_completed ON reminders(is_completed);

CREATE INDEX idx_services_clinic_id ON services(clinic_id);
CREATE INDEX idx_services_is_active ON services(is_active);

CREATE INDEX idx_invite_links_clinic_id ON invite_links(clinic_id);
CREATE INDEX idx_invite_links_code ON invite_links(code);
CREATE INDEX idx_invite_links_is_active ON invite_links(is_active);

-- ============================================================================
-- 4. ENABLE RLS
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_links ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. RLS POLICIES
-- ============================================================================

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================

-- Super admin bütün profileları görebilir
CREATE POLICY "super_admin_view_all_profiles"
  ON profiles FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Kullanıcılar kendi profillerini görebilir
CREATE POLICY "users_view_own_profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- Clinic admin kendi kliniğinin üyelerini görebilir
CREATE POLICY "clinic_admin_view_clinic_members"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clinic_members
      WHERE clinic_members.profile_id = auth.uid()
      AND clinic_members.role = 'clinic_admin'
      AND clinic_members.is_active = true
    )
    AND id IN (
      SELECT profile_id FROM clinic_members
      WHERE clinic_id IN (
        SELECT clinic_id FROM clinic_members
        WHERE profile_id = auth.uid()
        AND role = 'clinic_admin'
        AND is_active = true
      )
    )
  );

-- Sadece super admin yeni kullanıcı oluşturabilir
CREATE POLICY "super_admin_create_profiles"
  ON profiles FOR INSERT
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- ============================================================================
-- CLINICS TABLE
-- ============================================================================

-- Super admin bütün klinikleri görebilir
CREATE POLICY "super_admin_view_all_clinics"
  ON clinics FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Clinic admin kendi kliniğini görebilir
CREATE POLICY "clinic_admin_view_own_clinic"
  ON clinics FOR SELECT
  USING (
    id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- Super admin klinik oluşturabilir
CREATE POLICY "super_admin_create_clinics"
  ON clinics FOR INSERT
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Super admin klinik güncelleyebilir
CREATE POLICY "super_admin_update_clinics"
  ON clinics FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- ============================================================================
-- CLINIC_MEMBERS TABLE
-- ============================================================================

-- Super admin bütün clinic members'ı görebilir
CREATE POLICY "super_admin_view_all_clinic_members"
  ON clinic_members FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Clinic admin kendi kliniğinin üyelerini görebilir
CREATE POLICY "clinic_admin_view_clinic_members"
  ON clinic_members FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- Super admin clinic member ekleyebilir
CREATE POLICY "super_admin_create_clinic_members"
  ON clinic_members FOR INSERT
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Super admin clinic member güncelleyebilir
CREATE POLICY "super_admin_update_clinic_members"
  ON clinic_members FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- ============================================================================
-- OWNERS TABLE
-- ============================================================================

-- Super admin bütün owners'ı görebilir
CREATE POLICY "super_admin_view_all_owners"
  ON owners FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Clinic admin kendi kliniğinin owners'ını görebilir
CREATE POLICY "clinic_admin_view_clinic_owners"
  ON owners FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- Pet owner sadece kendisine ait owner kaydını görebilir
CREATE POLICY "pet_owner_view_own_owner"
  ON owners FOR SELECT
  USING (
    profile_id = auth.uid()
    AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'pet_owner'
  );

-- Clinic admin owner ekleyebilir
CREATE POLICY "clinic_admin_create_owners"
  ON owners FOR INSERT
  WITH CHECK (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- Clinic admin owner güncelleyebilir
CREATE POLICY "clinic_admin_update_owners"
  ON owners FOR UPDATE
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- Pet owner kendi verilerini güncelleyebilir
CREATE POLICY "pet_owner_update_own_owner"
  ON owners FOR UPDATE
  USING (
    profile_id = auth.uid()
    AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'pet_owner'
  );

-- ============================================================================
-- PETS TABLE
-- ============================================================================

-- Super admin bütün pets'i görebilir
CREATE POLICY "super_admin_view_all_pets"
  ON pets FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Clinic admin kendi kliniğinin pets'ini görebilir
CREATE POLICY "clinic_admin_view_clinic_pets"
  ON pets FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- Pet owner sadece kendisine ait pets'i görebilir
CREATE POLICY "pet_owner_view_own_pets"
  ON pets FOR SELECT
  USING (
    owner_id IN (
      SELECT id FROM owners
      WHERE profile_id = auth.uid()
      AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'pet_owner'
    )
  );

-- Clinic admin pet ekleyebilir
CREATE POLICY "clinic_admin_create_pets"
  ON pets FOR INSERT
  WITH CHECK (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- Clinic admin pet güncelleyebilir
CREATE POLICY "clinic_admin_update_pets"
  ON pets FOR UPDATE
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- ============================================================================
-- APPOINTMENTS TABLE
-- ============================================================================

-- Super admin bütün appointments'ları görebilir
CREATE POLICY "super_admin_view_all_appointments"
  ON appointments FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Clinic admin kendi kliniğinin appointments'ını görebilir
CREATE POLICY "clinic_admin_view_clinic_appointments"
  ON appointments FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- Pet owner kendi appointments'ını görebilir
CREATE POLICY "pet_owner_view_own_appointments"
  ON appointments FOR SELECT
  USING (
    owner_id IN (
      SELECT id FROM owners
      WHERE profile_id = auth.uid()
      AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'pet_owner'
    )
  );

-- Clinic admin appointment ekleyebilir
CREATE POLICY "clinic_admin_create_appointments"
  ON appointments FOR INSERT
  WITH CHECK (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- Pet owner randevu talebinde bulunabilir (pending status)
CREATE POLICY "pet_owner_create_appointment_request"
  ON appointments FOR INSERT
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'pet_owner'
    AND status = 'pending'
    AND owner_id IN (
      SELECT id FROM owners
      WHERE profile_id = auth.uid()
    )
  );

-- Clinic admin appointment güncelleyebilir
CREATE POLICY "clinic_admin_update_appointments"
  ON appointments FOR UPDATE
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- ============================================================================
-- PRICE_REQUESTS TABLE
-- ============================================================================

-- Super admin bütün price requests'i görebilir
CREATE POLICY "super_admin_view_all_price_requests"
  ON price_requests FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Clinic admin kendi kliniğinin price requests'ini görebilir
CREATE POLICY "clinic_admin_view_clinic_price_requests"
  ON price_requests FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- Pet owner kendi price requests'ini görebilir
CREATE POLICY "pet_owner_view_own_price_requests"
  ON price_requests FOR SELECT
  USING (
    owner_id IN (
      SELECT id FROM owners
      WHERE profile_id = auth.uid()
      AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'pet_owner'
    )
  );

-- Pet owner price request oluşturabilir
CREATE POLICY "pet_owner_create_price_request"
  ON price_requests FOR INSERT
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'pet_owner'
    AND owner_id IN (
      SELECT id FROM owners
      WHERE profile_id = auth.uid()
    )
  );

-- Clinic admin price request güncelleyebilir
CREATE POLICY "clinic_admin_update_price_requests"
  ON price_requests FOR UPDATE
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- ============================================================================
-- HEALTH_RECORDS TABLE
-- ============================================================================

-- Super admin bütün health records'ı görebilir
CREATE POLICY "super_admin_view_all_health_records"
  ON health_records FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Clinic admin kendi kliniğinin health records'ını görebilir
CREATE POLICY "clinic_admin_view_clinic_health_records"
  ON health_records FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- Pet owner kendi health records'ını görebilir
CREATE POLICY "pet_owner_view_own_health_records"
  ON health_records FOR SELECT
  USING (
    pet_id IN (
      SELECT id FROM pets
      WHERE owner_id IN (
        SELECT id FROM owners
        WHERE profile_id = auth.uid()
        AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'pet_owner'
      )
    )
  );

-- Clinic admin health record ekleyebilir
CREATE POLICY "clinic_admin_create_health_records"
  ON health_records FOR INSERT
  WITH CHECK (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- Clinic admin health record güncelleyebilir
CREATE POLICY "clinic_admin_update_health_records"
  ON health_records FOR UPDATE
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- ============================================================================
-- REMINDERS TABLE
-- ============================================================================

-- Super admin bütün reminders'ı görebilir
CREATE POLICY "super_admin_view_all_reminders"
  ON reminders FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Clinic admin kendi kliniğinin reminders'ını görebilir
CREATE POLICY "clinic_admin_view_clinic_reminders"
  ON reminders FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- Pet owner kendi reminders'ını görebilir
CREATE POLICY "pet_owner_view_own_reminders"
  ON reminders FOR SELECT
  USING (
    owner_id IN (
      SELECT id FROM owners
      WHERE profile_id = auth.uid()
      AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'pet_owner'
    )
  );

-- Clinic admin reminder ekleyebilir
CREATE POLICY "clinic_admin_create_reminders"
  ON reminders FOR INSERT
  WITH CHECK (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- Clinic admin reminder güncelleyebilir
CREATE POLICY "clinic_admin_update_reminders"
  ON reminders FOR UPDATE
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- Pet owner reminder'ı tamamlayabilir
CREATE POLICY "pet_owner_update_own_reminders"
  ON reminders FOR UPDATE
  USING (
    owner_id IN (
      SELECT id FROM owners
      WHERE profile_id = auth.uid()
      AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'pet_owner'
    )
  );

-- ============================================================================
-- SERVICES TABLE
-- ============================================================================

-- Super admin bütün services'i görebilir
CREATE POLICY "super_admin_view_all_services"
  ON services FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Clinic admin kendi kliniğinin services'ini görebilir
CREATE POLICY "clinic_admin_view_clinic_services"
  ON services FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- Pet owner active services'i görebilir
CREATE POLICY "pet_owner_view_clinic_services"
  ON services FOR SELECT
  USING (
    is_active = true
    AND clinic_id IN (
      SELECT clinic_id FROM owners
      WHERE profile_id = auth.uid()
      AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'pet_owner'
    )
  );

-- Clinic admin service ekleyebilir
CREATE POLICY "clinic_admin_create_services"
  ON services FOR INSERT
  WITH CHECK (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- Clinic admin service güncelleyebilir
CREATE POLICY "clinic_admin_update_services"
  ON services FOR UPDATE
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- ============================================================================
-- INVITE_LINKS TABLE
-- ============================================================================

-- Super admin bütün invite links'i görebilir
CREATE POLICY "super_admin_view_all_invite_links"
  ON invite_links FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Clinic admin kendi kliniğinin invite links'ini görebilir
CREATE POLICY "clinic_admin_view_clinic_invite_links"
  ON invite_links FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- Clinic admin invite link oluşturabilir
CREATE POLICY "clinic_admin_create_invite_links"
  ON invite_links FOR INSERT
  WITH CHECK (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- Clinic admin invite link güncelleyebilir
CREATE POLICY "clinic_admin_update_invite_links"
  ON invite_links FOR UPDATE
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE profile_id = auth.uid()
      AND role = 'clinic_admin'
      AND is_active = true
    )
  );

-- ============================================================================
-- 6. TRIGGERS (updated_at otomatik update)
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER clinics_updated_at
  BEFORE UPDATE ON clinics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER clinic_members_updated_at
  BEFORE UPDATE ON clinic_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER owners_updated_at
  BEFORE UPDATE ON owners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER pets_updated_at
  BEFORE UPDATE ON pets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER price_requests_updated_at
  BEFORE UPDATE ON price_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER health_records_updated_at
  BEFORE UPDATE ON health_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER reminders_updated_at
  BEFORE UPDATE ON reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER invite_links_updated_at
  BEFORE UPDATE ON invite_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
