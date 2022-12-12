const joi = require("joi");
const { ObjectId } = require("mongoose").Types;
const { StatusCodes } = require("http-status-codes");
const Hike = require("../models/hike-model");
const hikeDAL = require("../data/hike-dal");
const locationDAL = require("../data/location-dal");
const { Difficulty, LocationType, HikeCondition } = require("../models/enums");

/**
 * GET /hike
 * Get hikes with a pagination mechanism
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
async function getHikes(req, res) {
	try {
		const { query } = req;

		const schema = joi.object().keys({
			minLength: joi.number(),
			maxLength: joi.number(),
			minAscent: joi.number(),
			maxAscent: joi.number(),
			minExpectedTime: joi.number(),
			maxExpectedTime: joi.number(),
			difficulty: joi.string().valid(...Object.values(Difficulty)),
			createdBy: joi.string(),
			// Location validation
			locationCoordinatesLat: joi.number().min(-90).max(90),
			locationCoordinatesLng: joi
				.number()
				.min(-180)
				.max(180)
				.when(joi.ref("locationCoordinatesLat"), {
					is: joi.exist(),
					then: joi.required(),
					otherwise: joi.forbidden(),
				}),
			locationRadius: joi.number().greater(0).when(joi.ref("locationCoordinatesLat"), {
				is: joi.exist(),
				then: joi.required(),
				otherwise: joi.forbidden(),
			}),
			page: joi.number().greater(0),
			pageSize: joi.number().greater(0),
		});

		const { error, value } = schema.validate(query);

		if (error) throw error;

		let filter = {};

		if (value.minLength) filter.length = { ...filter.length, $gt: value.minLength };
		if (value.maxLength) filter.length = { ...filter.length, $lt: value.maxLength };
		if (value.minAscent) filter.ascent = { ...filter.ascent, $gt: value.minAscent };
		if (value.maxAscent) filter.ascent = { ...filter.ascent, $lt: value.maxAscent };
		if (value.minExpectedTime)
			filter.expectedTime = { ...filter.expectedTime, $gt: value.minExpectedTime };
		if (value.maxExpectedTime)
			filter.expectedTime = { ...filter.expectedTime, $lt: value.maxExpectedTime };
		if (value.difficulty) filter.difficulty = value.difficulty;
		if (value.createdBy) filter.createdBy = new ObjectId(value.createdBy);
		if (value.locationCoordinatesLat && value.locationCoordinatesLng && value.locationRadius)
			filter.trackPoints = {
				$geoNear: {
					near: {
						type: "Point",
						coordinates: [value.locationCoordinatesLng, value.locationCoordinatesLat],
					},
					maxDistance: value.locationRadius,
					distanceField: "distance",
					spherical: true,
				},
			};

		const hikes = await hikeDAL.getHikes(value.page, value.pageSize, filter);
		return res.status(StatusCodes.OK).json(hikes);
	} catch (err) {
		return res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
	}
}

/**
 * GET /hike/:id
 * Gets a single Hike by its id
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
async function getHikeById(req, res) {
	try {
		const { params } = req;

		const hike = await hikeDAL.getHikeById(params.id);

		if (hike === undefined) {
			return res.status(StatusCodes.NOT_FOUND);
		}

		return res.status(StatusCodes.OK).json(hike);
	} catch (err) {
		return res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
	}
}

/**
 * POST /hike
 * Creates a new hike
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
async function createHike(req, res) {
	
	try {
		// Validate request body
		const { body } = req;

		// Hike validation schema
		const schema = joi.object().keys({
			title: joi.string().required(),
			length: joi.number().required(),
			ascent: joi.number().required(),
			expectedTime: joi.number().required(),
			difficulty: joi
				.string()
				.required()
				.valid(...Object.values(Difficulty)),
			description: joi.string().required(),
			startPoint: joi.string().allow(null),
			endPoint: joi.string().allow(null),
			linkedHuts: joi.array().items(joi.string()),
			trackPoints: joi.array().items(joi.array().items(joi.number()).length(2)),
			referencePoints: joi.array().items(joi.array().items(joi.number()).length(2)),
		});

		// Validate request body against schema
		const { error, value } = schema.validate(body);

		if (error) throw error; // Joi validation error, goes to catch block

		// Parse GPX file moved to frontend
		// Adding currently logged in user
		value.createdBy = req.user._id;

		const createdHike = await hikeDAL.createHike(value);

		const huts = await locationDAL.getLocations(undefined, undefined, {
			locationType: LocationType.HUT,
			nearHike: [
				{
					$lookup: {
						from: Hike.collection.name,
						as: "hikes",
						let: {
							point: "$point"
						},
						pipeline: [
							{
								$geoNear: {
									near: {
										type: "Point",
										coordinates: "$$point"
									},
									spherical: true,
									distanceField: "distance",
									maxDistance: 5000,
									query: {
										_id: new ObjectId(createdHike._id)
									}
								}
							}
						]
					}
				},
				{
					$unwind: {
						path: "$hikes"
					}
				},
				{
					$project: {
						hikes: 0
					}
				}
			]
		});
		if (!createdHike.linkedHuts.every(hut => huts.some(h => h._id === hut))) {
			await hikeDAL.deleteHikeById(createdHike._id);
			throw new Error("The linked huts are too far from the hike track points");
		}

		return res.status(StatusCodes.CREATED).json(createdHike);
	} catch (err) {
		return res.status(StatusCodes.BAD_REQUEST).json({ err: err.message, stack: err.stack });
	}
}

/**
 * PATCH /hike/:id
 * Updates an hike
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
async function updateHike(req, res) {
	try {
		// Validate request body
		const { params, body } = req;

		// Hike validation schema
		const schema = joi.object().keys({
			title: joi.string(),
			length: joi.number(),
			ascent: joi.number(),
			expectedTime: joi.number(),
			difficulty: joi.string().valid(...Object.values(Difficulty)),
			description: joi.string(),
			startPoint: joi.string().allow(null),
			endPoint: joi.string().allow(null),
			linkedHuts: joi.array().items(joi.string()),
			trackPoints: joi.array().items(joi.array().items(joi.number()).length(2)),
			referencePoints: joi.array().items(joi.array().items(joi.number()).length(2)),
			hikeCondition: joi.string().valid(...Object.values(HikeCondition)),
		});

		// Validate request body against schema
		const { error, value } = schema.validate(body);
		

		if (error) throw error; // Joi validation error, goes to catch block

		const hikeUpdated = await hikeDAL.updateHike(params.id, value);

		return res.status(StatusCodes.OK).json(hikeUpdated);
	} catch (err) {
		console.log(err);
		return res.status(StatusCodes.BAD_REQUEST).json({ err: err.message, stack: err.stack });
	}
}

module.exports = {
	getHikes,
	getHikeById,
	createHike,
	updateHike,
};
