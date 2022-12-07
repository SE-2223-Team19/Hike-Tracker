const mongoose = require("mongoose");
const { Schema } = mongoose;
const { LocationType } = require("./enums");
const Location = require("./location-model");

// Location Schema
const Hut = Location.discriminator(LocationType.HUT, new Schema({
    name: {
        type: String,
        required: true
    },
    altitude: {
        type: Number,
        required: true
    },
    numberOfBeds: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    webSite: {
        type: String,
        required: false
    },
    peopleWorks: { 
        type: [Schema.Types.ObjectId], 
        ref: "User", 
        required: true 
    }
}));

module.exports = Hut;
