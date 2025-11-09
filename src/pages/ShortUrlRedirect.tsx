import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ShortUrlRedirect = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    const redirectToArticle = async () => {
      if (!shortCode) {
        setError(true);
        return;
      }

      try {
        // Fetch the short URL data
        const { data: shortUrlData, error: fetchError } = await supabase
          .from("short_urls")
          .select("full_url, click_count, id")
          .eq("short_code", shortCode)
          .maybeSingle();

        if (fetchError || !shortUrlData) {
          console.error("Short URL lookup error:", fetchError);
          setError(true);
          return;
        }

        // Increment click count (fire and forget)
        supabase
          .from("short_urls")
          .update({ click_count: shortUrlData.click_count + 1 })
          .eq("id", shortUrlData.id)
          .then();

        // Extract the path from the full URL and redirect
        const url = new URL(shortUrlData.full_url);
        navigate(url.pathname, { replace: true });
      } catch (err) {
        console.error("Redirect error:", err);
        setError(true);
      }
    };

    redirectToArticle();
  }, [shortCode, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">קישור לא נמצא</h1>
          <p className="text-muted-foreground mb-8">
            הקישור שניסית לגשת אליו אינו קיים או שפג תוקפו.
          </p>
          <a
            href="/"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            חזרה לעמוד הראשי
          </a>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
        <p className="text-muted-foreground">מפנה...</p>
      </div>
    </div>
  );
};

export default ShortUrlRedirect;
