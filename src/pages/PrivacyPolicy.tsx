import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 max-w-4xl">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-6 text-primary">מדיניות פרטיות</h1>
          
          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">מבוא</h2>
              <p className="leading-relaxed">
                ב-TVGRAM אנו מחויבים להגנה על פרטיות המשתמשים שלנו. מדיניות פרטיות זו מסבירה אילו נתונים אנו אוספים, כיצד אנו משתמשים בהם, וכיצד תוכלו לנהל את המידע שלכם.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">איזה נתונים אנו אוספים?</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed mr-4">
                <li><strong>נתוני גלישה:</strong> כתובת IP, סוג דפדפן, מערכת הפעלה, דפים שצפית בהם, ומשך הביקור באתר.</li>
                <li><strong>Cookies:</strong> אנו משתמשים ב-Cookies כדי לשפר את חוויית הגלישה שלך, לזכור את העדפותיך (כמו מצב תצוגה), ולנתח את השימוש באתר.</li>
                <li><strong>מידע שאתה מספק:</strong> אם תבחר ליצור קשר איתנו או להירשם לשירותים, אנו עשויים לאסוף שם, כתובת אימייל, ופרטים נוספים שתספק.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">למה אנו משתמשים במידע?</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed mr-4">
                <li>לספק ולשפר את השירותים והתכנים באתר</li>
                <li>לנתח דפוסי שימוש ולשפר את חוויית המשתמש</li>
                <li>להציג תוכן ופרסומות רלוונטיים</li>
                <li>לשלוח עדכונים ומידע שביקשת לקבל</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">שיתוף מידע עם צדדים שלישיים</h2>
              <p className="leading-relaxed">
                אנו לא מוכרים את המידע האישי שלך לצדדים שלישיים. אנו עשויים לשתף מידע עם ספקי שירות המסייעים לנו בהפעלת האתר (כמו שירותי אחסון ואנליטיקה), אך רק במידה הנדרשת לספק את השירות.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">Cookies - עוגיות</h2>
              <p className="leading-relaxed mb-2">
                אנו משתמשים ב-Cookies כדי לשפר את חוויית הגלישה שלך. Cookies הם קבצי טקסט קטנים הנשמרים במחשב או במכשיר הנייד שלך.
              </p>
              <p className="leading-relaxed">
                <strong>איך לנהל Cookies:</strong> ניתן לחסום או למחוק Cookies דרך הגדרות הדפדפן שלך. שים לב שחסימת Cookies עשויה להשפיע על חוויית השימוש באתר.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">הזכויות שלך</h2>
              <p className="leading-relaxed mb-2">
                בהתאם לחוק הגנת הפרטיות (תיקון 13), יש לך מספר זכויות לגבי המידע האישי שלך:
              </p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed mr-4">
                <li><strong>זכות עיון:</strong> תוכל לבקש לעיין במידע שנאסף עליך</li>
                <li><strong>זכות לתיקון:</strong> תוכל לבקש לתקן מידע שגוי או לא מדויק</li>
                <li><strong>זכות למחיקה:</strong> תוכל לבקש למחוק את המידע האישי שלך</li>
                <li><strong>זכות להתנגד:</strong> תוכל להתנגד לעיבוד מידע מסוים</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">כיצד לממש את הזכויות שלך?</h2>
              <p className="leading-relaxed mb-2">
                אם ברצונך לעיין במידע שנאסף עליך, לתקן אותו, או לבקש את מחיקתו, תוכל ליצור איתנו קשר בדרכים הבאות:
              </p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed mr-4">
                <li>שלח מייל ל: <a href="mailto:privacy@tvgram.co.il" className="text-primary hover:underline">privacy@tvgram.co.il</a></li>
                <li>פנה אלינו דרך דפי הרשתות החברתיות שלנו</li>
              </ul>
              <p className="leading-relaxed mt-2">
                נשיב לפניות תוך 30 ימים ממועד קבלת הבקשה.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">אבטחת מידע</h2>
              <p className="leading-relaxed">
                אנו נוקטים באמצעי אבטחה סבירים כדי להגן על המידע שלך מפני גישה בלתי מורשית, שינוי, או מחיקה. עם זאת, אין שיטת העברה או אחסון מידע מאובטחת לחלוטין.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">שינויים במדיניות</h2>
              <p className="leading-relaxed">
                אנו שומרים לעצמנו את הזכות לעדכן מדיניות פרטיות זו מעת לעת. שינויים מהותיים יפורסמו באתר, ומומלץ לעיין במדיניות מעת לעת.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">יצירת קשר</h2>
              <p className="leading-relaxed">
                לשאלות או הבהרות נוספות בנוגע למדיניות הפרטיות שלנו, ניתן ליצור קשר:
              </p>
              <p className="leading-relaxed mt-2">
                <strong>TVGRAM</strong><br />
                אימייל: <a href="mailto:privacy@tvgram.co.il" className="text-primary hover:underline">privacy@tvgram.co.il</a>
              </p>
            </section>

            <section className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                מדיניות זו עודכנה לאחרונה: נובמבר 2025<br />
                בהתאם לחוק הגנת הפרטיות, התשמ"א-1981 ותיקון 13
              </p>
            </section>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
