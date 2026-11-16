import {defineScreen, place, wait} from '../../generator/api.ts';
import {openFlr2} from '../../../vendor/kln90b/test/harness/render/flrPages.ts';

defineScreen(import.meta.url, {
	title: 'FLR 2 page, repair question',
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
		await u.panel.cursor('L');
		await u.panel.clr();
		await wait(500);
	},
	fields: [
		{id: 'heading', find: {re: /ACTIVE/, area: 'L'}},
		{id: 'question', find: {re: /REPAIR +\?/, area: 'L'}},
		{id: 'second', find: {re: /ALTITUDE/, area: 'L'}},
		{id: 'third', find: {re: /RMI OUTPUT/, area: 'L'}},
		{id: 'page', find: {re: /CRSR/, area: 'S'}},
	],
});
