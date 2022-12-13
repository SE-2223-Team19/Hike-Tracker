const { object } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Difficulty, HikeCondition } = require("./enums");

const trackSchema = new Schema({
	type: {
		type: String,
		enum: ["LineString"],
		required: true,
	},
	coordinates: {
		type: [[Number]],
		required: true,
	},
});

// Hike Schema
const hikeSchema = new Schema(
	{
		title: String,
		length: Number,
		ascent: Number,
		expectedTime: Number, // in minutes
		difficulty: { type: String, enum: Object.values(Difficulty) }, // matches all enum values
		description: String,
		startPoint: { type: Schema.Types.ObjectId, ref: "Location", required: false },
		endPoint: { type: Schema.Types.ObjectId, ref: "Location", required: false },
		linkedHuts: [{ type: Schema.Types.ObjectId, ref: "Location", required: false }],
		referencePoints: [[Number]], // Array of positions on the track
		trackPoints: {
			type: trackSchema,
			index: "2dsphere",
		},
		createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
		hikeCondition: { type: String, enum: Object.values(HikeCondition) },
		thumbnail: { type: Schema.Types.ObjectId, ref: "Image", required: false },
		photos: [{ type: Schema.Types.ObjectId, ref: "Image", required: false }],
	},
	{ timestamps: true }
);

// Hike Model
const Hike = mongoose.model("Hike", hikeSchema);

module.exports = Hike;
