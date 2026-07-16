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
| 2 | GPS signal-lost indicator | ⬜ | `gps-server` already reports `stale`/`age`; surface it in the UI (store field + on-screen indication). |
| 3 | Voice subsystem | ⏸️ | Wake-word + STT + intent/Discord routing. Substantial — warrants its own planning session. |
| 4 | Split the store into domain slices | ⬜ | Break the monolithic `speedometerSlice` into `vehicle` / `gps` / `weather` slices so each feature owns its state. |
| 5 | Page + theme registry | ⬜ | Let features self-register their pages/themes; retire the hardcoded `appMap` in `Controls.tsx`. |
| 6 | Move navigation state into the store | ⬜ | Current page/theme lives in local `useState`; move it to the store for programmatic nav, persistence, and settings-driven order. |
| 7 | Swipe gestures + slide transitions | ⬜ | Add touch-swipe to change gauge/page with an animated slide; keys + on-screen buttons keep working. No gesture handling exists today. |
| 8 | Waveshare AD HAT → vehicle sensors | ⬜ | Read real vehicle signals into the `vehicle` slice. Phase 1: turn signals, alternator light, oil warning light. Later: voltage, RPM, oil pressure/temp. [details](feature-details.md#waveshare-ad-hat-vehicle-sensors) |
| 9 | Fonts don't load on first gauge | ⬜ | First gauge paints with fallback fonts; switching gauge and back fixes it → font race at first paint. [details](feature-details.md#fonts-dont-load-on-first-gauge) |
| 10 | Long-press control menu | ⬜ | Long-press opens: Reboot Pi · Close Chromium (stop pm2) · Restart Chromium (restart pm2). Needs a localhost control endpoint. [details](feature-details.md#long-press-control-menu) |
| 11 | g3 gauge | ⬜ | Build a gauge with `@patricksurry/g3` (already a dep). `G3Gauge.tsx` is a stub — decide build-on-it vs from-scratch when we start. |
| 12 | Persist app state | ⬜ | Remember the active gauge/panel across reload/reboot via `localStorage`. Builds on item 6 (nav → store). |
