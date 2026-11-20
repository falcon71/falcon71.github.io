import {
	adjustCourseIndicator, APR_ARM_SWITCH, courseDeg, defineScreen, facility, panelXml, place, pointFrom, savedFlightplan, wait,
} from '../../../generator/api.ts';
import {apt7} from '../../shared/apt-7-8.ts';

// FPL 0 from KYKM to KBFI, the aircraft 3 NM before TAMPO on the leg from GROMO. The transition TAMPO of GROMO4 ends in a
// holding pattern at TAMPO
const AT = pointFrom(place('TAMPO'), courseDeg(place('TAMPO'), place('GROMO')), 3);

defineScreen(import.meta.url, {
	title: 'MSG page with IF REQUIRED SELECT OBS',
	show: 'both',
	keepMessages: true,
	boot: {position: AT, panelXml: panelXml(APR_ARM_SWITCH), storage: savedFlightplan(0, ['KYKM', 'KBFI'].map(facility))},
	steps: async u => {
		await apt7(u, 'KYKM');
		await u.panel.cursor('R');
		await u.panel.cursorTo('R', '1 GROMO4');
		await u.panel.ent();
		await u.panel.cursorTo('R', '6 TAMPO');
		await u.panel.ent();
		await u.panel.ent();
		await wait(1000);
		await adjustCourseIndicator(u);
		await wait(2000);
		await u.panel.msg();
	},
	fields: [
		{id: 'message', find: {re: /IF REQUIRED SELECT OBS/, area: 'F'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
