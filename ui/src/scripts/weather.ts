import * as SunCalc from 'suncalc';
import * as Utility from './Utility';
import { IWeather, IWeatherAlert, IHourlyForecast } from '../store/weatherSlice';

/**
 * Weather service.
 *
 * Sources (all keyless, all CORS-enabled for browser fetch):
 *  - NWS  api.weather.gov  -> current conditions, forecast (H/L + hourly),
 *                             alerts, city, IANA timezone.
 *  - Open-Meteo            -> UV index + snowfall (by lat/lon, one call).
 *  - suncalc (local)       -> sunrise / sunset.
 *
 * Everything is reshaped into the app's existing `IWeather` + `IHourlyForecast`
 * contract so the weather pages consume it unchanged. NWS runs in Chromium, which
 * sends a normal browser User-Agent (a custom UA is WAF-blocked; the browser's is not).
 */

// `Accept` is CORS-safelisted, so this adds no preflight.
const NWS_HEADERS = { Accept: 'application/geo+json' };

const getJson = async (url: string, headers: Record<string, string> = {}): Promise<any> => {
	const res = await fetch(url, { headers, signal: AbortSignal.timeout(10000) });
	if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
	return res.json();
};

// --- /points + station are static per location; cache them across refreshes ---
interface PointsInfo {
	forecast: string;
	forecastHourly: string;
	stations: string;
	timeZone: string;
	city: string;
}
const pointsCache = new Map<string, PointsInfo>();
const stationCache = new Map<string, string>();
const cacheKey = (lat: number, lon: number) => `${lat.toFixed(3)},${lon.toFixed(3)}`;

const getPoints = async (lat: number, lon: number): Promise<PointsInfo> => {
	const key = cacheKey(lat, lon);
	const cached = pointsCache.get(key);
	if (cached) return cached;

	const data = await getJson(`https://api.weather.gov/points/${lat},${lon}`, NWS_HEADERS);
	const p = data.properties;
	const loc = p.relativeLocation?.properties;
	const info: PointsInfo = {
		forecast: p.forecast,
		forecastHourly: p.forecastHourly,
		stations: p.observationStations,
		timeZone: p.timeZone || '',
		city: loc ? `${loc.city}, ${loc.state}` : '',
	};
	pointsCache.set(key, info);
	return info;
};

const getStationId = async (stationsUrl: string): Promise<string> => {
	const cached = stationCache.get(stationsUrl);
	if (cached !== undefined) return cached;
	const data = await getJson(stationsUrl, NWS_HEADERS);
	const id = data.features?.[0]?.properties?.stationIdentifier || '';
	stationCache.set(stationsUrl, id);
	return id;
};

/**
 * Map an NWS icon URL to the OpenWeather-style code the UI already uses
 * (`WeatherIcon` switch + `weather-bg` images). NWS URLs look like
 * `.../icons/land/night/tsra_hi,60?size=medium` — we read day/night and the
 * first condition token, dropping the `,NN` precipitation-chance suffix.
 */
const NWS_TO_OWM: Record<string, string> = {
	skc: '01', // clear
	few: '02', // a few clouds
	sct: '03', // partly cloudy
	bkn: '04', // mostly cloudy
	ovc: '04', // overcast
	wind_skc: '01',
	wind_few: '02',
	wind_sct: '03',
	wind_bkn: '04',
	wind_ovc: '04',
	rain: '10',
	rain_showers: '09',
	rain_showers_hi: '09',
	tsra: '11', // thunderstorm
	tsra_sct: '11',
	tsra_hi: '11',
	snow: '13',
	blizzard: '13',
	rain_snow: '13',
	rain_sleet: '13',
	snow_sleet: '13',
	fzra: '13',
	rain_fzra: '13',
	snow_fzra: '13',
	sleet: '13',
	fog: '50',
	haze: '50',
	smoke: '50',
	dust: '50',
	tornado: '11',
	hurricane: '11',
	tropical_storm: '11',
	hot: '01',
	cold: '13',
};

export const nwsIconToOwm = (iconUrl?: string | null): string => {
	if (!iconUrl) return '';
	const isNight = /\/night\//.test(iconUrl);
	const match = iconUrl.match(/\/(?:day|night)\/([a-z_]+)/i);
	const code = NWS_TO_OWM[match?.[1] ?? ''] || '01';
	return `${code}${isNight ? 'n' : 'd'}`;
};

const toEpochSeconds = (iso?: string | null): number => (iso ? Math.floor(Date.parse(iso) / 1000) : 0);

const isValidDate = (d?: Date | null): d is Date => d instanceof Date && !isNaN(d.getTime());

/**
 * Fetch and assemble the full weather + hourly forecast for a location.
 * `previous` supplies fall-back values for any field a source omits this cycle.
 */
export const fetchWeather = async (
	lat: number,
	lon: number,
	previous: IWeather,
): Promise<{ weather: IWeather; forecast: IHourlyForecast[] }> => {
	const points = await getPoints(lat, lon);
	const stationId = await getStationId(points.stations).catch(() => '');

	const [forecastData, hourlyData, alertsData, openMeteo, obsData] = await Promise.all([
		getJson(points.forecast, NWS_HEADERS).catch(() => null),
		getJson(points.forecastHourly, NWS_HEADERS).catch(() => null),
		getJson(`https://api.weather.gov/alerts/active?point=${lat},${lon}`, NWS_HEADERS).catch(() => null),
		getJson(
			`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=uv_index,snowfall`,
		).catch(() => null),
		stationId
			? getJson(`https://api.weather.gov/stations/${stationId}/observations/latest`, NWS_HEADERS).catch(() => null)
			: Promise.resolve(null),
	]);

	const o = obsData?.properties;
	const cToF = (v: number | null | undefined) =>
		v === null || v === undefined ? undefined : Utility.celsiusToFahrenheit(v);

	// Daily high / low from the first day & night forecast periods (already °F).
	const periods: any[] = forecastData?.properties?.periods || [];
	const dayPeriod = periods.find(p => p.isDaytime);
	const nightPeriod = periods.find(p => !p.isDaytime);

	// Hourly forecast (NWS gives no per-hour "feels like"; approximate with temp).
	const hourlyPeriods: any[] = hourlyData?.properties?.periods || [];
	const forecast: IHourlyForecast[] = hourlyPeriods.slice(0, 10).map(h => ({
		dt: h.startTime,
		weather: {
			icon: { raw: nwsIconToOwm(h.icon) },
			feelsLike: { cur: h.temperature ?? 0 },
			pop: (h.probabilityOfPrecipitation?.value ?? 0) / 100,
		},
	}));

	const alerts: IWeatherAlert[] = (alertsData?.features || []).map((f: any) => {
		const a = f.properties;
		return {
			event: a.event || '',
			start: toEpochSeconds(a.onset || a.effective),
			end: toEpochSeconds(a.ends || a.expires),
			description: a.description || '',
		};
	});

	const sun = SunCalc.getTimes(new Date(), lat, lon);
	const feelsLike = cToF(o?.heatIndex?.value ?? o?.windChill?.value ?? o?.temperature?.value);

	const weather: IWeather = {
		temperature: cToF(o?.temperature?.value) ?? previous.temperature ?? 0,
		temperatureMin: nightPeriod?.temperature ?? previous.temperatureMin ?? 0,
		temperatureMax: dayPeriod?.temperature ?? previous.temperatureMax ?? 0,
		feelsLike: feelsLike ?? previous.feelsLike ?? 0,
		description: o?.textDescription || dayPeriod?.shortForecast || previous.description || '',
		icon: nwsIconToOwm(o?.icon) || nwsIconToOwm(hourlyPeriods[0]?.icon) || previous.icon || '',
		rain:
			hourlyPeriods[0]?.probabilityOfPrecipitation?.value != null
				? hourlyPeriods[0].probabilityOfPrecipitation.value / 100
				: previous.rain || 0,
		snow: openMeteo?.current?.snowfall ?? previous.snow ?? 0,
		windSpeed: o?.windSpeed?.value != null ? Utility.kmhToMph(o.windSpeed.value) : previous.windSpeed || 0,
		windDirection: o?.windDirection?.value ?? previous.windDirection ?? 0,
		humidity: o?.relativeHumidity?.value != null ? Math.round(o.relativeHumidity.value) : previous.humidity || 0,
		pressure:
			o?.barometricPressure?.value != null
				? Utility.pascalsToMillibars(o.barometricPressure.value)
				: previous.pressure || 0,
		visibility: o?.visibility?.value != null ? Utility.metersToFeet(o.visibility.value) : previous.visibility || 0,
		uvi: openMeteo?.current?.uv_index != null ? Math.round(openMeteo.current.uv_index) : previous.uvi || 0,
		sunrise: isValidDate(sun.sunrise) ? sun.sunrise.toISOString() : previous.sunrise || '',
		sunset: isValidDate(sun.sunset) ? sun.sunset.toISOString() : previous.sunset || '',
		city: points.city || previous.city || '',
		timezone: points.timeZone || previous.timezone || '',
		alerts,
	};

	return { weather, forecast };
};
