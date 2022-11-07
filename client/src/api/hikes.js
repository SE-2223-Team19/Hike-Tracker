/** API Hikes */

const ENDPOINTS = require("./config");

async function getHikes(filters = {}) {
	try {
		// const response = await fetch(ENDPOINTS.hikes.all, {});
		// return response.data;
	} catch (err) {
		console.error(err);
	}
}

async function getHikeById(id) {
	try {
		// const response = await fetch(ENDPOINTS.hikes.byId.replace(":id", id), {});
		// return response.data;
	} catch (err) {
		console.error(err);
	}
}

async function createHike(hike) {
	try {
		// const response = await fetch(ENDPOINTS.hikes.insert, {
		//     method: "POST",
		//     headers: {
		//         "Content-Type": "application/json",
		//     },
		//     body: JSON.stringify(hike),
		// });
		// return response.data;
	} catch (err) {
		console.error(err);
	}
}

module.exports = {
	getHikes,
	getHikeById,
	createHike,
};
