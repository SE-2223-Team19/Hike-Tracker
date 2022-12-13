const express = require("express");
const imageRouter = express.Router();

imageRouter.get("/thumbnail/:id", imageController.getThumbnail); // Get thumbnail for a hike, hut, or parking lot (presentation image)
imageRouter.get("photos/:id", imageController.getPhotos); // Get photos for a hike, hut, or parking lot
