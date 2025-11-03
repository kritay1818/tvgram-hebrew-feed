-- Add category column to videos table
ALTER TABLE videos ADD COLUMN category text;

-- Add some default categories
COMMENT ON COLUMN videos.category IS 'Video category: מצחיק, אקטואלי, דרמתי, etc.';