const ObjectId = require("mongoose").Types.ObjectId;
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
 * @property {[[Number, Number]]} referencePoints
 * @property {String} startPoint
 * @property {String} endPoint
 * @property {[String]} linkedHuts
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
 * @property {[[Number, Number]]} referencePoints
 * @property {Location} startPoint
 * @property {Location} endPoint
 * @property {[Location]} linkedHuts
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

const commonLookups = [
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
			localField: "linkedHuts",
			foreignField: "_id",
			as: "linkedHuts",
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
			preserveNullAndEmptyArrays: true,
		},
	},
	{
		$unwind: {
			path: "$endPoint",
			preserveNullAndEmptyArrays: true,
		},
	},
	{
		$unwind: {
			path: "$createdBy",
		},
	},
	{
		$addFields: {
			trackPoints: {
				$map: {
					input: "$trackPoints.coordinates",
					as: "t",
					in: {
						$reverseArray: "$$t",
					},
				},
			},
		},
	},
	{
		$project: {
			"createdBy.hash": 0,
			"createdBy.salt": 0,
			"createdBy.uniqueString": 0,
			"createdBy.isValid": 0,
		},
	},
];

/**
 * Get all hikes.
 * @param {*} filterQuery Filter object for MongoDB query
 * @param {Number} page The number of the page
 * @param {Number} pageSize The size of the page
 * @returns {Promise<{data: [Hike]; metadata: [{type: String;}|PaginationMetadata]}|[Hike]>} Hikes
 */
async function getHikes(page, pageSize, filterQuery = {}) {
	const paginationActive = page !== undefined && pageSize !== undefined;

	let p = [];
	if (filterQuery.trackPoints) {
		p = [filterQuery.trackPoints];
		delete filterQuery.trackPoints;
	}
	p = [
		...p,
		{
			$match: filterQuery,
		},
		...commonLookups,
	];
	// If pagination is not used return all
	if (paginationActive) {
		p = [
			...p,
			{
				$facet: {
					data: [
						{
							$skip: (page - 1) * pageSize,
						},
						{
							$limit: pageSize,
						},
					],
					metadata: [
						{
							$count: "totalElements",
						},
						{
							$addFields: {
								type: "pagination",
								currentPage: page,
								pageSize: pageSize,
								totalPages: {
									$ceil: {
										$divide: ["$totalElements", pageSize],
									},
								},
							},
						},
					],
				},
			},
		];
	}
	const hikes = await Hike.aggregate(p);
	if (paginationActive) return hikes[0];
	return hikes;
}

/**
 * Create a new hike.
 * @param {Object} hike Hike to create. Object must match Hike model.
 * @returns {HikeModel}
 */
async function createHike(hike) {
	const newHike = new Hike({
		...hike,
		trackPoints: {
			type: "LineString",
			coordinates: hike.trackPoints.map((p) => [p[1], p[0]]),
		},
	});
	const savedHike = await newHike.save();
	return savedHike;
}

/**
 * Gets a hike by id
 * @param {String} id
 * @returns {Promise<Hike>}
 */
async function getHikeById(id) {
	const hikes = await Hike.aggregate([
		{
			$match: {
				_id: new ObjectId(id),
			},
		},
		...commonLookups,
	]);

	return hikes[0];
}

/**
 * Updates one hike
 * @param {String} id
 * @param {HikeModel} hikeUpdate
 * @returns
 */
async function updateHike(id, hikeUpdate) {
	if (hikeUpdate.trackPoints) {
		hikeUpdate.trackPoints = {
			type: "LineString",
			coordinates: hikeUpdate.trackPoints.map((p) => [p[1], p[0]]),
		};
	}
	const hikeUpdated = await Hike.findByIdAndUpdate(id, hikeUpdate, { returnOriginal: false });
	console.log("updated hike", hikeUpdated);
	return hikeUpdated;
}

module.exports = {
	getHikes,
	createHike,
	getHikeById,
	updateHike,
};
