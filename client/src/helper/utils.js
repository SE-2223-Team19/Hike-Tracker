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

/** Convert meters to km and round to 2 values */
export function displayLength(length) {
	return (length / 1000).toFixed(2);
}
