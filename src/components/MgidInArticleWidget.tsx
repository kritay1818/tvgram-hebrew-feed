import { useEffect, useRef } from "react";

const MgidInArticleWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && window._mgq) {
      window._mgq.push(["_mgc.load"]);
    }
  }, []);

  return (
    <div ref={containerRef} className="my-8">
      <div data-type="_mgwidget" data-widget-id="1886918"></div>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(w,q){w[q]=w[q]||[];w[q].push(["_mgc.load"])})(window,"_mgq");`,
        }}
      />
    </div>
  );
};

export default MgidInArticleWidget;

declare global {
  interface Window {
    _mgq: any[];
  }
}
