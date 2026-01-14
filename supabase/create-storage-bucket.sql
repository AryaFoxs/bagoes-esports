-- =============================================
-- CREATE STORAGE BUCKET FOR EVENT IMAGES
-- Jalankan di Supabase SQL Editor
-- =============================================

-- Create storage bucket for events
INSERT INTO storage.buckets (id, name, public)
VALUES ('events', 'events', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public to view event images
CREATE POLICY "Public can view event images" ON storage.objects
FOR SELECT USING (bucket_id = 'events');

-- Allow authenticated users to upload event images
CREATE POLICY "Authenticated users can upload event images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'events' AND
  auth.role() = 'authenticated'
);

-- Allow users to update their own uploads
CREATE POLICY "Users can update own event images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'events' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own event images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'events' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Alternative: Allow all authenticated users to manage images
-- (simpler, use if above policies don't work)
-- CREATE POLICY "Authenticated can manage event images" ON storage.objects
-- FOR ALL USING (bucket_id = 'events' AND auth.role() = 'authenticated');
