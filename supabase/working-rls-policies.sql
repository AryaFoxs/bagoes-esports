-- =============================================
-- WORKING RLS POLICIES FOR BAGOES ESPORTS
-- Drop all existing dan buat ulang dari nol
-- =============================================

-- ==================== PROFILES ====================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admin full access" ON profiles;
DROP POLICY IF EXISTS "Admin full access profiles" ON profiles;

-- Create simple working policies
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete" ON profiles FOR DELETE USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- ==================== EVENTS ====================
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view events" ON events;
DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;
DROP POLICY IF EXISTS "Admin can manage all events" ON events;
DROP POLICY IF EXISTS "Admin full access events" ON events;
DROP POLICY IF EXISTS "Authenticated users can create events" ON events;
DROP POLICY IF EXISTS "Event creators can update their events" ON events;

CREATE POLICY "events_select" ON events FOR SELECT USING (true);
CREATE POLICY "events_insert" ON events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "events_update" ON events FOR UPDATE USING (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);
CREATE POLICY "events_delete" ON events FOR DELETE USING (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- ==================== EVENT_REGISTRATIONS ====================
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view registrations" ON event_registrations;
DROP POLICY IF EXISTS "Registrations are viewable by everyone" ON event_registrations;
DROP POLICY IF EXISTS "Users can register for events" ON event_registrations;
DROP POLICY IF EXISTS "Users can update own registration" ON event_registrations;
DROP POLICY IF EXISTS "Admin can manage all registrations" ON event_registrations;

CREATE POLICY "event_registrations_select" ON event_registrations FOR SELECT USING (true);
CREATE POLICY "event_registrations_insert" ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "event_registrations_update" ON event_registrations FOR UPDATE USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);
CREATE POLICY "event_registrations_delete" ON event_registrations FOR DELETE USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- ==================== TEAMS ====================
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view teams" ON teams;
DROP POLICY IF EXISTS "Teams are viewable by everyone" ON teams;
DROP POLICY IF EXISTS "Admin can manage all teams" ON teams;

CREATE POLICY "teams_select" ON teams FOR SELECT USING (true);
CREATE POLICY "teams_insert" ON teams FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "teams_update" ON teams FOR UPDATE USING (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);
CREATE POLICY "teams_delete" ON teams FOR DELETE USING (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- ==================== NOTIFICATIONS ====================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Admin full access notifications" ON notifications;

CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert" ON notifications FOR INSERT WITH CHECK (true); -- System can create
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notifications_delete" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- ==================== OTHER TABLES (Public Read) ====================
-- Apply simple policies to other tables

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "team_members_select" ON team_members;
DROP POLICY IF EXISTS "Anyone can view team_members" ON team_members;
CREATE POLICY "team_members_select" ON team_members FOR SELECT USING (true);
CREATE POLICY "team_members_all" ON team_members FOR ALL USING (auth.uid() IS NOT NULL);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "articles_select" ON articles;
CREATE POLICY "articles_select" ON articles FOR SELECT USING (true);
CREATE POLICY "articles_all" ON articles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "news_select" ON news;
CREATE POLICY "news_select" ON news FOR SELECT USING (true);
CREATE POLICY "news_all" ON news FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "challenges_select" ON challenges;
CREATE POLICY "challenges_select" ON challenges FOR SELECT USING (true);
CREATE POLICY "challenges_all" ON challenges FOR ALL USING (auth.uid() IS NOT NULL);

ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "forum_posts_select" ON forum_posts;
CREATE POLICY "forum_posts_select" ON forum_posts FOR SELECT USING (true);
CREATE POLICY "forum_posts_all" ON forum_posts FOR ALL USING (auth.uid() IS NOT NULL);

ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "forum_replies_select" ON forum_replies;
CREATE POLICY "forum_replies_select" ON forum_replies FOR SELECT USING (true);
CREATE POLICY "forum_replies_all" ON forum_replies FOR ALL USING (auth.uid() IS NOT NULL);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "favorites_select" ON favorites;
CREATE POLICY "favorites_select" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_all" ON favorites FOR ALL USING (auth.uid() = user_id);

-- ==================== DONE ====================
-- Verify policies
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;
