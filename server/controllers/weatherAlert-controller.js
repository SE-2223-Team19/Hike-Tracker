const joi = require("joi");
const ObjectId = require("mongoose").Types.ObjectId;
const { StatusCodes } = require("http-status-codes");
const weatherAlertDAL = require("../data/weatherAlert-dal");
const { WeatherCondition } = require("../models/enums");
const { object } = require("joi");




async function updateWeatherAlert(req, res) {

 
 try {
     
     const { body } = req;
     
     
	 const weatherkey = Object.keys(body)[0]
	 const weather =  body[weatherkey]
	 const radiuskey = Object.keys(body)[1]
	 const radius =  body[radiuskey] 
	 const coordinatesLatkey = Object.keys(body)[2]
	 const coordinates=  body[coordinatesLatkey]
	 
	 console.log("controller**************************",body);
     
	 
	//console.log("controller################",body);


     // Hike validation schema
     const schema = joi.object().keys({
         
         weatherAlert : joi.string().valid(...Object.values(WeatherCondition)),
         radius : joi.number(),
         coordinates : joi.array()
     });

     // Validate request body against schema
     const { error, value } = schema.validate(body);
     

     if (error) throw error; // Joi validation error, goes to catch block

     const WeatherUpdated = await weatherAlertDAL.updateWeatherAlert(value);
     console.log("UpdatedWeather*******controller",WeatherUpdated);

     return res.status(StatusCodes.OK).json(WeatherUpdated);
 } catch (err) {
     console.log(err);
     return res.status(StatusCodes.BAD_REQUEST).json({ err: err.message, stack: err.stack });
 }
}

module.exports = {
    updateWeatherAlert,
    
}