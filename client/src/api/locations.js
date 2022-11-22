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
	try {
		const response = await fetch(new URL(ENDPOINTS.locations.insert, BACKEND_URL), {
			method: "POST",
			credentials: "include",
			body: JSON.stringify(formData),
		});
		return await response.json();
	} catch (err) {
		return err;
	}
}

async function getHuts(filters = {}) {

	try {
		const url = new URL(ENDPOINTS.locations.all, BACKEND_URL);
		filters.locationType = "hut";
		url.searchParams = new URLSearchParams(filters);
		const response = await fetch(url, {
			credentials: "include",
		});
		return await response.json();
	} catch (err) {
		return err;
	}

}

module.exports = {
	getLocations,
	createLocation,
	getHuts
};
