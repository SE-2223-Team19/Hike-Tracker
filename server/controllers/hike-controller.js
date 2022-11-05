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
		// TODO: Add filters

		const hikes = await hikeDAL.getHikes();
		return res.status(StatusCodes.OK).json(hikes);
	} catch (err) {
		return res.json({ err: err.message });
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
