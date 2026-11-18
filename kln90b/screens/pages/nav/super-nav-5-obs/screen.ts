import {adjustCourseIndicator, defineScreen, panelXml, showSuperNav5} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../snav5-state.ts';

defineScreen(import.meta.url, {
	title: 'Super NAV 5 in OBS mode, to a waypoint outside FPL 0',
	show: 'both',
	// A unit that reads no course indicator: the selected course is set on the unit, so OBS has a colon
	boot: {...BOOT, panelXml: panelXml({'Input.ObsSource': 0})},
	steps: async u => {
		await flyAndAdjust(u);
		// A direct-to to KBFI, which FPL 0 does not hold, and then OBS mode
		await u.panel.directTo('KBFI');
		await adjustCourseIndicator(u);
		await u.panel.selectPage('L', 'NAV 1');
		await u.panel.obsMode();
		await adjustCourseIndicator(u);
		await showSuperNav5(u);
	},
	fields: [
		{id: 'distance', find: {re: /\d+\.\d È/, area: 'F', row: 0}},
		{id: 'ident', find: {re: /KBFI/, area: 'F', row: 1}},
		{id: 'mode', find: {re: /Ê\d{3}/, area: 'F', row: 2}},
		{id: 'groundspeed', find: {re: /\d+ É/, area: 'F', row: 3}},
		{id: 'ete', find: {re: /Ð\S+/, area: 'F', row: 4}},
		{id: 'dtk', find: {re: /Ù:\d{3}/, area: 'F', row: 5}},
		{id: 'track', find: {re: /Ö\d{3}°/, area: 'F', row: 6}},
		{id: 'range', find: {re: /\d+(?= *$)/, area: 'F', row: 6}},
		{id: 'course-line', find: {map: 'F', draw: /^plain /, many: true}},
		{id: 'active-waypoint', find: {map: 'F', draw: /^icon % /}},
		{id: 'waypoints', find: [{map: 'F', draw: /^icon @ /, many: true}, {map: 'F', draw: /^label /, many: true}]},
		{id: 'aircraft', find: {map: 'F', draw: /^icon \$ /}},
	],
});
