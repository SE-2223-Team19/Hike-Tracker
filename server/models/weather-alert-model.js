const mongoose = require("mongoose");
const { Schema } = mongoose;
const { WeatherCondition } = require("./enums");

// WeatherAlert Schema
const WeatherSchema = new Schema(
	{
		weatherAlert: [{ type: String, enum: Object.values(WeatherCondition)}],
		radius : Number,
		coordinates : {
			type: [Number],
			index: "2dsphere",
		},
	},
	{ timestamps: true }
);

// Hike Model
const WeatherAlert = mongoose.model("WeatherAlert", WeatherSchema);

module.exports = WeatherAlert;
