import {defineScreen} from '../../../generator/api.ts';
import {superNav5Armed, tut2Boot} from '../../shared/tut2.ts';

// 2 NM before HUMPP at 10,000 ft: VNAV active, the approach armed, PRESS ALT TO SET BARO unread
defineScreen(import.meta.url, {
	title: 'Super NAV 5 as VNAV becomes active and the approach arms',
	show: 'both',
	keepMessages: true,
	boot: tut2Boot,
	steps: superNav5Armed,
	fields: [
		{id: 'distance', find: {re: /\d+\.\d È/, area: 'F', row: 0}},
		{id: 'ident', find: {re: /HUMPP\S*/, area: 'F', row: 1}},
		{id: 'mode', find: {re: /\S-Ë/, area: 'F', row: 2}},
		{id: 'groundspeed', find: {re: /\d+ É/, area: 'F', row: 3}},
		{id: 'vnav', find: {re: /V \d+/, area: 'F', row: 4}},
		{id: 'msg', find: {re: /msg/, area: 'F', row: 5}},
		{id: 'dtk', find: {re: /Ó\d{3}°/, area: 'F', row: 5}},
		{id: 'track', find: {re: /Ö\d{3}°/, area: 'F', row: 6}},
		{id: 'range', find: {re: /\d+(?= *$)/, area: 'F', row: 6}},
		{id: 'active-leg', find: {map: 'F', draw: /^arrow RADDY HUMPP$/}},
		{id: 'legs', find: {map: 'F', draw: /^line /, many: true}},
		{id: 'active-waypoint', find: [{map: 'F', draw: /^icon @ HUMPP$/}, {map: 'F', draw: /^label HUMPP /}]},
		{id: 'waypoints', find: [{map: 'F', draw: /^icon @ (?!HUMPP$)/, many: true}, {map: 'F', draw: /^label (?!HUMPP )/, many: true}]},
		{id: 'aircraft', find: {map: 'F', draw: /^icon # /}},
	],
});
