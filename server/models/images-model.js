const mongoose = require("mongoose");
const { Schema } = mongoose;

// Image Schema
const imageSchema = new Schema(
	{
		data: { type: BinData, required: true },
	},
	{ timestamps: true }
);

// Image Model
const HikeTrackerImage = mongoose.model("HikeTrackerImage", imageSchema);

module.exports = HikeTrackerImage;
