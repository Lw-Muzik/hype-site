/**
 * Canonical site metadata.
 *
 * Social and canonical URLs must be absolute — a crawler or a chat client
 * unfurling a link has no page context to resolve `./og.png` against — so
 * everything here is built from one origin constant.
 */

export const SITE_URL = 'https://hypemuzik.com';

export const SITE_NAME = 'HypeMuzik';

export const TITLE = 'HypeMuzik — Studio-grade sound, on every device';

export const DESCRIPTION =
  'A 31-band equalizer, a full custom DSP chain, system-wide audio, and a phone that ' +
  "streams straight into your desktop's sound. One sound engine, every device.";

/** 1200×630, the size Facebook, X, LinkedIn, Slack and WhatsApp all crop from. */
export const OG_IMAGE = `${SITE_URL}/og.png`;
export const OG_IMAGE_ALT =
  'HypeMuzik — Shape every sound you hear. A 31-band equalizer and a full DSP chain.';
