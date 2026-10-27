/**
 * Pure, dependency-free pieces of the visitor analytics, kept apart from the
 * DOM wiring in `beacon.ts` so each rule can be unit-tested.
 *
 * Cookieless by design: the visitor id lives in localStorage, the session in
 * sessionStorage. Nothing here touches `document.cookie`.
 */

export const SESSION_IDLE_MS = 30 * 60 * 1000;
export const MAX_DURATION_MS = 30 * 60 * 1000;

/** Minimal Storage surface, so tests can pass a Map-backed fake. */
export type KV = Pick<Storage, 'getItem' | 'setItem'>;

export type Utm = { utmSource?: string; utmMedium?: string; utmCampaign?: string };

type SessionRecord = { id: string; ts: number; utm: Utm };

const SESSION_KEY = 'hm_session';

/** Honour Global Privacy Control: when set, nothing is sent at all. */
export function trackingAllowed(nav: { globalPrivacyControl?: boolean } | undefined): boolean {
  return !!nav && nav.globalPrivacyControl !== true;
}

function clip(v: string | null | undefined, max = 100): string | undefined {
  const s = (v ?? '').trim().slice(0, max);
  return s || undefined;
}

export function parseUtm(search: string): Utm {
  const p = new URLSearchParams(search);
  const utm: Utm = {
    utmSource: clip(p.get('utm_source')),
    utmMedium: clip(p.get('utm_medium')),
    utmCampaign: clip(p.get('utm_campaign'))
  };
  for (const k of Object.keys(utm) as (keyof Utm)[]) if (!utm[k]) delete utm[k];
  return utm;
}

/**
 * Returns the current session id and campaign tags, creating or renewing the
 * session as needed. A session lapses after 30 minutes with no activity; each
 * call counts as activity. Campaign tags found in `search` are remembered for
 * the rest of the session, so a later page without them is still attributed.
 */
export function touchSession(
  store: KV,
  now: number,
  newId: () => string,
  search = ''
): { id: string; utm: Utm; isNew: boolean } {
  let rec: SessionRecord | null = null;
  try {
    const raw = store.getItem(SESSION_KEY);
    if (raw) rec = JSON.parse(raw) as SessionRecord;
  } catch {
    rec = null;
  }
  const fresh = !rec || typeof rec.ts !== 'number' || now - rec.ts > SESSION_IDLE_MS || !rec.id;
  const next: SessionRecord = fresh
    ? { id: newId(), ts: now, utm: {} }
    : { id: rec!.id, ts: now, utm: rec!.utm ?? {} };

  const fromUrl = parseUtm(search);
  if (Object.keys(fromUrl).length) next.utm = fromUrl;

  try {
    store.setItem(SESSION_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: still return a usable id for this call */
  }
  return { id: next.id, utm: next.utm, isNew: fresh };
}

/** The referrer's host, or undefined when it is empty, unparsable or this site. */
export function externalReferrer(referrer: string, ownHost: string): string | undefined {
  if (!referrer) return undefined;
  try {
    const u = new URL(referrer);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return undefined;
    const strip = (h: string) => h.toLowerCase().replace(/^www\./, '');
    if (strip(u.host) === strip(ownHost)) return undefined;
    return u.origin + u.pathname;
  } catch {
    return undefined;
  }
}

/**
 * Tracks visible time and enforces "send the leave once". Time spent in a
 * hidden tab does not count, and the total is capped at 30 minutes.
 */
export class VisitClock {
  private visibleSince: number | null;
  private accrued = 0;
  private done = false;

  constructor(now: number, visible: boolean) {
    this.visibleSince = visible ? now : null;
  }

  setVisible(visible: boolean, now: number): void {
    if (visible && this.visibleSince === null) this.visibleSince = now;
    if (!visible && this.visibleSince !== null) {
      this.accrued += Math.max(0, now - this.visibleSince);
      this.visibleSince = null;
    }
  }

  /** Visible milliseconds so far, capped. */
  duration(now: number): number {
    const live = this.visibleSince === null ? 0 : Math.max(0, now - this.visibleSince);
    return Math.min(MAX_DURATION_MS, Math.round(this.accrued + live));
  }

  /** True exactly once; every later call returns false. */
  claimLeave(): boolean {
    if (this.done) return false;
    this.done = true;
    return true;
  }
}

export type Platform = 'android' | 'ios' | 'windows' | 'macos' | 'linux';

const PLATFORM_ALIASES: Record<string, Platform> = {
  android: 'android',
  ios: 'ios',
  windows: 'windows',
  win: 'windows',
  macos: 'macos',
  mac: 'macos',
  linux: 'linux'
};

/** Normalises a `data-download` value; undefined when it is not a platform. */
export function normalizePlatform(value: string | null | undefined): Platform | undefined {
  return PLATFORM_ALIASES[(value ?? '').trim().toLowerCase()];
}

/** Fallback for untagged links: infer the platform from the destination. */
export function platformFromHref(href: string): Platform | undefined {
  let u: URL;
  try {
    u = new URL(href, 'https://x.invalid');
  } catch {
    return undefined;
  }
  if (u.host === 'apps.apple.com') return 'ios';
  if (u.host === 'play.google.com') return 'android';
  const f = u.pathname.toLowerCase();
  if (/\.(dmg|pkg)$/.test(f)) return 'macos';
  if (/\.(exe|msi)$/.test(f)) return 'windows';
  if (/\.(appimage|deb|rpm|snap)$/.test(f)) return 'linux';
  return undefined;
}

export type ClickInfo = { type: 'download' | 'cta' | 'outbound'; label: string };

/**
 * Decides what (if anything) a click should record. Order matters: a download
 * is also an off-site link, and a tagged CTA may be one too, so the most
 * specific meaning wins.
 */
export function classifyClick(
  el: Element | null,
  ownHost: string
): ClickInfo | undefined {
  if (!el) return undefined;

  const dl = el.closest('[data-download]');
  if (dl) {
    const p = normalizePlatform(dl.getAttribute('data-download'));
    if (p) return { type: 'download', label: p };
  }

  const a = el.closest('a[href]');
  if (a) {
    const p = platformFromHref(a.getAttribute('href') ?? '');
    if (p) return { type: 'download', label: p };
  }

  const cta = el.closest('[data-track]');
  const ctaLabel = clip(cta?.getAttribute('data-track'));
  if (ctaLabel) return { type: 'cta', label: ctaLabel };

  if (a) {
    try {
      const u = new URL(a.getAttribute('href') ?? '', `https://${ownHost}`);
      if ((u.protocol === 'http:' || u.protocol === 'https:') && u.host !== ownHost) {
        return { type: 'outbound', label: u.host };
      }
    } catch {
      /* ignore */
    }
  }
  return undefined;
}
