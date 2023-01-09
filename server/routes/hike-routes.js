const express = require("express");
const { isLocalGuide, isHutWorker } = require("../authorization-middlewares");
const hikeRouter = express.Router();
const hikeController = require("../controllers/hike-controller");

hikeRouter.get("/", hikeController.getHikes);
hikeRouter.get("/:id", hikeController.getHikeById);
hikeRouter.post("/", isLocalGuide, hikeController.createHike);
hikeRouter.patch("/:id", isLocalGuide, hikeController.updateHike);
hikeRouter.patch("/:id/condition", isHutWorker, hikeController.updateHikeCondition);
hikeRouter.delete("/:id", hikeController.deleteHike);

module.exports = hikeRouter;
