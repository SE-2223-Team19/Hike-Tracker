const { LocationType } = require("../helper/enums");
const { ENDPOINTS, addQueryParams } = require("./config");
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
			headers: {
				"Content-Type": "application/json",
			},
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
		if (!filters.description) delete filters.description;
		addQueryParams(url, { ...filters, locationType: LocationType.HUT });

		const response = await fetch(url, {
			credentials: "include",
		});

		return await response.json();
	} catch (err) {
		return err;
	}
}

async function getParkingLots(filters = {}) {
	try {
		const url = new URL(ENDPOINTS.locations.all, BACKEND_URL);
		if (!filters.description) delete filters.description;
		addQueryParams(url, { ...filters, locationType: LocationType.PARKING_LOT });

		const response = await fetch(url, {
			credentials: "include",
		});

		return await response.json();
	} catch (err) {
		return err;
	}
}

async function updateLocationDescription(id, description) {
	try {
		const response = await fetch(
			new URL(ENDPOINTS.locations.byId.replace(":id", id), BACKEND_URL),
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ description: description }),
			}
		);
		if (response.ok) {
			return id;
		} else {
			return response.json();
		}
	} catch (err) {
		console.log(err)
	}
}

async function updateLocation(id, location) {
	try {
		const response = await fetch(
			new URL(ENDPOINTS.locations.update.replace(":id", id), BACKEND_URL),
			{
				method: "PATCH",
				credentials: "include",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(location)
			}
		)
		if(response.ok) {
			return id;
		} else {
			return await response.json()
		}
	} catch(err) {
		console.log(err)
	}
}

module.exports = {
	getLocations,
	updateLocationDescription,
	createLocation,
	getHuts,
	getParkingLots,
	updateLocation
};
