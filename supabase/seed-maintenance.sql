-- SQL untuk membuat tabel pemeliharaan di Supabase
-- Jalankan query ini di Supabase SQL Editor

-- ===== TABEL BACKUPS =====
CREATE TABLE IF NOT EXISTS backups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  size VARCHAR(50),
  tables_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'failed', 'in_progress')),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_backups_created_at ON backups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_backups_status ON backups(status);

-- RLS
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;

-- Only admins can manage backups
CREATE POLICY "Admins can manage backups" ON backups
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );


-- ===== TABEL MAINTENANCE SETTINGS =====
CREATE TABLE IF NOT EXISTS maintenance_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auto_backup_enabled BOOLEAN DEFAULT true,
  backup_schedule VARCHAR(20) DEFAULT 'weekly' CHECK (backup_schedule IN ('daily', 'weekly', 'monthly')),
  backup_time TIME DEFAULT '08:00',
  retention_days INTEGER DEFAULT 30,
  last_backup_at TIMESTAMPTZ,
  maintenance_mode BOOLEAN DEFAULT false,
  maintenance_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE maintenance_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can read
CREATE POLICY "Admins can read maintenance settings" ON maintenance_settings
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- Only admins can update
CREATE POLICY "Admins can update maintenance settings" ON maintenance_settings
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );


-- ===== SAMPLE DATA =====

-- Insert default maintenance settings
INSERT INTO maintenance_settings (
  auto_backup_enabled, 
  backup_schedule, 
  backup_time, 
  retention_days
) VALUES (true, 'weekly', '08:00', 30);

-- Insert sample backup history
INSERT INTO backups (name, size, tables_count, status, created_at) VALUES
('backup_2026-01-10_1736524800000.json', '0.5 MB', 11, 'completed', NOW() - INTERVAL '1 day'),
('backup_2026-01-03_1736438400000.json', '0.4 MB', 10, 'completed', NOW() - INTERVAL '8 days'),
('backup_2025-12-27_1735272000000.json', '0.3 MB', 9, 'completed', NOW() - INTERVAL '15 days');


-- Verifikasi
SELECT 'backups' as table_name, COUNT(*) as count FROM backups
UNION ALL
SELECT 'maintenance_settings' as table_name, COUNT(*) as count FROM maintenance_settings;
