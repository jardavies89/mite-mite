ALTER TABLE "entries" ADD COLUMN "metadata" jsonb;
UPDATE entries SET medium = 'SHOW', metadata = '{"style":"ANIME"}'::jsonb WHERE medium = 'ANIME';