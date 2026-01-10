-- SQL untuk membuat tabel keamanan di Supabase
-- Jalankan query ini di Supabase SQL Editor

-- ===== UPDATE PROFILES TABLE =====
-- Tambahkan kolom untuk verifikasi dan status ban
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_type VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned'));

-- ===== TABEL VERIFICATION REQUESTS =====
CREATE TABLE IF NOT EXISTS verification_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('identity', 'pro_player', 'team_owner', 'content_creator')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  documents TEXT[],
  notes TEXT,
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_verification_requests_user ON verification_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON verification_requests(status);
CREATE INDEX IF NOT EXISTS idx_verification_requests_created ON verification_requests(created_at DESC);

-- RLS
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

-- Users can see own requests
CREATE POLICY "Users can view own verification requests" ON verification_requests
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Users can create own requests
CREATE POLICY "Users can create verification requests" ON verification_requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Admins can manage all requests
CREATE POLICY "Admins can manage verification requests" ON verification_requests
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );


-- ===== SAMPLE DATA =====

-- Sample verification requests
INSERT INTO verification_requests (user_id, type, status, notes, created_at) VALUES
((SELECT id FROM profiles LIMIT 1), 'pro_player', 'pending', NULL, NOW() - INTERVAL '2 days'),
((SELECT id FROM profiles LIMIT 1), 'content_creator', 'approved', NULL, NOW() - INTERVAL '5 days'),
((SELECT id FROM profiles LIMIT 1), 'team_owner', 'rejected', 'Dokumen tidak lengkap', NOW() - INTERVAL '7 days');


-- Verifikasi
SELECT 'verification_requests' as table_name, COUNT(*) as count FROM verification_requests
UNION ALL
SELECT 'reports' as table_name, COUNT(*) as count FROM reports;
