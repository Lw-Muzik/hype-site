import { browser } from '$app/environment';

/** Management API base — set `VITE_MANAGEMENT_API` for staging/production. */
const API_BASE =
  import.meta.env.VITE_MANAGEMENT_API ?? 'http://localhost:4000/api';
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
  if (!browser) return;
  try {
    void fetch(`${API_BASE}/analytics/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId: visitorId(), path }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
