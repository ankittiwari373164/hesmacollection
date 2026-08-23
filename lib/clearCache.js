/**
 * Wipes every trace of Hesma Collection's local cache from this browser —
 * the Zustand/localStorage store (cart, wishlist, saved login, and on older
 * visits possibly a stale copy of the product catalog), sessionStorage, and
 * any cookies this site can access. Use when a browser is showing stale or
 * incorrect data that a normal refresh doesn't fix.
 */
export function clearSiteCache() {
  if (typeof window === "undefined") return;

  try {
    // Everything under our own key, plus any other keys this app may have
    // written directly (belt-and-braces in case of older versions).
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("hesma")) localStorage.removeItem(key);
    });
  } catch (e) {
    console.warn("Could not clear localStorage:", e);
  }

  try {
    sessionStorage.clear();
  } catch (e) {
    console.warn("Could not clear sessionStorage:", e);
  }

  try {
    // Clear any non-httpOnly cookies scoped to this site (httpOnly ones like
    // the admin session cookie are intentionally untouched — use the Log Out
    // button for that).
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0].trim();
      if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  } catch (e) {
    console.warn("Could not clear cookies:", e);
  }
}
