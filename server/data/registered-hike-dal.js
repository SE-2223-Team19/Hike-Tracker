const ObjectId = require("mongoose").Types.ObjectId;
const Hike = require("../models/hike-model");
const RegisteredHike = require("../models/registered-hike-model");
const { RegisteredHikeStatus } = require("../models/enums");
const fetch = require("node-fetch");

/**
 * Start a new hike, inserting the new registered hike in the database
 * @param {string} userId
 * @param {string} hikeId
 * @returns Newly created registered hike
 */
async function insert(userId, hikeId) {
	if (await userHasActiveRecordedHikes(userId)) {
		throw new Error("User has already an active registered hike");
	}

	const hike = await Hike.findById(hikeId);
	if (!hike) {
		throw new Error("Hike not found");
	}

	const registeredHike = await RegisteredHike.create({
		hike: ObjectId(hikeId),
		user: ObjectId(userId),
		status: RegisteredHikeStatus.ACTIVE,
		startTime: new Date(), // Can be omitted, because there's the createdAt field by default
	});
	return registeredHike;
}

async function update(id, changes) {
	return await RegisteredHike.findByIdAndUpdate(id, changes);
}


/**
 * Plan a new hike, inserting the new registered hike in the database
 * @param {string} userId
 * @param {string} hikeId
 * @returns Newly created registered hike
 */
async function insertPlan(userId, hikeId) {

	const hike = await Hike.findById(hikeId);
	if (!hike) {
		throw new Error("Hike not found");
	}

	const registeredHike = await RegisteredHike.create({
		hike: ObjectId(hikeId),
		user: ObjectId(userId),
		status: RegisteredHikeStatus.PLANNED,
		startTime: new Date(), // Can be omitted, because there's the createdAt field by default
	});
	return registeredHike;
}

/**
 * Add new Point to record points into registeredHikes
 * @param {string} hikeId Id of the RegisteredHike
 * @param {Array} point Array as point object as [Lon, Lat]
 * @returns The updated registered hike
 */

async function registerPoint(hikeId, point) {

	const registeredHike = await RegisteredHike.findById(hikeId);
	if (!registeredHike) {
		throw new Error("Hike not found");
	}
	registeredHike.recordedPoints.push(point);
	registeredHike.timePoints.push(new Date(Date.now()).toString());

	let url = new URL("https://api.open-elevation.com/api/v1/lookup");
	url.searchParams.append("locations", `${point[1]},${point[0]}`);
	const res = await fetch(url);
	if (res.ok) {
		const body = await res.json();
		if (body.results && body.results.length === 1) {
			registeredHike.altitudeRecordedPoints.push(body.results[0].elevation)
		}
	}

	return await RegisteredHike.findOneAndUpdate({ _id: hikeId }, {
		recordedPoints: registeredHike.recordedPoints,
		altitudeRecordedPoints: registeredHike.altitudeRecordedPoints,
		timePoints: registeredHike.timePoints
	}, { new: true });

}

/**
 * Sets the status to COMPLETED
 * @param {string} id Id of the RegisteredHike
 * @returns The saved hike
 */
async function completeRegisteredHike(id) {
	const registeredHike = await RegisteredHike.findById(id);
	if (registeredHike === null)
		return null;
	if (registeredHike.status === RegisteredHikeStatus.ACTIVE) {
		registeredHike.status = RegisteredHikeStatus.COMPLETED;
		registeredHike.endTime = new Date();
	}
	return await registeredHike.save();
}

/**
 * Sets the status to ACTIVE from PLANNED
 * @param {string} id Id of the RegisteredHike
 * @returns The saved hike
 */
async function startPlannedHike(userId, id) {
	if (await userHasActiveRecordedHikes(userId)) {
		throw new Error("User has already an active registered hike");
	}
	const registeredHike = await RegisteredHike.findById(id);
	if (registeredHike === null)
		return null;
	if (registeredHike.status === RegisteredHikeStatus.PLANNED) {
		registeredHike.status = RegisteredHikeStatus.ACTIVE;
	} else {
		throw new Error("Hike is activated")
	}
	return await registeredHike.save();
}

/**
 * Sets the status to CANCELED
 * @param {string} id Id of the RegisteredHike
 * @returns The saved hike
 */
async function cancelRegisteredHike(id) {
	const registeredHike = await RegisteredHike.findById(id);
	if (registeredHike === null)
		return null;
	if (registeredHike.status === RegisteredHikeStatus.ACTIVE) {
		registeredHike.status = RegisteredHikeStatus.CANCELLED;
		registeredHike.endTime = new Date();
	}
	return await registeredHike.save();
}

/**
 * 
 * @param {string} userId Id of the User
 * @returns `true` if the user has active RegisteredHike, `false` otherwise
 */
async function userHasActiveRecordedHikes(userId) {
	const registeredHikes = await RegisteredHike.count({
		user: new ObjectId(userId),
		status: RegisteredHikeStatus.ACTIVE
	});
	return registeredHikes > 0;
}

/**
 * 
 * @param {string} id Id of the registered hike
 * @param {string} buddyId Id of the buddy user to add
 * @returns The saved hike
 */
async function addBuddyToRegisteredHike(id, buddyId) {
	const registeredHike = await RegisteredHike.findById(id);
	if (registeredHike === null)
		return null;
	if (registeredHike.status !== RegisteredHikeStatus.ACTIVE) {
		throw new Error("Can't add buddy to a closed hike");
	}
	if (registeredHike.user.toString() === buddyId) {
		throw new Error("The creator of the hike can't add itself as a buddy");
	}

	if (!registeredHike.buddyUsers.some(b => b.toString() === buddyId)) {
		registeredHike.buddyUsers.push(new ObjectId(buddyId));
	}
	return await registeredHike.save();
}

/**
 * 
 * @param {string} userId The user id
 * @returns The list of all registered hikes created by the user
 */
async function getRegisteredHikeByUserId(userId) {
	const registeredHikes = await RegisteredHike.find({ user: new ObjectId(userId) }).populate("hike");
	return registeredHikes;
}

async function getCompletedRegisteredHikeByUserId(userId) {
	const registeredHikes = await RegisteredHike.find({ user: new ObjectId(userId), status: RegisteredHikeStatus.COMPLETED }).populate("hike");
	return registeredHikes;
}

module.exports = {
	insert,
	update,
	insertPlan,
	completeRegisteredHike,
	startPlannedHike,
	cancelRegisteredHike,
	userHasActiveRecordedHikes,
	addBuddyToRegisteredHike,
	getRegisteredHikeByUserId,
	getCompletedRegisteredHikeByUserId,
	registerPoint
};
