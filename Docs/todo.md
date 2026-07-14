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
| 2 | WebSocket push | GPS + UI | Replace the ~500ms client polling with a WebSocket that pushes TPV events the moment gpsd delivers them — smoother speedometer needle, less CPU. Rewrite of both server and client sides. | P3 | Deferred | Explicitly "not v1 material." Do after the polling path is proven end-to-end. |
| 3 | package.json metadata cleanup | GPS | `homepage`/`bugs`/`repository`/`funding` still point at the old `GPSD-Node-Server` GitHub repo; `license` still `GPL-3.0`. Update for the monorepo role. | P2 | Deferred | Fold into the same pass as the README rewrite (#4). |
| 4 | GPS README rewrite | GPS | `GPS/README.md` still describes the old standalone `GPSD-Node-Server`. Rewrite for its role as the monorepo's GPS subsystem. | P2 | Deferred | User asked to wait until more changes land before rewriting. |
| 5 | Monorepo LICENSE decision | Repo | Old per-subsystem `LICENSE` (GNU GPL) was removed. Decide whether the monorepo gets a single root `LICENSE` and which one (GPL carries obligations for the whole project). | P3 | Pending | — |
| 6 | `git init` the monorepo | Repo | `~/Baja` is not yet a git repo. Init fresh (no old history, per architecture doc), verify the folded root `.gitignore` covers all subsystems. | P2 | Pending | `.gitignore` already folded up to repo root. |
| 7 | pm2 ecosystem config | Repo / Ops | Root `ecosystem.config.cjs` has `gpsd` + `gps-server` (`:8000`) + `ui-vite` (Vite dev server on `:5173`), all `pm2 save`d for boot. Still to add: `chromium-kiosk` (#8). Later: swap `ui-vite` for a static `dist/` server once the kiosk is finalized. | P2 | In Progress | Model on Alice's `~/Companion/ecosystem.config.cjs`. |
| 12 | GPS device hotplug re-add | GPS / Ops | gpsd is started with the device on its cmdline; if the u-blox is unplugged/replugged it may not re-attach automatically. Add a udev rule (or gpsdctl-based hook) to re-add via the control socket at `/run/user/1000/gpsd.sock`. | P3 | Pending | Control socket already in place for this. Low priority for a fixed car install where the receiver stays put. |
| 13 | Weather via NWS API | UI | Reimplemented the weather layer against keyless NWS (`api.weather.gov`) + Open-Meteo (UV, snow) + local `suncalc` (sun times). New `scripts/weather.ts` reshapes to the existing `IWeather`/forecast contract with an NWS→OWM icon-code map; also stores snow, sunrise, city, and IANA timezone. Verified live on Current + Forecast pages. | P2 | Done | 1:1 replacement; no consumer components changed. See #17 for the timezone display follow-up. |
| 17 | Location-aware time display | UI | Interim fix applied — Pi timezone set to `America/New_York`, so `toTimeDisplay` (device-local) now renders sunset/hours/clock in Eastern. Remaining: make it follow the vehicle across zones by rendering in `weather.timezone` (IANA, now captured) instead of device-local — covers the Time-page clock plus sunset/forecast/alert times. | P3 | Pending | Only matters when driving out of Eastern; the deferred "location-aware clock" work. |
| 18 | Increase GPS update rate | GPS | The u-blox defaults to 1 Hz, so the speedometer needle only gets a new value once per second (the gauge tweens between them). Now that GPS is pushed over WebSocket, bump the receiver's rate (e.g. 5–10 Hz via a UBX-CFG-RATE message / gpsd config) for a genuinely smoother real-time needle. | P3 | Pending | Enabled by the WebSocket push (no HTTP-poll ceiling). Verify the u-blox 8 supports the desired rate and gpsd forwards it. |
| 14 | ESLint for Vite | UI | The CRA `react-app` ESLint preset was removed in the migration. Set up a Vite-appropriate ESLint (flat config) with @typescript-eslint + prettier. | P3 | Pending | Prettier still works via `npm run prettify`. |
| 15 | Rotate OpenWeather key | Repo / Security | The exposed `VITE_OPEN_WEATHER_API_KEY` (committed to the public Baja-Pi repo's history via `UI/.env`) was rotated/revoked, so the leaked key is now dead. | P2 | Done | `.env` is still tracked but no longer holds a live secret; untracking it is optional cleanup. |
| 16 | Custom boot & shutdown UX | Ops | Customize the boot and shutdown experience so the device feels like an appliance, not a Linux box: quiet/branded boot (suppress kernel + console text, Plymouth splash or boot logo), ideally a splash held until the dashboard is up, and a clean branded shutdown/power-off sequence. | P3 | Pending | Pairs with the boot-to-dashboard flow (kiosk already autostarts via pm2). |
| 8 | Chromium kiosk | UI | `UI/bin/chromium-kiosk` launcher added and wired as the `chromium-kiosk` pm2 app (waits for X + the UI server, then opens Chromium fullscreen on the LCD). Autostarts on boot. | P2 | Done | Kiosk hardening (cursor hide via `unclutter`, crash-recovery tuning) can come later. |
| 9 | Speedometer page | UI | Bring up the React speedometer as the first end-to-end test, reading from the GPS HTTP server (incl. the new `stale` flag → "signal lost"). | P1 | Pending | First real UI target. Uses the staleness fields just added to the GPS server. |
| 10 | Regenerate HTTPS certs (if ever needed) | GPS | HTTPS was dropped for localhost. If HTTPS is ever reintroduced, regenerate certs rather than reusing the old checked-in `localhost.key`/`localhost.cert` (now deleted). | P3 | Deferred | Likely unnecessary — localhost HTTP is fine for Chromium. |
| 11 | Voice subsystem | Voice | Wake-word + STT + intent/Discord routing. Placeholder `Voice/` only for now. | P3 | Deferred | Substantial; warrants its own planning session. Check in with user before starting. |

---

## Recurring / Maintenance

| Topic | Description | Trigger |
|---|---|---|
| Re-apply display fix | Re-run `Scripts/car-display-fix/install.sh` — a kernel `apt upgrade` rewrites the board DTB and drops the `force-output` edit (undoes the display fix and can bring back the CPU-pegging HPD storm). The HPD systemd service and Xorg snippet survive updates on their own. | After any `apt upgrade` of `linux-image-current-sun60iw2`. |

---

## Recently done

| Topic | Description | Date |
|---|---|---|
| CPU storm fixed | Root-caused all-cores-100% to HDMI HPD flapping → `xfsettingsd` spawning an `xfce4-display-settings` swarm. Applied `Scripts/car-display-fix/install.sh`; verified calm across reboot. Documented in `car-dashboard-display-fix.md` §3f. | 2026-07-13 |
| GPS git cleanup | Removed the nested standalone `GPS/.git`, folded `.gitignore` up to the repo root, dropped the per-subsystem `LICENSE`. | 2026-07-13 |
| GPS HTTP-only + staleness | Moved script to `GPS/src/server.js`; removed HTTPS + cert files; port via `PORT` env; added `receivedAt`/`age`/`stale` (>5s) fields. Smoke-tested on `:8000`. | 2026-07-13 |
| PM2 installed | `pm2` 7.0.3 installed globally; daemon runs as `orangepi`. All project processes will live under it. | 2026-07-13 |
| gpsd under PM2 | Installed `gpsd`/`gpsd-clients`; masked the systemd `gpsd.socket`/`gpsd.service`; added `gpsd` to root `ecosystem.config.cjs` (foreground `-N`, control socket, u-blox by-id device). Enabled linger; `pm2 save` + `pm2 startup` for boot autostart. Verified end-to-end: node server reads a TPV with `stale:false`. | 2026-07-13 |
| Monorepo re-root | Relocated the Baja-Pi git repo to `~/Baja`; moved the app under `UI/` (history preserved via renames); brought GPS/Docs/Scripts/ecosystem into the repo. Committed. | 2026-07-13 |
| UI: CRA → Vite | Migrated Create React App → Vite 5 + plugin-react-swc + TS 5. Env `REACT_APP_*`→`VITE_*`, new `index.html`/`vite.config.ts`/`tsconfig`, dropped tests + committed `build/`, repointed canvas-gauges to https. Weather (`openweather-api-node`) excluded → NWS TODO (#13). Verified `vite build` (2307 modules) + dev server. | 2026-07-13 |
| Boot-to-dashboard under pm2 | Added `ui-vite` (Vite dev server on `:5173`) and `chromium-kiosk` (`UI/bin/chromium-kiosk` → fullscreen Chromium on the LCD) to `ecosystem.config.cjs`. Full chain gpsd → gps-server → ui-vite → kiosk now autostarts on boot via `pm2 save`. Cold-boot verified: device comes straight up into the dashboard. | 2026-07-14 |
