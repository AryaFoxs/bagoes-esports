-- SQL untuk membuat tabel content management di Supabase
-- Jalankan query ini di Supabase SQL Editor

-- ===== TABEL ARTICLES =====
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  category VARCHAR(100) NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  views INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes untuk articles
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);

-- RLS untuk articles
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published articles
CREATE POLICY "Public can read published articles" ON articles
  FOR SELECT USING (status = 'published');

-- Policy: Authenticated users can read all articles
CREATE POLICY "Authenticated users can read all articles" ON articles
  FOR SELECT TO authenticated USING (true);

-- Policy: Admin/Superadmin can insert articles  
CREATE POLICY "Admins can insert articles" ON articles
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- Policy: Admin/Superadmin can update articles
CREATE POLICY "Admins can update articles" ON articles
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- Policy: Admin/Superadmin can delete articles
CREATE POLICY "Admins can delete articles" ON articles
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );


-- ===== TABEL MEDIA =====
CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  alt_text TEXT,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes untuk media
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_file_type ON media(file_type);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);

-- RLS untuk media
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read all media
CREATE POLICY "Authenticated users can read media" ON media
  FOR SELECT TO authenticated USING (true);

-- Policy: Admin/Superadmin can insert media
CREATE POLICY "Admins can insert media" ON media
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- Policy: Admin/Superadmin can delete media
CREATE POLICY "Admins can delete media" ON media
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );


-- ===== STORAGE BUCKET =====
-- Buat storage bucket untuk media (jalankan terpisah jika perlu)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);


-- ===== SAMPLE DATA ARTICLES =====
-- Masukkan beberapa artikel contoh

INSERT INTO articles (title, slug, content, excerpt, category, status, views, published_at, author_id) VALUES
(
  'Strategi Terbaik untuk Valorant Ranked',
  'strategi-terbaik-untuk-valorant-ranked',
  'Valorant adalah game taktis yang membutuhkan kombinasi skill individual dan kerja sama tim. Berikut adalah beberapa strategi yang bisa membantu Anda naik rank:\n\n1. Komunikasi yang Efektif\n2. Penguasaan Crosshair Placement\n3. Memahami Economy System\n4. Rotasi yang Tepat\n5. Memanfaatkan Utility dengan Baik',
  'Pelajari strategi dan tips untuk naik rank di Valorant dengan cepat.',
  'Tips & Tricks',
  'published',
  1250,
  NOW() - INTERVAL '5 days',
  (SELECT id FROM profiles LIMIT 1)
),
(
  'Update Meta Mobile Legends Patch 2.0',
  'update-meta-mobile-legends-patch-2-0',
  'Patch terbaru Mobile Legends membawa banyak perubahan signifikan. Hero-hero yang mendapat buff dan nerf:\n\n**Hero Buff:**\n- Moskov\n- Lunox\n- Layla\n\n**Hero Nerf:**\n- Beatrix\n- Xavier\n- Valentina',
  'Rangkuman lengkap perubahan meta di patch terbaru Mobile Legends.',
  'Berita',
  'published',
  980,
  NOW() - INTERVAL '7 days',
  (SELECT id FROM profiles LIMIT 1)
),
(
  'Interview dengan Pro Player Indonesia',
  'interview-dengan-pro-player-indonesia',
  'Dalam wawancara eksklusif ini, kami berbincang dengan salah satu pro player terbaik Indonesia tentang perjalanan karirnya di dunia esports.',
  'Wawancara eksklusif dengan pro player Indonesia.',
  'Interview',
  'draft',
  0,
  NULL,
  (SELECT id FROM profiles LIMIT 1)
),
(
  'Tutorial Dasar PUBG Mobile untuk Pemula',
  'tutorial-dasar-pubg-mobile-untuk-pemula',
  'PUBG Mobile adalah salah satu game battle royale paling populer. Berikut adalah panduan lengkap untuk pemula:\n\n1. Memilih Landing Spot\n2. Loot Management\n3. Positioning\n4. Combat Tips\n5. Final Circle Strategy',
  'Panduan lengkap untuk pemula yang ingin menguasai PUBG Mobile.',
  'Tutorial',
  'published',
  756,
  NOW() - INTERVAL '10 days',
  (SELECT id FROM profiles LIMIT 1)
);

-- ===== TABEL PAGES =====
CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  meta_description TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS untuk pages
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published pages
CREATE POLICY "Public can read published pages" ON pages
  FOR SELECT USING (status = 'published');

-- Policy: Authenticated users can read all pages
CREATE POLICY "Authenticated users can read all pages" ON pages
  FOR SELECT TO authenticated USING (true);

-- Policy: Admin/Superadmin can manage pages
CREATE POLICY "Admins can insert pages" ON pages
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

CREATE POLICY "Admins can update pages" ON pages
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

CREATE POLICY "Admins can delete pages" ON pages
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- Sample pages data
INSERT INTO pages (title, slug, content, meta_description, status) VALUES
('Tentang Kami', 'tentang-kami', 'Bagoes Esports adalah platform esports terkemuka di Indonesia...', 'Tentang Bagoes Esports - Platform esports terkemuka di Indonesia', 'published'),
('Syarat dan Ketentuan', 'syarat-ketentuan', 'Berikut adalah syarat dan ketentuan penggunaan platform Bagoes Esports...', 'Syarat dan Ketentuan penggunaan Bagoes Esports', 'published'),
('Kebijakan Privasi', 'kebijakan-privasi', 'Kami menghargai privasi Anda. Berikut adalah kebijakan privasi kami...', 'Kebijakan Privasi Bagoes Esports', 'published');

-- Verifikasi data
SELECT id, title, category, status, views, published_at FROM articles ORDER BY created_at DESC;
