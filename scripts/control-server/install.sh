#!/usr/bin/env bash
#
# Install the scoped sudoers rule that lets the control-server (running as the
# login user under pm2) reboot / power off the Pi without a password prompt.
# This is the only privilege the long-press control menu needs — the Chromium
# actions run as the same user via pm2 and need nothing.
#
# Idempotent — safe to re-run, and to run after a reflash. Validates the rule
# with `visudo -c` before installing so a bad edit can never lock you out of sudo.
#
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then exec sudo "$0" "$@"; fi

USER_NAME="${SUDO_USER:-orangepi}"
REBOOT="$(command -v reboot || echo /sbin/reboot)"
POWEROFF="$(command -v poweroff || echo /sbin/poweroff)"
DEST=/etc/sudoers.d/010-baja-control
TMP="$(mktemp)"

cat > "$TMP" <<EOF
# Baja control-server: let the dashboard's long-press menu reboot / shut down
# the Pi without a password. Managed by scripts/control-server/install.sh.
$USER_NAME ALL=(root) NOPASSWD: $REBOOT, $POWEROFF
EOF

chmod 0440 "$TMP"

if visudo -cf "$TMP"; then
	install -m 0440 -o root -g root "$TMP" "$DEST"
	rm -f "$TMP"
	echo "Installed $DEST:"
	cat "$DEST"
else
	rm -f "$TMP"
	echo "sudoers validation failed — not installed" >&2
	exit 1
fi
