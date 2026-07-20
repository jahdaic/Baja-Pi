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

## Map view

**TODO #13** · ⬜

**Goal** — A live map centered on the vehicle for offroad/backcountry driving, fully offline (no connectivity in the field). This is a Baja — the map matters most *off*-road, so the emphasis is trails, terrain, and where you're legally allowed to drive, not paved streets.

**Approach — topographic, built as a stack of overlays, not satellite and not one basemap.** That's the recipe every serious offroad app (onX, Gaia) uses, and every layer has a free, self-hostable US-government equivalent that's legal to bundle offline:

| Layer | Source | License | Format |
|---|---|---|---|
| Base (roads/water/labels) | OpenStreetMap via **Protomaps** basemap or **Planetiler** | ODbL (must show OSM attribution) | PMTiles / MBTiles |
| **Trails / OHV** | **USFS MVUM** + OSM `highway=track` | CC0 public domain / ODbL | Shapefile, ArcGIS REST → vector tiles |
| **Terrain relief** | **USGS 3DEP** DEM → hillshade + contours | US public domain | GeoTIFF → terrain-RGB / vector |
| **Land ownership** | **PAD-US 4.1** (+ BLM GBP) | US public domain | Geodatabase/Shapefile → vector |

All four render together in **MapLibre GL** (already the plan) from **PMTiles** files served straight off `gps-server` — no tile server, no connectivity.

**Why these layers** — USFS **MVUM** is the standout: the authoritative *legal* answer to "can I drive this trail, in this vehicle, right now" — per-vehicle-class permissions (`FourWD_GT50inches`, ATV, Motorcycle…) each with a seasonal `DatesOpen` field, under 36 CFR 212.56, and it's **CC0**. It's the exact data the paid apps license. **PAD-US** gives public-vs-private / agency boundaries. **3DEP** drives contours/hillshade/slope-shading. Satellite is optional as a hybrid tint, not the primary layer.

**Rendering on the Pi** — MapLibre reads PMTiles directly via a protocol handler (static files, no server). `maplibre-contour` (BSD-3) can generate contours *client-side at runtime* from raster-DEM tiles (terrain-RGB/Terrarium), in a web worker with caching — attractive since it avoids storing separate contour tiles, but **watch CPU on the Zero 3W**; pre-baked contour vector tiles are the lower-CPU fallback. `nst-guide/terrain` (MIT) is a ready-made GDAL+tippecanoe pipeline for hillshade/contour/Terrain-RGB/slope tiles (its slope colors mirror CalTopo).

**Tooling pipeline** (do all tiling on a dev machine; the Pi only serves/renders): OSM extract → Planetiler/Protomaps → `base.pmtiles`; MVUM+OSM tracks → tippecanoe → `trails.pmtiles`; 3DEP GeoTIFF → GDAL (`gdaldem`/`gdal_contour`) + `rio rgbify` → `terrain-rgb.pmtiles`; PAD-US/BLM → `ogr2ogr`+tippecanoe → `landown.pmtiles`. All free/OSS.

**Storage** — Vector overlays are tiny; DEM terrain dominates. Per-state ballpark: OSM base ~0.2–1 GB, overlays tens of MB, 3DEP terrain-RGB ~1–3 GB → **a single state fits in ~2–4 GB**; a few states still leave tons of room on the 58 GB card. **Pre-clip everything to a bounding box of the driving region — do not bundle CONUS.**

**Issues & gotchas** —
- `tracktype` grades *surface firmness, not 4x4 difficulty* — combine with `surface`/`smoothness`/`4wd_only`/`sac_scale`, don't rely on it alone.
- USGS 3DEP 1/3 arc-second (~10 m) is seamless for the lower-48 but **partial/coarser for Alaska & territories** — fine for CONUS offroading, check the region if further north.
- MVUM freshness is **per-forest** — only as current as each unit's last publish.
- ODbL requires on-screen **OSM attribution** for the OSM/Protomaps base.

**Notes** — Depends on the `gps` slice (lat/lon/heading) and the signal-lost state from #2 (fall back gracefully when there's no fix). Full cited research report captured during planning. Commercial-app benchmark: onX (650k+ mi trail DB, per-vehicle filtering) and Gaia (10-layer stacking, Overland basemap) — both assume a *plan-at-home-over-WiFi, navigate-offline* workflow, exactly our constraint.

## Power-loss protection (PiSugar UPS)

**TODO #14** · ⬜

**Goal** — Survive ignition-off without SD corruption or data loss. The car cuts power the instant the ignition turns off, and the root fs runs `commit=600` (up to a 10-min RAM-only write window) plus `data=writeback`, so a hard cut can lose/garble recent writes. Add a UPS that holds power long enough to shut down gracefully, then auto-boots when the car restarts.

**Hardware — PiSugar 3 (Pi-Zero UPS), confirmed compatible.** The Orange Pi Zero 3W is the Raspberry Pi Zero form factor (30×65 mm), the mounting holes line up (verified — a USB hub already mounts underneath and the AD HAT on top), and the GPIO power pins match RPi. PiSugar's pogo pins contact the **underside GPIO solder points** (5V/GND) — they don't need Pi-specific pads — and it sits *under* the board without occupying the 40-pin header, so it coexists with a top HAT (#8). "Auto power on when external power restored" is **on by default**, so the board reboots on ignition-on with no extra work — the effort is entirely on the clean-*shutdown* side.

**Approach — a PM2-managed Python daemon** (matches the "everything under PM2" architecture) polling the PiSugar over I²C:

```
poll power-good every ~5s
  external present → reset timer
  external absent  → accumulate timer
    absent ≥ 60s            → schedule PiSugar output-cut (reg 0x09), then `poweroff`
    absent AND battery low  → shut down immediately (skip the 60s wait)
```

**Issues & gotchas** —
- **Must pair `poweroff` with the PiSugar output-cut**, or the trap bites: a bare `poweroff` leaves the PiSugar still feeding 5V → the SoC halts but never sees a power cycle → it will **not** auto-boot when the car restarts. Before halting, write the **`0x09` shutdown-countdown register** so the PiSugar drops its own output a few seconds after the Pi goes down. This register is **not** exposed in PiSugar's WebUI — it needs a direct I²C write, which the daemon does via `smbus`. (So the one daemon solves both detection *and* the output-cut.)
- **60s debounce also rides out engine crank** — starting the car dips/cuts accessory power briefly; the sustained-60s requirement ignores crank + momentary brownouts and only acts on a real ignition-off.
- **Battery-low failsafe bypasses the timer** — if external power is gone *and* the pack is critically low, shut down now rather than risk a hard cut mid-countdown.
- **Permissions** — under PM2 as `orangepi` the daemon needs I²C access (`i2c` group / `/dev/i2c-N`) and a scoped sudoers rule for `poweroff`.

**Notes** — Confirm on real hardware before trusting it in the car: the **Orange Pi I²C bus number** (differs from RPi — find with `i2cdetect`), the **PiSugar 3 address (`0x57`)**, and the exact **power-good register/bit** — all from the [PiSugar 3 I²C datasheet](https://github.com/PiSugar/PiSugar/wiki/PiSugar-3-I2C-Datasheet). Related: the SD-hardening notes (commit window, `data=writeback`, disabled auto-fsck) and that #12 (persist app state) needs an explicit flush to survive a cut. A UPS is the real fix; #12's flush is the cheap partial one.
