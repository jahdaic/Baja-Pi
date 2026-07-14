# Baja UI — Code Audit (2026-07-14)

Foundation review of `ui/` (React 18 + TS 5 + Redux Toolkit + Vite 5), ahead of building
the GPS-WebSocket work. Findings from a 4-dimension review (data/state, React patterns,
structure/dead-code, types/config), cross-corroborated and verified against the code.

**Scope rule:** _no visual/UI changes._ Here that means **no layout/styling/appearance changes
and no new on-screen elements.** Data-correctness and non-visual behavior fixes are in scope.
Items whose fix would touch visuals are tagged **[VISUAL — deferred]**.

Legend: severity **[H]/[M]/[L]**, and `file:line`.

---

## Tier 1 — Fix first (resilience + the perf storm)

### 1.1 One render-time throw permanently blanks the kiosk — [H]
- **No error boundary anywhere** (`App.tsx`, `index.tsx:10-16`). The whole tree is
  `GPS > Weather > Controls > VisibleGauge > VisibleTheme` with no boundary. Any render exception →
  black screen, recoverable only by a keyboard `Ctrl+R`.
- **Latent trigger:** `majorTicks={Array.from(Array(Number(import.meta.env.VITE_RPM_LIMIT)/1000+1).keys())}`
  at `Bajapunk.tsx:42`, `Cyberpunk.tsx:42`, `LCD.tsx:47`. If `VITE_RPM_LIMIT` is missing/blank/NaN,
  `Array(NaN)` throws `RangeError`. Works today only because `.env` is populated; protection is
  inconsistent (`Standard.tsx:148` defaults `|| 7000`, these don't).
- **Fix:** add an error boundary around `Controls` (and ideally per-`VisibleTheme`) with a minimal
  fallback + auto-remount timer; parse env through a validated central config (§4.2) so ticks can't
  be NaN. Error-only fallback UI is acceptable under the scope rule (normal appearance unchanged).

### 1.2 2 Hz full-tree re-render + canvas-redraw storm — [H] (perf, the big one on this hardware)
- **Whole-slice selector:** `selectSpeedometer = s => s.speedometer` (`siteSlice.ts:267`) returns the
  entire slice; all 16 subscribers destructure from it. Immer returns a new slice object on every
  dispatch, and `GPS.tsx:83` dispatches `setLocation`+`setSpeed` every 500 ms → **every** subscribed
  component (weather page, clock, `WeatherIcon`, …) re-renders twice a second regardless of relevance.
- **Canvas gauges redraw every render:** `RadialGauge.tsx:33` / `LinearGauge.tsx:28` use
  `useEffect(..., [props, canvas.current])`; `props` is a fresh rest-spread object each render, so
  `gauge.update().draw()` runs on every render. `canvas.current` in deps is non-reactive.
  `Standard.tsx` renders 4 gauges, `Bajapunk`/`Cyberpunk` **9 each** → 9 canvas redraws × 2 Hz driven
  by unrelated GPS ticks, under software rendering.
- **Fix (visual-neutral):** narrow selectors (`useAppSelector(s => s.speedometer.speed)` per field);
  `React.memo` on `RadialGauge`/`LinearGauge`; drive the draw effect off `value`/memoized options,
  drop `canvas.current` from deps. Biggest single perf win available.

### 1.3 GPS poller — a cluster of real bugs — [H] `components/background/GPS.tsx`
> **Decision (user):** don't over-invest cleaning this up — it's being **replaced by a GPS WebSocket**
> next, which supersedes the polling loop. Fold the correct patterns into that rewrite rather than
> patching the current file.

All masked today only because `GPS` is a permanent background wrapper that never unmounts.
- **Timer stored in state, never cancelled:** `timeoutID` state init `0` (`:16`); cleanup
  `clearTimeout(timeoutID)` in an `[]` effect (`:90`) closes over `0` → no-op; the recursive
  `setTimeout(updateLocation,500)` in `finally` (`:83`) polls forever. Under StrictMode (dev) this
  double-mounts into **two** 500 ms loops. Storing the id in state also forces a re-render every tick.
- **Stale-closure fallbacks:** `updateLocation` closes over mount-render `location`/`speed`, so every
  `|| location.x` / `|| speed` fallback (`:27-45`) reads initial zeros forever.
- **`.catch` builds but never dispatches:** `:50` calls `setLocation({...})` (no `dispatch`), so the
  error is dropped; it also assigns an `Error` to `error.request` typed `string` (`siteSlice.ts:61`).
- **Reschedules before the fetch resolves:** `.then().catch()` is fired inside `try`, and `finally`
  (`:82`) runs synchronously → next tick always in 500 ms regardless of latency; slow server →
  request pileup; dead server → 500 ms retry loop with no backoff.
- **Fix:** rewrite to mirror `Weather.tsx` (refs + `timeoutRef`), `async/await` so `finally` runs after
  completion, add backoff, `dispatch(setLocation(...))` with `String(err)`. Ideally replace with the
  modernization in §5.1.

### 1.4 Alerts carousel leaks a timer onto unmounted components — [M/H] `pages/Weather/pages/Alerts.tsx:24-33`
`nextAlert` re-schedules with a **bare** `setTimeout(nextAlert,…)` (`:26`) whose id is never stored;
only the first timer is in `timerRef` (`:30`), so cleanup (`:32`) clears just one. Switching away from
the Alerts theme leaves the chain firing `setAlertIndex` on an unmounted component (React warning), and
a new orphan chain accumulates on each revisit. `nextAlert` also reads `weather.alerts.length` from a
stale `[]`-deps closure (`:25`). **Fix:** store every timeout id in the ref (or a single `setInterval`);
read `alerts.length` via ref/dep.

---

## Tier 2 — Correctness bugs (lower severity / latent)

- **`|| fallback` swallows legitimate zeros** — [M] `GPS.tsx:30,31,32,45` and **my own** `weather.ts:185`.
  A stopped car (`speed 0`) or due-north heading (`track 0`) is falsy → replaced by the previous value
  (stopped car shows last speed!). `weather.ts:185` rain: `0/100=0 || previous.rain` → 0% precip can
  never display once nonzero. **Fix:** use `??`, fall back only on `null`/`undefined`. (Note `weather.ts`
  already uses `??` for `windDirection`/`snow` — inconsistent within one function.)
- **gps-server `stale` flag ignored** — [M] `GPS.tsx`. Server reports `stale`/`age`/`receivedAt`; the UI
  reads none, so a lost fix looks live. **In-scope part:** stop treating stale fixes as live (store the
  flag). A visible "signal lost" indicator is **[VISUAL — deferred]**.
- **No fetch timeout / AbortController** — [M] `GPS.tsx:22`, `weather.ts:23`. A half-open socket on a
  flaky cellular link stalls updates indefinitely. **Fix:** `AbortSignal.timeout(10000)` per call.
- **`themeIndices` under-sized** — [M] `Controls.tsx:21` inits `[0,0,0,0]` (4) for **5** gauges; Hula’s
  remembered theme is `undefined`, saved only by `|| 0`. **Fix:** `useState(() => appMap.map(() => 0))`.
- **SunCalc invalid-date guard** — [L] `weather.ts:196-197`. At polar latitudes SunCalc returns an
  Invalid Date (truthy) → `.toISOString()` throws, rejecting `fetchWeather`. Not reachable in FL; guard
  with `!isNaN(sun.sunrise.getTime())`.
- **CSS class collision** — [L, VISUAL — deferred] `standard.css` vs `weather.css` both define
  `.temperature`/`.value`/`.label` with different rules; globally bundled, so correctness depends on
  mount/source order. Touches styling → deferred per scope rule; noting it for awareness.

_Cleared (checked, not bugs): altitude `altMSL` is correct for gpsd 3.22; `LinearGauge` always gets a
`maxValue`; gpsd `epx/epy/...` field names are correct; visibility/wind unit conversions round-trip._

---

## Tier 3 — Removal candidates (verified unreferenced)

> **Principle (user):** un-rendered ≠ dead. Intentionally-disabled WIP prototypes exist. **Ask before
> deleting anything**; only remove what's explicitly confirmed.

1. **`features/counter/` CRA template** (4 files, 208 lines) still wired into the store
   (`store/store.ts:3,8`). **[APPROVED — removing]** Delete dir + unwire reducer.
2. **`Vintage` → `G3Gauge` → `@patricksurry/g3` chain.** **[KEEP — NOT dead]** This is an intentional
   work-in-progress prototype gauge the user disabled in the `Controls` appMap until they return to it.
   Leave `Vintage.tsx`, `G3Gauge.tsx`, `vintage.css`, the export, and the `@patricksurry/g3` dep as-is.
3. **`Formula1Old.tsx`** (unreferenced) + **6 orphan assets** (`images/map.jpg`, `radial-metal.png`,
   `splash.png`, `weather-test.svg`, `weather-bg/10n-old.jpg`, `beetle-top-down.png`).
4. **`degreesToArrowIcon`** (`Utility.ts:111-126`) — only a commented reference; deleting also drops the
   `react-bootstrap-icons` import from Utility.
5. **Large commented blocks:** `GPS.tsx:59-79`, `siteSlice.ts:169-181,231-245,269-278`,
   `Offroad.tsx:152-211`, plus the dead `test` simulation in `Controls.tsx:111-140` (App renders
   `<Controls/>` with no `test` prop, so `incrementValue` in `siteSlice.ts` is dead too).

> **Keep:** `weather.snow`/`city`/`sunrise`/`timezone` — a reviewer flagged these as unused, but you
> asked to store them for upcoming features. Intentional; leave them.

---

## Tier 4 — Types / config / tooling

- **`.env` is git-tracked** — [M] **[APPROVED — doing now]** `.gitignore` ignores only `.env.*.local`.
  Fix: gitignore `.env`, `git rm --cached .env`, add a documented `.env.example`.
- **ESLint fully removed in the Vite migration** — [M] no config/dep; only `typecheck`/`prettify` remain.
  The now-inert `/* eslint-disable react-hooks/exhaustive-deps */` headers (`GPS.tsx:1`, `Weather.tsx:1`,
  `Controls.tsx:1`, `RadialGauge.tsx:1`) suppress a linter that no longer runs — and would have caught
  several bugs above. **Fix:** add `eslint` + `@typescript-eslint` + `eslint-plugin-react-hooks` (flat
  config) + a `lint` script. (Also TODO #14.)
- **No central config; env parsed ~40× with inconsistent defaults** — [M] `Number(import.meta.env.VITE_*)`
  inlined across themes and `Controls.tsx:121-126`; some defaulted, most not. **Fix:** one `config.ts`
  that reads + validates (`Number.isFinite`) + defaults every var once, exported typed. Also resolves 1.1.
- **~9 declared env vars never read** — [L] the `*_MIN/MAX_VOLTAGE` set + `FUEL_RESERVE` +
  `OPEN_WEATHER_API_KEY` (dead post-NWS). The ADC voltage→value scaling they imply isn’t implemented.
  Relates to future sensor work — decide: implement scaling, or prune from `.env`/`vite-env.d.ts`.
- **Pervasive `any` at the API boundary** — [L] `GPS.tsx:16,80`; `weather.ts:22,150,155,165`;
  `Controls.tsx:22`; `siteSlice.ts:210` `as never`. Typing is weakest exactly where untyped external JSON
  (gpsd/NWS) enters. **Fix:** interfaces for the gpsd TPV and NWS/Open-Meteo payloads; `getJson<T>()`.
- **tsconfig strictness gaps** — [L] add `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`,
  `noUncheckedIndexedAccess` (the last helps `appMap[currentGauge]`).
- **Naming/structure** — [L] `interface IWeather` declared 3× with different meanings + two components
  named `Weather` (`components/background/Weather.tsx` vs `pages/Weather/Weather.tsx`) — rename the
  background one (e.g. `WeatherProvider`) and the props interfaces. `store/index.tsx` has no JSX (→ `.ts`);
  `pages/index.tsx` is `export {}` (delete).

---

## Tier 5 — Duplication (visual-neutral refactors — must preserve output exactly)

- **`Cyberpunk.tsx` ≈ `Bajapunk.tsx` ~80% identical** (~820 lines total, ~74 truly different). Extract a
  shared config-driven gauge cluster; the two become color/label presets.
- **RadialGauge ~35-line prop walls repeated dozens of times**; `Standard.tsx` 2nd/4th gauges are verbatim
  copies of 1st/3rd (~90 dup lines) just for the glow layer. Extract shared preset objects and spread.
- **Weather pages** share an identical header + first panel (`Current`≈`Forecast`≈`Alerts`); extract a
  scaffold + shared panel component.
- **5 identical pass-through wrappers** (`Speedometer/Weather/GPS/Time/Hula .tsx`, each
  `({children}) => <div>{children}</div>`) — collapse to one `GaugeFrame`.

---

## Tier 6 — React modernization (the "patterns have moved on" lens)

- **`useState` for timer ids → `useRef`** (GPS.tsx; the cause of the 1.3 cleanup bug).
- **Hand-rolled `fetch` + `setTimeout` polling → RTK Query (`pollingInterval`) or a reusable
  `usePolling` hook.** Biggest modernization: both the GPS and weather loops reinvent this; RTK Query
  gives caching, dedup, abort, backoff, and loading/error state for free. Pairs naturally with the
  upcoming GPS-WebSocket work.
- **Narrow selectors** (also §1.2) — modern react-redux practice.
- **Drop `React.FC` + unused `...props`/`children`**, and remove unnecessary `import React from 'react'`
  (automatic JSX runtime is active via SWC).
- **Fix `exhaustive-deps` instead of blanket-disabling** it (refs/`useCallback`), then re-enable the rule.
- **Persist nav state** — `currentGauge`/`currentTheme`/`themeIndices` are ephemeral local state in
  `Controls`; nothing survives `Ctrl+R` or a pm2 restart. Move to a `uiSlice` or `localStorage` so the
  kiosk restores its last screen. Hoist `appMap` to module scope (or a `pages/registry.ts`).

---

## Suggested sequencing

1. **Safety net first:** error boundary + central validated `config.ts` (kills the black-screen class). §1.1, §4.2
2. **Perf storm:** narrow selectors + memoize/fix canvas-gauge redraws. §1.2
3. **GPS poller rewrite** (refs, async/await, `??`, dispatch, backoff) — ideally as the RTK Query / hook
   modernization, since the WebSocket work will touch this anyway. §1.3, §2, §5.1
4. **Alerts timer leak.** §1.4
5. **Dead-code sweep** (~600 lines + drop `@patricksurry/g3`). §3
6. **Tooling:** re-add ESLint, gitignore `.env`, tsconfig flags, API types. §4
7. **Duplication refactors** (output-preserving), when convenient. §5
