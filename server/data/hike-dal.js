const Hike = require("../models/hike-model");

/**
 * Get all hikes.
 * @param {*} filterQuery Filter object for MongoDB query
 * @returns Hikes
 */
async function getHikes(filterQuery = {}) {
	const hikes = await Hike.find(filterQuery);
	return hikes;
}

/**
 * Create a new hike.
 * @param {*} hike Hike to create. Object must match Hike model.
 * @returns Hike
 */
async function createHike(hike) {
	const newHike = new Hike(hike);
	const savedHike = await newHike.save();
	return savedHike;
}

module.exports = {
	getHikes,
	createHike,
};
