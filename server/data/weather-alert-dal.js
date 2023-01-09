const ObjectId = require("mongoose").Types.ObjectId;
const { db } = require("../models/hike-model");
const Hike = require("../models/hike-model");
const Image = require("../models/image-model");
const Location = require("../models/location-model");
const User = require("../models/user-model");
const WeatherAlert = require("../models/weather-alert-model");



async function getcoordinateHikes(coordinates, maxDistance){
	
	 const HikeWeather= await Hike.aggregate([
		{
			$geoNear: {
				near: {
					type: "Point",
					coordinates: [ coordinates[1], coordinates[0] ],
				},
				distanceField: "distance",
				maxDistance: maxDistance,
				spherical: true,
   			}
		}
	]);
	return HikeWeather;
}

async function updateWeatherAlert(weatherValue, radiusValue, coordinates){

	const Mapchange = new WeatherAlert({
        weatherAlert : weatherValue,
		radius : radiusValue,
		coordinates : coordinates,
        
	})
    const hikes = await getcoordinateHikes(coordinates, radiusValue);

	await Promise.all(hikes.map(hike => {
		return Hike.findByIdAndUpdate(hike._id, {
			weather: [
				weatherValue
			]
		});
	}));
	const savedweather = await Mapchange.save();
	return savedweather;
}



module.exports={
    updateWeatherAlert,
    
}