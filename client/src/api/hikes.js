/** API Hikes */

const { ENDPOINTS } = require("./config");
const { BACKEND_URL } = require("./config");

/**
 * Get all hikes
 * @param {*} filters - Filters to apply to the query
 * @returns List of hikes
 */
async function getHikes(filters = {}) {
	try {
		const response = await fetch(
			`${BACKEND_URL}${ENDPOINTS.hikes.all}/?` + new URLSearchParams(filters)
		);
		return await response.json();
	} catch (err) {
		console.error(err);
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
		const data = new FormData();
		for (const [key, value] of Object.entries(hike)) {
			data.append(key, value);
		}
		const response = await fetch(new URL(ENDPOINTS.hikes.insert, BACKEND_URL), {
			method: "POST",
			credentials: "include",
			body: data
		}).then(res => res.json());
		return response;
	} catch (err) {
		console.error(err);
	}
}

async function updateHikeDescription(id, description) {
	try {
		const response = await fetch(`${BACKEND_URL}${ENDPOINTS.hikes.byId.replace(":id", id)}`, {
			method: "PUT",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ description: description })
		});
		if (response.ok) {
			return id;
		} else {
			return response.json();
		}
	} catch (err) {
		console.error(err);
	}
}

module.exports = {
	getHikes,
	getHikeById,
	createHike,
	updateHikeDescription
};
