/**
 * The current releases of kln90b, read from the GitHub API when the site is built, for the download buttons of the
 * home page. Only full releases count: drafts and pre-releases (betas) never get a button.
 *
 * A release counts when its tag is a plain version (v2.2.0, v1.4) and it carries the package zip
 * (falcon71-kln90b-*.zip). The zip check keeps a button from ever pointing at the source code, and it keeps releases
 * of other products from the same repository (the KLN 89, once the repository holds both) away from these buttons.
 */

export const REPOSITORY = 'falcon71/kln90b';
export const RELEASES_PAGE = `https://github.com/${REPOSITORY}/releases`;

/** The fields of a release in the GitHub API that the selection reads. */
export interface ApiRelease {
	tag_name: string;
	html_url: string;
	draft: boolean;
	prerelease: boolean;
	published_at: string | null;
	assets: {name: string; size: number; browser_download_url: string}[];
}

export interface Release {
	/** The version without the leading v, for example "2.2.0". */
	version: string;
	/** The page of the release on GitHub, with its notes. */
	notesUrl: string;
	/** The direct link to the package zip. */
	downloadUrl: string;
	fileName: string;
	/** Bytes */
	size: number;
	/** ISO date of the publication */
	published: string;
}

/** The newest full release of each major version: 2 is for Microsoft Flight Simulator 2024, 1 for 2020. */
export interface CurrentReleases {
	msfs2024: Release;
	msfs2020: Release;
}

const VERSION_TAG = /^v(\d+)\.(\d+)(?:\.(\d+))?$/;
const PACKAGE_ZIP = /^falcon71-kln90b-.*\.zip$/;

function parse(release: ApiRelease): {key: number[]; release: Release} | null {
	if (release.draft || release.prerelease) return null;
	const match = VERSION_TAG.exec(release.tag_name);
	if (!match) return null;
	const zips = release.assets.filter(asset => PACKAGE_ZIP.test(asset.name));
	if (zips.length !== 1) return null;
	const [zip] = zips;
	return {
		key: [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)],
		release: {
			version: release.tag_name.slice(1),
			notesUrl: release.html_url,
			downloadUrl: zip.browser_download_url,
			fileName: zip.name,
			size: zip.size,
			published: release.published_at ?? '',
		},
	};
}

function newer(a: number[], b: number[]): boolean {
	for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] > b[i];
	return false;
}

/** The newest full release of the given major version, by version number (not by date), or null. */
export function newestRelease(releases: ApiRelease[], major: number): Release | null {
	let best: {key: number[]; release: Release} | null = null;
	for (const candidate of releases.map(parse)) {
		if (candidate === null || candidate.key[0] !== major) continue;
		if (best === null || newer(candidate.key, best.key)) best = candidate;
	}
	return best?.release ?? null;
}

/** Both current releases; throws when either is missing, so that a build never shows a button without a target. */
export function selectCurrentReleases(releases: ApiRelease[]): CurrentReleases {
	const msfs2024 = newestRelease(releases, 2);
	const msfs2020 = newestRelease(releases, 1);
	if (!msfs2024 || !msfs2020) {
		const missing = [!msfs2024 && 'v2', !msfs2020 && 'v1'].filter(Boolean).join(' and ');
		throw new Error(`No full release of ${missing} with a falcon71-kln90b-*.zip found in ${RELEASES_PAGE}`);
	}
	return {msfs2024, msfs2020};
}

const MAX_PAGES = 10;

/**
 * All releases of the repository, page by page. In GitHub Actions, GITHUB_TOKEN raises the rate limit that the
 * runners share; locally the anonymous limit is plenty.
 */
export async function fetchReleases(fetchImpl: typeof fetch = fetch): Promise<ApiRelease[]> {
	const headers: Record<string, string> = {
		Accept: 'application/vnd.github+json',
		'User-Agent': 'kln90b-manual-build',
	};
	const token = process.env.GITHUB_TOKEN;
	if (token) headers.Authorization = `Bearer ${token}`;

	const all: ApiRelease[] = [];
	for (let page = 1; page <= MAX_PAGES; page++) {
		const url = `https://api.github.com/repos/${REPOSITORY}/releases?per_page=100&page=${page}`;
		const response = await fetchImpl(url, {headers});
		if (!response.ok) throw new Error(`GET ${url}: ${response.status} ${response.statusText}`);
		const batch = (await response.json()) as ApiRelease[];
		all.push(...batch);
		if (batch.length < 100) break;
	}
	return all;
}

let cached: Promise<CurrentReleases | null> | undefined;

/**
 * The current releases for the build. On a CI server a failure fails the build, so that the site never goes out
 * without its download buttons. Elsewhere (a local build without network) it warns and returns null, and the page
 * points to the releases page instead.
 */
export function currentReleases(): Promise<CurrentReleases | null> {
	cached ??= fetchReleases()
		.then(selectCurrentReleases)
		.catch(error => {
			if (process.env.CI) throw error;
			console.warn(`[releases] ${(error as Error).message}; the download buttons link to the releases page.`);
			return null;
		});
	return cached;
}
