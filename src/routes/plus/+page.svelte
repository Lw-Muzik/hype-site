<script lang="ts">
  /**
   * /plus — HypeMuzik Plus, the one thing this site sells.
   *
   * Paddle's domain review reads this page: a real software licence at a fixed
   * price, what it unlocks, what stays free, the Merchant of Record line and a
   * path to the refund policy. Checkout is Paddle's overlay, loaded only when
   * someone presses Buy, so a visitor who only reads the page never fetches
   * Paddle's script.
   */
  import { onDestroy, onMount } from 'svelte';
  import type { Paddle, PaddleEventData } from '@paddle/paddle-js';
  import Logo from '$lib/components/Logo.svelte';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  import FeatureShot from '$lib/components/FeatureShot.svelte';
  import { SITE_URL, SITE_NAME, OG_IMAGE, OG_IMAGE_ALT } from '$lib/seo';
  import { CONTACT_EMAIL, PADDLE_MOR_DISCLOSURE, REFUND_WINDOW_DAYS } from '$lib/legal';
  import {
    CHECKOUT,
    PLUS_FEATURES,
    PLUS_FEATURES_TEXT,
    PLUS_NAME,
    PLUS_PRICE_LINE,
    PLUS_PRICE_TEXT,
    PLUS_PRICE_USD,
    PLUS_TRIAL_DAYS
  } from '$lib/plus';

  const title = PLUS_NAME;
  const description = `HypeMuzik Plus adds pro audio tools to the desktop app: ${PLUS_FEATURES_TEXT}. ${PLUS_PRICE_TEXT}, one time, yours for life. No subscription.`;
  const canonical = `${SITE_URL}/plus`;

  /** Overlay never reported in — a blocked script, or a domain Paddle hasn't approved. */
  const OPEN_TIMEOUT_MS = 15_000;

  let phase = $state<'idle' | 'opening' | 'failed' | 'done'>('idle');
  let paidEmail = $state<string | null>(null);
  const priceId = CHECKOUT?.priceId;

  let paddle: Paddle | undefined;
  let openTimer: ReturnType<typeof setTimeout> | undefined;

  function settle(next: typeof phase) {
    clearTimeout(openTimer);
    phase = next;
  }

  function onPaddleEvent(event: PaddleEventData) {
    switch (event.name as string | undefined) {
      case 'checkout.loaded':
        if (phase === 'opening') settle('idle');
        break;
      case 'checkout.completed':
        paidEmail = event.data?.customer?.email ?? null;
        settle('done');
        break;
      case 'checkout.error':
        settle('failed');
        break;
    }
  }

  function startOpening() {
    phase = 'opening';
    openTimer = setTimeout(() => {
      if (phase === 'opening') phase = 'failed';
    }, OPEN_TIMEOUT_MS);
  }

  /** Loads and initialises Paddle.js once; later calls reuse it. */
  async function ensurePaddle(config: NonNullable<typeof CHECKOUT>): Promise<Paddle> {
    if (!paddle) {
      const { initializePaddle } = await import('@paddle/paddle-js');
      paddle = await initializePaddle({
        environment: config.environment,
        token: config.token,
        eventCallback: onPaddleEvent,
        checkout: { settings: { displayMode: 'overlay', theme: 'dark', variant: 'one-page' } }
      });
    }
    if (!paddle) throw new Error('Paddle.js did not load');
    return paddle;
  }

  async function buy() {
    if (!CHECKOUT || phase === 'opening') return;
    startOpening();
    try {
      const p = await ensurePaddle(CHECKOUT);
      p.Checkout.open({
        items: [{ priceId: CHECKOUT.priceId, quantity: 1 }],
        settings: { displayMode: 'overlay', theme: 'dark', variant: 'one-page' }
      });
    } catch {
      settle('failed');
    }
  }

  // This page is also Paddle's default payment link: a checkout started in the
  // desktop app arrives here as /plus?_ptxn=txn_…, and Paddle.js opens that
  // transaction by itself once it is initialised. Ordinary visitors (no _ptxn)
  // still never load Paddle's script until they press Buy. The old /support
  // address redirects here with its query string intact.
  onMount(() => {
    if (!new URL(window.location.href).searchParams.get('_ptxn')) return;
    if (!CHECKOUT) {
      phase = 'failed';
      return;
    }
    startOpening();
    ensurePaddle(CHECKOUT).catch(() => settle('failed'));
  });

  onDestroy(() => clearTimeout(openTimer));

  const platforms = ['macOS', 'Windows', 'Linux'];

  // Small line icons, one per feature, same stroke style as the homepage cards.
  const ICONS = [
    'M5 21V10M5 6V3M12 21v-7M12 10V3M19 21v-4M19 13V3M3 8h4M10 12h4M17 15h4',
    'M4 6h16M4 12h16M4 18h16M8 4v4M15 10v4M10 16v4',
    'M2 12h2l2-6 4 14 4-18 3 10h5',
    'M12 3 3 8l9 5 9-5-9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5',
    'M3 21V9l9-6 9 6v12M9 21v-7h6v7',
    'M4 15a8 8 0 0 1 16 0M4 15v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 1zM20 15v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 1z'
  ];

  const free = [
    'Playback and your library',
    'The 31-band equalizer',
    'System-wide EQ',
    'AutoEQ headphone profiles',
    'Stem separation and the vocal remover',
    'Cloud music from Google Drive and Dropbox',
    'Synced lyrics',
    'Hype Connect remote',
    'The rest of the DSP chain: bass boost, compander, saturation, limiter and more'
  ];

  const steps = [
    {
      t: 'Try it free for 7 days',
      s: 'Every new desktop install gets all six Plus features for its first 7 days. No card, nothing charged.'
    },
    {
      t: 'Buy Plus to keep them',
      s: `Pay ${PLUS_PRICE_TEXT} once in Paddle’s secure checkout. Paddle emails your receipt.`
    },
    {
      t: 'Your licence is tied to your email',
      s: 'The licence belongs to the email address you check out with. There is no account to create.'
    },
    {
      t: 'Open the desktop app',
      s: 'Open HypeMuzik on your computer and Plus unlocks.'
    },
    {
      t: 'On another computer?',
      s: 'In the desktop app choose “Restore purchase” and enter the same email. Plus unlocks there too.'
    }
  ];

  const faqs = [
    {
      q: 'Is this a subscription?',
      a: `No. Plus is a single ${PLUS_PRICE_TEXT} payment, taken once. Nothing renews and you are never billed again.`
    },
    {
      q: 'What happens after the 7-day trial?',
      a: `Every new desktop install gets all six Plus features free for its first ${PLUS_TRIAL_DAYS} days, with no card and no sign-up form. When the ${PLUS_TRIAL_DAYS} days end, those six features lock and everything in the free player keeps working. To keep them, buy Plus for ${PLUS_PRICE_TEXT}, once. Nothing is charged automatically when the trial ends.`
    },
    {
      q: 'Which devices does it work on?',
      a: 'Your computers. Plus unlocks features in the HypeMuzik desktop app on macOS, Windows and Linux. Convolver, 3D Surround, room reverb and ViPER DDC curves work on all three. Per-app EQ needs macOS 14.4 or later, and the per-app mixer needs macOS 14.4 or later or Windows. The licence is tied to the email you bought with, so “Restore purchase” turns Plus on for each of your own computers.'
    },
    {
      q: 'What about the phone apps?',
      a: 'The iPhone and Android apps stay fully free, and nothing in them needs Plus. Plus is desktop-only for now.'
    },
    {
      q: 'Can I get a refund?',
      a: `Yes. Ask within ${REFUND_WINDOW_DAYS} days of buying and you get a full refund. The details are in the Refund Policy.`
    },
    {
      q: 'Who processes the payment?',
      a: 'Paddle.com, our reseller and Merchant of Record. Paddle takes the payment, handles sales tax and VAT, and sends your invoice and receipt.'
    }
  ];

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${canonical}#product`,
        name: PLUS_NAME,
        description,
        url: canonical,
        image: OG_IMAGE,
        brand: { '@type': 'Brand', name: SITE_NAME },
        offers: {
          '@type': 'Offer',
          price: String(PLUS_PRICE_USD),
          priceCurrency: 'USD',
          url: canonical,
          availability: 'https://schema.org/InStock'
        }
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a }
        }))
      }
    ]
  }).replace(/</g, '\\u003c');
</script>

<svelte:head>
  <title>{title} — {SITE_NAME}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:title" content="{title} — {SITE_NAME}" />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:image" content={OG_IMAGE} />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={OG_IMAGE_ALT} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{title} — {SITE_NAME}" />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={OG_IMAGE} />
  <meta name="twitter:image:alt" content={OG_IMAGE_ALT} />
  <meta name="robots" content="index, follow" />
  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<header class="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
  <div class="wrap flex h-[68px] items-center justify-between gap-6">
    <a href="/" class="flex items-center gap-2.5">
      <Logo size={30} />
      <span class="font-display text-[19px] font-semibold tracking-[-0.01em] max-sm:sr-only">HypeMuzik</span>
    </a>
    <nav class="flex items-center gap-4 sm:gap-6" aria-label="HypeMuzik Plus">
      <a href="/refunds" class="text-[14.5px] font-medium text-muted transition-colors hover:text-text">Refunds</a>
      <a href="/terms" class="text-[14.5px] font-medium text-muted transition-colors hover:text-text">Terms</a>
      <a href="/" class="btn btn-ghost px-[18px] py-[9px] max-sm:hidden">Back to site</a>
    </nav>
  </div>
</header>

<main id="top">
  <!-- ============================== HERO ============================== -->
  <section class="wrap grid items-center gap-x-14 gap-y-12 pb-[clamp(56px,8vw,96px)] pt-[clamp(40px,6vw,76px)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
    <div class="max-w-[56ch]">
      <p class="kicker">Desktop app · macOS, Windows, Linux</p>
      <h1 class="section-title mt-3 text-[clamp(44px,7vw,80px)]">HypeMuzik <span class="text-gold">Plus</span></h1>
      <p class="mt-6 text-[clamp(16px,1.5vw,19px)] leading-relaxed text-muted">
        Pro audio tools for the HypeMuzik desktop app: per-app EQ and mixer, a convolver, 3D
        surround, room reverb and ViPER DDC curves. Try all six free for 7 days, then buy it once and it is yours for life.
      </p>

      <p class="mt-8 font-mono text-[15px] text-text" data-testid="price-line">{PLUS_PRICE_LINE}</p>
      <p class="mt-2 text-[15px] font-semibold text-gold">Try free for {PLUS_TRIAL_DAYS} days, then {PLUS_PRICE_TEXT} once.</p>
      <ul class="mt-3 flex flex-wrap gap-2" aria-label="Platforms">
        {#each platforms as p (p)}
          <li class="rounded-full border border-line-2 px-3 py-[5px] font-mono text-[12px] text-muted">{p}</li>
        {/each}
      </ul>

      {#if phase === 'done'}
        <div class="mt-8 rounded-[18px] border border-gold/30 bg-gold/5 p-5" role="status">
          <p class="font-semibold text-text">Thank you. HypeMuzik Plus is yours.</p>
          <p class="mt-2 text-[15px] leading-relaxed text-muted">
            Paddle has emailed your receipt{#if paidEmail}&nbsp;to <strong class="font-semibold text-text">{paidEmail}</strong>{/if}.
            Open the HypeMuzik desktop app and Plus unlocks. On another computer, choose
            “Restore purchase” and enter that email.
          </p>
        </div>
      {:else}
        <div class="mt-8">
          <button
            type="button"
            class="btn btn-primary w-full px-8 py-[15px] text-[16px] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            data-track="plus-buy"
            disabled={!priceId || phase === 'opening'}
            onclick={buy}
          >
            {phase === 'opening' ? 'Opening checkout…' : `Buy HypeMuzik Plus — ${PLUS_PRICE_TEXT}`}
          </button>

          <div class="mt-3 min-h-[20px] text-[13px]" aria-live="polite">
            {#if phase === 'failed'}
              <p class="text-gold">
                Checkout didn’t open. Please try again, or email
                <a href="mailto:{CONTACT_EMAIL}" class="underline underline-offset-4">{CONTACT_EMAIL}</a>.
              </p>
            {:else if !priceId}
              <p class="text-faint">Checkout opens soon. Nothing can be charged until then.</p>
            {/if}
          </div>

          <p class="mt-4 max-w-[52ch] text-[12.5px] leading-relaxed text-faint">
            No card needed for the trial and nothing is charged automatically. No subscription. Full refund within {REFUND_WINDOW_DAYS} days. Sales tax or VAT, where
            it applies, is shown at checkout. {PADDLE_MOR_DISCLOSURE}
            By buying you agree to our <a href="/terms" class="underline underline-offset-4 hover:text-muted">Terms</a>.
          </p>
        </div>
      {/if}
    </div>

    <div class="flex justify-center lg:justify-end">
      <FeatureShot
        kind="desktop"
        base="shots/desktop-enhancer"
        alt="HypeMuzik desktop, Enhancer page: effect switches for Equalizer, Surround, 3D Surround, Room, Convolver, Compander, Saturation, Script, Headphone and Limiter, beside synced lyrics"
        caption="The HypeMuzik desktop Enhancer. 3D Surround, Room and Convolver are part of Plus."
      />
    </div>
  </section>

  <!-- ============================== FEATURES ============================== -->
  <section class="border-t border-line bg-surface-1 py-[clamp(56px,8vw,96px)]" aria-labelledby="features-heading">
    <div class="wrap">
      <header class="max-w-[60ch]">
        <p class="kicker">What Plus unlocks</p>
        <h2 id="features-heading" class="section-title mt-3 text-[clamp(30px,4.6vw,52px)]">Six tools for the desktop app.</h2>
        <p class="mt-4 text-[16.5px] text-muted">Buy once and they stay unlocked. The rest of HypeMuzik is free either way.</p>
      </header>

      <ul class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each PLUS_FEATURES as f, i (f.name)}
          <li class="rounded-[18px] border border-line bg-bg p-[26px] transition-colors hover:border-line-2">
            <div class="flex items-center justify-between">
              <span class="grid h-[48px] w-[48px] place-items-center rounded-[13px] border border-gold/20 bg-gold/10 text-gold" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d={ICONS[i]} /></svg>
              </span>
              <span class="rounded-full border border-gold/30 px-2.5 py-[3px] font-mono text-[11px] uppercase tracking-[0.06em] text-gold-deep">Plus</span>
            </div>
            <h3 class="section-title mt-5 text-[21px]">{f.name}</h3>
            <p class="mt-2 text-[14.5px] leading-relaxed text-muted">{f.desc}</p>
            {#if f.avail}
              <p class="mt-3 font-mono text-[11.5px] tracking-[0.02em] text-muted">Needs {f.avail}</p>
            {/if}
          </li>
        {/each}
      </ul>

      <p class="mt-8 max-w-[64ch] text-[14.5px] leading-relaxed text-muted">
        Per-app EQ and the per-app mixer depend on what your operating system allows; the other four
        tools work on macOS, Windows and Linux. Plus owners also get a Plus badge in the app.
      </p>
    </div>
  </section>

  <!-- ============================== FREE FOREVER ============================== -->
  <section class="py-[clamp(56px,8vw,96px)]" aria-labelledby="free-heading">
    <div class="wrap grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <header class="max-w-[46ch]">
        <p class="kicker">Free forever</p>
        <h2 id="free-heading" class="section-title mt-3 text-[clamp(30px,4.6vw,52px)]">The player stays free.</h2>
        <p class="mt-4 text-[16.5px] leading-relaxed text-muted">
          HypeMuzik is a free music player with no ads. Plus never takes anything away from it.
          The phone apps are fully free.
        </p>
      </header>
      <ul class="grid gap-x-8 gap-y-3.5 self-start sm:grid-cols-2">
        {#each free as item (item)}
          <li class="flex gap-3 text-[15px] leading-snug text-text">
            <svg class="mt-[3px] shrink-0 text-green" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
            <span>{item}</span>
          </li>
        {/each}
      </ul>
    </div>
  </section>

  <!-- ============================== HOW IT WORKS ============================== -->
  <section class="border-t border-line bg-surface-1 py-[clamp(56px,8vw,96px)]" aria-labelledby="how-heading">
    <div class="wrap">
      <header class="max-w-[60ch]">
        <p class="kicker">How it works</p>
        <h2 id="how-heading" class="section-title mt-3 text-[clamp(30px,4.6vw,52px)]">Buy once. Unlock anywhere.</h2>
      </header>
      <ol class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {#each steps as { t, s }, i (t)}
          <li class="rounded-[18px] border border-line bg-bg p-6">
            <span class="grid h-10 w-10 place-items-center rounded-full border border-line-2 font-mono text-[13px] text-gold-deep">{i + 1}</span>
            <p class="mt-4 font-semibold text-text">{t}</p>
            <p class="mt-2 text-[14.5px] leading-relaxed text-muted">{s}</p>
          </li>
        {/each}
      </ol>
    </div>
  </section>

  <!-- ============================== FAQ ============================== -->
  <section class="py-[clamp(56px,8vw,96px)]" aria-labelledby="faq-heading">
    <div class="wrap max-w-[860px]">
      <h2 id="faq-heading" class="section-title text-[clamp(28px,4vw,40px)]">Questions</h2>
      <div class="mt-8 border-t border-line">
        {#each faqs as { q, a } (q)}
          <details class="faq group border-b border-line">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[16.5px] font-semibold text-text">
              {q}
              <span class="text-gold transition-transform duration-200 group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p class="-mt-1 max-w-[64ch] pb-5 text-[15px] leading-relaxed text-muted">
              {a}
              {#if q === 'Can I get a refund?'}
                <a href="/refunds" class="text-text underline decoration-line-2 underline-offset-4 hover:decoration-gold">Read the Refund Policy</a>.
              {/if}
            </p>
          </details>
        {/each}
      </div>

      <p class="mt-8 text-[15px] text-muted">
        Anything else? Email <a href="mailto:{CONTACT_EMAIL}" class="text-text underline decoration-line-2 underline-offset-4 hover:decoration-gold">{CONTACT_EMAIL}</a>.
      </p>
      <p class="mt-3 text-[14px] text-faint">
        <a href="/terms" class="underline decoration-line-2 underline-offset-4 hover:text-muted">Terms</a> ·
        <a href="/privacy" class="underline decoration-line-2 underline-offset-4 hover:text-muted">Privacy</a> ·
        <a href="/refunds" class="underline decoration-line-2 underline-offset-4 hover:text-muted">Refunds</a>
      </p>
    </div>
  </section>
</main>

<SiteFooter />

<style>
  .faq summary::-webkit-details-marker {
    display: none;
  }
</style>
