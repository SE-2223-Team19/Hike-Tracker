const joi = require("joi");
const { StatusCodes } = require("http-status-codes");
const locationDAL = require("../data/location-dal");
const { LocationType } = require("../models/enums");

/**
 * Get all locations.
 * @param {*} req
 * @param {*} res
 */
async function getLocations(req, res) {
	try {

		const { query } = req;

		const schema = joi.object().keys({
			filters: joi.object().keys({
				type: joi.string().valid(...Object.values(LocationType)),
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

		if (value.filters.type) filter.type = { type: value.filters.type };
		if (value.filters.location) filter.point = {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: value.location.coordinates
                },
                $maxDistance: value.location.radius * 1000 // Wants the distance in meters
            }
        };

		const locations = await locationDAL.getLocations(filter, value.page, value.pageSize);
		return res.status(StatusCodes.OK).json(locations);
	} catch (err) {
		return res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
	}
}

async function createLocation(req, res) {
	try {
		// Validate request body
		const { body } = req;

		// Validation schema
		const schema = joi.object().keys({
			locationType: joi.string().valid(...Object.values(LocationType)).required(),
            description: joi.string().required(),
            point: joi.array().items(joi.number()).length(2).required()
		});

		// Validate request body against schema
		const { error, value } = schema.validate(body);

		if (error) throw error; // Joi validation error, goes to catch block

		// Create new hike
		const createdLocation = await locationDAL.createLocation(value);
		return res.status(StatusCodes.CREATED).json(createdLocation);
	} catch (err) {
		return res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
	}
}

module.exports = {
	getLocations,
	createLocation,
};