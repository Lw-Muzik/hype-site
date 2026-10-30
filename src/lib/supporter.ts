/**
 * The Supporter pack: the one thing this site sells.
 *
 * Paddle's domain review checks that the prices on the site exist in the
 * Paddle catalog, so every amount below needs a matching one-time price on
 * the Supporter product (pro_01kyat9s0sce90vtvbrmspcwat), and the deploy
 * passes their ids in VITE_PADDLE_SUPPORTER_PRICES. Change an amount here and
 * in the catalog together, never one alone.
 */
export const SUPPORTER_AMOUNTS = [3, 5, 10, 25] as const;
export type SupporterAmount = (typeof SUPPORTER_AMOUNTS)[number];

/** Preselected on the page. */
export const SUPPORTER_DEFAULT: SupporterAmount = 5;

export type PaddleEnvironment = 'sandbox' | 'production';

export type CheckoutConfig = {
  environment: PaddleEnvironment;
  /** Paddle client-side token — public by design, safe to ship in the bundle. */
  token: string;
  prices: Partial<Record<SupporterAmount, string>>;
};

/** Client-side tokens are prefixed by the environment they belong to. */
const TOKEN_PREFIX: Record<PaddleEnvironment, string> = {
  sandbox: 'test_',
  production: 'live_'
};

const PRICE_ID = /^pri_[a-z0-9]+$/;

function isAmount(n: number): n is SupporterAmount {
  return (SUPPORTER_AMOUNTS as readonly number[]).includes(n);
}

/**
 * Parses `"3:pri_…,5:pri_…"` into amount → price id. Entries for amounts the
 * page doesn't offer, or ids that aren't price ids, are dropped rather than
 * failing the whole list.
 */
export function parsePrices(raw: string | undefined): Partial<Record<SupporterAmount, string>> {
  const prices: Partial<Record<SupporterAmount, string>> = {};
  for (const entry of (raw ?? '').split(',')) {
    const [amount, id] = entry.split(':').map((s) => s.trim());
    const n = Number(amount);
    if (isAmount(n) && id && PRICE_ID.test(id)) prices[n] = id;
  }
  return prices;
}

/**
 * Whether checkout can open, and against which Paddle account. Null means the
 * page shows the pack and its prices but the buy button stays off.
 *
 * The environment is never defaulted, and a token from the other environment
 * is refused: a sandbox build must not take real money, and a live build must
 * not quietly fall back to the sandbox.
 */
export function checkoutConfig(env: {
  env?: string;
  token?: string;
  prices?: string;
}): CheckoutConfig | null {
  const environment = env.env;
  if (environment !== 'sandbox' && environment !== 'production') return null;
  if (!env.token?.startsWith(TOKEN_PREFIX[environment])) return null;

  const prices = parsePrices(env.prices);
  if (Object.keys(prices).length === 0) return null;

  return { environment, token: env.token, prices };
}

/** The build's checkout settings, baked in at build time like the analytics endpoint. */
export const CHECKOUT = checkoutConfig({
  env: import.meta.env.VITE_PADDLE_ENV as string | undefined,
  token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN as string | undefined,
  prices: import.meta.env.VITE_PADDLE_SUPPORTER_PRICES as string | undefined
});
