/**
 * Canonical site metadata.
 *
 * Social and canonical URLs must be absolute — a crawler or a chat client
 * unfurling a link has no page context to resolve `./og.png` against — so
 * everything here is built from one origin constant.
 */

import { IOS_URL, PLAY_URL, GITHUB_URL, WEB_REMOTE_URL } from '$lib/links';
import { RELEASES_URL } from '$lib/releases';

export const SITE_URL = 'https://hypemuzik.com';

/** The homepage's canonical form — with the slash, as the sitemap lists it. */
export const HOME_URL = `${SITE_URL}/`;

export const SITE_NAME = 'HypeMuzik';

/**
 * Leads with what people type ("free music player", "equalizer", "no ads"):
 * the brand is new, so nobody searches for it yet. ≤60 chars so Google
 * shows it whole.
 */
export const TITLE = 'Free Music Player & Equalizer App, No Ads | HypeMuzik';

/** ≤155 chars — the length Google shows before truncating. */
export const DESCRIPTION =
  'Free music player and equalizer for Android, iPhone, Mac, Windows and Linux: ' +
  '31-band EQ, AutoEq headphone profiles, vocal remover, synced lyrics. No ads.';

/**
 * Homepage FAQ. One list drives both the visible section and the FAQPage
 * JSON-LD, so the markup can never claim something the page doesn't show.
 * Every answer must stay true of the shipping apps.
 */
export const HOME_FAQ: { q: string; a: string; more?: [href: string, label: string] }[] = [
  {
    q: 'Is HypeMuzik really free?',
    a: 'Yes. Every feature is free on every platform, with no ads, no paywall and no sign-up. If you want to back development there is an optional, pay-what-you-want Supporter pack; it adds a Supporter badge, and every feature stays free for everyone.'
  },
  {
    q: 'Which devices does HypeMuzik run on?',
    a: 'Android and iPhone, from Google Play and the App Store, and macOS, Windows and Linux on the desktop. The Mac download is one universal build for Apple Silicon and Intel.',
    more: ['/linux-music-player', 'HypeMuzik on Linux']
  },
  {
    q: 'Does HypeMuzik have an equalizer?',
    a: 'Yes: a 31-band graphic equalizer at ISO third-octave centres from 20 Hz to 20 kHz, inside a 12-stage DSP chain that adds headphone correction, bass boost, 3D surround, room reverb, a multiband compander and a brickwall limiter.'
  },
  {
    q: 'Can it equalize all the sound on my Mac?',
    a: 'Yes. System-wide processing runs other apps’ audio through the same chain using a Core Audio process tap, so there is no audio driver to install. It needs macOS 14.4 or later.',
    more: ['/mac-equalizer', 'The free system-wide equalizer for Mac']
  },
  {
    q: 'Does it have presets for my headphones?',
    a: 'Yes. Pick your headphone model and HypeMuzik applies its AutoEq correction profile before your own EQ — 3,938 models on the desktop and more than 6,000 on the phone.',
    more: ['/autoeq', 'How AutoEq headphone correction works']
  },
  {
    q: 'Can HypeMuzik remove vocals for karaoke?',
    a: 'Yes. Stem separation runs on your device and splits a song into vocals, drums and instruments while it plays, so you can turn the vocals down for karaoke or solo them to learn a part.',
    more: ['/vocal-remover', 'The free vocal remover']
  },
  {
    q: 'Does it show synced lyrics?',
    a: 'Yes. Lyrics follow the song line by line, karaoke-style, on both the phone and the desktop.'
  },
  {
    q: 'Can I play music from Google Drive or Dropbox?',
    a: 'Yes. Connect one or more Google Drive or Dropbox accounts and play straight from them, with the same library on the desktop and the phone.'
  },
  {
    q: 'Can my phone play through my computer’s sound?',
    a: 'Yes. Phone Link streams your phone’s library to the desktop over your own Wi-Fi, where it runs through the desktop’s full DSP chain. Nothing goes through the cloud.'
  }
];

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
      // How the stores spell it today (Play: "Hype Muzik"; App Store:
      // "HypeMuzik - DSP"), so engines resolve all three to one entity.
      alternateName: ['Hype Muzik', 'HypeMuzik - DSP'],
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
      alternateName: ['Hype Muzik', 'HypeMuzik - DSP'],
      url: SITE_URL,
      description: DESCRIPTION,
      applicationCategory: 'MultimediaApplication',
      applicationSubCategory: 'Music player and audio equalizer',
      operatingSystem: 'macOS, Windows, Linux, Android, iOS',
      image: OG_IMAGE,
      screenshot: HERO_SCREENSHOT,
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      downloadUrl: [RELEASES_URL, IOS_URL, PLAY_URL],
      softwareHelp: GITHUB_URL,
      publisher: { '@id': `${SITE_URL}/#org` },
      author: { '@id': `${SITE_URL}/#org` },
      featureList: [
        'Free, with no ads and no sign-up',
        '31-band graphic equalizer',
        '12-stage DSP chain',
        'System-wide audio processing',
        'AutoEq headphone correction profiles',
        'Vocal remover and karaoke (on-device stem separation)',
        'Phone to desktop audio streaming',
        'Synced karaoke lyrics',
        'Visualisers driven by the processed signal',
        'Google Drive and Dropbox libraries',
        'Remote control from any web browser (Hype Connect)',
        'Phone and desktop remote with one-tap takeover'
      ]
    },
    {
      '@type': 'WebApplication',
      '@id': `${SITE_URL}/#web-remote`,
      name: 'Hype Connect',
      url: WEB_REMOTE_URL,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript and a modern web browser',
      description:
        'Control HypeMuzik on your phone or desktop from any browser: search, queue, synced lyrics and a live visualiser. Nothing plays in the browser.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@id': `${SITE_URL}/#org` }
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: HOME_FAQ.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a }
      }))
    }
  ]
};

/** Serialised for an inline <script>; `<` is escaped so it can't close the tag. */
export const structuredDataJson = JSON.stringify(structuredData).replace(/</g, '\\u003c');
