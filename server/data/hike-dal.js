const Hike = require("../models/hike-model");
const Location = require("../models/location-model");

/**
 * Get all hikes.
 * @param {*} filterQuery Filter object for MongoDB query
 * @returns Hikes
 */
async function getHikes(filterQuery = {}) {
	// Need geospatial query
	if (filterQuery.startPoint !== undefined && typeof(filterQuery.startPoint) !== "string") {
		const coordinates = filterQuery.startPoint.coordinates;
		const maxDistance = filterQuery.startPoint.radius;
		delete filterQuery.startPoint;
		const hikes = await Location.aggregate([
			{
				$geoNear: {
					near: {
						type: "Point",
						coordinates: coordinates
					},
					maxDistance: maxDistance,
					distanceField: "distance"
				}
			},
			{
				$lookup: {
					from: Hike.collection.name,
					localField: "_id",
					foreignField: "startPoint",
					as: "hikes"
				}
			},
			{
				$unwind: {
					path: "hikes"
				}
			},
			{
				$replaceWith: "$hikes"
			},
			{
				$match: filterQuery
			}
		]);
		return hikes;
	}
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
