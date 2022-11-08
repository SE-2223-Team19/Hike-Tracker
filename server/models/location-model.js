const mongoose = require("mongoose");
const { Schema } = mongoose;
const { LocationType } = require("./enums");

// MongoDB Point Schema 
const pointSchema = new Schema({
	// Required Fields for GeoJSON
	type: {
		type: String,
		enum: ["Point"],
		required: true,
	},
	coordinates: {
		type: [Number],
		required: true,
	}
});

// Location Schema
const locationSchema = new Schema({
	// Location Schema Custom Fields
	locationType: { 
		type: String, 
		enum: Object.values(LocationType),
		required: true
	},
	description: {
		type: String,
		required: true
	},
	point: { 
		type: pointSchema, 
		index: { type: "2dsphere" }, 
		required: true 
	}
});

// Location Model
const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
