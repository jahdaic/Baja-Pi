# Baja Pi — TODO

Open work only; completed items live in `git log`. Per-item deep dives, dev notes, and
gotchas go in [`feature-details.md`](feature-details.md). Recurring upkeep lives in
[`maintenance.md`](maintenance.md); design direction in [`car-dashboard-architecture.md`](car-dashboard-architecture.md).

## Status

- ⬜ **Pending** — not started
- 🚧 **In Progress**
- ⛔ **Blocked**
- ⏸️ **Deferred** — intentionally later
- ✅ **Done**

## Items

| # | Item | Status | Notes |
|---|---|---|---|
| 1 | Increase GPS update rate | ⬜ | Bump the u-blox to 5–10 Hz (UBX-CFG-RATE) for a smoother needle; enabled by the WebSocket push. |
| 2 | GPS signal-lost indicator | ✅ | `gps-server` reports `age`/`stale` + satellite health (seen/used/SNR/HDOP); `gps` slice carries it and the GPS Details page shows sats used/seen, avg SNR, fix age, and a "Stale Satellites" banner. |
| 3 | Voice subsystem | ⏸️ | Wake-word + STT + intent/Discord routing. Substantial — warrants its own planning session. |
| 4 | Split the store into domain slices | ✅ | Broke the monolithic `speedometerSlice` into `vehicle` / `gps` / `weather` slices (`store/*Slice.ts`), each owning its state + actions + selector; ~20 consumers repointed. Behavior-preserving. |
| 5 | Page + theme registry | ⬜ | Let features self-register their pages/themes; retire the hardcoded `appMap` in `Controls.tsx`. |
| 6 | Move navigation state into the store | ⬜ | Current page/theme lives in local `useState`; move it to the store for programmatic nav, persistence, and settings-driven order. |
| 7 | Swipe gestures + slide transitions | ⬜ | Add touch-swipe to change gauge/page with an animated slide; keys + on-screen buttons keep working. No gesture handling exists today. |
| 8 | Waveshare AD HAT → vehicle sensors | ⬜ | Read real vehicle signals into the `vehicle` slice. Phase 1: turn signals, alternator light, oil warning light. Later: voltage, RPM, oil pressure/temp. [details](feature-details.md#waveshare-ad-hat-vehicle-sensors) |
| 9 | Fonts don't load on first gauge | ✅ | Preload all custom fonts before first render (`scripts/fonts.ts` + `index.tsx`) — canvas-gauges was drawing before the font loaded. [details](feature-details.md#fonts-dont-load-on-first-gauge) |
| 10 | Long-press control menu | ⬜ | Long-press opens: Reboot Pi · Close Chromium (stop pm2) · Restart Chromium (restart pm2). Needs a localhost control endpoint. [details](feature-details.md#long-press-control-menu) |
| 11 | g3 gauge | ✅ | Built `G3Gauge` (live radial gauge) + `G3Speedmaster` (Omega Speedmaster reskinned as a vehicle chronograph: speed/RPM dual rings, oil-pressure/voltage/oil-temp subdials, fuel window, decoupled hands). Wired into the Vintage theme. [details](feature-details.md#g3-gauge) |
| 12 | Persist app state | ⬜ | Remember the active gauge/panel across reload/reboot via `localStorage`. Builds on item 6 (nav → store). |
| 13 | Map view | ⬜ | Show a live map centered on the vehicle when there's a GPS fix (uses the `gps` slice lat/lon/heading). Fall back gracefully when the signal is lost (item 2). |
| 14 | Power-loss protection (PiSugar UPS) | ⬜ | PiSugar 3 UPS + a PM2 Python daemon that watches external power over I²C and, after it's been cut ~60s (rides out engine crank), cuts PiSugar output (reg `0x09`) and shuts down gracefully — protects the SD from the `commit=600` write window on ignition-off. [details](feature-details.md#power-loss-protection-pisugar-ups) |
