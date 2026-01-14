-- =============================================
-- SYNC EMAIL FROM AUTH.USERS TO PROFILES
-- Jalankan ini di Supabase SQL Editor
-- =============================================

-- Update semua profiles agar punya email dari auth.users
UPDATE profiles 
SET email = au.email 
FROM auth.users au 
WHERE profiles.id = au.id
AND (profiles.email IS NULL OR profiles.email = '');

-- Verifikasi hasilnya
SELECT id, username, email, role FROM profiles;
