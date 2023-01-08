const ObjectId = require("mongoose").Types.ObjectId;
const { db } = require("../models/hike-model");
const Hike = require("../models/hike-model");
const Image = require("../models/image-model");
const Location = require("../models/location-model");
const User = require("../models/user-model");
const WeatherAlert = require("../models/weatherAlert-model");



async function getcoordinateHikes(coordinates){
	
	 const HikeWeather= await Hike.aggregate([{$geoNear: {
		near: {
			coordinates: coordinates,
		}
		,distanceField: "dist.calculated"
		 
   }},{ $project : { trackPoints:1 }}

   
])
return HikeWeather
}

async function updateWeatherAlert(body){

	const weatherkey = Object.keys(body)[0]
	const weatherValue =  body[weatherkey]
	const radiuskey = Object.keys(body)[1]
	const radiusValue =  body[radiuskey] 
	const coordinateskey = Object.keys(body)[2]
	const coordinates =  body[coordinateskey]
	const Mapchange = new WeatherAlert({
        weatherAlert : weatherValue,
		radius : radiusValue,
		coordinates : coordinates,
        
	})

    const HikeTrackPoint=await getcoordinateHikes(coordinates)
   let result =[];
   HikeTrackPoint.forEach(Trackpoint => { 
	let elemts= {
		_id: Trackpoint._id,
		coordinatesLat: parseInt(Trackpoint.trackPoints.coordinates[0][1]),
		coordinatesLng: parseInt(Trackpoint.trackPoints.coordinates[0][0])

	} 
    const nearcorrdinateWeatherAlertLat=parseInt(coordinates[0])
    const nearcorrdinateWeatherAlertLng=parseInt(coordinates[1])
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