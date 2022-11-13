const joi = require("joi");
const { StatusCodes } = require("http-status-codes");
const hikeDAL = require("../data/hike-dal");
const { Difficulty } = require("../models/enums");

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
			filters: joi.object().keys({
				minLength: joi.number(),
				maxLength: joi.number(),
				minAscent: joi.number(),
				maxAscent: joi.number(),
				minExpectedTime: joi.number(),
				maxExpectedTime: joi.number(),
				difficulty: joi.string().valid(...Object.values(Difficulty)),
				// Location validation
				location: joi.object().keys({
					coordinates: joi.array().items(joi.number()).length(2).required().description("Coordinates in the format [<longitude>, <latitude>]"),
					radius: joi.number().required().description("Max distance in kilometers")
				})
			}),
			page: joi.number().greater(0).required(),
			pageSize: joi.number().greater(0).required()
		});

		const { error, value } = schema.validate(query);

		if (error) throw error;

		let filter = {};

		if (value.filters.minLength) filter.length = { ...filter.length, $gt: value.filters.minLength };
		if (value.filters.maxLength) filter.length = { ...filter.length, $lt: value.filters.maxLength };
		if (value.filters.minAscent) filter.ascent = { ...filter.ascent, $gt: value.filters.minAscent };
		if (value.filters.maxAscent) filter.ascent = { ...filter.ascent, $lt: value.filters.maxAscent };
		if (value.filters.minExpectedTime) filter.expectedTime = { ...filter.expectedTime, $gt: value.filters.minExpectedTime };
		if (value.filters.maxExpectedTime) filter.expectedTime = { ...filter.expectedTime, $lt: value.filters.maxExpectedTime };
		if (value.filters.difficulty) filter.difficulty = value.filters.difficulty;
		if (value.filters.location) filter.startingPoint = value.filters.location;

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

		// Validation schema
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
			// TODO: Add validation for startPoint, endPoint, and referencePoints
			// How to validate on database?
		});

		// Validate request body against schema
		const { error, value } = schema.validate(body);

		if (error) throw error; // Joi validation error, goes to catch block

		// Create new hike
		const createdHike = await hikeDAL.createHike(value);
		return res.status(StatusCodes.CREATED).json(createdHike);
	} catch (err) {
		return res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
	}
}

module.exports = {
	getHikes,
	createHike,
};
