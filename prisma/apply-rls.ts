import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
config({ path: ".env" });

const prisma = new PrismaClient();

async function main() {
  console.log("Applying RLS policies...");

  const sql = `
    -- PROFILES
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "profiles_select" ON profiles;
    DROP POLICY IF EXISTS "profiles_insert" ON profiles;
    DROP POLICY IF EXISTS "profiles_update" ON profiles;
    DROP POLICY IF EXISTS "profiles_delete" ON profiles;
    CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
    CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid()::text = id);
    CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid()::text = id);

    -- EVENTS
    ALTER TABLE events ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "events_select" ON events;
    CREATE POLICY "events_select" ON events FOR SELECT USING (true);

    -- EVENT_REGISTRATIONS
    ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "event_registrations_select" ON event_registrations;
    DROP POLICY IF EXISTS "event_registrations_insert" ON event_registrations;
    DROP POLICY IF EXISTS "event_registrations_update" ON event_registrations;
    DROP POLICY IF EXISTS "event_registrations_delete" ON event_registrations;
    CREATE POLICY "event_registrations_select" ON event_registrations FOR SELECT USING (true);
    CREATE POLICY "event_registrations_insert" ON event_registrations FOR INSERT WITH CHECK (auth.uid()::text = user_id);
    CREATE POLICY "event_registrations_update" ON event_registrations FOR UPDATE USING (auth.uid()::text = user_id);
    CREATE POLICY "event_registrations_delete" ON event_registrations FOR DELETE USING (auth.uid()::text = user_id);

    -- TEAMS
    ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "teams_select" ON teams;
    CREATE POLICY "teams_select" ON teams FOR SELECT USING (true);

    -- ARTICLES
    ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "articles_select" ON articles;
    CREATE POLICY "articles_select" ON articles FOR SELECT USING (true);
  `;

  // Split and execute each statement
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    try {
      await prisma.$executeRawUnsafe(statement);
    } catch (e) {
      console.error("Error executing statement:", statement, (e as Error).message);
    }
  }

  console.log("RLS policies applied successfully.");
}

main()
  .catch((e) => {
    console.error("Policy application error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
