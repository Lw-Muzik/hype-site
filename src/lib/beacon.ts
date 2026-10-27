import { browser } from '$app/environment';
import {
  VisitClock,
  classifyClick,
  externalReferrer,
  touchSession,
  trackingAllowed
} from '$lib/analytics-core';

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
 *
 * Privacy: cookieless; nothing is sent when Global Privacy Control is on.
 * Everything is best-effort and silent.
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

type Visit = {
  id?: string;
  ready: Promise<string | undefined>;
  clock: VisitClock;
  path: string;
  maxScroll: number;
};

let current: Visit | null = null;
let sessionId = '';
let firstView = true;
let wired = false;

function enabled(): boolean {
  return browser && !!API_BASE && trackingAllowed(navigator as { globalPrivacyControl?: boolean });
}

function post(path: string, body: unknown): Promise<Response | void> {
  return fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true
  }).catch(() => {});
}

function scrollPct(): number {
  const el = document.documentElement;
  const total = el.scrollHeight - el.clientHeight;
  if (total <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round(((window.scrollY || el.scrollTop) / total) * 100)));
}

/** Send the leave for the current visit, once. Safe on unload. */
function endVisit(): void {
  const v = current;
  if (!v || !enabled() || !v.clock.claimLeave()) return;
  const now = performance.now();
  const body = JSON.stringify({
    durationMs: v.clock.duration(now),
    maxScrollPct: Math.max(v.maxScroll, scrollPct())
  });
  const send = (id: string | undefined) => {
    if (!id) return;
    try {
      // text/plain keeps this a "simple" request: no CORS preflight, which a
      // page being torn down could not wait for.
      const ok = navigator.sendBeacon(
        `${API_BASE}/analytics/visit/${encodeURIComponent(id)}/leave`,
        new Blob([body], { type: 'text/plain;charset=UTF-8' })
      );
      void ok;
    } catch {
      /* ignore */
    }
  };
  if (v.id) send(v.id);
  else void v.ready.then(send);
}

function wire(): void {
  if (wired) return;
  wired = true;

  document.addEventListener('visibilitychange', () => {
    const hidden = document.visibilityState === 'hidden';
    current?.clock.setVisible(!hidden, performance.now());
    if (hidden) endVisit();
  });
  window.addEventListener('pagehide', endVisit);
  window.addEventListener(
    'scroll',
    () => {
      if (current) current.maxScroll = Math.max(current.maxScroll, scrollPct());
    },
    { passive: true }
  );

  // One delegated listener for downloads, tagged CTAs and outbound links.
  document.addEventListener(
    'click',
    (e) => {
      try {
        if (!enabled()) return;
        const info = classifyClick(e.target instanceof Element ? e.target : null, location.host);
        if (!info) return;
        const s = touchSession(sessionStorage, Date.now(), () => crypto.randomUUID());
        void post('/analytics/event', {
          visitId: current?.id,
          visitorId: visitorId(),
          sessionId: s.id,
          type: info.type,
          label: info.label,
          path: location.pathname
        });
      } catch {
        /* never break the click */
      }
    },
    true
  );
}

/**
 * Record a landing-site page view with the management API. Best-effort and
 * fully non-blocking — analytics must never break the page.
 */
export function recordVisit(path: string): void {
  if (!enabled()) return;
  try {
    wire();
    endVisit(); // close the page we are leaving
    const s = touchSession(sessionStorage, Date.now(), () => crypto.randomUUID(), location.search);
    sessionId = s.id;
    const referrer = firstView ? externalReferrer(document.referrer, location.host) : undefined;
    firstView = false;

    const visit: Visit = {
      ready: Promise.resolve(undefined),
      clock: new VisitClock(performance.now(), document.visibilityState === 'visible'),
      path,
      maxScroll: 0
    };
    visit.ready = post('/analytics/visit', {
      visitorId: visitorId(),
      sessionId,
      path,
      referrer,
      ...s.utm,
      language: navigator.language,
      screenW: window.screen?.width || window.innerWidth
    })
      .then(async (r) => {
        const j = r && (r as Response).ok ? await (r as Response).json() : null;
        visit.id = typeof j?.id === 'string' ? j.id : undefined;
        return visit.id;
      })
      .catch(() => undefined);
    current = visit;
  } catch {
    /* ignore */
  }
}
