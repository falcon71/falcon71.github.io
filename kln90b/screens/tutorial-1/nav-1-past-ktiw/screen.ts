import {courseDeg, defineScreen, moveAircraft, pointFrom} from '../../../generator/api.ts';
import {directToKtiw, KFHR, KTIW, tut1Boot} from '../../shared/tut1.ts';

defineScreen(import.meta.url, {
	title: 'NAV 1 one mile past Tacoma Narrows',
	show: 'right',
	boot: tut1Boot,
	steps: async u => {
		await directToKtiw(u);
		// On the extension of the direct line, 1 NM past KTIW, still flying the same track
		const track = (courseDeg(KTIW, KFHR) + 180) % 360;
		await moveAircraft(u, pointFrom(KTIW, track, 1), {groundspeedKt: 90, trackTrue: track});
	},
	fields: [
		{id: 'from', find: {re: /d›/, area: 'R', row: 0}},
		{id: 'to', find: {re: /KTIW/, area: 'R', row: 0}},
		{id: 'cdi', find: {area: 'R', row: 1}},
		{id: 'dis', find: {re: /DIS +\S+/, area: 'R'}},
		{id: 'gs', find: {re: /GS +\S+/, area: 'R'}},
		{id: 'ete', find: {re: /ETE +\S+/, area: 'R'}},
		{id: 'brg', find: {re: /BRG +\S+/, area: 'R'}},
		{id: 'page', find: {re: /NAV 1/, area: 'S'}},
	],
});
