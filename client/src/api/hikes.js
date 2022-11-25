/** API Hikes */
const { ENDPOINTS, BACKEND_URL } = require("./config");

/**
 * Get all hikes
 * @param {*} filters - Filters to apply to the query
 * @returns List of hikes
 */
async function getHikes(filters = {}) {
	try {
		// FIXME: With the current implementation, '/api' from BACKEND_URL is removed
		// const url = new URL(ENDPOINTS.hikes.all, BACKEND_URL);
		const searchParams = new URLSearchParams(filters);
		const response = await fetch(`${BACKEND_URL}/${ENDPOINTS.hikes.all}/?` + searchParams, {
			credentials: "include",
		});
		return await response.json();
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
		// const response = await fetch(ENDPOINTS.hikes.byId.replace(":id", id), {});
		// return response.data;
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

async function updateHike(hike) {
	try {
		const response = await fetch(
			new URL(ENDPOINTS.hikes.byId.replace(":id", hike._id), BACKEND_URL),
			{
				method: "PATCH",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(hike),
			}
		);
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
