import * as Icons from 'react-bootstrap-icons';

/**
 * Converts a distance from meters to feet
 * @param {Number} meters - The distance to convert in meters
 * @returns {Number}
 */
export const metersToFeet = (meters: number): number => {
	return meters * 3.28084;
};

/**
 * Converts a distance from feet to miles
 * @param {Number} feet - The distance to convert in feet
 * @returns {Number}
 */
export const feetToMiles = (feet: number): number => {
	return feet * 0.0001893939;
};

/**
 * Converts a velocity from meters per second to miles per hour (kilometers per hours for metric)
 * @param {Number} metersPerSecond - The velocity to convert in meters per second
 * @returns {Number}
 */
export const metersPerSecondToMPH = (metersPerSecond: number): number => {
	return metersPerSecond * 2.236936;
};

/**
 * Converts pressure in millibars to inches of mercury
 * @param {Number} mb - The pressure in millibars
 * @returns {Number}
 */
export const millibarsToInchesOfMercury = (mb: number): number => {
	return mb * 0.02953;
};

/**
 * Converts a temperature from Celsius to Fahrenheit
 * @param {Number} celsius - The temperature to convert in degrees Celsius
 * @returns {Number}
 */
export const celsiusToFahrenheit = (celsius: number): number => {
	return (celsius * 9) / 5 + 32;
};

/**
 * Converts a velocity from kilometers per hour to miles per hour
 * @param {Number} kmh - The velocity to convert in kilometers per hour
 * @returns {Number}
 */
export const kmhToMph = (kmh: number): number => {
	return kmh * 0.621371;
};

/**
 * Converts pressure in pascals to millibars (hectopascals)
 * @param {Number} pascals - The pressure in pascals
 * @returns {Number}
 */
export const pascalsToMillibars = (pascals: number): number => {
	return pascals / 100;
};

/**
 * Convert a string into title/proper case
 * @param {String} str - The text to convert
 * @returns {String}
 */
export const toTitleCase = (str: string) =>
	str?.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

/**
 * API ISO formatted time, Date object or ms to display formatted time
 * @param time - The date string
 * @returns The display formatted time
 */
export const toTimeDisplay = (time?: string | Date | number | null, timeZone?: string) => {
	if (!time) return '';

	return Intl.DateTimeFormat([], { hour: 'numeric', minute: 'numeric', timeZone: timeZone || undefined }).format(
		new Date(time),
	);
};

/**
 * Reinterpret an instant's wall-clock time in `timeZone` as a local Date, so
 * components that read local Date parts (react-clock, react-calendar,
 * toTimeString) render the target zone's time. Falls back to the given date
 * (device-local) when no timeZone is provided.
 * @param timeZone - IANA time zone name, e.g. "America/New_York"
 * @param date - the instant to convert (defaults to now)
 * @returns A Date whose local parts equal the wall-clock time in timeZone
 */
export const getZonedDate = (timeZone?: string, date: Date = new Date()): Date => {
	if (!timeZone) return date;
	return new Date(date.toLocaleString('en-US', { timeZone }));
};

/**
 *
 * @param start
 * @param end
 * @param intervals
 * @returns
 */
export const getIntervalValues = (start: number, end: number, intervals: number) => {
	const values = [];

	for (let i = start; i <= end; i += (end - start) / (intervals - 1)) {
		values.push(Math.round(i));
	}

	return values;
};

export const degreesToCompassDirection = (angle: number): string => {
	// const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
	const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

	const index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / (360 / directions.length)) % 8;

	return directions[index];
};

export const degreesToArrowIcon = (angle: number): Icons.Icon => {
	const icons = {
		N: Icons.ArrowUp,
		NE: Icons.ArrowUpRight,
		E: Icons.ArrowRight,
		SE: Icons.ArrowDownRight,
		S: Icons.ArrowDown,
		SW: Icons.ArrowDownLeft,
		W: Icons.ArrowLeft,
		NW: Icons.ArrowUpLeft,
	};

	const direction = degreesToCompassDirection(angle) as keyof typeof icons;

	return icons[direction];
};

export const decimalCoordinateToDegrees = (value: number, type: 'lat' | 'long') => {
	const sign = value < 0 ? -1 : 1;

	const direction = type === 'lat' ? (sign < 0 ? 'S' : 'N') : sign < 0 ? 'W' : 'E';

	const abs = Math.abs(Math.round(value * 1000000));

	// if (abs > max * 1000000) {
	// 	return NaN;
	// }

	const dec = (abs % 1000000) / 1000000;
	const deg = Math.floor(abs / 1000000) * sign;
	const min = Math.floor(dec * 60);
	const sec = (dec - min / 60) * 3600;

	return `${deg}°${min}'${sec.toFixed(2)}"${direction}`;
};

/**
 * Converts a duration into a display formatted string
 * @param diff - The duration as hours:minute:seconds
 * @returns
 */
export const apiDurationToDisplay = (diff?: string) => {
	if (!diff) return '';

	const [hours, minutes, seconds] = diff.split(':').map(x => Number(x));

	if (String(hours).split('.').length === 2) {
		const [days, newHours] = String(hours)
			.split('.')
			.map(x => Number(x));

		if (days > 365) return `${(days / 365).toFixed(0)} y`;

		if (days > 29) return `${(days / 30).toFixed(0)} m`;

		return `${((minutes / 60 + newHours) / 24 + days).toFixed(0)} d`;
	}

	if (hours / 24 >= 365) {
		return `${(hours / 24 / 365).toFixed(0)} y`;
	}

	if (hours / 24 >= 30) {
		return `${(hours / 24 / 30).toFixed(0)} m`;
	}

	if (hours > 24) {
		return `${(hours / 24).toFixed(0)} d`;
	}

	if (hours) {
		return `${(hours + minutes / 60).toFixed(0)} h`;
	}

	if (minutes) {
		return `${minutes} m`;
	}

	if (seconds || seconds === 0) {
		return `${seconds.toFixed(0)} s`;
	}

	return '';
};

/**
 * Finds the amount of time between two datetimes
 * @param dateA - The start datetime string
 * @param dateB - The end datetime string
 * @returns The amount of time rounded to the largest amount of time
 */
export const timeSpanToDisplay = (dateA: string | Date, dateB: string | Date = new Date()) => {
	const d1 = new Date(dateA);
	const d2 = new Date(dateB);

	const totalSeconds = Math.abs((d2.getTime() - d1.getTime()) / 1000);

	const hoursSince = Math.floor(totalSeconds / 60 / 60);
	const minutesSince = Math.floor(totalSeconds / 60 - hoursSince * 60);
	const secondsSince = Math.floor(totalSeconds - hoursSince * 60 * 60 - minutesSince * 60);

	return apiDurationToDisplay(`${hoursSince}:${minutesSince}:${secondsSince}`);
};
