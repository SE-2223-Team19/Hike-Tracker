const { object, number } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { WeatherCondition } = require("./enums");



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

// WeatherAlert Schema
const WeatherSchema = new Schema(
	{
		 weatherAlert: [{ type: String, enum: Object.values(WeatherCondition)}],
		 radius : Number,
         coordinates : [Number] ,
		
	},
	{ timestamps: true }
);

// Hike Model
const WeatherAlert = mongoose.model("WeatherAlert", WeatherSchema);

module.exports = WeatherAlert;
