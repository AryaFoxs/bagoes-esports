-- SQL untuk membuat tabel komunitas di Supabase
-- Jalankan query ini di Supabase SQL Editor

-- ===== TABEL FORUM POSTS =====
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'pinned')),
  views INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_forum_posts_author ON forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_forum_posts_status ON forum_posts(status);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at DESC);

-- RLS
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read forum posts" ON forum_posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON forum_posts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own posts" ON forum_posts
  FOR UPDATE TO authenticated USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all posts" ON forum_posts
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );


-- ===== TABEL FORUM REPLIES =====
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read replies" ON forum_replies
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create replies" ON forum_replies
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);


-- ===== TABEL CHALLENGES =====
CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  reward VARCHAR(255),
  participants INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read challenges" ON challenges
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage challenges" ON challenges
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );


-- ===== TABEL CHALLENGE PARTICIPANTS =====
CREATE TABLE IF NOT EXISTS challenge_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  completed BOOLEAN DEFAULT false,
  UNIQUE(challenge_id, user_id)
);

-- RLS
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own participation" ON challenge_participants
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can see all participants" ON challenge_participants
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );


-- ===== TABEL REPORTS =====
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reported_type VARCHAR(50) NOT NULL, -- 'user', 'post', 'comment', 'team'
  reported_id UUID NOT NULL,
  reason VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports" ON reports
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can see own reports" ON reports
  FOR SELECT TO authenticated USING (auth.uid() = reporter_id);

CREATE POLICY "Admins can manage all reports" ON reports
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );


-- ===== SAMPLE DATA =====

-- Sample forum posts
INSERT INTO forum_posts (title, content, category, status, views, reply_count, author_id) VALUES
('Tips bermain Valorant untuk pemula', 'Halo semua, ini adalah tips untuk pemula yang ingin bermain Valorant...', 'Tips & Tricks', 'active', 245, 45, (SELECT id FROM profiles LIMIT 1)),
('Diskusi meta MLBB Season terbaru', 'Apa pendapat kalian tentang meta terbaru di Mobile Legends?', 'Diskusi Umum', 'active', 389, 78, (SELECT id FROM profiles LIMIT 1)),
('Cari team untuk turnamen weekend', 'Kami butuh 2 pemain lagi untuk ikut turnamen weekend ini.', 'Cari Tim', 'active', 156, 23, (SELECT id FROM profiles LIMIT 1)),
('Review headset gaming terbaik 2026', 'Saya akan membagikan review headset gaming yang saya gunakan...', 'Diskusi Umum', 'active', 89, 12, (SELECT id FROM profiles LIMIT 1));

-- Sample challenges
INSERT INTO challenges (title, description, start_date, end_date, status, reward, participants) VALUES
('Weekly Kill Challenge', 'Dapatkan 100 kill dalam seminggu untuk mendapatkan hadiah eksklusif!', NOW(), NOW() + INTERVAL '7 days', 'active', '500 XP + Badge Eksklusif', 45),
('Ranked Grind Challenge', 'Naik 2 tier dalam ranked selama event berlangsung.', NOW(), NOW() + INTERVAL '14 days', 'active', '1000 XP + Skin Eksklusif', 128),
('Community Engagement', 'Berpartisipasi dalam 10 diskusi forum.', NOW() + INTERVAL '3 days', NOW() + INTERVAL '10 days', 'upcoming', '300 XP', 0);

-- Sample reports
INSERT INTO reports (reported_type, reported_id, reason, description, status, reporter_id) VALUES
('user', gen_random_uuid(), 'Spam', 'User ini terus mengirim pesan spam di forum.', 'pending', (SELECT id FROM profiles LIMIT 1)),
('post', gen_random_uuid(), 'Konten tidak pantas', 'Postingan mengandung kata-kata kasar.', 'pending', (SELECT id FROM profiles LIMIT 1)),
('user', gen_random_uuid(), 'Cheating', 'Diduga menggunakan cheat dalam game.', 'pending', (SELECT id FROM profiles LIMIT 1));

-- Verifikasi
SELECT 'forum_posts' as table_name, COUNT(*) as count FROM forum_posts
UNION ALL
SELECT 'challenges' as table_name, COUNT(*) as count FROM challenges
UNION ALL
SELECT 'reports' as table_name, COUNT(*) as count FROM reports;
