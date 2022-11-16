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

module.exports = {
	getLocations,
};
