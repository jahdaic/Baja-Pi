# Baja UI

The dashboard UI for the [Baja project](../README.md) — a React single-page app that
renders gauges and information on a 4" round 720×720 LCD, run fullscreen in a
Chromium kiosk.

## Stack

- **React 18 + TypeScript 5**, built with **Vite 5** (`@vitejs/plugin-react-swc`)
- **Redux Toolkit** for state
- **canvas-gauges** + **@patricksurry/g3** for the gauges
- Data: the [GPS server](../gps) (WebSocket) for speed/position, and the keyless
  **NWS** (`api.weather.gov`) + **Open-Meteo** APIs for weather

## Pages

Navigated with the arrow keys / on-screen buttons (`Controls.tsx`): **Speedometer**
(several themes), **Weather** (current / forecast / alerts), **GPS**, **Time**
(analog / calendar), and **Hula**.

## Develop

```bash
npm install
cp .env.example .env    # then edit as needed
npm run dev             # Vite dev server on :5173
npm run build           # production build -> dist/
npm run typecheck       # tsc --noEmit
npm run lint            # eslint
```

The app runs against any browser in development — no Pi hardware required (GPS/weather
just report defaults until reachable).

## Config

All settings are `VITE_*` env vars, read through `src/config.ts` (validated, with
fallbacks). See `.env.example` for the full list — the GPS server URL, gauge
limits/redlines, and sensor voltage ranges. `.env` is git-ignored.

On the Pi this runs under pm2 as `ui-vite`, with `chromium-kiosk` opening it
fullscreen on the LCD (see the repo-root `ecosystem.config.cjs`).
