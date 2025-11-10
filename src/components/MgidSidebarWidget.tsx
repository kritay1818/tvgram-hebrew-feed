import { useEffect, useRef } from "react";

const MgidSidebarWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && window._mgq) {
      window._mgq.push(["_mgc.load"]);
    }
  }, []);

  return (
    <div ref={containerRef} className="fixed right-4 top-24 w-[300px] hidden xl:block z-10">
      <div data-type="_mgwidget" data-widget-id="1886921"></div>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(w,q){w[q]=w[q]||[];w[q].push(["_mgc.load"])})(window,"_mgq");`,
        }}
      />
    </div>
  );
};

export default MgidSidebarWidget;

declare global {
  interface Window {
    _mgq: any[];
  }
}
