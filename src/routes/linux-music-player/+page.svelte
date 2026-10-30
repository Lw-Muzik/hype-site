<script lang="ts">
  import FeaturePage from '$lib/components/FeaturePage.svelte';
  import FeatureShot from '$lib/components/FeatureShot.svelte';
  import { RELEASES_URL } from '$lib/releases';

  const faqs = [
    {
      q: 'Is HypeMuzik free on Linux?',
      a: 'Yes. There are no ads and no paywall, and playback and the equalizer need no sign-up. An optional pay-what-you-want Supporter pack adds a badge only.'
    },
    {
      q: 'Which package formats are available?',
      a: 'The latest release includes an AppImage that runs on any distribution, a .deb for Debian and Ubuntu, and a .rpm for Fedora and RHEL.'
    },
    {
      q: 'Does the equalizer work for other apps, or just HypeMuzik?',
      a: 'Both. System-wide equalization on Linux works through PipeWire, with a PulseAudio fallback, and the equalizer can process other apps’ audio as well as your own music.'
    },
    {
      q: 'Do I need PipeWire?',
      a: 'Not to play music. For system-wide equalization HypeMuzik prefers PipeWire and falls back to PulseAudio. The .deb and .rpm declare the PipeWire library as a dependency, so a package manager installs it for you.'
    },
    {
      q: 'Does it show synced lyrics?',
      a: 'Yes. HypeMuzik shows synced, word-by-word lyrics on desktop and phone.'
    },
    {
      q: 'Can I play music from the cloud?',
      a: 'Yes. Besides local files, you can use your Google Drive and Dropbox libraries.'
    },
    {
      q: 'Can I play my phone’s music through my Linux desktop?',
      a: 'Yes. Phone Link streams your phone’s library through the desktop’s audio chain over your own Wi-Fi.'
    }
  ];
</script>

<FeaturePage
  path="/linux-music-player"
  title="Free Linux Music Player with Equalizer & Lyrics | HypeMuzik"
  description="A free Linux music player with a 31-band equalizer, synced lyrics and system-wide EQ via PipeWire. AppImage, .deb and .rpm. No ads."
  crumb="Linux music player"
  kicker="Linux"
  h1="A free music player for Linux, with a 31-band equalizer and synced lyrics"
  lede="HypeMuzik is a free music player for Linux that plays your own library through a 31-band equalizer and a full effects chain, shows synced word-by-word lyrics, and can apply the equalizer to the rest of your desktop’s audio through PipeWire. It comes as an AppImage, a .deb and a .rpm, with no ads."
  {faqs}
>
  {#snippet hero()}
    <FeatureShot
      kind="desktop"
      base="hero/app-desktop"
      alt="HypeMuzik desktop Equalizer view: a graphic equalizer with a preset picker and a live response curve, with the playback queue on the right"
      caption="The desktop app’s Equalizer view."
    />
  {/snippet}

  <h2>Packages</h2>
  <p>
    The latest release ships three Linux packages, so you can pick the one that suits your system:
  </p>
  <ul>
    <li><strong>AppImage</strong>: one file that runs on any distribution, with nothing to install.</li>
    <li><strong>.deb</strong>: for Debian, Ubuntu and their relatives.</li>
    <li><strong>.rpm</strong>: for Fedora, RHEL and their relatives.</li>
  </ul>
  <p>
    The Linux button below opens the AppImage and has a menu for the other two formats. If the
    button cannot reach the latest version, it falls back to the
    <a href={RELEASES_URL} rel="noopener">releases page</a>. The .deb and .rpm declare the
    PipeWire library as a dependency, so your package manager pulls it in with the app.
  </p>

  <h2>System-wide equalizer through PipeWire</h2>
  <p>
    Most players only shape their own sound. HypeMuzik can also route the rest of your desktop’s
    audio through its equalizer. On Linux it uses PipeWire where it is available, with a
    PulseAudio fallback on systems without it.
  </p>
  <p>
    You switch it on in <strong>Settings</strong>, under <strong>System-wide audio</strong>. It
    routes through a virtual sink and, when you stop it, restores your default output. If something
    needed for it is missing, HypeMuzik can offer to install the small missing package, using your
    system’s package manager and a standard administrator prompt, or show you the exact command
    to run yourself.
  </p>
  <p>
    The same engine is behind <a href="/mac-equalizer">the Mac system-wide equalizer</a>, so a curve
    you build in one place is the same curve on the other.
  </p>

  <h2>What you get</h2>
  <ul>
    <li><strong>A 31-band equalizer</strong> at ISO ⅓-octave centres from 20 Hz to 20 kHz, inside a 12-stage chain that adds headphone correction, bass boost, a stereo spatializer, 3D surround, room reverb, convolution, a multiband compander, tube saturation, a script processor, makeup gain and a brickwall limiter.</li>
    <li><strong>Synced, word-by-word lyrics</strong> on desktop and phone.</li>
    <li><strong>Headphone profiles</strong> from <a href="/autoeq">the AutoEq project</a>, so you can correct your headphone model before you tune the rest.</li>
    <li><strong>Visualisers</strong> that react to the music.</li>
    <li><strong>Track identification</strong> through acoustic fingerprinting (AcoustID).</li>
    <li><strong>Playback features</strong>: gapless playback, crossfade and ReplayGain.</li>
    <li><strong>Your libraries</strong>: local files, plus Google Drive and Dropbox.</li>
    <li><strong>Karaoke and stems</strong>: a live, on-device <a href="/vocal-remover">vocal remover</a>.</li>
  </ul>
  <FeatureShot
    kind="desktop"
    base="shots/desktop-enhancer"
    alt="HypeMuzik desktop Enhancer view with switches for each effect and synced lyrics shown beside it"
    caption="Effects have their own switches, and synced lyrics sit alongside."
  />

  <h2>Phone Link</h2>
  <p>
    Phone Link lets your Linux desktop use your phone’s library. Your phone’s music streams through
    the desktop’s audio chain over your own Wi-Fi, so it gets the same equalizer and effects as
    anything else you play, and the audio stays on your own network. Install the
    <a href="/">phone app</a> from the App Store or Google Play, then discover it from the desktop and pair once.
  </p>
</FeaturePage>
