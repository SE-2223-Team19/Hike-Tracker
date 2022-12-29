const mongoose = require("mongoose");
const { Schema } = mongoose;

// Location Schema
const notificationUserSchema = new Schema({
    // Location Schema Custom Fields
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    completedHikes: {
        type: [Schema.Types.ObjectId],
        ref: "RegisteredHike",
        required: true
    },
    timeToNotify: {
        type: Number,
        required: true
    }
});

// Location Model
const NotificationUser = mongoose.model("NotificationUser", notificationUserSchema);

module.exports = NotificationUser;
