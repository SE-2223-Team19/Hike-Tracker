const { StatusCodes } = require("http-status-codes");
const joi = require("joi");
const registeredHikeDAL = require("../data/registered-hike-dal");
const { sendRegisteredHikeTerminatedEmail } = require("../email/registered-hike");

async function startHike(req, res) {
	try {
		const { id } = req.params; // Hike id
		// Start hike for the current user
		const registeredHike = await registeredHikeDAL.insert(req.user._id, id);
		return res.status(StatusCodes.CREATED).json(registeredHike);
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
	}
}

async function endHike(req, res) {
	const { id } = req.params; // Hike id
	try {
		const hikesForUser = await registeredHikeDAL.getRegisteredHikeByUserId(req.user._id);
		if (hikesForUser.length === 0 || !hikesForUser.some((h) => h._id.equals(id))) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json(new Error("Can't find the recorded hike"));
		}
		const registeredHike = await registeredHikeDAL.completeRegisteredHike(id);
		// Inform buddies
		await sendRegisteredHikeTerminatedEmail(
			await (await registeredHike.populate("hike")).populate("user")
		);

		return res.status(StatusCodes.OK).json(registeredHike);
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
	}
}

async function getRegisteredHikes(req, res) {
	const { userId } = req.params; // User id

	try {
		const registeredHikes = await registeredHikeDAL.getRegisteredHikeByUserId(userId);
		return res.status(StatusCodes.OK).send(registeredHikes);
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
	}
}

module.exports = {
	startHike,
	endHike,
	getRegisteredHikes,
};
