const { ENDPOINTS } = require("./config");
const { BACKEND_URL } = require("./config");

/**
 * Get all locations
 * @returns List of locations
 */
async function getLocations(filters = {}) {
	try {
		const url = new URL(ENDPOINTS.locations.all, BACKEND_URL);
		url.searchParams = new URLSearchParams(filters);
		const response = await fetch(url, {
			credentials: "include",
		});
		return await response.json();
	} catch (err) {
		return err;
	}
}

async function createLocation(formData) {
	console.log(formData);
	try {
		const response = await fetch(new URL(ENDPOINTS.locations.insert, BACKEND_URL), {
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

async function updateLocationDescription(id, description) {
	try {
		const response = await fetch(new URL(ENDPOINTS.locations.byId.replace(":id", id), BACKEND_URL), {
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
	updateLocationDescription,
	createLocation,
};
