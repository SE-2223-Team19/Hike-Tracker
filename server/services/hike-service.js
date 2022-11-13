const locationDAL = require("../data/location-dal");
const hikeDAL = require("../data/hike-dal");

/**
 * Creates a new hike and new locations for the start point, end point and reference points.
 * @param {*} hike Hike to be created
 * @param {*} referencePoints Reference points related to the hike, that will be created as entities in the database (Hut, Parking, etc.)
 * @returns
 */
async function createHike(hike) {
	// Create new locations for the start point and end point
	const startPoint = await locationDAL.createLocation(hike.startPoint);
	const endPoint = await locationDAL.createLocation(hike.endPoint);

	// Create new locations for the reference points
	const referencePoints = await Promise.all(
		hike.referencePoints.map((referencePoint) => locationDAL.createLocation(referencePoint))
	);

	// Create new hike
	const newHike = hikeDAL.createHike({
		...hike,
		startPoint: startPoint._id,
		endPoint: endPoint._id,
		referencePoints: referencePoints.map((referencePoint) => referencePoint._id),
	});

	return newHike;
}

module.exports = { createHike };
