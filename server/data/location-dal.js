const Location = require("../models/location-model");

/**
 * @typedef {Object} Location
 * @property {String} _id
 * @property {String} description
 * @property {[Number, Number]} point
 */

/**
 * Get all locations.
 * @param {*} filterQuery Filter object for MongoDB query
 * @param {Number} page The number of the page
 * @param {Number} pageSize The size of the page
 * @returns {Promise<Location>}
 */
async function getLocations(filterQuery = {}) {

	const locations = await Location.find(filterQuery)
	.lean();
	return locations;
}

/**
 * Create a new location.
 * @param {Location} location Location to create. Object must match Location model.
 * @returns {Promise<Location>}
 */
async function createLocation(location) {
	const newLocation = new Location(location);
	const savedLocation = await newLocation.save();
	return savedLocation;
}

/**
 * Updates the location's description
 * @param {String} id 
 * @param {String} description 
 * @returns {Promise<Location>}
 */
async function updateLocationDescription(id, description){
	const result = await Location.updateOne({id: id},{description: description});
	return result; 
}

module.exports = {
	getLocations,
	createLocation,
	updateLocationDescription
};