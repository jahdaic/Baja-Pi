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
| 7 | pm2 ecosystem config | Repo / Ops | Root `ecosystem.config.cjs` created with the `gpsd` entry; `pm2 startup`/`pm2 save` wired. Still to add: `gps-server` (node HTTP server), later `ui-vite`, `chromium-kiosk`. | P2 | In Progress | Model on Alice's `~/Companion/ecosystem.config.cjs`. |
| 12 | GPS device hotplug re-add | GPS / Ops | gpsd is started with the device on its cmdline; if the u-blox is unplugged/replugged it may not re-attach automatically. Add a udev rule (or gpsdctl-based hook) to re-add via the control socket at `/run/user/1000/gpsd.sock`. | P3 | Pending | Control socket already in place for this. Low priority for a fixed car install where the receiver stays put. |
| 8 | Chromium kiosk port | UI | Port the Chromium kiosk config from the Zero 2W into `UI/bin/` (launcher + autostart). | P2 | Pending | Milestone after display fix; see project doc. |
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
