/**
 * One source of truth for the legal pages, the footer and the homepage's
 * data-transparency block.
 *
 * The Google scope lives HERE, in one constant, because four things have to
 * agree with each other or OAuth verification fails: the consent screen, the
 * privacy policy, the homepage disclosure, and the app code itself. Today the
 * apps request `drive.readonly` (hypemuzik-desktop/src-tauri/src/cloud.rs and
 * hype/lib/services/cloud_auth_service.dart). When they migrate to
 * `drive.file`, swap GOOGLE_DRIVE_SCOPE for GOOGLE_DRIVE_SCOPE_FILE below and
 * every user-facing description follows automatically.
 *
 * See docs/drive-file-migration.md.
 */

/**
 * Trading name used as the data controller throughout. HypeMuzik is operated
 * by an individual (sole trader) in Uganda; if you want your full legal name
 * to appear alongside the trading name, set OPERATOR_LEGAL_NAME below and it
 * is woven into both documents. Left empty, the pages read cleanly without it.
 */
export const OPERATOR = 'HypeMuzik';

/** Optional. e.g. 'Bruno Ssemakula'. Empty = the pages just say "HypeMuzik". */
export const OPERATOR_LEGAL_NAME = '';

/** Rendered wherever the documents introduce who is responsible. */
export const OPERATOR_FULL = OPERATOR_LEGAL_NAME
  ? `${OPERATOR}, operated as a sole proprietorship by ${OPERATOR_LEGAL_NAME}`
  : `${OPERATOR}, operated as a sole proprietorship by an individual developer`;

export const JURISDICTION = 'the Republic of Uganda';
export const JURISDICTION_SHORT = 'Uganda';

export const CONTACT_EMAIL = 'brunolabs256@gmail.com';

/**
 * ISO date each document's current text took effect, and its human rendering.
 * Bump only the document you changed: the page header and the sitemap's
 * lastmod both read from here.
 */
export const EFFECTIVE = {
  privacy: { iso: '2026-10-30', display: '30 October 2026' },
  terms: { iso: '2026-10-30', display: '30 October 2026' },
  refunds: { iso: '2026-10-26', display: '26 October 2026' }
} as const;

export type Effective = (typeof EFFECTIVE)[keyof typeof EFFECTIVE];

// --------------------------------------------------------------------- Refunds

/**
 * Change-of-mind refund window, in days, for anything bought from us
 * directly. Paddle rejects a site at domain review if this is under 14 (or
 * over 90), or if the policy says "no refunds" / "all sales are final".
 * 14 also meets the EU/UK withdrawal period and beats Uganda's 7-day
 * cancellation right (Electronic Transactions Act 2011, s.25), so it is the
 * floor — raise it if you like, never lower it.
 */
export const REFUND_WINDOW_DAYS = 14;

/**
 * Paddle is the Merchant of Record for website purchases. Its reviewers look
 * for this disclosure, effectively verbatim, in the Terms — do not paraphrase.
 */
export const PADDLE_MOR_DISCLOSURE =
  'Our order process is conducted by our online reseller Paddle.com. ' +
  'Paddle.com is the Merchant of Record for all our orders.';

/** Where buyers look up a Paddle order, cancel a plan, or ask for a refund. */
export const PADDLE_ORDERS_URL = 'https://paddle.net';
export const PADDLE_BUYER_TERMS_URL = 'https://www.paddle.com/legal/checkout-buyer-terms';

/** Store refunds are the stores' call, not ours. */
export const APPLE_REFUND_URL = 'https://reportaproblem.apple.com';
export const GOOGLE_PLAY_REFUND_URL = 'https://support.google.com/googleplay/answer/2479637';

// ---------------------------------------------------------------- OAuth scopes

/** What the apps request today. Restricted scope — see the migration doc. */
export const GOOGLE_DRIVE_SCOPE = {
  id: 'https://www.googleapis.com/auth/drive.readonly',
  /** Plain-language, and honest about the breadth of the grant. */
  grants: 'read-only access to the files in your Google Drive',
  /** Why we ask. This sentence is what a verification reviewer reads first. */
  purpose:
    'so HypeMuzik can list the audio files you keep in Drive and stream them ' +
    'back to you through its own equalizer and DSP chain',
  /** The narrower alternative, named so users can see we know it exists. */
  breadth:
    'Google does not offer a "music files only" permission, so this grant is ' +
    'broader than what HypeMuzik uses. HypeMuzik reads only audio files and ' +
    'the folder names needed to show them to you.'
} as const;

/**
 * The post-migration replacement. Unused until the apps switch — kept here so
 * the swap is a one-line edit rather than a rewrite of both documents.
 */
export const GOOGLE_DRIVE_SCOPE_FILE = {
  id: 'https://www.googleapis.com/auth/drive.file',
  grants: 'access only to the files and folders you specifically pick',
  purpose:
    'so HypeMuzik can stream the music you choose through its own equalizer ' +
    'and DSP chain',
  breadth:
    'HypeMuzik cannot see anything else in your Drive — only what you hand it ' +
    'through the Google file picker.'
} as const;

/**
 * Google requires this sentence, effectively verbatim, from any app using a
 * sensitive or restricted scope. Do not paraphrase it.
 */
export const LIMITED_USE_DISCLOSURE =
  "HypeMuzik's use and transfer of information received from Google APIs to " +
  'any other app will adhere to the ' +
  'Google API Services User Data Policy, including the Limited Use requirements.';

export const GOOGLE_USER_DATA_POLICY_URL =
  'https://developers.google.com/terms/api-services-user-data-policy';

export const GOOGLE_PERMISSIONS_URL = 'https://myaccount.google.com/permissions';
export const DROPBOX_APPS_URL = 'https://www.dropbox.com/account/connected_apps';
