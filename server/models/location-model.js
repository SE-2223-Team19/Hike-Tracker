const mongoose = require("mongoose");
const { Schema } = mongoose;
const { LocationType } = require("./enums");

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
		type: [Number], 
		index: "2dsphere", 
		required: true 
	}
}, {
	discriminatorKey: "locationType"
});

// Location Model
const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
