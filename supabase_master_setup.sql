-- NESTORY MASTER DATABASE SETUP
-- This script initializes the entire database schema for the Nestory Real Estate Platform.
-- Run this in the Supabase SQL Editor.

-- 1. HELPER FUNCTIONS
-- Create a function to check if the current user is an admin (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for updated_at automation
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS "profiles" (
    "id" uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    "name" text,
    "email" text,
    "role" text DEFAULT 'USER'
);

-- Ensure all columns exist in profiles
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "phone" text;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "business_name" text;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "address" text;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "license_number" text;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "website" text;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "experience" text;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "avatar_url" text;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "cover_url" text;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "bio" text;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "verification_status" text DEFAULT 'PENDING';
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'ACTIVE';
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();

ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON "profiles";
DROP POLICY IF EXISTS "Users can insert their own profile" ON "profiles";
DROP POLICY IF EXISTS "Users can update their own profile" ON "profiles";
DROP POLICY IF EXISTS "Admins can manage all profiles" ON "profiles";

CREATE POLICY "Public profiles are viewable by everyone" ON "profiles" FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON "profiles" FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON "profiles" FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON "profiles" FOR ALL USING (public.is_admin());

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- 3. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS "properties" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" text NOT NULL
);

-- Ensure all columns exist in properties
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "slug" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "category" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'FOR_SALE';
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "price" numeric DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "currency" text DEFAULT 'USD';
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "primaryImage" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "address" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "city" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "neighborhood" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "country" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "quickDescription" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "bedrooms" integer DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "bathrooms" integer DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "totalArea" numeric DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "pricePerSqft" numeric DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "internalAmenities" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "externalAmenities" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "estimatedROI" numeric DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "rentalYield" numeric DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "serviceCharges" numeric DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "propertyTax" numeric DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "hoaFees" numeric DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "mortgageEstimate" numeric DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "tenure" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "securityDeposit" numeric DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "leaseDuration" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "utilitiesIncluded" boolean DEFAULT false;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "petsAllowed" boolean DEFAULT true;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "furnishingStatus" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "availableDate" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "floorLevel" integer DEFAULT 1;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "totalFloors" integer DEFAULT 1;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "parkingSpaces" integer DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "viewType" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "energyRating" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "internetType" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "coolingSystem" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "heatingSystem" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "maintenanceFee" numeric DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "neighborhoodSafety" numeric DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "walkScore" numeric DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "transitScore" numeric DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "floodRisk" numeric DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "fireRisk" numeric DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "heatRisk" numeric DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "airQuality" numeric DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "isVerified" boolean DEFAULT false;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "rating" numeric DEFAULT 4.5;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "reviewsCount" integer DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "tags" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "ownerName" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "ownerTitle" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "ownerImage" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "ownerType" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "exteriorGallery" text[];
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "livingGallery" text[];
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "kitchenGallery" text[];
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "owner_id" uuid REFERENCES auth.users(id);
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "created_by" uuid REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();

ALTER TABLE "properties" ENABLE ROW LEVEL SECURITY;

-- Properties Policies
DROP POLICY IF EXISTS "Allow public select properties" ON "properties";
DROP POLICY IF EXISTS "Allow authenticated to insert properties" ON "properties";
DROP POLICY IF EXISTS "Allow owners and admins to update properties" ON "properties";
DROP POLICY IF EXISTS "Allow owners and admins to delete properties" ON "properties";

CREATE POLICY "Allow public select properties" ON "properties" FOR SELECT USING (true);
CREATE POLICY "Allow authenticated to insert properties" ON "properties" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow owners and admins to update properties" ON "properties" FOR UPDATE USING (auth.uid() = owner_id OR public.is_admin());
CREATE POLICY "Allow owners and admins to delete properties" ON "properties" FOR DELETE USING (auth.uid() = owner_id OR public.is_admin());

CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);

DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- 4. BOOKINGS (LEADS) TABLE
CREATE TABLE IF NOT EXISTS "bookings" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "property_id" uuid REFERENCES properties(id) ON DELETE CASCADE
);

ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "guest_name" text NOT NULL;
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "guest_email" text NOT NULL;
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "guest_phone" text;
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "check_in" date;
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "check_out" date;
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'PENDING';
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "total_amount" numeric DEFAULT 0;
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "type" text DEFAULT 'VIEWING';
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();

ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;

-- Bookings Policies
DROP POLICY IF EXISTS "Allow public to create leads" ON "bookings";
DROP POLICY IF EXISTS "Owners can see leads for their properties" ON "bookings";
DROP POLICY IF EXISTS "Admins can manage all leads" ON "bookings";

CREATE POLICY "Allow public to create leads" ON "bookings" FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can see leads for their properties" ON "bookings" FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = bookings.property_id 
    AND properties.owner_id = auth.uid()
  ) OR public.is_admin()
);
CREATE POLICY "Admins can manage all leads" ON "bookings" FOR ALL USING (public.is_admin());

-- 5. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS "system_settings" (
    "key" text PRIMARY KEY,
    "value" jsonb,
    "updated_at" timestamptz DEFAULT now()
);

ALTER TABLE "system_settings" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can read settings" ON "system_settings";
DROP POLICY IF EXISTS "Admins can manage settings" ON "system_settings";

CREATE POLICY "Everyone can read settings" ON "system_settings" FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON "system_settings" FOR ALL USING (public.is_admin());

-- 6. INITIAL SYSTEM SETTINGS
INSERT INTO "system_settings" (key, value) VALUES 
('general', '{"admin_email": "admin@nestory.com", "support_phone": "+1 234 567 890", "branding_name": "Nestory"}'),
('security', '{"mfa_enabled": false, "password_policy": "STRICT", "session_timeout": "2h"}'),
('notifications', '{"email_alerts": true, "booking_confirmations": true, "lead_notifications": true}'),
('payments', '{"currency": "USD", "gateway": "STRIPE", "tax_rate": "5"}')
ON CONFLICT (key) DO NOTHING;

-- 7. AUTH AUTOMATION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', COALESCE(new.raw_user_meta_data->>'role', 'USER'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  END IF;
END $$;

-- 8. ENABLE REALTIME
-- This ensures that the dashboard updates instantly when data changes
BEGIN;
  -- Remove existing publication if any to avoid errors on re-run
  DROP PUBLICATION IF EXISTS supabase_realtime;
  
  -- Create publication for all tables we want to track
  CREATE PUBLICATION supabase_realtime FOR TABLE profiles, properties, bookings;
COMMIT;
