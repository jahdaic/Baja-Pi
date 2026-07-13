# Car Dashboard Device — Project Handoff

Context brief for a fresh Claude Code instance running on the Orange Pi. Captures the decisions already made and the direction we're going, so you can pick up mid-project without re-litigating what's been settled.

## What this is

An in-car dashboard device on an Orange Pi Zero 3W, driving a 4" round HDMI LCD (Waveshare 720x720@78Hz). Primary function is a **speedometer**, with additional pages for weather, GPS, and more. Also integrates with the user's home AI companion ("Alice") for natural-language voice interaction when the car has internet.

The predecessor was an Orange Pi Zero 2W (Allwinner H618). Same enclosure, same LCD, same connectors — the 3W is a drop-in upgrade for RAM + CPU + NPU headroom.

## Hardware

- **SBC:** Orange Pi Zero 3W, **12 GB LPDDR5**, Allwinner A733 (2× Cortex-A76 @ 2.0 GHz + 6× A55 + Imagination BXM-4-64 MC1 GPU + 3 TOPS NPU)
- **Display:** [Waveshare 4inch HDMI Round Touch LCD](https://www.amazon.com/dp/B0D5HC9RDQ), 720x720 IPS, HDMI + 10-point capacitive touch. **Native mode: 720x720 @ 78Hz, pixel clock 59.4 MHz.** Waveshare wiki with `hdmi_timings` line for the display: <https://www.waveshare.com/wiki/4inch_720x720_LCD>. On Raspberry Pi this works via `hdmi_timings=720 0 40 40 200 720 0 24 4 12 0 0 0 78 0 59400000 0` in `config.txt`. **Orange Pi has no equivalent bootloader-firmware layer, so we can't use that mechanism** — this is the core blocker described in "The display blocker" section below.
- **Storage:** microSD (boot + rootfs). **Currently a 64 GB card is in use.**
- **Wi-Fi 6 + Bluetooth 5.4** on-board — expect Wi-Fi 5 fallback speeds until vendor drivers mature. User has explicitly accepted this.
- **Mic + audio for voice:** TBD. Recommend a directional or beamforming USB mic mounted at the visor/headliner; car noise makes an omnidirectional dash mic pretty rough. Audio out routes to the car's head unit via aux or Bluetooth (also TBD).

## OS

**Chosen: `Orangepizero3w_1.0.0_debian_bookworm_desktop_xfce_linux6.6.98.7z`** from Orange Pi's official downloads (vendor BSP kernel `sun60iw2-6.6.98`, Allwinner sunxi tree).

Desktop-XFCE variant chosen over Server because the vendor bundles the display server + GPU driver + Chromium together and it Just Works on this brand-new SoC. Server-mode would mean hand-configuring HDMI + drivers before you can even see Chromium render — days of debugging for no gain. Once the kiosk is proven, disable XFCE's autostart and boot straight into Chromium as the session for a server-like footprint.

Why not the alternatives:
- **Armbian** has NO A733 support yet. Their "Orange Pi Zero3" image is for the H618 predecessor — do not flash it here.
- **Mainline Linux** for A733 is in very early upstreaming (initial DTS submitted v1, not accepted; pinctrl + DMA work in progress on linux-sunxi). Not usable for daily driving in 2026.
- **Ubuntu on the BSP** is the other viable pick; Debian was preferred for lighter footprint on a kiosk workload.

Expect first-year-Allwinner-chip quirks (HDMI resolutions needing `xrandr` tuning, Chromium GPU accel unstable, Wi-Fi 6 downshift). User is fine with all of these — this is a hobbyist project.

## UI stack

**Chromium in kiosk mode**, multi-page single-page-app style with client-side routing:
- Speedometer (primary)
- Weather
- GPS / map
- Future pages TBD

Rendering plan: **plan for CPU/software rendering**, not GPU-accel. The A76 cores at 2 GHz are dramatically faster than the H618's A53s, so software-rendered Chromium on the A733 will beat the previous GPU-accelerated setup on the 2W. If BXM Mesa drivers work out later, treat that as bonus performance, not required.

Transplant Chromium kiosk configuration from the previous Zero 2W setup where possible — Debian userland is the same.

## Voice architecture (planned, not yet built)

### Wake word

- **Local `openWakeWord`, always-on**, wake phrase "Alice"
- **Reuse the same wake-word model weights** as home Alice — one training run serves both devices
- **Extended training only** for the wake word — 50k+ samples, 4–8 h, Colab Pro likely. No "quick path"; user has explicitly ruled out shortcuts here.
- **AEC required** in front of the wake-word model — Alice's own voice broadcast through car speakers will otherwise trigger it. Use `speexdsp-python` or WebRTC's AEC pipeline.
- Threshold will need car-specific tuning (car ambient is 15–20 dB noisier than the home office; model confidence scores will trend lower).

### Post-wake routing (dual-mode)

**Same wake word, routing switches based on connectivity:**

- **Online (Discord voice channel connected)** → stream mic audio into a shared Discord voice channel where home Alice's bot is also connected. Home Alice hears the audio through her existing Discord plugin, processes normally with full memory/personality/cloud LLM (Kimi K2.6), and replies. Her ElevenLabs voice broadcasts back through Discord → car speakers.
  - Latency: ~1 s per turn
  - This is the **"real Alice"** integration — full memory, full context, no clone, no divergence.
  - Depends on: home Pi 5 online, Discord reachable, car internet.

- **Offline (no Discord)** → local Whisper.cpp (tiny or base, ~40–150 MB) transcribes → local intent-LLM extracts action → local dashboard action.
  - Intent LLM: small (Llama 3.2 1B Q4_K_M ~800 MB, or Phi-3-mini Q4_K_M ~2 GB), prompted to return JSON like `{"action": "show_page", "target": "gps"}`. Use `llama.cpp` with grammar-constrained sampling.
  - Runs on A76 cores at 1–2 s per command.
  - Handles page navigation, sensor queries, similar bounded intents.

From the driver's perspective: one wake word, one voice, always works. The seam is invisible.

### Rejected approaches (do not re-propose)

- **Full Alice clone on car** — forks memory/personality, no clean sync path.
- **Remote Alice via VPN to home** — adds hops with no benefit over Discord (Discord already relays audio).
- **Rigid command grammar** — user wants natural language, not memorized phrases.
- **Push-to-talk button** — wake word chosen for hands-free.
- **Different wake word for offline vs online** — same word for both, routing is what changes.

## Car integration considerations to plan around

- **Road noise** — mic placement matters more than mic quality. Visor or headliner beats dash.
- **Music/podcasts through car speakers** — AEC handles Alice's own voice loop. Won't help with passenger chatter or radio saying "Alice" (occasional false wakes are expected; VAD will time out silently).
- **Head unit audio integration** — how Alice's voice reaches the car speakers is an open question. Aux is simplest. Bluetooth is nicer but has pairing/latency quirks.
- **Family/Guest mode** — home Alice's calendar-driven polite mode still applies since it's the same Alice; no separate config needed.

## Key user preferences (carry these forward)

- **No spoon-feeding tool commands.** Skills should be self-contained — if Alice needs the exact invocation copy-pasted into a prompt, the skill's docs are broken. Fix the skill, not the prompt.
- **Small, focused commits** following the pattern in the home Companion repo (`voice/tts:`, `avatar/kiosk:`, `docs/watching:` style).
- **Trust the docs.** If a decision is already made in this file or in a `SKILL.md`, don't rehash the rationale; act on it.
- **Willing to accept first-year SoC quirks** — this is a hobbyist project. Don't over-engineer around drivers being immature.
- **When exploring options** ("what could we do about X?") user wants 2–3 concrete recommendations with tradeoffs, not exhaustive enumeration.

## Related home project context

The home companion project lives on a Raspberry Pi 5 (8 GB) + Hailo AI Hat, with a Live2D avatar and ElevenLabs voice. Its repo is at `~/Companion` on the home Pi. Key facts the car integration depends on:

- **Home Alice's brain** is Moonshot Kimi K2.6 via API — the same LLM the car would reach through Discord.
- **Home Alice has a Discord bot** already running via `openclaw-gateway` + the Discord plugin + `discord-voice-watchdog` (all pm2-managed on the home Pi).
- **Personality + memory files** live in `Brain/workspace/{SOUL,USER,MEMORY,AGENTS,HEARTBEAT,TOOLS}.md` on the home Pi. Do not attempt to sync these to the car — the car's job is to be a mic + speaker into Alice, not a second Alice.
- **No changes to home Alice are needed for the car integration.** She'll receive car voice as if it were another Discord user in the voice channel.

## Current state (2026-07-13)

### What's working
- **Hardware:** fully assembled, powered, LCD connected via HDMI. Board is alive (BROM → SPL → U-Boot → kernel 6.6.98-sun60iw2 all boot cleanly, verified via serial UART).
- **OS:** **Ubuntu** (Orangepizero3w BSP with kernel 6.6.98-sun60iw2) is currently flashed, not Debian. User rushed a flash to try switching OS during blocker debugging; ended up on Ubuntu. **Not worth reflashing to Debian right now** — both distros use the identical vendor kernel and same DRM driver, so the current blocker would repeat identically. If we ever solve the display issue and want to switch to Debian later, the patched module will work on both.
- **Boot to `graphical.target`:** systemd reaches graphical target, LightDM is `active (running)`, Xorg (`Xorg -core :0 -seat seat0 vt7`) spawned, user `orangepi` auto-login succeeds. The whole software stack is running normally.
- **Wi-Fi + SSH:** Wi-Fi is up (configured via `nmcli device wifi connect`), user SSHes in from Windows via PuTTY. **Use SSH for all further debugging** — the display is dark and serial is slow and painful.
- **Serial UART:** FTDI FT232RL adapter wired to pins 6 (GND), 8 (board TX → adapter RX), 10 (board RX → adapter TX). 115200 8N1. Adapter's VCC line NOT connected (board is powered separately). Serial console is useful for early-boot debug and as an emergency-recovery path if we ever brick display via a bad kernel patch.
- **Default credentials:** user `orangepi`, password `orangepi`, sudo works.

### What's NOT working — the ONE remaining blocker

**The Waveshare round HDMI display shows nothing.** Xorg is rendering, but the picture never reaches the panel. This is the entire reason we haven't moved forward to the kiosk / voice work.

## The display blocker — full detail

### Symptom
- Xorg is running, `card0-HDMI-A-1` is `enabled` and `connected` in `/sys/class/drm/`, but `card0-HDMI-A-1/modes` is empty — kernel has NOT committed any mode.
- `dmesg` shows a rapid HPD (hotplug detect) connect/disconnect loop with repeated EDID re-reads and this error every time:
  ```
  sunxi-drm soc@3000000:sunxi-drm: [drm] User-defined mode not supported:
    "720x720": 78 59400 720 760 800 1000 720 744 748 760 0x68 0xa
  ```
  Type flags include `DRM_MODE_TYPE_USERDEF` (0x20).
- Also seen: `[drm] sunxi-hdmi: [error] dw edid parse dtd timing pixel clock[0KHz] invalid!` — one of the display's EDID detailed-timing-descriptors has a corrupt pixel clock, but 18 modes still parse successfully.

### Root cause (confirmed via inspection)
- The Waveshare display's EDID advertises 720x720@78Hz as its preferred (and effectively only useful) mode.
- The Allwinner `sunxi-drm` vendor kernel driver has a **hardcoded mode whitelist** (1280x720@60/50/59.9, 720x480, 640x480, 1440x480i). 720x720@78Hz is not in it.
- The driver's mode validator **rejects the `DRM_MODE_TYPE_USERDEF` flag category outright**, so any user-defined modeline (Xorg or cmdline) is rejected before individual timing validation even runs.
- Zero-overlap between "what the display advertises" and "what the driver accepts" = kernel commits no mode = panel gets no signal.
- **No DT knob exists to override this.** The HDMI DT node at `/sys/firmware/devicetree/base/soc@3000000/hdmi0@5520000/` has no `display-timings` subnode, no `hdmi_forced_mode`, no `edid-override` property. Only clock/power/CEC/HDCP/DDC properties. Verified.
- **All existing DT overlays under `/boot/dtb-6.6.98-sun60iw2/allwinner/overlay/` for display purposes are MIPI-DSI** (`sun60i-a733-opizero3w-lcd.dtbo` targets `dsi1combophy`, `dsi1`, `dlcd1`, `dsi_panel`). None address HDMI custom modes. Verified.

### Everything that has been tried and failed (do not re-propose)
| Attempt | Result |
|---|---|
| `video=HDMI-A-1:720x720@78e` in `/boot/orangepiEnv.txt` extraargs | Cmdline propagates but driver rejects (USERDEF) |
| `video=HDMI-A-1:720x720@60e` (recomputed refresh) | Same rejection |
| Xorg `Modeline` matching Waveshare's exact hdmi_timings | Rejected (USERDEF) |
| Xorg `Modeline` at 60Hz | Rejected (USERDEF) |
| Xorg config with `Modes "1280x720"` (driver-known mode) | Driver accepts the mode server-side, but Waveshare's EDID only advertises 720x720 so kernel has no common ground with display → still no commit |
| `drm.edid_firmware=HDMI-A-1:edid/1280x720.bin` | Cmdline propagates, kernel silently ignores it — this vendor driver bypasses `drm_kms_helper`'s EDID override framework |
| `drm_kms_helper.edid_firmware=HDMI-A-1:edid/1280x720.bin` | Same, ignored |
| Enable existing DT overlays | Only DSI overlays exist; enabling them would route display resources to a non-existent DSI panel and worsen HDMI |
| Physical replug, different SD cards, different OS image | Not the problem — Linux boots fine every time; only display doesn't render |
| FEL mode (USB recovery) | Zero 3W has no FEL button; FEL didn't enumerate |

### What is confirmed IMPOSSIBLE with this driver + display combo (short of code changes)
- Getting the driver to accept the display's advertised 720x720@78Hz mode
- Getting the display to accept any mode from the driver's hardcoded whitelist (Waveshare's HDMI receiver only agrees to its own advertised mode)

### The ONE remaining path forward: patch the sunxi-drm kernel module

The mode validator that rejects USERDEF is in the vendor kernel source. Modifying that check (either to accept USERDEF flag, or to add 720x720@78Hz to the whitelist) and rebuilding just the sunxi-drm module should unblock this. The patch itself is likely small (probably a one-liner in a `sunxi_drm_mode_valid()`-style function). The engineering effort is mostly in the toolchain setup, source tree navigation, and iterative test cycle.

Kernel source: <https://github.com/orangepi-xunlong/linux-orangepi>. DRM subsystem uses `AW_DRM_*` config symbols (AW_DRM, AW_DRM_DE, AW_DRM_HDMI, AW_DRM_TCON, etc.).

### Concrete next actions for whichever Claude is holding this bag next

1. **On-device grep first** — headers or partial source may already be installed:
   ```bash
   ls /usr/src/ 2>/dev/null
   ls /lib/modules/$(uname -r)/build 2>/dev/null
   dpkg -l | grep -iE 'linux-headers|linux-source|kernel-source'
   sudo grep -rn "User-defined mode not supported" /usr/src/ /lib/modules/$(uname -r)/ 2>/dev/null
   ```
2. **If nothing on-device, sparse-checkout the Orange Pi kernel** to keep the download small:
   ```bash
   mkdir -p ~/kernel-src && cd ~/kernel-src
   git clone --depth 1 --filter=blob:none --sparse https://github.com/orangepi-xunlong/linux-orangepi.git
   cd linux-orangepi
   git sparse-checkout set drivers/gpu/drm
   grep -rn "User-defined mode not supported" drivers/gpu/drm/
   ```
3. **Read the validator function** — likely a `mode_valid` callback registered on the HDMI connector/encoder. Understand what conditions it enforces beyond the USERDEF check.
4. **Draft a minimal patch** — start with the least-invasive change (usually: allow USERDEF-typed modes to pass, or add 720x720@78Hz to the whitelist). Save the diff separately for review before compiling.
5. **Build only the sunxi-drm module** against the running kernel's headers/config. Faster than full kernel rebuild. Need to match `.config` exactly for `insmod` to accept the module.
6. **Iterate carefully:** load patched module, check `dmesg` for successful mode commit + display coming alive. Bad patches = display stays dark + kernel taint / potentially crash. Serial UART is the emergency recovery lifeline; keep it wired.
7. **When it works:** create a persistent way to install the patched module (drop into `/lib/modules/$(uname -r)/updates/`, run `depmod`, ensure it loads before the vanilla module on boot).

### Access notes for the fresh Claude
- **This Claude (running on the Pi via SSH) has direct access** to everything under discussion. Files, `sudo`, `dmesg`, kernel source clones — all direct. Prior sessions were relaying through the user's copy-paste over SSH from a home Pi's Claude instance; that turned every diagnostic into a 4-step round trip. Now it's direct.
- **The user's Windows machine is separate from this Pi.** They have PuTTY connected to the Pi's UART and to SSH.
- **The user is patient but tired of this blocker** — many days invested. Favor tight, actionable steps with clear rollback paths. Don't run 5 exploratory commands when one targeted one will do.

### Key files/paths quick reference
| Path | Purpose |
|---|---|
| `/boot/orangepiEnv.txt` | U-Boot env → kernel cmdline. `.bak` backup exists next to it. |
| `/etc/X11/xorg.conf.d/10-waveshare-round.conf` | Xorg display config, currently sets `Modes "1280x720"`. Harmless with the driver deadlock but ready to be repurposed once driver accepts modes. |
| `/boot/dtb-6.6.98-sun60iw2/allwinner/overlay/` | DTB overlays (all DSI, none HDMI-relevant). |
| `/lib/firmware/edid/` | Pre-built generic EDID blobs. Driver ignores them but they're there. |
| `/var/log/Xorg.0.log` | Xorg's log — confirmed it does its job correctly, driver is the blocker. |
| `/proc/cmdline` | Current kernel cmdline — useful to verify orangepiEnv edits propagated. |
| `/sys/firmware/devicetree/base/soc@3000000/hdmi0@5520000/` | HDMI DT node — no useful override properties. |
| `/sys/class/drm/card0-HDMI-A-1/{enabled,status,modes}` | Live DRM state check. `modes` file empty = deadlock. |

## Rejected proposals (do not re-propose to the user)
- **Swap displays** — round LCD is central to the project's enclosure design and product concept. User has ruled this out multiple times.
- **Give up and use a rectangular monitor** — same reason as above.
- **Switch OS between Ubuntu and Debian** — kernel is identical, driver is identical, blocker is identical.
- **Try Armbian** — has no A733 support yet (their "Zero 3" image is for the H618 predecessor).
- **Try mainline Linux** — A733 mainline support is barely started (initial DTS v1 submitted, not accepted); not viable for daily driving.

## Suggested progression once the display works
1. Verify LightDM renders on the round LCD at native 720x720@78.
2. Port the Chromium kiosk configuration from the Zero 2W (Debian/Ubuntu userland is compatible enough).
3. Bring up the speedometer page as the first test.
4. **Stop and check in with the user before starting voice work.** The kiosk is the primary function; voice is additive.

Voice pipeline (wake word + AEC + STT + intent LLM + Discord voice client) is substantial enough to warrant its own planning session — don't jump straight into it.
