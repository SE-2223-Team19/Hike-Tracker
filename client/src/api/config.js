const BACKEND_URL = "http://localhost:8080/api/";

const ENDPOINTS = {
	hikes: {
		all: "hike",
		byId: "hike/:id",
		insert: "hike",
		update: "hike/:id",
		updateCondition: "hike/:id/condition",
	},
	registeredHikes: {
		start: "registered-hike/start/:id",
		plan: "registered-hike/plan/:id",
		startplan: "registered-hike/startplan/:id",
		end: "registered-hike/end/:id",
		byUser: "registered-hike/:userId",
		point: "registered-hike/point/:id"
		stats: "registered-hike/stats/:id"
	},
	locations: {
		all: "location",
		byId: "location/:id",
		insert: "location",
		update: "location/:id",
		uploadHutPicture: "location/hut-picture/:id",
	},
	sessions: {
		insert: "session",
		current: "session/current",
	},
	users: {
		all: "user",
		insert: "user",
		update: "user/:id",
		verify: "user/verify/:uniqueString",
		preferences: "user/preferences",
	},
	weatherAlert: {
		update: "weatherAlert/area"
	}
};

/**
 * Adds the query parameters to the url
 * @param {URL} url
 * @param {Object} query
 */
function addQueryParams(url, query) {
	for (const [key, value] of Object.entries(query)) {
		url.searchParams.append(key, value.toString());
	}
}

module.exports = { ENDPOINTS, BACKEND_URL, addQueryParams };
