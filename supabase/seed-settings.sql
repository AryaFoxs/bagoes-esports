-- SQL untuk membuat tabel pengaturan di Supabase
-- Jalankan query ini di Supabase SQL Editor

-- ===== TABEL SITE SETTINGS =====
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name VARCHAR(255) DEFAULT 'Bagoes Esports',
  tagline VARCHAR(255) DEFAULT 'Platform Esports Terbesar di Indonesia',
  description TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "Public can read site settings" ON site_settings
  FOR SELECT USING (true);

-- Only admins can update
CREATE POLICY "Admins can update site settings" ON site_settings
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );


-- ===== TABEL SOCIAL LINKS =====
CREATE TABLE IF NOT EXISTS social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facebook VARCHAR(255),
  instagram VARCHAR(255),
  twitter VARCHAR(255),
  youtube VARCHAR(255),
  twitch VARCHAR(255),
  discord VARCHAR(255),
  tiktok VARCHAR(255),
  whatsapp VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "Public can read social links" ON social_links
  FOR SELECT USING (true);

-- Only admins can update
CREATE POLICY "Admins can update social links" ON social_links
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );


-- ===== TABEL NOTIFICATION SETTINGS =====
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_new_user BOOLEAN DEFAULT true,
  email_new_event BOOLEAN DEFAULT true,
  email_event_registration BOOLEAN DEFAULT true,
  email_new_report BOOLEAN DEFAULT true,
  email_verification_request BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT false,
  push_new_registration BOOLEAN DEFAULT false,
  push_event_start BOOLEAN DEFAULT false,
  discord_webhook TEXT,
  discord_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can read
CREATE POLICY "Admins can read notification settings" ON notification_settings
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- Only admins can update
CREATE POLICY "Admins can update notification settings" ON notification_settings
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );


-- ===== SAMPLE DATA =====

-- Insert default site settings
INSERT INTO site_settings (site_name, tagline, description, email, phone, address) VALUES
(
  'Bagoes Esports',
  'Platform Esports Terbesar di Indonesia',
  'Platform esports terbaik untuk komunitas gaming Indonesia. Temukan turnamen, tim, dan komunitas gaming terbaik.',
  'info@bagoesesports.id',
  '+62 812-3456-7890',
  'Jakarta, Indonesia'
);

-- Insert default social links
INSERT INTO social_links (facebook, instagram, twitter, youtube, discord) VALUES
(
  'https://facebook.com/bagoesesports',
  'https://instagram.com/bagoesesports',
  'https://twitter.com/bagoesesports',
  'https://youtube.com/@bagoesesports',
  'https://discord.gg/bagoesesports'
);

-- Insert default notification settings
INSERT INTO notification_settings (
  email_new_user, 
  email_new_event, 
  email_event_registration, 
  email_new_report, 
  email_verification_request
) VALUES (true, true, true, true, true);


-- Verifikasi
SELECT 'site_settings' as table_name, COUNT(*) as count FROM site_settings
UNION ALL
SELECT 'social_links' as table_name, COUNT(*) as count FROM social_links
UNION ALL
SELECT 'notification_settings' as table_name, COUNT(*) as count FROM notification_settings;
