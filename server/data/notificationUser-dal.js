const NotificationUser = require("../models/notificationUser-model");
const RegisteredHike = require("../models/registered-hike-model");
const Hike = require("../models/hike-model");
const ObjectId = require("mongoose").Types.ObjectId;
const utils = require("../helper/utility")

async function getNotificationUser() {
    return await NotificationUser.find()
}

async function getNotificationUserByUserID(userID) {
    return await NotificationUser.find({ user: userID })
}

async function addRegisteredHike(hikeRegisteredID, userID) {
    
    const completedHikes = await RegisteredHike.find({user: userID})
    const notificationUser = await NotificationUser.findOne({user: userID})
    const hikeRegistered = await RegisteredHike.findById({_id: hikeRegisteredID})
    const hike = await Hike.findById({_id: hikeRegistered.hike})
    let currNotificaitonUser

    if(!notificationUser) {
        currNotificaitonUser = await NotificationUser.create({
            user: ObjectId(userID),
            completedHikes: [],
            timeToNotify: hike.expectedTime * 2
        })
    } else {
        if(completedHikes.length < 30) {
            currNotificaitonUser = await NotificationUser.findOneAndUpdate({ user: userID, timeToNotify: hike.expectedTime * 2})
        } else {
            const times = []
            completedHikes.forEach(async() => {
                const hike = await Hike.findById({_id: hike})
                times.push(hike.expectedTime)
            })
            const percentile = utils.percentile(times, hike.expectedTime)
            currNotificaitonUser = await NotificationUser.findOneAndUpdate({ user: userID, timeToNotify: percentile})
        }
    }
    return currNotificaitonUser

}

async function addCompletedHike(hikeRegisteredID, userID) {
    const notificationUser = await NotificationUser.findOne({user: userID})
    notificationUser.completedHikes.push(hikeRegisteredID)
    const updatedNotificationUser = await NotificationUser.findOneAndUpdate({user: userID, completedHikes: notificationUser.completedHikes, timeToNotify: 0})
    return updatedNotificationUser
}

module.exports = {
    getNotificationUser,
    getNotificationUserByUserID,
    addRegisteredHike,
    addCompletedHike
}