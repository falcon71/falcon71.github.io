import {defineScreen} from '../../../generator/api.ts';
import {GROUND_BOOT, loadGromo4} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 with the DME arc of GROMO4',
	show: 'left',
	boot: GROUND_BOOT,
	steps: loadGromo4,
	fields: [
		{id: 'from', find: {re: /1:KYKM/, area: 'L'}},
		{id: 'header', find: {re: /GROMO4-SID/, area: 'L'}},
		{id: 'arc-waypoint', find: {re: /2\.D247I/, area: 'L'}},
		{id: 'end-fix', find: {re: /3\.OHKAR/, area: 'L'}},
		{id: 'papps', find: {re: /4\.PAPPS/, area: 'L'}},
		{id: 'page', find: {re: /FPL 0/, area: 'S'}},
	],
});
