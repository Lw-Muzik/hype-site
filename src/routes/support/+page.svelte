<script lang="ts">
  /**
   * /support — the Supporter pack, the one thing this site sells.
   *
   * Paddle's domain review reads this page: a real product, prices that match
   * the catalog, the Merchant of Record line, and a path to the refund policy.
   * Checkout is Paddle's overlay, loaded only when someone presses Buy, so a
   * visitor who only reads the page never fetches Paddle's script.
   */
  import { onDestroy } from 'svelte';
  import type { Paddle, PaddleEventData } from '@paddle/paddle-js';
  import Logo from '$lib/components/Logo.svelte';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  import { SITE_URL, SITE_NAME, OG_IMAGE, OG_IMAGE_ALT } from '$lib/seo';
  import { CONTACT_EMAIL, PADDLE_MOR_DISCLOSURE, REFUND_WINDOW_DAYS } from '$lib/legal';
  import { CHECKOUT, SUPPORTER_AMOUNTS, SUPPORTER_DEFAULT, type SupporterAmount } from '$lib/supporter';

  const MIN = SUPPORTER_AMOUNTS[0];
  /** "$3, $5, $10 or $25" */
  const AMOUNTS_TEXT = SUPPORTER_AMOUNTS.map((a) => `$${a}`)
    .join(', ')
    .replace(/, ([^,]*)$/, ' or $1');
  const title = 'Supporter pack';
  const description = `Choose your price, from $${MIN}: a one-time Supporter pack that adds a Supporter badge to HypeMuzik. Every feature stays free for everyone.`;
  const canonical = `${SITE_URL}/support`;

  /** Overlay never reported in — a blocked script, or a domain Paddle hasn't approved. */
  const OPEN_TIMEOUT_MS = 15_000;

  let amount = $state<SupporterAmount>(SUPPORTER_DEFAULT);
  let phase = $state<'idle' | 'opening' | 'failed' | 'done'>('idle');
  let paidEmail = $state<string | null>(null);
  const priceId = $derived(CHECKOUT?.prices[amount]);

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

  async function buy() {
    if (!CHECKOUT || !priceId || phase === 'opening') return;
    phase = 'opening';
    openTimer = setTimeout(() => {
      if (phase === 'opening') phase = 'failed';
    }, OPEN_TIMEOUT_MS);

    try {
      if (!paddle) {
        const { initializePaddle } = await import('@paddle/paddle-js');
        paddle = await initializePaddle({
          environment: CHECKOUT.environment,
          token: CHECKOUT.token,
          eventCallback: onPaddleEvent
        });
      }
      if (!paddle) throw new Error('Paddle.js did not load');
      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        settings: { displayMode: 'overlay', theme: 'dark', variant: 'one-page' }
      });
    } catch {
      settle('failed');
    }
  }

  onDestroy(() => clearTimeout(openTimer));

  const steps = [
    {
      t: 'Pick a price and pay',
      s: `Choose ${AMOUNTS_TEXT}. Checkout is run by Paddle, who emails your receipt.`
    },
    {
      t: 'Your badge follows your email',
      s: 'The Supporter badge is tied to the email address you pay with — no account to create.'
    },
    {
      t: 'Show it in the app',
      s: 'In HypeMuzik, choose “Restore purchase” and enter that email. The badge appears on that device.'
    }
  ];

  const faqs = [
    {
      q: 'Is this a subscription?',
      a: 'No. It is a single payment, taken once. Nothing renews and nothing is billed again.'
    },
    {
      q: 'Does it unlock features?',
      a: 'No. Every HypeMuzik feature is free for everyone, on every platform. The pack adds the Supporter badge — it never takes anything away from people who don’t buy it.'
    },
    {
      q: 'Can I get my money back?',
      a: `Yes. Ask within ${REFUND_WINDOW_DAYS} days of buying, for any reason, and you get a full refund. The badge is removed when the payment is refunded.`
    },
    {
      q: 'Which currency will I pay in?',
      a: 'Prices are in US dollars. Paddle can show your local currency at checkout and adds any sales tax or VAT that applies where you live, before you pay.'
    },
    {
      q: 'Can I buy it in the iPhone or Android app?',
      a: 'The mobile apps don’t sell anything. Buy here, from any device, then restore the badge in the app with your email.'
    }
  ];
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
</svelte:head>

<header class="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
  <div class="wrap flex h-[68px] items-center justify-between gap-6">
    <a href="/" class="flex items-center gap-2.5">
      <Logo size={30} />
      <span class="font-display text-[19px] font-semibold tracking-[-0.01em] max-sm:sr-only">HypeMuzik</span>
    </a>
    <nav class="flex items-center gap-4 sm:gap-6" aria-label="Supporter pack">
      <a href="/refunds" class="text-[14.5px] font-medium text-muted transition-colors hover:text-text">Refunds</a>
      <a href="/terms" class="text-[14.5px] font-medium text-muted transition-colors hover:text-text">Terms</a>
      <a href="/" class="btn btn-ghost px-[18px] py-[9px] max-sm:hidden">Back to site</a>
    </nav>
  </div>
</header>

<main id="top">
  <!-- Phones read intro → price card → details; from lg the card sits in its
       own column beside both, sticky. -->
  <section class="wrap grid items-start gap-x-16 gap-y-12 pb-[clamp(56px,8vw,96px)] pt-[clamp(40px,6vw,76px)] lg:grid-cols-[minmax(0,1fr)_440px]">
    <div class="max-w-[60ch] lg:col-start-1 lg:row-start-1">
      <p class="kicker">Supporter pack</p>
      <h1 class="section-title mt-3 text-[clamp(38px,6vw,64px)]">Free for everyone.<br /><span class="text-gold">Yours to back.</span></h1>
      <p class="mt-6 text-[clamp(16px,1.5vw,18px)] leading-relaxed text-muted">
        HypeMuzik is free on macOS, Windows, Linux, iPhone and Android — every feature, no ads,
        no account wall. The Supporter pack is an optional, one-time purchase: you choose the
        price, and you get a Supporter badge in the apps.
      </p>
    </div>

    <div class="order-last max-w-[60ch] lg:col-start-1 lg:row-start-2">
      <h2 class="section-title text-[24px]">What you get</h2>
      <ul class="mt-5 space-y-4">
        <li class="flex gap-4">
          <span class="grid h-10 w-10 shrink-0 place-items-center rounded-[11px] border border-gold/25 bg-gold/10 text-gold" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14.2 7 22l5-3 5 3-1.5-7.8"/></svg>
          </span>
          <div>
            <p class="font-semibold text-text">A Supporter badge in HypeMuzik</p>
            <p class="mt-1 text-[15px] text-muted">Shown in the app on the devices where you restore it with your email.</p>
          </div>
        </li>
        <li class="flex gap-4">
          <span class="grid h-10 w-10 shrink-0 place-items-center rounded-[11px] border border-line-2 bg-surface-2 text-muted" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </span>
          <div>
            <p class="font-semibold text-text">Nothing taken from anyone else</p>
            <p class="mt-1 text-[15px] text-muted">The equalizer, the DSP chain, stems, lyrics, Phone Link and Hype Connect stay free for every user.</p>
          </div>
        </li>
      </ul>

      <h2 class="section-title mt-[clamp(40px,6vw,64px)] text-[24px]">How it works</h2>
      <ol class="mt-5 space-y-5">
        {#each steps as { t, s }, i (t)}
          <li class="flex gap-4">
            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-2 font-mono text-[13px] text-gold-deep">{i + 1}</span>
            <div>
              <p class="font-semibold text-text">{t}</p>
              <p class="mt-1 text-[15px] text-muted">{s}</p>
            </div>
          </li>
        {/each}
      </ol>
    </div>

    <!-- Price card -->
    <aside class="lg:sticky lg:top-[96px] lg:col-start-2 lg:row-span-2 lg:row-start-1" aria-labelledby="price-heading">
      <div class="relative overflow-hidden rounded-[24px] border border-line-2 bg-surface-1 p-[clamp(22px,3vw,32px)]">
        <div class="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl" aria-hidden="true"></div>

        {#if phase === 'done'}
          <div class="relative" role="status">
            <p class="kicker">Thank you</p>
            <h2 id="price-heading" class="section-title mt-3 text-[28px]">You’re a Supporter.</h2>
            <p class="mt-4 text-[15px] leading-relaxed text-muted">
              Paddle has emailed your receipt{#if paidEmail}&nbsp;to <strong class="font-semibold text-text">{paidEmail}</strong>{/if}.
              In HypeMuzik, choose “Restore purchase” and enter that address to show your badge.
            </p>
            <a href="/" class="btn btn-ghost mt-6 w-full">Back to HypeMuzik</a>
          </div>
        {:else}
          <div class="relative">
            <div class="flex items-baseline justify-between gap-4">
              <h2 id="price-heading" class="text-[15px] font-semibold text-text">Choose your price</h2>
              <p class="font-mono text-[12.5px] text-faint">from ${MIN} USD</p>
            </div>

            <fieldset class="mt-5">
              <legend class="sr-only">Choose your price</legend>
              <div class="grid grid-cols-4 gap-2">
                {#each SUPPORTER_AMOUNTS as a (a)}
                  <label class="amount">
                    <input type="radio" name="amount" value={a} bind:group={amount} class="sr-only" />
                    <span>${a}</span>
                  </label>
                {/each}
              </div>
            </fieldset>

            <p class="mt-7 flex items-baseline gap-2">
              <span class="font-display text-[56px] font-semibold leading-none tracking-[-0.03em]">${amount}</span>
              <span class="text-[15px] text-muted">one-time</span>
            </p>

            <button
              type="button"
              class="btn btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
              data-track="supporter-buy"
              disabled={!priceId || phase === 'opening'}
              onclick={buy}
            >
              {phase === 'opening' ? 'Opening checkout…' : `Buy the Supporter pack — $${amount}`}
            </button>

            <div class="mt-3 min-h-[20px] text-[13px]" aria-live="polite">
              {#if phase === 'failed'}
                <p class="text-gold">
                  Checkout didn’t open. Please try again, or email
                  <a href="mailto:{CONTACT_EMAIL}" class="underline underline-offset-4">{CONTACT_EMAIL}</a>.
                </p>
              {:else if !priceId}
                <p class="text-faint">Checkout opens here once our payment provider has approved this site. Nothing can be charged until then.</p>
              {/if}
            </div>

            <ul class="mt-5 space-y-2 border-t border-line pt-5 text-[13.5px] text-muted">
              <li>One payment — not a subscription</li>
              <li>Full refund within {REFUND_WINDOW_DAYS} days, for any reason — <a href="/refunds" class="underline decoration-line-2 underline-offset-4 hover:text-text">Refund Policy</a></li>
              <li>Sales tax or VAT, where it applies, is shown at checkout</li>
            </ul>

            <p class="mt-5 text-[12.5px] leading-relaxed text-faint">
              {PADDLE_MOR_DISCLOSURE} By buying you agree to our <a href="/terms" class="underline underline-offset-4 hover:text-muted">Terms</a>.
            </p>
          </div>
        {/if}
      </div>
    </aside>
  </section>

  <section class="border-t border-line bg-surface-1 py-[clamp(56px,8vw,96px)]" aria-labelledby="faq-heading">
    <div class="wrap max-w-[860px]">
      <h2 id="faq-heading" class="section-title text-[clamp(28px,4vw,40px)]">Questions</h2>
      <div class="mt-8 border-t border-line">
        {#each faqs as { q, a } (q)}
          <details class="faq group border-b border-line">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[16.5px] font-semibold text-text">
              {q}
              <span class="text-gold transition-transform duration-200 group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p class="-mt-1 max-w-[64ch] pb-5 text-[15px] leading-relaxed text-muted">{a}</p>
          </details>
        {/each}
      </div>
      <p class="mt-8 text-[15px] text-muted">
        Anything else? Email <a href="mailto:{CONTACT_EMAIL}" class="text-text underline decoration-line-2 underline-offset-4 hover:decoration-gold">{CONTACT_EMAIL}</a>.
      </p>
    </div>
  </section>
</main>

<SiteFooter />

<style>
  .amount span {
    display: grid;
    place-items: center;
    height: 48px;
    border-radius: 12px;
    border: 1px solid var(--color-line-2);
    font-weight: 700;
    font-size: 15px;
    color: var(--color-muted);
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s, background-color 0.15s;
  }
  .amount:hover span {
    border-color: var(--color-gold-deep);
    color: var(--color-text);
  }
  .amount input:checked + span {
    border-color: var(--color-gold);
    background-color: color-mix(in srgb, var(--color-gold) 12%, transparent);
    color: var(--color-gold);
  }
  .amount input:focus-visible + span {
    outline: 2px solid var(--color-gold);
    outline-offset: 2px;
  }
  .faq summary::-webkit-details-marker {
    display: none;
  }
</style>
