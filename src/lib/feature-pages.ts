/**
 * The four long-tail landing pages. One list feeds the footer's "Features"
 * column and each page's "More from HypeMuzik" block, so a page added here
 * shows up in both and the anchors never drift apart.
 */
export type FeaturePageLink = {
  path: string;
  /** Descriptive anchor text, used in the footer. */
  label: string;
  /** One line under the link in "More from HypeMuzik". */
  blurb: string;
};

export const FEATURE_PAGES: FeaturePageLink[] = [
  {
    path: '/mac-equalizer',
    label: 'Free equalizer for Mac',
    blurb: 'A 31-band system-wide equalizer for every app on your Mac, with no driver to install.'
  },
  {
    path: '/autoeq',
    label: 'AutoEq headphone profiles',
    blurb: 'Thousands of AutoEq headphone correction profiles, on desktop and phone.'
  },
  {
    path: '/vocal-remover',
    label: 'Free vocal remover',
    blurb: 'Karaoke, instrumental and drums-only listening, split on your own device.'
  },
  {
    path: '/linux-music-player',
    label: 'Linux music player',
    blurb: 'AppImage, .deb and .rpm builds with a 31-band equalizer and synced lyrics.'
  }
];
