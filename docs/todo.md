# Car Dashboard — TODO / Pending Work

Running backlog for the `~/Baja` monorepo. Newest context at top of each section. Keep statuses
current as work lands. See `car-dashboard-architecture.md` for the target layout and
`car-dashboard-project.md` for overall direction.

**Status legend:** `Pending` (not started) · `In Progress` · `Blocked` · `Deferred` (intentionally
later) · `Done`.
**Priority:** `P1` (next up) · `P2` (soon) · `P3` (nice-to-have / someday).

---

## Pending

| # | Topic | Component | Description | Priority | Status | Notes |
|---|---|---|---|---|---|---|
| 1 | Get a position fix | GPS | gpsd + u-blox 8 are up under PM2 and reading NMEA, but `mode:1` (no fix) indoors. Confirm a real 2D/3D fix (lat/lon/speed) with sky view. | P1 | Pending | Hardware/data path fully proven; just needs the receiver to see satellites. Use `cgps` or `gpspipe -w` to watch `mode` go to 2/3. |
| 2 | WebSocket push | GPS + UI | Replaced HTTP polling with a WebSocket: `gps-server` broadcasts each gpsd TPV on arrival; `GPS.tsx` consumes it with reconnect/backoff and ref-based cleanup. Also fixed the same-box server URL (`orangepi.local` never resolved → `localhost`) and a StrictMode double-connect. | P3 | Done | Verified: one persistent connection, live push. Smoothness follow-up in #18. |
| 3 | package.json metadata cleanup | GPS | Cleaned `gps/package.json` — renamed to `baja-gps`, set `private`, dropped the old repo's homepage/bugs/repository/funding, license set to `CC-BY-SA-4.0`. | P2 | Done | — |
| 4 | GPS README rewrite | GPS | Rewrote `gps/README.md` for the monorepo GPS subsystem (gpsd bridge, HTTP + WebSocket, freshness fields, run/setup). | P2 | Done | — |
| 5 | Monorepo LICENSE decision | Repo | Resolved: moved the UI's CC BY-SA 4.0 license to the repo root as `LICENSE` (single project license). | P3 | Done | CC BY-SA is content-oriented; revisit if a software-specific license is preferred. |
| 6 | `git init` the monorepo | Repo | Done via the monorepo re-root — `~/Baja` is the `Baja-Pi` git repo (history preserved), root `.gitignore` in place, pushing to GitHub. | P2 | Done | Achieved by re-rooting the existing repo rather than a fresh init. |
| 7 | pm2 ecosystem config | Repo / Ops | Root `ecosystem.config.cjs` runs `gpsd` + `gps-server` (`:8000`) + `ui-vite` (`:5173`) + `chromium-kiosk`, all `pm2 save`d and cold-boot verified. | P2 | Done | Later optional: swap `ui-vite` for a static `dist/` server once the kiosk is finalized. |
| 12 | GPS device hotplug re-add | GPS / Ops | Added a udev rule (`scripts/gps-hotplug/`, installed to `/etc/udev/rules.d/`) that runs `gpsdctl add`/`remove` against the pm2 gpsd's control socket (`/run/user/1000/gpsd.sock`) on u-blox plug/unplug, re-attaching the same by-id device with no gpsd restart. | P3 | Done | Match validated via `udevadm test` + a live idempotent `gpsdctl add`. A physical unplug/replug test is still worth doing (couldn't, with the antenna deployed for acquisition). |
| 13 | Weather via NWS API | UI | Reimplemented the weather layer against keyless NWS (`api.weather.gov`) + Open-Meteo (UV, snow) + local `suncalc` (sun times). New `scripts/weather.ts` reshapes to the existing `IWeather`/forecast contract with an NWS→OWM icon-code map; also stores snow, sunrise, city, and IANA timezone. Verified live on Current + Forecast pages. | P2 | Done | 1:1 replacement; no consumer components changed. See #17 for the timezone display follow-up. |
| 17 | Location-aware time display | UI | Times now render in the location's zone (`weather.timezone`, IANA from NWS) instead of device-local: added `Utility.getZonedDate` + a `timeZone` arg on `toTimeDisplay`, wired into the Time-page clock (Analog + Calendar), sunset (Current), forecast hours (Forecast), alert times (Alerts), and the Beetle13 clock. Falls back to device-local until a zone is known. | P3 | Done | Verified the tz math (Pacific/Tokyo shifts) + the analog clock renders; follows the vehicle across zones. |
| 18 | Increase GPS update rate | GPS | The u-blox defaults to 1 Hz, so the speedometer needle only gets a new value once per second (the gauge tweens between them). Now that GPS is pushed over WebSocket, bump the receiver's rate (e.g. 5–10 Hz via a UBX-CFG-RATE message / gpsd config) for a genuinely smoother real-time needle. | P3 | Pending | Enabled by the WebSocket push (no HTTP-poll ceiling). Verify the u-blox 8 supports the desired rate and gpsd forwards it. |
| 14 | ESLint for Vite | UI | Re-added ESLint (flat config, `typescript-eslint` + the two classic `react-hooks` rules) with a `lint` script; new code passes clean. | P3 | Done | ~30 pre-existing findings surfaced for incremental cleanup; see `ui-audit.md`. |
| 15 | Rotate OpenWeather key | Repo / Security | The exposed `VITE_OPEN_WEATHER_API_KEY` (committed to the public Baja-Pi repo's history via `ui/.env`) was rotated/revoked, so the leaked key is now dead. | P2 | Done | `.env` is still tracked but no longer holds a live secret; untracking it is optional cleanup. |
| 16 | Custom boot & shutdown UX | Ops | Customize the boot and shutdown experience so the device feels like an appliance, not a Linux box: quiet/branded boot (suppress kernel + console text, Plymouth splash or boot logo), ideally a splash held until the dashboard is up, and a clean branded shutdown/power-off sequence. | P3 | Pending | Pairs with the boot-to-dashboard flow (kiosk already autostarts via pm2). |
| 8 | Chromium kiosk | UI | `ui/bin/chromium-kiosk` launcher added and wired as the `chromium-kiosk` pm2 app (waits for X + the UI server, then opens Chromium fullscreen on the LCD). Autostarts on boot. | P2 | Done | Kiosk hardening (cursor hide via `unclutter`, crash-recovery tuning) can come later. |
| 9 | Speedometer page | UI | Speedometer is up and rendering under the kiosk, fed live from the GPS server (now via WebSocket). | P1 | Done | The "signal lost" indicator is split out to #19. |
| 19 | GPS "signal lost" indicator | GPS + UI | The gps-server reports `stale`/`age`, but the UI doesn't surface it — a lost fix currently looks live. Add a store field + an on-screen "signal lost" indication. | P3 | Pending | Visual element; deferred under the no-visual-changes rule during the audit. Audit finding §2. |
| 10 | Regenerate HTTPS certs (if ever needed) | GPS | HTTPS was dropped for localhost. If HTTPS is ever reintroduced, regenerate certs rather than reusing the old checked-in `localhost.key`/`localhost.cert` (now deleted). | P3 | Deferred | Likely unnecessary — localhost HTTP is fine for Chromium. |
| 11 | Voice subsystem | Voice | Wake-word + STT + intent/Discord routing. Placeholder `voice/` only for now. | P3 | Deferred | Substantial; warrants its own planning session. Check in with user before starting. |

---

## Recurring / Maintenance

| Topic | Description | Trigger |
|---|---|---|
| Re-apply display fix | Re-run `scripts/car-display-fix/install.sh` — a kernel `apt upgrade` rewrites the board DTB and drops the `force-output` edit (undoes the display fix and can bring back the CPU-pegging HPD storm). The HPD systemd service and Xorg snippet survive updates on their own. | After any `apt upgrade` of `linux-image-current-sun60iw2`. |

---

## Recently done

| Topic | Description | Date |
|---|---|---|
| CPU storm fixed | Root-caused all-cores-100% to HDMI HPD flapping → `xfsettingsd` spawning an `xfce4-display-settings` swarm. Applied `scripts/car-display-fix/install.sh`; verified calm across reboot. Documented in `car-dashboard-display-fix.md` §3f. | 2026-07-13 |
| GPS git cleanup | Removed the nested standalone `gps/.git`, folded `.gitignore` up to the repo root, dropped the per-subsystem `LICENSE`. | 2026-07-13 |
| GPS HTTP-only + staleness | Moved script to `gps/src/server.js`; removed HTTPS + cert files; port via `PORT` env; added `receivedAt`/`age`/`stale` (>5s) fields. Smoke-tested on `:8000`. | 2026-07-13 |
| PM2 installed | `pm2` 7.0.3 installed globally; daemon runs as `orangepi`. All project processes will live under it. | 2026-07-13 |
| gpsd under PM2 | Installed `gpsd`/`gpsd-clients`; masked the systemd `gpsd.socket`/`gpsd.service`; added `gpsd` to root `ecosystem.config.cjs` (foreground `-N`, control socket, u-blox by-id device). Enabled linger; `pm2 save` + `pm2 startup` for boot autostart. Verified end-to-end: node server reads a TPV with `stale:false`. | 2026-07-13 |
| Monorepo re-root | Relocated the Baja-Pi git repo to `~/Baja`; moved the app under `ui/` (history preserved via renames); brought gps/docs/scripts/ecosystem into the repo. Committed. | 2026-07-13 |
| UI: CRA → Vite | Migrated Create React App → Vite 5 + plugin-react-swc + TS 5. Env `REACT_APP_*`→`VITE_*`, new `index.html`/`vite.config.ts`/`tsconfig`, dropped tests + committed `build/`, repointed canvas-gauges to https. Weather (`openweather-api-node`) excluded → NWS TODO (#13). Verified `vite build` (2307 modules) + dev server. | 2026-07-13 |
| Boot-to-dashboard under pm2 | Added `ui-vite` (Vite dev server on `:5173`) and `chromium-kiosk` (`ui/bin/chromium-kiosk` → fullscreen Chromium on the LCD) to `ecosystem.config.cjs`. Full chain gpsd → gps-server → ui-vite → kiosk now autostarts on boot via `pm2 save`. Cold-boot verified: device comes straight up into the dashboard. | 2026-07-14 |
| Weather → NWS | Ported weather off OpenWeather to keyless NWS + Open-Meteo + local `suncalc`; verified live on the panel. Pi timezone set to `America/New_York`. (#13) | 2026-07-14 |
| UI audit + foundation hardening | 4-dimension code audit (`ui-audit.md`). Landed: error boundary, validated `config.ts` (no more `Array(NaN)` crash), canvas-gauge redraw-storm fix, Alerts timer-leak fix, weather hardening, `themeIndices` sizing. Removed the CRA counter, untracked `.env` (+ `.env.example`), re-added ESLint. All verified, no visual changes. | 2026-07-14 |
| GPS over WebSocket | `gps-server` now pushes each TPV over WS (HTTP kept as fallback); `GPS.tsx` consumes it with reconnect/backoff. Fixed the `orangepi.local`→`localhost` URL (never resolved on-device) and a StrictMode double-connect. (#2) | 2026-07-14 |
| GPS hotplug re-add | Added `scripts/gps-hotplug/` udev rule → `gpsdctl add`/`remove` on the pm2 gpsd's control socket, so the u-blox re-attaches on replug without a gpsd restart. Validated via `udevadm test` + live idempotent add. (#12) | 2026-07-14 |
