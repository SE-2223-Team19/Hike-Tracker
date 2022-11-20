const { LocationType } = require("../models/enums");
const Hike = require("../models/hike-model");
const Location = require("../models/location-model");
const User = require("../models/user-model");

/**
 * Get all hikes.
 * @param {*} filterQuery Filter object for MongoDB query
 * @param {Number} page The number of the page
 * @param {Number} pageSize The size of the page
 * @returns Hikes
 */
async function getHikes(filterQuery = {}, page = 1, pageSize = 10) {
	// Need geospatial query
	if (filterQuery.startPoint !== undefined && typeof filterQuery.startPoint !== "string") {
		const coordinates = filterQuery.startPoint.coordinates;
		const maxDistance = filterQuery.startPoint.radius;
		delete filterQuery.startPoint;
		const hikes = await Location.aggregate([
			{
				$geoNear: {
					near: {
						type: "Point",
						coordinates: coordinates,
					},
					maxDistance: maxDistance,
					distanceField: "distance",
				},
			},
			{
				$lookup: {
					from: Hike.collection.name,
					localField: "_id",
					foreignField: "startPoint",
					as: "hikes",
				},
			},
			{
				$unwind: {
					path: "$hikes",
				},
			},
			{
				$replaceWith: "$hikes",
			},
			{
				$match: filterQuery,
			},
			{
				$skip: (page - 1) * pageSize,
			},
			{
				$limit: pageSize,
			},
			{
				$lookup: {
					from: Location.collection.name,
					localField: "startPoint",
					foreignField: "_id",
					as: "startPoint",
				},
			},
			{
				$lookup: {
					from: Location.collection.name,
					localField: "endPoint",
					foreignField: "_id",
					as: "endPoint",
				},
			},
			{
				$lookup: {
					from: Location.collection.name,
					localField: "referencePoints",
					foreignField: "_id",
					as: "referencePoints",
				},
			},
			{
				$lookup: {
					from: User.collection.name,
					localField: "createdBy",
					foreignField: "_id",
					as: "createdBy",
				},
			},
			{
				$unwind: {
					path: "$startPoint",
				},
			},
			{
				$unwind: {
					path: "$endPoint",
				},
			},
			{
				$unwind: {
					path: "$createdBy",
				},
			},
		]);
		return hikes;
	}

	const hikes = await Hike.find(filterQuery)
		.skip((page - 1) * pageSize)
		.limit(pageSize)
		.populate("startPoint")
		.populate("endPoint")
		.populate("referencePoints")
		.populate("createdBy")
		.lean();

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

async function updateHike(id, hike) {

	const hikeToUpdate = await Hike.findById(id)
	
	hikeToUpdate.title = hike.title ? hike.title : hikeToUpdate.title
	hikeToUpdate.length = hike.length ? hike.length : hikeToUpdate.length
	hikeToUpdate.ascent = hike.ascent ? hike.ascent : hikeToUpdate.ascent
	hikeToUpdate.expectedTime = hike.expectedTime ? hike.expectedTime : hikeToUpdate.expectedTime
	hikeToUpdate.difficulty = hike.difficulty ? hike.difficulty : hikeToUpdate.difficulty
	hikeToUpdate.description = hike.description ? hike.description : hikeToUpdate.description
	hikeToUpdate.startPoint = hike.startPoint ? hike.startPoint : hikeToUpdate.startPoint
	hikeToUpdate.endPoint = hike.endPoint ? hike.endPoint : hikeToUpdate.endPoint
	hikeToUpdate.createdBy = hike.createdBy ? hike.createdBy : hikeToUpdate.createdBy

	if(hike.referencePoints) {
		hike.referencePoints.forEach(e => {
			hikeToUpdate.referencePoints.push(e)
		})
	}

	if(hike.trackPoints) {
		hike.trackPoints.forEach(e => {
			hikeToUpdate.trackPoints.push(e)
		})
	}

	const res = await Hike.findByIdAndUpdate(id, hikeToUpdate)
	return res

}

module.exports = {
	getHikes,
	createHike,
	updateHike
};
