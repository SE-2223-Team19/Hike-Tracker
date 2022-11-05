const mongoose = require("mongoose");
const { Schema } = mongoose;
const { LocationType } = require("./enums");

// Location Schema
const locationSchema = new Schema({
	// MongoDB Point Schema Required Fields for GeoJSON
	type: {
		type: String,
		enum: ["Point"],
		required: true,
	},
	coordinates: {
		type: [Number],
		required: true,
	},
	// Location Schema Custom Fields
	locationType: { type: String, enum: Object.values(LocationType) },
	description: String,
	point: { type: pointSchema, index: { type: "2dsphere" } },
});

// Location Model
const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
