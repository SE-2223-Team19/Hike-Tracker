const Hike = require("../models/hike-model");
const Location = require("../models/location-model");
const User = require("../models/user-model");
const locationDAL = require("../data/location-dal");

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

async function updateHike(id, hikeUpdated) {

	const hikeUpdate = await Hike.findByIdAndUpdate(id, hikeUpdated, {new: true});
	return hikeUpdate;


}

async function getHikeById(id) {
	const hike = await Hike.findById(id)
		
	return hike;
}

module.exports = {
	getHikes,
	createHike,
	updateHike,
	getHikeById
};
