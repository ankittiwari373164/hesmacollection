"use client";
import { useRef, useState } from "react";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { onImgError } from "@/lib/imgFallback";

export default function ProductGallery({ images, alt }) {
  const pics = images?.length ? images : [];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });
  const frameRef = useRef(null);

  function handleMouseMove(e) {
    const rect = frameRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({
      display: "block",
      backgroundImage: `url(${pics[active]})`,
      backgroundPosition: `${x}% ${y}%`,
    });
  }

  return (
    <div>
      <div className="flex gap-3">
        {pics.length > 1 && (
          <div className="hidden sm:flex flex-col gap-2 w-16 shrink-0">
            {pics.map((img, i) => (
              <button
                key={img + i}
                onClick={() => setActive(i)}
                className={`aspect-square rounded-sm overflow-hidden border ${active === i ? "border-oxblood" : "border-taupe"}`}
                aria-label={`View image ${i + 1}`}
              >
                <img src={img} onError={onImgError} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div
            ref={frameRef}
            className="relative bg-parchment rounded-sm overflow-hidden group cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoomStyle({ display: "none" })}
            onClick={() => setLightbox(true)}
          >
            <img src={pics[active]} onError={onImgError} alt={alt} className="w-full aspect-square object-cover" />
            {/* Desktop hover-zoom magnifier */}
            <div
              className="hidden md:block absolute inset-0 pointer-events-none bg-no-repeat"
              style={{ ...zoomStyle, backgroundSize: "200%" }}
            />
            <span className="absolute bottom-3 right-3 bg-ivory/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn size={16} className="text-ink" />
            </span>
          </div>

          {pics.length > 1 && (
            <div className="flex sm:hidden gap-2 mt-3 overflow-x-auto">
              {pics.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActive(i)}
                  className={`w-14 h-14 shrink-0 rounded-sm overflow-hidden border ${active === i ? "border-oxblood" : "border-taupe"}`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} onError={onImgError} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[60] bg-ink/95 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)} className="absolute top-5 right-5 text-ivory" aria-label="Close zoom">
            <X size={28} />
          </button>
          {pics.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setActive((a) => (a - 1 + pics.length) % pics.length); }}
                className="absolute left-3 sm:left-6 text-ivory p-2"
                aria-label="Previous image"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActive((a) => (a + 1) % pics.length); }}
                className="absolute right-3 sm:right-6 text-ivory p-2"
                aria-label="Next image"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}
          <img
            src={pics[active]}
            onError={onImgError}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[92vw] max-h-[86vh] object-contain cursor-zoom-out"
          />
          {pics.length > 1 && (
            <div className="absolute bottom-5 text-ivory/70 text-xs">{active + 1} / {pics.length}</div>
          )}
        </div>
      )}
    </div>
  );
}