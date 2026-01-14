-- =============================================
-- INSERT SAMPLE EVENTS DATA
-- Jalankan di Supabase SQL Editor
-- =============================================

-- Pastikan Anda sudah menjalankan create-admin-profiles.sql terlebih dahulu
-- Ganti 'YOUR_ADMIN_USER_ID' dengan ID admin Anda dari auth.users

-- Pertama, dapatkan ID admin untuk created_by
-- Anda bisa melihat ID admin dengan query:
-- SELECT id FROM auth.users WHERE email = 'admin@bagoes-esports.com';

-- TOURNAMENT EVENTS
INSERT INTO events (
  slug, title, description, game, location_type, format, 
  start_date, end_date, location, max_participants, 
  prize_pool, registration_fee, image_url, status, rules
) VALUES 
-- 1. Esports World Cup 2025 (Live)
(
  'esports-world-cup-2025',
  'Esports World Cup 2025',
  'Turnamen global yang mempertemukan tim-tim terbaik dunia dalam berbagai game esports.',
  'Multi-Game',
  'offline',
  'double_elimination',
  '2025-01-02T10:00:00Z',
  '2025-01-10T22:00:00Z',
  'Riyadh, Saudi Arabia',
  64,
  60000000, -- $60M in USD, atau ganti sesuai kebutuhan
  0,
  '/event/tournament/EWC 2025.webp',
  'live',
  'Turnamen invitational dengan tim-tim terbaik dunia.'
),
-- 2. Mobile Legends M7 World Championship (Upcoming)
(
  'mobile-legends-m7-world-championship',
  'Mobile Legends M7 World Championship',
  'Kompetisi Mobile Legends tingkat dunia dengan tim-tim terbaik dari setiap region.',
  'Mobile Legends',
  'offline',
  'double_elimination',
  '2026-01-15T09:00:00Z',
  '2026-01-30T22:00:00Z',
  'Jakarta, Indonesia',
  16,
  3000000, -- $3M 
  0,
  '/event/tournament/Mobile Legends M7.jpg',
  'upcoming',
  'Format Double Elimination. Grand Final Bo7.'
),
-- 3. Free Fire World Series SEA 2025
(
  'free-fire-world-series-sea-2025',
  'Free Fire World Series SEA 2025',
  'Turnamen Free Fire terbesar di Asia Tenggara dengan hadiah fantastis.',
  'Free Fire',
  'offline',
  'swiss',
  '2025-02-01T10:00:00Z',
  '2025-02-15T22:00:00Z',
  'Bangkok, Thailand',
  24,
  500000, -- $500K
  0,
  '/event/tournament/FFWS SEA 2025.webp',
  'upcoming',
  'Format Swiss System. Poin dari kill dan placement.'
),
-- 4. PUBG Mobile Global Championship 2025
(
  'pubg-mobile-global-championship-2025',
  'PUBG Mobile Global Championship 2025',
  'Kejuaraan dunia PUBG Mobile dengan tim-tim profesional dari seluruh dunia.',
  'PUBG Mobile',
  'offline',
  'swiss',
  '2025-03-01T10:00:00Z',
  '2025-03-20T22:00:00Z',
  'Istanbul, Turkey',
  48,
  4000000, -- $4M
  0,
  '/event/tournament/PMGC 2025.webp',
  'upcoming',
  'Format Swiss System diikuti Super Weekend dan Grand Finals.'
),
-- 5. Mobile Legends M6 World Championship (Completed)
(
  'mobile-legends-m6-world-championship',
  'Mobile Legends M6 World Championship',
  'Turnamen M6 yang sudah selesai dengan juara ECHO dari Filipina.',
  'Mobile Legends',
  'offline',
  'double_elimination',
  '2024-12-01T10:00:00Z',
  '2024-12-15T22:00:00Z',
  'Kuala Lumpur, Malaysia',
  16,
  2000000, -- $2M
  0,
  '/event/tournament/Mobile Legends M6.png',
  'completed',
  'Double Elimination. ECHO (PH) menjadi juara.'
),
-- CASUAL EVENTS
-- 6. Liga Mahasiswa Esports 2025
(
  'liga-mahasiswa-esports-2025',
  'Liga Mahasiswa Esports 2025',
  'Kompetisi esports antar universitas untuk membangun komunitas gaming di kampus.',
  'Multi-Game',
  'hybrid',
  'round_robin',
  '2025-02-10T09:00:00Z',
  '2025-03-10T18:00:00Z',
  'Online + Final Offline',
  200,
  100000000, -- Rp 100 Juta
  0,
  '/event/kasual/Liga Mahasiswa 2025.avif',
  'upcoming',
  'Terbuka untuk mahasiswa S1/D3/D4 aktif.'
),
-- 7. Liga Pelajar Indonesia 2025
(
  'liga-pelajar-indonesia-2025',
  'Liga Pelajar Indonesia 2025',
  'Turnamen esports untuk pelajar SMP dan SMA di seluruh Indonesia.',
  'Mobile Legends',
  'online',
  'round_robin',
  '2025-03-01T10:00:00Z',
  '2025-04-15T17:00:00Z',
  'Online',
  500,
  50000000, -- Rp 50 Juta
  0,
  '/event/kasual/Liga Pelajar 2025.jpeg',
  'upcoming',
  'Khusus pelajar SMP/SMA dengan surat keterangan dari sekolah.'
),
-- 8. Liga Mahasiswa Esports 2024 (Completed)
(
  'liga-mahasiswa-esports-2024',
  'Liga Mahasiswa Esports 2024',
  'Kompetisi tahun lalu yang sukses diikuti oleh 180 kampus.',
  'Multi-Game',
  'offline',
  'round_robin',
  '2024-02-15T09:00:00Z',
  '2024-03-20T18:00:00Z',
  'Jakarta',
  180,
  75000000, -- Rp 75 Juta
  0,
  '/event/kasual/Liga Mahasiswa 2024.jpg',
  'completed',
  'Diikuti oleh 180 kampus dari seluruh Indonesia.'
),
-- MEETUP EVENTS
-- 9. Meet and Greet ONIC Esports
(
  'meet-and-greet-onic-esports',
  'Meet and Greet ONIC Esports',
  'Kesempatan bertemu langsung dengan para pemain ONIC Esports dan dapatkan merchandise eksklusif.',
  'Mobile Legends',
  'offline',
  'networking',
  '2025-01-20T14:00:00Z',
  '2025-01-20T18:00:00Z',
  'Mal Taman Anggrek, Jakarta',
  500,
  0,
  0,
  '/event/meetup/Meet and Great Onic.jpg',
  'upcoming',
  'Gratis! Sesi foto dan tanda tangan pemain ONIC.'
),
-- 10. VCT Pacific Fan Meet
(
  'vct-pacific-fan-meet',
  'VCT Pacific Fan Meet',
  'Meet and greet dengan pemain-pemain Valorant dari tim VCT Pacific.',
  'Valorant',
  'offline',
  'networking',
  '2025-02-05T15:00:00Z',
  '2025-02-05T19:00:00Z',
  'Gandaria City, Jakarta',
  300,
  0,
  0,
  '/event/meetup/Meet and Greet VCT.jpg',
  'upcoming',
  'Ketemu pro player Valorant dari VCT Pacific!'
),
-- 11. Mobile Legends Community Gathering
(
  'mobile-legends-community-gathering',
  'Mobile Legends Community Gathering',
  'Acara gathering komunitas Mobile Legends dengan berbagai aktivitas seru.',
  'Mobile Legends',
  'offline',
  'community',
  '2025-01-28T13:00:00Z',
  '2025-01-28T20:00:00Z',
  'Summarecon Mall Bekasi',
  400,
  0,
  0,
  '/event/meetup/Met and Greet Mobile Legends.jpg',
  'upcoming',
  'Games, giveaway, dan aktivitas komunitas seru!'
),
-- WORKSHOP EVENTS
-- 12. Workshop: Art of Cosplay
(
  'workshop-art-of-cosplay',
  'Workshop: Art of Cosplay',
  'Pelajari seni cosplay dari karakter game favorit Anda bersama cosplayer profesional.',
  'General',
  'offline',
  'workshop',
  '2025-01-25T10:00:00Z',
  '2025-01-25T16:00:00Z',
  'Balai Kartini, Jakarta',
  100,
  0,
  150000, -- Rp 150K
  '/event/workshop/Art of Cosplay.avif',
  'upcoming',
  'Belajar membuat kostum dan makeup cosplay dari pro!'
),
-- 13. Workshop: Branding in Esports
(
  'workshop-branding-in-esports',
  'Workshop: Branding in Esports',
  'Pelajari strategi branding dan marketing untuk tim esports dari para ahli industri.',
  'General',
  'offline',
  'presentation',
  '2025-02-08T09:00:00Z',
  '2025-02-08T15:00:00Z',
  'Universitas Multimedia Nusantara',
  80,
  0,
  100000, -- Rp 100K
  '/event/workshop/Branding In Esports.jpg',
  'upcoming',
  'Sertifikat, lunch, dan networking session.'
),
-- 14. Workshop: How to Set Up The Stage
(
  'workshop-how-to-set-up-the-stage',
  'Workshop: How to Set Up The Stage',
  'Workshop teknis tentang setup panggung dan production untuk event esports.',
  'General',
  'offline',
  'hands_on',
  '2025-02-15T10:00:00Z',
  '2025-02-15T17:00:00Z',
  'ICE BSD City',
  60,
  0,
  200000, -- Rp 200K
  '/event/workshop/How to Set Up The Stage.jpeg',
  'upcoming',
  'Hands-on dengan equipment production profesional.'
),
-- 15. Workshop: Nurturing Leadership in Esports
(
  'workshop-nurturing-leadership-in-esports',
  'Workshop: Nurturing Leadership in Esports',
  'Kembangkan skill leadership Anda untuk memimpin tim esports menuju kemenangan.',
  'General',
  'offline',
  'interactive',
  '2025-02-22T09:00:00Z',
  '2025-02-22T14:00:00Z',
  'Sari Pan Pacific Hotel',
  50,
  0,
  250000, -- Rp 250K
  '/event/workshop/Nurturing Leadership in Esports.jpg',
  'upcoming',
  'Cocok untuk team captain dan manager tim.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  game = EXCLUDED.game,
  location_type = EXCLUDED.location_type,
  format = EXCLUDED.format,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  location = EXCLUDED.location,
  max_participants = EXCLUDED.max_participants,
  prize_pool = EXCLUDED.prize_pool,
  registration_fee = EXCLUDED.registration_fee,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  rules = EXCLUDED.rules;

-- Verify inserted data
SELECT id, slug, title, status, start_date FROM events ORDER BY start_date;
