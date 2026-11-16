import {defineScreen, place, wait} from '../../generator/api.ts';
import {openFlr2} from '../../../vendor/kln90b/test/harness/render/flrPages.ts';

defineScreen(import.meta.url, {
	title: 'FLR 2 page, active failures',
	show: 'left',
	// The failures leave persistent messages, which stay listed after they were read
	keepMessages: true,
	boot: {position: place('KSEA')},
	steps: async u => {
		u.props.failures.fail('arinc429Out');
		u.props.failures.fail('altitude');
		u.props.failures.fail('rmiOutput');
		await wait(12000);
		await u.panel.readMessages();
		await openFlr2(u);
	},
	fields: [
		{id: 'heading', find: {re: /ACTIVE/, area: 'L'}},
		{id: 'first', find: {re: /429 OUTPUT/, area: 'L'}},
		{id: 'second', find: {re: /ALTITUDE/, area: 'L'}},
		{id: 'third', find: {re: /RMI OUTPUT/, area: 'L'}},
		{id: 'page', find: {re: /FLR.2/, area: 'S'}},
	],
});
