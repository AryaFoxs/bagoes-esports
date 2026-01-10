-- SQL untuk memasukkan data event ke Supabase
-- Jalankan query ini di Supabase SQL Editor (https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql)

-- Catatan: Sesuaikan 'created_by' dengan UUID user admin Anda
-- Untuk mendapatkan UUID user, jalankan: SELECT id FROM auth.users WHERE email = 'admin@example.com';

-- ===== TOURNAMENT EVENTS =====

-- 1. Esports World Cup 2025 (LIVE)
INSERT INTO events (slug, title, description, game, location_type, format, start_date, end_date, location, max_participants, prize_pool, registration_fee, image_url, status, created_by) VALUES
('esports-world-cup-2025', 
 'Esports World Cup 2025', 
 'Turnamen global yang mempertemukan tim-tim terbaik dunia dalam berbagai game esports.', 
 'Multi-Game', 
 'offline', 
 'double_elimination', 
 '2025-01-02T10:00:00Z', 
 '2025-01-10T22:00:00Z', 
 'Riyadh, Saudi Arabia', 
 64, 
 60000000000, -- $60 Million in Rupiah equivalent (mock)
 0, 
 '/event/tournament/EWC 2025.webp', 
 'live', 
 (SELECT id FROM profiles LIMIT 1));

-- 2. Mobile Legends M7 World Championship (UPCOMING)
INSERT INTO events (slug, title, description, game, location_type, format, start_date, end_date, location, max_participants, prize_pool, registration_fee, image_url, status, created_by) VALUES
('mobile-legends-m7-world-championship', 
 'Mobile Legends M7 World Championship', 
 'Kompetisi Mobile Legends tingkat dunia dengan tim-tim terbaik dari setiap region.', 
 'Mobile Legends', 
 'offline', 
 'double_elimination', 
 '2026-01-15T09:00:00Z', 
 '2026-01-30T22:00:00Z', 
 'Jakarta, Indonesia', 
 16, 
 3000000000, -- $3 Million ~ Rp 3 Miliar
 0, 
 '/event/tournament/Mobile Legends M7.jpg', 
 'upcoming', 
 (SELECT id FROM profiles LIMIT 1));

-- 3. Free Fire World Series SEA 2025 (UPCOMING)
INSERT INTO events (slug, title, description, game, location_type, format, start_date, end_date, location, max_participants, prize_pool, registration_fee, image_url, status, created_by) VALUES
('free-fire-world-series-sea-2025', 
 'Free Fire World Series SEA 2025', 
 'Turnamen Free Fire terbesar di Asia Tenggara dengan hadiah fantastis.', 
 'Free Fire', 
 'offline', 
 'single_elimination', 
 '2025-02-01T10:00:00Z', 
 '2025-02-15T22:00:00Z', 
 'Bangkok, Thailand', 
 24, 
 500000000, -- $500K ~ Rp 500 Juta
 0, 
 '/event/tournament/FFWS SEA 2025.webp', 
 'upcoming', 
 (SELECT id FROM profiles LIMIT 1));

-- 4. PUBG Mobile Global Championship 2025 (UPCOMING)
INSERT INTO events (slug, title, description, game, location_type, format, start_date, end_date, location, max_participants, prize_pool, registration_fee, image_url, status, created_by) VALUES
('pubg-mobile-global-championship-2025', 
 'PUBG Mobile Global Championship 2025', 
 'Kejuaraan dunia PUBG Mobile dengan tim-tim profesional dari seluruh dunia.', 
 'PUBG Mobile', 
 'offline', 
 'double_elimination', 
 '2025-03-01T10:00:00Z', 
 '2025-03-20T22:00:00Z', 
 'Istanbul, Turkey', 
 48, 
 4000000000, -- $4 Million ~ Rp 4 Miliar
 0, 
 '/event/tournament/PMGC 2025.webp', 
 'upcoming', 
 (SELECT id FROM profiles LIMIT 1));

-- 5. Mobile Legends M6 World Championship (COMPLETED)
INSERT INTO events (slug, title, description, game, location_type, format, start_date, end_date, location, max_participants, prize_pool, registration_fee, image_url, status, created_by) VALUES
('mobile-legends-m6-world-championship', 
 'Mobile Legends M6 World Championship', 
 'Turnamen M6 yang sudah selesai dengan juara ECHO dari Filipina.', 
 'Mobile Legends', 
 'offline', 
 'double_elimination', 
 '2024-12-01T10:00:00Z', 
 '2024-12-15T22:00:00Z', 
 'Kuala Lumpur, Malaysia', 
 16, 
 2000000000, -- $2 Million ~ Rp 2 Miliar
 0, 
 '/event/tournament/Mobile Legends M6.png', 
 'completed', 
 (SELECT id FROM profiles LIMIT 1));

-- ===== CASUAL EVENTS =====

-- 6. Liga Mahasiswa Esports 2025 (UPCOMING)
INSERT INTO events (slug, title, description, game, location_type, format, start_date, end_date, location, max_participants, prize_pool, registration_fee, image_url, status, created_by) VALUES
('liga-mahasiswa-esports-2025', 
 'Liga Mahasiswa Esports 2025', 
 'Kompetisi esports antar universitas untuk membangun komunitas gaming di kampus.', 
 'Multi-Game', 
 'hybrid', 
 'swiss', 
 '2025-02-10T09:00:00Z', 
 '2025-03-10T18:00:00Z', 
 'Online + Final Offline', 
 200, 
 100000000, -- Rp 100 Juta
 0, 
 '/event/kasual/Liga Mahasiswa 2025.avif', 
 'upcoming', 
 (SELECT id FROM profiles LIMIT 1));

-- 7. Liga Pelajar Indonesia 2025 (UPCOMING)
INSERT INTO events (slug, title, description, game, location_type, format, start_date, end_date, location, max_participants, prize_pool, registration_fee, image_url, status, created_by) VALUES
('liga-pelajar-indonesia-2025', 
 'Liga Pelajar Indonesia 2025', 
 'Turnamen esports untuk pelajar SMP dan SMA di seluruh Indonesia.', 
 'Mobile Legends', 
 'online', 
 'swiss', 
 '2025-03-01T10:00:00Z', 
 '2025-04-15T17:00:00Z', 
 'Online', 
 500, 
 50000000, -- Rp 50 Juta
 0, 
 '/event/kasual/Liga Pelajar 2025.jpeg', 
 'upcoming', 
 (SELECT id FROM profiles LIMIT 1));

-- 8. Liga Mahasiswa Esports 2024 (COMPLETED)
INSERT INTO events (slug, title, description, game, location_type, format, start_date, end_date, location, max_participants, prize_pool, registration_fee, image_url, status, created_by) VALUES
('liga-mahasiswa-esports-2024', 
 'Liga Mahasiswa Esports 2024', 
 'Kompetisi tahun lalu yang sukses diikuti oleh 180 kampus.', 
 'Multi-Game', 
 'offline', 
 'swiss', 
 '2024-02-15T09:00:00Z', 
 '2024-03-20T18:00:00Z', 
 'Jakarta', 
 180, 
 75000000, -- Rp 75 Juta
 0, 
 '/event/kasual/Liga Mahasiswa 2024.jpg', 
 'completed', 
 (SELECT id FROM profiles LIMIT 1));

-- ===== MEETUP EVENTS =====

-- 9. Meet and Greet ONIC Esports (UPCOMING)
INSERT INTO events (slug, title, description, game, location_type, format, start_date, end_date, location, max_participants, prize_pool, registration_fee, image_url, status, created_by) VALUES
('meet-and-greet-onic-esports', 
 'Meet and Greet ONIC Esports', 
 'Kesempatan bertemu langsung dengan para pemain ONIC Esports dan dapatkan merchandise eksklusif.', 
 'Mobile Legends', 
 'offline', 
 'single_elimination', 
 '2025-01-20T14:00:00Z', 
 '2025-01-20T18:00:00Z', 
 'Mal Taman Anggrek, Jakarta', 
 500, 
 0, 
 0, 
 '/event/meetup/Meet and Great Onic.jpg', 
 'upcoming', 
 (SELECT id FROM profiles LIMIT 1));

-- 10. VCT Pacific Fan Meet (UPCOMING)
INSERT INTO events (slug, title, description, game, location_type, format, start_date, end_date, location, max_participants, prize_pool, registration_fee, image_url, status, created_by) VALUES
('vct-pacific-fan-meet', 
 'VCT Pacific Fan Meet', 
 'Meet and greet dengan pemain-pemain Valorant dari tim VCT Pacific.', 
 'Valorant', 
 'offline', 
 'single_elimination', 
 '2025-02-05T15:00:00Z', 
 '2025-02-05T19:00:00Z', 
 'Gandaria City, Jakarta', 
 300, 
 0, 
 0, 
 '/event/meetup/Meet and Greet VCT.jpg', 
 'upcoming', 
 (SELECT id FROM profiles LIMIT 1));

-- 11. Mobile Legends Community Gathering (UPCOMING)
INSERT INTO events (slug, title, description, game, location_type, format, start_date, end_date, location, max_participants, prize_pool, registration_fee, image_url, status, created_by) VALUES
('mobile-legends-community-gathering', 
 'Mobile Legends Community Gathering', 
 'Acara gathering komunitas Mobile Legends dengan berbagai aktivitas seru.', 
 'Mobile Legends', 
 'offline', 
 'single_elimination', 
 '2025-01-28T13:00:00Z', 
 '2025-01-28T20:00:00Z', 
 'Summarecon Mall Bekasi', 
 400, 
 0, 
 0, 
 '/event/meetup/Met and Greet Mobile Legends.jpg', 
 'upcoming', 
 (SELECT id FROM profiles LIMIT 1));

-- ===== WORKSHOP EVENTS =====

-- 12. Workshop: Art of Cosplay (UPCOMING)
INSERT INTO events (slug, title, description, game, location_type, format, start_date, end_date, location, max_participants, prize_pool, registration_fee, image_url, status, created_by) VALUES
('workshop-art-of-cosplay', 
 'Workshop: Art of Cosplay', 
 'Pelajari seni cosplay dari karakter game favorit Anda bersama cosplayer profesional.', 
 'General', 
 'offline', 
 'single_elimination', 
 '2025-01-25T10:00:00Z', 
 '2025-01-25T16:00:00Z', 
 'Balai Kartini, Jakarta', 
 100, 
 0, 
 100000, -- Rp 100.000
 '/event/workshop/Art of Cosplay.avif', 
 'upcoming', 
 (SELECT id FROM profiles LIMIT 1));

-- 13. Workshop: Branding in Esports (UPCOMING)
INSERT INTO events (slug, title, description, game, location_type, format, start_date, end_date, location, max_participants, prize_pool, registration_fee, image_url, status, created_by) VALUES
('workshop-branding-in-esports', 
 'Workshop: Branding in Esports', 
 'Pelajari strategi branding dan marketing untuk tim esports dari para ahli industri.', 
 'General', 
 'offline', 
 'single_elimination', 
 '2025-02-08T09:00:00Z', 
 '2025-02-08T15:00:00Z', 
 'Universitas Multimedia Nusantara', 
 80, 
 0, 
 150000, -- Rp 150.000
 '/event/workshop/Branding In Esports.jpg', 
 'upcoming', 
 (SELECT id FROM profiles LIMIT 1));

-- 14. Workshop: How to Set Up The Stage (UPCOMING)
INSERT INTO events (slug, title, description, game, location_type, format, start_date, end_date, location, max_participants, prize_pool, registration_fee, image_url, status, created_by) VALUES
('workshop-how-to-set-up-the-stage', 
 'Workshop: How to Set Up The Stage', 
 'Workshop teknis tentang setup panggung dan production untuk event esports.', 
 'General', 
 'offline', 
 'single_elimination', 
 '2025-02-15T10:00:00Z', 
 '2025-02-15T17:00:00Z', 
 'ICE BSD City', 
 60, 
 0, 
 200000, -- Rp 200.000
 '/event/workshop/How to Set Up The Stage.jpeg', 
 'upcoming', 
 (SELECT id FROM profiles LIMIT 1));

-- 15. Workshop: Nurturing Leadership in Esports (UPCOMING)
INSERT INTO events (slug, title, description, game, location_type, format, start_date, end_date, location, max_participants, prize_pool, registration_fee, image_url, status, created_by) VALUES
('workshop-nurturing-leadership-in-esports', 
 'Workshop: Nurturing Leadership in Esports', 
 'Kembangkan skill leadership Anda untuk memimpin tim esports menuju kemenangan.', 
 'General', 
 'offline', 
 'single_elimination', 
 '2025-02-22T09:00:00Z', 
 '2025-02-22T14:00:00Z', 
 'Sari Pan Pacific Hotel', 
 50, 
 0, 
 250000, -- Rp 250.000
 '/event/workshop/Nurturing Leadership in Esports.jpg', 
 'upcoming', 
 (SELECT id FROM profiles LIMIT 1));

-- Verifikasi data yang sudah dimasukkan
SELECT id, title, game, status, start_date, prize_pool FROM events ORDER BY start_date;
