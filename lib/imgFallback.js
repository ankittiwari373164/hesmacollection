export const IMG_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#F3E7EE"/>
          <stop offset="1" stop-color="#E6D6E4"/>
        </linearGradient>
      </defs>
      <rect width="600" height="600" fill="url(#g)"/>
      <circle cx="300" cy="255" r="70" fill="none" stroke="#B98D3E" stroke-width="3" opacity="0.6"/>
      <path d="M266 255 L300 205 L334 255 L300 320 Z" fill="none" stroke="#5B2A63" stroke-width="3" opacity="0.7"/>
      <text x="300" y="410" font-family="serif" font-size="26" fill="#5B2A63" text-anchor="middle" opacity="0.7">Hesma Collection</text>
    </svg>
  `);

export function onImgError(e) {
  if (e.currentTarget.src !== IMG_FALLBACK) e.currentTarget.src = IMG_FALLBACK;
}
