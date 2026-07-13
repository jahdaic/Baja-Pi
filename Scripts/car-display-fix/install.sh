#!/usr/bin/env bash
#
# Waveshare 4" round HDMI LCD (720x720@78) display fix installer.
# Applies the three config-level fixes for the Orange Pi Zero 3W (A733, BSP kernel
# 6.6.98-sun60iw2). Works on both the Ubuntu and Debian BSP images (same kernel/driver).
#
# Idempotent: safe to re-run. Re-run after any kernel-package update (a kernel update
# rewrites the board DTB and drops the force-output edit — this restores it).
#
# Usage:  sudo ./install.sh
#
set -euo pipefail

TIMING="59400-720-760-800-1000-720-744-748-760"
NODE="/soc@3000000/hdmi0@5520000"
HPD_SYSFS="/sys/devices/virtual/hdmi/hdmi/attr/hpd_mask"
HERE="$(cd "$(dirname "$0")" && pwd)"

if [ "$(id -u)" -ne 0 ]; then exec sudo "$0" "$@"; fi

say() { printf '\n== %s\n' "$*"; }
ok()  { printf '   [ok] %s\n' "$*"; }
warn(){ printf '   [!!] %s\n' "$*" >&2; }

for t in fdtget fdtput systemctl; do
  command -v "$t" >/dev/null 2>&1 || { warn "missing required tool: $t"; exit 1; }
done

# ----------------------------------------------------------------------------
say "1/3  Device-tree: force 720x720@78 mode"
ENVF=/boot/orangepiEnv.txt
FDT="$(grep -E '^fdtfile=' "$ENVF" 2>/dev/null | cut -d= -f2- | tr -d '[:space:]' || true)"
[ -n "$FDT" ] || { warn "could not read fdtfile from $ENVF"; exit 1; }

DTB="/boot/dtb/$FDT"
[ -e "$DTB" ] || DTB="/boot/$FDT"
DTB_REAL="$(readlink -f "$DTB" 2>/dev/null || echo "$DTB")"
[ -f "$DTB_REAL" ] || { warn "active DTB not found: $DTB"; exit 1; }
ok "active DTB: $DTB_REAL"

if ! fdtget "$DTB_REAL" "$NODE" compatible >/dev/null 2>&1; then
  warn "HDMI node $NODE not present in this DTB — aborting DT step."
  warn "Find it with: fdtget -l \"$DTB_REAL\" /soc@3000000 | grep -i hdmi"
  exit 1
fi

[ -f "$DTB_REAL.orig" ] || { cp -a "$DTB_REAL" "$DTB_REAL.orig"; ok "backup: $DTB_REAL.orig"; }

cur="$(fdtget "$DTB_REAL" "$NODE" force-output 2>/dev/null || echo '')"
curt="$(fdtget "$DTB_REAL" "$NODE" force-output-timing 2>/dev/null || echo '')"
if [ "$cur" = "1" ] && [ "$curt" = "$TIMING" ]; then
  ok "force-output already set correctly"
else
  fdtput -t i "$DTB_REAL" "$NODE" force-output 1
  fdtput -t s "$DTB_REAL" "$NODE" force-output-timing "$TIMING"
  ok "force-output=1, timing=$TIMING applied"
fi

# ----------------------------------------------------------------------------
say "2/3  systemd service: hold HPD plugged in (hpd_mask=0x11)"
install -m 0644 "$HERE/waveshare-hdmi-hpd.service" \
        /etc/systemd/system/waveshare-hdmi-hpd.service
systemctl daemon-reload
systemctl enable waveshare-hdmi-hpd.service >/dev/null 2>&1 || true
ok "service installed + enabled"
if [ -e "$HPD_SYSFS" ]; then
  echo 0x11 > "$HPD_SYSFS" && ok "hpd_mask set live to 0x11"
else
  warn "hpd_mask sysfs not present yet ($HPD_SYSFS) — will apply on next boot"
fi

# ----------------------------------------------------------------------------
say "3/3  Xorg: disable DPMS / screen blanking"
XDIR=/etc/X11/xorg.conf.d
XCONF="$XDIR/10-waveshare-round.conf"
mkdir -p "$XDIR"
if [ -f "$XCONF" ] && [ ! -f "$XCONF.orig" ]; then cp -a "$XCONF" "$XCONF.orig"; ok "backup: $XCONF.orig"; fi
install -m 0644 "$HERE/10-waveshare-round.conf" "$XCONF"
ok "xorg snippet installed"

# ----------------------------------------------------------------------------
say "Verification"
printf '   force-output        = %s\n' "$(fdtget "$DTB_REAL" "$NODE" force-output 2>/dev/null)"
printf '   force-output-timing = %s\n' "$(fdtget "$DTB_REAL" "$NODE" force-output-timing 2>/dev/null)"
printf '   service enabled     = %s\n' "$(systemctl is-enabled waveshare-hdmi-hpd.service 2>/dev/null)"
printf '   xorg snippet        = %s\n' "$([ -f "$XCONF" ] && echo present || echo MISSING)"
[ -e "$HPD_SYSFS" ] && printf '   hpd_mask (live)     = %s\n' "$(sed -n 's/.*Current hpd mask value: //p' "$HPD_SYSFS" 2>/dev/null)"

say "Done. Reboot to confirm the panel comes up at 720x720@78 with no manual steps."
