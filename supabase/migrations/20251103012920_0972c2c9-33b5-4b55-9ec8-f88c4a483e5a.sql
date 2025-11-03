-- Insert categories
INSERT INTO categories (name, slug, description, is_in_nav, order_index) VALUES
('חדשות', 'news', 'חדשות אחרונות', true, 1),
('סלבס', 'celebs', 'כל חדשות הסלבס והבידור', true, 2),
('פלילי', 'crime', 'כתבות פלילי ומשפטי', true, 3),
('פוליטיקה', 'politics', 'חדשות פוליטיות', true, 4),
('ספורט', 'sport', 'חדשות ספורט', true, 5),
('VOD', 'vod', 'סרטונים מוקלטים', true, 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert live videos
INSERT INTO videos (title, description, platform, is_live, live_status, viewer_count, video_url, thumb_url) VALUES
('שידור חי: חדשות הערב', 'עדכוני חדשות בזמן אמת מהשטח', 'youtube', true, 'live', 15234, 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800'),
('ברייקינג: ישיבת ממשלה דחופה', 'סיקור חי מהכנסת', 'youtube', true, 'live', 8932, 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800')
ON CONFLICT DO NOTHING;

-- Insert VOD videos
INSERT INTO videos (title, description, platform, is_live, duration_seconds, thumb_url) VALUES
('סיכום השבוע: כל מה שקרה', 'סקירה שבועית של החדשות החשובות', 'youtube', false, 1240, 'https://images.unsplash.com/photo-1533073526757-2c8ca1df9f1c?w=800'),
('ראיון בלעדי: ראש הממשלה', 'הראיון המלא והבלעדי', 'youtube', false, 2850, 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800'),
('חקירה מיוחדת: השחיתות בממשל', 'תחקיר מקיף על פרשת השחיתות', 'youtube', false, 3600, 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800')
ON CONFLICT DO NOTHING;

-- Get category IDs for articles
DO $$
DECLARE
  cat_celebs_id uuid;
  cat_crime_id uuid;
  cat_politics_id uuid;
  cat_news_id uuid;
  cat_sport_id uuid;
  video_live_id uuid;
BEGIN
  -- Get category IDs
  SELECT id INTO cat_celebs_id FROM categories WHERE slug = 'celebs';
  SELECT id INTO cat_crime_id FROM categories WHERE slug = 'crime';
  SELECT id INTO cat_politics_id FROM categories WHERE slug = 'politics';
  SELECT id INTO cat_news_id FROM categories WHERE slug = 'news';
  SELECT id INTO cat_sport_id FROM categories WHERE slug = 'sport';
  SELECT id INTO video_live_id FROM videos WHERE is_live = true LIMIT 1;

  -- Insert articles for celebs category
  INSERT INTO articles (title, slug, summary, body_html, cover_url, author, primary_category_id, is_published, is_featured, homepage_rank, status, published_at, tags) VALUES
  ('כוכבת הריאליטי שברה שתיקה: "הייתי במערכת יחסים רעילה"', 'reality-star-toxic-relationship', 'בראיון בלעדי ומרגש, כוכבת הריאליטי פותחת על התקופה הקשה שעברה במערכת יחסים רעילה ואיך היא הצליחה להיחלץ', '<p>בראיון מרגש ובלעדי, כוכבת הריאליטי המובילה שיתפה את הקהל בסיפור האישי והמרגש שלה על התקופה הקשה שעברה במערכת יחסים רעילה. "זה לא היה קל בכלל", היא מספרת, "אבל הבנתי שאני חייבת לצאת מזה בשביל עצמי".</p><p>הכוכבת, שהעדיפה לשמור על אנונימיות של בן זוגה לשעבר, תיארה איך התחילה מערכת היחסים בצורה רומנטית אך התדרדרה במהירות. "בהתחלה הכל נראה מושלם, אבל אחר כך התחילו הסימנים", היא מספרת.</p>', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800', 'דנה כהן', cat_celebs_id, true, true, 1, 'published', now() - interval '2 hours', ARRAY['סלבס', 'ריאליטי', 'מערכות יחסים']),
  
  ('זמר ישראלי מוביל בהופעה מיוחדת לחטופים', 'singer-special-concert-hostages', 'אמן מוביל מארגן הופעה מיוחדת לטובת משפחות החטופים. כל ההכנסות יועברו למשפחות', '<p>במהלך מרגש ומיוחד, זמר ישראלי מוביל הודיע על ארגון הופעה מיוחדת שכל הכנסותיה יועברו למשפחות החטופים. "זה הפחות שאני יכול לעשות", אמר הזמר בהודעה שפרסם.</p><p>ההופעה תתקיים בכיכר רבין בתל אביב ותכלול אמנים מובילים נוספים שהצטרפו ליוזמה. "אנחנו כולנו ביחד בזה", הוסיף.</p>', 'https://images.unsplash.com/photo-1516873240891-4bf014598ab4?w=800', 'רועי לוי', cat_celebs_id, true, true, 2, 'published', now() - interval '4 hours', ARRAY['מוזיקה', 'חטופים', 'צדקה']),
  
  ('שחקנית ישראלית חושפת: "כמעט עזבתי את הקריירה"', 'actress-almost-quit-career', 'בראיון גלוי לב, שחקנית מובילה מספרת על הרגעים שכמעט גרמו לה לנטוש את עולם המשחק', '<p>שחקנית ישראלית מוכרת ואהובה חשפה בראיון נדיר את המחשבות שעברו לה לאחרונה על עזיבת עולם המשחק. "היו רגעים שבהם באמת שקלתי לעזוב הכל", היא מודה.</p><p>השחקנית, שזכתה לשבחים רבים על תפקידה האחרון, מספרת על הלחצים הכבדים בתעשייה. "זה לא רק התהילה והזרקורים, יש גם צד קשה מאוד שאנשים לא רואים", היא מסבירה.</p>', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800', 'מיכל אבני', cat_celebs_id, true, false, 3, 'published', now() - interval '6 hours', ARRAY['קולנוע', 'שחקנים', 'קריירה']),

  -- Insert articles for crime category
  ('מבצע משטרתי גדול: 20 חשודים נעצרו', 'police-operation-20-arrested', 'משטרת ישראל פשטה הבוקר על רשת פשיעה מאורגנת ועצרה 20 חשודים במספר ערים', '<p>במבצע משטרתי נרחב שהתנהל הבוקר (ראשון) ברחבי הארץ, עצרה משטרת ישראל 20 חשודים בפעילות פשיעה מאורגנת. המבצע התמקד בערים המרכז והצפון.</p><p>על פי החשד, הנעצרים מעורבים בעבירות של סחיטה, סחר בסמים, והלבנת הון. במהלך המעצרים, נתפסו כלי נשק, כסף במזומן בסכומים גבוהים, וחומרים לחקירה.</p><p>"זהו הישג משמעותי במאבק בפשיעה המאורגנת", אמר דובר המשטרה. "נמשיך לפעול בנחישות כנגד ארגוני הפשיעה".</p>', 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800', 'אורי שרון', cat_crime_id, true, true, 4, 'published', now() - interval '3 hours', ARRAY['משטרה', 'מעצרים', 'פשיעה מאורגנת']),
  
  ('פרשת שחיתות חדשה: חשד להעברת שוחד לפקיד בכיר', 'corruption-case-senior-official', 'היועץ המשפטי חושף: חשד להעברת שוחד בסכומים גבוהים לפקיד בכיר בעיריית תל אביב', '<p>היועץ המשפטי לממשלה הודיע היום על פתיחת חקירה בחשד להעברת שוחד בסכומים גבוהים לפקיד בכיר בעיריית תל אביב. החקירה מתמקדת בעסקאות נדל"ן חשודות שאושרו בחודשים האחרונים.</p><p>על פי החשד, הפקיד קיבל שוחד בסכומים של מאות אלפי שקלים בתמורה לאישור היתרי בנייה ושינויי ייעוד. הפקיד נעצר לחקירה הבוקר.</p>', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800', 'יעל ברק', cat_crime_id, true, false, 5, 'published', now() - interval '5 hours', ARRAY['שחיתות', 'עיריות', 'חקירה']),

  -- Insert articles for politics category  
  ('ראש הממשלה: "נמשיך בלחימה עד ניצחון מוחלט"', 'pm-continue-fighting-victory', 'בנאום בכנסת, ראש הממשלה מבהיר: אין פשרות, רק ניצחון מוחלט', '<p>ראש הממשלה נאם הערב (ראשון) בכנסת והבהיר כי ישראל תמשיך בלחימה עד להשגת ניצחון מוחלט. "לא נעצור, לא נרפה", אמר בנאום נחרץ.</p><p>הנאום עורר תגובות סוערות מהאופוזיציה, כאשר חברי כנסת רבים יצאו בביקורת על המדיניות הממשלתית. "זוהי מדיניות כושלת", אמר יו"ר האופוזיציה.</p><p>בינתיים, המשך הלחימה מעורר דאגות בינלאומיות, עם קריאות מארצות רבות להפסקת אש מיידית.</p>', 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800', 'גיל כהן', cat_politics_id, true, true, 6, 'published', now() - interval '1 hour', ARRAY['פוליטיקה', 'כנסת', 'ביטחון']),
  
  ('סקר חדש: הממשלה במשבר אמון', 'new-poll-government-crisis', 'סקר דעת קהל חדש מראה ירידה חדה באמון הציבור בממשלה', '<p>סקר דעת קהל שפורסם היום מראה ירידה חדה באמון הציבור בממשלה. על פי הסקר, רק 23% מהציבור סומכים על הממשלה.</p><p>הסקר, שנערך בקרב 1,200 נשאלים, מצביע על אי שביעות רצון רחבה מהטיפול במשבר הביטחוני והמצב הכלכלי.</p>', 'https://images.unsplash.com/photo-1569087682017-c8c0bc3e68ce?w=800', 'תמר רוזן', cat_politics_id, true, false, 7, 'published', now() - interval '7 hours', ARRAY['סקרים', 'ממשלה', 'דעת קהל']),

  -- Insert news articles
  ('התרעה באילת: חשש לחדירת כלי טיס עוין', 'eilat-alert-hostile-aircraft', 'צבעות התרעה נשמעו באילת בשל חשש לחדירת כלי טיס עוין מכיוון הים האדום', '<p>צבעות התרעה נשמעו הערב באילת בשל חשש לחדירת כלי טיס עוין מכיוון הים האדום. התושבים הונחו להיכנס למרחבים מוגנים.</p><p>דובר צה"ל מסר כי מערכות ההגנה נערכות להתמודד עם האיום. זוהי התרעה שלישית באילת השבוע.</p>', 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800', 'רן כהן', cat_news_id, true, true, 8, 'published', now() - interval '30 minutes', ARRAY['התרעה', 'אילת', 'ביטחון']),
  
  ('מזג אוויר קיצוני: סופת חורף קשה בדרך', 'extreme-weather-winter-storm', 'שירות המטאורולוגי מזהיר: סופת חורף קשה צפויה להגיע מחר', '<p>שירות המטאורולוגי הוציא הזהרה מפני סופת חורף קשה שצפויה להגיע מחר לישראל. צפויים גשמים עזים, רוחות חזקות, וירידה משמעותית בטמפרטורות.</p><p>הרשויות קוראות לציבור להיערך ולהימנע מנסיעות מיותרות במהלך הסופה.</p>', 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800', 'דנה לוי', cat_news_id, true, false, 9, 'published', now() - interval '8 hours', ARRAY['מזג אוויר', 'חורף', 'התרעה']);

END $$;
