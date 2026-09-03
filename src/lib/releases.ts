/**
 * Resolves the latest hype-desktop release straight from GitHub, so a new
 * release is downloadable from this site the moment it is published — the site
 * itself never needs rebuilding.
 *
 * Every asset filename carries its version (`HypeMuzik_0.1.26_universal.dmg`),
 * so GitHub's `releases/latest/download/<name>` redirect cannot be used for
 * them; the release has to be looked up to learn the current filenames.
 */

const REPO = 'Lw-Muzik/hype-dsp';

/** No-JS / API-down fallback. Always correct, just one click further away. */
export const RELEASES_URL = `https://github.com/${REPO}/releases/latest`;

const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;

const CACHE_KEY = 'hm:latest-release';
const CACHE_TTL_MS = 30 * 60 * 1000;

export type DownloadOption = {
	/** Format shown in the menu, e.g. "AppImage" or "Apple Silicon". */
	label: string;
	url: string;
	size: number;
};

export type PlatformDownload = {
	id: 'mac' | 'windows' | 'linux';
	/** The download offered by the button itself. */
	primary: DownloadOption;
	/** Every format for this platform, primary first. One entry ⇒ no menu. */
	options: DownloadOption[];
};

export type LatestRelease = {
	version: string;
	publishedAt: string;
	htmlUrl: string;
	platforms: Partial<Record<PlatformDownload['id'], PlatformDownload>>;
};

type GhAsset = { name: string; browser_download_url: string; size: number };

/** Human-readable size. GitHub reports bytes; releases are tens of MB. */
export function formatSize(bytes: number): string {
	const mb = bytes / 1_048_576;
	return mb >= 1000 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`;
}

export function formatDate(iso: string): string {
	const d = new Date(iso);
	return Number.isNaN(d.valueOf())
		? ''
		: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Names an asset by what a person choosing a download cares about: on macOS the
 * CPU it runs on, elsewhere the package format.
 *
 * The desktop release currently builds `--target universal-apple-darwin`, so
 * one .dmg runs natively on both Apple Silicon and Intel. The arch branches
 * below are here so that splitting the dmg per-arch later needs no site change
 * — the macOS button would simply grow a menu, exactly like Linux's.
 */
function labelFor(id: PlatformDownload['id'], name: string): string {
	const n = name.toLowerCase();

	if (id === 'mac') {
		if (n.includes('universal')) return 'Apple Silicon + Intel';
		if (n.includes('aarch64') || n.includes('arm64')) return 'Apple Silicon';
		if (n.includes('x64') || n.includes('x86_64') || n.includes('intel')) return 'Intel';
		return 'Disk image';
	}

	if (id === 'windows') return n.endsWith('.msi') ? 'MSI package' : 'Installer (.exe)';

	if (n.endsWith('.appimage')) return 'AppImage · any distro';
	if (n.endsWith('.deb')) return 'Debian / Ubuntu';
	if (n.endsWith('.rpm')) return 'Fedora / RHEL';
	return 'Package';
}

/**
 * Assets a person should be offered, in preference order. Excludes updater
 * artifacts: `.sig` files, `latest.json`, and the macOS `.app.tar.gz` — that
 * tarball is what the in-app updater swaps in, not something to hand a
 * first-time visitor, who wants the .dmg.
 */
const MATCHERS: { id: PlatformDownload['id']; exts: string[] }[] = [
	{ id: 'mac', exts: ['.dmg'] },
	{ id: 'windows', exts: ['-setup.exe', '.exe', '.msi'] },
	{ id: 'linux', exts: ['.appimage', '.deb', '.rpm'] }
];

function toPlatforms(assets: GhAsset[]): LatestRelease['platforms'] {
	const platforms: LatestRelease['platforms'] = {};

	for (const { id, exts } of MATCHERS) {
		const options: DownloadOption[] = [];

		// Ordered by `exts`, so the preferred format lands first and becomes the
		// button's own download: .dmg, the .exe installer, the AppImage.
		for (const ext of exts) {
			for (const asset of assets) {
				const name = asset.name.toLowerCase();
				if (!name.endsWith(ext)) continue;
				if (options.some((o) => o.url === asset.browser_download_url)) continue;
				options.push({
					label: labelFor(id, asset.name),
					url: asset.browser_download_url,
					size: asset.size
				});
			}
		}

		if (options.length > 0) platforms[id] = { id, primary: options[0], options };
	}

	return platforms;
}

function readCache(): LatestRelease | null {
	try {
		const raw = localStorage.getItem(CACHE_KEY);
		if (!raw) return null;
		const { at, data } = JSON.parse(raw) as { at: number; data: LatestRelease };
		return Date.now() - at < CACHE_TTL_MS ? data : null;
	} catch {
		// Private mode, cleared storage, a bad entry — all just mean "no cache".
		return null;
	}
}

function writeCache(data: LatestRelease) {
	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
	} catch {
		// Storage disabled or full; the page works fine without it.
	}
}

/**
 * Returns the latest release, or `null` if it cannot be determined — the
 * unauthenticated API allows 60 requests/hour per IP, and a visitor over that
 * limit should still get working buttons pointed at the releases page.
 */
export async function fetchLatestRelease(): Promise<LatestRelease | null> {
	const cached = readCache();
	if (cached) return cached;

	try {
		const res = await fetch(API_URL, {
			headers: { Accept: 'application/vnd.github+json' }
		});
		if (!res.ok) return null;

		const json = (await res.json()) as {
			tag_name?: string;
			published_at?: string;
			html_url?: string;
			assets?: GhAsset[];
		};

		const platforms = toPlatforms(json.assets ?? []);
		if (Object.keys(platforms).length === 0) return null;

		const release: LatestRelease = {
			version: (json.tag_name ?? '').replace(/^v/, ''),
			publishedAt: json.published_at ?? '',
			htmlUrl: json.html_url ?? RELEASES_URL,
			platforms
		};

		writeCache(release);
		return release;
	} catch {
		return null;
	}
}
