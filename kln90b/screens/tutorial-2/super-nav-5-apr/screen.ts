import {defineScreen} from '../../../generator/api.ts';
import {superNav5ApproachActive, tut2Boot} from '../../shared/tut2.ts';

// 1.8 NM before the FAF DUANE: the approach has just become active; field 1 shows XTK
defineScreen(import.meta.url, {
	title: 'Super NAV 5 as the approach becomes active before DUANE',
	show: 'both',
	boot: tut2Boot,
	steps: superNav5ApproachActive,
	fields: [
		{id: 'distance', find: {re: /\d+\.\d È/, area: 'F', row: 0}},
		{id: 'ident', find: {re: /DUANE\S*/, area: 'F', row: 1}},
		{id: 'mode', find: {re: /\S-Ë/, area: 'F', row: 2}},
		{id: 'groundspeed', find: {re: /\d+ É/, area: 'F', row: 3}},
		{id: 'xtk', find: {re: /\S+NM\S/, area: 'F', row: 4}},
		{id: 'dtk', find: {re: /Ó\d{3}°/, area: 'F', row: 5}},
		{id: 'track', find: {re: /Ö\d{3}°/, area: 'F', row: 6}},
		{id: 'range', find: {re: /\d+(?= *$)/, area: 'F', row: 6}},
		{id: 'active-leg', find: {map: 'F', draw: /^arrow AUBRN DUANE$/}},
		{id: 'legs', find: {map: 'F', draw: /^line /, many: true}},
		{id: 'active-waypoint', find: [{map: 'F', draw: /^icon @ DUANE$/}, {map: 'F', draw: /^label DUANE /}]},
		{id: 'waypoints', find: [{map: 'F', draw: /^icon @ (?!DUANE$)/, many: true}, {map: 'F', draw: /^label (?!DUANE )/, many: true}]},
		{id: 'aircraft', find: {map: 'F', draw: /^icon # /}},
	],
});
