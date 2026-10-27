// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import {
  MAX_DURATION_MS,
  SESSION_IDLE_MS,
  VisitClock,
  classifyClick,
  externalReferrer,
  normalizePlatform,
  platformFromHref,
  touchSession,
  trackingAllowed
} from './analytics-core';

const fakeStore = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};
let n = 0;
const ids = () => `sid-${++n}`;

describe('session id', () => {
  it('is stable within 30 min of activity and renews after idle', () => {
    const s = fakeStore();
    const a = touchSession(s, 0, ids);
    expect(a.isNew).toBe(true);
    const b = touchSession(s, SESSION_IDLE_MS - 1, ids);
    expect(b.id).toBe(a.id);
    // activity at 29:59 pushed the window forward
    const c = touchSession(s, SESSION_IDLE_MS - 1 + SESSION_IDLE_MS, ids);
    expect(c.id).toBe(a.id);
    const d = touchSession(s, SESSION_IDLE_MS * 3, ids);
    expect(d.id).not.toBe(a.id);
    expect(d.isNew).toBe(true);
  });
  it('survives corrupt storage', () => {
    const s = fakeStore();
    s.setItem('hm_session', '{nope');
    expect(touchSession(s, 5, ids).id).toBeTruthy();
  });
});

describe('utm persistence', () => {
  it('keeps tags for the session and drops them on renewal', () => {
    const s = fakeStore();
    const a = touchSession(s, 0, ids, '?utm_source=x&utm_medium=social&utm_campaign=launch');
    expect(a.utm).toEqual({ utmSource: 'x', utmMedium: 'social', utmCampaign: 'launch' });
    expect(touchSession(s, 1000, ids, '').utm).toEqual(a.utm);
    expect(touchSession(s, 2000, ids, '?utm_source=mail').utm).toEqual({ utmSource: 'mail' });
    expect(touchSession(s, 3000 + SESSION_IDLE_MS, ids, '').utm).toEqual({});
  });
});

describe('referrer', () => {
  it('keeps external, drops same-host and www variants', () => {
    expect(externalReferrer('https://www.google.com/search?q=x', 'hypemuzik.com')).toBe('https://www.google.com/search');
    expect(externalReferrer('https://hypemuzik.com/privacy', 'hypemuzik.com')).toBeUndefined();
    expect(externalReferrer('https://www.hypemuzik.com/', 'hypemuzik.com')).toBeUndefined();
    expect(externalReferrer('', 'hypemuzik.com')).toBeUndefined();
    expect(externalReferrer('android-app://com.x', 'hypemuzik.com')).toBeUndefined();
  });
});

describe('leave', () => {
  it('is claimed once and counts visible time only, capped', () => {
    const c = new VisitClock(0, true);
    c.setVisible(false, 4000);
    c.setVisible(true, 10000);
    expect(c.duration(11000)).toBe(5000);
    expect(c.claimLeave()).toBe(true);
    expect(c.claimLeave()).toBe(false);
    expect(new VisitClock(0, true).duration(MAX_DURATION_MS * 3)).toBe(MAX_DURATION_MS);
  });
});

describe('GPC', () => {
  it('skips tracking only when GPC is true', () => {
    expect(trackingAllowed({ globalPrivacyControl: true })).toBe(false);
    expect(trackingAllowed({ globalPrivacyControl: false })).toBe(true);
    expect(trackingAllowed({})).toBe(true);
    expect(trackingAllowed(undefined)).toBe(false);
  });
});

describe('download labels', () => {
  it('normalises and infers platforms', () => {
    expect(normalizePlatform('mac')).toBe('macos');
    expect(normalizePlatform('Win')).toBe('windows');
    expect(normalizePlatform('toaster')).toBeUndefined();
    expect(platformFromHref('https://apps.apple.com/us/app/x/id1')).toBe('ios');
    expect(platformFromHref('https://play.google.com/store/apps/details?id=x')).toBe('android');
    expect(platformFromHref('https://github.com/a/b/releases/download/v1/HypeMuzik_1_universal.dmg')).toBe('macos');
    expect(platformFromHref('https://github.com/a/b/releases/download/v1/x.msi')).toBe('windows');
    expect(platformFromHref('https://github.com/a/b/releases/download/v1/x.AppImage')).toBe('linux');
    expect(platformFromHref('https://github.com/a/b/releases/latest')).toBeUndefined();
  });
});

describe('classifyClick', () => {
  const dom = (html: string) => {
    document.body.innerHTML = html;
    return document.body.querySelector('#t');
  };
  it('prefers download, then cta, then outbound', () => {
    expect(classifyClick(dom('<a id=t data-download="mac" href="https://github.com/x"><b>hi</b></a>'), 'h.com')).toEqual({ type: 'download', label: 'macos' });
    expect(classifyClick(dom('<a data-download="linux" href="https://g.com/x"><b id=t>hi</b></a>'), 'h.com')).toEqual({ type: 'download', label: 'linux' });
    expect(classifyClick(dom('<a id=t data-track="hero-get" href="#download">x</a>'), 'h.com')).toEqual({ type: 'cta', label: 'hero-get' });
    expect(classifyClick(dom('<a id=t href="https://github.com/Lw-Muzik/hype-dsp">x</a>'), 'h.com')).toEqual({ type: 'outbound', label: 'github.com' });
    expect(classifyClick(dom('<a id=t href="/privacy">x</a>'), 'h.com')).toBeUndefined();
    expect(classifyClick(dom('<a id=t href="https://h.com/privacy">x</a>'), 'h.com')).toBeUndefined();
  });
});
