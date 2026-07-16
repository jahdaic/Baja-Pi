// PM2 process definitions for the Baja car-dashboard monorepo.
//
// Every long-running project process is defined here (see Docs/car-dashboard-architecture.md).
// Bring up / persist:
//   pm2 start ecosystem.config.cjs
//   pm2 save            # snapshot the process list
//   pm2 startup         # (once) install the boot service that resurrects pm2
//
// Note: the system gpsd.socket / gpsd.service are masked — pm2 owns gpsd here.

// Stable by-id path for the u-blox 8 GNSS receiver (survives ttyACM* renumbering).
const GPS_DEVICE =
	'/dev/serial/by-id/usb-u-blox_AG_-_www.u-blox.com_u-blox_GNSS_receiver-if00';

// gpsd control socket — user-writable runtime dir (linger enabled so it exists at boot).
const GPSD_CONTROL_SOCKET = '/run/user/1000/gpsd.sock';

module.exports = {
	apps: [
		{
			name: 'gpsd',
			script: '/usr/sbin/gpsd',
			interpreter: 'none', // native binary, not a node script
			// -N: stay in the foreground so pm2 can supervise (gpsd daemonizes by default)
			// -n: poll the receiver continuously, don't wait for a client to connect
			// -F: control socket — keeps gpsd up even if the device is absent, and lets a
			//     device be hot-added later:  GPSD_SOCKET=<sock> gpsdctl add /dev/ttyACM0
			args: `-N -n -F ${GPSD_CONTROL_SOCKET} ${GPS_DEVICE}`,
			autorestart: true,
		},
		{
			name: 'gps-server',
			cwd: './gps',
			script: 'src/server.js',
			// Node HTTP bridge: connects to gpsd on :2947 and serves the latest
			// TPV as JSON (with a staleness flag) to the UI. It reconnects to
			// gpsd on its own, so start order relative to the gpsd app above
			// doesn't matter.
			env: {
				PORT: '8000',
			},
			autorestart: true,
		},
		{
			name: 'ui-vite',
			cwd: './ui',
			// Serve the dashboard via the Vite dev server (HMR) for now. Run the
			// vite binary directly (not `npm run dev`) so pm2 supervises the vite
			// process itself. Host/port come from vite.config.ts (host: true,
			// port: 5173). TODO: swap to a static server for the built dist/ once
			// the kiosk is finalized.
			script: 'node_modules/vite/bin/vite.js',
			autorestart: true,
		},
		{
			name: 'chromium-kiosk',
			cwd: './ui',
			// Opens the dashboard fullscreen on the LCD. The script sets
			// DISPLAY/XAUTHORITY and waits for X + the UI server before exec'ing
			// Chromium, so it tolerates the boot race with the desktop session.
			script: 'bin/chromium-kiosk',
			interpreter: 'none', // bash script (has its own shebang)
			autorestart: true,
			restart_delay: 3000,
		},
		{
			name: 'cursor-hide',
			cwd: './ui',
			// Hides the mouse pointer when idle and reveals it on movement, so the
			// kiosk stays pointer-free while the desktop remains usable with a
			// Bluetooth mouse/keyboard. The script waits for X, then exec's
			// unclutter in the foreground so pm2 supervises it directly.
			// (Requires the unclutter-xfixes package.)
			script: 'bin/cursor-hide',
			interpreter: 'none', // bash script (has its own shebang)
			autorestart: true,
			restart_delay: 3000,
		},
	],
};
