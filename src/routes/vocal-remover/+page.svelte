<script lang="ts">
  import FeaturePage from '$lib/components/FeaturePage.svelte';
  import FeatureShot from '$lib/components/FeatureShot.svelte';

  const faqs = [
    {
      q: 'Is the vocal remover free?',
      a: 'Yes. There is no subscription, no ads and no paywall, and you do not need an account to use it. The only extra step is a one-time model download.'
    },
    {
      q: 'Does my music get uploaded anywhere?',
      a: 'No. Separation runs on your own phone or computer, so the song you are splitting stays on the device. The model download is a one-off, after which the splitting itself happens locally.'
    },
    {
      q: 'What is it based on?',
      a: 'Spleeter, the open-source source-separation models released by Deezer under the MIT licence.'
    },
    {
      q: 'Can I get a perfect instrumental or acapella?',
      a: 'Not always. Some bleed between parts is normal, so you may hear faint traces of the vocal in the instrumental, or the reverse. It is excellent for karaoke, sing-along and practice, but it is not a studio stem tool.'
    },
    {
      q: 'Does it work while the song is playing?',
      a: 'Yes. The song is separated live as it plays, working on the part around the playhead first. You hear the original until the stems are ready, then each control goes live.'
    },
    {
      q: 'Does it work on any song?',
      a: 'It works on your own music files: songs saved on your phone, or music files on your computer. On the phone, songs that are only streamed play as they are. Older phones may not be fast enough for live splitting; the app checks once and tells you.'
    },
    {
      q: 'Which devices can I use it on?',
      a: 'The Android and iPhone app has a stems screen, and the desktop app for macOS, Windows and Linux has a Stems view with Vocals, Drums and Instruments controls.'
    }
  ];
</script>

<FeaturePage
  path="/vocal-remover"
  title="Free Vocal Remover & Karaoke App | HypeMuzik"
  description="A free vocal remover and karaoke mode with no subscription. It runs on-device, on phone and desktop, and splits your music live while it plays."
  crumb="Vocal remover"
  kicker="Stems · karaoke"
  h1="A free vocal remover and karaoke mode, built into your music player"
  lede="A vocal remover separates a song into its parts so you can turn the singer down, or up. HypeMuzik’s is free, has no subscription, and runs on your own device: it splits your music into vocals, drums and instruments while the song plays, on both the phone and the desktop apps."
  {faqs}
  heroSide
>
  {#snippet hero()}
    <FeatureShot
      kind="phone"
      base="shots/mobile-stems"
      alt="HypeMuzik phone Stems screen: three level sliders for Vocals, Drums and Instruments, quick mixes named Acapella, Karaoke and Drums only, and a note crediting Spleeter by Deezer"
      caption="The phone’s Stems screen while a song is still being prepared: three levels and three quick mixes."
    />
  {/snippet}

  <h2>How it works</h2>
  <p>
    Stem separation in HypeMuzik is based on Spleeter, the open-source models from Deezer
    (MIT licence). The first time you use it, the app downloads the model once; the desktop app
    checks the download against a fingerprint before using it. After that, everything runs on
    your device.
  </p>
  <p>
    It works live. When you play a song, HypeMuzik starts separating it in the background, doing
    the stretch around the playhead first, and each control becomes active as its part is ready.
    Until then you hear the original, so there is nothing to wait for before you press play.
  </p>
  <p>
    You get three parts, which is why the controls are called <strong>Vocals</strong>,
    <strong>Drums</strong> and <strong>Instruments</strong>. On the desktop, Vocals is the lead and
    backing voices, Drums is kick, snare, hats and percussion, and Instruments is the bass, keys,
    guitars and everything else. Each has its own level, so you can lower a part rather than only
    mute it.
  </p>

  <h2>What you can do with it</h2>
  <ul>
    <li><strong>Karaoke.</strong> Pull the vocals down and sing over the rest. On the phone the <strong>Karaoke</strong> quick mix does this in one tap.</li>
    <li><strong>Instrumental listening.</strong> Keep the backing and drop the singer to work, study or just hear the arrangement.</li>
    <li><strong>Drums only.</strong> Isolate the percussion to learn a groove. The phone has a <strong>Drums only</strong> quick mix.</li>
    <li><strong>Acapella.</strong> Keep only the vocals to study phrasing or harmonies. The phone’s <strong>Acapella</strong> mix does this.</li>
    <li><strong>Practice.</strong> Turn down the part you play, and play along with the rest.</li>
  </ul>
  <p>
    Because it lives inside a full player, the rest of the chain still applies: the
    <a href="/mac-equalizer">31-band equalizer</a>, synced lyrics for the sing-along, and everything
    else in <a href="/">HypeMuzik</a>.
  </p>

  <h2>Honest quality notes</h2>
  <p>
    Separating a finished stereo mix is hard, and no model gets it perfect. With HypeMuzik you
    should expect some bleed: a faint ghost of the vocal in the instrumental, or a bit of the
    backing in the vocal. That is normal for this approach. It is great for karaoke, sing-along and
    practice. It is not a studio stem tool, and it is not the right choice if you need clean stems
    for a release.
  </p>
  <p>
    Live splitting also takes real processing power. On the phone, the app runs a one-time speed
    check; if the phone cannot keep up it says so and the rest of Sound Effects works as usual.
    On the phone, stems apply to songs saved on the phone; songs you only stream play unchanged.
  </p>

  <h2>Privacy</h2>
  <p>
    Your audio never leaves the device. The model is downloaded once, and the splitting itself is
    done locally, on your phone or computer. HypeMuzik does not need to upload a song to
    separate it.
  </p>

  <h2>Personal use</h2>
  <p>
    Use stems for your own listening, practice and sing-along with music you own or have the right
    to use. Splitting a song does not change who owns it, so check the rights before you share or
    publish anything made from it.
  </p>
  <FeatureShot
    kind="desktop"
    base="hero/app-desktop"
    alt="HypeMuzik desktop with a Stems item in the left sidebar beside Library, Enhance, Equalizer, Mixer and Visuals, and a queue panel on the right"
    caption="On desktop, Stems has its own place in the sidebar."
  />
</FeaturePage>
