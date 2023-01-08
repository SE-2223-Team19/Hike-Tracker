const express = require("express");
const registeredHikeRouter = express.Router();
const { isHiker } = require("../authorization-middlewares");
const registeredHikeController = require("../controllers/registered-hike-controller");

registeredHikeRouter.post("/start/:id", isHiker, registeredHikeController.startHike); // Create the new entity in the database
registeredHikeRouter.post("/plan/:id", isHiker, registeredHikeController.planHike); // Create the new entity in the database
registeredHikeRouter.patch("/end/:id", isHiker, registeredHikeController.endHike); // Update the entity in the database
registeredHikeRouter.get("/stats/:id", isHiker, registeredHikeController.getStats); // Get the stats of the hike
registeredHikeRouter.patch("/startplan/:id", isHiker, registeredHikeController.startPlannedHike); // Update the entity in the database

registeredHikeRouter.get("/:userId", isHiker, registeredHikeController.getRegisteredHikes);
registeredHikeRouter.patch("/point/:id", isHiker, registeredHikeController.addRecordPoint);
registeredHikeRouter.patch("/update/:id", isHiker, registeredHikeController.updateRegisteredHike);

module.exports = registeredHikeRouter;
