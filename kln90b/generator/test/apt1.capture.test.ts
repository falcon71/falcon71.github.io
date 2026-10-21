import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {afterEach, expect, it} from 'vitest';
import {generateScreen} from '../lib/generate.ts';
import {place} from '../lib/navdata.ts';
import {parseScreenFile} from '../../src/lib/screenFile.ts';

const temps: string[] = [];

afterEach(() => {
	for (const t of temps.splice(0)) fs.rmSync(t, {recursive: true, force: true});
});

it('shows KSEA of the FAA navdata on APT 1, with the variation of the model', async () => {
	let variation = NaN;
	const root = fs.mkdtempSync(path.join(os.tmpdir(), 'kln-screen-'));
	temps.push(root);
	const dir = path.join(root, 'apt-1-ksea');
	fs.mkdirSync(dir);
	fs.writeFileSync(path.join(dir, 'fields.mdx'), '<Field id="ident" title="Identifier">x</Field>');
	await generateScreen(dir, {
		title: 'APT 1 page', show: 'right', boot: {position: place('KSEA')},
		steps: async u => {
			variation = u.props.magvar.getMagvarForCoordinates(place('KSEA'));
			await u.panel.selectPage('R', 'APT 1');
			await u.panel.cursor('R');
			await u.panel.enterIdent('R', 'KSEA');
		},
		fields: [{id: 'ident', find: {area: 'R', row: 0, from: 0, to: 11}}],
	});
	const file = parseScreenFile(fs.readFileSync(path.join(dir, 'screen.txt'), 'utf8'));
	expect(file.text[0]).toContain('KSEA');
	expect(file.text[1]).toContain('SEATTLE');
	// About 15 degrees east at Seattle in 2026 (NOAA WMM): the model's value, not the harness default of 0
	expect(variation).toBeCloseTo(14.9, 0);
});
