-- =============================================
-- BAGOES ESPORTS - DATABASE FIX
-- Jalankan SEMUA SQL ini di Supabase SQL Editor
-- =============================================

-- 1. Tambah kolom email ke profiles (jika belum ada)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;

-- 2. Sinkronkan email dari auth.users ke profiles
UPDATE profiles 
SET email = au.email 
FROM auth.users au 
WHERE profiles.id = au.id;

-- 3. Update trigger untuk menyimpan email saat user baru mendaftar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RLS Policy - Admin dapat manage semua events
DROP POLICY IF EXISTS "Admin can manage all events" ON events;
CREATE POLICY "Admin can manage all events" ON events
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'superadmin')
    )
);

-- 5. RLS Policy - Admin dapat manage semua event_registrations
DROP POLICY IF EXISTS "Admin can manage all registrations" ON event_registrations;
CREATE POLICY "Admin can manage all registrations" ON event_registrations
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'superadmin')
    )
);

-- 6. RLS Policy - Admin dapat manage semua teams
DROP POLICY IF EXISTS "Admin can manage all teams" ON teams;
CREATE POLICY "Admin can manage all teams" ON teams
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'superadmin')
    )
);

-- 7. RLS Policy - Admin dapat manage semua profiles
DROP POLICY IF EXISTS "Admin can manage all profiles" ON profiles;
CREATE POLICY "Admin can manage all profiles" ON profiles
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'superadmin')
    )
);

-- Selesai! Jalankan SQL ini di Supabase SQL Editor
