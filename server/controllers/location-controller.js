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
			locationType: joi.string().valid(...Object.values(LocationType)),
			description: joi.string(),
			locationLat: joi.number().min(-90).max(90),
			locationLon: joi.number().min(-180).max(180).when(joi.ref("locationLat"), {
				is: joi.exist(),
				then: joi.required(),
				otherwise: joi.forbidden()
			}),
			locationRadius: joi.number().greater(0).when(joi.ref("locationLat"), {
				is: joi.exist(),
				then: joi.required(),
				otherwise: joi.forbidden()
			})
		});

		const { error, value } = schema.validate(query);

		if (error) throw error;

		let filter = {};

		if (value.locationType) filter.locationType = value.locationType;
		if (value.description) filter.description = { $regex: value.description };
		if (value.locationLat && value.locationLon && value.locationRadius) filter.point = {
			$near: {
				$geometry: {
					type: "Point",
					coordinates: [value.locationLon, value.locationLat]
				},
				$maxDistance: value.locationRadius // Distance in meters
			}
		};

		const locations = await locationDAL.getLocations(filter);
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
			locationType: joi
				.string()
				.valid(...Object.values(LocationType))
				.required(),
			description: joi.string().required(),
			point: joi.array().items(joi.number()).length(2).required(),
		});

		// Validate request body against schema
		console.log(body);
		const { error, value } = schema.validate(body);

		if (error) throw error; // Joi validation error, goes to catch block

		// Create new location
		const createdLocation = await locationDAL.createLocation(value);
		return res.status(StatusCodes.CREATED).json(createdLocation);
	} catch (err) {
		console.log(err.message);
		return res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
	}
}

async function updateLocationDescription(req, res) {
	try {
		const { params, body } = req;
		const id = params.id;
		const schema = joi.object().keys({
			description: joi.string().required()
		});

		const { error, value } = schema.validate(body);

		if (error) throw error;
		const description = value.description;
		const result = await locationDAL.updateLocationDescription(id, description);
		return res.status(StatusCodes.OK).json(result);
	} catch (err) {
		return res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
	}
}

module.exports = {
	getLocations,
	createLocation,
	updateLocationDescription
};
