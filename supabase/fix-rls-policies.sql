-- =============================================
-- FIX RLS POLICIES - Allow Public Read for Profiles
-- =============================================

-- Drop existing policies that might be blocking
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Admin full access profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create fresh policies

-- 1. Everyone can SELECT (read) profiles - IMPORTANT for login username lookup
CREATE POLICY "Public can view profiles" ON profiles
FOR SELECT USING (true);

-- 2. Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- 3. Users can insert their own profile (for trigger)
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Admin can do everything
CREATE POLICY "Admin full access" ON profiles
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'superadmin')
    )
);

-- Verify RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Test query
SELECT id, username, email, role FROM profiles LIMIT 5;
