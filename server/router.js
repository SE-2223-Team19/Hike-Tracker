const express = require("express");
const router = express.Router();
const hikeRoutes = require("./routes/hike-routes");
const sessionRoutes = require("./routes/session-routes");

router.use("/hike", hikeRoutes);
router.use("/session", sessionRoutes);
// router.use("/user", userRoutes);

module.exports = router;
