<p align="center">
  <img src="media/images/Baja%20Pi%20Logo%20Horiztonal.png" alt="Baja Pi" width="640">
</p>

An in-car dashboard for a Baja Bug, running on an Orange Pi single-board computer
driving a 4" round LCD. Its primary function is a **speedometer**, with additional
**weather**, **GPS**, and **clock** pages — and it boots straight into a fullscreen
Chromium kiosk.

## Hardware

- **SBC:** Orange Pi Zero 3W (Allwinner A733, 12 GB LPDDR5)
- **Display:** Waveshare 4" round HDMI touch LCD — 720×720 @ 78 Hz
- **GPS:** u-blox 8 USB receiver (via gpsd)
- **OS:** Debian bookworm (Orange Pi BSP, kernel 6.6.98-sun60iw2)

## Architecture

Everything runs under **pm2**, and the full chain autostarts on boot:

```
gpsd ──► gps-server (:8000, HTTP + WebSocket) ──► ui-vite (:5173) ──► chromium-kiosk (LCD)
```

| Path | What it is |
|---|---|
| `ui/` | The React dashboard app (Vite + TS + Redux Toolkit). See [ui/README](ui/README.md). |
| `gps/` | Node service bridging gpsd → HTTP/WebSocket. See [gps/README](gps/README.md). |
| `scripts/` | Provisioning — the Waveshare round-LCD display fix and the boot/shutdown branding installer. |
| `docs/` | Project documentation (architecture, display fix, code audit, backlog). |
| `voice/` | Placeholder for future voice/assistant work. |
| `ecosystem.config.cjs` | pm2 process definitions (`gpsd`, `gps-server`, `ui-vite`, `chromium-kiosk`, `cursor-hide`). |

## Tech stack

- **UI:** React 18, TypeScript 5, Vite 5, Redux Toolkit, canvas-gauges; Chromium kiosk
- **GPS:** Node, gpsd, `node-gpsd-client`, `ws` (WebSocket)
- **Weather:** keyless NWS (`api.weather.gov`) + Open-Meteo + `suncalc` — no API key
- **Ops:** pm2 (process management + boot autostart), systemd + Plymouth (display fix, branded boot/shutdown)

## Setup

Assumes a fresh Debian Orange Pi image. See `docs/` for the detailed writeups.

1. **Display fix** (the Waveshare round LCD needs it to render):
   ```bash
   sudo scripts/car-display-fix/install.sh && sudo reboot
   ```
2. **gpsd**, **pm2**, and the cursor tool:
   ```bash
   sudo apt install -y gpsd gpsd-clients unclutter-xfixes
   sudo systemctl mask gpsd.socket gpsd.service   # pm2 owns gpsd
   npm install -g pm2
   ```
   (`unclutter-xfixes` backs the `cursor-hide` pm2 app.)
3. **Dependencies:**
   ```bash
   (cd gps && npm install)
   (cd ui && npm install && cp .env.example .env)   # then edit .env as needed
   ```
4. **Bring it up under pm2** (from the repo root):
   ```bash
   pm2 start ecosystem.config.cjs
   pm2 save
   pm2 startup            # once, so pm2 resurrects on boot
   ```
5. **Branded boot & shutdown** (optional polish — Plymouth splash, quiet/clean
   boot, U-Boot logo; idempotent and backs up everything it touches):
   ```bash
   sudo scripts/boot-branding/install.sh && sudo reboot
   ```

For development the UI runs against a laptop browser with no Pi hardware required —
see [ui/README](ui/README.md).

## Documentation

- [`docs/car-dashboard-project.md`](docs/car-dashboard-project.md) — project handoff / direction
- [`docs/car-dashboard-architecture.md`](docs/car-dashboard-architecture.md) — repo layout & process model
- [`docs/car-dashboard-display-fix.md`](docs/car-dashboard-display-fix.md) — the round-LCD display fix
- [`docs/ui-audit.md`](docs/ui-audit.md) — UI code audit
- [`docs/todo.md`](docs/todo.md) — backlog

## License

Shared under **CC BY-SA 4.0** — see [`LICENSE`](LICENSE).
