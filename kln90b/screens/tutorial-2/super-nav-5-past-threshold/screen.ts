import {defineScreen} from '../../../generator/api.ts';
import {superNav5PastThreshold, tut2Boot} from '../../shared/tut2.ts';

// 1 NM past the threshold of runway 32L, the MAP, which stays the active waypoint
defineScreen(import.meta.url, {
	title: 'Super NAV 5 past the threshold of runway 32L',
	show: 'both',
	boot: tut2Boot,
	steps: superNav5PastThreshold,
	fields: [
		{id: 'distance', find: {re: /\d+\.\d È/, area: 'F', row: 0}},
		{id: 'ident', find: {re: /RW32L\S*/, area: 'F', row: 1}},
		{id: 'mode', find: {re: /\S-Ë/, area: 'F', row: 2}},
		{id: 'groundspeed', find: {re: /\d+ É/, area: 'F', row: 3}},
		{id: 'xtk', find: {re: /\S+NM\S/, area: 'F', row: 4}},
		{id: 'dtk', find: {re: /Ó\d{3}°/, area: 'F', row: 5}},
		{id: 'track', find: {re: /Ö\d{3}°/, area: 'F', row: 6}},
		{id: 'range', find: {re: /\d+(?= *$)/, area: 'F', row: 6}},
		{id: 'active-leg', find: {map: 'F', draw: /^arrow DUANE 47.5168,-122.2911$/}},
		{id: 'legs', find: {map: 'F', draw: /^line /, many: true}},
		{id: 'active-waypoint', find: [{map: 'F', draw: /^icon @ 47.5168,-122.2911$/}, {map: 'F', draw: /^label RW32L /}]},
		{id: 'waypoints', find: [{map: 'F', draw: /^icon @ (?!47.5168,-122.2911$)/, many: true}, {map: 'F', draw: /^label (?!RW32L )/, many: true}]},
		{id: 'aircraft', find: {map: 'F', draw: /^icon # /}},
	],
});
