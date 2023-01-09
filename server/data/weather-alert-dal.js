const ObjectId = require("mongoose").Types.ObjectId;
const { db } = require("../models/hike-model");
const Hike = require("../models/hike-model");
const Image = require("../models/image-model");
const Location = require("../models/location-model");
const User = require("../models/user-model");
const WeatherAlert = require("../models/weather-alert-model");



async function getcoordinateHikes(coordinates){
	
	 const HikeWeather= await Hike.aggregate([{$geoNear: {
		near: {
			coordinates: [ coordinates[1], coordinates[0] ],
		}
		,distanceField: "dist.calculated"
		 
   }},{ $project : { trackPoints:1 }}

   
])
return HikeWeather
}

async function updateWeatherAlert(weatherValue,radiusValue,coordinates){

	const Mapchange = new WeatherAlert({
        weatherAlert : weatherValue,
		radius : radiusValue,
		coordinates : coordinates,
        
	})
    const HikeTrackPoint=await getcoordinateHikes(coordinates);
   	let result =[];
   	HikeTrackPoint.forEach(Trackpoint => { 
	let elemts= {
		_id: Trackpoint._id,
		coordinatesLat: parseFloat(Trackpoint.trackPoints.coordinates[0][1]),
		coordinatesLng: parseFloat(Trackpoint.trackPoints.coordinates[0][0])

	} 
    const nearcorrdinateWeatherAlertLat=parseFloat(coordinates[0])
    const nearcorrdinateWeatherAlertLng=parseFloat(coordinates[1])
	if(elemts.coordinatesLat==nearcorrdinateWeatherAlertLat && elemts.coordinatesLng==nearcorrdinateWeatherAlertLng){
		result.push(elemts._id);
		}	
	}); 
   if(result.length === 0){
	const savedweather= await Mapchange.save()
	return savedweather
	}else{
		result.forEach(async id=>{
			     await Hike.updateMany({  _id: id},
				{$set: {weather: weatherValue}});
			});	
    return Mapchange
	}	
}



module.exports={
    updateWeatherAlert,
    
}