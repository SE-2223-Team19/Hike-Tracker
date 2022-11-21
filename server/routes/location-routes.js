const express = require("express");
const locationRouter = express.Router();
const locationController = require("../controllers/location-controller");

locationRouter.get("/", locationController.getLocations);
locationRouter.get("/huts", locationController.getHuts);
// locationRouter.get("/:id", locationController.getLocation);
locationRouter.post("/", locationController.createLocation);
// locationRouter.patch("/:id", locationController.updateLocation);
// locationRouter.delete("/:id", locationController.deleteLocation);

module.exports = locationRouter;
