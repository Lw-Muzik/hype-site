<script lang="ts">
  import LegalPage from '$lib/components/LegalPage.svelte';
  import { GITHUB_URL } from '$lib/links';
  import {
    OPERATOR,
    OPERATOR_FULL,
    JURISDICTION,
    JURISDICTION_SHORT,
    CONTACT_EMAIL
  } from '$lib/legal';

  const sections = [
    { id: 'agreement', label: 'This agreement' },
    { id: 'licence', label: 'Your licence to use HypeMuzik' },
    { id: 'your-content', label: 'Your music, your responsibility' },
    { id: 'acceptable-use', label: 'Acceptable use' },
    { id: 'third-party', label: 'Third-party services' },
    { id: 'copyright', label: 'Copyright & takedowns' },
    { id: 'hearing', label: 'Listening safely' },
    { id: 'payments', label: 'Payments & donations' },
    { id: 'open-source', label: 'Open-source components' },
    { id: 'availability', label: 'Availability & changes' },
    { id: 'warranty', label: 'No warranties' },
    { id: 'liability', label: 'Limitation of liability' },
    { id: 'indemnity', label: 'Indemnity' },
    { id: 'termination', label: 'Termination' },
    { id: 'law', label: 'Governing law' },
    { id: 'general', label: 'General terms' },
    { id: 'contact', label: 'Contact' }
  ];
</script>

<LegalPage
  title="Terms & Conditions"
  description="The terms you agree to when you use the HypeMuzik desktop app, mobile app, or website — licence, acceptable use, disclaimers and liability."
  path="/terms"
  intro="These are the rules for using HypeMuzik. They are written to be read, not to be
         skimmed past — but the short version is: the app is provided free and as-is, you
         are responsible for the music you play through it, and there are limits on what we
         can be held liable for."
  {sections}
>
  <section>
    <h2 id="agreement">This agreement</h2>
    <p>
      These Terms and Conditions ("Terms") are a legal agreement between you and
      {OPERATOR_FULL} based in {JURISDICTION} ("HypeMuzik", "we", "us"). They cover the
      HypeMuzik desktop application, the HypeMuzik mobile application, and this website
      (together, the "Service").
    </p>
    <p>
      By installing, opening, or using the Service you accept these Terms. If you do not
      accept them, do not use the Service. If you are using HypeMuzik on behalf of an
      organisation, you confirm you have the authority to bind that organisation.
    </p>
    <p>
      Our <a href="/privacy">Privacy Policy</a> forms part of these Terms.
    </p>
  </section>

  <section>
    <h2 id="licence">Your licence to use HypeMuzik</h2>
    <p>
      We grant you a personal, non-exclusive, non-transferable, revocable licence to install
      and use the Service on devices you own or control, for your own use.
    </p>
    <p>You may not:</p>
    <ul>
      <li>
        sell, rent, sublicense, or redistribute the Service, or charge others for access to
        it;
      </li>
      <li>
        reverse-engineer, decompile, or disassemble any part of it, except to the extent
        that applicable law expressly permits this despite this restriction;
      </li>
      <li>
        remove or obscure any copyright, trademark, or attribution notice;
      </li>
      <li>
        use the HypeMuzik name, logo, or branding in a way that suggests we endorse or are
        affiliated with you, without our written permission.
      </li>
    </ul>
    <p>
      We keep all rights in the Service that these Terms do not expressly grant you. Using
      HypeMuzik does not transfer any ownership to you.
    </p>
  </section>

  <section>
    <h2 id="your-content">Your music, your responsibility</h2>
    <p>
      <strong>HypeMuzik is a player. It does not supply, host, sell, or distribute any
      music.</strong> Everything you hear through it comes from somewhere you chose: files
      already on your device, a cloud account you connected, an internet radio stream, or
      another third-party source.
    </p>
    <p>
      You are solely responsible for the content you play, download, store, or stream
      through the Service, and for holding whatever rights, licences, or permissions that
      content requires in your country. We do not review, verify, or monitor it, and we have
      no way of knowing what you are playing.
    </p>
    <p>
      If you do not have the right to use a piece of content, do not use HypeMuzik to play
      it.
    </p>
  </section>

  <section>
    <h2 id="acceptable-use">Acceptable use</h2>
    <p>You agree not to use the Service:</p>
    <ul>
      <li>to infringe anyone's copyright, trademark, or other rights;</li>
      <li>to break any law that applies to you;</li>
      <li>
        to circumvent digital rights management, access controls, or any technical
        protection measure;
      </li>
      <li>
        to interfere with, overload, or attempt to gain unauthorised access to the Service
        or to any system it connects to;
      </li>
      <li>
        to distribute malware, or to bundle the Service into anything that does.
      </li>
    </ul>
  </section>

  <section>
    <h2 id="third-party">Third-party services</h2>
    <p>
      HypeMuzik can connect to services operated by other companies — including Google
      Drive, Dropbox, internet radio providers, and other third-party media sources. Those
      connections are made at your request, using your own accounts.
    </p>
    <p>
      When you use them, you are also bound by <strong>their</strong> terms and privacy
      policies. We do not control those services, do not guarantee they will keep working,
      and are not responsible for their content, availability, or conduct. A third party
      changing or withdrawing its service may remove a HypeMuzik feature with no notice to
      us or to you.
    </p>
    <div class="legal-note">
      <p>
        <strong>No affiliation.</strong> HypeMuzik is an independent product. It is not
        affiliated with, sponsored by, endorsed by, or otherwise connected to Google LLC,
        YouTube, Dropbox, Inc., Apple Inc., or any other third party whose service it can
        connect to. All trademarks belong to their respective owners and are used only to
        describe compatibility.
      </p>
    </div>
  </section>

  <section>
    <h2 id="copyright">Copyright and takedowns</h2>
    <p>
      We respect copyright and we expect our users to do the same. If you believe something
      distributed by us — our website, our app binaries, or our own materials — infringes
      your copyright, contact us at
      <a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a> with enough detail to identify
      the work and the material in question, and we will investigate promptly.
    </p>
    <p>
      Please note that we cannot remove content from your device, from your cloud storage,
      or from a third-party service. We do not host user music and have no access to it. A
      notice about content playing inside someone's own copy of the app must go to whoever
      actually hosts that content.
    </p>
  </section>

  <section>
    <h2 id="hearing">Listening safely, and your equipment</h2>
    <p>
      HypeMuzik includes a 31-band equalizer, gain, bass enhancement, limiting and other
      processing that can substantially increase output level. That is the point of the
      product, and it comes with real physical consequences.
    </p>
    <div class="legal-note">
      <p>
        <strong>Prolonged listening at high volume can permanently damage your hearing.</strong>
        Extreme gain or band settings can also distort audio and damage headphones,
        speakers, or amplifiers. Set levels responsibly, reduce gain before applying large
        boosts, and stop if you experience discomfort or ringing.
      </p>
    </div>
    <p>
      You use the equalizer and DSP features at your own risk, and you are responsible for
      the levels you choose. To the fullest extent the law allows, we are not liable for
      hearing damage or for damage to audio equipment resulting from settings you applied.
    </p>
  </section>

  <section>
    <h2 id="payments">Payments and donations</h2>
    <p>
      HypeMuzik is currently free to download and use, and in-app payments are switched off.
    </p>
    <p>
      If we later introduce paid features, supporter tiers, or donations, the price, what it
      includes, and the refund terms will be shown clearly before you pay, and payment will
      be handled by a third-party payment processor under its own terms. Nothing in these
      Terms obliges you to pay for anything you have not explicitly bought.
    </p>
  </section>

  <section>
    <h2 id="open-source">Open-source components</h2>
    <p>
      The Service includes third-party open-source software, each covered by its own
      licence. Those licences continue to govern their components and, where they conflict
      with these Terms in respect of that component, they prevail. Related source and
      release information is published at
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">our GitHub repository</a>.
    </p>
  </section>

  <section>
    <h2 id="availability">Availability, updates and changes</h2>
    <p>
      We may change, suspend, or discontinue any part of the Service at any time, and we may
      release updates that add, alter, or remove features. We are not obliged to maintain
      backwards compatibility or to keep any particular feature available.
    </p>
    <p>
      We may update these Terms. The current version always lives at this address with its
      effective date at the top. If a change is material we will make a reasonable effort to
      highlight it. Continuing to use the Service after a change means you accept the
      updated Terms; if you do not accept them, stop using the Service and uninstall it.
    </p>
  </section>

  <section>
    <h2 id="warranty">No warranties</h2>
    <p class="legal-caps">
      The service is provided "as is" and "as available", without warranty of any kind,
      express or implied. To the fullest extent permitted by law, we disclaim all
      warranties, including any implied warranties of merchantability, fitness for a
      particular purpose, title, and non-infringement.
    </p>
    <p class="legal-caps">
      We do not warrant that the service will be uninterrupted, timely, secure, or
      error-free, that defects will be corrected, that it will be compatible with your
      hardware or software, or that any data it stores will be preserved. You are
      responsible for maintaining your own backups of anything you value.
    </p>
    <p>
      Some jurisdictions do not allow the exclusion of certain warranties, so parts of this
      section may not apply to you. Where that is the case, the excluded warranties are
      limited to the minimum duration and scope the law permits.
    </p>
  </section>

  <section>
    <h2 id="liability">Limitation of liability</h2>
    <p class="legal-caps">
      To the fullest extent permitted by law, HypeMuzik and its operator will not be liable
      for any indirect, incidental, special, consequential, exemplary, or punitive damages,
      or for any loss of profits, revenue, data, goodwill, or other intangible losses,
      arising out of or relating to your use of or inability to use the service — whether
      based in contract, tort, negligence, strict liability, or any other theory, and even
      if we have been advised of the possibility of such damages.
    </p>
    <p class="legal-caps">
      To the fullest extent permitted by law, our total aggregate liability for all claims
      relating to the service is limited to the greater of the amount you actually paid us
      for the service in the twelve months before the claim arose, or fifty United States
      dollars (US$50).
    </p>
    <p>
      Nothing in these Terms excludes or limits liability that cannot lawfully be excluded
      or limited — including liability for death or personal injury caused by negligence, or
      for fraud or fraudulent misrepresentation. Some jurisdictions do not allow certain
      limitations, so parts of this section may not apply to you.
    </p>
  </section>

  <section>
    <h2 id="indemnity">Indemnity</h2>
    <p>
      You agree to indemnify and hold harmless HypeMuzik and its operator from any claim,
      demand, loss, liability, or expense (including reasonable legal fees) brought by a
      third party and arising out of your use of the Service, the content you play or
      distribute through it, your breach of these Terms, or your violation of any law or of
      anyone else's rights.
    </p>
  </section>

  <section>
    <h2 id="termination">Termination</h2>
    <p>
      You may end this agreement at any time by uninstalling the Service. We may suspend or
      terminate your licence if you breach these Terms, or if we discontinue the Service.
    </p>
    <p>
      The sections that by their nature should survive termination — your responsibility for
      content, the disclaimers, the limitation of liability, the indemnity, and the
      governing-law provisions — survive it.
    </p>
  </section>

  <section>
    <h2 id="law">Governing law and disputes</h2>
    <p>
      These Terms are governed by the laws of {JURISDICTION}, without regard to conflict-of-law
      rules. The courts of {JURISDICTION_SHORT} have exclusive jurisdiction over any dispute
      arising from them, and you consent to that jurisdiction and venue.
    </p>
    <p>
      If you live in a country whose consumer-protection law gives you rights that cannot be
      overridden by contract, nothing here removes those rights.
    </p>
    <p>
      Before starting formal proceedings, please write to us at
      <a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a>. Most disputes are resolved far
      faster by an email than by a filing.
    </p>
  </section>

  <section>
    <h2 id="general">General terms</h2>
    <ul>
      <li>
        <strong>Entire agreement.</strong> These Terms and the Privacy Policy are the whole
        agreement between us about the Service, and replace any earlier understanding.
      </li>
      <li>
        <strong>Severability.</strong> If any provision is found unenforceable, it is limited
        or removed to the minimum extent necessary and the rest stays in force.
      </li>
      <li>
        <strong>No waiver.</strong> If we do not enforce a provision, that is not a waiver of
        our right to enforce it later.
      </li>
      <li>
        <strong>Assignment.</strong> You may not assign these Terms without our consent. We
        may assign them as part of a transfer of the Service.
      </li>
      <li>
        <strong>Force majeure.</strong> Neither party is liable for a failure to perform
        caused by events beyond its reasonable control.
      </li>
    </ul>
  </section>

  <section>
    <h2 id="contact">Contact</h2>
    <p>
      Questions about these Terms go to
      <a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a>.
    </p>
    <p>
      See also our <a href="/privacy">Privacy Policy</a>.
    </p>
  </section>
</LegalPage>
