-- SQL untuk membuat tabel news di Supabase
-- Jalankan query ini di Supabase SQL Editor

-- ===== TABEL NEWS =====
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  views INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_author ON news(author_id);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);

-- RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Anyone can read published news
CREATE POLICY "Public can read published news" ON news
  FOR SELECT USING (status = 'published');

-- Authenticated users can read all news
CREATE POLICY "Authenticated can read all news" ON news
  FOR SELECT TO authenticated USING (true);

-- Admins can manage all news
CREATE POLICY "Admins can insert news" ON news
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

CREATE POLICY "Admins can update news" ON news
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

CREATE POLICY "Admins can delete news" ON news
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );


-- ===== SAMPLE DATA =====
INSERT INTO news (title, slug, content, excerpt, status, views, published_at, author_id) VALUES
(
  'Pengumuman Turnamen Nasional 2026',
  'pengumuman-turnamen-nasional-2026',
  'Kami dengan bangga mengumumkan bahwa Turnamen Nasional Esports 2026 akan segera dimulai! Turnamen ini akan menampilkan kompetisi di berbagai game populer termasuk Valorant, Mobile Legends, dan PUBG Mobile.\n\nPendaftaran akan dibuka mulai 15 Januari 2026. Pastikan tim Anda sudah siap untuk berkompetisi!',
  'Turnamen esports terbesar tahun ini akan segera dimulai...',
  'published',
  2450,
  NOW() - INTERVAL '5 days',
  (SELECT id FROM profiles LIMIT 1)
),
(
  'Kerjasama dengan Sponsor Baru',
  'kerjasama-dengan-sponsor-baru',
  'Dengan bangga kami mengumumkan kemitraan strategis dengan salah satu brand gaming terkemuka. Kerjasama ini akan membawa berbagai event menarik dan hadiah eksklusif untuk komunitas Bagoes Esports.',
  'Kami dengan bangga mengumumkan kemitraan strategis...',
  'published',
  1890,
  NOW() - INTERVAL '7 days',
  (SELECT id FROM profiles LIMIT 1)
),
(
  'Update Sistem Ranking',
  'update-sistem-ranking',
  'Perubahan besar pada sistem ranking akan diterapkan mulai bulan depan. Sistem baru ini dirancang untuk memberikan pengalaman yang lebih adil dan kompetitif bagi semua pemain.',
  'Perubahan besar pada sistem ranking akan diterapkan...',
  'draft',
  0,
  NULL,
  (SELECT id FROM profiles LIMIT 1)
),
(
  'Hasil Turnamen Regional Q4 2025',
  'hasil-turnamen-regional-q4-2025',
  'Selamat kepada semua pemenang Turnamen Regional Q4 2025! Berikut adalah daftar lengkap pemenang dari setiap kategori game.',
  'Selamat kepada semua pemenang Turnamen Regional...',
  'published',
  3200,
  NOW() - INTERVAL '14 days',
  (SELECT id FROM profiles LIMIT 1)
);

-- Verifikasi
SELECT id, title, status, views, published_at FROM news ORDER BY created_at DESC;
