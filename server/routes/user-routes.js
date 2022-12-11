const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user-controller");
const { isHiker } = require("../authorization-middlewares");

userRouter.get("/", userController.getUsers);
userRouter.post("/", userController.createUser);
userRouter.post("/verify/:uniqueString", userController.verifyUser);
userRouter.patch("/:id", userController.updateUser);
userRouter.get("/preferences", userController.getPreferences);
userRouter.patch("/preferences", userController.updatePreferences);
userRouter.delete("/preferences", userController.deletePreferences);
// userRouter.patch("/:id", userController.updateUser);
// userRouter.delete("/:id", userController.deleteUser);

module.exports = userRouter;
