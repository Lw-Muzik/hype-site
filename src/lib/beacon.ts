import { browser } from '$app/environment';

/**
 * Management API base. Set `VITE_MANAGEMENT_API` at build time to enable
 * analytics; when it is unset, nothing is sent.
 *
 * There is deliberately no localhost default. A baked-in `http://localhost:4000`
 * ships to production, where it means every visitor's browser POSTs their
 * visitor id to whatever happens to be running on *their own* machine — an
 * error in every console at best, and data sent somewhere unintended at worst.
 *
 * The endpoint must be https: this site is served over TLS, so a http:// URL
 * would be blocked as mixed content anyway.
 */
const API_BASE = import.meta.env.VITE_MANAGEMENT_API as string | undefined;

const VISITOR_KEY = 'hm_visitor_id';

/** A stable anonymous id (for unique-visitor counts), generated once per device. */
function visitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

/**
 * Record a landing-site page view with the management API. Best-effort and
 * fully non-blocking — analytics must never break the page.
 */
export function recordVisit(path: string): void {
  if (!browser || !API_BASE) return;
  try {
    void fetch(`${API_BASE}/analytics/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId: visitorId(), path }),
      keepalive: true
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
