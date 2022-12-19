const ObjectId = require("mongoose").Types.ObjectId;
const Hike = require("../models/hike-model");
const RegisteredHike = require("../models/registered-hike-model");
const { HikeStatus } = require("../models/enums");

/**
 * Start a new hike, inserting the new registered hike in the database
 * @param {string} userId
 * @param {string} hikeId
 * @returns Newly created registered hike
 */
async function insert(userId, hikeId) {
	const hike = await Hike.findById(hikeId);
	if (!hike) {
		throw new Error("Hike not found");
	}
	const registeredHikes = await getRegisteredHikeByUserId(userId);
	if (registeredHikes.find((hike) => hike.hike._id === hikeId)) {
		throw new Error("User already registered to this hike");
	}

	const registeredHike = await RegisteredHike.create({
		hike: ObjectId(hikeId),
		user: ObjectId(userId),
		status: HikeStatus.ACTIVE,
		startTime: new Date(), // Can be omitted, because there's the createdAt field by default
	});
	return registeredHike;
}

async function getRegisteredHikeByUserId(userId) {
	const registeredHikes = await RegisteredHike.find({ user: ObjectId(userId) }).populate("hike");
	return registeredHikes;
}

module.exports = {
	insert,
	getRegisteredHikeByUserId,
};
