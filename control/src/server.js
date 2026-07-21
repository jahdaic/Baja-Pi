const http = require('http');
const { execFile } = require('child_process');

// Localhost-only by design: this endpoint reboots/powers off the Pi, so it must
// never be reachable from the network. Bind to 127.0.0.1 and keep it there.
const PORT = process.env.PORT || 8100;
const HOST = process.env.HOST || '127.0.0.1';

// Fixed allowlist: action -> [command, [args]]. Commands run via execFile (no
// shell) with hard-coded args, so nothing from the request ever reaches a
// command line — there is no injection surface. `reboot`/`poweroff` go through
// sudo (scoped NOPASSWD rule, see scripts/control-server/install.sh); the pm2
// actions run as the same user that owns the apps, so they need no privileges.
const ACTIONS = {
	reboot: ['sudo', ['reboot']],
	shutdown: ['sudo', ['poweroff']],
	'chromium-stop': ['pm2', ['stop', 'chromium-kiosk']],
	'chromium-restart': ['pm2', ['restart', 'chromium-kiosk']],
};

const send = (res, code, body) => {
	res.writeHead(code, {
		'Content-Type': 'application/json',
		// Bound to localhost, so the caller is always same-machine.
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
	});
	res.end(JSON.stringify(body));
};

const run = action => {
	const [cmd, args] = ACTIONS[action];
	execFile(cmd, args, (err, _stdout, stderr) => {
		if (err) console.error(`control: '${action}' failed: ${stderr || err.message}`);
		else console.log(`control: '${action}' ok`);
	});
};

const server = http.createServer((req, res) => {
	if (req.method === 'OPTIONS') return send(res, 204, {});

	if (req.method === 'GET' && req.url === '/') {
		return send(res, 200, { ok: true, actions: Object.keys(ACTIONS) });
	}

	if (req.method === 'POST' && req.url === '/control') {
		let raw = '';
		req.on('data', chunk => {
			raw += chunk;
			if (raw.length > 10000) req.destroy(); // no legitimate body is this big
		});
		req.on('end', () => {
			let action;
			try {
				action = JSON.parse(raw || '{}').action;
			} catch {
				return send(res, 400, { ok: false, error: 'invalid JSON' });
			}
			if (!ACTIONS[action]) return send(res, 400, { ok: false, error: `unknown action: ${action}` });

			// Acknowledge first, then fire once the response has flushed: reboot,
			// shutdown, and chromium-stop tear the client down, so the reply has
			// to leave before the command runs or the UI never hears back.
			send(res, 200, { ok: true, action });
			res.on('finish', () => run(action));
		});
		return;
	}

	send(res, 404, { ok: false, error: 'not found' });
});

server.listen(PORT, HOST, () => {
	console.log(`Control server listening on ${HOST}:${PORT} — actions: ${Object.keys(ACTIONS).join(', ')}`);
});
