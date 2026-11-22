import {defineScreen} from '../../../generator/api.ts';
import {superNav5Descent, tut2Boot} from '../../shared/tut2.ts';

// 4 NM before COVOG on the vertical path
defineScreen(import.meta.url, {
	title: 'Super NAV 5 on the descent to COVOG',
	show: 'both',
	boot: tut2Boot,
	steps: superNav5Descent,
	fields: [
		{id: 'distance', find: {re: /\d+\.\d È/, area: 'F', row: 0}},
		{id: 'ident', find: {re: /COVOG\S*/, area: 'F', row: 1}},
		{id: 'mode', find: {re: /\S-Ë/, area: 'F', row: 2}},
		{id: 'groundspeed', find: {re: /\d+ É/, area: 'F', row: 3}},
		{id: 'vnav', find: {re: /V \d+/, area: 'F', row: 4}},
		{id: 'dtk', find: {re: /Ó\d{3}°/, area: 'F', row: 5}},
		{id: 'track', find: {re: /Ö\d{3}°/, area: 'F', row: 6}},
		{id: 'range', find: {re: /\d+(?= *$)/, area: 'F', row: 6}},
		{id: 'active-leg', find: {map: 'F', draw: /^arrow HUMPP COVOG$/}},
		{id: 'legs', find: {map: 'F', draw: /^line /, many: true}},
		{id: 'active-waypoint', find: [{map: 'F', draw: /^icon @ COVOG$/}, {map: 'F', draw: /^label COVOG /}]},
		{id: 'waypoints', find: [{map: 'F', draw: /^icon @ (?!COVOG$)/, many: true}, {map: 'F', draw: /^label (?!COVOG )/, many: true}]},
		{id: 'aircraft', find: {map: 'F', draw: /^icon # /}},
	],
});
