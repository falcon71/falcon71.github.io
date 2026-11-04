// Steps that the screens of the APT pages share.
import type {HeadlessUnit} from '../../../vendor/kln90b/test/harness/boot';

/** Enters an identifier on APT 1, which the other APT pages share, and turns the cursor off again. */
export async function showAirport(u: HeadlessUnit, ident: string): Promise<void> {
	await u.panel.selectPage('R', 'APT 1');
	await u.panel.cursor('R');
	await u.panel.enterIdent('R', ident);
	await u.panel.cursor('R');
}

/**
 * Enters an identifier that no airport has, takes the offer to create an airport at the present position and ends on
 * APT 1 of the new airport with the cursor off.
 */
export async function createUserAirport(u: HeadlessUnit, ident: string): Promise<void> {
	await u.panel.selectPage('R', 'APT 1');
	await u.panel.cursor('R');
	await u.panel.enterIdent('R', ident);
	await u.panel.cursorTo('R', 'PRES POS?');
	await u.panel.ent();
}
