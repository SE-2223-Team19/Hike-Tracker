const Hike = require("../models/hike-model");
const Location = require("../models/location-model");
const User = require("../models/user-model");

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
 */

/**
 * @typedef {Object} Location
 * @property {String} _id
 * @property {String} description
 * @property {[Number, Number]} point
 */

/**
 * @typedef {Object} User
 * @property {String} _id
 * @property {String} email
 * @property {String} fullName
 * @property {String} userType
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
 * @property {User} createdBy
 */

/**
 * @typedef {Object} PaginationMetadata
 * @property {String} type
 * @property {Number} totalElements
 * @property {Number} currentPage
 * @property {Number} pageSize
 * @property {Number} totalPages
 */

/**
 * Get all hikes.
 * @param {*} filterQuery Filter object for MongoDB query
 * @param {Number} page The number of the page
 * @param {Number} pageSize The size of the page
 * @returns {Promise<{data: [Hike]; metadata: [{type: String;}|PaginationMetadata]}>} Hikes
 */
async function getHikes(filterQuery = {}, page = 1, pageSize = 10) {
	const commonPipeline = [
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
		{
			$project: {
				"createdBy.hash": 0,
				"createdBy.salt": 0,
				"createdBy.uniqueString": 0,
				"createdBy.isValid": 0,
			}
		},
		{
			$facet: {
				data: [
					{
						$skip: (page - 1) * pageSize
					},
					{
						$limit: pageSize
					}
				],
				metadata: [
					{
						$count: "totalElements"
					},
					{
						$addFields: {
							type: "pagination",
							currentPage: page,
							pageSize: pageSize,
							totalPages: {
								$ceil: {
									$divide: [ "$totalElements", pageSize ]
								}
							}
						}
					}
				]
			}
		}
	];

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
				$replaceRoot: {
					newRoot: "$hikes",
				}
			},
			{
				$match: filterQuery,
			},
			...commonPipeline
		]);
		return hikes[0];
	}

	const hikes = await Hike.aggregate([
		{
			$match: filterQuery,
		},
		...commonPipeline
	]);

	return hikes[0];
}

/**
 * Create a new hike.
 * @param {Object} hike Hike to create. Object must match Hike model.
 * @returns {HikeModel}
 */
async function createHike(hike) {
	const newHike = new Hike(hike);
	const savedHike = await newHike.save();
	return savedHike;
}

/**
 * Gets a hike by id
 * @param {String} id
 * @returns {Hike}
 */
async function getHikeById(id) {
	const hike = await Hike.findById(id)
		
	return hike;
}

/**
 * Updates one hike
 * @param {String} id
 * @param {HikeModel} newData
 * @returns
 */
async function updateHike(id, hikeUpdated) {
	const hikeUpdate = await Hike.findByIdAndUpdate(id, hikeUpdated, { new: true });
	return hikeUpdate;
}

module.exports = {
	getHikes,
	createHike,
	getHikeById,
	updateHike,
};
