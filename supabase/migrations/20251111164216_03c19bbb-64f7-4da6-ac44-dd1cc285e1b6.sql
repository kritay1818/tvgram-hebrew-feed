-- Drop existing restrictive policies
DROP POLICY IF EXISTS "public insert comments" ON article_comments;
DROP POLICY IF EXISTS "public read comments" ON article_comments;

-- Allow public to insert comments as approved
CREATE POLICY "public insert approved comments" 
ON article_comments 
FOR INSERT 
WITH CHECK (status = 'approved');

-- Allow public to read all comments
CREATE POLICY "public read all comments" 
ON article_comments 
FOR SELECT 
USING (true);