/** API Hikes */
const { ENDPOINTS, BACKEND_URL } = require("./config");
const { addQueryParams } = require("./config");

/**
 * Get all hikes
 * @param {*} filters - Filters to apply to the query
 * @returns List of hikes
 */
async function getHikes(filters = {}) {
	try {
		const url = new URL(ENDPOINTS.hikes.all, BACKEND_URL);

		addQueryParams(url, filters);

		const response = await fetch(url, {
			credentials: "include",
		});
		return response.json();
	} catch (err) {
		console.log(err);
		return { error: err };
	}
}

/**
 * Get a single hike by id
 * @param {*} id - Id of the hike to get
 * @returns Hike
 */
async function getHikeById(id) {
	try {
		const response = await fetch(ENDPOINTS.hikes.byId.replace(":id", id), {
			credentials: "include",
		});
		return response.json();
	} catch (err) {
		console.error(err);
	}
}

/**
 * Creates a new hike
 * @param {*} hike - The hike to create
 * @returns The created hike
 */
async function createHike(hike) {
	try {
		const response = await fetch(new URL(ENDPOINTS.hikes.insert, BACKEND_URL), {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(hike),
		});
		return await response.json();
	} catch (err) {
		console.error(err);
	}
}

async function updateHike(id, changes) {
	
	try {
		const response = await fetch(new URL(ENDPOINTS.hikes.update.replace(":id", id), BACKEND_URL), {
			method: "PATCH",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(changes),
		});
		return await response.json();
	} catch (err) {
		console.error(err);
	}
}

module.exports = {
	getHikes,
	getHikeById,
	createHike,
	updateHike,
};
