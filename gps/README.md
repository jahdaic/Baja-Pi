# Baja GPS

The GPS subsystem for the [Baja dashboard](../README.md). A small Node service that
bridges **gpsd** to the dashboard UI, exposing the latest fix over both an HTTP
endpoint and a WebSocket.

## What it does

- Connects to a local **gpsd** instance (`localhost:2947`) with `node-gpsd-client`
  and tracks the latest `TPV` (time-position-velocity) report.
- Serves it on **`:8000`** (override with the `PORT` env var):
  - **HTTP `GET /`** — the latest fix as JSON (health check / fallback).
  - **WebSocket** — pushes each `TPV` the moment gpsd delivers it, and sends the
    current state on connect. This is what the UI uses for a real-time needle.
- Adds freshness metadata to every payload:
  - `receivedAt` — epoch ms of the last fix (`null` until the first one)
  - `age` — ms since the last fix
  - `stale` — `true` when the fix is older than 5 s (or never seen) = signal lost

## Payload

Whatever gpsd puts in the TPV (`lat`, `lon`, `altMSL`, `speed` in m/s, `track`,
`climb`, and error estimates `epx`/`epy`/…) plus the three freshness fields above.

## Run

On the Pi it runs under pm2 as `gps-server` (see the repo-root
`ecosystem.config.cjs`). Standalone:

```bash
npm install
npm start          # listens on :8000 (PORT to override)
```

Requires a running **gpsd** pointed at the GPS receiver — see the
[repo README](../README.md) for the device + pm2 setup.
