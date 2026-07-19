# Baja Pi — Maintenance

Ongoing operational concerns and recurring upkeep for the in-car Orange Pi Zero 3W.
Anything that must be re-done on a trigger — system updates, hardware swaps, periodic
checks — belongs here. One-off work goes in [`todo.md`](todo.md).

| Concern | Trigger | Action |
|---|---|---|
| Display fix drops after a kernel upgrade | Any `apt upgrade` of `linux-image-current-sun60iw2` | Re-run `sudo scripts/car-display-fix/install.sh`. A kernel upgrade rewrites the board DTB and drops the `force-output` edit — undoing the display fix and risking the CPU-pegging HDMI-HPD storm. The HPD systemd service and Xorg snippet survive updates on their own. |
| Panel goes dark while the Pi is still rendering | Screen is black but the Pi is clearly alive (SSH works, `pm2 list` healthy) | Reseat the panel, **not** the Pi. Confirm the Pi is still driving output — `import -window root` screenshot shows the gauge, `xrandr` shows `HDMI-1 connected 720x720` — then cold-reset the Waveshare panel: unplug **HDMI + both power feeds** (touch-connector power and USB), wait ~30s for caps to drain, reconnect **HDMI first, then power**. The panel's controller latches into a dark state and won't recover on its own; HDMI pin-18 +5V and a second USB feed keep it powered, so it never truly resets until all three are pulled. A software HDMI re-sync (`xrandr --output HDMI-1 --off` then `--auto`) is worth trying first but usually isn't enough. Do **not** reboot — the Pi isn't the problem. |
