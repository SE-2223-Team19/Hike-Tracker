/** Utility functions */

import { Difficulty,Hut_Condition } from "./enums";

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

export const ConditionColor = (condition) => {
	switch (condition) {
		case Hut_Condition.Open:
			return "info";
		case Hut_Condition.Overloaded:
			return "warning";
		case Hut_Condition.Close_BadWeather:
			return "danger";
		case Hut_Condition.Close_maintenance:
			return "danger"	
		default:
			return "secondary";
	}
};

export const removeMongoKeys = (obj) => {
	const newObj = { ...obj };
	delete newObj._id;
	delete newObj.__v;
	return newObj;
};
