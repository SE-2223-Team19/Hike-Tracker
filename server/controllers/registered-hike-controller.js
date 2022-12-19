const { StatusCodes } = require("http-status-codes");
const joi = require("joi");
const registeredHikeDAL = require("../data/registered-hike-dal");

async function startHike(req, res) {
	try {
		const { id } = req.params; // Hike id

		const startHikeSchema = joi.object({
			userId: joi.string().required(),
		});

		const { value, error } = startHikeSchema.validate(req.body);
		if (error) {
			return res.status(StatusCodes.BAD_REQUEST).send(error.details[0].message);
		}

		const { userId } = value;
		const registeredHike = await registeredHikeDAL.insert(userId, id);
		return res.status(StatusCodes.CREATED).send(registeredHike);
	} catch {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Something went wrong");
	}
}

async function endHike(req, res) {
	const { id } = req.params; // Hike id
}

async function getRegisteredHikes(req, res) {
	const { userId } = req.params; // User id

	try {
		const registeredHikes = await registeredHikeDAL.getRegisteredHikeByUserId(userId);
		return res.status(StatusCodes.OK).send(registeredHikes);
	} catch {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Something went wrong");
	}
}

module.exports = {
	startHike,
	endHike,
	getRegisteredHikes,
};
