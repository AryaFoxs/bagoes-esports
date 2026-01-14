-- =============================================
-- RLS Policies untuk Admin Operations
-- Jalankan SQL ini di Supabase SQL Editor
-- =============================================

-- 1. Policy untuk EVENTS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can do anything with events" ON events;
DROP POLICY IF EXISTS "Anyone can view events" ON events;

CREATE POLICY "Anyone can view events" ON events
  FOR SELECT USING (true);

CREATE POLICY "Admin can do anything with events" ON events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- 2. Policy untuk EVENT_REGISTRATIONS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can do anything with event_registrations" ON event_registrations;
DROP POLICY IF EXISTS "Anyone can view registrations" ON event_registrations;
DROP POLICY IF EXISTS "Users can manage own registrations" ON event_registrations;

CREATE POLICY "Anyone can view registrations" ON event_registrations
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own registrations" ON event_registrations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin can do anything with event_registrations" ON event_registrations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- 3. Policy untuk PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can do anything with profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can do anything with profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- 4. Policy untuk TEAMS (tanpa owner_id)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can do anything with teams" ON teams;
DROP POLICY IF EXISTS "Anyone can view teams" ON teams;

CREATE POLICY "Anyone can view teams" ON teams
  FOR SELECT USING (true);

CREATE POLICY "Admin can do anything with teams" ON teams
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- 5. Policy untuk NOTIFICATIONS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Admin can do anything with notifications" ON notifications;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin can do anything with notifications" ON notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- Selesai!
