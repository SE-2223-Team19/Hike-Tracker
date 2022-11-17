const express = require("express");
const multer = require("multer");
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const mimeTypes = [ "application/gpx+xml", "application/octet-stream" ];
        if (mimeTypes.includes(file.mimetype))
            return cb(null, true);
        return cb(new Error("Wrong mime type"));
    }
});
const hikeRouter = express.Router();
const hikeController = require("../controllers/hike-controller");
hikeRouter.get("/", hikeController.getHikes);
// hikeRouter.get("/:id", hikeController.getHike);
hikeRouter.post("/", upload.single("gpxFile"), hikeController.createHike);
hikeRouter.patch("/:id", hikeController.updateHike);
// hikeRouter.delete("/:id", hikeController.deleteHike);
module.exports = hikeRouter;
