/** Utility functions */

import { Difficulty, UserType, HikeCondition, WeatherCondition } from "./enums";

import { WiDaySunny ,WiDayWindy ,WiDayThunderstorm, WiCloudy ,WiThermometer } from 'react-icons/wi'
import{IoSnowOutline} from 'react-icons/io5'
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

export const userTypeToColour = (userType) => {
	switch (userType) {
		case UserType.HIKER:
			return "success";
		case UserType.EMERGENCY_OPERATOR:
			return "danger";
		case UserType.HUT_WORKER:
			return "warning";
		case UserType.LOCAL_GUIDE:
			return "info";
		case UserType.PLATFORM_MANAGER:
			return "dark";
		default:
			return "light";
	}
};

export const ConditionColor = (condition) => {
	switch (condition) {
		case HikeCondition.OPEN:
			return "info";
		case HikeCondition.OVERLOADED:
			return "warning";
		case HikeCondition.CLOSE_BAD_WEATHER:
			return "danger";
		case HikeCondition.CLOSE_MAINTENANCE:
			return "danger";
		default:
			return "secondary";
	}
};

export const weatherIcon = (weather) => {
	switch (weather) {
		case "sunny":
			return <WiDaySunny/>;
		case "blizzard":
			return <IoSnowOutline/>;
		case "cloudy":
			return <WiCloudy/>;
		case "thunder_storm":
			return <WiDayThunderstorm/>;
		case "windy":
		    return 	<WiDayWindy/>;	
		default:
			return <WiThermometer/>;
	}
};




export const removeMongoKeys = (obj) => {
	const newObj = { ...obj };
	delete newObj._id;
	delete newObj.__v;
	return newObj;
};

/**
 *
 * @param {String} city
 * @returns A json Object that describe the place and its coordinates in terms of latitude and longitude
 */
export async function getLatLongFromCity(city) {
	console.log(city);
	const url =
		"https://nominatim.openstreetmap.org/search?city=" + city + "&zoom=10&format=jsonv2&limit=1";
	try {
		const response = await fetch(url);
		return await response.json();
	} catch (err) {
		return err;
	}
}

/** Get the path of one of the pictures in public/assets/images, named hike-$, where $ is
 * a random number between 1 and 5.
 */
export function getRandomHikeThumbnail() {
	return `/assets/images/hike-${Math.floor(Math.random() * 5) + 1}.jpg`;
}

export const getBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

	