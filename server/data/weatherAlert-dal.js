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
		coordinates: parseInt(Trackpoint.trackPoints.coordinates[0][1])
	} 
    const nearcorrdinateWeatherAlert=parseInt(coordinates[0])
	if(elemts.coordinates==nearcorrdinateWeatherAlert){
		result.push(elemts._id);
		}	
	}); 
			   console.log("iiiidddddddddd#######",result);
            
   if(result.length === 0){

	console.log("ssssaaaaveeeeee######");
	const savedweather= await Mapchange.save()
	return savedweather
	
	}else{
		result.forEach(async id=>{
			const updatedweather=  await Hike.updateMany({  _id: id},
				{$set: {weather: weatherValue}});
			});	
			let t = await Hike.findById(result[0])	
			 console.log("updateeeepaaaart######",t);
			 return "update has done" 
	}	
}



module.exports={
    updateWeatherAlert,
    
}