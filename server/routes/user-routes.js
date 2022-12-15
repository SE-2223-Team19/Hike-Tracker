const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user-controller");
const { isHiker } = require("../authorization-middlewares");

userRouter.post("/", userController.createUser);
userRouter.post("/verify/:uniqueString", userController.verifyUser);
userRouter.get("/", userController.getUsers);
userRouter.get("/preferences", isHiker, userController.getPreferences);
userRouter.patch("/preferences", isHiker, userController.updatePreferences);
userRouter.delete("/preferences", isHiker, userController.deletePreferences);
userRouter.patch("/:id", userController.updateUser);

module.exports = userRouter;
