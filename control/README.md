# Baja Control

The control endpoint for the [Baja dashboard](../README.md). A tiny Node service
that runs a **fixed set of system actions** on behalf of the UI's long-press menu
(TODO #10) — the dashboard is a fullscreen kiosk with no window chrome or desktop,
so this is how you reboot, shut down, or restart the kiosk by touch.

## What it does

- Listens on **`127.0.0.1:8100`** only (override with `PORT` / `HOST`). It reboots
  the machine, so it is **never** exposed on the network — keep the localhost bind.
- **`GET /`** — health check; returns the action allowlist.
- **`POST /control`** with `{"action": "..."}` — runs one allow-listed action and
  acknowledges *before* running it (reboot/shutdown/stop tear the client down):

  | action | runs | privilege |
  |---|---|---|
  | `chromium-restart` | `pm2 restart chromium-kiosk` | none (same user) |
  | `chromium-stop` | `pm2 stop chromium-kiosk` | none (same user) |
  | `reboot` | `sudo reboot` | scoped NOPASSWD sudoers |
  | `shutdown` | `sudo poweroff` | scoped NOPASSWD sudoers |

Actions are a hard-coded allowlist run via `execFile` (no shell, no request data
on any command line), so there is no injection surface.

## Setup

The reboot/shutdown actions need a one-time sudoers rule (scoped to just those two
binaries, `visudo`-validated):

```bash
sudo ../scripts/control-server/install.sh
```

The Chromium actions need nothing — pm2 manages them as the same user.

## Run

On the Pi it runs under pm2 as `control-server` (see the repo-root
`ecosystem.config.cjs`). Standalone:

```bash
npm start          # listens on 127.0.0.1:8100 (PORT/HOST to override)
```

The UI points at it via `VITE_CONTROL_SERVER_URL` (default `http://localhost:8100`).
