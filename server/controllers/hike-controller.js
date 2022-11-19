const joi = require("joi");
const { StatusCodes } = require("http-status-codes");
const hikeDAL = require("../data/hike-dal");
const hikeService = require("../services/hike-service");
const { Difficulty, LocationType } = require("../models/enums");
const GpxParser = require("gpxparser");

/**
 * GET /hike
 * Get all hikes.
 * @param {*} req
 * @param {*} res
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
			// Location validation
			locationCoordinatesLat: joi.number(),
			locationCoordinatesLng: joi.number(),
			locationRadius: joi.number().greater(0).description("Max distance in kilometers"),
			page: joi.number().greater(0).default(1),
			pageSize: joi.number().greater(0).default(100),
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
		if (value.locationCoordinatesLat && value.locationCoordinatesLng && value.locationRadius)
			filter.startingPoint = {
				coordinates: [value.locationCoordinatesLng, value.locationCoordinatesLat],
				radius: value.locationRadius,
			};

		const hikes = await hikeDAL.getHikes(filter, value.page, value.pageSize);
		return res.status(StatusCodes.OK).json(hikes);
	} catch (err) {
		return res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
	}
}

async function createHike(req, res) {
	try {
		// Validate request body
		const { body } = req;

		// Location validation schema
		const locationSchema = joi.object().keys({
			_id: joi.string(),
			locationType: joi
				.string()
				.valid(...Object.values(LocationType))
				.required(),
			description: joi.string().allow(""),
			point: joi.object().keys({
				lat: joi.number().required(),
				lng: joi.number().required(),
			}),
		});

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
			startPoint: locationSchema.required(),
			endPoint: locationSchema.required(),
			referencePoints: joi.array().items(locationSchema),
			trackPoints: joi.array().items(joi.array().items(joi.number()).length(2)),
		});

		// Validate request body against schema
		const { error, value } = schema.validate(body);

		if (error) throw error; // Joi validation error, goes to catch block

		// Parse GPX file moved to frontend

		// Create new hike
		const createdHike = await hikeService.createHike(value);
		return res.status(StatusCodes.CREATED).json(createdHike);
	} catch (err) {
		return res.status(StatusCodes.BAD_REQUEST).json({ err: err.message, stack: err.stack });
	}
}

async function updateHike(req, res) {
	const { params, body } = req;

	console.log("params", params);
	console.log("body", body);
	return;
}

module.exports = {
	getHikes,
	createHike,
	updateHike,
};
