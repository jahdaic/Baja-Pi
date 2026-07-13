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
			cwd: './GPS',
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
	],
};
