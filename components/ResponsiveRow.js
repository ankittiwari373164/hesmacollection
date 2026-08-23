"use client";

/**
 * Wraps a list of items so they render as a horizontally-swipeable,
 * snap-scrolling carousel on phones, and fall back to the normal grid
 * layout from `gridClassName` on tablet/desktop.
 *
 * itemWidthClass controls how wide each card is while in carousel mode
 * (e.g. "w-[44vw]" shows ~2.2 cards at a time; "w-[80vw]" is one-at-a-time).
 */
export default function ResponsiveRow({ items, renderItem, keyFn, gridClassName = "sm:grid-cols-2 lg:grid-cols-4", itemWidthClass = "w-[42vw] xs:w-[38vw]" }) {
  return (
    <div className={`flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2 scrollbar-hide sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:gap-6 sm:overflow-visible ${gridClassName}`}>
      {items.map((item, i) => (
        <div key={keyFn ? keyFn(item) : i} className={`shrink-0 snap-start ${itemWidthClass} sm:w-auto`}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}
