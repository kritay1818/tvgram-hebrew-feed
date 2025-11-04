import { useState } from "react";
import { Accessibility, X, Plus, Minus, Eye, Type, MousePointer, Hand, Keyboard, Contrast } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const AccessibilityMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [highlightHeadings, setHighlightHeadings] = useState(false);
  const [largeCursor, setLargeCursor] = useState(false);
  const [readableFont, setReadableFont] = useState(false);

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 10, 200);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 10, 80);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  const resetFontSize = () => {
    setFontSize(100);
    document.documentElement.style.fontSize = "100%";
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    if (!highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  };

  const toggleHighlightLinks = () => {
    setHighlightLinks(!highlightLinks);
    if (!highlightLinks) {
      document.documentElement.classList.add("highlight-links");
    } else {
      document.documentElement.classList.remove("highlight-links");
    }
  };

  const toggleHighlightHeadings = () => {
    setHighlightHeadings(!highlightHeadings);
    if (!highlightHeadings) {
      document.documentElement.classList.add("highlight-headings");
    } else {
      document.documentElement.classList.remove("highlight-headings");
    }
  };

  const toggleLargeCursor = () => {
    setLargeCursor(!largeCursor);
    if (!largeCursor) {
      document.documentElement.classList.add("large-cursor");
    } else {
      document.documentElement.classList.remove("large-cursor");
    }
  };

  const toggleReadableFont = () => {
    setReadableFont(!readableFont);
    if (!readableFont) {
      document.documentElement.classList.add("readable-font");
    } else {
      document.documentElement.classList.remove("readable-font");
    }
  };

  const resetAll = () => {
    resetFontSize();
    setHighContrast(false);
    setHighlightLinks(false);
    setHighlightHeadings(false);
    setLargeCursor(false);
    setReadableFont(false);
    document.documentElement.classList.remove(
      "high-contrast",
      "highlight-links",
      "highlight-headings",
      "large-cursor",
      "readable-font"
    );
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 bottom-4 z-50 rounded-full w-14 h-14 bg-[#0066cc] hover:bg-[#0052a3] shadow-lg"
        aria-label="תפריט נגישות"
      >
        <Accessibility className="h-7 w-7 text-white" />
      </Button>

      {/* Accessibility Menu */}
      {isOpen && (
        <Card className="fixed left-20 bottom-4 z-50 p-6 shadow-2xl w-80 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <Accessibility className="h-5 w-5" />
              תפריט נגישות
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="סגור תפריט נגישות"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Font Size Controls */}
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Type className="h-4 w-4" />
                גודל טקסט ({fontSize}%)
              </h3>
              <div className="flex gap-2">
                <Button
                  onClick={decreaseFontSize}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  aria-label="הקטן טקסט"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  onClick={resetFontSize}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  aria-label="איפוס גודל טקסט"
                >
                  אפס
                </Button>
                <Button
                  onClick={increaseFontSize}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  aria-label="הגדל טקסט"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Toggle Options */}
            <div className="space-y-2">
              <Button
                onClick={toggleHighContrast}
                variant={highContrast ? "default" : "outline"}
                className="w-full justify-start"
                aria-pressed={highContrast}
              >
                <Contrast className="h-4 w-4 ml-2" />
                ניגודיות גבוהה
              </Button>

              <Button
                onClick={toggleHighlightLinks}
                variant={highlightLinks ? "default" : "outline"}
                className="w-full justify-start"
                aria-pressed={highlightLinks}
              >
                <Hand className="h-4 w-4 ml-2" />
                הדגש קישורים
              </Button>

              <Button
                onClick={toggleHighlightHeadings}
                variant={highlightHeadings ? "default" : "outline"}
                className="w-full justify-start"
                aria-pressed={highlightHeadings}
              >
                <Type className="h-4 w-4 ml-2" />
                הדגש כותרות
              </Button>

              <Button
                onClick={toggleLargeCursor}
                variant={largeCursor ? "default" : "outline"}
                className="w-full justify-start"
                aria-pressed={largeCursor}
              >
                <MousePointer className="h-4 w-4 ml-2" />
                סמן גדול
              </Button>

              <Button
                onClick={toggleReadableFont}
                variant={readableFont ? "default" : "outline"}
                className="w-full justify-start"
                aria-pressed={readableFont}
              >
                <Eye className="h-4 w-4 ml-2" />
                גופן קריא
              </Button>
            </div>

            <Separator />

            {/* Keyboard Navigation Info */}
            <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <Keyboard className="h-3 w-3" />
                <span className="font-semibold">ניווט במקלדת:</span>
              </div>
              <ul className="space-y-1 mr-5">
                <li>Tab - מעבר בין אלמנטים</li>
                <li>Enter - הפעלת כפתור</li>
                <li>ESC - סגירת תפריטים</li>
              </ul>
            </div>

            {/* Reset Button */}
            <Button
              onClick={resetAll}
              variant="destructive"
              className="w-full"
              aria-label="אפס את כל הגדרות הנגישות"
            >
              אפס הכל
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};

export default AccessibilityMenu;
