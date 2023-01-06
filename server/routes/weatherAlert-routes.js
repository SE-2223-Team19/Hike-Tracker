const express = require("express");
const { isPlatformManager } = require("../authorization-middlewares");
const weatherAlertRouter = express.Router();
const weatherAlertController = require("../controllers/weatherAlert-controller")

weatherAlertRouter.patch("/area",isPlatformManager,weatherAlertController.updateWeatherAlert)


module.exports = weatherAlertRouter