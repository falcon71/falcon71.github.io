import {describe, expect, it} from 'vitest';
// @ts-ignore: plain ES module without declarations
import {checkVendor} from '../vendorCheck.mjs';

const ok = {exists: true, nodeModules: true, statusLine: ' 3d371f3 vendor/kln90b (heads/main)', porcelain: ''};

describe('checkVendor', () => {
	it('accepts a clean submodule at its pin', () => expect(checkVendor(ok)).toBeNull());
	it('asks for the submodule', () => expect(checkVendor({...ok, exists: false})).toContain('git submodule update --init'));
	it('asks for its dependencies', () => expect(checkVendor({...ok, nodeModules: false})).toContain('npm ci --prefix vendor/kln90b'));
	it('refuses a submodule off its pin', () => expect(checkVendor({...ok, statusLine: '+9f0c1d2 vendor/kln90b'})).toContain('git submodule update'));
	it('refuses local changes', () => expect(checkVendor({...ok, porcelain: ' M kln90b/Gps.ts'})).toContain('local changes'));
});
