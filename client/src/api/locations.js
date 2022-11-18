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

async function updateLocationDescription(id, description) {
	try {
		const response = await fetch(`${BACKEND_URL}${ENDPOINTS.locations.byId.replace(":id", id)}`, {
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
	getLocations,
	updateLocationDescription
};
