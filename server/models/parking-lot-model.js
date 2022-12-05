const mongoose = require("mongoose");
const { Schema } = mongoose;
const { LocationType } = require("./enums");
const Location = require("./location-model");

// Location Schema
const ParkingLot = Location.discriminator(LocationType.PARKING_LOT, new Schema({
    name: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    }
}));

module.exports = ParkingLot;
