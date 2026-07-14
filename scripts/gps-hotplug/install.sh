#!/usr/bin/env bash
#
# Install the GPS hotplug udev rule so the pm2-managed gpsd re-attaches the
# u-blox receiver when it is (re)plugged in. Idempotent — safe to re-run, and
# to run after a reflash.
#
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then exec sudo "$0" "$@"; fi

HERE="$(cd "$(dirname "$0")" && pwd)"
RULE=99-gpsd-hotplug.rules
DEST=/etc/udev/rules.d/$RULE

command -v gpsdctl >/dev/null 2>&1 || [ -x /usr/sbin/gpsdctl ] || {
	echo "!! gpsdctl not found (install the 'gpsd' package)"; exit 1;
}

install -m 0644 "$HERE/$RULE" "$DEST"
udevadm control --reload-rules

echo "Installed $DEST and reloaded udev rules."
echo "Re-attach happens automatically on the next unplug/replug; no gpsd restart needed."
