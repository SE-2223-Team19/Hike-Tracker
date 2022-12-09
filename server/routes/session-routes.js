const express = require("express");
const { isLoggedIn } = require("../authorization-middlewares");
const sessionRouter = express.Router();
const sessionController = require("../controllers/session-controller");

sessionRouter.get("/current", isLoggedIn, sessionController.getSession);
sessionRouter.post("/", sessionController.createSession);
sessionRouter.delete("/current", isLoggedIn, sessionController.deleteSession);

module.exports = sessionRouter;
