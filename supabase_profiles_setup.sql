-- Create Profiles Table to store extended user data
CREATE TABLE IF NOT EXISTS "profiles" (
    "id" uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    "name" text,
    "email" text,
    "phone" text,
    "role" text DEFAULT 'USER', -- ADMIN, AGENCY, USER
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

-- Enable RLS
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check admin status
-- This bypasses RLS to prevent recursion
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

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" ON "profiles" FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON "profiles" FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON "profiles" FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can do everything" ON "profiles" FOR ALL USING (public.is_admin());

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Automate profile creation on signup (Optional but recommended)
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
