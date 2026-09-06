<script lang="ts">
  import LegalPage from '$lib/components/LegalPage.svelte';
  import {
    OPERATOR,
    OPERATOR_FULL,
    JURISDICTION,
    CONTACT_EMAIL,
    GOOGLE_DRIVE_SCOPE as DRIVE,
    LIMITED_USE_DISCLOSURE,
    GOOGLE_USER_DATA_POLICY_URL,
    GOOGLE_PERMISSIONS_URL,
    DROPBOX_APPS_URL
  } from '$lib/legal';

  const sections = [
    { id: 'summary', label: 'The short version' },
    { id: 'scope', label: 'Who this covers' },
    { id: 'on-device', label: 'What stays on your device' },
    { id: 'google', label: 'Google Drive' },
    { id: 'dropbox', label: 'Dropbox' },
    { id: 'diagnostics', label: 'Diagnostics & analytics' },
    { id: 'permissions', label: 'Device permissions' },
    { id: 'website', label: 'This website' },
    { id: 'never', label: 'What we never do' },
    { id: 'retention', label: 'Keeping & deleting data' },
    { id: 'security', label: 'Security' },
    { id: 'children', label: "Children's privacy" },
    { id: 'international', label: 'Where your data goes' },
    { id: 'changes', label: 'Changes' },
    { id: 'contact', label: 'Contact' }
  ];
</script>

<LegalPage
  title="Privacy Policy"
  description="How HypeMuzik handles your data: what stays on your device, exactly why the apps ask for Google Drive and Dropbox access, and how to revoke it."
  path="/privacy"
  intro="HypeMuzik is a music player. It runs on your computer and your phone, it plays
         your own music, and it is built so that your listening stays yours. This policy
         explains — in plain language — what the apps and this website handle, why, and
         how you take any of it back."
  {sections}
>
  <section>
    <h2 id="summary">The short version</h2>
    <ul>
      <li>
        <strong>Your music library never leaves your device.</strong> HypeMuzik scans and
        plays your files locally. We do not upload them, copy them, or index them on a
        server.
      </li>
      <li>
        <strong>We do not run accounts.</strong> There is no HypeMuzik sign-up, no
        password, and no profile.
      </li>
      <li>
        <strong>Cloud access is opt-in and stays between you and your provider.</strong> If
        you connect Google Drive or Dropbox, your files stream directly from that provider
        to your device. They do not pass through any HypeMuzik server.
      </li>
      <li>
        <strong>We do not sell your data, show you ads, or train AI models on it.</strong>
        Ever.
      </li>
      <li>
        <strong>You can disconnect at any time</strong>, from inside the app and from your
        Google or Dropbox account settings.
      </li>
    </ul>
  </section>

  <section>
    <h2 id="scope">Who this covers</h2>
    <p>
      This policy applies to the HypeMuzik desktop application (macOS, Windows and Linux),
      the HypeMuzik mobile application (Android and iOS), and this website,
      <a href="https://hypemuzik.com">hypemuzik.com</a>.
    </p>
    <p>
      {OPERATOR_FULL} based in {JURISDICTION}, is the party responsible for the data
      described here. You can reach us at
      <a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a>.
    </p>
  </section>

  <section>
    <h2 id="on-device">What stays on your device</h2>
    <p>
      Most of what HypeMuzik knows about you never reaches us, because it never leaves the
      machine you installed it on. That includes:
    </p>

    <div class="legal-table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">What</th>
            <th scope="col">Why it exists</th>
            <th scope="col">Where it lives</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Your music library index</td>
            <td>Titles, artists, albums and artwork, so search and browsing are instant</td>
            <td>A local database on your device</td>
          </tr>
          <tr>
            <td>Equalizer and DSP settings</td>
            <td>So your presets, curves and effect chain survive a restart</td>
            <td>Local app settings</td>
          </tr>
          <tr>
            <td>Play history and counts</td>
            <td>To build your daily mixes and recently-played lists</td>
            <td>The same local database</td>
          </tr>
          <tr>
            <td>Connected-account labels</td>
            <td>To show which Google or Dropbox account a library belongs to</td>
            <td>Local app settings</td>
          </tr>
          <tr>
            <td>Cloud access tokens</td>
            <td>So you do not have to reconnect every time you open the app</td>
            <td>Your operating system's secure credential store</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>
      None of the above is transmitted to us. If you uninstall HypeMuzik, it goes with it.
    </p>
    <p>
      The same is true of <strong>Phone Link</strong>, the feature that streams audio from
      your phone to your desktop. That connection is made directly between your own two
      devices over your own network. The audio is not relayed through a HypeMuzik server,
      and we never see what you are streaming.
    </p>
  </section>

  <section>
    <h2 id="google">Connecting Google Drive</h2>
    <p>
      Connecting Google Drive is <strong>entirely optional</strong>. HypeMuzik is fully
      usable without it, and it is never switched on by default — nothing happens until you
      tap or click <em>Connect</em> yourself.
    </p>

    <h3>What we ask for, and why</h3>
    <p>
      When you connect, HypeMuzik asks Google for a single permission:
    </p>
    <ul>
      <li>
        <code>{DRIVE.id}</code> — {DRIVE.grants}.
      </li>
    </ul>
    <p>
      We request it <strong>{DRIVE.purpose}</strong>. That is the whole purpose. HypeMuzik
      is a player, so it only ever reads; it cannot create, modify, or delete anything in
      your Drive.
    </p>
    <p>{DRIVE.breadth}</p>

    <h3>What actually happens to your files</h3>
    <ul>
      <li>
        Your audio streams <strong>directly from Google to your device</strong>. It is not
        proxied, cached, or stored on any server we operate — we do not operate one for
        this.
      </li>
      <li>
        HypeMuzik keeps a local list of the tracks it found — names, durations and folder
        names — so your cloud library loads instantly next time. That list stays on your
        device.
      </li>
      <li>
        The email address of the connected Google account is stored locally, and only so
        the app can show you which account is connected.
      </li>
      <li>
        Access and refresh tokens are held in your operating system's secure credential
        store — Keychain on macOS, Credential Manager on Windows, the system keyring on
        Linux, and the Keystore or Keychain on mobile.
      </li>
    </ul>

    <h3>Google's Limited Use requirements</h3>
    <div class="legal-note is-key">
      <p>{LIMITED_USE_DISCLOSURE}</p>
    </div>
    <p>
      In practice this means we do not transfer your Google data to anyone, do not use it
      for advertising, do not allow humans to read it, and do not use it to train any
      machine-learning or AI model. You can read the policy we are bound by here:
      <a href={GOOGLE_USER_DATA_POLICY_URL} target="_blank" rel="noopener noreferrer">
        Google API Services User Data Policy
      </a>.
    </p>

    <h3>Taking it back</h3>
    <p>
      Disconnect the account inside HypeMuzik — this deletes the stored tokens and the
      cached file list from your device immediately. You can also revoke HypeMuzik's access
      from Google directly, at any time, at
      <a href={GOOGLE_PERMISSIONS_URL} target="_blank" rel="noopener noreferrer">
        your Google Account permissions page
      </a>. Revoking there takes effect at once, whether or not the app is running.
    </p>
  </section>

  <section>
    <h2 id="dropbox">Connecting Dropbox</h2>
    <p>
      Dropbox works the same way and is equally optional. HypeMuzik requests read access so
      it can list and stream the audio files in your Dropbox, streams them directly from
      Dropbox to your device, and stores the resulting tokens in your system's secure
      credential store.
    </p>
    <p>
      You can disconnect inside the app, or revoke access from
      <a href={DROPBOX_APPS_URL} target="_blank" rel="noopener noreferrer">
        your Dropbox connected-apps page
      </a>.
    </p>
  </section>

  <section>
    <h2 id="diagnostics">Diagnostics and analytics</h2>
    <p>
      The <strong>mobile app</strong> uses two Google Firebase services:
    </p>
    <ul>
      <li>
        <strong>Firebase Crashlytics</strong> — when the app crashes, it sends a crash
        report so the bug can be fixed. A report contains the technical state of the crash:
        the stack trace, the device model, the operating system version, and an anonymous
        installation identifier. It does not contain your music, your file names, or your
        cloud account details.
      </li>
      <li>
        <strong>Firebase Analytics</strong> — aggregate, anonymous usage counts, used to
        understand which features are actually used and on which devices. It is not tied to
        your identity and is not used for advertising.
      </li>
    </ul>
    <p>
      Both are governed by
      <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">
        Google's Firebase privacy documentation
      </a>. You can opt out of analytics collection in your device's system settings, and
      on Android by disabling ad personalisation.
    </p>
    <p>
      The <strong>desktop app</strong> does not include Crashlytics or Analytics.
    </p>
  </section>

  <section>
    <h2 id="permissions">Device permissions, and what each one is for</h2>
    <p>
      Mobile operating systems ask you to approve permissions individually. Here is what
      each one HypeMuzik requests is genuinely used for. Every one of them can be declined;
      declining only disables the feature it belongs to.
    </p>
    <ul>
      <li>
        <strong>Music and audio files</strong> — to find and play the music already on your
        device. Nothing is uploaded.
      </li>
      <li>
        <strong>Microphone</strong> — used only by the on-screen audio visualiser, which
        reacts to what is currently playing. The audio is analysed in real time to draw the
        bars and is <strong>never recorded, stored, or transmitted</strong>. Turn the
        visualiser off and the microphone is not used at all.
      </li>
      <li>
        <strong>Camera</strong> — used only to scan the pairing QR code when you link your
        phone to the desktop app. No photos are taken or saved.
      </li>
      <li>
        <strong>Notifications</strong> — to show the playback controls in your notification
        shade and on your lock screen.
      </li>
      <li>
        <strong>Bluetooth</strong> — to detect and route audio to your headphones and
        speakers.
      </li>
      <li>
        <strong>Local network and Wi-Fi state</strong> — to discover your desktop on the
        same network for Phone Link and casting.
      </li>
      <li>
        <strong>Storage</strong> — to save tracks you explicitly choose to download for
        offline listening, into your device's music folder.
      </li>
      <li>
        <strong>Run in the background / ignore battery optimisation</strong> — so playback
        does not stop when your screen turns off.
      </li>
    </ul>
  </section>

  <section>
    <h2 id="website">This website</h2>
    <p>
      This site is a static marketing page. It sets no advertising cookies and runs no
      third-party tracking scripts.
    </p>
    <p>
      If page analytics are enabled for a given build, the site stores a randomly generated
      identifier in your browser's local storage and records which pages were viewed, so we
      can count unique visitors. That identifier is not linked to your name, your email, or
      anything you do inside the apps, and it never leaves this purpose. Clearing your
      browser's site data removes it.
    </p>
    <p>
      Downloads are served from GitHub, and the app-store buttons link to Apple and Google.
      Following those links takes you to services with their own privacy policies, which we
      do not control.
    </p>
  </section>

  <section>
    <h2 id="never">What we never do</h2>
    <ul>
      <li>We never sell, rent, or trade your personal information.</li>
      <li>We never use your data — or your Google data — for advertising.</li>
      <li>We never use your content to train AI or machine-learning models.</li>
      <li>We never upload your music library to our servers.</li>
      <li>
        We never read your files. Cloud content moves between you and your provider; we are
        not in the middle of it.
      </li>
    </ul>
  </section>

  <section>
    <h2 id="retention">Keeping and deleting your data</h2>
    <p>
      Because almost everything is stored locally, you control retention directly:
    </p>
    <ul>
      <li>
        <strong>Disconnect an account</strong> in the app to erase its tokens and cached
        file list from your device.
      </li>
      <li>
        <strong>Uninstall the app</strong> to remove the local library index, your presets
        and your play history.
      </li>
      <li>
        <strong>Revoke access</strong> at Google or Dropbox to cut off the connection at the
        source.
      </li>
      <li>
        <strong>Crash and analytics records</strong> held by Firebase are retained according
        to Google's published Firebase retention periods.
      </li>
    </ul>
    <p>
      Depending on where you live you may have additional rights over personal data — to
      access it, correct it, export it, or have it deleted. Because we hold so little,
      these requests are usually answered in a sentence, but we will always answer.
      Write to <a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a> and we will respond
      within 30 days.
    </p>
  </section>

  <section>
    <h2 id="security">Security</h2>
    <p>
      Cloud credentials are stored using the secure credential store your operating system
      provides, rather than in plain files. All traffic to Google, Dropbox and this website
      runs over encrypted HTTPS connections. Sign-in happens in your real browser or your
      system's secure authentication view using OAuth — HypeMuzik never sees, asks for, or
      stores your Google or Dropbox password.
    </p>
    <p>
      No system is perfectly secure, and we cannot guarantee absolute security. If we ever
      become aware of a breach affecting your information, we will tell you and the relevant
      authorities as promptly as the law requires.
    </p>
  </section>

  <section>
    <h2 id="children">Children's privacy</h2>
    <p>
      HypeMuzik is not directed at children under 13, and we do not knowingly collect
      personal information from them. If you believe a child has provided us with personal
      information, contact us and we will delete it.
    </p>
  </section>

  <section>
    <h2 id="international">Where your data goes</h2>
    <p>
      {OPERATOR} operates from {JURISDICTION}. The limited data described above — crash
      reports and analytics — is processed by Google on infrastructure that may be located
      in other countries, including the United States. Google Drive and Dropbox content
      stays within those providers' own infrastructure and is governed by their policies.
      By using the apps you understand that this processing may occur outside your country
      of residence.
    </p>
  </section>

  <section>
    <h2 id="changes">Changes to this policy</h2>
    <p>
      If this policy changes, the new version is published on this page with a new effective
      date. Where a change materially affects how your data is handled, we will make it
      obvious in the app rather than relying on you to re-read this page. Continuing to use
      HypeMuzik after a change means you accept the updated policy.
    </p>
  </section>

  <section>
    <h2 id="contact">Contact</h2>
    <p>
      Questions about this policy, requests about your data, or anything that looks wrong to
      you — write to
      <a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a> and a real person will read it.
    </p>
    <p>
      See also our <a href="/terms">Terms &amp; Conditions</a>.
    </p>
  </section>
</LegalPage>
