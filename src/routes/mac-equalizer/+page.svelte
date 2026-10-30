<script lang="ts">
  import FeaturePage from '$lib/components/FeaturePage.svelte';
  import FeatureShot from '$lib/components/FeatureShot.svelte';
  import { RELEASES_URL } from '$lib/releases';

  const faqs = [
    {
      q: 'Is the Mac equalizer really free?',
      a: 'Yes. HypeMuzik has no ads and no paywall, and playback and the equalizer need no sign-up. There is an optional pay-what-you-want Supporter pack that adds a badge, but every feature stays free for everyone.'
    },
    {
      q: 'Does it equalize every app on my Mac, or only HypeMuzik?',
      a: 'Both. Play your own music in HypeMuzik and the chain applies as usual. Turn on system-wide audio and HypeMuzik also processes the sound from other apps. On macOS you can apply it to all apps, only the apps you pick, or all apps except the ones you pick.'
    },
    {
      q: 'Do I need to install a virtual audio driver?',
      a: 'No. On macOS the system-wide mode uses Core Audio process taps, which process other apps’ audio in place, so there is no virtual audio driver to install.'
    },
    {
      q: 'Which macOS versions are supported?',
      a: 'System-wide equalization needs macOS 14.4 or later. The Mac build is one universal download that runs on both Apple Silicon and Intel Macs.'
    },
    {
      q: 'Why does macOS ask for permission?',
      a: 'The first time you enable system-wide audio, macOS asks for audio-capture permission. The prompt reads: “HypeMuzik captures system audio so it can apply your equalizer and effects to everything you hear.”'
    },
    {
      q: 'How many bands does the equalizer have?',
      a: 'The graphic equalizer has 31 bands at ISO ⅓-octave centres from 20 Hz to 20 kHz. It is one stage of a 12-stage chain that also includes bass boost, a stereo spatializer, 3D surround, reverb and a limiter.'
    },
    {
      q: 'Can I correct my headphones on Mac?',
      a: 'Yes. HypeMuzik includes headphone correction profiles from the AutoEq project. Pick your headphone model and its correction runs as the first stage of the chain, ahead of your own equalizer settings.'
    }
  ];
</script>

<FeaturePage
  path="/mac-equalizer"
  title="Free System-Wide Equalizer for Mac (31-Band) | HypeMuzik"
  description="Equalize every app on your Mac for free: a 31-band equalizer with AutoEq headphone profiles. No ads, no virtual audio driver to install."
  crumb="Equalizer for Mac"
  kicker="Equalizer for Mac"
  h1="A free system-wide equalizer for Mac"
  lede="A system-wide equalizer changes the sound of everything your Mac plays, not just one app. HypeMuzik is a free music player and audio enhancer whose 31-band equalizer, headphone correction and effects chain can be applied to the audio from every app on your Mac, with no ads and no virtual audio driver to install."
  {faqs}
>
  {#snippet hero()}
    <FeatureShot
      kind="desktop"
      base="shots/desktop-enhancer"
      alt="HypeMuzik desktop Enhancer view: toggles for Equalizer, Surround, Room, Convolver, Headphone and Limiter effects beside synced lyrics"
      caption="The Enhancer view: each stage of the chain has its own switch."
    />
  {/snippet}

  <h2>What “system-wide” means</h2>
  <p>
    Most music players only shape the sound of their own playback. A system-wide equalizer sits
    between every app and your speakers or headphones, so a browser tab, a video call and a game
    all pass through the same curve. If you have ever wanted one bass setting that applies
    everywhere on your Mac, this is that.
  </p>
  <p>
    HypeMuzik does it with Core Audio process taps. It captures the audio of other apps, runs it
    through the same chain it uses for its own music, silences the original so you do not hear the
    sound twice, and plays the processed result to your real output device. Because the taps
    process audio in place, there is no virtual audio driver to install and no change to your
    system sound settings to make.
  </p>
  <p>
    HypeMuzik itself stays a full <a href="/">free music player</a> for your own library: local
    files, plus Google Drive and Dropbox libraries. System-wide mode is an extra, not a
    replacement.
  </p>

  <h2>Requirements</h2>
  <ul>
    <li><strong>macOS 14.4 or later.</strong> That is the first version with the Core Audio process-tap support this feature relies on.</li>
    <li><strong>One universal build.</strong> The same download runs natively on Apple Silicon and Intel Macs.</li>
    <li><strong>Audio-capture permission.</strong> macOS asks once, the first time you turn the mode on.</li>
  </ul>
  <p>
    Grab the latest build from the buttons below or from the
    <a href={RELEASES_URL} rel="noopener">releases page</a>.
  </p>

  <h2>How to turn it on</h2>
  <ol>
    <li>Install HypeMuzik and open it.</li>
    <li>Open <strong>Settings</strong> and find the <strong>System-wide audio</strong> card.</li>
    <li>Under <strong>Equalize everything you hear</strong> (“Routes all system audio through the equalizer and effects”), press <strong>Enable</strong>.</li>
    <li>When macOS asks for audio-capture permission, allow it. The prompt explains that HypeMuzik captures system audio to apply your equalizer and effects to everything you hear.</li>
    <li>An <strong>Active</strong> badge appears while it is running. Press <strong>Stop</strong> to turn it off.</li>
  </ol>
  <p>
    Below the button, <strong>Apply to</strong> lets you choose <strong>All apps</strong>,
    <strong>Only selected</strong> or <strong>All except</strong>. An app has to be playing sound
    to show up in the list, so start playback first and then reopen it.
  </p>
  <p class="note">
    The chain is the one you set up in the Equalizer and Enhancer views, so change the curve,
    switch effects on or off, and the whole Mac follows.
  </p>

  <h2>The 12-stage chain</h2>
  <p>
    The equalizer is one part of a larger signal chain. Audio passes through these stages, in this
    order:
  </p>
  <ol>
    <li>Headphone correction</li>
    <li>31-band graphic equalizer</li>
    <li>Bass boost</li>
    <li>Stereo spatializer</li>
    <li>3D surround</li>
    <li>Room reverb</li>
    <li>Convolution impulse response</li>
    <li>Multiband compander</li>
    <li>Tube saturation</li>
    <li>Script processor</li>
    <li>Makeup gain</li>
    <li>Brickwall limiter</li>
  </ol>
  <p>
    The 31 equalizer bands sit at ISO ⅓-octave centres from 20 Hz to 20 kHz, which is fine enough
    to tame one resonance without dulling everything around it. The limiter at the end catches
    peaks, so a big bass boost does not clip your output.
  </p>
  <FeatureShot
    kind="desktop"
    base="hero/app-desktop"
    alt="HypeMuzik desktop Equalizer view: a graphic equalizer with a preset picker, a live response curve over the spectrum and a band-count selector"
    caption="The Equalizer view: a live response curve drawn over the spectrum."
  />

  <h2>Headphone correction</h2>
  <p>
    The first stage of the chain is headphone correction. HypeMuzik includes correction profiles
    from the <a href="/autoeq">AutoEq project</a>: choose your headphone model and its curve is
    run ahead of your own equalizer, so your tweaks start from a corrected baseline instead of
    fighting the headphones. Pick your model in the Enhancer view’s headphone card to use that
    first stage; the Equalizer view’s AutoEQ search instead maps a profile onto the 31 bands.
  </p>
  <p>
    If you also want a quick preset, the equalizer includes a preset picker, and you can save your
    own. Everything here is free on Mac, and the same engine runs on the
    <a href="/linux-music-player">Linux build</a> and in the phone apps.
  </p>
</FeaturePage>
