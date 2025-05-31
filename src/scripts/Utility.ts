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
export const toTimeDisplay = (time?: string | Date | number | null) => {
	if (!time) return '';

	return Intl.DateTimeFormat([], { hour: 'numeric', minute: 'numeric' }).format(new Date(time));
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
	var sign = value < 0 ? -1 : 1;

	var direction = type === 'lat' ? (sign < 0 ? 'S' : 'N') : sign < 0 ? 'W' : 'E';

	var abs = Math.abs(Math.round(value * 1000000));

	// if (abs > max * 1000000) {
	// 	return NaN;
	// }

	var dec = (abs % 1000000) / 1000000;
	var deg = Math.floor(abs / 1000000) * sign;
	var min = Math.floor(dec * 60);
	var sec = (dec - min / 60) * 3600;

	return `${deg}°${min}'${sec.toFixed(2)}"${direction}`;
};
