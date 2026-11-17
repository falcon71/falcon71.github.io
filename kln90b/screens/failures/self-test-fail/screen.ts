import {defineScreen, place, wait} from '../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The Self Test page after a failed self test',
	show: 'both',
	boot: {position: place('KSEA')},
	steps: async u => {
		// A failed ARINC 429 output is one of the failures the self test finds. The unit has been started with its engine
		// running, which skips the self test, so this is the power cycle a pilot does
		u.props.failures.fail('arinc429Out');
		await u.panel.powerCycle();
		await wait(19000);
	},
	fields: [
		{id: 'dis', find: {re: /DIS +\S+/, area: 'L'}},
		{id: 'cdi', find: {area: 'L', row: 1}},
		{id: 'obs', find: {re: /OBS IN +\S+/, area: 'L'}},
		{id: 'out', find: {re: /OUT +\S+/, area: 'L'}},
		{id: 'rmi', find: {re: /RMI +\S+/, area: 'L'}},
		{id: 'testfail', find: {re: /TEST FAIL/, area: 'L'}},
		{id: 'title', find: {re: /DATE\/TIME/, area: 'R'}},
		{id: 'date', find: {re: /\d\d [A-Z]{3} \d\d/, area: 'R', row: 1}},
		{id: 'time', find: {re: /\d\d:\d\d/, area: 'R', row: 2}},
		{id: 'seconds', find: {re: /(?<=:\d\d:)\d\d/, area: 'R', row: 2}},
		{id: 'zone', find: {re: /[A-Z]{3}$/, area: 'R', row: 2}},
		{id: 'alt', find: {re: /ALT +\S+ft/, area: 'R'}},
		{id: 'baro', find: {re: /BARO:\S+/, area: 'R'}},
		{id: 'approve', find: {re: /APPROVE\?/, area: 'R'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'prompt', find: {area: 'S', from: 14, to: 17}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
