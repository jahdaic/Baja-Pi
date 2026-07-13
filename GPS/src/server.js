const http = require('http');
const gpsd = require('node-gpsd-client');

const PORT = process.env.PORT || 8000;
const STALE_MS = 5000; // a fix older than this is reported as stale (GPS signal lost)

let values = {};        // last TPV (time-position-velocity) report from gpsd
let lastFixAt = null;   // epoch ms when that report arrived (null = none yet)

const client = new gpsd({
	port: 2947,
	hostname: 'localhost',
	parse: true,
	reconnectThreshold: 15,
	reconnectInterval: 5,
});

client.on('connected', () => {
	console.log('GPSD Connected');

	client.watch({
		class: 'WATCH',
		json: true,
		scaled: true
	});
});

client.on('error', err => {
	console.log(`Error: ${err.message}`);
});

client.on('TPV', data => {
	console.log(`Data: ${JSON.stringify(data)}`);
	values = data;
	lastFixAt = Date.now();
});

client.connect();

const requestListener = (request, response) => {
	response.writeHead(200, {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
	});

	const now = Date.now();
	const age = lastFixAt === null ? null : now - lastFixAt;

	const json = JSON.stringify({
		...values,
		receivedAt: lastFixAt,                    // epoch ms of last fix, null until first one
		age,                                      // ms since last fix, null until first one
		stale: age === null || age > STALE_MS,    // true = signal lost (>5s old or never seen)
	});

	response.end(json);
};

const server = http.createServer(requestListener);

server.listen(PORT, () => {
	console.log(`GPS HTTP server listening on :${PORT}`);
});
