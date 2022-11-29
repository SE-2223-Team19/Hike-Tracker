/** Utility functions */

import { Difficulty } from "./enums";

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

export const difficultyToColor = (difficulty) => {
	switch (difficulty) {
		case Difficulty.TOURIST:
			return "info";
		case Difficulty.HIKER:
			return "warning";
		case Difficulty.PROFESSIONAL_HIKER:
			return "danger";
		default:
			return "secondary";
	}
};
