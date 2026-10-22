// The map pixels of a map canvas. The unit draws its maps on a canvas four times the size of the map (ZOOM_FACTOR in
// the kln90b data/Constants.ts) and shows the canvas itself. Its lines and icons fill whole blocks of 4 x 4 canvas
// pixels, but the map font draws every row of a label one canvas row below the label's block (textBaseline top), so a
// stroke of a letter covers three rows of one block and one row of the next.

const BLOCK = 4;

/**
 * Turns the canvas into map pixels: a block of 4 x 4 canvas pixels is lit when at least half of its pixels are. That
 * keeps every line and icon and draws each stroke of a label one map pixel thick, as the pilot sees it on the unit;
 * lighting a block for any lit pixel would make the overhanging row of a stroke a second map pixel. A block cut off at
 * the right or bottom edge counts the pixels it has.
 * @param ascii the canvas as rows of `#` (lit) and `.` (dark), as canvasToAscii of the kln90b harness gives it
 * @return the map as rows of `#` and `.`, each row ending in a line break
 */
export function mapBlocks(ascii: string): string {
	const rows = ascii.replace(/\n$/, '').split('\n');
	const out: string[] = [];
	for (let y = 0; y < rows.length; y += BLOCK) {
		let line = '';
		for (let x = 0; x < rows[y].length; x += BLOCK) {
			let lit = 0;
			let all = 0;
			for (const row of rows.slice(y, y + BLOCK)) {
				const cells = row.slice(x, x + BLOCK);
				all += cells.length;
				for (const cell of cells) if (cell === '#') lit++;
			}
			line += 2 * lit >= all ? '#' : '.';
		}
		out.push(line);
	}
	return out.join('\n') + '\n';
}
