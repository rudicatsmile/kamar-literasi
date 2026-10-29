-- ==========================================================
-- Migration: Allow public read access to profiles for author attribution
-- File: supabase/migrations/20261029000003_allow_public_read_profiles.sql
-- ==========================================================

-- Enable public read on profiles so article author names & avatars can be fetched
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles' AND policyname = 'Profil dapat dibaca publik'
  ) THEN
    CREATE POLICY "Profil dapat dibaca publik"
      ON public.profiles
      FOR SELECT
      USING (true);
  END IF;
END $$;
