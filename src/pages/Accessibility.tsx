import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const Accessibility = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 max-w-4xl">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-6 text-primary">הצהרת נגישות</h1>
          
          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">מחויבות לנגישות</h2>
              <p className="leading-relaxed">
                TVGRAM מחויב להנגיש את השירותים באתר לכלל האוכלוסייה, לרבות אנשים עם מוגבלויות. אנו פועלים ליישום תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013, ופועלים להנגשת האתר בהתאם לתקן הישראלי (ת"י 5568) ולהנחיות הבינלאומיות WCAG 2.1 ברמה AA.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">התאמות נגישות באתר</h2>
              <p className="leading-relaxed mb-2">האתר כולל מספר התאמות נגישות:</p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed mr-4">
                <li><strong>ניווט במקלדת:</strong> ניתן לנווט באתר באמצעות מקלדת בלבד</li>
                <li><strong>תמיכה בקוראי מסך:</strong> האתר תומך בתוכנות קוראי מסך מובילות (NVDA, JAWS, VoiceOver)</li>
                <li><strong>ניגודיות צבעים:</strong> השתמשנו בצבעים בעלי ניגודיות גבוהה לקריאות מיטבית</li>
                <li><strong>גדלי גופנים:</strong> ניתן להגדיל ולהקטין את גודל הטקסט באמצעות הדפדפן (Ctrl + / Ctrl -)</li>
                <li><strong>טקסטים חלופיים:</strong> כל התמונות כוללות תיאור טקסטואלי חלופי</li>
                <li><strong>כותרות היררכיות:</strong> המבנה כולל כותרות מסודרות להקלת הניווט</li>
                <li><strong>קישורים תיאוריים:</strong> כל הקישורים כוללים תיאור ברור של יעדם</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">טכנולוגיות מסייעות</h2>
              <p className="leading-relaxed mb-2">
                האתר נבדק ומותאם לעבודה עם הטכנולוגיות המסייעות הבאות:
              </p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed mr-4">
                <li>דפדפנים מודרניים: Chrome, Firefox, Safari, Edge</li>
                <li>קוראי מסך: NVDA, JAWS, VoiceOver</li>
                <li>הגדלת טקסט באמצעות הדפדפן עד 200%</li>
                <li>ניווט במקלדת ובטכנולוגיות בקרה קוליות</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">קיצורי מקשים</h2>
              <p className="leading-relaxed mb-2">קיצורי דרך שימושיים לניווט באתר:</p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed mr-4">
                <li><strong>Tab:</strong> מעבר בין אלמנטים ניתנים ללחיצה</li>
                <li><strong>Shift + Tab:</strong> מעבר לאחור בין אלמנטים</li>
                <li><strong>Enter:</strong> הפעלת קישור או כפתור</li>
                <li><strong>Ctrl + / Ctrl -:</strong> הגדלה או הקטנה של הטקסט</li>
                <li><strong>Home:</strong> קפיצה לראש העמוד</li>
                <li><strong>End:</strong> קפיצה לתחתית העמוד</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">חלקים שאינם נגישים</h2>
              <p className="leading-relaxed">
                למרות מאמצינו להנגיש את כל התכנים באתר, ייתכן שחלק מהתכנים עדיין אינם נגישים במלואם. אנו ממשיכים לעבוד על שיפור הנגישות באופן שוטף. תכנים שמקורם מצד שלישי (כמו סרטונים משובצים) עשויים להיות בעלי נגישות חלקית.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">רכז נגישות</h2>
              <p className="leading-relaxed mb-2">
                למידע נוסף על הנגישות באתר, ניתן לפנות לרכז הנגישות:
              </p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed mr-4">
                <li><strong>שם:</strong> רכז נגישות TVGRAM</li>
                <li><strong>אימייל:</strong> <a href="mailto:accessibility@tvgram.co.il" className="text-primary hover:underline">accessibility@tvgram.co.il</a></li>
                <li><strong>זמן תגובה:</strong> נשתדל להשיב תוך 5 ימי עסקים</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">משוב ובקשות</h2>
              <p className="leading-relaxed">
                אם נתקלת בבעיית נגישות באתר, או אם יש לך הצעות לשיפור, נשמח לשמוע ממך. אנא פנה אלינו בכתובת: <a href="mailto:accessibility@tvgram.co.il" className="text-primary hover:underline">accessibility@tvgram.co.il</a>
              </p>
              <p className="leading-relaxed mt-2">
                תיאור הבעיה יסייע לנו לטפל בה במהירות - נא לציין את הדף בו נתקלת בבעיה, סוג הדפדפן והטכנולוגיה המסייעת בה השתמשת.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">הסדרי נגישות פיזיים</h2>
              <p className="leading-relaxed">
                TVGRAM הינו אתר אינטרנט בלבד ואינו כולל מתקן פיזי. כל השירותים ניתנים באופן מקוון.
              </p>
            </section>

            <section className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                הצהרה זו עודכנה לאחרונה: נובמבר 2025<br />
                האתר עבר בדיקת נגישות והותאם בהתאם לתקן הישראלי ת"י 5568 ברמה AA
              </p>
            </section>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Accessibility;
