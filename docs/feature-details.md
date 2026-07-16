# Baja Pi — Feature Details

Long-form companion to [`todo.md`](todo.md). The TODO table stays skimmable; anything that
needs more than a one-line note lives here — design detail, decisions and trade-offs, issues
hit during development, and notes worth keeping for the future.

## How to use

- One `##` section per item, titled to match its TODO **Item** name (gives it a stable anchor).
- Link to it from the TODO's **Notes** column, e.g. `[details](feature-details.md#page--theme-registry)`.
- Keep only the parts of the template that are useful; drop the rest.

**Entry template**

```md
## <Item name>

**TODO #<n>** · <⬜ / 🚧 / ✅>

**Goal** — what we're building and why.

**Approach** — key decisions, trade-offs, the chosen path.

**Issues & gotchas** — problems hit during development and how they were resolved or worked around.

**Notes** — references, config values, follow-ups worth remembering.
```

---

## Waveshare AD HAT (vehicle sensors)

**TODO #8** · ⬜

**Goal** — Feed real vehicle signals into the dashboard so gauges show live data instead of the test loop.

**Approach** — Waveshare AD HAT (ADC over SPI — confirm the exact model, most likely the High-Precision ADS1256). Phase it:

- **Phase 1 — indicator lights:** turn signals, alternator light, oil warning light. These are on/off ~12 V signals; read as thresholded voltages (or via GPIO), level-shifted / opto-isolated down to the Pi's 3.3 V. Map to boolean store fields (`turnSignal` exists; add `alternator` / `oilWarning`).
- **Phase 2 — analog sensors:** voltage, oil pressure, oil temp → analog levels straight through the ADC into `voltage` / `oilPressure` / `oilTemperature`. RPM is a frequency/pulse (tach) signal, not a plain ADC read — handle separately.

**Issues & gotchas** — The car is 12 V; never wire it into the Pi/HAT without level shifting or optocouplers. Pin down the exact Waveshare board + its SPI driver before wiring.

**Notes** — Feeds the `vehicle` slice (TODO #4). The store already has `fuel` / `oilTemperature` / `oilPressure` / `voltage` / `turnSignal` / `headlights` / `checkEngine`, currently driven only by the test incrementer in `Controls.tsx`.

## Fonts don't load on first gauge

**TODO #9** · ✅

**Goal** — Fix custom fonts not applying the first time a theme is shown.

**Root cause** — Not just the boot gauge — it hits *any* theme whose font hasn't downloaded yet. Browsers lazy-load `@font-face` fonts on first use, and `canvas-gauges` draws its text to a `<canvas>` once, using whatever font is loaded at draw time. So a theme like Cyberpunk (font `Brave81`) paints with a fallback and never corrects until the gauge re-renders (switch away and back). All four families (`LCD`, `Brave81`, `Bebas Neue`, `Pixel Operator`) are declared in `css/style.css`, which loads at startup.

**Fix** — `ui/src/scripts/fonts.ts` → `preloadFonts()` force-loads every family via `document.fonts.load()`; `index.tsx` awaits it before the first `root.render()`, with a 3s timeout so a slow/missing font can't block boot. Every theme now paints with the right font from the start.

**Verified** — Fresh boot → navigated straight to Cyberpunk: correct `Brave81` font on the first visit, identical after away-and-back (previously it showed a fallback until you switched gauges).

**Notes** — Fonts live in `ui/src/fonts/`; `@font-face` decls are in `ui/src/css/style.css`. Reproduce only against a real cold boot — a warm dev browser caches fonts and won't show the bug.

## Long-press control menu

**TODO #10** · ⬜

**Goal** — A long-press (touch) opens an on-screen menu for appliance-style control with no keyboard: Reboot Pi · Close Chromium · Restart Chromium.

**Approach** — The dashboard is a sandboxed web page and can't reboot or drive pm2 directly. Add a small **localhost-only control endpoint** (extra routes on `gps-server`, or a tiny dedicated service) that the UI calls:

- **Reboot** → `sudo reboot` (scoped sudoers rule for the pm2 user).
- **Close Chromium** → `pm2 stop chromium-kiosk` (drops to the desktop).
- **Restart Chromium** → `pm2 restart chromium-kiosk` (fresh reload).

**Issues & gotchas** — Bind the endpoint to `127.0.0.1` only. Once "Close Chromium" runs the UI is gone, so it can't be reopened from the menu (needs the desktop / keyboard) — expected.

**Notes** — The long-press gesture pairs with the swipe work (TODO #7).

## g3 gauge

**TODO #11** · ✅

**Goal** — Use `@patricksurry/g3` (D3 SVG gauges) in the dashboard. Delivered two components: `G3Gauge` (a generic live radial gauge) and `G3Speedmaster` (the Omega Speedmaster contrib gauge reskinned as a vehicle chronograph).

**Import interop (the hard part)** — g3 is a UMD bundle whose `package.json` sets `"type": "module"`, so bundlers treat it as ESM and expose the API **only as a single default export** (`export default require_g3()`), not named exports and not a global. `import * as g3` gives an empty-ish namespace; `import g3 from …` hit `__esModule` interop and resolved `undefined`. The components resolve it defensively: `namespace.gauge ?? namespace.default ?? window.g3`. Base API lives in `dist/g3.js`; the contrib gauges (incl. `contrib.clocks.omegaSpeedmaster`) in `dist/g3-contrib.js` (a superset bundle). Neither ships types → declared loosely in `src/g3.d.ts`. Uses `d3-scale` (`scaleLinear`) for measures — a direct dep now in `ui/package.json`.

**Live data seam** — g3's `panel` runs its own update loop; by default (no `url`) it pulls each metric from a per-gauge `fake` generator every `interval` ms. So live Redux values are fed via `.fake(() => vRef.current.<field>)` — the needles animate without rebuilding the SVG.

**Speedmaster metric mapping** — main dial minute hand = speed, second hand = RPM, hour hand decoupled onto its own metric (`50 + 10·speed/max`, so only the minute hand tracks speed). Outer ring = RPM (×100, dots at labels + white minor ticks, full-circle band); inner = speed (relative-oriented numbers, layered ticks). Subdials: oil pressure / voltage / oil temp. 3 o'clock window = fuel %. "BAJA PI" replaces the logo; "×100 RPM" curves along the bottom.

**Issues & gotchas** —
- `g3.panel()` starts an internal `setInterval` it never exposes; on a kiosk each theme switch would leak a timer. Both components monkey-patch `window.setInterval` during `panel()` to capture the id and `clearInterval` it on unmount.
- Any ring/sector drawn on a gauge's own measure inherits that gauge's angular range (so a 270° speed sweep leaves a gap at the top). Draw full-circle chrome (bezel, outline, subdial fill, fuel window, ×100 caption) on a separate `domain([0,360]).range([0,360])` gauge.
- `orient`: default is `'fixed'` (counter-rotated upright); `'relative'` follows the dial angle; `'upward'` flips at the extremes. `indicateText` has no `.metric()` — it shows the parent gauge's metric.

**Notes** — On the round 720×720 panel, scale the panel `put()` to `size/201` so the bezel meets the rim. `G3Gauge` is currently unused (Vintage renders `G3Speedmaster`) but kept for reuse.
