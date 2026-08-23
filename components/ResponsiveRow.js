"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GAP_PX = 16; // matches gap-4

/**
 * Horizontally scrolling, snap-aligned carousel at every breakpoint.
 * - Touch/trackpad swipe works everywhere (native scroll).
 * - Left/right arrow buttons appear on sm+ screens for click navigation.
 * - Arrows loop: clicking "next" past the last card wraps to the first,
 *   and vice versa, so it never dead-ends.
 */
export default function ResponsiveRow({ items, renderItem, keyFn, itemWidthClass = "w-[42vw] xs:w-[38vw] sm:w-[220px] lg:w-[240px]" }) {
  const trackRef = useRef(null);

  function scrollByCard(direction) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    const cardWidth = card ? card.getBoundingClientRect().width + GAP_PX : el.clientWidth * 0.8;
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (direction > 0 && el.scrollLeft >= maxScroll - 4) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction < 0 && el.scrollLeft <= 4) {
      el.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      el.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
    }
  }

  if (!items.length) return null;

  return (
    <div className="relative group/row">
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2 scrollbar-hide sm:mx-0 sm:px-0 sm:pb-0"
      >
        {items.map((item, i) => (
          <div key={keyFn ? keyFn(item) : i} className={`shrink-0 snap-start ${itemWidthClass}`}>
            {renderItem(item)}
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <>
          <button
            onClick={() => scrollByCard(-1)}
            aria-label="Previous"
            className="hidden sm:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-ivory border border-taupe shadow-md opacity-0 group-hover/row:opacity-100 transition-opacity hover:border-oxblood z-10"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollByCard(1)}
            aria-label="Next"
            className="hidden sm:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-ivory border border-taupe shadow-md opacity-0 group-hover/row:opacity-100 transition-opacity hover:border-oxblood z-10"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}
    </div>
  );
}