# Car Dashboard Display Blocker — SOLVED (Full Technical Writeup)

**Status: RESOLVED (2026-07-13).** The Waveshare 4" round HDMI LCD now renders a stable
720×720@78Hz desktop on the Orange Pi Zero 3W. This document is the authoritative record of
*what was actually wrong* and *exactly how it was fixed*, for any Claude instance (or human)
picking this up later. It supersedes the diagnosis in `car-dashboard-project.md`, which was
**partially wrong** (see "Where the original diagnosis was wrong" below).

Read this end-to-end before touching the display config. Spare-no-details is the intent.

---

## 0. TL;DR

The dark panel was **two stacked faults**, each of which looked like the entire problem:

1. **Driver software fault** — the vendor `sunxi-drm` HDMI driver rejects any mode with
   refresh `rate > 60`, and the panel's only useful mode is 720×720 **@78Hz**. So the kernel
   pruned every mode the panel advertised and committed nothing.
2. **Hardware power fault** — a **right-angle USB-C adapter** on the panel's `POWER` port was
   delivering voltage but ~0 A (bad VBUS path). Even after the signal was fixed, the panel
   couldn't light its backlight.

The fix is **three config-level changes** (NO kernel rebuild, NO module patch) plus removing
the bad adapter:

| Layer | Fix | Persistence |
|---|---|---|
| Driver mode validation | Device-tree `force-output` + `force-output-timing` on the HDMI node | Baked into the board DTB (or better: a `.dtbo` overlay) |
| Driver HPD flapping | Write `0x11` to the driver's `hpd_mask` sysfs knob | systemd oneshot service, ordered before the display manager |
| Xorg power saving | Disable DPMS + blank timers | `xorg.conf.d` snippet |
| Panel power | Remove the right-angle USB-C adapter | physical |

Everything here is **kernel-agnostic within the BSP** — it works identically on the Ubuntu and
Debian BSP images because both use the same vendor kernel (`6.6.98-sun60iw2`) and the same
`sunxi-drm` driver.

> **If you arrived here chasing a "100% CPU on all cores" problem** (not a dark screen): that is
> a *downstream symptom* of the same HPD flapping — the flap storm makes `xfsettingsd` spawn a
> swarm of `xfce4-display-settings` processes that peg every core. Same fix, no separate
> investigation needed. See **§3f**.

---

## 1. Hardware / OS context

- **SBC:** Orange Pi Zero 3W (Allwinner A733), 12 GB LPDDR5.
- **Display:** Waveshare 4" round HDMI touch LCD, native **720×720 @ 78Hz, pixel clock 59.4 MHz**.
  Two USB-C ports labeled **POWER** and **TOUCH**; HDMI for video.
- **OS at time of fix:** Ubuntu (Orange Pi BSP), kernel **`6.6.98-sun60iw2`**, vendor sunxi tree.
  Final target OS is **Debian bookworm XFCE** (same BSP kernel/driver — fixes port directly).
- **Access:** direct SSH to the Pi (user `orangepi` / pass `orangepi`, sudo works). Serial UART
  (FTDI, 115200 8N1) remains wired as the emergency-recovery path.

---

## 2. Where the original diagnosis (`car-dashboard-project.md`) was WRONG

The handoff doc concluded the blocker was a **hardcoded mode whitelist** in the driver and that
the only path forward was to **patch and rebuild the `sunxi-drm` kernel module**. Both are wrong:

- **It is NOT a resolution whitelist.** The driver's connector `mode_valid` callback
  (`_sunxi_drm_hdmi_mode_valid` in `bsp/drivers/drm/sunxi_drm_hdmi.c`) does essentially only this:
  ```c
  if (interlaced && vdisplay < 1080)      return MODE_BAD;   // interlace guard
  if (hdmi->hdmi_ctrl.drv_dts_force_mode) return MODE_OK;    // <-- built-in bypass!
  if (rate > 60)                          return MODE_BAD;   // <-- THIS killed 78Hz
  return MODE_OK;
  ```
  The real rejection is the **`rate > 60`** line. The "1280x720 / 720x480 / 640x480" table the
  old doc pointed at (`_sunxi_hdmi_default_modes`, ~line 248) is **only the fallback used when
  EDID cannot be read at all** — not our path (our EDID reads fine, 18 modes parse).

- **It is NOT a module.** `CONFIG_AW_DRM=y` — the DRM driver is **built statically into the
  kernel image** (`/boot/uImage`), not a loadable `.ko`. There is no `sunxi-drm.ko` anywhere.
  So "rebuild just the module and insmod it" is impossible; you'd have to rebuild the whole
  kernel. **We never needed to** — the driver already exposes the knobs we used.

- **The "User-defined mode not supported" dmesg line is a red herring.** It comes from generic
  `drivers/gpu/drm/drm_modes.c` (`drm_mode_prune_invalid`, ~line 1813) and is **only a
  diagnostic** printed when a mode that already failed validation happens to carry the
  `DRM_MODE_TYPE_USERDEF` type bit. It is not itself a rejecter. After our fix, this line still
  appears transiently during HPD re-probes but does not prevent the final commit.

---

## 3. Root causes, in full

### 3a. Driver rejects 78Hz (the `rate > 60` gate)

The panel advertises 720×720@78 as its preferred/only useful mode. The connector `mode_valid`
prunes anything over 60Hz, so **every** mode the panel offers is dropped → connector `modes`
file is empty → no mode committed → no signal. This is the primary software blocker.

**The driver already has an escape hatch:** if `drv_dts_force_mode` is set, `mode_valid` returns
`MODE_OK` unconditionally (bypassing the rate gate), and `get_modes` injects a mode supplied via
device tree. This is parsed in `__sunxi_hdmi_init_dts()` (`sunxi_drm_hdmi.c`, ~line 3066):

```c
ret = of_property_read_u32(node, "force-output", &value);          // node = the HDMI DT node
if (ret == 0) {
    ret = of_property_read_string(node, "force-output-timing", &dts_timming);
    if (ret == 0) {
        sscanf(dts_timing_string, "%d-%hu-%hu-%hu-%hu-%hu-%hu-%hu-%hu",
            &timming->clock,                                        // kHz
            &timming->hdisplay, &timming->hsync_start, &timming->hsync_end, &timming->htotal,
            &timming->vdisplay, &timming->vsync_start, &timming->vsync_end, &timming->vtotal);
        timming->type = DRM_MODE_TYPE_ALL;
        hdmi->hdmi_ctrl.drv_dts_force_mode = value;
        hdmi->hdmi_ctrl.drv_dts_mode = timming;
    }
}
```

So two DT properties on the HDMI node solve layer 1:
- `force-output = <1>;`
- `force-output-timing = "<clock>-<hdisp>-<hss>-<hse>-<htot>-<vdisp>-<vss>-<vse>-<vtot>";`

The mode struct comes from `drm_mode_create()` which is `kzalloc`'d, so `flags = 0` →
negative H/V sync, non-interlaced, which matches the panel.

### 3b. Deriving the exact timing string

From the panel's EDID modeline (seen in dmesg): `720x720: 78 59400 720 760 800 1000 720 744 748 760`
and cross-checked against Waveshare's Raspberry-Pi `hdmi_timings` line
(`720 0 40 40 200 720 0 24 4 12 0 0 0 78 0 59400000 0`):

| field | value | derivation |
|---|---|---|
| clock (kHz) | **59400** | 59.4 MHz pixel clock |
| hdisplay | **720** | h_active |
| hsync_start | **760** | 720 + 40 front porch |
| hsync_end | **800** | 760 + 40 sync width |
| htotal | **1000** | 800 + 200 back porch |
| vdisplay | **720** | v_active |
| vsync_start | **744** | 720 + 24 front porch |
| vsync_end | **748** | 744 + 4 sync width |
| vtotal | **760** | 748 + 12 back porch |

**→ `force-output-timing = "59400-720-760-800-1000-720-744-748-760"`**

### 3c. HPD (hotplug-detect) flapping

Once the mode was accepted, dmesg showed the driver doing a full modeset (`mode set: 720*720`,
TCON rate 59.4 MHz, `snps phy state: lock`, `enable output done`) — but then immediately tearing
it down: `hdmi drv detect hpd disconnect` → `has been disable!` → reconnect → repeat, several
times per second. `cat /sys/class/drm/card0-HDMI-A-1/status` bounced connected/disconnected.

**Cause:** the driver senses HPD in a **polling kthread** (`_sunxi_drv_hdmi_thread`) that reads
the physical HPD register with only a **50 ms debounce** (reads twice 50 ms apart). The panel/
cable HPD line toggles faster than that filters, so the driver constantly plugs/unplugs and each
cycle tears down the modeset. Forcing the *DRM connector* status "on"
(`echo on > .../status`) does **not** help — the teardown happens below the DRM layer, in the
driver's own IRQ/thread.

**The driver has a debug override:** the `hpd_mask` sysfs knob (handled by
`_sunxi_drv_hdmi_check_hpd_mask`). Flag values (defined in `sunxi_drm_hdmi.c` ~lines 67-70):

| value | meaning |
|---|---|
| `0x11` | **SUNXI_HDMI_HPD_FORCE_IN** — force HPD "plugged in", never plug out |
| `0x10` | SUNXI_HDMI_HPD_FORCE_OUT — force "unplugged" |
| `0x100` | SUNXI_HDMI_HPD_MASK_NOTIFY — mask notify |
| `0x1000` | SUNXI_HDMI_HPD_MASK_DETECT — mask detection entirely |

Writing **`0x11`** makes the thread force-plug-in once and then early-return on every subsequent
poll — it never calls plugout again, so the teardown loop stops and the modeset stays committed.

Sysfs path (note: NOT under `/sys/class/drm`): **`/sys/devices/virtual/hdmi/hdmi/attr/hpd_mask`**

### 3d. Xorg DPMS blanked it after it worked

With the mode committed and HPD held, the pipeline was live but the screen went dark again after
~10 minutes. `xset -q` reported **"Monitor is in Standby"** — Xorg's DPMS power-saving (600 s
standby timer) had blanked the output. Disabling DPMS + blank timers fixes it.

### 3f. Secondary symptom: all CPU cores pegged at 100% (the `xfce4-display-settings` swarm)

**Observed on the fresh Debian image (2026-07-13), before any fix was applied.** Every core sat
at 100%, load average climbed past **250** on an 8-core board, and the desktop was sluggish. This
is the **same HPD flapping root cause as §3c**, surfacing at the desktop layer instead of the
driver layer:

- The HDMI connector flaps connected/disconnected several times per second at boot (§3c).
- Each flap emits an RandR/display-change event. XFCE's settings daemon **`xfsettingsd`** reacts
  to every one by spawning a fresh **`xfce4-display-settings -m`** process to re-apply display
  config. During the boot storm it spawns *dozens* (observed 80+), which never exit cleanly —
  they pile up, and the spawn churn plus `Xorg`/`dbus-daemon` re-probing pegs every core.
- Tell-tale `ps` signature: many `xfce4-display-settings` processes (all parented to
  `xfsettingsd`), `Xorg` and `dbus-daemon` hot, load average in the hundreds.

**The fix is identical to the display fix** — pinning `hpd_mask=0x11` early (§4b) stops the flap,
so `xfsettingsd` gets no event storm and never spawns the swarm. The `force-output` DT change
(§4a) further ensures a clean single modeset at boot. After applying the fix live, confirm:

```bash
pgrep -c -f xfce4-display-s        # should be 0 (or a single stable process), not growing
grep -o 'Current hpd mask value: .*' /sys/devices/virtual/hdmi/hdmi/attr/hpd_mask   # 0x11
uptime                             # load average decays back toward normal within a minute
```

Any leftover swarm from a pre-fix boot is stale and safe to clear without a reboot:
`sudo pkill -f 'xfce4-display-settings -m'` (kills the stale dialogs, not the `xfsettingsd`
daemon). A reboot with the HPD service enabled prevents the storm from ever starting.

### 3e. The hardware power fault

Independently, the panel measured **5.1 V but 0 A** at its `POWER` USB-C port → no backlight,
blank screen, *even with a confirmed-good HDMI signal*. Root cause: a **right-angle USB-C
adapter** on the POWER port with a bad VBUS path (voltage present, no current path to the load —
classic open-circuit signature). **Removing the adapter fixed it.**

Note on power: the panel's **TOUCH** USB-C port also carries 5 V VBUS and can power the whole
board on its own (the two ports' 5 V rails are effectively bridged, and the panel draws only a
few hundred mA). During dev it is currently powered via TOUCH → a 4-port USB hub → the Pi's
USB-C. For the car build, prefer powering the panel from a dedicated car 5 V rail (POWER port,
or a self-powered hub) so the backlight load does not ride on the Pi's power budget.

---

## 4. THE FIX — exact steps as applied (Ubuntu, kernel 6.6.98-sun60iw2)

> All three software changes are already applied on the current Ubuntu image. This section
> documents exactly what was done so it can be reproduced/ported.

### 4a. Device-tree: force the mode

Active DTB (via `fdtfile` in `/boot/orangepiEnv.txt`, loaded by U-Boot as
`${prefix}dtb/${fdtfile}`; `/boot/dtb` → `/boot/dtb-6.6.98-sun60iw2`):

```
/boot/dtb-6.6.98-sun60iw2/allwinner/sun60i-a733-orangepi-zero3w.dtb
```

HDMI node: `/soc@3000000/hdmi0@5520000`. Applied with `fdtput` (backup saved as `.orig`):

```bash
DTB=/boot/dtb-6.6.98-sun60iw2/allwinner/sun60i-a733-orangepi-zero3w.dtb
NODE=/soc@3000000/hdmi0@5520000
sudo cp -a "$DTB" "$DTB.orig"                        # backup
sudo fdtput -t i "$DTB" "$NODE" force-output 1
sudo fdtput -t s "$DTB" "$NODE" force-output-timing "59400-720-760-800-1000-720-744-748-760"
# verify:
fdtget "$DTB" "$NODE" force-output                   # -> 1
fdtget "$DTB" "$NODE" force-output-timing            # -> 59400-720-760-800-1000-720-744-748-760
```

**CAVEAT:** editing the compiled DTB in place is clobbered by any kernel-package update
(`apt upgrade` of `linux-image-current-sun60iw2`). For the permanent image, prefer a **DT
overlay** instead (see §6, "Debian bundle") — it survives kernel updates.

### 4b. systemd service: hold HPD plugged in

`/etc/systemd/system/waveshare-hdmi-hpd.service`:

```ini
[Unit]
Description=Force HDMI HPD plugin (hpd_mask=0x11) for Waveshare round LCD
After=sysinit.target
Before=display-manager.service
ConditionPathExists=/sys/devices/virtual/hdmi/hdmi/attr/hpd_mask

[Service]
Type=oneshot
ExecStart=/bin/sh -c 'echo 0x11 > /sys/devices/virtual/hdmi/hdmi/attr/hpd_mask'
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now waveshare-hdmi-hpd.service
```

Ordered `Before=display-manager.service` so HPD is stable before Xorg's first modeset → the
desktop comes up clean at 720×720 with no flap window visible to the user.

### 4c. Xorg: disable DPMS / blanking

`/etc/X11/xorg.conf.d/10-waveshare-round.conf` (backup of the original `.orig`; the original had
a stale `Modes "1280x720"` line that we dropped so Xorg auto-selects the connector's *preferred*
720×720@78 mode):

```
Section "ServerFlags"
    Option "BlankTime"   "0"
    Option "StandbyTime" "0"
    Option "SuspendTime" "0"
    Option "OffTime"     "0"
EndSection

Section "Monitor"
    Identifier "HDMI-A-1"
    Option "DPMS" "false"
EndSection

Section "Screen"
    Identifier   "Screen0"
    Monitor      "HDMI-A-1"
    DefaultDepth 24
EndSection
```

(Runtime equivalent, if needed without restarting X: `xset -dpms; xset s off`.)

### 4d. Hardware

Remove the right-angle USB-C adapter from the panel's POWER port. Ensure a clean 5 V path (via
POWER on a good cable, or via the TOUCH port / a self-powered hub).

---

## 5. Verifying success

```bash
# Connector + committed mode (as the orangepi user, with X running):
export DISPLAY=:0 XAUTHORITY=/var/run/lightdm/root/:0
xrandr --query | grep -A5 HDMI       # expect: HDMI-1 connected 720x720+0+0, mode "78.16*+"
xset -q | grep -i "Monitor is"       # expect: Monitor is On

# Driver / DRM state:
cat /sys/class/drm/card0-HDMI-A-1/status                       # connected (stable)
sudo cat /sys/devices/virtual/hdmi/hdmi/attr/hpd_mask          # Current hpd mask value: 0x11
sudo cat /sys/kernel/debug/dri/0/state | grep -iE 'crtc|fb|720' # DE-0 enable=1, fb 720x720

# The forced mode has an EMPTY name (drm_mode_create never names it), so in
# /sys/class/drm/card0-HDMI-A-1/modes it appears as a BLANK first line, and xrandr shows only
# the refresh ("78.16*+") with no resolution label. This is expected, not a bug.
```

dmesg on a healthy boot shows: `hdmi drv add dts mode done`, `snps phy state: lock`,
`hdmi drv enable output done`, `drm hdmi atomic enable`, and a *stable* `detect: connect`
(no repeating disconnect/disable cycle).

---

## 6. Porting to Debian (the final image)

A fresh Debian flash **wipes all three fixes** — they must be re-applied. Because Debian uses the
same BSP kernel and `sunxi-drm` driver, the fixes behave identically.

> **⚠️ BEFORE YOU REFLASH: save the bundle off the SD card.** The install bundle lives at
> `~/car-display-fix/` on the *current* image and **will be erased by the flash** along with
> everything else. Copy it somewhere off-device first, e.g.:
> ```bash
> # to a USB stick:                  or   # to another machine over the network:
> cp -r ~/car-display-fix /media/usb/      scp -r ~/car-display-fix user@host:~/
> ```
> After flashing Debian and booting, copy it back onto the Pi (e.g. `~/car-display-fix/`) and run
> the installer from there. If you lose the bundle, it can be recreated from §4 of this doc (the
> `install.sh`, the `.service`, and the `.conf` are all reproduced there and in §8).

Recommended approach for the permanent image (differs from §4a to survive kernel updates):

1. **DT force-output as an overlay** (not an in-place DTB edit). Create a `.dts` targeting the
   HDMI node, e.g.:
   ```dts
   /dts-v1/;
   /plugin/;
   &{/soc@3000000/hdmi0@5520000} {
       force-output = <1>;
       force-output-timing = "59400-720-760-800-1000-720-744-748-760";
   };
   ```
   Compile with `dtc -@ -I dts -O dtb -o waveshare-round.dtbo waveshare-round.dts`, drop it in the
   board's user-overlay dir, and reference it via `user_overlays=` in `/boot/orangepiEnv.txt`.
   (Verify the exact overlay dir + `overlay_prefix` on the Debian image; on this Ubuntu image the
   loader path is `${prefix}dtb/allwinner/overlay/` for kernel overlays and
   `${prefix}overlay-user/` for user overlays — see `/boot/boot.cmd`. If the overlay mechanism
   proves fiddly on Debian's U-Boot, fall back to the in-place `fdtput` edit from §4a and just
   remember to re-apply it after any kernel update.)
2. **systemd service** — identical to §4b.
3. **Xorg snippet** — identical to §4c.

### Running the bundle (the easy path)

A ready-to-run bundle lives at `~/car-display-fix/` (built alongside this doc):

| File | Purpose |
|---|---|
| `install.sh` | one-shot installer: applies all three fixes, prints a verification summary |
| `waveshare-hdmi-hpd.service` | the HPD systemd unit (§4b) |
| `10-waveshare-round.conf` | the Xorg DPMS-off snippet (§4c) |
| `waveshare-round-hdmi.dts` | optional DT overlay (kernel-update-durable alternative to §4a) |
| `README.md` | short usage + rollback reference |

```bash
cd ~/car-display-fix
sudo ./install.sh      # idempotent — safe to re-run; auto-detects the DTB path
sudo reboot            # then confirm with §5
```

The installer:
- is **idempotent** — re-running is safe and just reconfirms state (validated this way on Ubuntu).
- **auto-detects** the active DTB from `fdtfile` in `/boot/orangepiEnv.txt`, so it works unchanged
  on Debian.
- by default does the in-place `fdtput` DTB edit (most reliable). **Re-run it after any kernel
  package update** (`apt upgrade` of `linux-image-current-sun60iw2` rewrites the DTB and drops the
  force-output edit). Alternatively switch to the overlay (above) to avoid that entirely.

**Then validate with §5** — the same checks used to confirm the reboot on Ubuntu:
`xrandr` shows `HDMI-1 ... 720x720 ... 78.16*+`, `hpd_mask` reads `0x11`, connector `status` is a
stable `connected`, and `dmesg | grep -c "hpd disconnect"` returns `0`.

**Confirm on Debian after flashing:** the HDMI node path (`/soc@3000000/hdmi0@5520000`), the
`fdtfile` name, and the `hpd_mask` sysfs path are all unchanged from Ubuntu (same DTS + driver),
but re-verify with `find /sys -name hpd_mask` and `fdtget <dtb> <node> compatible` before assuming.

---

## 7. Rollback / recovery

| Symptom after a change | Rollback |
|---|---|
| Blank desktop / X won't start | `sudo cp /etc/X11/xorg.conf.d/10-waveshare-round.conf.orig /etc/X11/xorg.conf.d/10-waveshare-round.conf && sudo systemctl restart display-manager` |
| Flapping returns | `echo 0x11 \| sudo tee /sys/devices/virtual/hdmi/hdmi/attr/hpd_mask` (live), then check `systemctl status waveshare-hdmi-hpd` |
| Total display regression | `sudo cp <dtb>.orig <dtb> && sudo reboot` (restores un-forced DTB) |
| Need early-boot debug | serial UART (FTDI, 115200 8N1) is wired; kernel console is on `ttyS0` |

Emergency: the vendor kernel (`uImage`) was never modified, so the system always boots to a
usable SSH state even if every display change is wrong.

---

## 8. Key files / paths quick reference

| Path | Purpose |
|---|---|
| `/boot/dtb-6.6.98-sun60iw2/allwinner/sun60i-a733-orangepi-zero3w.dtb` | Active board DTB (has `force-output`); `.orig` backup beside it |
| `/boot/orangepiEnv.txt` | U-Boot env (`fdtfile`, `overlays`, `extraargs`). Still has a harmless leftover `extraargs=drm_kms_helper.edid_firmware=...1280x720.bin` from a failed attempt — driver ignores it; safe to remove |
| `/boot/boot.cmd` / `boot.scr` | U-Boot script; loads `${prefix}dtb/${fdtfile}`, applies `overlays`/`user_overlays` |
| `/etc/systemd/system/waveshare-hdmi-hpd.service` | Sets `hpd_mask=0x11` at boot |
| `/etc/X11/xorg.conf.d/10-waveshare-round.conf` | DPMS off + blank timers off; `.orig` backup beside it |
| `/sys/devices/virtual/hdmi/hdmi/attr/hpd_mask` | Live HPD override knob (`0x11` = force plugged in) |
| `/sys/class/drm/card0-HDMI-A-1/{status,enabled,modes}` | Live connector state |
| `/sys/kernel/debug/dri/0/state` | Live KMS commit state (CRTC/fb) |
| `~/kernel-src/linux-orangepi` | Sparse checkout for reference (branch `orange-pi-6.6-sun60iw2`; dirs `drivers/gpu/drm` + `bsp/drivers/drm`) |

### Driver source landmarks (`bsp/drivers/drm/sunxi_drm_hdmi.c`)
- `_sunxi_drm_hdmi_mode_valid` (~2737) — the `rate > 60` gate + `drv_dts_force_mode` bypass
- `_sunxi_drm_hdmi_get_modes` (~2654) — injects the DTS mode when `force-output` is set
- `__sunxi_hdmi_init_dts` (~3017) — parses `force-output` / `force-output-timing`
- `_sunxi_drv_hdmi_thread` (~1457) — HPD polling kthread, 50 ms debounce
- `_sunxi_drv_hdmi_check_hpd_mask` (~1432) — `hpd_mask` handling
- HPD flag defines: `SUNXI_HDMI_HPD_FORCE_IN 0x11` etc. (~67-70)

---

## 9. Next milestones (unchanged from the project plan)

Display is done. Per `car-dashboard-project.md`:
1. (If not already) **switch to Debian** using the §6 bundle, verify display.
2. **Port the Chromium kiosk** config from the Zero 2W.
3. Bring up the **speedometer** page as the first test.
4. **Check in with the user before voice work.**
