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
- Tracks the latest `SKY` report too, and folds satellite health into every
  payload (see `satellites` below).
- Adds freshness metadata to every payload:
  - `receivedAt` — epoch ms of the last fix (`null` until the first one)
  - `age` — ms since the last fix (`null` until the first one)
  - `stale` — `true` when the fix is older than 5 s (or never seen) = signal lost

## Payload

Whatever gpsd puts in the TPV (`lat`, `lon`, `altMSL`, `speed` in m/s, `track`,
`climb`, and error estimates `epx`/`epy`/…), plus the freshness fields above, plus
a `satellites` summary derived from the latest `SKY`:

- `seen` — satellites in view (incl. almanac-predicted, no signal)
- `tracked` — satellites actually being received (SNR > 0)
- `used` — satellites used in the fix
- `snr` — `{ max, avg }` signal strength in dB-Hz across satellites reporting one (`null` when none)
- `hdop` — horizontal dilution of precision (`null` when unavailable)
- `list` — per-satellite detail (PRN, `snr`, `used`, …)

## Run

On the Pi it runs under pm2 as `gps-server` (see the repo-root
`ecosystem.config.cjs`). Standalone:

```bash
npm install
npm start          # listens on :8000 (PORT to override)
```

Requires a running **gpsd** pointed at the GPS receiver — see the
[repo README](../README.md) for the device + pm2 setup.
