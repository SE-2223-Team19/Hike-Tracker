/** Utility functions */

/**
 * Convert minutes to hours and minutes display format
 */
export function displayExpectedTime(minutes) {
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return `${h}h ${m}m`;
}

/**
 * Capitalize and replace underscores with spaces
 */
export function capitalizeAndReplaceUnderscores(str) {
	return str.replace(/_/g, " ").replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
}

/** Convert meters to km */
export function metersToKm(meters) {
	return meters / 1000;
}
