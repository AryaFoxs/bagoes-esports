-- =============================================
-- CREATE/UPDATE ADMIN PROFILES
-- Jalankan setelah membuat users di Authentication → Users
-- =============================================

-- Update profile untuk Admin One
UPDATE profiles 
SET 
    username = 'admin_one',
    full_name = 'Admin One',
    role = 'admin',
    email = 'admin1@bagoesesports.com'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin1@bagoesesports.com');

-- Update profile untuk Admin Two
UPDATE profiles 
SET 
    username = 'admin_two',
    full_name = 'Admin Two',
    role = 'admin',
    email = 'admin2@bagoesesports.com'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin2@bagoesesports.com');

-- Update profile untuk Admin Three
UPDATE profiles    
SET 
    username = 'admin_three',
    full_name = 'Admin Three',
    role = 'admin',
    email = 'admin3@bagoesesports.com'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin3@bagoesesports.com');

-- Jika profile belum ada (trigger tidak jalan), INSERT manual:
INSERT INTO profiles (id, username, email, full_name, role)
SELECT 
    id,
    'admin_one',
    'admin1@bagoesesports.com',
    'Admin One',
    'admin'
FROM auth.users 
WHERE email = 'admin1@bagoesesports.com'
ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;

INSERT INTO profiles (id, username, email, full_name, role)
SELECT 
    id,
    'admin_two',
    'admin2@bagoesesports.com',
    'Admin Two',
    'admin'
FROM auth.users 
WHERE email = 'admin2@bagoesesports.com'
ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;

INSERT INTO profiles (id, username, email, full_name, role)
SELECT 
    id,
    'admin_three',
    'admin3@bagoesesports.com',
    'Admin Three',
    'admin'
FROM auth.users 
WHERE email = 'admin3@bagoesesports.com'
ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;

-- Verifikasi hasilnya
SELECT id, username, email, full_name, role FROM profiles ORDER BY username;
