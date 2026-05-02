-- NESTORY CLEAN SLATE SETUP (CAUTION: DELETES ALL DATA)
-- This script wipes the public schema and rebuilds it correctly to ensure no conflicts.
-- Run this in the Supabase SQL Editor.

-- 1. NUKE EVERYTHING IN PUBLIC SCHEMA
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;

-- 2. HELPER FUNCTIONS
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

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. PROFILES TABLE
CREATE TABLE "profiles" (
    "id" uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    "name" text,
    "email" text,
    "phone" text,
    "role" text DEFAULT 'USER',
    "business_name" text,
    "address" text,
    "license_number" text,
    "website" text,
    "experience" text,
    "avatar_url" text,
    "cover_url" text,
    "bio" text,
    "verification_status" text DEFAULT 'PENDING',
    "status" text DEFAULT 'ACTIVE',
    "created_at" timestamptz DEFAULT now(),
    "updated_at" timestamptz DEFAULT now()
);

ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON "profiles" FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON "profiles" FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON "profiles" FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON "profiles" FOR ALL USING (public.is_admin());

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 4. PROPERTIES TABLE
CREATE TABLE "properties" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" text NOT NULL,
    "slug" text UNIQUE,
    "category" text,
    "status" text DEFAULT 'FOR_SALE',
    "price" numeric DEFAULT 0,
    "currency" text DEFAULT 'USD',
    "primaryImage" text,
    "address" text,
    "city" text,
    "neighborhood" text,
    "country" text,
    "description" text,
    "quickDescription" text,
    "bedrooms" integer DEFAULT 0,
    "bathrooms" integer DEFAULT 0,
    "totalArea" numeric DEFAULT 0,
    "pricePerSqft" numeric DEFAULT 0,
    "internalAmenities" text,
    "externalAmenities" text,
    "estimatedROI" numeric DEFAULT 0,
    "rentalYield" numeric DEFAULT 0,
    "serviceCharges" numeric DEFAULT 0,
    "propertyTax" numeric DEFAULT 0,
    "hoaFees" numeric DEFAULT 0,
    "mortgageEstimate" numeric DEFAULT 0,
    "tenure" text,
    "securityDeposit" numeric DEFAULT 0,
    "leaseDuration" text,
    "utilitiesIncluded" boolean DEFAULT false,
    "petsAllowed" boolean DEFAULT true,
    "furnishingStatus" text,
    "availableDate" text,
    "floorLevel" integer DEFAULT 1,
    "totalFloors" integer DEFAULT 1,
    "parkingSpaces" integer DEFAULT 0,
    "viewType" text,
    "energyRating" text,
    "internetType" text,
    "coolingSystem" text,
    "heatingSystem" text,
    "maintenanceFee" numeric DEFAULT 0,
    "neighborhoodSafety" numeric DEFAULT 0,
    "walkScore" numeric DEFAULT 0,
    "transitScore" numeric DEFAULT 0,
    "floodRisk" numeric DEFAULT 0,
    "fireRisk" numeric DEFAULT 0,
    "heatRisk" numeric DEFAULT 0,
    "airQuality" numeric DEFAULT 0,
    "isVerified" boolean DEFAULT false,
    "rating" numeric DEFAULT 4.5,
    "reviewsCount" integer DEFAULT 0,
    "tags" text,
    "ownerName" text,
    "ownerTitle" text,
    "ownerImage" text,
    "ownerType" text,
    "exteriorGallery" text[],
    "livingGallery" text[],
    "kitchenGallery" text[],
    "owner_id" uuid REFERENCES auth.users(id),
    "created_by" uuid REFERENCES auth.users(id),
    "created_at" timestamptz DEFAULT now(),
    "updated_at" timestamptz DEFAULT now()
);

ALTER TABLE "properties" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select properties" ON "properties" FOR SELECT USING (true);
CREATE POLICY "Allow authenticated to insert properties" ON "properties" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow owners and admins to update properties" ON "properties" FOR UPDATE USING (auth.uid() = owner_id OR public.is_admin());
CREATE POLICY "Allow owners and admins to delete properties" ON "properties" FOR DELETE USING (auth.uid() = owner_id OR public.is_admin());

CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 5. BOOKINGS (LEADS) TABLE
CREATE TABLE "bookings" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "property_id" uuid REFERENCES properties(id) ON DELETE CASCADE,
    "guest_name" text NOT NULL,
    "guest_email" text NOT NULL,
    "guest_phone" text,
    "check_in" date,
    "check_out" date,
    "status" text DEFAULT 'PENDING',
    "total_amount" numeric DEFAULT 0,
    "type" text DEFAULT 'VIEWING',
    "created_at" timestamptz DEFAULT now()
);

ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public to create leads" ON "bookings" FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can see leads for their properties" ON "bookings" FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = bookings.property_id 
    AND properties.owner_id = auth.uid()
  ) OR public.is_admin()
);
CREATE POLICY "Admins can manage all leads" ON "bookings" FOR ALL USING (public.is_admin());

-- 6. SYSTEM SETTINGS TABLE
CREATE TABLE "system_settings" (
    "key" text PRIMARY KEY,
    "value" jsonb,
    "updated_at" timestamptz DEFAULT now()
);

ALTER TABLE "system_settings" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can read settings" ON "system_settings" FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON "system_settings" FOR ALL USING (public.is_admin());

INSERT INTO "system_settings" (key, value) VALUES 
('general', '{"admin_email": "admin@nestory.com", "branding_name": "Nestory"}'),
('security', '{"mfa_enabled": false, "password_policy": "STRICT"}'),
('notifications', '{"email_alerts": true}'),
('payments', '{"currency": "USD", "gateway": "STRIPE"}');

-- 7. AUTH AUTOMATION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', COALESCE(new.raw_user_meta_data->>'role', 'USER'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. ENABLE REALTIME
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE profiles, properties, bookings;
