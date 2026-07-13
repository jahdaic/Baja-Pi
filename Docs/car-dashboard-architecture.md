# Car Dashboard — Proposed Architecture

**Status:** proposal, unwritten. Discussed 2026-07-13 with Claude on the home Pi (Alice's brain) while the Orange Pi Zero 3W boots into a clean Debian install.

This doc describes the **repository layout** and **process model** for the car dashboard project — the monorepo replacing the loose "bunch of separate repo dirs inside Code/" arrangement from the original Zero 2W setup.

Companion doc: `car-dashboard-project.md` (project handoff, hardware, OS choice, prior context).
Companion doc: `car-dashboard-displayfix.md` (display driver blocker — RESOLVED, script bundle at `~/car-display-fix/`).

---

## Goals

1. **Single repo, single commit history.** Everything the car dashboard does lives under one tree. No git submodules, no cross-repo version dance. (Same call as Alice — see the [Companion is a monorepo](../.claude/projects/-home-jahdai-Companion/memory/monorepo_planned.md) memory.)
2. **Subsystem isolation.** Each concern (UI, GPS, voice, kiosk chrome, docs, ops scripts) lives in its own top-level directory. Restart, replace, or test any one of them without touching the others.
3. **pm2 for everything.** Every long-running process is a pm2 entry, defined in one `ecosystem.config.cjs` at the repo root. Same operational model as Alice — reboots survive, `pm2 status` is the single source of truth for what's running.
4. **Portable UI dev.** The React app runs against a laptop browser during development. None of the car-specific machinery (kiosk shell, GPSD, hardware sensors) is required to iterate on UI.

---

## Directory layout

```
~/car-dashboard/
├── UI/                          # React app (the dashboard itself)
│   ├── src/                     # components, pages, state, styles
│   ├── public/                  # static assets
│   ├── bin/                     # kiosk-layer scripts (see below)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── GPS/                         # GPSD-fronted position/speed HTTP server
│   ├── src/
│   │   └── server.js            # the ~60-line node-gpsd-client wrapper
│   └── package.json
├── Voice/                       # (future) wake-word + STT + TTS, if we add it
│   └── README.md                # placeholder — voice is deferred, see project doc
├── Docs/                        # project documentation
│   ├── architecture.md          # this file (canonical copy — Documents/ is the working draft)
│   ├── displayfix.md            # copy of the sunxi-drm fix writeup
│   ├── decisions.md             # design decisions with reasoning (Alice-style)
│   └── troubleshooting.md       # resolved incidents (Alice-style)
├── Scripts/                     # ops + provisioning
│   ├── install.sh               # one-shot: pm2 startup, deps, systemd units
│   ├── waveshare-hdmi-hpd.service
│   └── 10-waveshare-round.conf  # Xorg DPMS-off snippet
├── ecosystem.config.cjs         # pm2 process definitions (root)
├── .env.example                 # documented env vars (GPS port, API keys, etc.)
├── README.md
└── CLAUDE.md                    # working context for Claude Code (Alice-style)
```

### Why `UI/bin/` and not a top-level `Kiosk/`

Alice's `Avatar/` puts its Chromium kiosk launcher (`Avatar/bin/chromium-kiosk`, ~128 lines) inside the same directory as the app itself. Same pattern here:

- `UI/src/` is the React app. Runs in any browser. Doesn't know about Chromium, Wayland, or the Waveshare panel.
- `UI/bin/` holds the "get this app onto *this specific device's* screen" machinery — the Chromium launcher script, autostart .desktop file, maybe an `unclutter` config.

Nested (`UI/bin/`) is simpler than top-level (`Kiosk/`) when the kiosk layer is small — one launcher, one autostart entry. If the layer grows past ~5 files, promote to a top-level `Kiosk/`. Not a decision to sweat now.

### What goes where — quick reference

| Concern | Directory | Example files |
|---|---|---|
| React components, pages, styles | `UI/src/` | `Speedometer.tsx`, `App.tsx`, `theme.css` |
| Vite build config | `UI/` (root of app) | `vite.config.ts`, `package.json` |
| Chromium kiosk shell | `UI/bin/` | `chromium-kiosk`, `car-dashboard.desktop` |
| GPSD Node server | `GPS/src/` | `server.js`, `package.json` |
| Display bring-up (HPD, Xorg DPMS) | `Scripts/` | `waveshare-hdmi-hpd.service`, `10-waveshare-round.conf` |
| One-shot provisioning | `Scripts/` | `install.sh` (sets up pm2 startup, systemd units, deps) |
| pm2 process definitions | repo root | `ecosystem.config.cjs` |
| Environment variables | repo root | `.env`, `.env.example` |
| Project docs | `Docs/` | `architecture.md`, `decisions.md`, `troubleshooting.md` |
| Claude Code context | repo root | `CLAUDE.md` |

---

## Process model — pm2

One `ecosystem.config.cjs` at the repo root defines every long-running process. Rough sketch:

```js
module.exports = {
  apps: [
    {
      name: 'ui-vite',            // Vite dev server (or a static server for prod)
      cwd: './UI',
      script: 'npm',
      args: 'run dev',            // for dev; swap to `run preview` or `serve dist` for prod
      env: { PORT: '5173' },
    },
    {
      name: 'gps-server',
      cwd: './GPS',
      script: 'src/server.js',
      env: { PORT: '8000' },
    },
    {
      name: 'chromium-kiosk',
      cwd: './UI',
      script: 'bin/chromium-kiosk',
      env: { AVATAR_URL: 'http://localhost:5173' },
      // pm2 restarts this on labwc login/logout cycles — self-healing (see Alice's launcher)
    },
  ],
};
```

Then, exactly like on Alice:
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup            # writes the systemd unit that resurrects pm2 on boot
```

**Why this over separate systemd units per service:**
- `pm2 status` gives one dashboard of everything running.
- `pm2 logs ui-vite` / `pm2 restart gps-server` are one command each.
- pm2's restart-on-crash semantics are already tuned; systemd's aren't by default.
- Alice uses the same pattern and it's genuinely made ops easier — same instinct here.

**What still lives in systemd** — anything that has to run *before* the user session:
- `waveshare-hdmi-hpd.service` (writes `hpd_mask=0x11` before `display-manager.service` starts).
- Not much else.

---

## Development workflow

1. **UI iteration** on the laptop:
   ```bash
   cd UI/
   npm run dev              # http://localhost:5173 in laptop browser
   ```
   No Orange Pi, no GPSD, no Chromium kiosk needed. Mock GPS data via a `.env` flag if needed.
2. **Full-stack testing** on the Orange Pi over SSH:
   ```bash
   pm2 restart all
   pm2 logs
   ```
3. **Production** on the Orange Pi in the car:
   ```bash
   pm2 start ecosystem.config.cjs --env production
   pm2 save
   ```
   With autologin → labwc → pm2's `chromium-kiosk` entry → dashboard on the round LCD.

---

## Env vars — where they live

- Repo root `.env` — GPSD port, GPS server port, feature flags (mock mode, etc.).
- `UI/.env.local` — Vite-picked-up vars (`VITE_GPS_URL`, `VITE_MOCK_MODE`, etc.). *Not* checked in.
- `.env.example` at repo root — documents every variable the system reads. *Is* checked in.

Same pattern Alice uses (`Voice/.env`, `Brain/workspace/.env`, etc. all sourced from a documented `.env.example`).

---

## Open questions (decide as we hit them)

- **Voice yet?** The project doc says voice is deferred. `Voice/` is a placeholder. When we add it, expect a wake-word service (openWakeWord CPU) + STT (probably cloud since the Orange Pi has no Hailo) + TTS (Piper or cloud). Roughly Alice-shaped but simpler.
- **Alice integration?** User has expressed intent to bring Alice into the car "for real." Decision path is in `car-dashboard-project.md`. If we go that way, `Brain/` becomes a fourth top-level dir here or the car dashboard becomes a subsystem of a broader Companion-shaped repo. Not yet.
- **DB / persistence?** GPS trace logging, trip history, config? Currently none. If it grows, add `Data/` or `Storage/`.
- **Static build vs. Vite dev in prod?** For a car dashboard that boots and runs unattended, `vite build` + serving `UI/dist/` via a tiny static server is probably better than leaving `vite dev` running. Decide after the first working end-to-end.

---

## Migration from the old Zero 2W layout

The old setup was "a bunch of separate repo directories inside `~/Code/`." Concrete move:

| Old (Zero 2W) | New (Zero 3W) |
|---|---|
| `~/Code/react-dashboard/` | `~/car-dashboard/UI/` |
| `~/Code/gpsd-server/` | `~/car-dashboard/GPS/` |
| ad-hoc launcher scripts scattered around | `~/car-dashboard/UI/bin/`, `~/car-dashboard/Scripts/` |
| no unified process manager | `~/car-dashboard/ecosystem.config.cjs` under pm2 |
| no docs directory | `~/car-dashboard/Docs/` |

Recommend: create the new tree fresh, copy source files (`.tsx`, `.js`) over, rebuild `package.json` clean, git-init from scratch. Don't try to preserve the old git history — it wasn't organized in a way worth carrying forward, and the new repo layout will read cleaner without the "reorganization" commit noise.

---

## References

- Alice's monorepo (`~/Companion/`) — the model this proposal is copying.
- `~/Companion/Avatar/bin/chromium-kiosk` — the kiosk launcher pattern (pm2 + Wayland-socket wait + self-heal on labwc restart).
- `~/Companion/ecosystem.config.cjs` — reference for how pm2 apps are defined.
- `~/Documents/car-dashboard-project.md` — project handoff (hardware, OS, prior context).
- `~/car-display-fix/` (on the Orange Pi) — the applied display-fix bundle.
