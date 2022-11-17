const locationDAL = require("../data/location-dal");
const hikeDAL = require("../data/hike-dal");
const { LocationType } = require("../models/enums");

/**
 * Creates a new hike and new locations for the start point, end point and reference points.
 * @param {*} hike Hike to be created
 * @param {*} referencePoints Reference points related to the hike, that will be created as entities in the database (Hut, Parking, etc.)
 * @returns
 */
async function createHike(hike) {
	// Create new locations for the start point and end point
	if (!hike.startPointId) {
		const startPoint = await locationDAL.createLocation({
			locationType: LocationType.DEFAULT,
			description: `Starting point of '${hike.title}'`,
			point: [hike.startPointLng, hike.startPointLat]
		});
		hike.startPointId = startPoint._id;
	}
	if (!hike.endPointId) {
		const endPoint = await locationDAL.createLocation({
			locationType: LocationType.DEFAULT,
			description: `End point of '${hike.title}'`,
			point: [hike.endPointLng, hike.endPointLat]
		});
		hike.endPointId = endPoint._id;
	}

	// Create new locations for the reference points
	const referencePoints = await Promise.all(
		hike.referencePoints.map((referencePoint) => locationDAL.createLocation(referencePoint))
	);

	// Create new hike
	const newHike = hikeDAL.createHike({
		title: hike.title,
		length: hike.length,
		ascent: hike.ascent,
		expectedTime: hike.expectedTime,
		difficulty: hike.difficulty,
		description: hike.description,
		startPoint: hike.startPointId,
		endPoint: hike.endPointId,
		referencePoints: referencePoints.map((referencePoint) => referencePoint._id),
		trackPoints: hike.trackPoints
	});

	return newHike;
}


/**
 * Updates a hike with description.
 * @param {*} id Hike to be update
 * @param {*} description description of hike
 * @returns
 */
async function updateHike(id,description){
	const newHike = hikeDAL.updateHike(id, description);
	return newHike;
}

module.exports = { createHike, updateHike };
