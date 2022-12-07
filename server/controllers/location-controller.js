const joi = require("joi");
const { StatusCodes } = require("http-status-codes");
const ObjectId = require("mongoose").Types.ObjectId;
const locationDAL = require("../data/location-dal");
const { LocationType } = require("../models/enums");

/**
 * GET /location
 * Get all locations.
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
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
				otherwise: joi.forbidden(),
			}),
			locationRadius: joi.number().greater(0).when(joi.ref("locationLat"), {
				is: joi.exist(),
				then: joi.required(),
				otherwise: joi.forbidden(),
			}),
			page: joi.number().greater(0),
			pageSize: joi.number().greater(0),
			createdBy: joi.string()
		});

		const { error, value } = schema.validate(query);

		if (error) throw error;

		let filter = {};

		if (value.locationType) filter.locationType = value.locationType;
		if (value.description) filter.description = { $regex: value.description };
		if (value.createdBy) filter.createdBy = new ObjectId(value.createdBy);
		if (value.locationLat && value.locationLon && value.locationRadius)
			filter.point = {
				$near: {
					$geometry: {
						type: "Point",
						coordinates: [value.locationLon, value.locationLat],
					},
					$maxDistance: value.locationRadius, // Distance in meters
				},
			};

		const locations = await locationDAL.getLocations(filter, value.page, value.pageSize);
		return res.status(StatusCodes.OK).json(locations);
	} catch (err) {
		console.log(err)
		return res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
	}
}

/**
 * POST /location
 * Creates a new location
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
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
			name: joi.alternatives().conditional("locationType", { 
				is: [LocationType.HUT, LocationType.PARKING_LOT], 
				then: joi.string().required() 
			}),
			capacity: joi.alternatives().conditional("locationType", { 
				is: LocationType.PARKING_LOT, 
				then: joi.number().required() 
			}),
			altitude: joi.alternatives().conditional("locationType", { 
				is: LocationType.HUT, 
				then: joi.number().required() 
			}),
			phone: joi.alternatives().conditional("locationType", { 
				is: LocationType.HUT, 
				then: joi.string().required() 
			}),
			email: joi.alternatives().conditional("locationType", { 
				is: LocationType.HUT, 
				then: joi.string().email().required() 
			}),
			numberOfBeds: joi.alternatives().conditional("locationType", { 
				is: LocationType.HUT, 
				then: joi.number().required() 
			}),
			webSite: joi.alternatives().conditional("locationType", { 
				is: LocationType.HUT, 
				then: joi.string().uri().allow("") 
			})
		});

		// Validate request body against schema
		const { error, value } = schema.validate(body);

		if (error) throw error; // Joi validation error, goes to catch block

		// Create new location
		if(value.locationType == LocationType.HUT) {
			value.createdBy = req.user._id;
		}
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
			description: joi.string().required(),
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

async function updateLocation(req, res) {
	
	try {
		const { params, body } = req
		const id = params.id

		const schema = joi.object().keys({
			locationType: joi
				.string()
				.valid(...Object.values(LocationType))
				.required(),
			name: joi.alternatives().conditional('name',{
				is: [LocationType.HUT, LocationType.PARKING_LOT],
				then: joi.string()
			}),
			altitude: joi.alternatives().conditional('locationType',{
				is: LocationType.HUT,
				then: joi.number()
			}),
			numberOfBeds: joi.alternatives().conditional('locationType',{
				is: LocationType.HUT,
				then: joi.number()
			}),
			phone: joi.alternatives().conditional('locationType',{
				is: LocationType.HUT,
				then: joi.number()
			}),
			email: joi.alternatives().conditional('locationType',{
				is: LocationType.HUT,
				then: joi.string()
			}),
			webSite: joi.alternatives().conditional('locationType',{
				is: LocationType.HUT,
				then: joi.string().uri().allow("") 
			}),
			description: joi.string()
		});

		const { value, error } = schema.validate(body)

		if(error) throw error

		const locationUpdate = value
		const result = await locationDAL.updateLocation(id, locationUpdate)
		return res.status(StatusCodes.OK).json(result)

	} catch(err) {
		console.log(err)
		return res.status(StatusCodes.BAD_REQUEST).json({err: err.message})
	}
}

module.exports = {
	getLocations,
	createLocation,
	updateLocationDescription,
	updateLocation
};
