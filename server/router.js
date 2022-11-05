const express = require("express");
const router = express.Router();
const hikeRoutes = require("./routes/hike-routes");

router.use("/hike", hikeRoutes);
// router.use("/user", userRoutes);

module.exports = router;
