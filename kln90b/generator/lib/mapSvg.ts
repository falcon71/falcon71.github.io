// The maps of NAV 5 and APT 3 are canvases, which the text capture skips. They are written as SVG, one group per element
// the unit drew, so that a diff shows which element changed and the site can explain each one.

/** One element of a map: the field it belongs to, its description and the map pixels it lit, as [x, y]. */
export interface MapGroup {
	field: string;
	draw: string;
	pixels: readonly (readonly [number, number])[];
}

function escaped(text: string): string {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** The rows of a group, one `<path>` for each row with pixels and one `M x y h w v1 h-w z` for each run of pixels in it. */
function pathsOf(pixels: readonly (readonly [number, number])[]): string[] {
	const rows = new Map<number, number[]>();
	for (const [x, y] of pixels) {
		const row = rows.get(y);
		if (row) row.push(x); else rows.set(y, [x]);
	}
	return Array.from(rows.keys()).sort((a, b) => a - b).map(y => {
		const xs = rows.get(y)!.sort((a, b) => a - b);
		const runs: string[] = [];
		for (let i = 0; i < xs.length;) {
			let end = i + 1;
			while (end < xs.length && xs[end] === xs[end - 1] + 1) end++;
			const length = end - i;
			runs.push(`M${xs[i]} ${y}h${length}v1h-${length}z`);
			i = end;
		}
		return `<path d="${runs.join('')}"/>`;
	});
}

/**
 * An SVG of a map, one pixel per map pixel (block of 4 canvas pixels).
 * @param width the size of the map in map pixels; a half page map is 99 x 78
 * @param groups the elements in drawing order
 * @returns an inline SVG in the color of its parent (`currentColor`) with a
 * `<g data-field="<field>" data-draw="<description>" data-box="<x> <y> <w> <h>">` for each element, in order, which holds
 * the element's pixels as rows of runs (see pathsOf); `data-box` is the bounding box of its pixels
 * @throws Error for an empty map, a pixel outside the map, a pixel of two groups and a group without pixels
 */
export function mapToSvg(width: number, height: number, groups: MapGroup[]): string {
	if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
		throw new Error(`the map size ${width} x ${height} is empty or not whole pixels`);
	}
	const owner = new Map<number, string>();
	const lines: string[] = [];
	for (const g of groups) {
		if (g.pixels.length === 0) throw new Error(`the map element "${g.draw}" has no pixels`);
		for (const [x, y] of g.pixels) {
			if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || x >= width || y < 0 || y >= height) {
				throw new Error(`the map element "${g.draw}" has the pixel ${x},${y}, which is outside the ${width} x ${height} map`);
			}
			const other = owner.get(y * width + x);
			if (other !== undefined) throw new Error(`the pixel ${x},${y} belongs to the map elements "${other}" and "${g.draw}"`);
			owner.set(y * width + x, g.draw);
		}
		const xs = g.pixels.map(p => p[0]);
		const ys = g.pixels.map(p => p[1]);
		const [left, top] = [Math.min(...xs), Math.min(...ys)];
		const box = `${left} ${top} ${Math.max(...xs) - left + 1} ${Math.max(...ys) - top + 1}`;
		lines.push(`<g data-field="${escaped(g.field)}" data-draw="${escaped(g.draw)}" data-box="${box}">`, ...pathsOf(g.pixels), '</g>');
	}
	const open = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" shape-rendering="crispEdges" fill="currentColor">`;
	return [open, ...lines, '</svg>'].join('\n') + '\n';
}
