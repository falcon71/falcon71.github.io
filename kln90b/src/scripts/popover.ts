/**
 * The one help window of the page, shared by the field explanations of the screens and the term tooltips.
 *
 * Pointing at an element shows it, moving away hides it. A click or tap pins it to the element, so it stays open
 * (that is how it works on touch screens) until the reader clicks elsewhere or presses Escape.
 */

let popover: HTMLDivElement | null = null;
let anchor: HTMLElement | null = null;
let pinned = false;

function element(): HTMLDivElement {
	if (!popover) {
		popover = document.createElement('div');
		popover.className = 'kln-popover';
		popover.id = 'kln-popover';
		popover.setAttribute('role', 'tooltip');
		popover.hidden = true;
		document.body.append(popover);

		document.addEventListener('click', (e) => {
			if (pinned && anchor && !anchor.contains(e.target as Node)) hidePopover();
		});
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') hidePopover();
		});
	}
	return popover;
}

export interface PopoverOptions {
	pin?: boolean;
	/** Wider window for field explanations, narrower for terms */
	wide?: boolean;
	/** Where to open when there is room; the field help opens below, so the row being read stays visible */
	prefer?: 'above' | 'below';
}

export function showPopover(target: HTMLElement, content: Node[], options: PopoverOptions = {}) {
	const p = element();
	anchor?.removeAttribute('aria-describedby');
	anchor = target;
	pinned = options.pin ?? false;
	p.replaceChildren(...content);
	p.classList.toggle('kln-popover-wide', options.wide ?? false);
	p.hidden = false;
	target.setAttribute('aria-describedby', p.id);

	const r = target.getBoundingClientRect();
	const viewportWidth = document.documentElement.clientWidth;
	const width = p.offsetWidth;
	const height = p.offsetHeight;
	const left = Math.min(Math.max(8, r.left + r.width / 2 - width / 2), viewportWidth - width - 8);
	const fitsBelow = r.bottom + 8 + height < innerHeight;
	const fitsAbove = r.top - 8 - height > 0;
	const below = options.prefer === 'below' ? fitsBelow || !fitsAbove : !fitsAbove;
	const top = below ? r.bottom + 8 : r.top - height - 8;
	p.style.left = `${left + scrollX}px`;
	p.style.top = `${top + scrollY}px`;
}

/** Hides the window. With a target, only if the window belongs to that element and is not pinned. */
export function hidePopover(target?: HTMLElement) {
	if (target && (target !== anchor || pinned)) return;
	anchor?.removeAttribute('aria-describedby');
	anchor = null;
	pinned = false;
	if (popover) popover.hidden = true;
}

export function isPinnedTo(target: HTMLElement): boolean {
	return pinned && anchor === target;
}

/**
 * Wires an element: point at it or focus it to show, move away or blur to hide, click or tap to pin.
 * Returns nothing; onPin runs when the reader pins the window (e.g. to put a link in the address bar).
 */
export function attachPopover(
	target: HTMLElement,
	content: () => Node[],
	options: Omit<PopoverOptions, 'pin'> = {},
	onPin?: () => void,
) {
	target.addEventListener('mouseenter', () => {
		if (!isPinnedTo(target)) showPopover(target, content(), options);
	});
	target.addEventListener('mouseleave', () => hidePopover(target));
	target.addEventListener('focus', () => {
		if (!isPinnedTo(target)) showPopover(target, content(), options);
	});
	target.addEventListener('blur', () => hidePopover(target));

	const toggle = () => {
		if (isPinnedTo(target)) {
			hidePopover();
		} else {
			showPopover(target, content(), { ...options, pin: true });
			onPin?.();
		}
	};
	target.addEventListener('click', toggle);
	target.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggle();
		}
	});
}
