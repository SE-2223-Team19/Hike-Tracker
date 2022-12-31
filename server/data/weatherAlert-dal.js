const ObjectId = require("mongoose").Types.ObjectId;
const Hike = require("../models/hike-model");
const Image = require("../models/image-model");
const Location = require("../models/location-model");
const User = require("../models/user-model");
const WeatherAlert = require("../models/weatherAlert-model");




async function getWeatherAlertById(body) {
    const radiuskey = Object.keys(body)[1]
	const radiusValue =  body[radiuskey] 
	const coordinatesLatkey = Object.keys(body)[2]
	const coordinatesLatValue =  body[coordinatesLatkey]
    const coordinateLngkey = Object.keys(body)[3]
    const coordinateLngValue = body[coordinateLngkey]
    // const Mapchange = {
	// 	radius : radiusValue,
	// 	coordinatesLat : coordinatesLatValue,
    //     coordinateLngkey : coordinateLngValue
	// }
     
    //if(Mapchange.radius<= radiusValue){}
	const alert = await WeatherAlert.aggregate([
		{
			$match: {
				radius: new ObjectId(radiusValue),
                coordinatesLat : new ObjectId(coordinatesLatValue),
                coordinateLngkey : new ObjectId(coordinateLngValue)
			},
		},
		
	]);

	return alert;//[0];
}



async function updateWeatherAlert(body) {

	console.log("BODYinfo-DAL***********",body);

	const weatherkey = Object.keys(body)[0]
	const weatherValue =  body[weatherkey]
	const radiuskey = Object.keys(body)[1]
	const radiusValue =  body[radiuskey] 
	const coordinatesLatkey = Object.keys(body)[2]
	const coordinatesLatValue =  body[coordinatesLatkey]
    const coordinateLngkey = Object.keys(body)[3]
    const coordinateLngValue = body[coordinateLngkey]


	const weather ={
		weatherAlert : weatherValue
	}
	
	const Mapchange = new WeatherAlert({
        weatherAlert : weatherValue,
		radius : radiusValue,
		coordinates : [coordinatesLatValue,coordinateLngValue],
        
	})
	

	 
     const savedWeatherAlert = await Mapchange.save();

	 //const u = await WeatherAlert.findByIdAndUpdate(body, { new: true });
    console.log("DAL-Updatedinfo**********",savedWeatherAlert);
	return savedWeatherAlert  //await getWeatherAlertById(Mapchange)
}


module.exports={
    updateWeatherAlert,
    getWeatherAlertById
}