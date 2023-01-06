const express = require("express");
const locationRouter = express.Router();
const locationController = require("../controllers/location-controller");
const { isHutWorker, isLocalGuide } = require("../authorization-middlewares");

locationRouter.get("/", locationController.getLocations);
locationRouter.get("/:id", locationController.getLocationById);
locationRouter.put("/:id", locationController.updateLocationDescription);
locationRouter.post("/", isLocalGuide, locationController.createLocation);
locationRouter.patch("/:id", isHutWorker, locationController.updateLocation);
locationRouter.patch("/hut-picture/:id", isHutWorker, locationController.uploadHutPicture);

module.exports = locationRouter;
