const NotificationUser = require("../models/notification-user-model");
const RegisteredHike = require("../models/registered-hike-model");
const Hike = require("../models/hike-model");
const ObjectId = require("mongoose").Types.ObjectId;
const utils = require("../helper/utility");

async function getNotificationUser() {
    return await NotificationUser.find();
}

async function getNotificationUserByUserID(userID) {
    return await NotificationUser.find({ user: new ObjectId(userID) });
}

async function addRegisteredHike(hikeRegisteredID, userID) {
    
    const completedHikes = await RegisteredHike.find({ user: new ObjectId(userID) }).populate("hike");
    const notificationUser = await NotificationUser.findOne({ user: new ObjectId(userID) });
    const hikeRegistered = await RegisteredHike.findById({ _id: new ObjectId(hikeRegisteredID) });
    const hike = await Hike.findById({ _id: hikeRegistered.hike });
    let time = 0;

    if(!notificationUser) {
        time = hike.expectedTime * 2;
        await NotificationUser.create({
            user: userID,
            completedHikes: [],
            timeToNotify: time
        });
    } else {
        if(completedHikes.length < 30) {
            time = hike.expectedTime * 2;
            await NotificationUser.findOneAndUpdate({ user: userID, timeToNotify: time });
        } else {
            time = utils.percentile(completedHikes.map(({ hike }) => hike.expectedTime), hike.expectedTime);
            await NotificationUser.findOneAndUpdate({ user: userID, timeToNotify: time });
        }
    }

    return time;

}

async function addCompletedHike(hikeRegisteredID, userID) {
    const notificationUser = await NotificationUser.findOne({ user: new ObjectId(userID) });
    notificationUser.completedHikes.push(hikeRegisteredID);
    notificationUser.save();
    return notificationUser;
}

module.exports = {
    getNotificationUser,
    getNotificationUserByUserID,
    addRegisteredHike,
    addCompletedHike
};