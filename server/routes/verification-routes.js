const express = require("express");
const verificationRouter = express.Router();
const verificationController = require("..controllers/verification-controller");

verificationRouter.get("/:uniqueString", verificationController.verifyUser);

module.exports = verificationRouter;
