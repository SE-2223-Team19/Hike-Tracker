const Location = require("../models/location-model");

/**
 * Get all locations.
 * @param {*} filterQuery Filter object for MongoDB query
 * @returns Locations
 */
async function getLocations(filterQuery = {}) {
	const locations = await Location.find(filterQuery);
	return locations;
}

/**
 * Create a new location.
 * @param {*} location Location to create. Object must match Location model.
 * @returns Location
 */
async function createLocation(location) {
	const newLocation = new Location(location);
	const savedLocation = await newLocation.save();
	return savedLocation;
}

module.exports = {
	getLocations,
	createLocation,
};