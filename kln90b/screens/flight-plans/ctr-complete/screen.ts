import {defineScreen, facility, place, savedFlightplan, wait} from '../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'A center waypoint inserted into a flight plan',
	show: 'both',
	boot: {position: place('KPDX'), storage: savedFlightplan(1, ['KPDX', 'KBKE'].map(facility))},
	steps: async u => {
		await u.panel.selectPage('L', 'FPL 1');
		await u.panel.selectPage('R', 'CTR 1');
		await u.panel.ent();
		await wait(3000);
		await u.panel.ent();
		await wait(1000);
	},
	fields: [
		{id: 'use', find: {re: /USE\? INVRT\?/, area: 'L'}},
		{id: 'before', find: {re: /1:KPDX/, area: 'L'}},
		{id: 'center', find: {re: /2:BKE00/, area: 'L'}},
		{id: 'after', find: {re: /3:KBKE/, area: 'L'}},
		{id: 'blank', find: {re: /4: +/, area: 'L'}},
		{id: 'done', find: [{re: /CTR WPT/, area: 'R'}, {re: /INSERTION/, area: 'R'}, {re: /COMPLETE/, area: 'R'}]},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'left-page', find: {re: /FPL 1/, area: 'S'}},
		{id: 'right-page', find: {re: /CTR 1/, area: 'S'}},
	],
});
