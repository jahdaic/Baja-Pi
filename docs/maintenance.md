# Baja Pi — Maintenance

Ongoing operational concerns and recurring upkeep for the in-car Orange Pi Zero 3W.
Anything that must be re-done on a trigger — system updates, hardware swaps, periodic
checks — belongs here. One-off work goes in [`todo.md`](todo.md).

| Concern | Trigger | Action |
|---|---|---|
| Display fix drops after a kernel upgrade | Any `apt upgrade` of `linux-image-current-sun60iw2` | Re-run `sudo scripts/car-display-fix/install.sh`. A kernel upgrade rewrites the board DTB and drops the `force-output` edit — undoing the display fix and risking the CPU-pegging HDMI-HPD storm. The HPD systemd service and Xorg snippet survive updates on their own. |
