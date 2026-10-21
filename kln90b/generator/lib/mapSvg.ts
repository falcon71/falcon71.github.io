// The maps of NAV 5 and APT 3 are canvases, which the text capture skips. They are written as SVG, one path per row.

/**
 * An SVG of a map, one pixel per character.
 * @param blocks rows of `#` (lit) and `.` (dark), the output of `downsampled(canvasToAscii(canvas))`; a half page map is
 * 99 x 78. Rows are separated by LF or CRLF, a trailing line break is ignored.
 * @returns an inline SVG in the color of its parent (`currentColor`) with a `<path>` for each row that has lit pixels
 * and one `M x y h w v1 h-w z` for each run of lit pixels in it, so that a diff shows which rows of the map changed
 * @throws Error for an empty map, rows of different length and a character that is not `#` or `.`
 */
export function blocksToSvg(blocks: string): string {
	const rows = blocks.replace(/\r?\n$/, '').split(/\r?\n/);
	const width = rows[0].length;
	if (width === 0) throw new Error('the map is empty');
	const paths: string[] = [];
	rows.forEach((row, y) => {
		if (row.length !== width) throw new Error(`map row ${y + 1} has ${row.length} pixels, row 1 has ${width}`);
		const bad = row.match(/[^#.]/);
		if (bad) throw new Error(`map row ${y + 1} has "${bad[0]}", only # and . are pixels`);
		const runs = Array.from(row.matchAll(/#+/g), m => `M${m.index} ${y}h${m[0].length}v1h-${m[0].length}z`);
		if (runs.length > 0) paths.push(`<path d="${runs.join('')}"/>`);
	});
	const open = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${rows.length}" width="${width}" height="${rows.length}" shape-rendering="crispEdges" fill="currentColor">`;
	return [open, ...paths, '</svg>'].join('\n') + '\n';
}
