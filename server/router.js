const express = require("express");
const router = express.Router();
const hikeRoutes = require("./routes/hike-routes");
const userRoutes = require("./routes/user-routes");
const sessionRoutes = require("./routes/session-routes");
const locationRoutes = require("./routes/location-routes");
const registeredHikeRoutes = require("./routes/registered-hike-routes");

router.use("/hike", hikeRoutes);
router.use("/user", userRoutes);
router.use("/session", sessionRoutes);
router.use("/location", locationRoutes);
router.use("/registered-hike", registeredHikeRoutes);

module.exports = router;
