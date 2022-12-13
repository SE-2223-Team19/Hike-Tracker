const mongoose = require("mongoose");
const { Schema } = mongoose;
const { LocationType } = require("./enums");
const Location = require("./location-model");

// Location Schema
const ParkingLot = Location.discriminator(
	LocationType.PARKING_LOT,
	new Schema({
		name: {
			type: String,
			required: true,
		},
		capacity: {
			type: Number,
			required: true,
		},
		thumbnail: {
			type: Schema.Types.ObjectId,
			ref: "Image",
			required: false,
		},
		photos: [{ type: Schema.Types.ObjectId, ref: "Image", required: false }],
	})
);

module.exports = ParkingLot;
