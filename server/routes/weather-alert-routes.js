const express = require("express");
const { isPlatformManager } = require("../authorization-middlewares");
const weatherAlertRouter = express.Router();
const weatherAlertController = require("../controllers/weather-alert-controller");

weatherAlertRouter.patch("/area", isPlatformManager, weatherAlertController.updateWeatherAlert);
//weatherAlertRouter.patch("/hikeweather",isPlatformManager,weatherAlertController)
//weatherAlertRouter.get("weatherAlert/:id",weatherAlertController.getWeatherAlert)


module.exports = weatherAlertRouter;