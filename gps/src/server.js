const http = require('http');
const gpsd = require('node-gpsd-client');
const { WebSocketServer, WebSocket } = require('ws');

const PORT = process.env.PORT || 8000;
const STALE_MS = 5000; // a fix older than this is reported as stale (GPS signal lost)

let values = {};        // last TPV (time-position-velocity) report from gpsd
let lastFixAt = null;   // epoch ms when that report arrived (null = none yet)
let sky = {};           // last SKY (satellite) report from gpsd

// Summarize the latest SKY report: counts + signal strength + per-satellite detail.
const buildSatellites = () => {
	const list = Array.isArray(sky.satellites) ? sky.satellites : [];
	const snrs = list.map(s => s.ss).filter(v => typeof v === 'number' && v > 0);
	return {
		seen: typeof sky.nSat === 'number' ? sky.nSat : list.length, // satellites in view (incl. almanac-predicted, no signal)
		tracked: snrs.length, // satellites actually being received (SNR > 0)
		used: typeof sky.uSat === 'number' ? sky.uSat : list.filter(s => s.used).length, // used in the fix
		snr: {
			// signal strength (dB-Hz) across satellites reporting a value
			max: snrs.length ? Math.max(...snrs) : null,
			avg: snrs.length ? Math.round((snrs.reduce((a, b) => a + b, 0) / snrs.length) * 10) / 10 : null,
		},
		hdop: typeof sky.hdop === 'number' ? sky.hdop : null, // horizontal dilution of precision
		list: list.map(s => ({
			prn: s.PRN,
			gnss: s.gnssid,      // constellation id (0 GPS, 2 Galileo, 3 BeiDou, 6 GLONASS, ...)
			elevation: s.el,
			azimuth: s.az,
			snr: s.ss,
			used: !!s.used,
		})),
	};
};

// Build the wire payload: the latest TPV plus freshness + satellite metadata.
const buildPayload = () => {
	const age = lastFixAt === null ? null : Date.now() - lastFixAt;
	return {
		...values,
		receivedAt: lastFixAt,                    // epoch ms of last fix, null until first one
		age,                                      // ms since last fix, null until first one
		stale: age === null || age > STALE_MS,    // true = signal lost (>5s old or never seen)
		satellites: buildSatellites(),            // in view / used / signal strength
	};
};

// ---- HTTP endpoint (health check / fallback; unchanged contract) ----
const server = http.createServer((request, response) => {
	response.writeHead(200, {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
	});
	response.end(JSON.stringify(buildPayload()));
});

// ---- WebSocket (live push) sharing the same HTTP server/port ----
const wss = new WebSocketServer({ server });

const broadcast = payload => {
	const json = JSON.stringify(payload);
	for (const ws of wss.clients) {
		if (ws.readyState === WebSocket.OPEN) ws.send(json);
	}
};

wss.on('connection', ws => {
	console.log(`WS client connected (${wss.clients.size} total)`);
	ws.send(JSON.stringify(buildPayload())); // send current state immediately
	ws.on('close', () => console.log(`WS client disconnected (${wss.clients.size} total)`));
	ws.on('error', err => console.log(`WS error: ${err.message}`));
});

// ---- gpsd source ----
const client = new gpsd({
	port: 2947,
	hostname: 'localhost',
	parse: true,
	reconnectThreshold: 15,
	reconnectInterval: 5,
});

client.on('connected', () => {
	console.log('GPSD Connected');
	client.watch({ class: 'WATCH', json: true, scaled: true });
});

client.on('error', err => console.log(`Error: ${err.message}`));

client.on('TPV', data => {
	values = data;
	lastFixAt = Date.now();
	broadcast(buildPayload()); // push the moment gpsd delivers a report
});

client.on('SKY', data => {
	sky = data;
	broadcast(buildPayload()); // push updated satellite info
});

client.connect();

server.listen(PORT, () => {
	console.log(`GPS server (HTTP + WS) listening on :${PORT}`);
});
