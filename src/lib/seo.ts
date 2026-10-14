/**
 * Canonical site metadata.
 *
 * Social and canonical URLs must be absolute — a crawler or a chat client
 * unfurling a link has no page context to resolve `./og.png` against — so
 * everything here is built from one origin constant.
 */

import { IOS_URL, PLAY_URL, GITHUB_URL } from '$lib/links';
import { RELEASES_URL } from '$lib/releases';

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

export const HERO_SCREENSHOT = `${SITE_URL}/hero/app-desktop-1440.webp`;

/**
 * Homepage JSON-LD: Organization + WebSite + SoftwareApplication in one
 * @graph. Deliberately omits the app version: the page is prerendered and the
 * release is resolved at runtime, so a baked version would go stale.
 */
export const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#org`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icons/icon-512.png`,
        width: 512,
        height: 512
      },
      sameAs: [GITHUB_URL, IOS_URL, PLAY_URL]
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: 'en',
      publisher: { '@id': `${SITE_URL}/#org` }
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#app`,
      name: SITE_NAME,
      url: SITE_URL,
      description: DESCRIPTION,
      applicationCategory: 'MultimediaApplication',
      applicationSubCategory: 'Music player and audio equalizer',
      operatingSystem: 'macOS, Windows, Linux, Android, iOS',
      image: OG_IMAGE,
      screenshot: HERO_SCREENSHOT,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      downloadUrl: [RELEASES_URL, IOS_URL, PLAY_URL],
      softwareHelp: GITHUB_URL,
      publisher: { '@id': `${SITE_URL}/#org` },
      author: { '@id': `${SITE_URL}/#org` },
      featureList: [
        '31-band graphic equalizer',
        '12-stage DSP chain',
        'System-wide audio processing',
        'Stem separation',
        'Phone to desktop audio streaming',
        'Synced karaoke lyrics',
        'Internet radio, TV and movies',
        'Google Drive and Dropbox libraries'
      ]
    }
  ]
};

/** Serialised for an inline <script>; `<` is escaped so it can't close the tag. */
export const structuredDataJson = JSON.stringify(structuredData).replace(/</g, '\\u003c');
