import {defineScreen} from '../../../generator/api.ts';
import {pastThreshold, tut2Boot} from '../../shared/tut2.ts';

// Past the MAP, D-> offers FEVAS, the first waypoint of the missed approach
defineScreen(import.meta.url, {
	title: 'Direct To page with FEVAS for the missed approach',
	show: 'left',
	boot: tut2Boot,
	steps: async u => {
		await pastThreshold(u);
		await u.panel.dct();
	},
	fields: [
		{id: 'dto-title', find: {re: /DIRECT TO:/, area: 'L', row: 0}},
		{id: 'dto-ident', find: {re: /FEVAS/, area: 'L', row: 2}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
