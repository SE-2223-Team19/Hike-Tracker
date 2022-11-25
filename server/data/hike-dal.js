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
	let pipeline = [];

	// Need geospatial query
	if (filterQuery.startPoint !== undefined && typeof filterQuery.startPoint !== "string") {
		const coordinates = filterQuery.startPoint.coordinates;
		const maxDistance = filterQuery.startPoint.radius;
		delete filterQuery.startPoint;
		pipeline = [
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
		];
	}
	pipeline = [ ...pipeline,
		{
			$match: filterQuery,
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

	const hikes = await Hike.aggregate(pipeline);

	return hikes[0];
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

/**
 * Gets a hike by id
 * @param {string} id
 * @returns
 */
async function getHikeById(id) {
	const hike = await Hike.findById(id)
		.populate("startPoint")
		.populate("endPoint")
		.populate("referencePoints")
		.populate("createdBy")
		.lean();
	return hike;
}

/**
 * Updates one hike
 * @param {*} filter
 * @param {*} newData
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
