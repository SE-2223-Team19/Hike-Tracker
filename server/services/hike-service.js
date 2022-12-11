const locationDAL = require("../data/location-dal");
const hikeDAL = require("../data/hike-dal");
const { LocationType } = require("../models/enums");

/**
 * @typedef {Object} HikeModel
 * @property {String} _id
 * @property {String} title
 * @property {Number} ascent
 * @property {Number} expectedTime
 * @property {String} difficulty
 * @property {String} description
 * @property {Number} length
 * @property {[[Number, Number]]} trackPoints
 * @property {[[Number, Number]]} referencePoints
 * @property {String} startPoint
 * @property {String} endPoint
 * @property {[String]} linkedHuts
 * @property {String} createdBy
 * @property {String} hikeCondition
 * @property {String} hutNumber
 */

/**
 * @typedef {Object} Location
 * @property {String} _id
 * @property {String} description
 * @property {[Number, Number]} point
 */

/**
 * @typedef {Object} Hike
 * @property {String} _id
 * @property {String} title
 * @property {Number} ascent
 * @property {Number} expectedTime
 * @property {String} difficulty
 * @property {String} description
 * @property {Number} length
 * @property {[[Number, Number]]} trackPoints
 * @property {[[Number, Number]]} referencePoints
 * @property {Location} startPoint
 * @property {Location} endPoint
 * @property {[Location]} linkedHuts
 * @property {String} createdBy
 * @property {String} hikeCondition
 */

/**
 * Creates a new hike and new locations for the start point, end point and reference points.
 * @param {Hike} hike Hike to be created
 * @returns {Promise<HikeModel>}
 */
async function createHike(hike) {
	// Create new locations for the start point and end point if they don't exist
	if (hike.startPoint && !hike.startPoint._id) {
		hike.startPoint = await locationDAL.createLocation({
			locationType: LocationType.DEFAULT,
			description: `Starting point of '${hike.title}'`,
			point: [hike.startPoint.point.lng, hike.startPoint.point.lat],
		});
	}
	if (hike.endPoint && !hike.endPoint._id) {
		hike.endPoint = await locationDAL.createLocation({
			locationType: LocationType.DEFAULT,
			description: `End point of '${hike.title}'`,
			point: [hike.endPoint.point.lng, hike.endPoint.point.lat],
		});
	}

	// Create new locations for the reference points if they don't exist
	if (hike.linkedHuts) {
		await Promise.all(
			hike.linkedHuts.map(async (linkedHut) => {
				if (!linkedHut._id) {
					return await locationDAL.createLocation({
						locationType: linkedHut.locationType,
						description: linkedHut.description,
						point: [linkedHut.point.lng, linkedHut.point.lat],
					});
				} else {
					return linkedHut;
				}
			})
		);
	}

	// Create new hike
	const newHike = hikeDAL.createHike({
		title: hike.title,
		length: hike.length,
		ascent: hike.ascent,
		expectedTime: hike.expectedTime,
		difficulty: hike.difficulty,
		description: hike.description,
		startPoint: hike.startPoint === null ? null : hike.startPoint._id,
		endPoint: hike.endPoint === null ? null : hike.endPoint._id,
		linkedHuts: hike.linkedHuts,
		trackPoints: hike.trackPoints,
		referencePoints: hike.referencePoints,
		createdBy: hike.createdBy,
	});

	return newHike;
}

/**
 * Checks if the point is a location to be created
 * @param {String|Location} point
 * @returns {Promise<String>}
 */
async function checkPropertyLocation(point) {
	if (point !== null && point !== undefined) {
		if (typeof point === "string") {
			// ObjectId to check for existance
			const pt = await locationDAL.getLocationById(point);
			if (!pt) {
				throw new Error(`Point doesn't exist: _id = ${point}`);
			}
			return pt._id;
		}
		const pt = await locationDAL.createLocation({
			locationType: point.locationType,
			description: point.description,
			point: [point.point.lng, point.point.lat],
		});
		if (!pt) {
			throw new Error(`Could't create point: ${point}`);
		}
		return pt._id;
	}
	throw new Error("A point must be passed");
}

 





/**
 * Updates a hike with description.
 * @param {String} id Hike to be update
 * @param {HikeModel} changes changes to be applied
 * @returns {Promise<Hike>}
 */
async function updateHike(id, changes) {
	const hike = await getHikeById(id);

	if (changes.startPoint) {
		changes.startPoint = await checkPropertyLocation(changes.startPoint);
	}

	if (changes.endPoint) {
		changes.endPoint = await checkPropertyLocation(changes.endPoint);
	}

	if (changes.linkedHuts) {
		changes.linkedHuts = await Promise.all(changes.linkedHuts.map(checkPropertyLocation));
		changes.linkedHuts = [...new Set([...hike.linkedHuts._id, ...changes.linkedHuts])];
	}

	if (changes.trackPoints) {
		changes.trackPoints = [...new Set([...hike.trackPoints, ...changes.trackPoints])];
	}

	//TODO: Sorting of reference points.
	//IDEA: Using a shortest path first algorithm should be fine

	const updatedHike = await hikeDAL.updateHike(id, changes);
	
	return updatedHike;
}

async function getHikeById(id) {
	const hike = await hikeDAL.getHikeById(id);
	
	return hike;
}

module.exports = { createHike, updateHike, getHikeById };
