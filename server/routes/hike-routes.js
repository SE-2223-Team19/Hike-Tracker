const express = require("express");
const hikeRouter = express.Router();
const hikeController = require("../controllers/hike-controller");

hikeRouter.get("/", hikeController.getHikes);
hikeRouter.get("/:id", hikeController.getHikeById);
hikeRouter.post("/", hikeController.createHike);
hikeRouter.patch("/:id", hikeController.updateHike);
// hikeRouter.delete("/:id", hikeController.deleteHike);

module.exports = hikeRouter;
