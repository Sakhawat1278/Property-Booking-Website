-- Fix infinite recursion in profiles policy
-- Drop the problematic policy first
DROP POLICY IF EXISTS "Admins can do everything" ON "profiles";

-- Create a security definer function to check admin status
-- This bypasses RLS to prevent recursion
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create the policy using the function
CREATE POLICY "Admins can do everything" 
ON "profiles" 
FOR ALL 
TO authenticated
USING (public.check_is_admin());

-- Also ensure public select is allowed for profiles (needed for initial login/fetch)
-- (Already exists, but good to ensure)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON "profiles";
CREATE POLICY "Public profiles are viewable by everyone" ON "profiles" FOR SELECT USING (true);
