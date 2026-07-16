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

**TODO #9** · ⬜

**Goal** — Fix custom fonts not applying on the first gauge shown at boot.

**Approach** — Repro: only the first gauge renders with fallback fonts; switching gauge and back fixes it for good → a first-paint font race (FOUT). The `@font-face` files (LCD, Bebas Neue, Brave81, Pixel Operator…) aren't loaded when the first view paints, and a later re-render picks them up. Fix by loading fonts before first render: `<link rel="preload">` the files and/or `await document.fonts.ready` (or `document.fonts.load(...)`) before mounting; consider a `font-display` value.

**Issues & gotchas** — Verify against a real cold boot — the dev browser caches fonts and won't reproduce it.

**Notes** — Fonts live in `ui/src/fonts/`; `@font-face` decls are in `ui/src/css/*.css` (LCD in `style.css`).

## Long-press control menu

**TODO #10** · ⬜

**Goal** — A long-press (touch) opens an on-screen menu for appliance-style control with no keyboard: Reboot Pi · Close Chromium · Restart Chromium.

**Approach** — The dashboard is a sandboxed web page and can't reboot or drive pm2 directly. Add a small **localhost-only control endpoint** (extra routes on `gps-server`, or a tiny dedicated service) that the UI calls:

- **Reboot** → `sudo reboot` (scoped sudoers rule for the pm2 user).
- **Close Chromium** → `pm2 stop chromium-kiosk` (drops to the desktop).
- **Restart Chromium** → `pm2 restart chromium-kiosk` (fresh reload).

**Issues & gotchas** — Bind the endpoint to `127.0.0.1` only. Once "Close Chromium" runs the UI is gone, so it can't be reopened from the menu (needs the desktop / keyboard) — expected.

**Notes** — The long-press gesture pairs with the swipe work (TODO #7).
