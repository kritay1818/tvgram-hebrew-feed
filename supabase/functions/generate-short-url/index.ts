import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { articleSlug } = await req.json();

    if (!articleSlug) {
      return new Response(
        JSON.stringify({ error: 'Article slug is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the article by slug
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .select('id, slug')
      .eq('slug', articleSlug)
      .single();

    if (articleError || !article) {
      console.error('Article fetch error:', articleError);
      return new Response(
        JSON.stringify({ error: 'Article not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if short URL already exists for this article
    const { data: existingShortUrl } = await supabase
      .from('short_urls')
      .select('short_code')
      .eq('article_id', article.id)
      .maybeSingle();

    if (existingShortUrl) {
      const shortUrl = `${req.headers.get('origin') || 'https://nncnndgadzztleforqzs.supabase.co'}/s/${existingShortUrl.short_code}`;
      return new Response(
        JSON.stringify({ shortUrl, shortCode: existingShortUrl.short_code }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate a unique 6-character alphanumeric code
    const generateShortCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let shortCode = generateShortCode();
    let attempts = 0;
    const maxAttempts = 10;

    // Try to insert, regenerate if collision
    while (attempts < maxAttempts) {
      const fullUrl = `${req.headers.get('origin') || 'https://nncnndgadzztleforqzs.supabase.co'}/article/${article.slug}`;
      
      const { data: newShortUrl, error: insertError } = await supabase
        .from('short_urls')
        .insert({
          short_code: shortCode,
          article_id: article.id,
          full_url: fullUrl,
        })
        .select('short_code')
        .single();

      if (!insertError) {
        const shortUrl = `${req.headers.get('origin') || 'https://nncnndgadzztleforqzs.supabase.co'}/s/${newShortUrl.short_code}`;
        console.log('Short URL created:', shortUrl);
        return new Response(
          JSON.stringify({ shortUrl, shortCode: newShortUrl.short_code }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // If unique constraint violation, try a new code
      if (insertError.code === '23505') {
        shortCode = generateShortCode();
        attempts++;
      } else {
        console.error('Insert error:', insertError);
        throw insertError;
      }
    }

    return new Response(
      JSON.stringify({ error: 'Could not generate unique short code' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-short-url function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
