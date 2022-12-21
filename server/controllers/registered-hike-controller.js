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
		console.log(hikesForUser);
		console.log(!hikesForUser.some((h) => h._id.toString() === id)); //
		if (!hikesForUser.some((h) => h._id.toString() === id)) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json(new Error("Can't end another user's recorded hike"));
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
