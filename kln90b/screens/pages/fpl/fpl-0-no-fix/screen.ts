import {defineScreen, wait} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 while the unit is not NAV ready',
	show: 'left',
	// The loss of the position raises a message that persists; the left half shows only the page name of the status line
	keepMessages: true,
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'FPL 0');
		// A cold start cannot be staged (the generator settles until the first fix), so the receiver is reset: the unit is then in the state of a power-on before its first fix
		u.props.sensors.in.gps.reset();
		await wait(1500);
		await u.panel.readMessages();
	},
	fields: [
		{id: 'plan', find: [{area: 'L', row: 1}, {area: 'L', row: 2}, {area: 'L', row: 3}, {area: 'L', row: 4}]},
		{id: 'page', find: {re: /FPL 0/, area: 'S'}},
	],
});
