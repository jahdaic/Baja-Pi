/**
 * Converts a distance from meters to feet
 * @param {Number} m - The distance to convert in meters
 * @returns {Number}
 */
export const metersToFeet = (meters: number): number => {
	return meters * 3.28084;
};

/**
 * Converts a velocity from meters per second to miles per hour (kilometers per hours for metric)
 * @param {Number} mps - The velocity to convert in meters per second
 * @returns {Number}
 */
export const metersPerSecondToMPH = (metersPerSecond: number): number => {
	return metersPerSecond * 2.236936;
};

/**
 * Convert a string into title/proper case
 * @param {String} str - The text to convert
 * @returns {String}
 */
export const toTitleCase = (str: string) =>
	str?.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
