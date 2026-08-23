import Link from "next/link";

export function SectionHeader({ eyebrow, title, viewAllHref }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
      </div>
      {viewAllHref && (
        <Link href={viewAllHref} className="text-xs tracking-widest2 uppercase border-b border-ink/60 pb-0.5 hover:text-oxblood hover:border-oxblood transition-colors">
          View all
        </Link>
      )}
    </div>
  );
}

export function BangleDivider() {
  return (
    <div className="bangle-divider my-20 sm:my-24">
      <span /><span /><span />
    </div>
  );
}
