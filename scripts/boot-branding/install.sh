#!/usr/bin/env bash
#
# Install Baja Pi boot/shutdown branding on the Orange Pi Zero 3W:
#   - U-Boot logo         (/boot/boot.bmp, /boot/logo.bmp)
#   - Plymouth "baja" theme (boot: emblem + ring; shutdown: skull + pulse)
#   - quiet, LCD-clean boot (kernel console off the LCD, no cursor / Tux logo)
#
# Idempotent and safe to re-run (and to re-run after a reflash). Every file it
# touches is backed up to *.orig first. The serial UART (115200 8N1) is the
# recovery path if a boot ever goes wrong.
#
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then exec sudo "$0" "$@"; fi

HERE="$(cd "$(dirname "$0")" && pwd)"
ENVF=/boot/orangepiEnv.txt
THEME_DIR=/usr/share/plymouth/themes/baja

say() { printf '\n== %s\n' "$*"; }

command -v plymouth-set-default-theme >/dev/null 2>&1 || { echo "!! plymouth not installed"; exit 1; }

# 1/5 --------------------------------------------------------------------------
say "1/5  U-Boot logo (boot.bmp / logo.bmp)"
for f in boot.bmp logo.bmp; do
	[ -f "/boot/$f.orig" ] || cp -a "/boot/$f" "/boot/$f.orig"
	install -m 0644 "$HERE/$f" "/boot/$f"
done
echo "   installed (originals -> /boot/*.orig)"

# 2/5 --------------------------------------------------------------------------
say "2/5  Plymouth 'baja' theme"
install -d "$THEME_DIR"
install -m 0644 "$HERE/baja/"* "$THEME_DIR/"
plymouth-set-default-theme baja
echo "   theme installed and set default"

# 3/5 --------------------------------------------------------------------------
say "3/5  quiet, LCD-clean boot ($ENVF)"
[ -f "$ENVF.orig" ] || cp -a "$ENVF" "$ENVF.orig"
# Route the kernel console to serial only (no boot text on the LCD; serial UART
# stays as the recovery console).
if grep -q '^console=' "$ENVF"; then sed -i 's/^console=.*/console=serial/' "$ENVF"; else echo 'console=serial' >>"$ENVF"; fi
# quiet kernel + hide the console cursor + suppress the kernel (Tux) logo.
EXTRA='quiet vt.global_cursor_default=0 logo.nologo'
if grep -q '^extraargs=' "$ENVF"; then sed -i "s|^extraargs=.*|extraargs=$EXTRA|" "$ENVF"; else echo "extraargs=$EXTRA" >>"$ENVF"; fi
echo "   console=serial + extraargs applied (backup: $ENVF.orig)"

# 4/5 --------------------------------------------------------------------------
say "4/5  seamless handoff (no cursor blip, no gray flash)"
# a) No getty login on the LCD's VT -> kills the pre-splash cursor blip.
systemctl mask getty@tty1.service >/dev/null 2>&1 || true
# b) Retain the Plymouth splash on screen when it quits, so the emblem stays up
#    through the X handoff instead of dropping to a bare framebuffer.
install -d /etc/systemd/system/plymouth-quit.service.d
cat >/etc/systemd/system/plymouth-quit.service.d/retain-splash.conf <<'EOF'
[Service]
ExecStart=
ExecStart=-/usr/bin/plymouth quit --retain-splash
EOF
# c) Paint the X root black the instant X starts (before the session draws),
#    so the boot->desktop handoff is black instead of the default grey flash.
#    NOTE: we deliberately do NOT pass '-background none' -- on this vendor
#    display it exposes the raw (white) framebuffer and the desktop wallpaper
#    during the handoff instead of retaining the splash.
install -d /usr/local/bin
cat >/usr/local/bin/baja-black-root <<'EOF'
#!/bin/sh
# Run as root by LightDM's display-setup-script, right after X comes up.
export DISPLAY="${DISPLAY:-:0}"
[ -n "${XAUTHORITY:-}" ] || export XAUTHORITY=/var/run/lightdm/root/:0
xsetroot -solid '#000000' 2>/dev/null || true
EOF
chmod 0755 /usr/local/bin/baja-black-root
# d) Run the black-root script on display setup. We do NOT force the X cursor
#    off here ('-nocursor' would kill it for the whole session, including
#    desktop use with a mouse) -- unclutter (step e) hides it only when idle.
install -d /etc/lightdm/lightdm.conf.d
cat >/etc/lightdm/lightdm.conf.d/30-baja-seamless.conf <<'EOF'
[Seat:*]
display-setup-script=/usr/local/bin/baja-black-root
EOF
systemctl daemon-reload
# e) Ensure the unclutter-xfixes package is present. The pointer is actually
#    hidden-when-idle by the pm2 'cursor-hide' process (see ecosystem.config.cjs),
#    not by a desktop autostart -- consistent with the all-pm2 architecture.
if ! command -v unclutter >/dev/null 2>&1; then
	apt-get install -y unclutter-xfixes >/dev/null 2>&1 || echo "   (!) could not install unclutter-xfixes -- install it manually"
fi
echo "   getty@tty1 masked, retain-splash on, black root configured (cursor via pm2)"

# 5/5 --------------------------------------------------------------------------
say "5/5  rebuild initramfs (bakes in the Plymouth theme)"
update-initramfs -u >/dev/null 2>&1
echo "   done"

say "Installed. Reboot to see it."
echo "   Rollback: restore /boot/boot.bmp.orig, /boot/logo.bmp.orig, $ENVF.orig;"
echo "             rm /etc/systemd/system/plymouth-quit.service.d/retain-splash.conf"
echo "                /etc/lightdm/lightdm.conf.d/30-baja-seamless.conf"
echo "                /usr/local/bin/baja-black-root;"
echo "             systemctl unmask getty@tty1;"
echo "             then 'plymouth-set-default-theme <old>' and 'update-initramfs -u'."
