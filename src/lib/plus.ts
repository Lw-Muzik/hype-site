/**
 * HypeMuzik Plus: the one thing this site sells.
 *
 * One product, one fixed price, one price id. Paddle's domain review checks
 * that the price shown on the site exists in the Paddle catalog, so
 * PLUS_PRICE_USD below must match the one-time price whose id the deploy
 * passes in VITE_PADDLE_PLUS_PRICE_ID. Change the amount here and in the
 * catalog together, never one alone.
 */
export const PLUS_NAME = 'HypeMuzik Plus';

/** The fixed price in US dollars, one time, no subscription. */
export const PLUS_PRICE_USD = 5;

/** How the price is written on the page. */
export const PLUS_PRICE_TEXT = `US$${PLUS_PRICE_USD}`;

/** Length of the free trial every new desktop install gets. */
export const PLUS_TRIAL_DAYS = 7;

/** The price line shown under the headline. */
export const PLUS_PRICE_LINE = `${PLUS_PRICE_TEXT} · one-time · yours for life`;

/** The six desktop features Plus unlocks. Nothing else is gated. */
export const PLUS_FEATURES = [
  { name: 'Per-app EQ', desc: 'Give individual apps their own equalizer settings.' },
  { name: 'Per-app mixer', desc: 'Balance the volume of each app on its own, from one mixer.' },
  { name: 'Convolver', desc: 'Load your own impulse responses (convolution IR) to model a space or a speaker.' },
  { name: '3D Surround', desc: 'Spread the stereo image into a wider, more immersive sound field.' },
  { name: 'Room reverb', desc: 'Add the ambience of a room to your music.' },
  { name: 'ViPER DDC curves', desc: 'Apply ViPER DDC curve files to correct your headphones\u2019 response.' }
] as const;

/** Plain-text list, for FAQ answers and structured data. */
export const PLUS_FEATURES_TEXT =
  'per-app EQ, per-app mixer, convolver, 3D surround, room reverb and ViPER DDC curves';

export type PaddleEnvironment = 'sandbox' | 'production';

export type CheckoutConfig = {
  environment: PaddleEnvironment;
  /** Paddle client-side token — public by design, safe to ship in the bundle. */
  token: string;
  /** The Paddle price id of HypeMuzik Plus. */
  priceId: string;
};

/** Client-side tokens are prefixed by the environment they belong to. */
const TOKEN_PREFIX: Record<PaddleEnvironment, string> = {
  sandbox: 'test_',
  production: 'live_'
};

const PRICE_ID = /^pri_[a-z0-9]+$/;

/**
 * Whether checkout can open, and against which Paddle account. Null means the
 * page shows the product and its price but the buy button stays off.
 *
 * The environment is never defaulted, and a token from the other environment
 * is refused: a sandbox build must not take real money, and a live build must
 * not quietly fall back to the sandbox.
 */
export function checkoutConfig(env: {
  env?: string;
  token?: string;
  priceId?: string;
}): CheckoutConfig | null {
  const environment = env.env;
  if (environment !== 'sandbox' && environment !== 'production') return null;
  if (!env.token?.startsWith(TOKEN_PREFIX[environment])) return null;

  const priceId = env.priceId?.trim();
  if (!priceId || !PRICE_ID.test(priceId)) return null;

  return { environment, token: env.token, priceId };
}

/** The build's checkout settings, baked in at build time like the analytics endpoint. */
export const CHECKOUT = checkoutConfig({
  env: import.meta.env.VITE_PADDLE_ENV as string | undefined,
  token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN as string | undefined,
  priceId: import.meta.env.VITE_PADDLE_PLUS_PRICE_ID as string | undefined
});
