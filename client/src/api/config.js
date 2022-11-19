const BACKEND_URL = "http://localhost:8080/api/";

const ENDPOINTS = {
	hikes: {
		all: "hike",
		byId: "hike/:id",
		insert: "hike",
	},
	locations: {
		all: "location",
		byId: "location/:id",
		insert: "location",
	},
	sessions: {
		insert: "session",
		current: "session/current"
	},
	user: {
		insert: "user",
		update: "user/verify/:uniqueString"
	},
};

module.exports = { ENDPOINTS, BACKEND_URL };
