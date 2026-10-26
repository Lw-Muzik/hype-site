<script lang="ts">
  import LegalPage from '$lib/components/LegalPage.svelte';
  import {
    OPERATOR,
    CONTACT_EMAIL,
    EFFECTIVE,
    REFUND_WINDOW_DAYS as DAYS,
    PADDLE_MOR_DISCLOSURE,
    PADDLE_ORDERS_URL,
    PADDLE_BUYER_TERMS_URL,
    APPLE_REFUND_URL,
    GOOGLE_PLAY_REFUND_URL
  } from '$lib/legal';

  const sections = [
    { id: 'summary', label: 'The short version' },
    { id: 'scope', label: 'What this policy covers' },
    { id: 'seller', label: 'Who you buy from' },
    { id: 'guarantee', label: `Our ${DAYS}-day refund` },
    { id: 'after', label: `After the ${DAYS} days` },
    { id: 'plans', label: 'Recurring plans' },
    { id: 'stores', label: 'App Store & Google Play' },
    { id: 'how', label: 'How to ask for a refund' },
    { id: 'payout', label: 'How you are refunded' },
    { id: 'access', label: 'What a refund removes' },
    { id: 'disputes', label: 'Chargebacks & misuse' },
    { id: 'rights', label: 'Your legal rights' },
    { id: 'changes', label: 'Changes to this policy' },
    { id: 'contact', label: 'Contact' }
  ];
</script>

<LegalPage
  title="Refund Policy"
  description="How refunds work for HypeMuzik purchases: a full refund within {DAYS} days of buying from us, how to ask for one, and what Paddle, Apple and Google handle."
  path="/refunds"
  effective={EFFECTIVE.refunds}
  intro="HypeMuzik is free to use today — nothing in the apps or on this site charges you.
         This policy sets out how refunds work for whenever you do pay us, and the short
         version is simple: change your mind within {DAYS} days and you get your money back."
  {sections}
>
  <section>
    <h2 id="summary">The short version</h2>
    <div class="legal-note is-key">
      <ul>
        <li>
          <strong>HypeMuzik is free today.</strong> Nothing in the apps or on this site charges
          you, so there is nothing to refund yet. This policy is here for when that changes.
        </li>
        <li>
          <strong>Changed your mind?</strong> Anything you buy from us directly is refunded in
          full if you ask within {DAYS} days. No reason needed, even if you have used it.
        </li>
        <li>
          <strong>Charged by mistake?</strong> Double charges, wrong amounts, renewals after
          you cancelled, and payments you did not make are refunded whenever you tell us.
        </li>
        <li>
          <strong>Bought it in the App Store or Google Play?</strong> Apple or Google handle
          that refund under their own rules.
        </li>
        <li>
          <strong>The law comes first.</strong> Any right your country's consumer law gives
          you applies on top of this policy, never instead of it.
        </li>
      </ul>
    </div>
  </section>

  <section>
    <h2 id="scope">What this policy covers</h2>
    <p>
      This policy covers every payment you make to {OPERATOR} — Supporter contributions,
      paid features, plans, tips and donations — whether you pay on this website, in the
      desktop app, or in the mobile app.
    </p>
    <p>
      <strong>About returns.</strong> Everything we sell is digital, so there is nothing to
      post back and no restocking fee: a refund is the return. When a payment is refunded,
      whatever it unlocked is switched off again (see
      <a href="#access">What a refund removes</a>).
    </p>
    <p>
      It does not cover services you pay other companies for, even if you use them with
      HypeMuzik — for example cloud storage, a streaming-service subscription, or a paid
      radio service. Refunds for those come from the company that charged you.
    </p>
  </section>

  <section>
    <h2 id="seller">Who you buy from</h2>
    <p>
      For anything you buy from us on this website or in the desktop app:
      {PADDLE_MOR_DISCLOSURE}
    </p>
    <p>
      That means Paddle is the seller named on your receipt. It takes the payment, charges
      any sales tax or VAT, issues your invoice, and processes refunds on our behalf. The
      <a href={PADDLE_BUYER_TERMS_URL} target="_blank" rel="noopener noreferrer">Paddle Buyer Terms</a>
      also apply to the transaction, and where they give you a right this policy does not,
      you keep it.
    </p>
    <p>
      Purchases made inside the iOS or Android app, if we offer them, are sold by Apple or
      Google — see <a href="#stores">App Store and Google Play purchases</a>.
    </p>
  </section>

  <section>
    <h2 id="guarantee">Our {DAYS}-day refund</h2>
    <p>
      If you ask within <strong>{DAYS} days</strong> of a purchase from us, you get a full
      refund. You do not have to give a reason, and it does not matter whether you have
      already used what you bought.
    </p>
    <p>
      The {DAYS} days start the day after the payment is taken. For a recurring plan they
      apply to every payment — the first one and each renewal — so a renewal you forgot to
      cancel can still be refunded.
    </p>
    <div class="legal-note">
      <p>
        <strong>EU, EEA and UK customers.</strong> Consumer law there gives you 14 days to
        withdraw from an online purchase, but lets a seller end that right once you start
        using digital content you asked to receive straight away. We do not rely on that
        exception: our {DAYS}-day refund applies whether or not you have used your purchase.
      </p>
    </div>
  </section>

  <section>
    <h2 id="after">After the {DAYS} days</h2>
    <p>
      Once the window has passed, change-of-mind refunds are no longer automatic. You will
      still get a full refund, at any time, if:
    </p>
    <ul>
      <li>you were charged twice, or charged the wrong amount;</li>
      <li>a recurring plan renewed after you had cancelled it;</li>
      <li>
        the payment was made without your permission — tell us as soon as you notice, and we
        may need to confirm you own the account or card involved;
      </li>
      <li>a paid feature does not work as described and we cannot fix it within a reasonable time;</li>
      <li>the law where you live requires one.</li>
    </ul>
    <p>
      We look at every other request individually and in good faith, and if the answer is
      no, we will tell you why.
    </p>
  </section>

  <section>
    <h2 id="plans">Recurring plans</h2>
    <p>
      If we offer a plan that renews automatically, its price and how often you are billed
      are shown before you subscribe, and every receipt explains how to cancel.
    </p>
    <ul>
      <li>
        <strong>Cancel any time</strong> at
        <a href={PADDLE_ORDERS_URL} target="_blank" rel="noopener noreferrer">paddle.net</a> or
        by emailing us. Cancelling stops all future charges.
      </li>
      <li>
        <strong>You keep what you paid for.</strong> After you cancel, the plan stays active
        until the end of the period you have already paid for.
      </li>
      <li>
        <strong>Partial periods</strong> are not refunded once the {DAYS}-day window for that
        payment has passed, unless one of the cases in
        <a href="#after">After the {DAYS} days</a> applies.
      </li>
      <li>
        <strong>Price changes</strong> are announced to you before they apply to your plan, so
        you can cancel first.
      </li>
      <li>
        <strong>If we discontinue a plan</strong> you are paying for, we stop charging you and
        refund the unused part of the current period.
      </li>
    </ul>
  </section>

  <section>
    <h2 id="stores">App Store and Google Play purchases</h2>
    <p>
      HypeMuzik's mobile apps do not currently sell anything. If we add in-app purchases,
      they are sold by Apple or Google, who take the payment and decide refunds under their
      own policies. We never see your card details and cannot refund these payments
      ourselves.
    </p>
    <ul>
      <li>
        <strong>App Store:</strong> request a refund at
        <a href={APPLE_REFUND_URL} target="_blank" rel="noopener noreferrer">reportaproblem.apple.com</a>.
      </li>
      <li>
        <strong>Google Play:</strong> follow
        <a href={GOOGLE_PLAY_REFUND_URL} target="_blank" rel="noopener noreferrer">Google Play's refund steps</a>.
        If Google's own window has passed, email us: Google lets developers refund some
        orders, and we will look at your request under the same rules as a direct purchase.
      </li>
    </ul>
  </section>

  <section>
    <h2 id="how">How to ask for a refund</h2>
    <p>For anything bought from us on this website or in the desktop app, either:</p>
    <ul>
      <li>
        go to <a href={PADDLE_ORDERS_URL} target="_blank" rel="noopener noreferrer">paddle.net</a>,
        look up your order with the email address you paid with, and ask for a refund there;
        or
      </li>
      <li>
        email us at <a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a> with the email
        address you paid with and, if you have it, the order number from your receipt. We
        will arrange the refund with Paddle.
      </li>
    </ul>
    <p>
      A request counts from the moment you send it. If you ask on day {DAYS}, you are in
      time, even if we reply later.
    </p>
  </section>

  <section>
    <h2 id="payout">How you are refunded</h2>
    <ul>
      <li>
        <strong>The way you paid.</strong> Refunds go back to the original payment method; we
        cannot send them anywhere else.
      </li>
      <li>
        <strong>The full amount.</strong> You get back everything you paid for that purchase,
        including any sales tax or VAT that was charged.
      </li>
      <li>
        <strong>Promptly.</strong> We aim to reply within a few business days. A refund asked
        for within the {DAYS}-day window is issued no later than 14 days after you asked;
        any other refund, no later than 14 days after we approve it.
      </li>
      <li>
        <strong>Bank timing.</strong> Your bank or card issuer may take a further 5–10
        business days to show it on your statement.
      </li>
      <li>
        <strong>Currency.</strong> Refunds are made in the currency you paid in. If your bank
        converted the payment, exchange-rate movements or bank fees can make the amount that
        arrives differ slightly; those are outside our control.
      </li>
    </ul>
  </section>

  <section>
    <h2 id="access">What a refund removes</h2>
    <p>
      When a payment is refunded, whatever it unlocked — Supporter status or a paid feature —
      is removed from your account and devices. Everything that is free keeps working, and
      your music library, playlists and settings are not deleted.
    </p>
    <p>You are welcome to buy again later.</p>
  </section>

  <section>
    <h2 id="disputes">Chargebacks and misuse</h2>
    <p>
      Please come to us before your bank. Our refund window is generous, and a refund
      usually reaches you faster than a chargeback.
    </p>
    <p>
      If a chargeback or payment dispute is opened, whatever that payment unlocked is paused
      while it is open, and removed if the payment is reversed. If the dispute concerns a
      payment that was authorised and delivered, we (through Paddle) may give your bank the
      purchase records it needs to decide. None of this limits your right to dispute a
      charge you did not make.
    </p>
    <p>
      We may decline a refund, or end access to paid features, where there is clear evidence
      of fraud or abuse — for example stolen payment details, or repeatedly buying and
      refunding to use paid features without paying. This never applies to the
      mistaken-charge cases above, or to a refund the law requires.
    </p>
  </section>

  <section>
    <h2 id="rights">Your legal rights</h2>
    <p>
      This policy adds to the rights consumer law gives you; it never replaces them.
      Depending on where you live, those include the right to cancel an electronic
      transaction under Uganda's Electronic Transactions Act 2011, the 14-day withdrawal
      right in the EU, EEA and UK, and the right to a repair, replacement or refund for
      digital content that is faulty or not as described.
    </p>
    <p>
      Where the law of your country gives you more than this policy does, the law applies.
      Nothing here is meant to exclude or limit any right that cannot lawfully be excluded or
      limited.
    </p>
  </section>

  <section>
    <h2 id="changes">Changes to this policy</h2>
    <p>
      We may update this policy. The current version always lives at this address with its
      effective date at the top.
    </p>
    <p>
      <strong>The version in force on the day you paid applies to that payment</strong>, so a
      later change can never take away a refund you were already entitled to.
    </p>
  </section>

  <section>
    <h2 id="contact">Contact</h2>
    <p>
      Refund questions go to <a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a>. Please
      include the email address you paid with and, if you have it, the order number from your
      receipt — it lets us find the payment straight away.
    </p>
    <p>
      See also our <a href="/terms">Terms &amp; Conditions</a> and
      <a href="/privacy">Privacy Policy</a>.
    </p>
  </section>
</LegalPage>
