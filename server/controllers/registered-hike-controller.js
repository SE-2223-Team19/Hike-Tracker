const { StatusCodes } = require("http-status-codes");
const joi = require("joi");
const registeredHikeDAL = require("../data/registered-hike-dal");
const notificationUserDAL = require("../data/notificationUser-dal")
const hikeDAL = require("../data/hike-dal");
const user = require("../data/user-dal");
const { sendRegisteredHikeTerminatedEmail } = require("../email/registered-hike");
const sendEmail = require("../email/send-email");

async function startHike(req, res) {
	try {
		const { id } = req.params; // Hike id
		// Start hike for the current user
		const registeredHike = await registeredHikeDAL.insert(req.user._id, id);
		const hike = await hikeDAL.getHikeById(id)
		const time = await notificationUserDAL.addRegisteredHike(registeredHike._id, req.user._id)
		const currUser = await user.getUserById(req.user._id);
		global.scheduledTask[req.user._id] = setInterval(async () => {
			await sendEmail({
				to: currUser.email,
				subject: `[${hike.title}] Unfinished Hike`,
				html: `<p>The hike <b>${hike.title}<b> is not finished by you <b>${currUser.fullName}</p>`
			})
		}, time * 60000)

		return res.status(StatusCodes.CREATED).json(registeredHike);
	} catch (err) {
		console.log(err)
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
	}
}

async function planHike(req, res) {
	try {
		const { id } = req.params; // Hike id
		// Plan hike for the current user
		const registeredHike = await registeredHikeDAL.insertPlan(req.user._id, id);
		return res.status(StatusCodes.CREATED).json(registeredHike);
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
	}
}

async function addRecordPoint(req, res) {
	try {

		const hikeId = req.params.id
		const { point } = req.body

		const registeredHikeUpdated = await registeredHikeDAL.registerPoint(hikeId, point)
		return res.status(StatusCodes.OK).json(registeredHikeUpdated)

	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
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

		await notificationUserDAL.addCompletedHike(registeredHike._id, req.user._id)
		clearInterval(global.scheduledTask[req.user._id])

		return res.status(StatusCodes.OK).json(registeredHike);
	} catch (err) {
		console.log(err)
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
	}
}

async function startPlannedHike(req, res) {
	const { id } = req.params; // Hike id
	try {
		const hikesForUser = await registeredHikeDAL.getRegisteredHikeByUserId(req.user._id);
		if (hikesForUser.length === 0 || !hikesForUser.some((h) => h._id.equals(id))) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json(new Error("Can't find the recorded hike"));
		}
		const registeredHike = await registeredHikeDAL.startPlannedHike(id);
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
		return res.status(StatusCodes.OK).json(registeredHikes);
	} catch (err) {
		console.log(err)
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
	}
}

async function getStats(req, res) {
	const { id } = req.params; // User id

	try {
		const completedRegisteredHikes = await registeredHikeDAL.getCompletedRegisteredHikeByUserId(id);
		const stats = {
			numberHikes: completedRegisteredHikes.length,
			numberKilometers: completedRegisteredHikes.reduce((acc, curr) => acc + curr.hike.length, 0) / 1000,
			highestAltitudeRange: completedRegisteredHikes.reduce((acc, curr) => Math.max(acc, curr.hike.ascent), 0),
			longestLengthHike: completedRegisteredHikes.reduce((acc, curr) => Math.max(acc, curr.hike.length), 0) / 1000,
			longestTimeHike: completedRegisteredHikes.reduce((acc, curr) => Math.max(acc, curr.endTime - curr.startTime), 0) / 36e5,
			shortestLengthHike: completedRegisteredHikes.reduce((acc, curr) => Math.min(acc, curr.hike.length), Number.MAX_VALUE) / 1000,
			shortestTimeHike: completedRegisteredHikes.reduce((acc, curr) => Math.min(acc, curr.endTime - curr.startTime), Number.MAX_VALUE) / 36e5,
			averagePace: completedRegisteredHikes.reduce((acc, curr) => acc + ((curr.endTime - curr.startTime) / 60000) / (curr.hike.length / 1000), 0) / completedRegisteredHikes.length,
			fastestPacedHike: completedRegisteredHikes.reduce((acc, curr) => Math.min(acc, ((curr.endTime - curr.startTime) / 60000) / (curr.hike.length / 1000)), Number.MAX_VALUE),
		}
		return res.status(StatusCodes.OK).json(stats);
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
	}
}
module.exports = {
	startHike,
	planHike,
	endHike,
	startPlannedHike,
	getRegisteredHikes,
	getStats,
	addRecordPoint
};
