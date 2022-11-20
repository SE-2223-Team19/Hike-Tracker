const { ENDPOINTS } = require("./config");
const { BACKEND_URL } = require("./config");

/**
 * Get all locations
 * @returns List of locations
 */
async function getLocations(filters = {}) {
	try {
		const response = await fetch(
			`${BACKEND_URL}${ENDPOINTS.locations.all}/?` + new URLSearchParams(filters)
		);
		return await response.json();
	} catch (err) {
		console.log(err);
		return err;
	}
}

async function createLocation(formData) {
	console.log(formData);
	try {
		const response = await fetch(`${BACKEND_URL}${ENDPOINTS.locations.insert}`, {
			method: "POST",
			credentials:"include",
			headers:{
				"Content-Type": "application/json"
			},
			body: JSON.stringify(formData),
		});
		return await response.json();
	} catch (err) {
		return err;
	}
}

module.exports = {
	getLocations,
	createLocation,
};
