# Waveshare Round LCD — Display Fix Bundle

Re-applies the Orange Pi Zero 3W display fix (Waveshare 4" round 720×720@78 HDMI panel) on a
fresh OS image. Works on both the Ubuntu and Debian BSP images (identical kernel `6.6.98-sun60iw2`
and `sunxi-drm` driver). Full technical background: [`docs/car-dashboard-display-fix.md`](../../docs/car-dashboard-display-fix.md).

## What it does
1. **DT force-output** — adds `force-output` + `force-output-timing` to the HDMI node so the
   driver accepts the panel's 720×720@**78Hz** mode (bypasses the driver's `rate > 60` rejection).
2. **HPD service** — installs/enables a systemd unit that writes `hpd_mask=0x11`, stopping the
   HDMI hotplug-detect flapping that otherwise tears down the modeset.
3. **Xorg snippet** — disables DPMS + blank timers so the panel never sleeps.

## Usage
```bash
sudo scripts/car-display-fix/install.sh   # from the repo root
sudo reboot                                # verify it comes up at 720x720@78 with no manual steps
```
Idempotent — safe to re-run. **Re-run after any kernel update** (`apt upgrade` rewrites the board
DTB and drops the force-output edit).

## Files
| File | Purpose |
|---|---|
| `install.sh` | One-shot installer (applies all three fixes, prints verification) |
| `waveshare-hdmi-hpd.service` | systemd unit → `hpd_mask=0x11` before the display manager |
| `10-waveshare-round.conf` | Xorg DPMS-off snippet |
| `waveshare-round-hdmi.dts` | Optional DT overlay (kernel-update-durable alternative to the in-place DTB edit) |

## Overlay alternative (durable against kernel updates)
The installer edits the board DTB in place (reliable, but a kernel update overwrites it). For a
permanent image you can instead use the overlay:
```bash
dtc -@ -I dts -O dtb -o waveshare-round-hdmi.dtbo waveshare-round-hdmi.dts
# place .dtbo in the board user-overlay dir and add its name to user_overlays= in
# /boot/orangepiEnv.txt  (verify the exact dir on your image via /boot/boot.cmd)
```

## Rollback
```bash
# display regression: restore the un-forced DTB (path printed by install.sh)
sudo cp <dtb>.orig <dtb> && sudo reboot
# X won't start: restore xorg snippet
sudo cp /etc/X11/xorg.conf.d/10-waveshare-round.conf.orig /etc/X11/xorg.conf.d/10-waveshare-round.conf
sudo systemctl restart display-manager
# disable HPD service
sudo systemctl disable --now waveshare-hdmi-hpd.service
```
