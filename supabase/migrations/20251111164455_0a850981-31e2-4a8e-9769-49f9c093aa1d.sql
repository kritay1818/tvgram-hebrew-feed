-- Fix function search_path for security
-- Drop functions with CASCADE to remove dependent triggers, then recreate everything

DROP FUNCTION IF EXISTS public._article_likes_inc() CASCADE;
CREATE OR REPLACE FUNCTION public._article_likes_inc()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
begin
  if (TG_OP = 'INSERT') then
    update public.articles set likes_count = coalesce(likes_count,0) + 1 where id = NEW.article_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update public.articles set likes_count = greatest(coalesce(likes_count,0) - 1, 0) where id = OLD.article_id;
    return OLD;
  end if;
end;
$function$;

-- Recreate triggers for likes
CREATE TRIGGER trg_article_likes_inc
  AFTER INSERT ON public.article_likes
  FOR EACH ROW EXECUTE FUNCTION public._article_likes_inc();

CREATE TRIGGER trg_article_likes_dec
  AFTER DELETE ON public.article_likes
  FOR EACH ROW EXECUTE FUNCTION public._article_likes_inc();

DROP FUNCTION IF EXISTS public._article_views_inc() CASCADE;
CREATE OR REPLACE FUNCTION public._article_views_inc()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
begin
  if (TG_OP = 'INSERT') then
    update public.articles set views_count = coalesce(views_count,0) + 1 where id = NEW.article_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update public.articles set views_count = greatest(coalesce(views_count,0) - 1, 0) where id = OLD.article_id;
    return OLD;
  end if;
end;
$function$;

-- Recreate triggers for views
CREATE TRIGGER trg_article_views_inc
  AFTER INSERT ON public.article_views
  FOR EACH ROW EXECUTE FUNCTION public._article_views_inc();

CREATE TRIGGER trg_article_views_dec
  AFTER DELETE ON public.article_views
  FOR EACH ROW EXECUTE FUNCTION public._article_views_inc();

DROP FUNCTION IF EXISTS public._article_comments_inc_on_approved() CASCADE;
CREATE OR REPLACE FUNCTION public._article_comments_inc_on_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
begin
  if (TG_OP = 'INSERT') then
    if (NEW.status = 'approved') then
      update public.articles set comments_count = coalesce(comments_count,0) + 1 where id = NEW.article_id;
    end if;
    return NEW;
  elsif (TG_OP = 'UPDATE') then
    if (OLD.status <> 'approved' and NEW.status = 'approved') then
      update public.articles set comments_count = coalesce(comments_count,0) + 1 where id = NEW.article_id;
    elsif (OLD.status = 'approved' and NEW.status <> 'approved') then
      update public.articles set comments_count = greatest(coalesce(comments_count,0) - 1, 0) where id = NEW.article_id;
    end if;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    if (OLD.status = 'approved') then
      update public.articles set comments_count = greatest(coalesce(comments_count,0) - 1, 0) where id = OLD.article_id;
    end if;
    return OLD;
  end if;
end;
$function$;

-- Recreate triggers for comments
CREATE TRIGGER trg_article_comments_inc
  AFTER INSERT ON public.article_comments
  FOR EACH ROW EXECUTE FUNCTION public._article_comments_inc_on_approved();

CREATE TRIGGER trg_article_comments_upd
  AFTER UPDATE ON public.article_comments
  FOR EACH ROW EXECUTE FUNCTION public._article_comments_inc_on_approved();

CREATE TRIGGER trg_article_comments_dec
  AFTER DELETE ON public.article_comments
  FOR EACH ROW EXECUTE FUNCTION public._article_comments_inc_on_approved();