-- =========================================================================
-- RABAAB DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) CONFIGURATION
--
-- INSTRUCTIONS:
-- Copy and execute this script inside the Supabase SQL Editor
-- (https://supabase.com -> Project -> SQL Editor) to provision your tables
-- and set up secure access controls before taking the website live.
-- =========================================================================

-- 1. DROP EXISTING TABLES IF CONFLICTING (Safe Order)
DROP TABLE IF EXISTS "site_content" CASCADE;
DROP TABLE IF EXISTS "signature_dishes" CASCADE;
DROP TABLE IF EXISTS "menu_categories" CASCADE;
DROP TABLE IF EXISTS "gallery" CASCADE;
DROP TABLE IF EXISTS "reservations" CASCADE;

-- 2. CREATE site_content
CREATE TABLE "public"."site_content" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "key" VARCHAR(255) UNIQUE NOT NULL,
    "value" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. CREATE signature_dishes
CREATE TABLE "public"."signature_dishes" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "price" VARCHAR(80) NOT NULL,
    "category" VARCHAR(120) NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "is_signature" BOOLEAN DEFAULT true NOT NULL,
    "order" INTEGER DEFAULT 0 NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. CREATE menu_categories
CREATE TABLE "public"."menu_categories" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "description" TEXT,
    "order" INTEGER DEFAULT 0 NOT NULL,
    "items" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. CREATE gallery
CREATE TABLE "public"."gallery" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "order" INTEGER DEFAULT 0 NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. CREATE reservations
CREATE TABLE "public"."reservations" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "guests" VARCHAR(50) NOT NULL DEFAULT '2 Persons',
    "date" VARCHAR(80) NOT NULL,
    "time" VARCHAR(80) NOT NULL,
    "request" TEXT,
    "status" VARCHAR(50) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'confirmed', 'rejected')), -- pending, confirmed, rejected
    "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
ALTER TABLE "public"."site_content" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."signature_dishes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."menu_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."gallery" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."reservations" ENABLE ROW LEVEL SECURITY;

-- 8. DEFINE ROW LEVEL SECURITY POLICIES --

-- site_content: Anyone can read, only authenticated admin users can write/modify
CREATE POLICY "Allow public read access to site_content" ON "public"."site_content"
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow authenticated admins full control on site_content" ON "public"."site_content"
    FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- signature_dishes: Anyone can read, only authenticated admin users can write/modify
CREATE POLICY "Allow public read access to signature_dishes" ON "public"."signature_dishes"
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow authenticated admins full control on signature_dishes" ON "public"."signature_dishes"
    FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- menu_categories: Anyone can read, only authenticated admin users can write/modify
CREATE POLICY "Allow public read access to menu_categories" ON "public"."menu_categories"
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow authenticated admins full control on menu_categories" ON "public"."menu_categories"
    FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- gallery: Anyone can read, only authenticated admin users can write/modify
CREATE POLICY "Allow public read access to gallery" ON "public"."gallery"
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow authenticated admins full control on gallery" ON "public"."gallery"
    FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- reservations: Anyone can insert (to make a booking), but only authenticated admins can select/update/delete
CREATE POLICY "Allow public inserts on reservations" ON "public"."reservations"
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow admin select on reservations" ON "public"."reservations"
    FOR SELECT TO authenticated USING (auth.email() = current_setting('app.admin_email', true));

CREATE POLICY "Allow admin update on reservations" ON "public"."reservations"
    FOR UPDATE TO authenticated USING (auth.email() = current_setting('app.admin_email', true)) WITH CHECK (auth.email() = current_setting('app.admin_email', true));

CREATE POLICY "Allow admin delete on reservations" ON "public"."reservations"
    FOR DELETE TO authenticated USING (auth.email() = current_setting('app.admin_email', true));


-- 9. SETUP REALTIME PUBLICATION FOR ENGAGEMENT
-- Realtime triggers for instant UI reactions (useful for reservations dashboard)
alter publication supabase_realtime add table "public"."reservations";
alter publication supabase_realtime add table "public"."site_content";
alter publication supabase_realtime add table "public"."signature_dishes";
alter publication supabase_realtime add table "public"."menu_categories";
alter publication supabase_realtime add table "public"."gallery";

-- 10. SET ADMIN EMAIL FOR RESERVATION ACCESS CONTROL
-- IMPORTANT: Replace 'your-admin@rabaab.in' with the actual email address
-- of the Supabase account that will manage reservations before running this schema.
ALTER DATABASE postgres SET app.admin_email = 'your-admin@rabaab.in';
