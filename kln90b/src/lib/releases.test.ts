import {describe, expect, it} from 'vitest';
import {fetchReleases, newestRelease, selectCurrentReleases, type ApiRelease} from './releases';

function release(tag: string, options: Partial<ApiRelease> & {zip?: string | null} = {}): ApiRelease {
	const {zip, ...rest} = options;
	const zipName = zip === undefined ? `falcon71-kln90b-${tag}.zip` : zip;
	return {
		tag_name: tag,
		html_url: `https://github.com/falcon71/kln90b/releases/tag/${tag}`,
		draft: false,
		prerelease: false,
		published_at: '2026-01-01T00:00:00Z',
		assets: zipName === null ? [] : [{
			name: zipName,
			size: 1000,
			browser_download_url: `https://github.com/falcon71/kln90b/releases/download/${tag}/${zipName}`,
		}],
		...rest,
	};
}

describe('newestRelease', () => {
	it('skips pre-releases and drafts', () => {
		const releases = [
			release('v2.3-b2', {prerelease: true}),
			release('v2.4.0', {draft: true}),
			release('v2.2.0'),
		];
		expect(newestRelease(releases, 2)?.version).toBe('2.2.0');
	});

	it('skips a pre-release even when its tag is a plain version', () => {
		const releases = [release('v2.3.0', {prerelease: true}), release('v2.2.0')];
		expect(newestRelease(releases, 2)?.version).toBe('2.2.0');
	});

	it('picks by version number, not by date or list order', () => {
		// v1.5.2 was published long after v2.0.0; v2.0.10 sorts after v2.0.9
		const releases = [release('v1.5.2'), release('v2.0.9'), release('v2.0.10'), release('v1.4')];
		expect(newestRelease(releases, 2)?.version).toBe('2.0.10');
		expect(newestRelease(releases, 1)?.version).toBe('1.5.2');
	});

	it('reads a two-part tag as patch 0', () => {
		expect(newestRelease([release('v1.4'), release('v1.3')], 1)?.version).toBe('1.4');
		expect(newestRelease([release('v1.4.1'), release('v1.4')], 1)?.version).toBe('1.4.1');
	});

	it('ignores a tag that is not a plain version, even when it is not marked as a pre-release', () => {
		const releases = [release('v2.9-b1'), release('kln89-v2.9.0'), release('v2.1.0')];
		expect(newestRelease(releases, 2)?.version).toBe('2.1.0');
	});

	it('ignores a release without exactly one package zip', () => {
		const releases = [
			release('v2.5.0', {zip: null}),
			release('v2.4.0', {zip: 'falcon71-kln89-v2.4.0.zip'}),
			release('v2.1.0'),
		];
		expect(newestRelease(releases, 2)?.version).toBe('2.1.0');

		// Two package zips: no way to tell which one a pilot needs
		const twoZips = release('v2.6.0');
		twoZips.assets.push({...twoZips.assets[0], name: 'falcon71-kln90b-v2.6.0-extra.zip'});
		expect(newestRelease([twoZips, release('v2.1.0')], 2)?.version).toBe('2.1.0');
	});

	it('returns the zip, not the release page, as the download', () => {
		const picked = newestRelease([release('v1.5.2', {zip: 'falcon71-kln90b-v1.5.2-fixed.zip'})], 1);
		expect(picked).toEqual({
			version: '1.5.2',
			notesUrl: 'https://github.com/falcon71/kln90b/releases/tag/v1.5.2',
			downloadUrl: 'https://github.com/falcon71/kln90b/releases/download/v1.5.2/falcon71-kln90b-v1.5.2-fixed.zip',
			fileName: 'falcon71-kln90b-v1.5.2-fixed.zip',
			size: 1000,
			published: '2026-01-01T00:00:00Z',
		});
	});
});

describe('selectCurrentReleases', () => {
	it('returns v2 for 2024 and v1 for 2020', () => {
		const current = selectCurrentReleases([release('v2.2.0'), release('v1.5.2')]);
		expect(current.msfs2024.version).toBe('2.2.0');
		expect(current.msfs2020.version).toBe('1.5.2');
	});

	it('throws when a major version has no full release', () => {
		expect(() => selectCurrentReleases([release('v2.2.0'), release('v1.6-b1', {prerelease: true})]))
			.toThrow(/No full release of v1 with/);
		expect(() => selectCurrentReleases([release('v1.5.2')])).toThrow(/No full release of v2 with/);
	});
});

describe('fetchReleases', () => {
	it('follows the pages until a short one', async () => {
		const requested: string[] = [];
		const pages = [Array.from({length: 100}, (_, i) => release(`v2.0.${i}`)), [release('v1.5.2')]];
		const fake = (async (url: string) => {
			requested.push(url);
			return new Response(JSON.stringify(pages[requested.length - 1]), {status: 200});
		}) as typeof fetch;
		const all = await fetchReleases(fake);
		expect(all).toHaveLength(101);
		expect(requested).toEqual([
			'https://api.github.com/repos/falcon71/kln90b/releases?per_page=100&page=1',
			'https://api.github.com/repos/falcon71/kln90b/releases?per_page=100&page=2',
		]);
	});

	it('throws on an error response', async () => {
		const fake = (async () => new Response('rate limited', {status: 403, statusText: 'Forbidden'})) as typeof fetch;
		await expect(fetchReleases(fake)).rejects.toThrow(/403 Forbidden/);
	});
});
