const { LocationType } = require("../helper/enums");
const { ENDPOINTS } = require("./config");
const { BACKEND_URL } = require("./config");

/**
 * Get all locations
 * @returns List of locations
 */
async function getLocations(filters = {}) {
	try {
		const url = new URL(ENDPOINTS.locations.all, BACKEND_URL);

		addQueryParams(url, filters);
		
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

		addQueryParams(url, { ...filters, locationType: "hut" });

		const response = await fetch(url, {
			credentials: "include"
		});
		
		// let huts = await response.json()
		// huts = await Promise.all(huts.map(async function(e) {
		// 	// const address = await getAddresses(hut.point[0],hut.point[1])
		// 	const address = await getAddresses(45.0623969,7.5222874)
		// 	e.address = address
		// 	return e
		// }))

		// return huts
		return await response.json()

	} catch (err) {
		return err;
	}

}

// async function getAddresses(latitude, longitude) {
// 	try {
		
// 		const url = "https://nominatim.openstreetmap.org/reverse?lat=" + latitude + "&lon=" + longitude + "&format=jsonv2"

// 		const response = await fetch(url);
// 		return await response.json();
// 	} catch (err) {
// 		return err;
// 	}
// }

module.exports = {
	getLocations,
	createLocation,
	getHuts
};
