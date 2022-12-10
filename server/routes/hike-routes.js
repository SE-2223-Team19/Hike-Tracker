const express = require("express");
const { isLocalGuide, isHutWorker } = require("../authorization-middlewares");
const hikeRouter = express.Router();
const hikeController = require("../controllers/hike-controller");

 hikeRouter.get("/", hikeController.getHikes);
 hikeRouter.get("/:id", hikeController.getHikeById);
 hikeRouter.post("/",isHutWorker, hikeController.createHike);
 hikeRouter.patch("/:id", isHutWorker, hikeController.updateHike);
// hikeRouter.delete("/:id", hikeController.deleteHike);

module.exports = hikeRouter;
