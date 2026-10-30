<script lang="ts">
  import FeaturePage from '$lib/components/FeaturePage.svelte';
  import FeatureShot from '$lib/components/FeatureShot.svelte';

  const faqs = [
    {
      q: 'What is AutoEq?',
      a: 'AutoEq is an open-source project by Jaakko Pasanen that publishes equalization settings which correct a headphone’s measured frequency response toward a target curve. HypeMuzik includes profiles from it.'
    },
    {
      q: 'Is it free?',
      a: 'Yes. HypeMuzik has no ads and no paywall, and the equalizer and headphone profiles need no sign-up. An optional pay-what-you-want Supporter pack adds a badge only.'
    },
    {
      q: 'How many headphone profiles are there?',
      a: 'The desktop app has 3,938 AutoEq profiles to search. The phone app bundles 6,028: 3,862 in-ear, 2,055 over-ear and 111 earbuds.'
    },
    {
      q: 'Does it work on iPhone and Android?',
      a: 'Yes. HypeMuzik is on the App Store and Google Play, and the phone app’s equalizer has a headphone tab for browsing and applying profiles.'
    },
    {
      q: 'Does it work on Mac?',
      a: 'Yes. The desktop app for macOS includes AutoEq profiles, and on macOS 14.4 or later you can also apply the corrected sound system-wide to other apps.'
    },
    {
      q: 'Can I still adjust the sound myself?',
      a: 'Yes. With the Enhancer’s headphone card, the correction is the first stage of the chain and your own equalizer settings sit on top of it. With the Equalizer view’s search, the curve lands on the 31 bands, where you can edit them. You can also clear a profile.'
    },
    {
      q: 'What if my headphones are not listed?',
      a: 'Then there is no profile to apply for that model. You can still use the 31-band equalizer on desktop, or the phone’s equalizer tabs, to shape the sound by ear.'
    }
  ];
</script>

<FeaturePage
  path="/autoeq"
  title="AutoEq App: Free Headphone EQ Profiles | HypeMuzik"
  description="A free headphone EQ app with thousands of AutoEq correction profiles on Mac, Windows, Linux, iPhone and Android. No ads, no sign-up to use it."
  crumb="AutoEq headphone profiles"
  kicker="Headphone correction"
  h1="AutoEq headphone correction, free on every device"
  lede="AutoEq headphone correction is a set of equalizer filters that nudges a headphone’s measured sound toward a neutral target. HypeMuzik is a free headphone EQ app that includes thousands of AutoEq profiles on Mac, Windows, Linux, iPhone and Android, with no ads and no sign-up to use them."
  {faqs}
  heroSide
>
  {#snippet hero()}
    <FeatureShot
      kind="phone"
      base="shots/mobile-eq"
      alt="HypeMuzik phone app Sound Effects screen: a graphic equalizer with a response curve, preamp slider and a Loudness preset"
      caption="The phone app’s Sound Effects screen, with the equalizer tabs along the top."
    />
  {/snippet}

  <h2>What AutoEq is</h2>
  <p>
    Every pair of headphones colours the sound a little differently. Measuring a model and
    comparing it with a target curve shows where it is too bright, too boomy or too thin, and an
    equalizer can undo much of that. The <a href="https://github.com/jaakkopasanen/AutoEq" rel="noopener noreferrer" target="_blank">AutoEq project</a>,
    created by Jaakko Pasanen, publishes those corrections for a very large number of headphones
    and earphones as ready-made equalizer settings.
  </p>
  <p>
    HypeMuzik did not make these measurements or profiles. It includes profiles from AutoEq and
    applies them inside its own audio engine; all credit for the profiles belongs to the AutoEq
    project and the people who measured the headphones.
  </p>

  <h2>How HypeMuzik applies it</h2>
  <p>
    Each profile is a list of parametric filters plus a preamp. The preamp lowers the overall level
    by the amount the filters would otherwise boost, which keeps the corrected sound from clipping.
    On the phone you will see a profile summarised as its number of bands and its preamp in dB.
  </p>
  <p>
    There are two ways in on desktop. The Enhancer view’s <strong>Headphone correction</strong>
    card runs the profile in the first stage of HypeMuzik’s 12-stage chain, so your own 31-band
    equalizer, bass boost, spatializer and the rest come after it: correct the headphones first,
    then add your taste on top. The Equalizer view’s AutoEQ search instead maps the curve onto the
    31 equalizer bands, with a preamp that keeps it from clipping, so you can see it and edit it
    band by band. On the phone, applying a profile is a one-tap change in the equalizer.
  </p>
  <p>
    Because it is part of the engine rather than a single player’s feature, the correction works
    for the music you play in HypeMuzik, and on a Mac running macOS 14.4 or later it can also be
    applied to other apps through <a href="/mac-equalizer">the system-wide equalizer</a>.
  </p>

  <h2>Profile counts and categories</h2>
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>App</th><th>Profiles</th><th>Notes</th></tr>
      </thead>
      <tbody>
        <tr><td>Desktop (Mac, Windows, Linux)</td><td>3,938</td><td>Searchable by model name</td></tr>
        <tr><td>Phone (iPhone, Android)</td><td>6,028</td><td>In-ear 3,862 · over-ear 2,055 · earbuds 111</td></tr>
      </tbody>
    </table>
  </div>
  <p>
    On the phone the list has filter chips for <strong>All</strong>, <strong>Over-ear</strong>,
    <strong>In-ear</strong> and <strong>Earbud</strong>, plus a search box, which makes it quick to
    find a model among thousands.
  </p>

  <h2>How to use it</h2>
  <h3>On desktop</h3>
  <ol>
    <li>Open the <strong>Equalizer</strong> view and press <strong>Find headphone (AutoEQ)…</strong>.</li>
    <li>Type your model name, for example the brand and number, and choose it from the results.</li>
    <li>The curve is fetched when you choose it, mapped onto the 31 bands with a preamp that keeps it from clipping, and applied.</li>
  </ol>
  <p>
    The <strong>Enhancer</strong> view also has a <strong>Headphone correction</strong> card where
    you select your headphones from a list; it shows the number of bands and the preamp being
    used.
  </p>
  <h3>On iPhone and Android</h3>
  <ol>
    <li>Open the equalizer (<strong>Sound Effects</strong>) and go to the headphones tab.</li>
    <li>Search for your model, or narrow the list with the Over-ear, In-ear or Earbud chips.</li>
    <li>Tap a profile to apply it; the active profile is shown at the top with its band count and preamp. Tap it again to clear it.</li>
  </ol>
  <p>
    HypeMuzik is free on every platform: <a href="/">see the whole player</a>, or the
    <a href="/linux-music-player">Linux build</a> if that is where your headphones are plugged in.
  </p>
</FeaturePage>
