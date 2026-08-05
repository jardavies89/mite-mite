UPDATE entries SET medium = 'SHOW', metadata = '{"style":"ANIME"}'::jsonb WHERE medium = 'ANIME';
ALTER TABLE "entries" ADD COLUMN "metadata" jsonb;