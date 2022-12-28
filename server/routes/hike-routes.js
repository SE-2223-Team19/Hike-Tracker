const express = require("express");
const { isLocalGuide, isHutWorker, isPlatformManager } = require("../authorization-middlewares");
const hikeRouter = express.Router();
const hikeController = require("../controllers/hike-controller");

hikeRouter.patch("/weatherAlert",isPlatformManager,hikeController.updateWeatherAlert)
hikeRouter.patch("/:id/condition", isHutWorker, hikeController.updateHikeCondition);
hikeRouter.get("/:id", hikeController.getHikeById);
hikeRouter.post("/", isLocalGuide, hikeController.createHike);
 hikeRouter.patch("/:id", isLocalGuide, hikeController.updateHike);
hikeRouter.get("/", hikeController.getHikes);
hikeRouter.post("/", isLocalGuide, hikeController.createHike);
// hikeRouter.delete("/:id", hikeController.deleteHike);


module.exports = hikeRouter;
