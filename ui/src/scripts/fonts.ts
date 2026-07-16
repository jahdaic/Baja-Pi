// The custom @font-face families declared in css/style.css.
//
// canvas-gauges draws its text to a <canvas> once, using whatever font is
// loaded at draw time. A font the browser hasn't downloaded yet (it lazy-loads
// them on first use) therefore renders as a fallback and never corrects until
// the gauge happens to re-render — e.g. Cyberpunk's "Brave81" looks wrong until
// you switch gauges and come back. Preloading them all before the first render
// guarantees every theme paints with the right font from the start.
const FONT_FAMILIES = ['LCD', 'Brave81', 'Bebas Neue', 'Pixel Operator'];

/**
 * Force every custom font to download, resolving once they're all ready — or
 * after `timeoutMs`, so a slow or missing font can never block boot forever.
 */
export const preloadFonts = (timeoutMs = 3000): Promise<void> => {
	if (typeof document === 'undefined' || !document.fonts) return Promise.resolve();

	const loaded = Promise.all(
		FONT_FAMILIES.map(family => document.fonts.load(`1em "${family}"`).catch(() => undefined)),
	).then(() => undefined);

	const timeout = new Promise<void>(resolve => setTimeout(resolve, timeoutMs));

	return Promise.race([loaded, timeout]);
};
