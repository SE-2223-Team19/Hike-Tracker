const express = require("express");
const locationRouter = express.Router();
const locationController = require("../controllers/location-controller");
const { isHutWorker, isLocalGuide } = require("../authorization-middlewares");

locationRouter.get("/", locationController.getLocations);
// locationRouter.get("/:id", locationController.getLocation);
locationRouter.post("/", isLocalGuide, locationController.createLocation);
// locationRouter.patch("/:id", locationController.updateLocation);
// locationRouter.delete("/:id", locationController.deleteLocation);

module.exports = locationRouter;
