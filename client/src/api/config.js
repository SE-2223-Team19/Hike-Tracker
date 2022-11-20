const BACKEND_URL = "http://localhost:8080/api/";

const ENDPOINTS = {
	hikes: {
		all: "hike",
		byId: "hike/:id",
		insert: "hike",
		update: "hike/:id"
	},
	locations: {
		all: "location",
		byId: "location/:id",
		insert: "location",
	},
	sessions: {
		insert: "session",
		current: "session/current",
	},
	users: {
		insert: "user",
		verify: "user/verify/:uniqueString",
	},
};

module.exports = { ENDPOINTS, BACKEND_URL };
