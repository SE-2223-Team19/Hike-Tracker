const joi = require("joi");
const ObjectId = require("mongoose").Types.ObjectId;
const { StatusCodes } = require("http-status-codes");
const weatherAlertDAL = require("../data/weatherAlert-dal");
const { WeatherCondition } = require("../models/enums");
const { object } = require("joi");




async function updateWeatherAlert(req, res) {

 
 try {
     
     const { body } = req;
     
     
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

     return res.status(StatusCodes.OK).json(WeatherUpdated);
 } catch (err) {
    
     return res.status(StatusCodes.BAD_REQUEST).json({ err: err.message, stack: err.stack });
 }
}

module.exports = {
    updateWeatherAlert,
    
}