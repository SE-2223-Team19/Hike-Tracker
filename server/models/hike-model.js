const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Difficulty } = require("./enums");

// Hike Schema
const hikeSchema = new Schema(
	{
		title: String,
		length: Number,
		ascent: Number,
		expectedTime: Number, // in minutes
		difficulty: { type: String, enum: Object.values(Difficulty) }, // matches all enum values
		description: String,
		startPoint: { type: Schema.Types.ObjectId, ref: "Location", required: true },
		endPoint: { type: Schema.Types.ObjectId, ref: "Location", required: true },
		referencePoints: { type: [Schema.Types.ObjectId], ref: "Location", required: true },
		trackPoints: [[Number]]
	},
	{ timestamps: true }
);

// Hike Model
const Hike = mongoose.model("Hike", hikeSchema);

module.exports = Hike;
