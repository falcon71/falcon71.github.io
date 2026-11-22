import {defineScreen} from '../../../generator/api.ts';
import {pastThreshold, tut2Boot} from '../../shared/tut2.ts';

// 1 NM past the threshold of runway 32L, the MAP, which stays the active waypoint
defineScreen(import.meta.url, {
	title: 'NAV 1 past the threshold of runway 32L',
	show: 'right',
	boot: tut2Boot,
	steps: pastThreshold,
	fields: [
		{id: 'r-leg', find: {area: 'R', row: 0}},
		{id: 'r-cdi', find: {area: 'R', row: 1}},
		{id: 'r-dis', find: {re: /DIS +\S+/, area: 'R'}},
		{id: 'r-gs', find: {re: /GS +\S+/, area: 'R'}},
		{id: 'r-ete', find: {re: /ETE +\S+/, area: 'R'}},
		{id: 'r-brg', find: {re: /BRG +\S+/, area: 'R'}},
		{id: 'rpage', find: {re: /NAV 1/, area: 'S'}},
	],
});
