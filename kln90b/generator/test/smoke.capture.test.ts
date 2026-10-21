import {expect, it} from 'vitest';
import {bootUnit, settle} from '../../../vendor/kln90b/test/harness/boot';
import {Screen} from '../../../vendor/kln90b/test/harness/render/screen';

async function nav1(): Promise<string> {
	const unit = await bootUnit({position: {lat: 47.45, lon: -122.31}});
	await settle(unit);
	await unit.panel.selectPage('L', 'NAV 1');
	return Screen.read().dump();
}

let first = '';
it('reads NAV 1', async () => {
	first = await nav1();
	expect(first.split('\n')[6].slice(0, 5)).toBe('NAV 1');
});
// One unit per test: the second boot runs after the first unit's teardown
it('reads the same screen on a second boot', async () => expect(await nav1()).toBe(first));
