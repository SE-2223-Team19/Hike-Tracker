const express = require("express");
const { isLoggedIn } = require("../authorization-middlewares");
const sessionRouter = express.Router();
const sessionController = require("../controllers/session-controller");

// sessionRouter.get("/", sessionController.getSessions);
// sessionRouter.get("/:id", sessionController.getSession);
sessionRouter.get("/current", isLoggedIn, sessionController.getSession);
sessionRouter.post("/", sessionController.createSession);
// sessionRouter.patch("/:id", sessionController.updateSession);
sessionRouter.delete("/current", isLoggedIn, sessionController.deleteSession);

module.exports = sessionRouter;
