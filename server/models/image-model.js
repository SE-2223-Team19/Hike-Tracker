const mongoose = require("mongoose");
const { Schema } = mongoose;

// Image Schema
const imageSchema = new Schema(
	{
		data: { type: String, required: true }, // base64 encoded image data
	},
	{ timestamps: true }
);

// Image Model
const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
