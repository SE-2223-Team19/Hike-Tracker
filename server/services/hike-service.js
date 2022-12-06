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
 * @property {String} startPoint
 * @property {String} endPoint
 * @property {[String]} referencePoints
 * @property {String} createdBy
 * @property {String} hikeCondition
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
 * @property {Location} startPoint
 * @property {Location} endPoint
 * @property {[Location]} referencePoints
 * @property {String} createdBy
 * @property {String} hikeCondition
 */

/**
 * Creates a new hike and new locations for the start point, end point and reference points.
 * @param {Hike} hike Hike to be created
 * @param {*} referencePoints Reference points related to the hike, that will be created as entities in the database (Hut, Parking, etc.)
 * @returns {Promise<HikeModel>}
 */
async function createHike(hike) {
	// Create new locations for the start point and end point if they don't exist
	if (!hike.startPoint._id) {
		const startPoint = await locationDAL.createLocation({
			locationType: LocationType.DEFAULT,
			description: `Starting point of '${hike.title}'`,
			point: [hike.startPoint.point.lng, hike.startPoint.point.lat],
		});
		hike.startPointId = startPoint._id;
	}
	if (!hike.endPoint._id) {
		const endPoint = await locationDAL.createLocation({
			locationType: LocationType.DEFAULT,
			description: `End point of '${hike.title}'`,
			point: [hike.endPoint.point.lng, hike.endPoint.point.lat],
		});
		hike.endPointId = endPoint._id;
	}

	// Create new locations for the reference points if they don't exist
	const referencePoints = await Promise.all(
		hike.referencePoints.map(async (referencePoint) => {
			if (!referencePoint._id) {
				return await locationDAL.createLocation({
					locationType: referencePoint.locationType,
					description: referencePoint.description,
					point: [referencePoint.point.lng, referencePoint.point.lat],
				});
			} else {
				return referencePoint;
			}
		})
	);

	// Create new hike
	const newHike = hikeDAL.createHike({
		title: hike.title,
		length: hike.length,
		ascent: hike.ascent,
		expectedTime: hike.expectedTime,
		difficulty: hike.difficulty,
		description: hike.description,
		startPoint: hike.startPoint._id || hike.startPointId,
		endPoint: hike.endPoint._id || hike.endPointId,
		referencePoints: referencePoints.map((referencePoint) => referencePoint._id),
		trackPoints: hike.trackPoints,
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
		if (typeof point === "string") { // ObjectId to check for existance
			const pt = await locationDAL.getLocationById(point);
			if (!pt) {
				throw new Error(`Point doesn't exist: _id = ${point}`)
			}
			return pt._id;
		}
		const pt = await locationDAL.createLocation({
			locationType: point.locationType,
			description: point.description,
			point: [point.point.lng, point.point.lat],
		});
		if (!pt) {
			throw new Error(`Could't create point: ${point}`)
		}
		return pt._id;
	}
	throw new Error("A point must be passed");
}

async function checkhikeCondition(condition){
	if(condition !== null && condition !== undefined){
		if(typeof condition === 'string'){
			const status = await hikeDAL.getHikeById(condition);
			if(!status){
				throw new Error(`Hike doesn't exist:_id= ${condition}`)
			}
			return status
		}
		 const status = await hikeDAL.createHike({
			hikeCondition: condition.hikeCondition
		 });
		 if(!status){
			throw new Error(`Couldn't update hikeCondition:${condition}`)
		 }
		 return status


	}
}



/**
 * Updates a hike with description.
 * @param {String} id Hike to be update
 * @param {HikeModel} changes changes to be applied
 * @returns {Promise<Hike>}
 */
async function updateHike(id, changes, hike) {
	
	
	if (changes.startPoint) {
		changes.startPoint = await checkPropertyLocation(changes.startPoint);
	}

	if (changes.endPoint) {
		changes.endPoint = await checkPropertyLocation(changes.endPoint);
	}

	if (changes.referencePoints) {
		changes.referencePoints = await Promise.all(
			changes.referencePoints.map(checkPropertyLocation)
		);
		changes.referencePoints = [...new Set([...hike.referencePoints, ...changes.referencePoints])];
	}
	if (changes.hikeCondition){
		changes.hikeCondition= await checkhikeCondition(changes.hikeCondition)
	}

	


	const updatedHike = await hikeDAL.updateHike(id, changes);

	return updatedHike;
}

async function getHikeById(id) {
	const hike = await hikeDAL.getHikeById(id);
	return hike;
}

module.exports = { createHike, updateHike, getHikeById };
